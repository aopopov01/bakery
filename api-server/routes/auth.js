// Authentication Routes
const express = require('express');
const { sanitizeInput } = require('../config/security');
const router = express.Router();

class AuthRoutes {
  constructor(db, authManager, rateLimiters) {
    this.db = db;
    this.auth = authManager;
    this.rateLimiters = rateLimiters;
    this.setupRoutes();
  }

  setupRoutes() {
    // User registration
    router.post('/register', 
      this.rateLimiters.auth,
      this.auth.validateRegistration(),
      this.auth.handleValidationErrors,
      this.register.bind(this)
    );

    // User login
    router.post('/login',
      this.rateLimiters.auth,
      this.auth.validateLogin(),
      this.auth.handleValidationErrors,
      this.login.bind(this)
    );

    // Refresh token
    router.post('/refresh',
      this.rateLimiters.general,
      this.refreshToken.bind(this)
    );

    // Logout
    router.post('/logout',
      this.auth.authenticate(),
      this.logout.bind(this)
    );

    // Get current user profile
    router.get('/profile',
      this.auth.authenticate(),
      this.getProfile.bind(this)
    );

    // Update user profile
    router.put('/profile',
      this.auth.authenticate(),
      this.updateProfile.bind(this)
    );

    // Change password
    router.put('/password',
      this.auth.authenticate(),
      this.changePassword.bind(this)
    );
  }

  // User registration handler
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Sanitize inputs
      const cleanEmail = sanitizeInput.cleanEmail(email);
      const cleanFirstName = sanitizeInput.cleanString(firstName);
      const cleanLastName = sanitizeInput.cleanString(lastName);
      const cleanPhone = phone ? sanitizeInput.cleanString(phone) : null;

      // Check if user already exists
      const existingUser = await this.db.getQuery(
        'SELECT id FROM users WHERE email = ?',
        [cleanEmail]
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Потребител с този имейл вече съществува',
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }

      // Hash password
      const hashedPassword = await this.auth.hashPassword(password);

      // Create user
      const result = await this.db.runQuery(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cleanEmail, hashedPassword, cleanFirstName, cleanLastName, cleanPhone, 0]
      );

      // Get created user
      const newUser = await this.db.getQuery(
        'SELECT id, email, first_name, last_name, phone, role, loyalty_points, loyalty_tier FROM users WHERE id = ?',
        [result.id]
      );

      // Generate tokens
      const token = this.auth.generateToken({ 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      });

      const refreshToken = this.auth.generateRefreshToken({ 
        userId: newUser.id 
      });

      // Log security event
      await this.auth.logSecurityEvent(
        newUser.id, 
        'user_registration', 
        req.ip, 
        req.get('User-Agent'), 
        true
      );

      res.status(201).json({
        success: true,
        message: 'Регистрацията е успешна',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            phone: newUser.phone,
            role: newUser.role,
            loyaltyPoints: newUser.loyalty_points,
            loyaltyTier: newUser.loyalty_tier
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при регистрация',
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  // User login handler
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const cleanEmail = sanitizeInput.cleanEmail(email);

      // Get user from database
      const user = await this.db.getQuery(
        'SELECT id, email, password_hash, first_name, last_name, phone, role, is_active, loyalty_points, loyalty_tier, total_spent FROM users WHERE email = ?',
        [cleanEmail]
      );

      if (!user) {
        // Log failed attempt
        await this.auth.logSecurityEvent(
          null, 
          'failed_login_attempt', 
          req.ip, 
          req.get('User-Agent'), 
          false,
          { email: cleanEmail, reason: 'user_not_found' }
        );

        return res.status(401).json({
          success: false,
          error: 'Невалиден имейл или парола',
          code: 'INVALID_CREDENTIALS'
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          error: 'Акаунтът е деактивиран',
          code: 'ACCOUNT_DISABLED'
        });
      }

      // Check if account is locked
      if (await this.auth.isAccountLocked(user.id)) {
        return res.status(423).json({
          success: false,
          error: 'Акаунтът е временно заключен поради твърде много неуспешни опити за вход',
          code: 'ACCOUNT_LOCKED'
        });
      }

      // Verify password
      const isPasswordValid = await this.auth.comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        const lockInfo = await this.auth.handleFailedLogin(
          user.id, 
          req.ip, 
          req.get('User-Agent')
        );

        let errorMessage = 'Невалиден имейл или парола';
        if (lockInfo.locked) {
          errorMessage = 'Твърде много неуспешни опити. Акаунтът е заключен за 15 минути.';
        }

        return res.status(401).json({
          success: false,
          error: errorMessage,
          code: lockInfo.locked ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS'
        });
      }

      // Handle successful login
      await this.auth.handleSuccessfulLogin(user.id, req.ip, req.get('User-Agent'));

      // Generate tokens
      const token = this.auth.generateToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });

      const refreshToken = this.auth.generateRefreshToken({ 
        userId: user.id 
      });

      res.json({
        success: true,
        message: 'Успешен вход',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            role: user.role,
            loyaltyPoints: user.loyalty_points,
            loyaltyTier: user.loyalty_tier,
            totalSpent: user.total_spent
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при вход',
        code: 'LOGIN_ERROR'
      });
    }
  }

  // Refresh token handler
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Нужен е refresh token',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      const decoded = this.auth.verifyToken(refreshToken);
      
      // Get user
      const user = await this.db.getQuery(
        'SELECT id, email, role, is_active FROM users WHERE id = ? AND is_active = 1',
        [decoded.userId]
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Невалиден refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Generate new tokens
      const newToken = this.auth.generateToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });

      const newRefreshToken = this.auth.generateRefreshToken({ 
        userId: user.id 
      });

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: 'Невалиден refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
  }

  // Logout handler
  async logout(req, res) {
    try {
      // Log security event
      await this.auth.logSecurityEvent(
        req.user.id, 
        'user_logout', 
        req.ip, 
        req.get('User-Agent'), 
        true
      );

      res.json({
        success: true,
        message: 'Успешен изход'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при изход'
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await this.db.getQuery(
        `SELECT id, email, first_name, last_name, phone, address, birth_date, 
                loyalty_points, loyalty_tier, total_spent, order_count, created_at 
         FROM users WHERE id = ?`,
        [req.user.id]
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Потребителят не е намерен'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          address: user.address,
          birthDate: user.birth_date,
          loyaltyPoints: user.loyalty_points,
          loyaltyTier: user.loyalty_tier,
          totalSpent: user.total_spent,
          orderCount: user.order_count,
          memberSince: user.created_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при зареждане на профила'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone, address, birthDate } = req.body;

      // Sanitize inputs
      const cleanFirstName = sanitizeInput.cleanString(firstName);
      const cleanLastName = sanitizeInput.cleanString(lastName);
      const cleanPhone = phone ? sanitizeInput.cleanString(phone) : null;
      const cleanAddress = address ? sanitizeInput.cleanString(address) : null;

      await this.db.runQuery(
        `UPDATE users SET 
         first_name = ?, last_name = ?, phone = ?, address = ?, birth_date = ?, 
         updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [cleanFirstName, cleanLastName, cleanPhone, cleanAddress, birthDate, req.user.id]
      );

      res.json({
        success: true,
        message: 'Профилът е актуализиран успешно'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при актуализиране на профила'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get current password hash
      const user = await this.db.getQuery(
        'SELECT password_hash FROM users WHERE id = ?',
        [req.user.id]
      );

      // Verify current password
      const isCurrentPasswordValid = await this.auth.comparePassword(currentPassword, user.password_hash);

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Текущата парола е грешна'
        });
      }

      // Hash new password
      const hashedNewPassword = await this.auth.hashPassword(newPassword);

      // Update password
      await this.db.runQuery(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedNewPassword, req.user.id]
      );

      // Log security event
      await this.auth.logSecurityEvent(
        req.user.id, 
        'password_change', 
        req.ip, 
        req.get('User-Agent'), 
        true
      );

      res.json({
        success: true,
        message: 'Паролата е променена успешно'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Грешка при смяна на паролата'
      });
    }
  }

  getRouter() {
    return router;
  }
}

module.exports = AuthRoutes;