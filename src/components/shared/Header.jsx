import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, User, LogOut, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import ChefHatLogo from './ChefHatLogo';

function Header() {
  const { state, actions } = useAppContext();
  const { user, isAuthenticated, openAuthModal, signOut } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const cartItemsCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path) => location.pathname === path;
  
  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, mobileMenuOpen]);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-pink-50/95 backdrop-blur-xl border-b-2 border-orange-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative transform group-hover:scale-110 transition-all duration-300">
              <ChefHatLogo size="medium" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent font-bulgarian">
                ТортоМания
              </h1>
              <p className="text-xs text-gray-600 font-medium hidden sm:block">Cake Mania</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <span>{t('nav.home')}</span>
            </Link>
            
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              {t('nav.products')}
            </Link>
            
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              {t('nav.about')}
            </Link>
            
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Authentication */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105"
                >
                  Регистрация
                </button>
              </div>
            ) : (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-gray-700 font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 rounded-full">
                            {user?.loyaltyTier === 'bronze' && '🥉 Бронз'}
                            {user?.loyaltyTier === 'silver' && '🥈 Сребро'}
                            {user?.loyaltyTier === 'gold' && '🥇 Злато'}
                            {user?.loyaltyTier === 'platinum' && '💎 Платина'}
                          </span>
                        </div>
                        <span className="ml-auto text-xs text-amber-600 font-bold">
                          {user?.loyaltyPoints || 0} точки
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Моят профил
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Поръчки
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Изход
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shopping cart */}
            <button
              onClick={actions.toggleCart}
              className="relative p-3 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <div className="mobile-menu-container relative">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 border border-purple-200 transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Navigation Links */}
            <nav className="space-y-4 mb-6">
              <Link 
                to="/" 
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border-l-4 border-orange-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 {t('nav.home')}
              </Link>
              
              <Link 
                to="/products" 
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/products')
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border-l-4 border-orange-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🛍️ {t('nav.products')}
              </Link>
              
              <Link 
                to="/about" 
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/about')
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 border-l-4 border-orange-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ℹ️ {t('nav.about')}
              </Link>
            </nav>

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-orange-600 hover:text-orange-700 font-medium bg-orange-50 hover:bg-orange-100 rounded-xl transition-all"
                >
                  🔐 Вход
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  ✨ Регистрация
                </button>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    👤 Моят профил
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    📋 Поръчки
                  </Link>
                  
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    🚪 Изход
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decorative border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 via-pink-500 via-purple-500 to-blue-500"></div>
    </header>
  );
}

export default Header;