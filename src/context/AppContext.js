import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // UI state
  language: 'bg',
  isLoading: false,
  cartOpen: false,
  
  // Shopping cart
  cartItems: [],
  cartTotal: 0,
  
  // Products
  products: [],
  categories: ['bread', 'pastries', 'cookies', 'cakes', 'special'],
  selectedCategory: 'all',
  
  // Orders
  orders: [],
  
  // User preferences
  theme: 'colorful',
  currency: 'BGN'
};

// Action types
const actionTypes = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
  TOGGLE_CART: 'TOGGLE_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CATEGORY: 'SET_CATEGORY',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
      
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case actionTypes.TOGGLE_CART:
      return { ...state, cartOpen: !state.cartOpen };
      
    case actionTypes.ADD_TO_CART:
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          cartItems: updatedItems,
          cartTotal: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.cartItems, { ...action.payload, quantity: 1 }];
        return {
          ...state,
          cartItems: newItems,
          cartTotal: calculateTotal(newItems)
        };
      }
      
    case actionTypes.REMOVE_FROM_CART:
      const filteredItems = state.cartItems.filter(item => item.id !== action.payload);
      return {
        ...state,
        cartItems: filteredItems,
        cartTotal: calculateTotal(filteredItems)
      };
      
    case actionTypes.UPDATE_CART_QUANTITY:
      const updatedQuantityItems = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        cartItems: updatedQuantityItems,
        cartTotal: calculateTotal(updatedQuantityItems)
      };
      
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        cartTotal: 0
      };
      
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
      
    case actionTypes.SET_CATEGORY:
      return { ...state, selectedCategory: action.payload };
      
    case actionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
      
    case actionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        )
      };
      
    default:
      return state;
  }
}

// Helper function to calculate cart total
function calculateTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bakery_language');
    const savedCart = localStorage.getItem('bakery_cart');
    
    if (savedLanguage) {
      dispatch({ type: actionTypes.SET_LANGUAGE, payload: savedLanguage });
    }
    
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      cartItems.forEach(item => {
        dispatch({ type: actionTypes.ADD_TO_CART, payload: item });
      });
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bakery_cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);
  
  // Action creators
  const actions = {
    setLanguage: (language) => {
      localStorage.setItem('bakery_language', language);
      dispatch({ type: actionTypes.SET_LANGUAGE, payload: language });
    },
    
    setLoading: (loading) => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    },
    
    toggleCart: () => {
      dispatch({ type: actionTypes.TOGGLE_CART });
    },
    
    addToCart: (product) => {
      dispatch({ type: actionTypes.ADD_TO_CART, payload: product });
    },
    
    removeFromCart: (productId) => {
      dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId });
    },
    
    updateCartQuantity: (productId, quantity) => {
      dispatch({ 
        type: actionTypes.UPDATE_CART_QUANTITY, 
        payload: { id: productId, quantity: parseInt(quantity) }
      });
    },
    
    clearCart: () => {
      dispatch({ type: actionTypes.CLEAR_CART });
    },
    
    setProducts: (products) => {
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: products });
    },
    
    setCategory: (category) => {
      dispatch({ type: actionTypes.SET_CATEGORY, payload: category });
    },
    
    addOrder: (order) => {
      dispatch({ type: actionTypes.ADD_ORDER, payload: order });
    },
    
    updateOrder: (orderId, updates) => {
      dispatch({ 
        type: actionTypes.UPDATE_ORDER, 
        payload: { id: orderId, ...updates }
      });
    }
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}