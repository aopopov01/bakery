import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Award, Clock, ChefHat, CheckCircle, Sparkles, Flame } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';
import ChefHatLogo from '../shared/ChefHatLogo';

function HomePage() {
  const { t } = useTranslation();
  const { actions } = useAppContext();
  
  // Featured sweet products for home page
  const sampleProducts = [
    {
      id: 'home-1',
      name: { bg: 'Шоколадова торта', en: 'Chocolate Cake' },
      description: { bg: 'Богата шоколадова торта с ганаш и свежи ягоди', en: 'Rich chocolate cake with ganache and fresh strawberries' },
      price: 25.90,
      image: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=400&h=300&fit=crop'
    },
    {
      id: 'home-2',
      name: { bg: 'Цветни макарони', en: 'Colorful Macarons' },
      description: { bg: 'Френски макарони с различни вкусове и цветове', en: 'French macarons with various flavors and colors' },
      price: 2.80,
      image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400&h=300&fit=crop'
    },
    {
      id: 'home-3',
      name: { bg: 'Глазирани поничета', en: 'Glazed Donuts' },
      description: { bg: 'Меки поничета с глазура и цветни посипки', en: 'Soft donuts with glaze and colorful sprinkles' },
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Magical floating elements */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-orange-300 to-red-400 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute top-1/3 left-10 text-yellow-400 text-2xl animate-ping" style={{animationDelay: '1s'}}>✨</div>
      <div className="absolute bottom-1/3 right-10 text-orange-400 text-xl animate-pulse" style={{animationDelay: '2s'}}>🌟</div>
      <div className="absolute top-1/2 left-1/4 text-pink-400 text-lg animate-bounce" style={{animationDelay: '3s'}}>🍰</div>
      <div className="absolute bottom-1/4 right-1/4 text-amber-400 text-xl animate-ping" style={{animationDelay: '0.5s'}}>🧁</div>
      
      {/* Hero Section */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Main heading */}
            <div className="mb-8">
              <div className="mb-6 transform hover:scale-110 transition-all duration-500">
                <ChefHatLogo size="large" className="mx-auto" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                ТортоМания
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="mb-12">
              <Link to="/products">
                <button className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-amber-500/50 transform hover:scale-110 transition-all duration-300 inline-flex items-center space-x-3 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{t('home.hero.cta')}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Нашите топ продукти
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Открийте най-обичаните от нашите клиенти сладки творения
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8">
            {sampleProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name.bg}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=🍞';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {index === 0 ? 'Хит' : index === 1 ? 'Ново' : 'Топ'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name.bg}</h3>
                  <p className="text-gray-600 mb-4">{product.description.bg}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{product.price.toFixed(2).replace('.', ',')} лв</span>
                    <button
                      onClick={() => actions.addToCart(product)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:from-amber-600 hover:to-orange-700 transition-all"
                    >
                      Добави
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105">
                Виж всички продукти
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Какво казват нашите клиенти
            </h2>
            <p className="text-xl text-gray-600">
              Истински отзиви от доволни клиенти
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  М
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Мария Петрова</h4>
                  <div className="flex text-amber-500">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Невероятни торти! Поръчвах за рождения ден на дъщеря ми и всички гости бяха възхитени. Качеството е на най-високо ниво!"
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  И
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Иван Георгиев</h4>
                  <div className="flex text-amber-500">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Винаги поръчвам от ТортоМания за специални случаи. Вкусът и качеството са непревзойдени, а обслужването е перфектно!"
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  Е
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Елена Димитрова</h4>
                  <div className="flex text-amber-500">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Макароните са като от Париж! Изключително вкусни и красиви. Препоръчвам на всички любители на качествените десерти."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Statistics */}
      <section className="py-16 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Защо да изберете ТортоМания?
            </h2>
            <p className="text-xl text-gray-600">
              Цифрите говорят за качеството ни
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-amber-600 mb-2">2500+</div>
              <p className="text-gray-600 font-medium">Доволни клиенти</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <p className="text-gray-600 font-medium">Видове торти</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-red-600 mb-2">5</div>
              <p className="text-gray-600 font-medium">Години опит</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Daily Process Timeline */}
      <section className="py-16 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Нашият ежедневен процес
            </h2>
            <p className="text-xl text-gray-600">
              От сурови съставки до перфектни сладости
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-600 hidden md:block"></div>
            
            {/* Mobile Timeline - Single Column Layout */}
            <div className="md:hidden space-y-4 sm:space-y-6 px-2 sm:px-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-amber-500 shadow-lg shadow-amber-500/30 rounded-full flex items-center justify-center flex-shrink-0 bg-white group">
                  <Sparkles className="w-6 h-6 text-amber-600 group-hover:animate-spin group-hover:text-yellow-400" />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">4:00 - 6:00 - Подготовка</h3>
                  <p className="text-gray-600 text-sm">Започваме деня с подбор на най-свежите съставки и подготовка на работното място</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-orange-500 shadow-lg shadow-orange-500/30 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">6:00 - 8:00 - Приготвяне</h3>
                  <p className="text-gray-600 text-sm">Замесваме тестата и приготвяме кремовете с любов и внимание към всеки детайл</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-red-500 shadow-lg shadow-red-500/30 rounded-full flex items-center justify-center flex-shrink-0 bg-white group">
                  <Flame className="w-6 h-6 text-red-600 group-hover:text-orange-400" />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">8:00 - 10:00 - Печене</h3>
                  <p className="text-gray-600 text-sm">Печем в специални фурни при оптимални температури за постигане на перфектния вкус</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-green-500 shadow-lg shadow-green-500/30 rounded-full flex items-center justify-center flex-shrink-0 bg-white group">
                  <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-green-400" />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">10:00 - 12:00 - Готови</h3>
                  <p className="text-gray-600 text-sm">Продуктите са готови за продажба - свежи, вкусни и красиво оформени</p>
                </div>
              </div>
            </div>

            {/* Desktop Timeline - Alternating Layout */}
            <div className="hidden md:block space-y-12">
              <div className="flex items-center md:justify-start justify-center">
                <div className="flex-1 md:text-right md:pr-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg inline-block max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">4:00 - 6:00 - Подготовка</h3>
                    <p className="text-gray-600">Започваме деня с подбор на най-свежите съставки и подготовка на работното място</p>
                  </div>
                </div>
                <div className="w-16 h-16 border-4 border-amber-500 shadow-lg shadow-amber-500/30 rounded-full flex items-center justify-center mx-4 z-10 flex-shrink-0 hover:scale-110 hover:rotate-12 hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90 group">
                  <Sparkles className="w-8 h-8 text-amber-600 group-hover:animate-spin group-hover:text-yellow-400" />
                </div>
                <div className="flex-1 hidden md:block"></div>
              </div>
              
              <div className="flex items-center md:justify-end justify-center">
                <div className="flex-1 hidden md:block"></div>
                <div className="w-16 h-16 border-4 border-orange-500 shadow-lg shadow-orange-500/30 rounded-full flex items-center justify-center mx-4 z-10 flex-shrink-0 hover:scale-110 hover:rotate-12 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90">
                  <ChefHat className="w-8 h-8 text-orange-600 hover:animate-bounce" />
                </div>
                <div className="flex-1 md:text-left md:pl-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg inline-block max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">6:00 - 8:00 - Приготвяне</h3>
                    <p className="text-gray-600">Замесваме тестата и приготвяме кремовете с любов и внимание към всеки детайл</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center md:justify-start justify-center">
                <div className="flex-1 md:text-right md:pr-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg inline-block max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">8:00 - 10:00 - Печене</h3>
                    <p className="text-gray-600">Печем в специални фурни при оптимални температури за постигане на перфектния вкус</p>
                  </div>
                </div>
                <div className="w-16 h-16 border-4 border-red-500 shadow-lg shadow-red-500/30 rounded-full flex items-center justify-center mx-4 z-10 flex-shrink-0 hover:scale-110 hover:rotate-12 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90 group">
                  <Flame className="w-8 h-8 text-red-600 group-hover:animate-pulse group-hover:text-orange-400" />
                </div>
                <div className="flex-1 hidden md:block"></div>
              </div>
              
              <div className="flex items-center md:justify-end justify-center">
                <div className="flex-1 hidden md:block"></div>
                <div className="w-16 h-16 border-4 border-green-500 shadow-lg shadow-green-500/30 rounded-full flex items-center justify-center mx-4 z-10 flex-shrink-0 hover:scale-110 hover:rotate-12 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90 group">
                  <CheckCircle className="w-8 h-8 text-green-600 group-hover:text-green-400 transition-colors duration-300" />
                </div>
                <div className="flex-1 md:text-left md:pl-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg inline-block max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">10:00 - 12:00 - Готови</h3>
                    <p className="text-gray-600">Продуктите са готови за продажба - свежи, вкусни и красиво оформени</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 bg-white/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text-sweet mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-xl text-gray-600">Разгледайте нашите категории продукти</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category cards */}
            <Link to="/products?category=cakes" className="group">
              <div className="card-sweet p-8 text-center group-hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🎂</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Торти
                </h3>
                <p className="text-gray-600 mb-4">Шоколадови, ягодови и ванилови торти за всеки повод</p>
                <div className="inline-flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=sweet-bites" className="group">
              <div className="card-warm p-8 text-center group-hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🍪</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Сладки хапки
                </h3>
                <p className="text-gray-600 mb-4">Мъфини, макарони, поничета и хрупкави бисквити</p>
                <div className="inline-flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=ingredients" className="group">
              <div className="card-cool p-8 text-center group-hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🥄</div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Съставки за печене
                </h3>
                <p className="text-gray-600 mb-4">Брашно, ванилия, шоколад и всичко за домашно печене</p>
                <div className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Започнете пазаруването днес!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Открийте най-вкусните торти и сладки хапки в града. Доставка до дома или вземане от пекарната.
            </p>
            <div className="space-x-4">
              <Link to="/products">
                <button className="bg-white text-orange-600 hover:text-orange-700 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Разгледай продуктите
                </button>
              </Link>
              <Link to="/contact">
                <button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Свържи се с нас
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;