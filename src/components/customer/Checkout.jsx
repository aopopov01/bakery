import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, Store, Mail } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';
import { useEmailService } from '../../hooks/useEmailService';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
  const { t, formatPrice } = useTranslation();
  const { state, actions } = useAppContext();
  const { sendOrderConfirmation, sendLoyaltyReward } = useEmailService();
  const { user, isAuthenticated, openAuthModal, addLoyaltyPoints } = useAuth();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    type: 'pickup', // pickup or delivery
    address: {
      street: '',
      city: 'София',
      postalCode: ''
    }
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { cartItems, cartTotal } = state;
  const deliveryFee = deliveryInfo.type === 'delivery' ? 3.00 : 0;
  const finalTotal = cartTotal + deliveryFee;

  // Auto-fill customer information if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerInfo({
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone || '',
        notes: ''
      });

      // Auto-fill delivery address if user has one saved
      if (user.address) {
        setDeliveryInfo(prev => ({
          ...prev,
          address: {
            street: user.address,
            city: 'София',
            postalCode: ''
          }
        }));
      }
    }
  }, [isAuthenticated, user]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Моля въведете име';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Моля въведете имейл';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Моля въведете валиден имейл';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Моля въведете телефон';
    }
    
    if (deliveryInfo.type === 'delivery') {
      if (!deliveryInfo.address.street.trim()) {
        newErrors.street = 'Моля въведете адрес за доставка';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.getFullYear().toString().substr(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const timeStr = Date.now().toString().substr(-4);
    return `ZZ${dateStr}${timeStr}`;
  };
  
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order object
      const orderData = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        customer: {
          firstName: customerInfo.name.split(' ')[0] || customerInfo.name,
          lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        delivery: deliveryInfo,
        payment: {
          method: paymentMethod === 'cash' ? 'В брой' : paymentMethod
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        })),
        subtotal: cartTotal,
        deliveryFee,
        total: finalTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes: customerInfo.notes
      };
      
      // Save order to localStorage (in production, this would go to database)
      const existingOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('bakery_orders', JSON.stringify(existingOrders));
      
      // Update loyalty program if user is logged in
      let loyaltyUpdate = null;
      if (isAuthenticated && user) {
        try {
          loyaltyUpdate = addLoyaltyPoints(finalTotal);
          console.log('🎯 Loyalty points updated:', loyaltyUpdate);
          
          // Send loyalty reward email if tier changed
          if (loyaltyUpdate.tierChanged) {
            console.log('🎉 User tier upgraded! Sending loyalty reward email...');
            await sendLoyaltyReward(user, {
              pointsEarned: loyaltyUpdate.pointsEarned,
              type: 'tier_upgrade',
              value: `Повишение до ${loyaltyUpdate.newTier}`,
              description: `Поздравления! Достигнахте ново ниво в програмата за лоялност.`,
              validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('bg-BG') // 90 days
            });
          } else if (loyaltyUpdate.pointsEarned > 0) {
            // Send points earned notification for significant purchases
            if (finalTotal >= 50) {
              console.log('💰 Significant purchase! Sending loyalty points email...');
              await sendLoyaltyReward(user, {
                pointsEarned: loyaltyUpdate.pointsEarned,
                type: 'purchase',
                value: `${loyaltyUpdate.pointsEarned} бонус точки`,
                description: `Получихте бонус точки за поръчка на стойност ${formatPrice(finalTotal)}.`,
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('bg-BG') // 1 year
              });
            }
          }
        } catch (loyaltyError) {
          console.error('⚠️ Loyalty program error (order still processed):', loyaltyError);
        }
      }
      
      // Send confirmation email using MCP Email Service
      console.log('🍞 Sending order confirmation email...');
      const emailSent = await sendOrderConfirmation(orderData);
      
      if (emailSent) {
        console.log('✅ Order confirmation email sent successfully!');
      } else {
        console.warn('⚠️ Order created but email failed to send');
      }
      
      // Clear cart
      actions.clearCart();
      
      // Show success
      setOrderSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Order processing failed:', error);
      setErrors({ submit: 'Възникна грешка при обработката на поръчката' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-storefront-sage rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-storefront-deep-green mb-4">
            🎉 Поръчката е успешна!
          </h1>
          <p className="text-green-700 mb-6">
            Благодарим Ви! Ще получите потвърждение по имейл.
          </p>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Mail className="w-5 h-5" />
              <span className="font-medium">
                Имейл изпратен на {customerInfo.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold gradient-text-warm mb-8 text-center">
          🛒 Завършване на поръчката
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Customer Information */}
              <div className="card-warm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    📝 Данни за клиента
                  </h2>
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Попълнено от профила</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      <button 
                        type="button"
                        onClick={() => openAuthModal('signin')}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Влезте в профила
                      </button>
                      {' '}за бързо попълване
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Име и фамилия *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Въведете вашето име"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имейл адрес *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+359 88 123 4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Бележки
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      rows="2"
                      placeholder="Допълнителни бележки за поръчката"
                    />
                  </div>
                </div>
              </div>
              
              {/* Delivery Options */}
              <div className="card-cool p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  🚚 Доставка
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div
                    onClick={() => setDeliveryInfo({...deliveryInfo, type: 'pickup'})}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      deliveryInfo.type === 'pickup'
                        ? 'border-storefront-gold bg-storefront-cream'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-800">Взимане от пекарната</h3>
                        <p className="text-sm text-gray-600">Безплатно</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setDeliveryInfo({...deliveryInfo, type: 'delivery'})}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      deliveryInfo.type === 'delivery'
                        ? 'border-storefront-gold bg-storefront-cream'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-800">Доставка до адрес</h3>
                        <p className="text-sm text-gray-600">{formatPrice(3.00)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {deliveryInfo.type === 'delivery' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Адрес *
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.address.street}
                        onChange={(e) => setDeliveryInfo({
                          ...deliveryInfo,
                          address: {...deliveryInfo.address, street: e.target.value}
                        })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ул. Витоша 15"
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Пощенски код
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.address.postalCode}
                        onChange={(e) => setDeliveryInfo({
                          ...deliveryInfo,
                          address: {...deliveryInfo.address, postalCode: e.target.value}
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment Method */}
              <div className="card-sweet p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  💳 Начин на плащане
                </h2>
                
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-complement-dusty-rose bg-complement-blush'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-storefront-sage rounded-full flex items-center justify-center">
                        💰
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">В брой при получаване</h3>
                        <p className="text-sm text-gray-600">Плащате при доставка или взимане</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-2 border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div>
                        <h3 className="font-bold text-gray-600">Банкова карта</h3>
                        <p className="text-sm text-gray-500">Скоро ще бъде достъпно</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                {errors.submit && (
                  <p className="text-red-500 mb-4">{errors.submit}</p>
                )}
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Обработва се...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Потвърди поръчката
                      <Mail className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-fresh p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                📋 Обобщение
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name.bg}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Междинна сума:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>
                    {deliveryFee === 0 ? 'Безплатно' : formatPrice(deliveryFee)}
                  </span>
                </div>
                
                <div className="flex justify-between text-xl font-bold text-amber-600 border-t border-gray-200 pt-2">
                  <span>Общо:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">
                    Ще получите потвърждение по имейл
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;