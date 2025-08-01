import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Calendar, Star, AlertCircle, Mail, Send, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEmailService } from '../../hooks/useEmailService';

function AdminDashboard() {
  const { t, formatPrice } = useTranslation();
  const { emailStats, queueLength, isProcessing, successRate, processEmailQueue, refreshStats } = useEmailService();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample dashboard data
  const stats = [
    { title: 'Общи продажби днес', value: formatPrice(342.50), icon: TrendingUp, color: 'from-emerald-400 to-green-500', change: '+12%' },
    { title: 'Нови поръчки', value: '23', icon: ShoppingCart, color: 'from-blue-400 to-cyan-500', change: '+8%' },
    { title: 'Активни продукти', value: '156', icon: Package, color: 'from-purple-400 to-indigo-500', change: '+3%' },
    { title: 'Нови клиенти', value: '12', icon: Users, color: 'from-pink-400 to-rose-500', change: '+25%' }
  ];
  
  const recentOrders = [
    { id: '#1234', customer: 'Мария Петрова', items: 3, total: 15.40, status: 'preparing' },
    { id: '#1235', customer: 'Иван Георгиев', items: 2, total: 8.60, status: 'ready' },
    { id: '#1236', customer: 'Елена Димитрова', items: 5, total: 23.80, status: 'delivered' },
    { id: '#1237', customer: 'Петър Стоянов', items: 1, total: 4.20, status: 'pending' }
  ];
  
  const topProducts = [
    { name: 'Традиционен бял хляб', sales: 45, revenue: 112.50 },
    { name: 'Баница с извара', sales: 28, revenue: 117.60 },
    { name: 'Козунак с шоколад', sales: 12, revenue: 106.80 },
    { name: 'Маслени курабии', sales: 22, revenue: 83.60 }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Изчаква';
      case 'preparing': return 'Приготвя се';
      case 'ready': return 'Готова';
      case 'delivered': return 'Доставена';
      default: return status;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text-cool mb-2">
            Администрация
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Добре дошли в административния панел на ТортоМания
          </p>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Табло
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'emails'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              📧 Имейли
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Dashboard Content */}
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-warm p-6 text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {stat.title}
              </h3>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                {stat.change} от вчера
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="card-cool p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Последни поръчки
                </h2>
                <button className="btn-info text-sm">
                  Виж всички
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Поръчка</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Клиент</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Артикули</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Сума</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="py-4 px-2">
                          <span className="font-bold text-blue-600">{order.id}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-medium text-gray-800">{order.customer}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-gray-600">{order.items} бр.</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-bold text-emerald-600">{formatPrice(order.total)}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Top Products */}
          <div className="lg:col-span-1">
            <div className="card-sweet p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Топ продукти днес
              </h2>
              
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-pink-50 rounded-xl border border-pink-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{product.sales} продажби</span>
                        <span>•</span>
                        <span className="font-medium text-emerald-600">
                          {formatPrice(product.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-pink-600">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Бързи действия
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="card-warm p-6 text-center hover:scale-105 transition-all cursor-pointer">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Добави продукт</h3>
            </button>
            
            <button className="card-cool p-6 text-center hover:scale-105 transition-all cursor-pointer">
              <ShoppingCart className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Нова поръчка</h3>
            </button>
            
            <button className="card-sweet p-6 text-center hover:scale-105 transition-all cursor-pointer">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Отчети</h3>
            </button>
            
            <button className="card-fresh p-6 text-center hover:scale-105 transition-all cursor-pointer">
              <Users className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800">Клиенти</h3>
            </button>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">
                  Внимание: Ниски наличности
                </h3>
                <p className="text-yellow-700 mb-3">
                  3 продукта имат ниски наличности и се нуждаят от попълване.
                </p>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-2 rounded-lg transition-colors">
                  Виж подробности
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        )}
        
        {/* Email Management Tab */}
        {activeTab === 'emails' && (
          <div>
            {/* Email Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-warm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Изпратени имейли</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {emailStats?.totalSent || 0}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Успешност: {successRate}
                </div>
              </div>

              <div className="card-warm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">В опашката</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {queueLength}
                </div>
                <div className="text-sm text-amber-600 font-medium">
                  {isProcessing ? 'Обработва се...' : 'Готово'}
                </div>
              </div>

              <div className="card-warm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Успешни</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {(emailStats?.totalSent || 0) - (emailStats?.totalFailed || 0)}
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  Доставени
                </div>
              </div>

              <div className="card-warm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Неуспешни</h3>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {emailStats?.totalFailed || 0}
                </div>
                <div className="text-sm text-red-600 font-medium">
                  Грешки
                </div>
              </div>
            </div>

            {/* Email Controls */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="card-cool p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Управление на опашката</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div>
                      <h3 className="font-semibold text-gray-800">Статус на системата</h3>
                      <p className="text-sm text-gray-600">
                        {isProcessing ? 'Системата обработва имейли...' : 'Системата е готова'}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={processEmailQueue}
                      disabled={isProcessing}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Изпрати опашката</span>
                    </button>
                    
                    <button
                      onClick={refreshStats}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-sweet p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Типове имейли</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-sm font-medium text-gray-700">🎉 Добре дошли</span>
                    <span className="text-sm text-green-600 font-semibold">Активни</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-gray-700">📦 Потвърждения</span>
                    <span className="text-sm text-blue-600 font-semibold">Активни</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium text-gray-700">📋 Статус актуализации</span>
                    <span className="text-sm text-purple-600 font-semibold">Активни</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                    <span className="text-sm font-medium text-gray-700">🏆 Лоялност награди</span>
                    <span className="text-sm text-pink-600 font-semibold">Активни</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-gray-700">🚨 Админ уведомления</span>
                    <span className="text-sm text-red-600 font-semibold">Активни</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zapier Integration Status */}
            <div className="card-fresh p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Zapier интеграция</h2>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">
                      Настройка на Zapier необходима
                    </h3>
                    <p className="text-yellow-700 mb-3">
                      За да активирате изпращането на имейли, моля настройте 5 Zapier webhook-а със aopopov01@gmail.com
                    </p>
                    <div className="text-sm text-yellow-600">
                      <p><strong>Детайлни инструкции:</strong> Вижте ZAPIER_SETUP.md файла</p>
                      <p><strong>Имейл адрес:</strong> aopopov01@gmail.com</p>
                      <p><strong>Очаквано време:</strong> 15 минути за настройка</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;