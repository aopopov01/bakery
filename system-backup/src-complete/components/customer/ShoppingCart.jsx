import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';

function ShoppingCartPage() {
  const { t, formatPrice } = useTranslation();
  const { state, actions } = useAppContext();
  
  const { cartItems, cartTotal } = state;
  const deliveryFee = cartTotal > 20 ? 0 : 3.00;
  const finalTotal = cartTotal + deliveryFee;
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      actions.removeFromCart(productId);
    } else {
      actions.updateCartQuantity(productId, newQuantity);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t('cart.empty')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Добавете продукти, за да започнете пазаруването
            </p>
            <Link to="/products">
              <button className="btn-primary text-lg">
                {t('cart.continueShopping')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text-warm mb-4">
            {t('cart.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {cartItems.length} продукта в кошницата
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="card-warm p-6">
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name?.bg || 'Product'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/96x96/f59e0b/ffffff?text=🍞';
                        }}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {item.name?.bg || 'Product Name'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.description?.bg || 'Product description'}
                      </p>
                      <div className="text-lg font-bold text-emerald-600">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-xl flex items-center justify-center transition-all transform hover:scale-105"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-xl text-gray-800">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white rounded-xl flex items-center justify-center transition-all transform hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right min-w-[100px]">
                      <div className="text-xl font-bold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => actions.removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 p-2 hover:bg-red-50 rounded-lg transition-all"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Actions */}
            <div className="flex justify-between items-center mt-6">
              <Link to="/products">
                <button className="btn-secondary">
                  {t('cart.continueShopping')}
                </button>
              </Link>
              
              <button
                onClick={actions.clearCart}
                className="text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-all"
              >
                {t('cart.clear')}
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-cool p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Обобщение на поръчката
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">{t('cart.subtotal')}:</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">{t('cart.delivery')}:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">Безплатна</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                
                {deliveryFee > 0 && (
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    💡 Безплатна доставка при поръчка над {formatPrice(20)}
                  </p>
                )}
                
                <hr className="border-gray-300" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-gray-800">{t('cart.total')}:</span>
                  <span className="text-emerald-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Link to="/checkout">
                <button className="w-full btn-success text-lg py-4 mb-4 flex items-center justify-center space-x-2">
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Приемаме:</p>
                <div className="flex justify-center space-x-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    REV
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    €
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;