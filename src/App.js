import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import CartSidebar from './components/shared/CartSidebar';
import ScrollToTop from './components/shared/ScrollToTop';
import HomePage from './components/customer/HomePage';
import AboutPage from './components/customer/AboutPage';
import StoresPage from './components/customer/StoresPage';
import ProductCatalog from './components/customer/ProductCatalog';
import ShoppingCart from './components/customer/ShoppingCart';
import Checkout from './components/customer/Checkout';
import UserProfile from './components/customer/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
        <div className="App min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
          {/* Clear magical floating elements - no blur */}
          <div className="fixed inset-0 opacity-90 pointer-events-none">
            <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-orange-300 to-red-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 left-10 text-yellow-400 text-2xl animate-ping" style={{animationDelay: '1s'}}>✨</div>
            <div className="absolute bottom-1/3 right-10 text-orange-400 text-xl animate-pulse" style={{animationDelay: '2s'}}>🌟</div>
            <div className="absolute top-1/2 left-1/4 w-14 h-14 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <ScrollToTop />
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
          {/* Cart Sidebar */}
          <CartSidebar />
          
          {/* Auth Modal */}
          <AuthModal />
        </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;