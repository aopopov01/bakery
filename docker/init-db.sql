-- Initial database setup for Bulgarian Bakery Platform
-- This script runs when the PostgreSQL container starts for the first time

-- Create main tables
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name_bg VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_bg TEXT,
    description_en TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BGN',
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    max_stock INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    weight VARCHAR(50),
    ingredients_bg TEXT[],
    ingredients_en TEXT[],
    allergens_bg TEXT[],
    allergens_en TEXT[],
    primary_image VARCHAR(500),
    images TEXT[],
    preparation_time INTEGER DEFAULT 0,
    shelf_life INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT,
    delivery_type VARCHAR(20) NOT NULL, -- 'pickup' or 'delivery'
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BGN',
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    transaction_id VARCHAR(255),
    notes TEXT,
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Insert sample data
INSERT INTO products (sku, name_bg, name_en, description_bg, description_en, category, price, stock, ingredients_bg, allergens_bg) VALUES
('BREAD_WHITE_500G', 'Бял хляб', 'White Bread', 'Пресен бял хляб, изпечен всеки ден', 'Fresh white bread, baked daily', 'bread', 2.50, 25, ARRAY['пшенично брашно', 'вода', 'мая', 'сол'], ARRAY['глутен']),
('BREAD_WHOLE_500G', 'Пълнозърнест хляб', 'Whole Grain Bread', 'Здравословен пълнозърнест хляб', 'Healthy whole grain bread', 'bread', 3.00, 20, ARRAY['пълнозърнесто брашно', 'вода', 'мая', 'сол'], ARRAY['глутен']),
('CROISSANT_BUTTER', 'Масленка', 'Butter Croissant', 'Хрупкава масленка с масло', 'Crispy butter croissant', 'pastries', 1.80, 30, ARRAY['брашно', 'масло', 'мляко', 'яйца'], ARRAY['глутен', 'мляко', 'яйца']),
('CAKE_CHOCOLATE', 'Шоколадова торта', 'Chocolate Cake', 'Богата шоколадова торта', 'Rich chocolate cake', 'cakes', 25.00, 5, ARRAY['брашно', 'шоколад', 'яйца', 'захар'], ARRAY['глутен', 'яйца', 'мляко']);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();