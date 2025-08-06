import React from 'react';
import { MapPin, Clock, Phone, Navigation, Star } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

function StoresPage() {
  const { t } = useTranslation();

  // Demo store locations
  const stores = [
    {
      id: 1,
      name: 'CakeMania - Център',
      address: 'бул. "Витоша" 25, 1000 София',
      phone: '+359 2 123 4567',
      hours: {
        weekdays: 'Пон-Пет: 6:00 - 20:00',
        weekend: 'Съб-Нед: 7:00 - 18:00'
      },
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
      rating: 4.8,
      reviews: 324,
      features: ['Кафе зона', 'Поръчки онлайн', 'Паркинг'],
      description: 'Нашият главен магазин в сърцето на София с най-голямата селекция от торти и сладкиши.'
    },
    {
      id: 2,
      name: 'CakeMania - Младост',
      address: 'бул. "Александър Малинов" 78, 1715 София',
      phone: '+359 2 987 6543',
      hours: {
        weekdays: 'Пон-Пет: 7:00 - 19:00',
        weekend: 'Съб-Нед: 8:00 - 17:00'
      },
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      rating: 4.9,
      reviews: 187,
      features: ['Детска зона', 'Доставка', 'WiFi'],
      description: 'Модерен магазин в квартал Младост с уютна атмосфера и специална детска зона.'
    },
    {
      id: 3,
      name: 'CakeMania - Лозенец',
      address: 'ул. "Филип Кутев" 12, 1421 София',
      phone: '+359 2 555 1234',
      hours: {
        weekdays: 'Пон-Пет: 6:30 - 19:30',
        weekend: 'Съб-Нед: 7:30 - 17:30'
      },
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop',
      rating: 4.7,
      reviews: 256,
      features: ['Тераса', 'Френска патисерия', 'Винтидж дизайн'],
      description: 'Елегантен магазин с френски шарм и изискани десерти в престижния квартал Лозенец.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-storefront-gold to-storefront-warm-gold bg-clip-text text-transparent mb-6">
            Нашите магазини
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-storefront-deep-green max-w-4xl mx-auto leading-relaxed">
            Посетете ни на някоя от нашите локации в София и се насладете на автентичното изживяване CakeMania
          </p>
        </section>

        {/* Stores Grid */}
        <section className="grid gap-8 md:gap-12">
          {stores.map((store, index) => (
            <div
              key={store.id}
              className={`bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-cols-2' : ''}`}>
                {/* Store Image */}
                <div className={`relative h-80 md:h-96 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400/f59e0b/ffffff?text=🏪+Магазин';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-800">{store.rating}</span>
                      <span className="text-sm text-gray-600">({store.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-storefront-deep-green mb-4">
                    {store.name}
                  </h2>
                  
                  <p className="text-storefront-rich-green/90 mb-6 leading-relaxed">
                    {store.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {store.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-storefront-gold/20 text-storefront-deep-green px-3 py-1 rounded-full text-sm font-medium border border-storefront-gold/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white border-2 border-storefront-gold rounded-xl flex items-center justify-center mt-0.5">
                        <MapPin className="w-5 h-5 text-storefront-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-storefront-deep-green mb-1">Адрес</h3>
                        <p className="text-storefront-rich-green/90">{store.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white border-2 border-storefront-warm-gold rounded-xl flex items-center justify-center mt-0.5">
                        <Phone className="w-5 h-5 text-storefront-warm-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-storefront-deep-green mb-1">Телефон</h3>
                        <p className="text-storefront-rich-green/90">{store.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-white border-2 border-storefront-bronze rounded-xl flex items-center justify-center mt-0.5">
                        <Clock className="w-5 h-5 text-storefront-bronze" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-storefront-deep-green mb-1">Работно време</h3>
                        <p className="text-storefront-rich-green/90">{store.hours.weekdays}</p>
                        <p className="text-storefront-rich-green/90">{store.hours.weekend}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-success flex items-center justify-center space-x-2 flex-1">
                      <Navigation className="w-4 h-4" />
                      <span>Навигация</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center space-x-2 flex-1">
                      <Phone className="w-4 h-4" />
                      <span>Обади се</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default StoresPage;