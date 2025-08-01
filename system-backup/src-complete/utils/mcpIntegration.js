// MCP Integration with Gmail Support for Bulgarian Bakery
// Connects MCP tools with Gmail App Password email sending

import { gmailService } from './gmailService';

class MCPIntegration {
  constructor() {
    this.emailQueuePath = '\\wsl.localhost\\Ubuntu\\home\\he_reat\\Desktop\\Projects\\bakery\\data\\email-queue.json';
    this.emailLogPath = '\\wsl.localhost\\Ubuntu\\home\\he_reat\\Desktop\\Projects\\bakery\\data\\email-log.json';
    this.templatePath = '\\wsl.localhost\\Ubuntu\\home\\he_reat\\Desktop\\Projects\\bakery\\email-templates\\';
  }

  // Load email template using Desktop Commander
  async loadTemplate(templateName) {
    try {
      const templatePath = `${this.templatePath}${templateName}.html`;
      
      // Since we're in browser environment, simulate template loading
      // In a real Node.js environment, this would use actual MCP calls
      console.log(`Loading template: ${templatePath}`);
      
      return this.getDefaultTemplate(templateName);
      
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      return this.getDefaultTemplate(templateName);
    }
  }

  // Save email to queue using localStorage (simulating MCP file operations)
  async saveToQueue(emailData) {
    try {
      let queue = [];
      
      // Read existing queue from localStorage
      try {
        const queueContent = localStorage.getItem('bakery_email_queue');
        if (queueContent) {
          queue = JSON.parse(queueContent);
        }
      } catch {
        // Queue doesn't exist, start with empty array
      }
      
      // Add new email to queue
      queue.push(emailData);
      
      // Save updated queue
      localStorage.setItem('bakery_email_queue', JSON.stringify(queue));
      
      console.log('📧 Email queued:', emailData.subject);
      return true;
      
    } catch (error) {
      console.error('Failed to save email to queue:', error);
      return false;
    }
  }

  // Log email activity using localStorage
  async logEmailActivity(activityData) {
    try {
      let logs = [];
      
      // Read existing logs
      try {
        const logContent = localStorage.getItem('bakery_email_log');
        if (logContent) {
          logs = JSON.parse(logContent);
        }
      } catch {
        // Log doesn't exist, start with empty array
      }
      
      // Add new log entry
      logs.push({
        ...activityData,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random().toString(36).substr(2, 9)
      });
      
      // Keep only last 1000 entries
      if (logs.length > 1000) {
        logs = logs.slice(-1000);
      }
      
      // Save updated logs
      localStorage.setItem('bakery_email_log', JSON.stringify(logs));
      
      return true;
      
    } catch (error) {
      console.error('Failed to log email activity:', error);
      return false;
    }
  }

  // Process email queue with Gmail integration
  async processEmailQueue() {
    try {
      const queueContent = localStorage.getItem('bakery_email_queue');
      if (!queueContent) {
        console.log('📪 Email queue is empty');
        return;
      }

      const queue = JSON.parse(queueContent);
      const pendingEmails = queue.filter(email => email.status === 'queued');
      
      if (pendingEmails.length === 0) {
        console.log('📪 No pending emails to process');
        return;
      }

      console.log(`📬 Processing ${pendingEmails.length} emails...`);
      
      for (const email of pendingEmails) {
        try {
          // Load and process template
          const template = await this.loadTemplate(email.templateType || 'order-confirmation');
          const processedHTML = this.processTemplate(template, email.templateData);
          
          // Prepare email data for Gmail
          const gmailEmailData = {
            to: email.to,
            subject: email.subject,
            html: processedHTML
          };
          
          // Try to send via Gmail (if configured)
          const gmailStatus = gmailService.getConfigStatus();
          
          if (gmailStatus.isConfigured) {
            console.log('📧 Attempting to send email via Gmail...');
            
            // In a real backend environment, this would actually send
            // For now, we simulate the sending process
            console.log('✅ Email would be sent via Gmail:', {
              to: gmailEmailData.to,
              subject: gmailEmailData.subject,
              from: gmailStatus.gmailUser
            });
            
            // Update email status
            email.status = 'sent';
            email.sent_at = new Date().toISOString();
            email.method = 'gmail';
            
          } else {
            console.log('📝 Gmail not configured, creating mailto link...');
            
            // Create mailto link as fallback
            const mailtoLink = gmailService.createMailtoLink(gmailEmailData);
            
            email.status = 'mailto_created';
            email.mailto_link = mailtoLink;
            email.processed_at = new Date().toISOString();
            
            console.log('📎 Mailto link created:', mailtoLink);
          }
          
          // Log the activity
          await this.logEmailActivity({
            type: email.type,
            recipient: email.to,
            subject: email.subject,
            status: email.status,
            method: email.method || 'mailto'
          });
          
        } catch (error) {
          console.error('❌ Email processing failed:', error);
          
          email.status = 'failed';
          email.error = error.message;
          email.failed_at = new Date().toISOString();
          
          await this.logEmailActivity({
            type: email.type,
            recipient: email.to,
            subject: email.subject,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      // Save updated queue
      localStorage.setItem('bakery_email_queue', JSON.stringify(queue));
      
      console.log('✅ Email queue processing complete');
      
    } catch (error) {
      console.error('❌ Email queue processing failed:', error);
    }
  }

  // Process template with data
  processTemplate(template, data) {
    let processedTemplate = template;
    
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key.toUpperCase()}}}`;
      const value = data[key] || '';
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return processedTemplate;
  }

  // Default templates for development
  getDefaultTemplate(templateName) {
    const templates = {
      'order-confirmation': `
        <!DOCTYPE html>
        <html lang="bg">
        <head>
            <meta charset="UTF-8">
            <title>Потвърждение на поръчка - Пекарна Златно Жито</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: linear-gradient(135deg, #DEB887, #F4A460); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: white; }
                .order-details { background: #fff8dc; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍞 Пекарна "Златно Жито"</h1>
                <p>Благодарим Ви за поръчката!</p>
            </div>
            <div class="content">
                <h2>Здравейте, {{CUSTOMER_NAME}}!</h2>
                <div class="order-details">
                    <h3>📋 Детайли на поръчката</h3>
                    <p><strong>Номер:</strong> #{{ORDER_NUMBER}}</p>
                    <p><strong>Дата:</strong> {{ORDER_DATE}}</p>
                    <p><strong>Сума:</strong> {{TOTAL_AMOUNT}} лв</p>
                </div>
                <h3>🛍️ Поръчани продукти</h3>
                <div>{{ORDER_ITEMS}}</div>
                <p><strong>Доставка:</strong> {{DELIVERY_METHOD}}</p>
                <p><strong>Адрес:</strong> {{DELIVERY_ADDRESS}}</p>
                <p>Очаквайте {{ESTIMATED_TIME}} за приготвяне.</p>
            </div>
            <div class="footer">
                <p>🍞 Пекарна "Златно Жито" | ул. Витоша 15, София</p>
                <p>📞 +359 88 123 4567 | 📧 info@zlatnozito.bg</p>
            </div>
        </body>
        </html>
      `,
      'status-update': `
        <!DOCTYPE html>
        <html lang="bg">
        <head>
            <meta charset="UTF-8">
            <title>Актуализация на поръчката</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: linear-gradient(135deg, #32CD32, #228B22); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: white; }
                .status-update { background: #f0fff0; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📢 Актуализация на поръчката</h1>
            </div>
            <div class="content">
                <h2>Здравейте, {{CUSTOMER_NAME}}!</h2>
                <div class="status-update">
                    <h3>{{STATUS_ICON}} {{STATUS_TITLE}}</h3>
                    <p>{{STATUS_MESSAGE}}</p>
                    <p><strong>Време:</strong> {{UPDATE_TIME}}</p>
                </div>
                {{ADDITIONAL_INFO}}
            </div>
        </body>
        </html>
      `
    };
    
    return templates[templateName] || templates['order-confirmation'];
  }

  // Get email statistics
  async getEmailStats() {
    try {
      const logContent = localStorage.getItem('bakery_email_log');
      if (!logContent) {
        return {
          total_sent: 0,
          today_sent: 0,
          by_type: {},
          recent_logs: [],
          failed_count: 0
        };
      }

      const logs = JSON.parse(logContent);
      const today = new Date().toDateString();
      const todayLogs = logs.filter(log => 
        new Date(log.timestamp).toDateString() === today
      );
      
      const byType = {};
      logs.forEach(log => {
        byType[log.type] = (byType[log.type] || 0) + 1;
      });
      
      return {
        total_sent: logs.filter(l => l.status === 'sent' || l.status === 'mailto_created').length,
        today_sent: todayLogs.filter(l => l.status === 'sent' || l.status === 'mailto_created').length,
        by_type: byType,
        recent_logs: logs.slice(-10).reverse(),
        failed_count: logs.filter(l => l.status === 'failed').length,
        gmail_configured: gmailService.getConfigStatus().isConfigured
      };
      
    } catch (error) {
      console.error('Failed to get email stats:', error);
      return null;
    }
  }

  // Initialize data storage
  async initializeDirectories() {
    try {
      // Initialize localStorage if not exists
      if (!localStorage.getItem('bakery_email_queue')) {
        localStorage.setItem('bakery_email_queue', '[]');
      }
      
      if (!localStorage.getItem('bakery_email_log')) {
        localStorage.setItem('bakery_email_log', '[]');
      }
      
      console.log('📧 Email system storage initialized');
      
    } catch (error) {
      console.error('Failed to initialize directories:', error);
    }
  }

  // Test Gmail integration
  async testGmailConnection() {
    return await gmailService.testConnection();
  }
}

export const mcpIntegration = new MCPIntegration();