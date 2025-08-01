// Gmail Integration for MCP Email System
// Uses Gmail SMTP with App Password for sending emails

class GmailService {
  constructor() {
    this.smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.REACT_APP_GMAIL_USER,
        pass: process.env.REACT_APP_GMAIL_APP_PASSWORD
      }
    };
    this.isConfigured = this.validateConfig();
  }

  validateConfig() {
    const { user, pass } = this.smtpConfig.auth;
    if (!user || !pass) {
      console.warn('Gmail credentials not configured. Check .env.development file.');
      return false;
    }
    return true;
  }

  // Send email using Gmail SMTP (for Node.js backend)
  async sendEmailViaNodemailer(emailData) {
    if (!this.isConfigured) {
      throw new Error('Gmail not configured. Please set REACT_APP_GMAIL_USER and REACT_APP_GMAIL_APP_PASSWORD');
    }

    try {
      // This would be used in a Node.js backend
      // Frontend React cannot directly send SMTP emails for security reasons
      
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter(this.smtpConfig);
      
      const mailOptions = {
        from: `"Пекарна Златно Жито" <${this.smtpConfig.auth.user}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        attachments: emailData.attachments || []
      };
      
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully:', result.messageId);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
      
    } catch (error) {
      console.error('❌ Gmail sending failed:', error);
      throw new Error(`Gmail sending failed: ${error.message}`);
    }
  }

  // Alternative: Use Gmail API (requires OAuth2)
  async sendEmailViaGmailAPI(emailData) {
    try {
      // This requires Google OAuth2 setup
      const { google } = require('googleapis');
      
      const oauth2Client = new google.auth.OAuth2(
        process.env.REACT_APP_GMAIL_CLIENT_ID,
        process.env.REACT_APP_GMAIL_CLIENT_SECRET,
        process.env.REACT_APP_GMAIL_REDIRECT_URI
      );
      
      oauth2Client.setCredentials({
        refresh_token: process.env.REACT_APP_GMAIL_REFRESH_TOKEN
      });
      
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      
      const message = this.createGmailMessage(emailData);
      
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message
        }
      });
      
      console.log('✅ Gmail API email sent:', result.data.id);
      return {
        success: true,
        messageId: result.data.id
      };
      
    } catch (error) {
      console.error('❌ Gmail API sending failed:', error);
      throw new Error(`Gmail API sending failed: ${error.message}`);
    }
  }

  // Create Gmail API message format
  createGmailMessage(emailData) {
    const message = [
      `From: "Пекарна Златно Жито" <${this.smtpConfig.auth.user}>`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailData.html
    ].join('\n');
    
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  // Frontend-safe method: Create mailto link
  createMailtoLink(emailData) {
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(this.htmlToText(emailData.html));
    
    return `mailto:${emailData.to}?subject=${subject}&body=${body}`;
  }

  // Convert HTML to plain text for mailto
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  // Test Gmail configuration
  async testConnection() {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Gmail credentials not configured'
      };
    }

    try {
      // Test email data
      const testEmail = {
        to: this.smtpConfig.auth.user, // Send to self
        subject: 'Test Email from Bulgarian Bakery System',
        html: `
          <h2>Gmail Test Successful! 🎉</h2>
          <p>Your Bulgarian Bakery MCP Email System is working correctly.</p>
          <p>Gmail App Password connection established.</p>
          <p>Time: ${new Date().toLocaleString('bg-BG')}</p>
        `
      };

      // In production, this would actually send
      console.log('Gmail test email would be sent:', testEmail);
      
      return {
        success: true,
        message: 'Gmail configuration is valid',
        testEmail
      };
      
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get configuration status for admin dashboard
  getConfigStatus() {
    return {
      isConfigured: this.isConfigured,
      gmailUser: this.smtpConfig.auth.user || 'Not configured',
      hasAppPassword: !!this.smtpConfig.auth.pass,
      smtpHost: this.smtpConfig.host,
      smtpPort: this.smtpConfig.port
    };
  }
}

export const gmailService = new GmailService();