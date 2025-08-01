// Secure API Server for ТортоМания Bakery Platform
require('dotenv').config();
const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');

// Import security configurations
const { setupSecurityMiddleware, rateLimiters } = require('./config/security');
const DatabaseManager = require('./config/database-memory');
const AuthManager = require('./middleware/auth');
const AuthRoutes = require('./routes/auth');

class SecureAPIServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3002;
    this.db = new DatabaseManager();
    this.authManager = null;
    this.logger = this.setupLogger();
  }

  // Setup Winston logger
  setupLogger() {
    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'tortomaniya-api' },
      transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  // Setup middleware
  setupMiddleware() {
    // Security middleware (CORS, Helmet, etc.)
    setupSecurityMiddleware(this.app);

    // Request logging
    this.app.use(expressWinston.logger({
      winstonInstance: this.logger,
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorize: false,
      ignoreRoute: function (req, res) { 
        return req.url === '/health' || req.url === '/api/health';
      }
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Error logging
    this.app.use(expressWinston.errorLogger({
      winstonInstance: this.logger
    }));

    this.logger.info('🛡️ Security middleware configured');
  }

  // Setup API routes
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'ТортоМания Secure API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'ТортоМания Secure API',
        version: '1.0.0',
        description: 'Secure REST API for ТортоМания Bakery Platform',
        endpoints: {
          auth: {
            'POST /api/auth/register': 'User registration',
            'POST /api/auth/login': 'User login',
            'POST /api/auth/refresh': 'Refresh token',
            'POST /api/auth/logout': 'User logout',
            'GET /api/auth/profile': 'Get user profile',
            'PUT /api/auth/profile': 'Update user profile',
            'PUT /api/auth/password': 'Change password'
          },
          products: {
            'GET /api/products': 'List products',
            'GET /api/products/:id': 'Get product details'
          },
          orders: {
            'POST /api/orders': 'Create order',
            'GET /api/orders': 'List user orders',
            'GET /api/orders/:id': 'Get order details'
          }
        },
        security: {
          authentication: 'JWT Bearer token',
          rateLimit: 'Configured per endpoint',
          validation: 'Input validation and sanitization',
          logging: 'Comprehensive security logging'
        }
      });
    });

    // Authentication routes
    const authRoutes = new AuthRoutes(this.db, this.authManager, rateLimiters);
    this.app.use('/api/auth', authRoutes.getRouter());

    // Products routes (public, read-only)
    this.setupProductRoutes();

    // Orders routes (authenticated)
    this.setupOrderRoutes();

    // Admin routes (admin only)
    this.setupAdminRoutes();

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ресурсът не е намерен',
        code: 'NOT_FOUND'
      });
    });

    this.logger.info('🛣️ API routes configured');
  }

  // Setup product routes
  setupProductRoutes() {
    const router = express.Router();

    // Get all products
    router.get('/', rateLimiters.products, async (req, res) => {
      try {
        const { category, active = '1' } = req.query;
        let query = 'SELECT id, name_bg, name_en, description_bg, price, category, image_url, stock_quantity FROM products WHERE is_active = ?';
        const params = [active === '1' ? 1 : 0];

        if (category) {
          query += ' AND category = ?';
          params.push(category);
        }

        query += ' ORDER BY name_bg';

        const products = await this.db.allQuery(query, params);

        res.json({
          success: true,
          data: products.map(product => ({
            id: product.id,
            name: {
              bg: product.name_bg,
              en: product.name_en
            },
            description: product.description_bg,
            price: product.price,
            category: product.category,
            imageUrl: product.image_url,
            inStock: product.stock_quantity > 0
          }))
        });
      } catch (error) {
        this.logger.error('Get products error:', error);
        res.status(500).json({
          success: false,
          error: 'Грешка при зареждане на продуктите'
        });
      }
    });

    // Get product by ID
    router.get('/:id', rateLimiters.products, async (req, res) => {
      try {
        const product = await this.db.getQuery(
          'SELECT * FROM products WHERE id = ? AND is_active = 1',
          [req.params.id]
        );

        if (!product) {
          return res.status(404).json({
            success: false,
            error: 'Продуктът не е намерен'
          });
        }

        res.json({
          success: true,
          data: {
            id: product.id,
            name: {
              bg: product.name_bg,
              en: product.name_en
            },
            description: product.description_bg,
            price: product.price,
            category: product.category,
            imageUrl: product.image_url,
            stockQuantity: product.stock_quantity,
            inStock: product.stock_quantity > 0
          }
        });
      } catch (error) {
        this.logger.error('Get product error:', error);
        res.status(500).json({
          success: false,
          error: 'Грешка при зареждане на продукта'
        });
      }
    });

    this.app.use('/api/products', router);
  }

  // Setup order routes
  setupOrderRoutes() {
    const router = express.Router();

    // Create new order
    router.post('/', 
      rateLimiters.orders,
      this.authManager.authenticate(),
      async (req, res) => {
        try {
          const { items, delivery, payment, notes } = req.body;

          // Validate order data
          if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
              success: false,
              error: 'Поръчката трябва да съдържа поне един продукт'
            });
          }

          // Calculate totals and validate products
          let subtotal = 0;
          const orderItems = [];

          for (const item of items) {
            const product = await this.db.getQuery(
              'SELECT id, name_bg, price, stock_quantity FROM products WHERE id = ? AND is_active = 1',
              [item.productId]
            );

            if (!product) {
              return res.status(400).json({
                success: false,
                error: `Продукт с ID ${item.productId} не съществува`
              });
            }

            if (product.stock_quantity < item.quantity) {
              return res.status(400).json({
                success: false,
                error: `Няма достатъчно количество от продукт ${product.name_bg}`
              });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
              productId: product.id,
              productName: product.name_bg,
              quantity: item.quantity,
              price: product.price,
              total: itemTotal
            });
          }

          const deliveryFee = delivery.type === 'delivery' ? 3.00 : 0;
          const total = subtotal + deliveryFee;

          // Generate order number
          const orderNumber = this.generateOrderNumber();

          // Create order
          const orderResult = await this.db.runQuery(
            `INSERT INTO orders (
              order_number, user_id, customer_name, customer_email, customer_phone,
              delivery_type, delivery_address, payment_method, subtotal, delivery_fee, 
              total, notes, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderNumber,
              req.user.id,
              `${req.user.first_name} ${req.user.last_name}`,
              req.user.email,
              req.user.phone || '',
              delivery.type,
              delivery.address || '',
              payment.method,
              subtotal,
              deliveryFee,
              total,
              notes || '',
              'pending'
            ]
          );

          // Add order items
          for (const item of orderItems) {
            await this.db.runQuery(
              'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)',
              [orderResult.id, item.productId, item.productName, item.quantity, item.price, item.total]
            );

            // Update product stock
            await this.db.runQuery(
              'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
              [item.quantity, item.productId]
            );
          }

          // Update user loyalty points
          const loyaltyPoints = Math.floor(total);
          await this.db.runQuery(
            'UPDATE users SET loyalty_points = loyalty_points + ?, total_spent = total_spent + ?, order_count = order_count + 1 WHERE id = ?',
            [loyaltyPoints, total, req.user.id]
          );

          res.status(201).json({
            success: true,
            message: 'Поръчката е създадена успешно',
            data: {
              orderId: orderResult.id,
              orderNumber,
              total,
              loyaltyPointsEarned: loyaltyPoints
            }
          });

        } catch (error) {
          this.logger.error('Create order error:', error);
          res.status(500).json({
            success: false,
            error: 'Грешка при създаване на поръчката'
          });
        }
      }
    );

    this.app.use('/api/orders', router);
  }

  // Setup admin routes
  setupAdminRoutes() {
    const router = express.Router();

    // Admin dashboard stats
    router.get('/stats',
      this.authManager.authenticate(),
      this.authManager.authorize(['admin']),
      async (req, res) => {
        try {
          const stats = {
            users: await this.db.getQuery('SELECT COUNT(*) as count FROM users WHERE is_active = 1'),
            orders: await this.db.getQuery('SELECT COUNT(*) as count FROM orders'),
            products: await this.db.getQuery('SELECT COUNT(*) as count FROM products WHERE is_active = 1'),
            revenue: await this.db.getQuery('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != "cancelled"')
          };

          res.json({
            success: true,
            data: {
              totalUsers: stats.users.count,
              totalOrders: stats.orders.count,
              totalProducts: stats.products.count,
              totalRevenue: stats.revenue.total
            }
          });
        } catch (error) {
          this.logger.error('Admin stats error:', error);
          res.status(500).json({
            success: false,
            error: 'Грешка при зареждане на статистиките'
          });
        }
      }
    );

    this.app.use('/api/admin', router);
  }

  // Generate order number
  generateOrderNumber() {
    const date = new Date();
    const dateStr = date.getFullYear().toString().substr(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const timeStr = Date.now().toString().substr(-4);
    return `TM${dateStr}${timeStr}`;
  }

  // Setup error handling
  setupErrorHandling() {
    // Global error handler
    this.app.use((err, req, res, next) => {
      this.logger.error('Unhandled error:', err);

      // Don't leak error details in production
      const isDevelopment = process.env.NODE_ENV === 'development';

      res.status(err.status || 500).json({
        success: false,
        error: isDevelopment ? err.message : 'Възникна грешка в сървъра',
        ...(isDevelopment && { stack: err.stack })
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      this.logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      this.logger.error('Unhandled Rejection:', err);
      process.exit(1);
    });
  }

  // Initialize the server
  async initialize() {
    try {
      this.logger.info('🚀 Initializing ТортоМания Secure API Server...');

      // Initialize database
      await this.db.initialize();
      await this.db.insertSampleProducts();

      // Initialize auth manager
      this.authManager = new AuthManager(this.db);

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handling
      this.setupErrorHandling();

      this.logger.info('✅ Server initialization completed');
      return true;
    } catch (error) {
      this.logger.error('❌ Server initialization failed:', error);
      throw error;
    }
  }

  // Start the server
  async start() {
    try {
      await this.initialize();

      this.app.listen(this.port, () => {
        this.logger.info(`🔒 ТортоМания Secure API Server running on port ${this.port}`);
        this.logger.info(`🌐 Health check: http://localhost:${this.port}/health`);
        this.logger.info(`📚 API documentation: http://localhost:${this.port}/api`);
        this.logger.info(`🛡️ Security features: JWT Auth, Rate Limiting, Input Validation, Security Headers`);
      });
    } catch (error) {
      this.logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  // Graceful shutdown
  async shutdown() {
    this.logger.info('🔄 Shutting down server...');
    
    if (this.db) {
      await this.db.close();
    }
    
    this.logger.info('✅ Server shut down complete');
    process.exit(0);
  }
}

// Handle shutdown signals
const server = new SecureAPIServer();

process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

// Start the server
if (require.main === module) {
  server.start();
}

module.exports = SecureAPIServer;