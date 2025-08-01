// Database Configuration and Setup
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DB_PATH || './data/bakery.db';
  }

  // Initialize database connection and create tables
  async initialize() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Create database connection
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection failed:', err.message);
          throw err;
        }
        console.log('✅ Connected to SQLite database');
      });

      // Enable foreign keys
      await this.runQuery('PRAGMA foreign_keys = ON');
      
      // Create tables
      await this.createTables();
      
      // Create default admin user
      await this.createDefaultAdmin();
      
      console.log('✅ Database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // Execute SQL query with promise support
  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Execute SELECT query with promise support
  getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Execute SELECT ALL query with promise support
  allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Create all necessary tables
  async createTables() {
    // Users table with security enhancements
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        birth_date DATE,
        role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin', 'staff')),
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        loyalty_points INTEGER DEFAULT 0,
        loyalty_tier TEXT DEFAULT 'bronze' CHECK(loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
        total_spent DECIMAL(10,2) DEFAULT 0.00,
        order_count INTEGER DEFAULT 0,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME NULL,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User sessions table for secure session management
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at DATETIME NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Products table
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_bg TEXT NOT NULL,
        name_en TEXT,
        description_bg TEXT,
        description_en TEXT,
        price DECIMAL(10,2) NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT 1,
        stock_quantity INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table with enhanced security
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        user_id INTEGER NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        delivery_type TEXT CHECK(delivery_type IN ('pickup', 'delivery')),
        delivery_address TEXT,
        payment_method TEXT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        delivery_fee DECIMAL(10,2) DEFAULT 0.00,
        total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
        notes TEXT,
        loyalty_points_earned INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      )
    `);

    // Order items table
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // Security logs table
    await this.runQuery(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NULL,
        action TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        success BOOLEAN NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      )
    `);

    // Create indexes for performance
    await this.runQuery('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await this.runQuery('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
    await this.runQuery('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await this.runQuery('CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id)');
    await this.runQuery('CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at)');

    console.log('✅ Database tables created successfully');
  }

  // Create default admin user
  async createDefaultAdmin() {
    try {
      const existingAdmin = await this.getQuery(
        'SELECT id FROM users WHERE role = ? LIMIT 1',
        ['admin']
      );

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('TortoManiya2024!', 12);
        
        await this.runQuery(`
          INSERT INTO users (
            email, password_hash, first_name, last_name, role, 
            is_active, email_verified
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          'admin@tortomaniya.bg',
          hashedPassword,
          'Администратор',
          'ТортоМания',
          'admin',
          1,
          1
        ]);

        console.log('✅ Default admin user created');
        console.log('📧 Email: admin@tortomaniya.bg');
        console.log('🔑 Password: TortoManiya2024!');
        console.log('⚠️  Please change the default password after first login');
      }
    } catch (error) {
      console.error('⚠️ Failed to create default admin:', error);
    }
  }

  // Insert sample products
  async insertSampleProducts() {
    const products = [
      {
        name_bg: 'Традиционен бял хляб',
        name_en: 'Traditional White Bread',
        description_bg: 'Пресен бял хляб, печен всеки ден с най-добри съставки',
        price: 2.50,
        category: 'bread',
        stock_quantity: 50
      },
      {
        name_bg: 'Кроасан с шоколад',
        name_en: 'Chocolate Croissant',
        description_bg: 'Маслен кроасан с богат шоколадов пълнеж',
        price: 4.50,
        category: 'pastries',
        stock_quantity: 30
      },
      {
        name_bg: 'Торта Тирамису',
        name_en: 'Tiramisu Cake',
        description_bg: 'Класическа италианска торта с кафе и маскарпоне',
        price: 45.00,
        category: 'cakes',
        stock_quantity: 10
      }
    ];

    for (const product of products) {
      try {
        await this.runQuery(`
          INSERT OR IGNORE INTO products (
            name_bg, name_en, description_bg, price, category, stock_quantity
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          product.name_bg,
          product.name_en,
          product.description_bg,
          product.price,
          product.category,
          product.stock_quantity
        ]);
      } catch (error) {
        console.warn('⚠️ Failed to insert product:', product.name_bg, error.message);
      }
    }

    console.log('✅ Sample products inserted');
  }

  // Close database connection
  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err);
          } else {
            console.log('✅ Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = DatabaseManager;