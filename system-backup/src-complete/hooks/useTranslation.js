import { useState, useEffect } from 'react';

// Bulgarian translations
const translations = {
  bg: {
    // Navigation
    nav: {
      home: 'Начало',
      products: 'Продукти',
      about: 'За нас',
      contact: 'Контакти',
      cart: 'Кошница',
      admin: 'Администрация'
    },
    
    // Home page
    home: {
      hero: {
        title: 'Добре дошли в ТортоМания',
        subtitle: 'Магически сладки творения и съставки за домашно печене',
        cta: 'Разгледай продуктите',
        freshDaily: 'Пресни всеки ден',
        traditionalRecipes: 'Традиционни рецепти',
        qualityIngredients: 'Качествени съставки'
      },
      featured: {
        title: 'Популярни продукти',
        subtitle: 'Най-обичаните от нашите клиенти'
      },
      categories: {
        title: 'Категории продукти',
        bread: 'Хляб и хлебни изделия',
        pastries: 'Сладкиши и торти',
        cookies: 'Бисквити и курабии',
        cakes: 'Торти по поръчка',
        special: 'Специални изделия'
      }
    },
    
    // Products
    products: {
      title: 'Магическа колекция',
      subtitle: 'Открийте нашите вълшебни торти, сладки хапки и съставки',
      search: 'Търсене на продукти...',
      filter: 'Филтриране по категория',
      all: 'Всички',
      bread: 'Хляб',
      pastries: 'Сладкиши',
      cookies: 'Бисквити',
      cakes: 'Торти',
      special: 'Специални',
      addToCart: 'Добави в кошницата',
      outOfStock: 'Изчерпан',
      inStock: 'В наличност'
    },
    
    // Shopping cart
    cart: {
      title: 'Кошница за пазаруване',
      empty: 'Кошницата ви е празна',
      continueShopping: 'Продължи пазаруването',
      quantity: 'Количество',
      price: 'Цена',
      total: 'Общо',
      subtotal: 'Междинна сума',
      delivery: 'Доставка',
      checkout: 'Към поръчката',
      remove: 'Премахни',
      clear: 'Изчисти кошницата'
    },
    
    // Checkout
    checkout: {
      title: 'Завършване на поръчката',
      customerInfo: 'Информация за клиента',
      name: 'Име и фамилия',
      email: 'Имейл адрес',
      phone: 'Телефон',
      address: 'Адрес за доставка',
      city: 'Град',
      notes: 'Забележки към поръчката',
      delivery: {
        title: 'Начин на доставка',
        pickup: 'Вземане от пекарната',
        delivery: 'Доставка до дома',
        pickupTime: 'Време за вземане',
        deliveryTime: 'Време за доставка'
      },
      payment: {
        title: 'Начин на плащане',
        cash: 'В брой при доставка',
        card: 'Банкова карта',
        revolut: 'Revolut Pay'
      },
      placeOrder: 'Поръчай сега',
      processing: 'Обработване...'
    },
    
    // Common
    common: {
      loading: 'Зареждане...',
      error: 'Възникна грешка',
      success: 'Успешно!',
      save: 'Запази',
      cancel: 'Отказ',
      edit: 'Редактирай',
      delete: 'Изтрий',
      view: 'Преглед',
      back: 'Назад',
      next: 'Напред',
      previous: 'Предишна',
      search: 'Търсене',
      filter: 'Филтър',
      sort: 'Сортиране',
      currency: 'лв',
      weight: 'гр',
      pieces: 'бр'
    },
    
    // Footer
    footer: {
      about: 'За ТортоМания',
      aboutText: 'Семейна пекарна, която вече 25 години приготвя най-вкусните хлябове и сладкиши в града.',
      contact: 'Контакти',
      address: 'ул. "Хлебна" №15, София',
      phone: '+359 2 123 4567',
      email: 'info@zlatnapekarna.bg',
      hours: 'Работно време',
      weekdays: 'Пон-Пет: 6:00 - 20:00',
      weekend: 'Съб-Нед: 7:00 - 18:00',
      social: 'Последвайте ни',
      rights: 'Всички права запазени'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      cart: 'Cart',
      admin: 'Admin'
    },
    
    // Home page
    home: {
      hero: {
        title: 'Welcome to Golden Bakery',
        subtitle: 'Authentic Bulgarian breads and pastries, made with love every day',
        cta: 'Browse Products',
        freshDaily: 'Fresh Daily',
        traditionalRecipes: 'Traditional Recipes',
        qualityIngredients: 'Quality Ingredients'
      },
      featured: {
        title: 'Featured Products',
        subtitle: 'Customer favorites'
      },
      categories: {
        title: 'Product Categories',
        bread: 'Bread & Bakery',
        pastries: 'Pastries & Cakes',
        cookies: 'Cookies & Biscuits',
        cakes: 'Custom Cakes',
        special: 'Special Items'
      }
    },
    
    // Products
    products: {
      title: 'All Products',
      subtitle: 'Discover our full range of fresh breads and pastries',
      search: 'Search products...',
      filter: 'Filter by category',
      all: 'All',
      bread: 'Bread',
      pastries: 'Pastries',
      cookies: 'Cookies',
      cakes: 'Cakes',
      special: 'Special',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock'
    },
    
    // Shopping cart
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      subtotal: 'Subtotal',
      delivery: 'Delivery',
      checkout: 'Checkout',
      remove: 'Remove',
      clear: 'Clear Cart'
    },
    
    // Checkout
    checkout: {
      title: 'Checkout',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone',
      address: 'Delivery Address',
      city: 'City',
      notes: 'Order Notes',
      delivery: {
        title: 'Delivery Method',
        pickup: 'Pickup from Bakery',
        delivery: 'Home Delivery',
        pickupTime: 'Pickup Time',
        deliveryTime: 'Delivery Time'
      },
      payment: {
        title: 'Payment Method',
        cash: 'Cash on Delivery',
        card: 'Credit Card',
        revolut: 'Revolut Pay'
      },
      placeOrder: 'Place Order',
      processing: 'Processing...'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      currency: 'BGN',
      weight: 'g',
      pieces: 'pcs'
    },
    
    // Footer
    footer: {
      about: 'About Golden Bakery',
      aboutText: 'A family bakery that has been making the most delicious breads and pastries in the city for 25 years.',
      contact: 'Contact',
      address: '15 Bread Street, Sofia',
      phone: '+359 2 123 4567',
      email: 'info@goldenbakery.bg',
      hours: 'Opening Hours',
      weekdays: 'Mon-Fri: 6:00 - 20:00',
      weekend: 'Sat-Sun: 7:00 - 18:00',
      social: 'Follow Us',
      rights: 'All rights reserved'
    }
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bakery_language') || 'bg';
  });
  
  useEffect(() => {
    localStorage.setItem('bakery_language', language);
    document.documentElement.lang = language;
  }, [language]);
  
  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return defaultValue;
      }
    }
    
    return value || defaultValue;
  };
  
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };
  
  const formatPrice = (price) => {
    const formattedPrice = price.toFixed(2).replace('.', ',');
    return language === 'bg' ? `${formattedPrice} лв` : `${formattedPrice} BGN`;
  };
  
  const formatWeight = (weight) => {
    return language === 'bg' ? `${weight}гр` : `${weight}g`;
  };
  
  return {
    t,
    language,
    changeLanguage,
    formatPrice,
    formatWeight,
    isBulgarian: language === 'bg'
  };
}