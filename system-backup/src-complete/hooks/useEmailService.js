// React Hook for MCP Email Service Integration
// Provides easy integration with Bulgarian Bakery email system

import { useState, useEffect, useCallback } from 'react';
import { emailService } from '../services/emailIntegration';

export const useEmailService = () => {
  const [emailStats, setEmailStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load email statistics
  const loadEmailStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await emailService.getEmailStats();
      setEmailStats(stats);
      
    } catch (err) {
      console.error('Failed to load email stats:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send order confirmation email
  const sendOrderConfirmation = useCallback(async (orderData) => {
    try {
      const success = await emailService.sendOrderConfirmation(orderData);
      
      if (success) {
        // Refresh stats after sending
        await loadEmailStats();
      }
      
      return success;
    } catch (err) {
      console.error('Failed to send order confirmation:', err);
      setError(err.message);
      return false;
    }
  }, [loadEmailStats]);

  // Send status update email
  const sendStatusUpdate = useCallback(async (orderId, newStatus, customerEmail, customerName, orderNumber) => {
    try {
      const success = await emailService.sendStatusUpdate(
        orderId, 
        newStatus, 
        { email: customerEmail, firstName: customerName },
        orderNumber
      );
      
      if (success) {
        await loadEmailStats();
      }
      
      return success;
    } catch (err) {
      console.error('Failed to send status update:', err);
      setError(err.message);
      return false;
    }
  }, [loadEmailStats]);

  // Send low stock alert
  const sendLowStockAlert = useCallback(async (products, adminEmail) => {
    try {
      const success = await emailService.sendLowStockAlert(products, adminEmail);
      
      if (success) {
        await loadEmailStats();
      }
      
      return success;
    } catch (err) {
      console.error('Failed to send low stock alert:', err);
      setError(err.message);
      return false;
    }
  }, [loadEmailStats]);

  // Send loyalty reward notification
  const sendLoyaltyReward = useCallback(async (userData, rewardData) => {
    try {
      const success = await emailService.sendLoyaltyReward(userData, rewardData);
      
      if (success) {
        await loadEmailStats();
      }
      
      return success;
    } catch (err) {
      console.error('Failed to send loyalty reward:', err);
      setError(err.message);
      return false;
    }
  }, [loadEmailStats]);

  // Process email queue
  const processEmailQueue = useCallback(async () => {
    try {
      await emailService.processQueue();
      await loadEmailStats();
      return true;
    } catch (err) {
      console.error('Failed to process email queue:', err);
      setError(err.message);
      return false;
    }
  }, [loadEmailStats]);

  // Initialize email service and load stats
  useEffect(() => {
    loadEmailStats();
    
    // Auto-refresh stats every 2 minutes
    const interval = setInterval(loadEmailStats, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loadEmailStats]);

  return {
    // State
    emailStats,
    isLoading,
    error,
    
    // Actions
    sendOrderConfirmation,
    sendStatusUpdate,
    sendLowStockAlert,
    sendLoyaltyReward,
    processEmailQueue,
    refreshStats: loadEmailStats,
    
    // Computed values
    totalSent: emailStats?.totalSent || 0,
    queueLength: emailStats?.queueLength || 0,
    failedCount: emailStats?.totalFailed || 0,
    isProcessing: emailStats?.isProcessing || false,
    successRate: emailStats?.successRate || '100%'
  };
};

// Hook for order management integration
export const useOrderEmails = () => {
  const { sendOrderConfirmation, sendStatusUpdate } = useEmailService();

  // Handle order creation with automatic email
  const createOrderWithEmail = useCallback(async (orderData, createOrderFn) => {
    try {
      // Create the order first
      const order = await createOrderFn(orderData);
      
      if (order) {
        // Send confirmation email
        const emailSent = await sendOrderConfirmation(order);
        
        if (emailSent) {
          console.log(`✅ Order confirmation email sent for order #${order.orderNumber}`);
        } else {
          console.warn(`⚠️ Order created but email failed for #${order.orderNumber}`);
        }
      }
      
      return order;
    } catch (error) {
      console.error('Failed to create order with email:', error);
      throw error;
    }
  }, [sendOrderConfirmation]);

  // Handle status updates with automatic email
  const updateOrderStatusWithEmail = useCallback(async (orderId, newStatus, orderData, updateOrderFn) => {
    try {
      // Update the order status first
      const success = await updateOrderFn(orderId, newStatus);
      
      if (success && orderData) {
        // Send status update email
        const emailSent = await sendStatusUpdate(
          orderId,
          newStatus,
          orderData.customer.email,
          orderData.customer.name,
          orderData.orderNumber
        );
        
        if (emailSent) {
          console.log(`✅ Status update email sent: ${newStatus} for order #${orderData.orderNumber}`);
        } else {
          console.warn(`⚠️ Status updated but email failed for #${orderData.orderNumber}`);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Failed to update order status with email:', error);
      throw error;
    }
  }, [sendStatusUpdate]);

  return {
    createOrderWithEmail,
    updateOrderStatusWithEmail
  };
};

// Hook for inventory management integration
export const useInventoryEmails = () => {
  const { sendLowStockAlert } = useEmailService();

  // Check inventory and send alerts
  const checkInventoryAndAlert = useCallback(async (products, adminEmail = 'aopopov01@gmail.com') => {
    try {
      // Find products with low stock
      const lowStockProducts = products.filter(product => 
        product.stock <= product.minStock && product.isActive
      );
      
      if (lowStockProducts.length > 0) {
        const alertSent = await sendLowStockAlert(lowStockProducts, adminEmail);
        
        if (alertSent) {
          console.log(`📧 Low stock alert sent for ${lowStockProducts.length} products`);
        }
        
        return {
          alertSent,
          lowStockCount: lowStockProducts.length,
          products: lowStockProducts
        };
      }
      
      return {
        alertSent: false,
        lowStockCount: 0,
        products: []
      };
      
    } catch (error) {
      console.error('Failed to check inventory and send alert:', error);
      throw error;
    }
  }, [sendLowStockAlert]);

  return {
    checkInventoryAndAlert
  };
};