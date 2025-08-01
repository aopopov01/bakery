const express = require('express');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.EMAIL_SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aopopov01@gmail.com',
    pass: 'oydm ftxq jnkb zskk' // Your Gmail app password
  }
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server Ready for sending emails');
  }
});

// Email queue and logging
let emailQueue = [];
let emailLog = [];
let isProcessing = false;

// Load email templates
const loadTemplate = async (templateName) => {
  try {
    const templatePath = path.join(__dirname, 'email-templates', `${templateName}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf8');
    return handlebars.compile(templateContent);
  } catch (error) {
    console.error(`❌ Error loading template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

// Email sending service
class EmailService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds
  }

  async sendEmail(emailData) {
    try {
      console.log(`📧 Sending ${emailData.type} email to ${emailData.to}...`);
      
      // Load and compile template
      const template = await loadTemplate(emailData.template);
      const htmlContent = template(emailData.data);
      
      // Email options
      const mailOptions = {
        from: {
          name: 'ТортоМания',
          address: 'aopopov01@gmail.com'
        },
        to: emailData.to,
        subject: emailData.subject,
        html: htmlContent,
        // Add Bulgarian encoding
        headers: {
          'Content-Type': 'text/html; charset=UTF-8'
        }
      };

      // Send email
      const result = await transporter.sendMail(mailOptions);
      
      // Log success
      const logEntry = {
        id: emailData.id || Date.now().toString(),
        type: emailData.type,
        to: emailData.to,
        subject: emailData.subject,
        status: 'sent',
        sentAt: new Date().toISOString(),
        messageId: result.messageId
      };
      
      emailLog.push(logEntry);
      console.log(`✅ Email sent successfully: ${emailData.type} to ${emailData.to}`);
      
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error(`❌ Failed to send email:`, error);
      
      // Log failure
      const logEntry = {
        id: emailData.id || Date.now().toString(),
        type: emailData.type,
        to: emailData.to,
        subject: emailData.subject,
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error.message
      };
      
      emailLog.push(logEntry);
      
      return { success: false, error: error.message };
    }
  }

  async queueEmail(emailData) {
    const queueItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...emailData,
      queuedAt: new Date().toISOString(),
      attempts: 0,
      status: 'queued'
    };

    emailQueue.push(queueItem);
    console.log(`📬 Email queued: ${emailData.type} to ${emailData.to}`);
    
    // Process immediately for high priority emails
    if (emailData.priority === 'high' && !isProcessing) {
      setTimeout(() => this.processQueue(), 1000);
    }
    
    return { success: true, queueId: queueItem.id };
  }

  async processQueue() {
    if (isProcessing || emailQueue.length === 0) {
      return;
    }

    isProcessing = true;
    console.log(`📬 Processing ${emailQueue.length} emails in queue...`);

    while (emailQueue.length > 0) {
      const emailItem = emailQueue.shift();
      const result = await this.sendEmail(emailItem);
      
      if (!result.success && emailItem.attempts < this.retryAttempts) {
        // Retry failed emails
        emailItem.attempts = (emailItem.attempts || 0) + 1;
        emailItem.lastError = result.error;
        
        console.log(`🔄 Retrying email (attempt ${emailItem.attempts}/${this.retryAttempts})`);
        setTimeout(() => {
          emailQueue.unshift(emailItem); // Add back to front of queue
        }, this.retryDelay * emailItem.attempts);
      }
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    isProcessing = false;
    console.log('✅ Email queue processing completed');
  }

  getStats() {
    return {
      queueLength: emailQueue.length,
      isProcessing: isProcessing,
      totalSent: emailLog.filter(log => log.status === 'sent').length,
      totalFailed: emailLog.filter(log => log.status === 'failed').length,
      recentLog: emailLog.slice(-10)
    };
  }
}

const emailService = new EmailService();

// Start automatic queue processing every 2 minutes
setInterval(() => {
  if (emailQueue.length > 0) {
    emailService.processQueue();
  }
}, 2 * 60 * 1000);

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ТортоМания Email Server',
    timestamp: new Date().toISOString(),
    stats: emailService.getStats()
  });
});

// Welcome email
app.post('/api/email/welcome', async (req, res) => {
  try {
    const { userData } = req.body;
    
    const emailData = {
      type: 'welcome',
      template: 'welcome',
      to: userData.email,
      subject: 'Добре дошли в ТортоМания! 🎉',
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName || '',
        loyaltyTier: userData.loyaltyTier || 'bronze',
        joinDate: new Date().toLocaleDateString('bg-BG'),
        welcomeBonus: '50 бонус точки',
        websiteUrl: 'http://localhost:4000',
        supportEmail: 'info@tortomaniya.bg',
        unsubscribeUrl: `http://localhost:4000/unsubscribe?email=${userData.email}`
      },
      priority: 'high'
    };

    const result = await emailService.queueEmail(emailData);
    res.json(result);
    
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order confirmation email
app.post('/api/email/order-confirmation', async (req, res) => {
  try {
    const { orderData } = req.body;
    
    const emailData = {
      type: 'order-confirmation',
      template: 'order-confirmation',
      to: orderData.customer.email,
      subject: `Потвърждение на поръчка #${orderData.orderNumber} - ТортоМания`,
      data: {
        customerName: orderData.customer.firstName || orderData.customer.name,
        orderNumber: orderData.orderNumber,
        orderDate: new Date(orderData.createdAt).toLocaleString('bg-BG'),
        items: orderData.items.map(item => ({
          name: item.name?.bg || item.name,
          quantity: item.quantity,
          price: item.price.toFixed(2).replace('.', ','),
          total: (item.price * item.quantity).toFixed(2).replace('.', ',')
        })),
        subtotal: orderData.subtotal?.toFixed(2).replace('.', ',') || '0,00',
        deliveryFee: orderData.deliveryFee?.toFixed(2).replace('.', ',') || '0,00',
        total: orderData.total.toFixed(2).replace('.', ','),
        deliveryMethod: orderData.delivery?.type === 'delivery' ? 'Доставка до дома' : 'Взимане от пекарната',
        deliveryAddress: orderData.delivery?.address ? 
          `${orderData.delivery.address.street}, ${orderData.delivery.address.city} ${orderData.delivery.address.postalCode || ''}`.trim() : 
          'Взимане от пекарната',
        estimatedTime: calculateDeliveryTime(orderData),
        paymentMethod: orderData.payment?.method || 'В брой',
        customerPhone: orderData.customer.phone,
        trackingUrl: `http://localhost:4000/orders/${orderData.id}`,
        bakeryAddress: 'ул. Витоша 15, София 1000',
        bakeryPhone: '+359 2 123 4567'
      },
      priority: 'high'
    };

    const result = await emailService.queueEmail(emailData);
    res.json(result);
    
  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Status update email
app.post('/api/email/status-update', async (req, res) => {
  try {
    const { orderId, newStatus, customerData, orderNumber } = req.body;
    
    const statusConfig = getStatusConfig(newStatus);
    
    const emailData = {
      type: 'status-update',
      template: 'status-update',
      to: customerData.email,
      subject: `${statusConfig.subject} - Поръчка #${orderNumber}`,
      data: {
        customerName: customerData.firstName || customerData.name,
        orderNumber: orderNumber,
        statusIcon: statusConfig.icon,
        statusTitle: statusConfig.title,
        statusMessage: statusConfig.message,
        statusColor: statusConfig.color,
        updateTime: new Date().toLocaleString('bg-BG'),
        nextSteps: statusConfig.nextSteps,
        trackingUrl: `http://localhost:4000/orders/${orderId}`,
        estimatedCompletion: statusConfig.estimatedTime,
        contactInfo: statusConfig.contactInfo || '+359 2 123 4567'
      },
      priority: statusConfig.priority
    };

    const result = await emailService.queueEmail(emailData);
    res.json(result);
    
  } catch (error) {
    console.error('Status update email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Low stock admin alert
app.post('/api/email/admin-alert', async (req, res) => {
  try {
    const { products, adminEmail = 'aopopov01@gmail.com' } = req.body;
    
    const emailData = {
      type: 'admin-alert',
      template: 'admin-alert',
      to: adminEmail,
      subject: `🚨 Сигнал за нисък наличен запас - ${products.length} продукта`,
      data: {
        alertType: 'Нисък наличен запас',
        alertTime: new Date().toLocaleString('bg-BG'),
        productCount: products.length,
        urgentCount: products.filter(p => p.stock === 0).length,
        products: products.map(product => ({
          name: product.name?.bg || product.name,
          sku: product.sku || product.id,
          currentStock: product.stock || 0,
          minStock: product.minStock || 5,
          status: product.stock === 0 ? 'ИЗЧЕРПАНО' : 'НИСЪК ЗАПАС',
          statusColor: product.stock === 0 ? '#dc2626' : '#f59e0b'
        })),
        dashboardUrl: 'http://localhost:4000/admin',
        actionRequired: products.filter(p => p.stock === 0).length > 0
      },
      priority: 'high'
    };

    const result = await emailService.queueEmail(emailData);
    res.json(result);
    
  } catch (error) {
    console.error('Admin alert email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Loyalty reward email
app.post('/api/email/loyalty-reward', async (req, res) => {
  try {
    const { userData, rewardData } = req.body;
    
    const emailData = {
      type: 'loyalty-reward',
      template: 'loyalty',
      to: userData.email,
      subject: '🎉 Нова награда от програмата за лоялност!',
      data: {
        customerName: userData.firstName,
        currentTier: userData.loyaltyTier,
        newPoints: rewardData.pointsEarned,
        totalPoints: userData.loyaltyPoints,
        rewardType: rewardData.type,
        rewardValue: rewardData.value,
        rewardDescription: rewardData.description,
        nextTier: getNextTier(userData.loyaltyTier),
        pointsToNextTier: getPointsToNextTier(userData),
        specialOffer: getSpecialOfferForTier(userData.loyaltyTier),
        validUntil: rewardData.validUntil,
        redeemUrl: 'http://localhost:4000/profile?tab=rewards'
      },
      priority: 'medium'
    };

    const result = await emailService.queueEmail(emailData);
    res.json(result);
    
  } catch (error) {
    console.error('Loyalty reward email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email statistics
app.get('/api/email/stats', (req, res) => {
  res.json(emailService.getStats());
});

// Process queue manually
app.post('/api/email/process-queue', async (req, res) => {
  try {
    await emailService.processQueue();
    res.json({ success: true, message: 'Queue processed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper functions
function calculateDeliveryTime(orderData) {
  const baseTime = 30; // minutes
  const itemCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
  const additionalTime = Math.ceil(itemCount / 5) * 15;
  
  const totalMinutes = baseTime + additionalTime;
  
  if (totalMinutes < 60) {
    return `${totalMinutes} минути`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours} час и ${minutes} минути` : `${hours} час${hours > 1 ? 'а' : ''}`;
  }
}

function getStatusConfig(status) {
  const configs = {
    confirmed: {
      icon: '✅',
      title: 'Поръчката е потвърдена',
      subject: 'Потвърдена поръчка',
      message: 'Вашата поръчка е потвърдена и ще бъде приготвена скоро.',
      color: '#10b981',
      nextSteps: 'Ще започнем приготвянето веднага и ще Ви уведомим когато е готова.',
      estimatedTime: '30-45 минути',
      priority: 'high'
    },
    preparing: {
      icon: '👨‍🍳',
      title: 'В процес на приготвяне',
      subject: 'Приготвяме поръчката Ви',
      message: 'Нашите пекари приготвят пресните продукти специално за Вас.',
      color: '#3b82f6',
      nextSteps: 'Очаквайте SMS когато поръчката е готова за взимане.',
      estimatedTime: '15-30 минути',
      priority: 'medium'
    },
    ready: {
      icon: '🎉',
      title: 'Готова за взимане!',
      subject: 'Поръчката е готова',
      message: 'Поръчката Ви е готова и Ви очаква в пекарната.',
      color: '#f59e0b',
      nextSteps: 'Моля, вземете поръчката в рамките на 24 часа.',
      contactInfo: 'ул. Витоша 15, София | +359 2 123 4567',
      priority: 'high'
    },
    delivered: {
      icon: '🚚',
      title: 'Доставена успешно',
      subject: 'Успешна доставка',
      message: 'Поръчката Ви е доставена успешно. Благодарим за доверието!',
      color: '#10b981',
      nextSteps: 'Надяваме се да сте доволни! Споделете мнението си.',
      priority: 'low'
    },
    cancelled: {
      icon: '❌',
      title: 'Отменена поръчка',
      subject: 'Отменена поръчка',
      message: 'Поръчката Ви е отменена по Ваша молба.',
      color: '#ef4444',
      nextSteps: 'За въпроси се свържете с нас.',
      contactInfo: '+359 2 123 4567',
      priority: 'medium'
    }
  };
  
  return configs[status] || configs.confirmed;
}

function getNextTier(currentTier) {
  const tiers = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = tiers.indexOf(currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

function getPointsToNextTier(userData) {
  const tierLimits = { bronze: 0, silver: 500, gold: 1500, platinum: 3000 };
  const nextTier = getNextTier(userData.loyaltyTier);
  return nextTier ? tierLimits[nextTier] - userData.loyaltyPoints : 0;
}

function getSpecialOfferForTier(tier) {
  const offers = {
    bronze: '10% отстъпка при следваща поръчка',
    silver: '15% отстъпка + безплатна доставка',
    gold: '20% отстъпка + безплатен десерт',
    platinum: '25% отстъпка + приоритетно обслужване'
  };
  return offers[tier] || offers.bronze;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ТортоМания Email Server running on port ${PORT}`);
  console.log(`📧 Gmail SMTP configured for: aopopov01@gmail.com`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/email/stats`);
});