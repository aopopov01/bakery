import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

function CartSidebar() {
  const { state, actions } = useAppContext();
  const { t, formatPrice } = useTranslation();
  
  const { cartItems, cartTotal, cartOpen } = state;
  const deliveryFee = cartTotal > 20 ? 0 : 3.00;
  const finalTotal = cartTotal + deliveryFee;
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      actions.removeFromCart(productId);
    } else {
      actions.updateCartQuantity(productId, newQuantity);
    }
  };
  
  if (!cartOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={actions.toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-storefront-gold bg-gradient-to-r from-storefront-cream to-storefront-ivory">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-storefront-sage to-storefront-teal rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('cart.title')}</h2>
              <p className="text-sm text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'продукт' : 'продукта'}
              </p>
            </div>
          </div>
          <button
            onClick={actions.toggleCart}
            className="w-10 h-10 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors border-2 border-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-6 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t('cart.empty')}
              </h3>
              <p className="text-gray-600 mb-6">
                Добавете продукти, за да започнете пазаруването
              </p>
              <Link to="/products" onClick={actions.toggleCart}>
                <button className="btn-primary">
                  {t('cart.continueShopping')}
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="card-warm p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name?.bg || 'Product'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64/f59e0b/ffffff?text=🍞';
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 mb-1 leading-tight">
                          {item.name?.bg || 'Product Name'}
                        </h3>
                        <div className="text-sm font-bold text-storefront-deep-green mb-2">
                          {formatPrice(item.price)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gradient-to-r from-storefront-bronze to-complement-warm-brown hover:from-complement-warm-brown hover:to-storefront-bronze text-white rounded-lg flex items-center justify-center transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-8 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gradient-to-r from-storefront-sage to-storefront-teal hover:from-storefront-teal hover:to-storefront-sage text-white rounded-lg flex items-center justify-center transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => actions.removeFromCart(item.id)}
                            className="w-8 h-8 bg-white hover:bg-gradient-to-r hover:from-red-400 hover:to-red-500 text-complement-cocoa hover:text-white border-2 border-complement-cocoa hover:border-transparent rounded-lg flex items-center justify-center transition-all ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <div className="font-bold text-storefront-deep-green">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Footer */}
              <div className="border-t-2 border-storefront-gold bg-gradient-to-r from-storefront-cream to-storefront-ivory p-6">
                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{t('cart.subtotal')}:</span>
                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{t('cart.delivery')}:</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-storefront-deep-green font-bold">Безплатна</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-600 bg-storefront-cream p-2 rounded-lg">
                      💡 Безплатна доставка при поръчка над {formatPrice(20)}
                    </p>
                  )}
                  
                  <hr className="border-storefront-gold/30" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">{t('cart.total')}:</span>
                    <span className="text-storefront-deep-green font-bold">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link to="/cart" onClick={actions.toggleCart}>
                    <button className="w-full btn-success flex items-center justify-center space-x-2">
                      <span>Към кошницата</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={actions.toggleCart}
                    className="w-full btn-secondary text-sm"
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CartSidebar;