// JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

class AuthManager {
  constructor(db) {
    this.db = db;
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.maxFailedAttempts = 5;
    this.lockTime = 15 * 60 * 1000; // 15 minutes
  }

  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: this.jwtExpiresIn,
      issuer: 'tortomaniya-api',
      audience: 'tortomaniya-client'
    });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      issuer: 'tortomaniya-api',
      audience: 'tortomaniya-client'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'tortomaniya-api',
        audience: 'tortomaniya-client'
      });
    } catch (error) {
      throw new Error('Невалиден токен');
    }
  }

  // Hash password
  async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Check if account is locked
  async isAccountLocked(userId) {
    const user = await this.db.getQuery(
      'SELECT locked_until FROM users WHERE id = ?',
      [userId]
    );
    
    if (user && user.locked_until) {
      const lockTime = new Date(user.locked_until);
      if (lockTime > new Date()) {
        return true;
      } else {
        // Lock expired, clear it
        await this.db.runQuery(
          'UPDATE users SET locked_until = NULL, failed_login_attempts = 0 WHERE id = ?',
          [userId]
        );
      }
    }
    
    return false;
  }

  // Handle failed login attempt
  async handleFailedLogin(userId, ipAddress, userAgent) {
    const user = await this.db.getQuery(
      'SELECT failed_login_attempts FROM users WHERE id = ?',
      [userId]
    );

    if (user) {
      const attempts = user.failed_login_attempts + 1;
      let lockUntil = null;

      if (attempts >= this.maxFailedAttempts) {
        lockUntil = new Date(Date.now() + this.lockTime);
      }

      await this.db.runQuery(
        'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
        [attempts, lockUntil, userId]
      );

      // Log security event
      await this.logSecurityEvent(userId, 'failed_login', ipAddress, userAgent, false, {
        attempts,
        locked: !!lockUntil
      });

      return { attempts, locked: !!lockUntil, lockUntil };
    }

    return { attempts: 0, locked: false };
  }

  // Handle successful login
  async handleSuccessfulLogin(userId, ipAddress, userAgent) {
    await this.db.runQuery(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );

    // Log security event
    await this.logSecurityEvent(userId, 'successful_login', ipAddress, userAgent, true);
  }

  // Log security events
  async logSecurityEvent(userId, action, ipAddress, userAgent, success, details = {}) {
    try {
      await this.db.runQuery(
        'INSERT INTO security_logs (user_id, action, ip_address, user_agent, success, details) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, action, ipAddress, userAgent, success, JSON.stringify(details)]
      );
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Authentication middleware
  authenticate() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Нужна е автентикация',
            code: 'AUTHENTICATION_REQUIRED'
          });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = this.verifyToken(token);

        // Get user from database
        const user = await this.db.getQuery(
          'SELECT id, email, first_name, last_name, role, is_active, email_verified FROM users WHERE id = ? AND is_active = 1',
          [decoded.userId]
        );

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Потребителят не съществува или е деактивиран',
            code: 'USER_NOT_FOUND'
          });
        }

        // Check if account is locked
        if (await this.isAccountLocked(user.id)) {
          return res.status(423).json({
            success: false,
            error: 'Акаунтът е временно заключен поради твърде много неуспешни опити за вход',
            code: 'ACCOUNT_LOCKED'
          });
        }

        // Add user to request object
        req.user = user;
        req.token = decoded;
        
        next();
      } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            success: false,
            error: 'Невалиден токен',
            code: 'INVALID_TOKEN'
          });
        }
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: 'Токенът е изтекъл',
            code: 'TOKEN_EXPIRED'
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Грешка при автентикация',
          code: 'AUTHENTICATION_ERROR'
        });
      }
    };
  }

  // Authorization middleware
  authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Нужна е автентикация',
          code: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Нямате достъп до този ресурс',
          code: 'INSUFFICIENT_PRIVILEGES'
        });
      }

      next();
    };
  }

  // Input validation for registration
  validateRegistration() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Невалиден имейл адрес'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Паролата трябва да е поне 8 символа')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Паролата трябва да съдържа поне една малка буква, една главна буква, една цифра и един специален символ'),
      body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Името трябва да е между 2 и 50 символа'),
      body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Фамилията трябва да е между 2 и 50 символа'),
      body('phone')
        .optional()
        .matches(/^(\+359|0)[0-9]{8,9}$/)
        .withMessage('Невалиден телефонен номер')
    ];
  }

  // Input validation for login
  validateLogin() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Невалиден имейл адрес'),
      body('password')
        .notEmpty()
        .withMessage('Паролата е задължителна')
    ];
  }

  // Handle validation errors
  handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Невалидни данни',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
}

module.exports = AuthManager;