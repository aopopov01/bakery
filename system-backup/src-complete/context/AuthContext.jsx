import React, { createContext, useContext, useState, useEffect } from 'react';
import { emailService } from '../services/emailIntegration';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simulated user data structure
const createUser = (userData) => ({
  id: Date.now().toString(),
  email: userData.email,
  firstName: userData.firstName,
  lastName: userData.lastName,
  phone: userData.phone || '',
  address: userData.address || '',
  birthDate: userData.birthDate || '',
  createdAt: new Date().toISOString(),
  loyaltyPoints: 0,
  loyaltyTier: 'bronze', // bronze, silver, gold, platinum
  totalSpent: 0,
  orderCount: 0,
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    favoriteCategories: []
  }
});

// Loyalty tier thresholds (in лв spent)
const LOYALTY_TIERS = {
  bronze: { min: 0, max: 99.99, pointsMultiplier: 1, name: 'Бронз' },
  silver: { min: 100, max: 299.99, pointsMultiplier: 1.2, name: 'Сребро' },
  gold: { min: 300, max: 699.99, pointsMultiplier: 1.5, name: 'Злато' },
  platinum: { min: 700, max: Infinity, pointsMultiplier: 2, name: 'Платина' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' }); // signin or signup

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('bakery_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('bakery_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('bakery_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bakery_user');
    }
  }, [user]);

  // Calculate loyalty tier based on total spent
  const calculateLoyaltyTier = (totalSpent) => {
    for (const [tier, config] of Object.entries(LOYALTY_TIERS)) {
      if (totalSpent >= config.min && totalSpent <= config.max) {
        return tier;
      }
    }
    return 'bronze';
  };

  // Sign up new user
  const signUp = async (userData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (simulate email uniqueness)
      const existingUsers = JSON.parse(localStorage.getItem('bakery_users') || '[]');
      const emailExists = existingUsers.some(u => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('Потребител с този имейл вече съществува');
      }

      const newUser = createUser(userData);
      
      // Save to users collection
      existingUsers.push(newUser);
      localStorage.setItem('bakery_users', JSON.stringify(existingUsers));
      
      // Set as current user
      setUser(newUser);
      setAuthModal({ isOpen: false, mode: 'signin' });
      
      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(newUser);
        console.log('✅ Welcome email sent successfully');
      } catch (emailError) {
        console.error('⚠️ Failed to send welcome email:', emailError);
        // Don't fail signup if email fails
      }
      
      return { success: true, user: newUser };
    } catch (error) {
      throw error;
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUsers = JSON.parse(localStorage.getItem('bakery_users') || '[]');
      const foundUser = existingUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Невалиден имейл или парола');
      }

      // In real app, we'd verify password hash
      // For demo, we'll just accept any password
      
      setUser(foundUser);
      setAuthModal({ isOpen: false, mode: 'signin' });
      
      return { success: true, user: foundUser };
    } catch (error) {
      throw error;
    }
  };

  // Sign out user
  const signOut = () => {
    setUser(null);
    // Don't clear all localStorage, just user session
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      
      // Update in users collection
      const existingUsers = JSON.parse(localStorage.getItem('bakery_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('bakery_users', JSON.stringify(existingUsers));
      }
      
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      throw error;
    }
  };

  // Add loyalty points and update tier
  const addLoyaltyPoints = (purchaseAmount) => {
    if (!user) return null;

    const currentTier = LOYALTY_TIERS[user.loyaltyTier];
    const pointsEarned = Math.floor(purchaseAmount * currentTier.pointsMultiplier);
    const newTotalSpent = user.totalSpent + purchaseAmount;
    const newTier = calculateLoyaltyTier(newTotalSpent);

    const updatedUser = {
      ...user,
      loyaltyPoints: user.loyaltyPoints + pointsEarned,
      totalSpent: newTotalSpent,
      orderCount: user.orderCount + 1,
      loyaltyTier: newTier
    };

    // Update user profile immediately
    setUser(updatedUser);
    
    // Also update in localStorage and users collection
    try {
      const existingUsers = JSON.parse(localStorage.getItem('bakery_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('bakery_users', JSON.stringify(existingUsers));
      }
    } catch (error) {
      console.error('Failed to update user in storage:', error);
    }
    
    return {
      pointsEarned,
      tierChanged: newTier !== user.loyaltyTier,
      newTier: LOYALTY_TIERS[newTier].name,
      oldTier: LOYALTY_TIERS[user.loyaltyTier].name,
      newTotalPoints: updatedUser.loyaltyPoints,
      newTotalSpent: newTotalSpent
    };
  };

  // Open auth modal
  const openAuthModal = (mode = 'signin') => {
    setAuthModal({ isOpen: true, mode });
  };

  // Close auth modal
  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const value = {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,
    authModal,
    loyaltyTiers: LOYALTY_TIERS,

    // Actions
    signUp,
    signIn,
    signOut,
    updateProfile,
    addLoyaltyPoints,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;