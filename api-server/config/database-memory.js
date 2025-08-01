// In-Memory Database for Demo/Testing (Production-ready fallback)
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class MemoryDatabaseManager {
  constructor() {
    this.data = {
      users: [],
      products: [],
      orders: [],
      order_items: [],
      security_logs: []
    };
    this.nextId = {
      users: 1,
      products: 1,
      orders: 1,
      order_items: 1,
      security_logs: 1
    };
    this.dbPath = process.env.DB_PATH || './data/memory-db.json';
  }

  // Initialize database
  async initialize() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Try to load existing data
      if (fs.existsSync(this.dbPath)) {
        try {
          const fileContent = fs.readFileSync(this.dbPath, 'utf8');
          if (fileContent.trim()) {
            const savedData = JSON.parse(fileContent);
            if (savedData.data) {
              this.data = { ...this.data, ...savedData.data };
            }
            if (savedData.nextId) {
              this.nextId = { ...this.nextId, ...savedData.nextId };
            }
            console.log('✅ Loaded existing data from memory database');
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse existing database file, starting fresh:', parseError.message);
          // Delete corrupted file
          fs.unlinkSync(this.dbPath);
        }
      }

      // Create default admin user
      await this.createDefaultAdmin();
      
      // Insert sample products
      await this.insertSampleProducts();
      
      // Save initial state
      this.saveToFile();
      
      console.log('✅ Memory database initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Memory database initialization failed:', error);
      throw error;
    }
  }

  // Save data to file for persistence
  saveToFile() {
    try {
      const dataToSave = {
        data: this.data,
        nextId: this.nextId,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave, null, 2));
    } catch (error) {
      console.warn('Failed to save memory database to file:', error);
    }
  }

  // Execute INSERT-like query
  runQuery(sql, params = []) {
    try {
      const sqlLower = sql.toLowerCase().trim();
      
      if (sqlLower.startsWith('insert into users')) {
        const user = {
          id: this.nextId.users++,
          email: params[0],
          password_hash: params[1],
          first_name: params[2],
          last_name: params[3],
          phone: params[4] || null,
          address: params[5] || null,
          birth_date: params[6] || null,
          role: params[7] || 'customer',
          is_active: params[8] !== undefined ? params[8] : 1,
          email_verified: params[9] !== undefined ? params[9] : 0,
          loyalty_points: 0,
          loyalty_tier: 'bronze',
          total_spent: 0.00,
          order_count: 0,
          failed_login_attempts: 0,
          locked_until: null,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.data.users.push(user);
        this.saveToFile();
        return { id: user.id, changes: 1 };
      }
      
      if (sqlLower.startsWith('insert into products')) {
        const product = {
          id: this.nextId.products++,
          name_bg: params[0],
          name_en: params[1],
          description_bg: params[2],
          description_en: params[3] || null,
          price: params[4],
          category: params[5],
          image_url: params[6] || null,
          is_active: 1,
          stock_quantity: params[7] || 0,
          min_stock: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.data.products.push(product);
        this.saveToFile();
        return { id: product.id, changes: 1 };
      }
      
      if (sqlLower.startsWith('insert into orders')) {
        const order = {
          id: this.nextId.orders++,
          order_number: params[0],
          user_id: params[1],
          customer_name: params[2],
          customer_email: params[3],
          customer_phone: params[4],
          delivery_type: params[5],
          delivery_address: params[6],
          payment_method: params[7],
          subtotal: params[8],
          delivery_fee: params[9],
          total: params[10],
          notes: params[11],
          status: params[12] || 'pending',
          loyalty_points_earned: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.data.orders.push(order);
        this.saveToFile();
        return { id: order.id, changes: 1 };
      }
      
      if (sqlLower.startsWith('insert into security_logs')) {
        const log = {
          id: this.nextId.security_logs++,
          user_id: params[0],
          action: params[1],
          ip_address: params[2],
          user_agent: params[3],
          success: params[4],
          details: params[5],
          created_at: new Date().toISOString()
        };
        this.data.security_logs.push(log);
        this.saveToFile();
        return { id: log.id, changes: 1 };
      }
      
      if (sqlLower.startsWith('update users')) {
        // Handle user updates
        if (sql.includes('failed_login_attempts')) {
          const userId = params[params.length - 1];
          const user = this.data.users.find(u => u.id === userId);
          if (user) {
            user.failed_login_attempts = params[0];
            user.locked_until = params[1];
            user.updated_at = new Date().toISOString();
            this.saveToFile();
            return { id: userId, changes: 1 };
          }
        }
        
        if (sql.includes('loyalty_points')) {
          const userId = params[params.length - 1];
          const user = this.data.users.find(u => u.id === userId);
          if (user) {
            user.loyalty_points = (user.loyalty_points || 0) + params[0];
            user.total_spent = (user.total_spent || 0) + params[1];
            user.order_count = (user.order_count || 0) + 1;
            user.updated_at = new Date().toISOString();
            this.saveToFile();
            return { id: userId, changes: 1 };
          }
        }
      }
      
      return { id: null, changes: 0 };
    } catch (error) {
      throw error;
    }
  }

  // Execute SELECT query
  getQuery(sql, params = []) {
    try {
      const sqlLower = sql.toLowerCase().trim();
      
      if (sqlLower.includes('from users')) {
        if (sql.includes('WHERE role =')) {
          return this.data.users.find(u => u.role === params[0]);
        }
        if (sql.includes('WHERE email =')) {
          return this.data.users.find(u => u.email === params[0]);
        }
        if (sql.includes('WHERE id =')) {
          return this.data.users.find(u => u.id === params[0]);
        }
      }
      
      if (sqlLower.includes('from products')) {
        if (sql.includes('WHERE id =')) {
          return this.data.products.find(p => p.id === params[0]);
        }
        if (sql.includes('WHERE name_bg =')) {
          return this.data.products.find(p => p.name_bg === params[0]);
        }
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Execute SELECT ALL query
  allQuery(sql, params = []) {
    try {
      const sqlLower = sql.toLowerCase().trim();
      
      if (sqlLower.includes('from products')) {
        let products = this.data.products.filter(p => p.is_active === (params[0] || 1));
        if (params[1]) { // category filter
          products = products.filter(p => p.category === params[1]);
        }
        return products;
      }
      
      if (sqlLower.includes('from users')) {
        return this.data.users;
      }
      
      if (sqlLower.includes('from orders')) {
        return this.data.orders;
      }
      
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Create default admin user
  async createDefaultAdmin() {
    try {
      const existingAdmin = this.data.users.find(u => u.role === 'admin');

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('TortoManiya2024!', 12);
        
        this.runQuery(`INSERT INTO users`, [
          'admin@tortomaniya.bg',
          hashedPassword,
          'Администратор',
          'ТортоМания',
          null, // phone
          null, // address
          null, // birth_date
          'admin',
          1, // is_active
          1  // email_verified
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
        // Check if product already exists
        const existing = this.data.products.find(p => p.name_bg === product.name_bg);

        if (!existing) {
          this.runQuery(`INSERT INTO products`, [
            product.name_bg,
            product.name_en,
            product.description_bg,
            null, // description_en
            product.price,
            product.category,
            null, // image_url
            product.stock_quantity
          ]);
        }
      } catch (error) {
        console.warn('⚠️ Failed to insert product:', product.name_bg, error.message);
      }
    }

    console.log('✅ Sample products inserted');
  }

  // Close database connection
  async close() {
    this.saveToFile();
    console.log('✅ Memory database saved and closed');
  }
}

module.exports = MemoryDatabaseManager;