import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import ChefHatLogo from './ChefHatLogo';

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-storefront-deep-green via-storefront-rich-green to-storefront-teal text-storefront-cream">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <ChefHatLogo size="small" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 via-storefront-warm-gold via-storefront-gold via-storefront-rich-gold to-yellow-800 bg-clip-text text-transparent leading-tight">
                <div className="text-center">Cake</div>
                <div className="text-center -mt-1">Mania</div>
              </h3>
            </div>
            <p className="text-storefront-cream/80 mb-6 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-storefront-gold to-storefront-warm-gold bg-clip-text text-transparent">
              {t('footer.contact')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-storefront-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-storefront-cream/80">{t('footer.address')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-storefront-warm-gold flex-shrink-0" />
                <p className="text-storefront-cream/80">{t('footer.phone')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-storefront-bronze flex-shrink-0" />
                <p className="text-storefront-cream/80">{t('footer.email')}</p>
              </div>
            </div>
          </div>
          
          {/* Opening hours */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-storefront-gold to-storefront-warm-gold bg-clip-text text-transparent">
              {t('footer.hours')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-storefront-gold flex-shrink-0" />
                <div>
                  <p className="text-storefront-cream/80 font-medium">{t('footer.weekdays')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-storefront-warm-gold flex-shrink-0" />
                <div>
                  <p className="text-storefront-cream/80 font-medium">{t('footer.weekend')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gradient bg-gradient-to-r from-storefront-gold to-storefront-warm-gold bg-clip-text text-transparent">
              Бюлетин
            </h3>
            <p className="text-storefront-cream/80 mb-4">
              Абонирайте се за най-новите оферти и продукти
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="w-full px-4 py-3 bg-storefront-cream/10 border border-storefront-gold/30 rounded-xl text-storefront-cream placeholder-storefront-cream/60 focus:outline-none focus:ring-2 focus:ring-storefront-gold focus:border-transparent transition-all"
              />
              <button className="w-full bg-gradient-to-r from-storefront-gold to-storefront-warm-gold hover:from-storefront-warm-gold hover:to-storefront-gold text-storefront-deep-green font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                Абонирай се
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-storefront-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-storefront-cream/70 text-sm mb-4 md:mb-0">
              © 2024 CakeMania. {t('footer.rights')}.
            </p>
            <div className="flex items-center space-x-6 text-sm text-storefront-cream/70">
              <button className="hover:text-storefront-cream transition-colors">Условия за ползване</button>
              <button className="hover:text-storefront-cream transition-colors">Поверителност</button>
              <button className="hover:text-storefront-cream transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-storefront-gold via-storefront-warm-gold via-storefront-bronze to-storefront-rich-gold"></div>
    </footer>
  );
}

export default Footer;