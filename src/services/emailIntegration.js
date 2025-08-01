// Advanced Email Integration Service for Bulgarian Bakery
// Uses local Node.js email server with Gmail SMTP for reliable email delivery

class EmailIntegrationService {
  constructor() {
    this.emailServerUrl = process.env.REACT_APP_EMAIL_SERVER_URL || 'http://localhost:3001';
    this.endpoints = {
      welcome: '/api/email/welcome',
      orderConfirmation: '/api/email/order-confirmation',
      statusUpdate: '/api/email/status-update',
      loyaltyReward: '/api/email/loyalty-reward',
      adminAlert: '/api/email/admin-alert',
      stats: '/api/email/stats',
      health: '/health'
    };
    
    this.emailQueue = [];
    this.isProcessing = false;
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds
  }

  // Initialize email service
  async initialize() {
    try {
      console.log('🚀 Initializing Email Integration Service...');
      
      // Check email server health
      const isHealthy = await this.checkEmailServerHealth();
      if (!isHealthy) {
        console.warn('⚠️ Email server is not responding. Emails will be queued for retry.');
      }
      
      // Start queue processor
      this.startQueueProcessor();
      
      console.log('✅ Email Integration Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Email Integration Service:', error);
      return false;
    }
  }

  // Check email server health
  async checkEmailServerHealth() {
    try {
      const response = await fetch(`${this.emailServerUrl}${this.endpoints.health}`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Email server is healthy:', data.service);
        return true;
      } else {
        console.warn('⚠️ Email server health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Email server is not accessible:', error.message);
      return false;
    }
  }

  // Create necessary directories for email logging
  async createEmailDirectories() {
    const directories = [
      '/home/he_reat/Desktop/Projects/bakery/email-logs',
      '/home/he_reat/Desktop/Projects/bakery/email-logs/sent',
      '/home/he_reat/Desktop/Projects/bakery/email-logs/failed',
      '/home/he_reat/Desktop/Projects/bakery/email-logs/queue'
    ];

    for (const dir of directories) {
      try {
        // This will be handled by MCP Desktop Commander
        console.log(`📁 Creating directory: ${dir}`);
      } catch (error) {
        console.warn(`⚠️ Directory may already exist: ${dir}`);
      }
    }
  }

  // Send welcome email for new users
  async sendWelcomeEmail(userData) {
    const emailData = {
      userData: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        loyaltyTier: userData.loyaltyTier || 'bronze'
      }
    };

    return await this.sendEmailToServer(this.endpoints.welcome, emailData, 'welcome', userData.email);
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData) {
    const emailData = {
      orderData: orderData
    };

    return await this.sendEmailToServer(this.endpoints.orderConfirmation, emailData, 'order-confirmation', orderData.customer.email);
  }

  // Send order status update email
  async sendStatusUpdate(orderId, newStatus, customerData, orderNumber) {
    const emailData = {
      orderId: orderId,
      newStatus: newStatus,
      customerData: customerData,
      orderNumber: orderNumber
    };

    return await this.sendEmailToServer(this.endpoints.statusUpdate, emailData, 'status-update', customerData.email);
  }

  // Send loyalty reward notification
  async sendLoyaltyReward(userData, rewardData) {
    const emailData = {
      userData: userData,
      rewardData: rewardData
    };

    return await this.sendEmailToServer(this.endpoints.loyaltyReward, emailData, 'loyalty-reward', userData.email);
  }

  // Send low stock alert to admins
  async sendLowStockAlert(products, adminEmail = 'aopopov01@gmail.com') {
    const emailData = {
      products: products,
      adminEmail: adminEmail
    };

    return await this.sendEmailToServer(this.endpoints.adminAlert, emailData, 'admin-alert', adminEmail);
  }

  // Send email to the Node.js email server
  async sendEmailToServer(endpoint, emailData, emailType, recipientEmail) {
    try {
      console.log(`📧 Sending ${emailType} email to ${recipientEmail}...`);
      
      const response = await fetch(`${this.emailServerUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`✅ Email queued successfully: ${emailType} to ${recipientEmail}`);
          return { success: true, queueId: result.queueId };
        } else {
          console.error(`❌ Email server error: ${result.error}`);
          return { success: false, error: result.error };
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Email server HTTP error: ${response.status} - ${errorText}`);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error(`❌ Failed to send ${emailType} email:`, error);
      // Queue for retry if server is not accessible
      return await this.queueEmailForRetry(emailType, emailData, recipientEmail);
    }
  }

  // Queue email for retry when server is not accessible
  async queueEmailForRetry(emailType, emailData, recipientEmail) {
    const queueItem = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: emailType,
      data: emailData,
      recipient: recipientEmail,
      queuedAt: new Date().toISOString(),
      attempts: 0,
      status: 'queued'
    };

    this.emailQueue.push(queueItem);
    console.log(`📬 Email queued for retry: ${emailType} to ${recipientEmail}`);
    
    return { success: true, queueId: queueItem.id, queued: true };
  }

  // Process email queue (retry failed emails)
  async processQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`📬 Processing ${this.emailQueue.length} queued emails...`);

    // Check if email server is accessible
    const isHealthy = await this.checkEmailServerHealth();
    if (!isHealthy) {
      console.log('⚠️ Email server is still not accessible. Skipping queue processing.');
      this.isProcessing = false;
      return;
    }

    while (this.emailQueue.length > 0) {
      const emailItem = this.emailQueue.shift();
      await this.retryQueuedEmail(emailItem);
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isProcessing = false;
    console.log('✅ Email queue processing completed');
  }

  // Retry a queued email
  async retryQueuedEmail(emailItem) {
    try {
      const endpoint = this.endpoints[emailItem.type] || this.endpoints.orderConfirmation;
      const result = await this.sendEmailToServer(endpoint, emailItem.data, emailItem.type, emailItem.recipient);
      
      if (result.success && !result.queued) {
        console.log(`✅ Queued email sent successfully: ${emailItem.type} to ${emailItem.recipient}`);
      } else if (result.queued) {
        // Email was queued again, add back to queue
        this.emailQueue.push(emailItem);
      }
    } catch (error) {
      console.error(`❌ Failed to retry queued email: ${emailItem.type}`, error);
      // Add back to queue for another retry
      emailItem.attempts = (emailItem.attempts || 0) + 1;
      if (emailItem.attempts < this.retryAttempts) {
        this.emailQueue.push(emailItem);
      }
    }
  }

  // Get email statistics from the email server
  async getEmailServerStats() {
    try {
      const response = await fetch(`${this.emailServerUrl}${this.endpoints.stats}`);
      if (response.ok) {
        return await response.json();
      } else {
        console.warn('Could not fetch email server stats');
        return null;
      }
    } catch (error) {
      console.warn('Email server stats not available:', error.message);
      return null;
    }
  }

  // Manual queue processing trigger
  async processQueueManually() {
    return await this.processQueue();
  }

  // Start automatic queue processing
  startQueueProcessor() {
    // Process queue every 2 minutes
    setInterval(() => {
      if (this.emailQueue.length > 0) {
        this.processQueue();
      }
    }, 2 * 60 * 1000);
    
    console.log('🔄 Email queue processor started (checks every 2 minutes)');
  }

  // Get email statistics (combines local queue + server stats)
  async getEmailStats() {
    const serverStats = await this.getEmailServerStats();
    
    return {
      queueLength: this.emailQueue.length + (serverStats?.queueLength || 0),
      isProcessing: this.isProcessing || (serverStats?.isProcessing || false),
      totalSent: serverStats?.totalSent || 0,
      totalFailed: serverStats?.totalFailed || 0,
      localQueue: this.emailQueue.length,
      serverStats: serverStats
    };
  }
}

// Export singleton instance
export const emailService = new EmailIntegrationService();

// Auto-initialize
emailService.initialize();