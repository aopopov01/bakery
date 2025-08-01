# MCP-Based Email System for Bulgarian Bakery

## 🚀 **Overview**

This MCP (Model Context Protocol) based email system provides automated email functionality for the Bulgarian bakery e-commerce platform. Unlike traditional API integrations, this system leverages MCP tools (specifically Desktop Commander) for file operations, template management, and email queue processing.

## 🏗️ **Architecture**

### **Core Components:**

1. **MCP Integration Layer** (`mcpIntegration.js`)
   - Direct interface with Desktop Commander MCP tools
   - File operations for templates, queue, and logs
   - Template processing and data management

2. **Email Service** (`mcpEmailService.js`)
   - High-level email functionality
   - Order confirmations, status updates, alerts
   - Queue management and statistics

3. **React Integration** (`EmailManagement.jsx`, `useEmailService.js`)
   - Admin dashboard for email management
   - React hooks for easy component integration
   - Real-time statistics and monitoring

4. **Email Templates** (`email-templates/`)
   - HTML templates with Bulgarian localization
   - Dynamic placeholder system
   - Professional bakery branding

## 📁 **File Structure**

```
bakery/
├── email-templates/
│   ├── order-confirmation.html
│   ├── status-update.html
│   └── low-stock-alert.html
├── src/
│   ├── utils/
│   │   ├── mcpEmailService.js      # Main email service
│   │   └── mcpIntegration.js       # MCP tool integration
│   ├── hooks/
│   │   └── useEmailService.js      # React hooks
│   └── components/admin/
│       └── EmailManagement.jsx     # Admin interface
└── data/
    ├── email-queue.json            # Email queue storage
    └── email-log.json             # Activity logging
```

## 🔧 **Setup & Integration**

### **1. Initialize MCP Email System**

```javascript
import { mcpEmailService } from './utils/mcpEmailService';

// Initialize the email system (happens automatically)
await mcpEmailService.initialize();

// Start automatic queue processing (optional)
mcpEmailService.startQueueProcessor();
```

### **2. Send Order Confirmation Email**

```javascript
// In your checkout process
const handleOrderSubmission = async (orderData) => {
  try {
    // Create order
    const order = createOrder(orderData);
    
    // Send confirmation email using MCP
    const emailSent = await mcpEmailService.sendOrderConfirmation(order);
    
    if (emailSent) {
      console.log('✅ Confirmation email queued successfully');
    }
    
    // Redirect to success page
    window.location.href = `/order-success?id=${order.id}`;
    
  } catch (error) {
    console.error('Order processing failed:', error);
  }
};
```

### **3. Update Order Status with Email**

```javascript
// In admin panel
const updateOrderStatus = async (orderId, newStatus) => {
  const order = orders.find(o => o.id === orderId);
  
  // Update order status in state
  setOrders(prev => 
    prev.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
        : o
    )
  );
  
  // Send status update email using MCP
  await mcpEmailService.sendStatusUpdate(
    orderId,
    newStatus,
    order.customer.email,
    order.customer.name,
    order.orderNumber
  );
};
```

### **4. React Component Integration**

```javascript
import { useEmailService } from '../hooks/useEmailService';

const OrderManagement = () => {
  const { 
    sendStatusUpdate, 
    emailStats, 
    isLoading 
  } = useEmailService();
  
  const handleStatusChange = async (orderId, newStatus) => {
    const success = await sendStatusUpdate(orderId, newStatus, ...);
    if (success) {
      console.log('Status updated and email sent!');
    }
  };
  
  return (
    <div>
      <p>Today's emails sent: {emailStats?.today_sent || 0}</p>
      {/* Order management interface */}
    </div>
  );
};
```

## 📧 **Email Types & Templates**

### **1. Order Confirmation Email**
- **Trigger**: New order creation
- **Recipients**: Customer
- **Content**: Order details, delivery info, estimated time
- **Template**: `order-confirmation.html`
- **Priority**: High (immediate processing)

### **2. Status Update Email**
- **Trigger**: Order status change
- **Recipients**: Customer
- **Content**: New status, additional instructions
- **Template**: `status-update.html`
- **Priority**: Medium to High (based on status)

### **3. Low Stock Alert**
- **Trigger**: Product stock below minimum
- **Recipients**: Admin/Manager
- **Content**: List of low stock items
- **Template**: `low-stock-alert.html`
- **Priority**: Medium (batch processing)

## 🎯 **Key Features**

### **Bulgarian Localization**
- All email content in Bulgarian language
- Proper Bulgarian date/time formatting
- Cultural context and business practices
- Bulgarian phone number validation

### **MCP File Operations**
- Template loading using Desktop Commander
- Queue management with JSON files
- Activity logging for audit trails
- No external database dependencies

### **Smart Queue Processing**
- Automatic queue processing every 5 minutes
- Priority-based email sending
- Retry logic for failed emails
- Comprehensive error logging

### **Admin Dashboard**
- Real-time email statistics
- Recent activity monitoring
- Manual queue processing
- Test email functionality

## 🔄 **Data Flow**

```
1. Email Request → mcpEmailService.sendOrderConfirmation()
2. Email Data Processing → Template variable substitution
3. Queue Storage → mcpIntegration.saveToQueue() → Desktop Commander
4. Queue Processing → mcpIntegration.processEmailQueue()
5. Email Sending → Integration with actual email service
6. Activity Logging → mcpIntegration.logEmailActivity()
7. Statistics Update → Available in admin dashboard
```

## 📊 **Statistics & Monitoring**

### **Available Metrics:**
- Total emails sent
- Today's email count  
- Failed email count
- Distribution by email type
- Recent activity logs
- Queue processing status

### **Admin Dashboard Features:**
- Real-time statistics display
- Manual queue processing
- Test email functionality
- Email template management
- System status monitoring

## 🛠️ **Customization Options**

### **Email Templates**
Templates use a simple placeholder system:
```html
<h1>Здравейте, {{CUSTOMER_NAME}}!</h1>
<p>Поръчка: #{{ORDER_NUMBER}}</p>
<p>Сума: {{TOTAL_AMOUNT}} лв</p>
```

### **Status Configurations**
Each order status has configurable properties:
```javascript
const statusConfig = {
  confirmed: {
    icon: '✅',
    title: 'Поръчката е потвърдена',
    message: 'Вашата поръчка е потвърдена...',
    priority: 'high'
  }
};
```

### **Queue Processing**
Adjustable processing intervals:
```javascript
// Process queue every 5 minutes (default)
mcpEmailService.startQueueProcessor();

// Custom interval (10 minutes)
setInterval(() => {
  mcpEmailService.processQueue();
}, 10 * 60 * 1000);
```

## 🔗 **Integration with External Email Services**

While the MCP system handles queueing and template processing, you'll need to integrate with an actual email service for sending:

### **Gmail API Integration**
```javascript
// In mcpIntegration.js processEmailQueue method
const sendViaGmail = async (emailData) => {
  // Gmail API integration code
  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: createGmailMessage(emailData)
    }
  });
  return response;
};
```

### **SendGrid Integration**
```javascript
const sendViaSendGrid = async (emailData) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: emailData.to,
    from: 'noreply@zlatnozito.bg',
    subject: emailData.subject,
    html: emailData.html
  };
  
  await sgMail.send(msg);
};
```

## 🚨 **Error Handling**

The system includes comprehensive error handling:

- **Template Loading Errors**: Fallback to default templates
- **Queue Processing Errors**: Individual email failures don't stop processing
- **MCP Integration Errors**: Graceful degradation with console logging
- **Email Service Errors**: Retry logic and failure tracking

## 📈 **Performance Considerations**

- **File-based Storage**: Efficient for small to medium volumes
- **Batch Processing**: Queue processing reduces system load
- **Memory Usage**: Minimal impact on React application
- **MCP Efficiency**: Direct file operations without API overhead

## 🔒 **Security Features**

- **Input Sanitization**: All user inputs are sanitized
- **Template Security**: No script execution in templates
- **Email Validation**: Bulgarian phone and email validation
- **Error Privacy**: Sensitive data not logged in errors

## 📝 **Troubleshooting**

### **Common Issues:**

1. **MCP Not Available**
   - System gracefully degrades to console logging
   - Check if Desktop Commander MCP is enabled

2. **Template Not Found**
   - Falls back to default template
   - Check template file paths

3. **Queue Processing Fails**
   - Individual emails marked as failed
   - Check MCP file permissions

4. **Statistics Not Loading**
   - Check if data directory exists
   - Verify MCP file read permissions

## 🎯 **Benefits of MCP-Based Approach**

1. **No External Dependencies**: Uses available MCP tools
2. **File-Based Storage**: Simple, reliable, no database needed
3. **Development Friendly**: Easy testing and debugging
4. **Cost Effective**: No additional API costs for queue management
5. **Bulgarian Optimized**: Fully localized for Bulgarian market
6. **Admin Friendly**: Complete management interface included

This MCP-based email system provides a robust, scalable, and culturally appropriate solution for the Bulgarian bakery e-commerce platform, leveraging the power of Model Context Protocol tools for efficient file operations and email management.
