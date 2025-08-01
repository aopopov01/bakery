// Security Configuration Module
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Rate limiting configuration
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // Time window in milliseconds
    max, // Limit each IP to max requests per windowMs
    message: {
      error: 'Твърде много заявки от този IP адрес. Моля, опитайте отново по-късно.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Твърде много заявки',
        message: 'Превишен лимит на заявки. Моля, изчакайте преди да опитате отново.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limit
  general: createRateLimiter(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  
  // Strict rate limit for authentication endpoints
  auth: createRateLimiter(15 * 60 * 1000, 5), // 5 login attempts per 15 minutes
  
  // Medium rate limit for order endpoints
  orders: createRateLimiter(60 * 1000, 10), // 10 orders per minute
  
  // Lenient rate limit for product browsing
  products: createRateLimiter(60 * 1000, 50), // 50 requests per minute
};

// Helmet security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
};

// CORS configuration
const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4000'
    ];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Не е разрешено от CORS политиката'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
};

// Security middleware setup function
const setupSecurityMiddleware = (app) => {
  // Basic security headers
  app.use(helmet(helmetConfig));
  
  // CORS configuration
  app.use(cors(corsConfig));
  
  // Sanitize data to prevent NoSQL injection attacks
  app.use(mongoSanitize());
  
  // Prevent HTTP Parameter Pollution attacks
  app.use(hpp({
    whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'tags']
  }));
  
  // Trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);
  
  console.log('🛡️ Security middleware configured');
};

// Input sanitization helpers
const sanitizeInput = {
  // Remove potentially dangerous HTML/JS
  cleanHtml: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },
  
  // Trim and clean strings
  cleanString: (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().slice(0, 1000); // Limit length
  },
  
  // Sanitize email
  cleanEmail: (email) => {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim().slice(0, 254);
  }
};

module.exports = {
  rateLimiters,
  helmetConfig,
  corsConfig,
  setupSecurityMiddleware,
  sanitizeInput
};