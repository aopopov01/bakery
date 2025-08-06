import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Award, Clock, ChefHat, CheckCircle, Sparkles, Flame } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';
import ChefHatLogo from '../shared/ChefHatLogo';
import croissantVideo from '../../assets/Video Croissant.mp4';
import cupcakeVideo from '../../assets/Video The Cupcake.mp4';

function HomePage() {
  const { t, formatPrice } = useTranslation();
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

      
      {/* Hero Section */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Main heading */}
            <div className="mb-8">
              <div className="mb-6 transform hover:scale-110 transition-all duration-500">
                <ChefHatLogo size="large" className="mx-auto" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 drop-shadow-sm bg-gradient-to-r from-yellow-600 via-storefront-warm-gold via-storefront-gold via-storefront-rich-gold to-yellow-800 bg-clip-text text-transparent">
                <div className="flex flex-col items-center">
                  <div className="text-center">Cake</div>
                  <div className="text-center -mt-2">Mania</div>
                </div>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-storefront-deep-green font-medium max-w-3xl mx-auto leading-relaxed opacity-100">
                {t('home.hero.subtitle')}
              </p>
            </div>
            

          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="-mt-16 pb-4 bg-smooth-ivory/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-storefront-deep-green mb-4">
              Нашите топ продукти
            </h2>
            <p className="text-lg sm:text-xl text-storefront-rich-green max-w-2xl mx-auto">
              Открийте най-обичаните от нашите клиенти сладки творения
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8">
            {sampleProducts.map((product, index) => (
              <div key={product.id} className="bg-smooth-cream rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group border border-smooth-gold/20 backdrop-blur-sm">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name.bg}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=🍞';
                    }}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${
                    index === 0 ? 'bg-gradient-to-r from-complement-dusty-rose to-complement-rose-gold text-white' : 
                    index === 1 ? 'bg-gradient-to-r from-storefront-gold to-storefront-warm-gold text-storefront-deep-green' : 
                    'bg-gradient-to-r from-complement-warm-brown to-complement-cocoa text-storefront-cream'
                  }`}>
                    {index === 0 ? 'Хит' : index === 1 ? 'Ново' : 'Топ'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-storefront-gold transition-colors">{product.name.bg}</h3>
                  <p className="text-gray-600 mb-4">{product.description.bg}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-storefront-deep-green">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => actions.addToCart(product)}
                      className="bg-gradient-to-r from-storefront-gold to-storefront-warm-gold text-storefront-deep-green px-4 py-2 rounded-lg font-bold hover:from-storefront-warm-gold hover:to-storefront-gold transition-all border border-storefront-bronze/30"
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
              <button className="bg-gradient-to-r from-storefront-deep-green to-storefront-rich-green text-storefront-cream px-8 py-3 rounded-xl font-bold hover:from-storefront-rich-green hover:to-storefront-teal transition-all transform hover:scale-105 border border-storefront-gold/30 shadow-md hover:shadow-lg">
                Виж всички продукти
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-smooth-beige/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-storefront-deep-green mb-4">
              Какво казват нашите клиенти
            </h2>
            <p className="text-xl text-storefront-rich-green">
              Истински отзиви от доволни клиенти
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-storefront-cream rounded-2xl p-6 shadow-md border border-complement-soft-pink/40 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-complement-dusty-rose to-complement-rose-gold rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  М
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-storefront-deep-green">Мария Петрова</h4>
                  <div className="flex text-storefront-gold">★★★★★</div>
                </div>
              </div>
              <p className="text-storefront-rich-green italic">
                "Невероятни торти! Поръчвах за рождения ден на дъщеря ми и всички гости бяха възхитени. Качеството е на най-високо ниво!"
              </p>
            </div>
            
            <div className="bg-storefront-cream rounded-2xl p-6 shadow-md border border-storefront-gold/30 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-storefront-gold to-storefront-warm-gold rounded-full flex items-center justify-center text-storefront-deep-green font-bold text-lg shadow-md">
                  И
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-storefront-deep-green">Иван Георгиев</h4>
                  <div className="flex text-storefront-gold">★★★★★</div>
                </div>
              </div>
              <p className="text-storefront-rich-green italic">
                "Винаги поръчвам от CakeMania за специални случаи. Вкусът и качеството са непревзойдени, а обслужването е перфектно!"
              </p>
            </div>
            
            <div className="bg-storefront-cream rounded-2xl p-6 shadow-md border border-complement-blush/40 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-complement-warm-brown to-complement-cocoa rounded-full flex items-center justify-center text-storefront-cream font-bold text-lg shadow-md">
                  Е
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-storefront-deep-green">Елена Димитрова</h4>
                  <div className="flex text-storefront-gold">★★★★★</div>
                </div>
              </div>
              <p className="text-storefront-rich-green italic">
                "Макароните са като от Париж! Изключително вкусни и красиви. Препоръчвам на всички любители на качествените десерти."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Statistics */}
      <section className="py-16 bg-smooth-ivory/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-storefront-deep-green mb-4">
              Защо да изберете CakeMania?
            </h2>
            <p className="text-xl text-storefront-rich-green/90">
              Цифрите говорят за качеството ни
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-complement-dusty-rose/85 to-complement-rose-gold/85 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-storefront-gold mb-2">2500+</div>
              <p className="text-storefront-rich-green/90 font-medium">Доволни клиенти</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-storefront-gold/85 to-storefront-warm-gold/85 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-10 h-10 text-storefront-deep-green" />
              </div>
              <div className="text-4xl font-bold text-storefront-deep-green mb-2">50+</div>
              <p className="text-storefront-rich-green/90 font-medium">Видове торти</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-complement-warm-brown/85 to-complement-cocoa/85 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-10 h-10 text-storefront-cream" />
              </div>
              <div className="text-4xl font-bold text-storefront-bronze mb-2">5</div>
              <p className="text-storefront-rich-green/90 font-medium">Години опит</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Daily Process Timeline */}
      <section className="py-16 bg-smooth-cream/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-storefront-deep-green mb-4">
              Нашият ежедневен процес
            </h2>
            <p className="text-xl text-storefront-rich-green/90">
              От сурови съставки до перфектни сладости
            </p>
          </div>
          
          <div className="relative">
            
            {/* Mobile Timeline - Single Column Layout */}
            <div className="md:hidden space-y-4 sm:space-y-6 px-2 sm:px-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-smooth-gold/70 shadow-md shadow-smooth-gold/20 rounded-full flex items-center justify-center flex-shrink-0 bg-smooth-cream/90 group">
                  <Sparkles className="w-6 h-6 text-smooth-gold group-hover:animate-spin group-hover:text-smooth-warm-gold" />
                </div>
                <div className="bg-smooth-cream/90 rounded-2xl p-4 shadow-md flex-1 border border-smooth-gold/20">
                  <h3 className="text-lg font-bold text-storefront-deep-green mb-1">4:00 - 6:00 - Подготовка</h3>
                  <p className="text-storefront-rich-green/90 text-sm">Започваме деня с подбор на най-свежите съставки и подготовка на работното място</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-smooth-sage/70 shadow-md shadow-smooth-sage/20 rounded-full flex items-center justify-center flex-shrink-0 bg-smooth-cream/90">
                  <ChefHat className="w-6 h-6 text-smooth-sage" />
                </div>
                <div className="bg-smooth-cream/90 rounded-2xl p-4 shadow-md flex-1 border border-smooth-gold/20">
                  <h3 className="text-lg font-bold text-storefront-deep-green mb-1">6:00 - 8:00 - Приготвяне</h3>
                  <p className="text-storefront-rich-green/90 text-sm">Замесваме тестата и приготвяме кремовете с любов и внимание към всеки детайл</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-smooth-bronze/70 shadow-md shadow-smooth-bronze/20 rounded-full flex items-center justify-center flex-shrink-0 bg-smooth-cream/90 group">
                  <Flame className="w-6 h-6 text-smooth-bronze group-hover:text-smooth-warm-gold" />
                </div>
                <div className="bg-smooth-cream/90 rounded-2xl p-4 shadow-md flex-1 border border-smooth-gold/20">
                  <h3 className="text-lg font-bold text-storefront-deep-green mb-1">8:00 - 10:00 - Печене</h3>
                  <p className="text-storefront-rich-green/90 text-sm">Печем в специални фурни при оптимални температури за постигане на перфектния вкус</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 border-4 border-smooth-mint/70 shadow-md shadow-smooth-mint/20 rounded-full flex items-center justify-center flex-shrink-0 bg-smooth-cream/90 group">
                  <CheckCircle className="w-6 h-6 text-smooth-mint group-hover:text-smooth-sage" />
                </div>
                <div className="bg-smooth-cream/90 rounded-2xl p-4 shadow-md flex-1 border border-smooth-gold/20">
                  <h3 className="text-lg font-bold text-storefront-deep-green mb-1">10:00 - 12:00 - Готови</h3>
                  <p className="text-storefront-rich-green/90 text-sm">Продуктите са готови за продажба - свежи, вкусни и красиво оформени</p>
                </div>
              </div>
            </div>

            {/* Desktop Timeline - Alternating Layout */}
            <div className="hidden md:block py-6">
              <div className="flex items-center md:justify-start justify-center">
                <div className="md:text-right">
                  <div className="bg-smooth-cream/90 rounded-2xl p-6 inline-block max-w-md border border-smooth-gold/20">
                    <h3 className="text-xl font-bold text-storefront-deep-green mb-2">4:00 - 6:00 - Подготовка</h3>
                    <p className="text-storefront-rich-green/90">Започваме деня с подбор на най-свежите съставки и подготовка на работното място</p>
                  </div>
                </div>
              </div>

              {/* Video matching stage 1 width */}
              <div className="flex items-center md:justify-start justify-center">
                <div className="md:text-right">
                  <div className="rounded-xl overflow-hidden border-2 border-smooth-gold/30 bg-white inline-block w-[28rem] hidden lg:block">
                    <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden">
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{filter: 'contrast(1.1) saturate(1.2)'}}
                      >
                        <source src={croissantVideo} type="video/mp4" />
                        {/* Fallback image */}
                        <img 
                          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=450&h=240&fit=crop" 
                          alt="Croissant preparation process"
                          className="w-full h-full object-cover"
                          style={{filter: 'contrast(1.1) saturate(1.2)'}}
                        />
                      </video>
                    </div>
                  </div>
                </div>
                <div className="flex-1 md:text-right md:pr-8 flex justify-end">
                  <div className="bg-smooth-cream/90 rounded-2xl p-6 inline-block max-w-md border border-smooth-gold/20">
                    <h3 className="text-xl font-bold text-storefront-deep-green mb-2">6:00 - 8:00 - Приготвяне</h3>
                    <p className="text-storefront-rich-green/90">Замесваме тестата и приготвяме кремовете с любов и внимание към всеки детайл</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center md:justify-start justify-center -mt-16">
                <div className="md:text-right">
                  <div className="bg-smooth-cream/90 rounded-2xl p-6 inline-block max-w-md border border-smooth-gold/20">
                    <h3 className="text-xl font-bold text-storefront-deep-green mb-2">8:00 - 10:00 - Печене</h3>
                    <p className="text-storefront-rich-green/90">Печем в специални фурни при оптимални температури за постигане на перфектния вкус</p>
                  </div>
                </div>
                <div className="flex-1 md:text-right md:pr-8 flex justify-end">
                  <div className="rounded-xl overflow-hidden border-2 border-smooth-gold/30 inline-block w-[28rem] hidden lg:block">
                    <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden">
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={{filter: 'contrast(1.2) saturate(1.3) brightness(1.1)'}}
                      >
                        <source src={cupcakeVideo} type="video/mp4" />
                        {/* Fallback image */}
                        <img 
                          src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=450&h=240&fit=crop" 
                          alt="Cupcake decoration process"
                          className="w-full h-full object-cover"
                          style={{filter: 'contrast(1.2) saturate(1.3) brightness(1.1)'}}
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center md:justify-start justify-center">
                <div className="flex-1 md:text-right md:pr-8 flex justify-end">
                  <div className="bg-smooth-cream/90 rounded-2xl p-6 inline-block max-w-md border border-smooth-gold/20">
                    <h3 className="text-xl font-bold text-storefront-deep-green mb-2">10:00 - 12:00 - Готови</h3>
                    <p className="text-storefront-rich-green/90">Продуктите са готови за продажба - свежи, вкусни и красиво оформени</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 bg-smooth-pearl/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-storefront-deep-green mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-xl text-storefront-rich-green/90">Разгледайте нашите категории продукти</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category cards */}
            <Link to="/products?category=cakes" className="group">
              <div className="bg-storefront-cream/80 rounded-2xl p-8 text-center group-hover:scale-105 transition-all duration-300 shadow-md border border-storefront-gold/30 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white border-2 border-storefront-gold rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🎂</div>
                </div>
                <h3 className="text-xl font-bold text-storefront-deep-green mb-3">
                  Торти
                </h3>
                <p className="text-storefront-rich-green/90 mb-4">Шоколадови, ягодови и ванилови торти за всеки повод</p>
                <div className="inline-flex items-center text-storefront-bronze font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=sweet-bites" className="group">
              <div className="bg-storefront-cream/80 rounded-2xl p-8 text-center group-hover:scale-105 transition-all duration-300 shadow-md border border-storefront-gold/30 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white border-2 border-storefront-warm-gold rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🍪</div>
                </div>
                <h3 className="text-xl font-bold text-storefront-deep-green mb-3">
                  Сладки хапки
                </h3>
                <p className="text-storefront-rich-green/90 mb-4">Мъфини, макарони, поничета и хрупкави бисквити</p>
                <div className="inline-flex items-center text-storefront-bronze font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
            
            <Link to="/products?category=ingredients" className="group">
              <div className="bg-storefront-cream/80 rounded-2xl p-8 text-center group-hover:scale-105 transition-all duration-300 shadow-md border border-storefront-bronze/30 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white border-2 border-storefront-bronze rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <div className="text-3xl">🥄</div>
                </div>
                <h3 className="text-xl font-bold text-storefront-deep-green mb-3">
                  Съставки за печене
                </h3>
                <p className="text-storefront-rich-green/90 mb-4">Брашно, ванилия, шоколад и всичко за домашно печене</p>
                <div className="inline-flex items-center text-storefront-bronze font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Разгледай</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-smooth-gold/60 via-smooth-warm-gold/60 to-smooth-bronze/60 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-smooth-emerald/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-smooth-cream">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Започнете пазаруването днес!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-100">
              Открийте най-вкусните торти и сладки хапки в града. Доставка до дома или вземане от пекарната.
            </p>
            <div className="space-x-4">
              <Link to="/products">
                <button className="btn-success text-lg py-4 px-8">
                  Разгледай продуктите
                </button>
              </Link>
              <Link to="/contact">
                <button className="btn-secondary text-lg py-4 px-8">
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