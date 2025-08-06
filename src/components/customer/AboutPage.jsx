import React from 'react';
import { Heart, Award, Clock, Star, Users, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-storefront-gold to-storefront-warm-gold bg-clip-text text-transparent mb-6">
            {t('footer.about')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {t('footer.aboutText')}
          </p>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white/40 backdrop-blur-sm rounded-3xl mb-16 relative z-10">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Нашата история
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  През 1999 година, семейство Петрови започна малка пекарна в сърцето на София с една мечта - 
                  да създава най-вкусните и най-пресни хлябове и сладкиши в града.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Вече повече от 25 години, CakeMania е станала любимо място за хиляди семейства. 
                  Всеки ден започваме работа в 4 сутрин, за да осигурим на нашите клиенти най-прясната продукция.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Използваме само най-качествените съставки - истинско френско масло, белгийски шоколад, 
                  пресни яйца от локални ферми и брашно от най-добрите млини в България.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop" 
                    alt="Торти и сладкиши"
                    className="w-full h-80 object-cover rounded-xl shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x400/f59e0b/ffffff?text=🍰+Торти';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white/40 backdrop-blur-sm rounded-3xl mb-16 relative z-10">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Нашите ценности
              </h2>
              <p className="text-xl text-gray-600">
                Това, което ни прави специални
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-white border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Любов към занаята</h3>
                <p className="text-gray-600">
                  Всеки продукт е направен с любов и внимание към детайлите, следвайки традиционните рецепти
                </p>
              </div>
              
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-white border-2 border-storefront-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-storefront-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Качество</h3>
                <p className="text-gray-600">
                  Използваме само най-добрите съставки и най-строгите стандарти за качество
                </p>
              </div>
              
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 bg-white border-2 border-storefront-bronze rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-10 h-10 text-storefront-bronze" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Семейни традиции</h3>
                <p className="text-gray-600">
                  Семейна пекарна, която предава традициите от поколение на поколение
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Statistics Section */}
        <section className="py-16 bg-white/40 backdrop-blur-sm rounded-3xl mb-16 relative z-10">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                CakeMania в цифри
              </h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white border-2 border-storefront-bronze rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-storefront-bronze" />
                </div>
                <div className="text-4xl font-bold text-storefront-bronze mb-2">25+</div>
                <p className="text-gray-600 font-medium">Години опит</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-red-500" />
                </div>
                <div className="text-4xl font-bold text-storefront-deep-green mb-2">5000+</div>
                <p className="text-gray-600 font-medium">Доволни клиенти</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white border-2 border-storefront-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-storefront-gold" />
                </div>
                <div className="text-4xl font-bold text-storefront-gold mb-2">100+</div>
                <p className="text-gray-600 font-medium">Видове продукти</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-white border-2 border-storefront-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-storefront-sage" />
                </div>
                <div className="text-4xl font-bold text-storefront-sage mb-2">365</div>
                <p className="text-gray-600 font-medium">Дни в годината</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white/40 backdrop-blur-sm rounded-3xl relative z-10">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Посетете ни
              </h2>
              <p className="text-xl text-gray-600">
                Намерете ни и се свържете с нас
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-white border-2 border-storefront-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-storefront-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Адрес</h3>
                <p className="text-gray-600">
                  ул. "Витоша" 15<br/>
                  1000 София, България
                </p>
              </div>
              
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-white border-2 border-storefront-warm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-storefront-warm-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Телефон</h3>
                <p className="text-gray-600">
                  +359 2 123 4567<br/>
                  +359 888 123 456
                </p>
              </div>
              
              <div className="text-center bg-white/60 rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-white border-2 border-storefront-bronze rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-storefront-bronze" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Имейл</h3>
                <p className="text-gray-600">
                  info@tortomaniya.bg<br/>
                  orders@tortomaniya.bg
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Работно време</h3>
                <div className="grid md:grid-cols-2 gap-6 text-lg">
                  <div>
                    <p className="font-semibold text-gray-700">Понеделник - Петък</p>
                    <p className="text-gray-600">6:00 - 20:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Събота - Неделя</p>
                    <p className="text-gray-600">7:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;