# 🍞 Bulgarian Bakery E-commerce Platform

A comprehensive e-commerce platform for Bulgarian bakeries featuring product catalog, shopping cart, admin panel, and Revolut payment integration.

## 🚀 Features

### Customer Features
- **Product Catalog** - Browse bakery products with Bulgarian descriptions
- **Shopping Cart** - Add/remove items with quantity controls  
- **Checkout** - Revolut payment integration + cash on delivery
- **Mobile-First** - Optimized for phones and tablets
- **PWA Support** - Offline browsing and app-like experience

### Admin Features  
- **Product Management** - Add/edit/delete products with inventory tracking
- **Order Management** - Process orders and update status
- **Analytics Dashboard** - Sales reports and customer insights
- **Multi-language** - Bulgarian and English interface

## 🛠️ Tech Stack

- **React** with Magic UI Components
- **Tailwind CSS** for styling
- **Revolut Business API** for payments
- **LocalStorage** for data persistence (upgradeable to database)
- **PWA** capabilities for mobile experience

## 📁 Project Structure

```
bakery/
├── src/
│   ├── components/
│   │   ├── customer/     # Customer-facing components
│   │   ├── admin/        # Admin panel components
│   │   └── shared/       # Shared components
│   ├── data/             # Product data and translations
│   ├── utils/            # Helper functions
│   └── assets/           # Images and icons
├── docs/                 # Documentation
├── public/               # Static assets
└── BAKERY_PROJECT_DOCS.md # Complete project documentation
```

## 🏁 Getting Started

### Option 1: Docker Development (Recommended)

1. **Start Development Environment**
   ```bash
   # Start with hot reloading
   docker-compose -f docker-compose.dev.yml up --build
   
   # Or start full stack (with database)
   docker-compose up --build
   ```

2. **Access the Application**
   - **Bakery Website**: http://localhost:3000
   - **With Nginx**: http://localhost (if using full stack)
   - **Database**: localhost:5432 (postgres)

3. **Stop Services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Docker Commands

```bash
# Development with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Production-like environment
docker-compose up --build

# View logs
docker-compose logs -f bakery-app

# Execute commands in container
docker-compose exec bakery-app npm run test

# Clean up
docker-compose down --volumes --rmi all
```

## 📋 Development Status

- [x] Project setup and documentation
- [ ] Basic React app structure
- [ ] Magic UI component integration
- [ ] Bulgarian localization system
- [ ] Product catalog implementation
- [ ] Shopping cart functionality
- [ ] Admin panel development
- [ ] Revolut payment integration
- [ ] Mobile optimization
- [ ] Testing and deployment

## 📖 Documentation

See `BAKERY_PROJECT_DOCS.md` for complete technical documentation, architecture details, and development guidelines.

## 🌍 Localization

Full Bulgarian language support with:
- Cyrillic text rendering
- Bulgarian Lev (лв) currency formatting
- Local payment methods (Revolut)
- Cultural adaptations for Bulgarian market

---

**Ready to build your bakery's online presence!** 🥖