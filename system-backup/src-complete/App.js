import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import CartSidebar from './components/shared/CartSidebar';
import ScrollToTop from './components/shared/ScrollToTop';
import HomePage from './components/customer/HomePage';
import AboutPage from './components/customer/AboutPage';
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
          {/* Colorful background pattern */}
          <div className="fixed inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full blur-xl"></div>
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <ScrollToTop />
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
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