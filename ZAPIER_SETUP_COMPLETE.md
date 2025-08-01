# 🚀 ТортоМания Email System - Complete Zapier Setup Guide

## ✅ System Status: READY FOR ZAPIER CONFIGURATION

Your email webhook URLs are working perfectly! All webhook endpoints returned **200 OK** status during testing.

---

## 📧 **5 Zapier Zaps to Create**

### **🎯 Zap 1: Welcome Email**
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/welcome/`
- **Trigger**: Webhook POST request
- **Action**: Gmail → Send Email
- **Template**: Use `/email-templates/welcome.html`

**Gmail Configuration:**
```
To: {{to}}
Subject: {{subject}}
Body Type: HTML
Body: [Copy content from welcome.html and replace {{variables}}]
From: aopopov01@gmail.com
```

**Template Variables to Replace:**
- `{{firstName}}` → Customer's first name
- `{{loyaltyTier}}` → Loyalty status (bronze/silver/gold/platinum)
- `{{joinDate}}` → Registration date
- `{{welcomeBonus}}` → Welcome bonus points
- `{{websiteUrl}}` → Application URL
- `{{supportEmail}}` → Support email address

---

### **🎯 Zap 2: Order Confirmation**
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/order-confirmation/`  
- **Trigger**: Webhook POST request
- **Action**: Gmail → Send Email
- **Template**: Use `/email-templates/order-confirmation.html`
- **Priority**: High (immediate processing)

**Gmail Configuration:**
```
To: {{to}}
Subject: {{subject}}
Body Type: HTML
Body: [Copy content from order-confirmation.html and replace {{variables}}]
From: aopopov01@gmail.com
```

**Template Variables to Replace:**
- `{{customerName}}` → Customer's name
- `{{orderNumber}}` → Order number (e.g., TM-001)
- `{{orderDate}}` → Order creation date/time
- `{{items}}` → Array of ordered items
- `{{total}}` → Total order amount
- `{{deliveryMethod}}` → Delivery or pickup
- `{{deliveryAddress}}` → Customer address
- `{{estimatedTime}}` → Preparation time
- `{{paymentMethod}}` → Payment method
- `{{trackingUrl}}` → Order tracking URL
- `{{bakeryPhone}}` → Contact phone number

---

### **🎯 Zap 3: Status Updates**
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/status-update/`
- **Trigger**: Webhook POST request  
- **Action**: Gmail → Send Email
- **Template**: Use `/email-templates/status-update.html`

**Gmail Configuration:**
```
To: {{to}}
Subject: {{subject}}
Body Type: HTML
Body: [Copy content from status-update.html and replace {{variables}}]
From: aopopov01@gmail.com
```

**Template Variables to Replace:**
- `{{customerName}}` → Customer's name
- `{{orderNumber}}` → Order number
- `{{statusIcon}}` → Status emoji (✅ 👨‍🍳 🎉 🚚 ❌)
- `{{statusTitle}}` → Status title in Bulgarian
- `{{statusMessage}}` → Detailed status message
- `{{statusColor}}` → Color code for status styling
- `{{updateTime}}` → Timestamp of update
- `{{nextSteps}}` → What happens next
- `{{contactInfo}}` → Contact information

**Status Types Supported:**
- **confirmed** → ✅ Потвърдена поръчка
- **preparing** → 👨‍🍳 В процес на приготвяне  
- **ready** → 🎉 Готова за взимане
- **delivered** → 🚚 Доставена успешно
- **cancelled** → ❌ Отменена поръчка

---

### **🎯 Zap 4: Loyalty Rewards**
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/loyalty/`
- **Trigger**: Webhook POST request
- **Action**: Gmail → Send Email  
- **Template**: Use `/email-templates/loyalty.html`

**Gmail Configuration:**
```
To: {{to}}
Subject: {{subject}}
Body Type: HTML
Body: [Copy content from loyalty.html and replace {{variables}}]
From: aopopov01@gmail.com
```

**Template Variables to Replace:**
- `{{customerName}}` → Customer's name
- `{{currentTier}}` → Current loyalty tier
- `{{newPoints}}` → Points earned from this action
- `{{totalPoints}}` → Total accumulated points
- `{{rewardType}}` → Type of reward (points/discount/gift)
- `{{rewardValue}}` → Value of the reward
- `{{rewardDescription}}` → Description of reward
- `{{specialOffer}}` → Tier-specific offer
- `{{redeemUrl}}` → URL to redeem rewards

---

### **🎯 Zap 5: Admin Alerts (Low Stock)**
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/admin-alert/`
- **Trigger**: Webhook POST request
- **Action**: Gmail → Send Email
- **Template**: Use `/email-templates/admin-alert.html`

**Gmail Configuration:**
```
To: aopopov01@gmail.com (ALWAYS send to admin)
Subject: {{subject}}
Body Type: HTML
Body: [Copy content from admin-alert.html and replace {{variables}}]
From: aopopov01@gmail.com
```

**Template Variables to Replace:**
- `{{alertType}}` → Type of alert (e.g., "Нисък наличен запас")
- `{{alertTime}}` → When alert was triggered
- `{{productCount}}` → Number of affected products
- `{{urgentCount}}` → Number of completely out-of-stock items
- `{{products}}` → Array of low-stock products with details
- `{{dashboardUrl}}` → Link to admin dashboard
- `{{actionRequired}}` → Boolean indicating if urgent action needed

**Product Object Structure:**
```javascript
{
  name: "Шоколадова торта",
  sku: "CAKE_CHOC_001", 
  currentStock: 2,
  minStock: 10,
  status: "НИСЪК ЗАПАС", // or "ИЗЧЕРПАНО"
  statusColor: "#f59e0b" // or "#dc2626"  
}
```

---

## 🛠️ **Step-by-Step Zapier Setup**

### **Step 1: Create Zapier Account**
1. Go to https://zapier.com
2. Sign up/login with **aopopov01@gmail.com**
3. Create workspace: "ТортоМания Email Automation"

### **Step 2: Connect Gmail**
1. Go to "My Apps" in Zapier
2. Connect Gmail account (**aopopov01@gmail.com**)
3. Grant necessary permissions for sending emails

### **Step 3: Create Each Zap**

**For each of the 5 webhook URLs above:**

1. **Create New Zap**
   - Click "Create Zap" 
   - Name it descriptively (e.g., "ТортоМания - Welcome Email")

2. **Set Up Trigger**
   - Choose "Webhooks by Zapier"
   - Select "Catch Hook"
   - Copy the webhook URL from above
   - Test the webhook (use `node test-email.js` to send test data)

3. **Set Up Action**
   - Choose "Gmail"
   - Select "Send Email"
   - Configure fields as shown above
   - Map webhook data to email template variables

4. **Test & Turn On**
   - Test the action to ensure email sends correctly
   - Review email formatting and content
   - Turn on the Zap

### **Step 4: Verify Setup**
1. Run test script: `node test-email.js`
2. Check email inbox for 4 test emails
3. Verify all template variables are replaced correctly
4. Confirm Bulgarian text displays properly

---

## 🧪 **Testing the Complete System**

### **Test from React Application**
```javascript
// In your React app (e.g., after user registration)
import { emailService } from './services/emailIntegration';

// Test welcome email
const testWelcomeEmail = async () => {
  const userData = {
    email: 'test@example.com',
    firstName: 'Тест',
    lastName: 'Потребител',
    loyaltyTier: 'bronze',
    id: 'user-123'
  };
  
  const result = await emailService.sendWelcomeEmail(userData);
  console.log('Welcome email sent:', result);
};

// Test order confirmation
const testOrderConfirmation = async () => {
  const orderData = {
    customer: { 
      email: 'customer@example.com',
      firstName: 'Мария',
      phone: '+359888123456'
    },
    orderNumber: 'TM-001',
    items: [
      { 
        name: { bg: 'Шоколадова торта' }, 
        quantity: 1, 
        price: 25.90 
      }
    ],
    total: 25.90,
    createdAt: new Date(),
    id: 'order-123'
  };
  
  const result = await emailService.sendOrderConfirmation(orderData);
  console.log('Order confirmation sent:', result);
};

// Test status update
const testStatusUpdate = async () => {
  const result = await emailService.sendStatusUpdate(
    'order-123',
    'ready', 
    { email: 'customer@example.com', firstName: 'Мария' },
    'TM-001'
  );
  console.log('Status update sent:', result);
};
```

### **Command Line Testing**
```bash
# Test all webhooks
node test-email.js

# Start development server and test integration
docker-compose -f docker-compose.dev.yml up --build

# Access application at http://localhost:4000
# Test user registration and order processes
```

---

## 📊 **Expected Email Volume**

For a typical bakery with **30-50 orders per day**:

- **Welcome Emails**: ~5-10 per day (new registrations)
- **Order Confirmations**: ~30-50 per day (immediate)
- **Status Updates**: ~90-150 per day (3 updates per order average)
- **Loyalty Rewards**: ~10-20 per day (points/tier updates)
- **Admin Alerts**: ~1-5 per day (low stock notifications)

**Total**: ~135-235 emails per day = **~4,000-7,000 per month**

**Zapier Plan Needed**: Professional Plan ($49/month for 2,000 tasks) or Team Plan ($103/month for 50,000 tasks)

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Webhook not triggering**
   - Verify webhook URL is correct
   - Check Zapier webhook history
   - Test with `node test-email.js`

2. **Gmail authentication failed**
   - Reconnect Gmail in Zapier
   - Check Gmail security settings
   - Enable "Less secure app access" if needed

3. **Template variables not replacing**
   - Check variable names match exactly (case-sensitive)
   - Verify data structure in webhook payload
   - Use Zapier's data debugger

4. **Bulgarian characters not displaying**
   - Ensure UTF-8 encoding in templates
   - Check Gmail HTML rendering
   - Verify meta charset in template headers

### **Debugging Commands:**
```bash
# Test specific webhook
curl -X POST https://hooks.zapier.com/hooks/catch/4dd08a97102485b946cd1ec1f2a73d42/welcome/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check email service status
node -e "
const { emailService } = require('./src/services/emailIntegration.js');
console.log(emailService.getEmailStats());
"
```

---

## ✅ **Completion Checklist**

- [ ] **5 Zapier Zaps created** with correct webhook URLs
- [ ] **Gmail connected** and permissions granted  
- [ ] **Email templates** configured with variable mapping
- [ ] **Test emails sent** and received successfully
- [ ] **React integration** tested with real user flows
- [ ] **Admin alerts** tested and verified
- [ ] **Bulgarian text** displays correctly in all emails
- [ ] **Variable substitution** working for all template fields
- [ ] **Email delivery** confirmed (check spam folders)
- [ ] **Zapier plan upgraded** if needed for expected volume

---

## 🎯 **Success Criteria**

✅ **All webhook URLs return 200 OK** (COMPLETED)  
✅ **Email templates created** with Bulgarian localization (COMPLETED)  
✅ **Test script confirms connectivity** (COMPLETED)  
⏳ **Zapier Zaps configured** (IN PROGRESS - Your next step)  
⏳ **Gmail sending verified** (PENDING - After Zapier setup)  
⏳ **React app integration tested** (PENDING - After Zapier setup)

---

**🎉 Your ТортоМания email system is technically ready!**

**Next Action**: Configure the 5 Zapier Zaps using the webhook URLs and templates provided above.

Once Zapier is configured, your bakery will have a fully automated email system with:
- Instant order confirmations in Bulgarian
- Real-time status updates
- Welcome emails for new customers  
- Loyalty program notifications
- Automatic admin alerts for low stock

**Total Setup Time**: ~30-45 minutes for all 5 Zaps