import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ChefHatLogo from './ChefHatLogo';

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <ChefHatLogo size="small" />
              <h3 className="text-xl font-bold">ТортоМания</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-xl flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-cyan-600 hover:bg-cyan-700 rounded-xl flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t('footer.contact')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{t('footer.address')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-gray-300">{t('footer.phone')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">{t('footer.email')}</p>
              </div>
            </div>
          </div>
          
          {/* Opening hours */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              {t('footer.hours')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">{t('footer.weekdays')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">{t('footer.weekend')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              Бюлетин
            </h3>
            <p className="text-gray-300 mb-4">
              Абонирайте се за най-новите оферти и продукти
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                Абонирай се
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ТортоМания. {t('footer.rights')}.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Условия за ползване</button>
              <button className="hover:text-white transition-colors">Поверителност</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 via-pink-500 via-purple-500 to-blue-500"></div>
    </footer>
  );
}

export default Footer;