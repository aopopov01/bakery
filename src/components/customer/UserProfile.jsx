import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Crown, Gift, ShoppingBag, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile, loyaltyTiers } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Моля влезте в профила си</h2>
          <p className="text-gray-600">За да видите тази страница трябва да сте влезли в профила си.</p>
        </div>
      </div>
    );
  }

  const currentTier = loyaltyTiers[user.loyaltyTier];
  const nextTierKey = user.loyaltyTier === 'bronze' ? 'silver' : 
                     user.loyaltyTier === 'silver' ? 'gold' : 
                     user.loyaltyTier === 'gold' ? 'platinum' : null;
  const nextTier = nextTierKey ? loyaltyTiers[nextTierKey] : null;
  const progressToNext = nextTier ? ((user.totalSpent - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthDate: user?.birthDate || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Моят профил
          </h1>
          <p className="text-gray-600">Управлявайте личната си информация и следете лоялността си</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Лична информация</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Редактирай</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Запазване...' : 'Запази'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Отказ</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user.firstName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фамилия
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user.lastName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имейл
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user.phone || 'Не е посочен'}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user.address || 'Не е посочен'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата на раждане
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({...editData, birthDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">
                        {user.birthDate ? new Date(user.birthDate).toLocaleDateString('bg-BG') : 'Не е посочена'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="space-y-6">
            {/* Current Tier */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Ниво на лоялност</h3>
                  <p className="text-amber-100">
                    {user.loyaltyTier === 'bronze' && '🥉 Бронз'}
                    {user.loyaltyTier === 'silver' && '🥈 Сребро'}
                    {user.loyaltyTier === 'gold' && '🥇 Злато'}
                    {user.loyaltyTier === 'platinum' && '💎 Платина'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-100">Точки:</span>
                  <span className="text-2xl font-bold">{user.loyaltyPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-100">Множител:</span>
                  <span className="font-bold">×{currentTier.pointsMultiplier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-100">Общо похарчено:</span>
                  <span className="font-bold">{user.totalSpent.toFixed(2)} лв</span>
                </div>
              </div>

              {nextTier && (
                <div className="mt-4 pt-4 border-t border-amber-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-100">До {nextTier.name}:</span>
                    <span className="font-bold">{(nextTier.min - user.totalSpent).toFixed(2)} лв</span>
                  </div>
                  <div className="w-full bg-amber-600 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min(progressToNext, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Статистика
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Общо поръчки:</span>
                  <span className="font-bold text-gray-800">{user.orderCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Член от:</span>
                  <span className="font-bold text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString('bg-BG')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Статус:</span>
                  <span className="bg-storefront-cream text-storefront-deep-green px-2 py-1 rounded-full text-sm font-medium">
                    Активен
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Награди
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 font-medium">5% отстъпка</span>
                    <span className="text-green-600 text-sm">100 точки</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 font-medium">Безплатна доставка</span>
                    <span className="text-blue-600 text-sm">200 точки</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-medium">Безплатна торта</span>
                    <span className="text-purple-600 text-sm">500 точки</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;