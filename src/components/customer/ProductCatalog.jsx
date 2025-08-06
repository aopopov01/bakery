import React, { useState, useEffect } from 'react';
import { Search, Grid, List, ShoppingCart, Heart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';

// Sweet bakery product data
const sampleProducts = [
  {
    id: 1,
    name: { bg: 'Шоколадова торта', en: 'Chocolate Cake' },
    description: { bg: 'Богата шоколадова торта с ганаш и свежи ягоди', en: 'Rich chocolate cake with ganache and fresh strawberries' },
    price: 25.90,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400&h=300&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: { bg: 'Ягодова торта', en: 'Strawberry Cake' },
    description: { bg: 'Лека бисквитка с прясно сметанов крем и ягоди', en: 'Light sponge with fresh cream and strawberries' },
    price: 28.50,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1602663491496-73f07481dbea?w=400&h=300&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: { bg: 'Шоколадови мъфини', en: 'Chocolate Muffins' },
    description: { bg: 'Пухкави мъфини с парченца белгийски шоколад', en: 'Fluffy muffins with Belgian chocolate chips' },
    price: 4.20,
    category: 'sweet-bites',
    image: 'https://images.unsplash.com/photo-1593199970393-10f0f82e2e47?w=400&h=300&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: { bg: 'Цветни макарони', en: 'Colorful Macarons' },
    description: { bg: 'Френски макарони с различни вкусове и цветове', en: 'French macarons with various flavors and colors' },
    price: 2.80,
    category: 'sweet-bites',
    image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: { bg: 'Глазирани поничета', en: 'Glazed Donuts' },
    description: { bg: 'Меки поничета с глазура и цветни посипки', en: 'Soft donuts with glaze and colorful sprinkles' },
    price: 3.50,
    category: 'sweet-bites',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    inStock: true,
    featured: true
  },
  {
    id: 6,
    name: { bg: 'Капкейкове', en: 'Cupcakes' },
    description: { bg: 'Малки тортички с кремчетата и декорации', en: 'Mini cakes with cream and decorations' },
    price: 5.90,
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 7,
    name: { bg: 'Шоколадови бисквити', en: 'Chocolate Cookies' },
    description: { bg: 'Хрупкави бисквити с парченца шоколад', en: 'Crispy cookies with chocolate chips' },
    price: 6.80,
    category: 'sweet-bites',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: { bg: 'Бутер кроасани', en: 'Butter Croissants' },
    description: { bg: 'Слоести кроасани с истинско френско масло', en: 'Flaky croissants with real French butter' },
    price: 4.50,
    category: 'sweet-bites',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 9,
    name: { bg: 'Пшенично брашно', en: 'Wheat Flour' },
    description: { bg: 'Висококачествено брашно за домашно печене - 1кг', en: 'High-quality flour for home baking - 1kg' },
    price: 3.20,
    category: 'ingredients',
    image: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 10,
    name: { bg: 'Ванилова есенция', en: 'Vanilla Extract' },
    description: { bg: 'Натурална ванилова есенция за ароматни сладкиши', en: 'Natural vanilla extract for aromatic desserts' },
    price: 8.90,
    category: 'ingredients',
    image: 'https://images.unsplash.com/photo-1594054528735-d3782132b380?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 11,
    name: { bg: 'Шоколадови чипс', en: 'Chocolate Chips' },
    description: { bg: 'Белгийски шоколадови парченца за бисквити и мъфини', en: 'Belgian chocolate chips for cookies and muffins' },
    price: 7.50,
    category: 'ingredients',
    image: 'https://images.unsplash.com/photo-1577048982768-5cb3e7ddfa23?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  },
  {
    id: 12,
    name: { bg: 'Захарна пудра', en: 'Powdered Sugar' },
    description: { bg: 'Фина захарна пудра за глазури и декорации', en: 'Fine powdered sugar for glazes and decorations' },
    price: 4.80,
    category: 'ingredients',
    image: 'https://plus.unsplash.com/premium_photo-1666174325374-018870c5d15a?w=400&h=300&fit=crop',
    inStock: true,
    featured: false
  }
];

function ProductCatalog() {
  const { t, language, formatPrice } = useTranslation();
  const { actions } = useAppContext();
  const [products] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  const categories = [
    { id: 'all', name: { bg: 'Всички', en: 'All' } },
    { id: 'cakes', name: { bg: 'Торти', en: 'Cakes' } },
    { id: 'sweet-bites', name: { bg: 'Сладки хапки', en: 'Sweet Bites' } },
    { id: 'ingredients', name: { bg: 'Съставки', en: 'Ingredients' } }
  ];
  
  // Filter and search products
  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description[language].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name[language].localeCompare(b.name[language]));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, language]);
  
  const handleAddToCart = (product) => {
    actions.addToCart(product);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ✨ {t('products.title')} ✨
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            {t('products.subtitle')}
          </p>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('products.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-storefront-gold focus:border-transparent transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-storefront-gold to-storefront-warm-gold text-storefront-deep-green shadow-lg font-bold'
                      : 'bg-white/80 text-gray-700 hover:bg-storefront-cream border border-storefront-gold'
                  }`}
                >
                  {category.name[language]}
                </button>
              ))}
            </div>
            
            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-storefront-gold"
              >
                <option value="featured">Препоръчани</option>
                <option value="name">По име</option>
                <option value="price-low">Цена: ниска към висока</option>
                <option value="price-high">Цена: висока към ниска</option>
                <option value="rating">По рейтинг</option>
              </select>
              
              <div className="flex bg-white rounded-xl border-2 border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-xl ${viewMode === 'grid' ? 'bg-storefront-gold text-storefront-deep-green' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-xl ${viewMode === 'list' ? 'bg-storefront-gold text-storefront-deep-green' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className={`grid gap-4 sm:gap-6 md:gap-8 ${
          viewMode === 'grid' 
            ? 'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredProducts.map(product => (
            <div key={product.id} className={`card-warm overflow-hidden group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
              {/* Product Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-w-16 aspect-h-12 h-48'} overflow-hidden`}>
                <img 
                  src={product.image} 
                  alt={product.name[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=🍞';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ Хит
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Изчерпан
                    </span>
                  )}
                </div>
                
                {/* Wishlist button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-all duration-300" />
                </button>
              </div>
              
              {/* Product Info */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex justify-between items-start' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex-1 pr-6' : ''}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-storefront-gold transition-colors">
                      {product.name[language]}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {product.description[language]}
                    </p>
                    
                    <div className={`flex items-center ${viewMode === 'list' ? 'justify-between' : 'justify-between'} ${viewMode === 'grid' ? 'mb-4' : ''}`}>
                      <div className="price-display text-2xl font-bold">
                        {formatPrice(product.price)}
                      </div>
                      
                      {viewMode === 'list' && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                            product.inStock
                              ? 'btn-success hover:scale-105'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>{product.inStock ? t('products.addToCart') : t('products.outOfStock')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {viewMode === 'grid' && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all ${
                      product.inStock
                        ? 'btn-success hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.inStock ? t('products.addToCart') : t('products.outOfStock')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Няма намерени продукти</h3>
            <p className="text-gray-600 mb-6">Опитайте с различни критерии за търсене</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-primary"
            >
              Изчисти филтрите
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCatalog;