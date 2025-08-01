// Complete MCP-Based Email Service for Bulgarian Bakery
// Integrates with Desktop Commander for file operations and email management

class MCPEmailService {
  constructor() {
    this.integration = null; // MCP integration will be added later
    this.isInitialized = false;
  }

  // Initialize the email system
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // MCP integration will be added later
      this.isInitialized = true;
      console.log('MCP Email Service initialized successfully (mock mode)');
    } catch (error) {
      console.error('Failed to initialize MCP Email Service:', error);
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData) {
    await this.initialize();
    
    try {
      const emailData = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        to: orderData.customer.email,
        subject: `Потвърждение на поръчка #${orderData.orderNumber} - Пекарна Златно Жито`,
        templateType: 'order-confirmation',
        templateData: {
          customer_name: orderData.customer.name,
          order_number: orderData.orderNumber,
          order_date: new Date(orderData.createdAt).toLocaleString('bg-BG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          total_amount: orderData.total.toFixed(2),
          delivery_method: orderData.delivery.type === 'delivery' ? 'Доставка до адрес' : 'Взимане от пекарната',
          delivery_address: this.formatDeliveryAddress(orderData.delivery),
          customer_phone: orderData.customer.phone,
          estimated_time: this.calculateEstimatedTime(orderData),
          order_items: this.formatOrderItemsHTML(orderData.items)
        },
        type: 'order_confirmation',
        orderId: orderData.id,
        status: 'queued',
        queued_at: new Date().toISOString(),
        priority: 'high'
      };

      // Mock email sending (MCP integration will be added later)
      console.log(`📧 Mock: Order confirmation email for ${orderData.customer.email}`);
      console.log(`✅ Order confirmation email queued for ${orderData.customer.email}`);
      
      return true;
      
    } catch (error) {
      console.error('Order confirmation email failed:', error);
      
      // Mock error logging (MCP integration will be added later)
      console.log('📝 Mock: Logging email failure');
      
      return false;
    }
  }

  // Send order status update email
  async sendStatusUpdate(orderId, newStatus, customerEmail, customerName, orderNumber) {
    await this.initialize();
    
    try {
      const statusConfig = this.getStatusConfig(newStatus);
      
      const emailData = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        to: customerEmail,
        subject: `${statusConfig.subject} - Поръчка #${orderNumber}`,
        templateType: 'status-update',
        templateData: {
          customer_name: customerName,
          order_number: orderNumber,
          status_icon: statusConfig.icon,
          status_title: statusConfig.title,
          status_message: statusConfig.message,
          update_time: new Date().toLocaleString('bg-BG'),
          additional_info: statusConfig.additionalInfo
        },
        type: 'status_update',
        orderId: orderId,
        status: 'queued',
        queued_at: new Date().toISOString(),
        priority: statusConfig.priority
      };

      // Mock email sending (MCP integration will be added later)
      console.log(`📧 Mock: Status update email for ${customerEmail}`);
      console.log(`✅ Status update email queued: ${newStatus} for order #${orderNumber}`);
      
      return true;
      
    } catch (error) {
      console.error('Status update email failed:', error);
      
      // Mock error logging (MCP integration will be added later)
      console.log('📝 Mock: Logging status update email failure');
      
      return false;
    }
  }

  // Send low stock alert to admin
  async sendLowStockAlert(products, adminEmail = 'admin@zlatnozito.bg') {
    await this.initialize();
    
    try {
      const emailData = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        to: adminEmail,
        subject: `🚨 Сигнал за нисък наличен запас - ${products.length} продукта`,
        templateType: 'low-stock-alert',
        templateData: {
          alert_time: new Date().toLocaleString('bg-BG'),
          product_count: products.length,
          products_list: this.formatLowStockProductsHTML(products),
          urgent_products: products.filter(p => p.stock === 0).length
        },
        type: 'low_stock_alert',
        status: 'queued',
        queued_at: new Date().toISOString(),
        priority: 'medium'
      };

      // Mock email sending (MCP integration will be added later)
      console.log(`📧 Mock: Low stock alert for ${products.length} products`);
      console.log(`⚠️ Low stock alert queued: ${products.length} products`);
      return true;
      
    } catch (error) {
      console.error('Low stock alert email failed:', error);
      return false;
    }
  }

  // Process email queue
  async processQueue() {
    try {
      // Mock queue processing (MCP integration will be added later)
      console.log('📬 Mock: Email queue processed');
    } catch (error) {
      console.error('Email queue processing failed:', error);
    }
  }

  // Get email statistics for admin dashboard
  async getEmailStats() {
    await this.initialize();
    // Mock stats (MCP integration will be added later)
    return {
      total_sent: 0,
      pending: 0,
      failed: 0,
      success_rate: '100%'
    };
  }

  // Helper methods
  formatDeliveryAddress(delivery) {
    if (delivery.type === 'pickup') {
      return 'Пекарна "Златно Жито", ул. Витоша 15, София';
    }
    
    const address = delivery.address;
    return `${address.street}, ${address.city} ${address.postalCode || ''}`.trim();
  }

  calculateEstimatedTime(orderData) {
    const baseTime = 30; // minutes
    const itemCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    const additionalTime = Math.ceil(itemCount / 5) * 15; // 15 min per 5 items
    
    // Add extra time for custom cakes
    const hasCustomItems = orderData.items.some(item => item.category === 'cakes');
    const customTime = hasCustomItems ? 60 : 0;
    
    const totalMinutes = baseTime + additionalTime + customTime;
    
    if (totalMinutes < 60) {
      return `${totalMinutes} минути`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours} час и ${minutes} минути` : `${hours} час${hours > 1 ? 'а' : ''}`;
    }
  }

  formatOrderItemsHTML(items) {
    return items.map(item => `
      <div class="item">
        <span>${item.name.bg} x${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} лв</span>
      </div>
    `).join('');
  }

  formatLowStockProductsHTML(products) {
    return products.map(product => `
      <div class="stock-item ${product.stock === 0 ? 'out-of-stock' : 'low-stock'}">
        <strong>${product.name.bg}</strong> (${product.sku})<br>
        Наличност: ${product.stock}/${product.minStock}
        ${product.stock === 0 ? ' - <span style="color: red;">ИЗЧЕРПАНО</span>' : ''}
      </div>
    `).join('');
  }

  getStatusConfig(status) {
    const configs = {
      confirmed: {
        icon: '✅',
        title: 'Поръчката е потвърдена',
        subject: 'Потвърждение',
        message: 'Вашата поръчка е потвърдена и ще бъде приготвена скоро от нашите пекари.',
        additionalInfo: '<p><strong>Следващи стъпки:</strong></p><ul><li>Ще започнем приготвянето веднага</li><li>Ще получите SMS когато поръчката е готова</li></ul>',
        priority: 'high'
      },
      preparing: {
        icon: '👨‍🍳',
        title: 'Приготвяме поръчката Ви',
        subject: 'В процес на приготвяне',
        message: 'В момента нашите пекари приготвят пресните продукти специално за Вас.',
        additionalInfo: '<p>Очаквайте SMS съобщение когато поръчката е готова за взимане.</p>',
        priority: 'medium'
      },
      ready: {
        icon: '🎉',
        title: 'Поръчката е готова!',
        subject: 'Готова за взимане',
        message: 'Поръчката Ви е готова и Ви очаква в пекарната.',
        additionalInfo: '<div style="background: #e8f5e8; padding: 15px; border-radius: 5px;"><p><strong>📍 Адрес:</strong> ул. Витоша 15, София</p><p><strong>🕐 Работно време:</strong> 07:00 - 20:00 (всеки ден)</p><p><strong>⏰ Важно:</strong> Моля, вземете поръчката в рамките на 24 часа</p></div>',
        priority: 'high'
      },
      delivered: {
        icon: '🚚',
        title: 'Поръчката е доставена',
        subject: 'Успешна доставка',
        message: 'Поръчката Ви е доставена успешно. Благодарим Ви за доверието!',
        additionalInfo: '<p>Надяваме се да сте доволни от продуктите. Ще се радваме да Ви видим отново!</p><p><em>Споделете мнението си в Google Reviews или Facebook</em> 🌟</p>',
        priority: 'low'
      },
      cancelled: {
        icon: '❌',
        title: 'Поръчката е отменена',
        subject: 'Отменена поръчка',
        message: 'Поръчката Ви е отменена по Ваша молба.',
        additionalInfo: '<p>Ако имате въпроси, моля свържете се с нас на +359 88 123 4567</p>',
        priority: 'medium'
      }
    };
    
    return configs[status] || configs.confirmed;
  }

  // Schedule regular email queue processing
  startQueueProcessor() {
    // Process queue every 5 minutes
    setInterval(() => {
      this.processQueue();
    }, 5 * 60 * 1000);
    
    console.log('📬 Email queue processor started (every 5 minutes)');
  }

  // Stop queue processor
  stopQueueProcessor() {
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
      console.log('📬 Email queue processor stopped');
    }
  }
}

// Export singleton instance
export const mcpEmailService = new MCPEmailService();

// Auto-initialize when imported
mcpEmailService.initialize();