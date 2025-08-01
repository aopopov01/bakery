# Zapier Email Integration Setup for ТортоМания

## Overview
This document explains how to set up Zapier webhooks to handle email automation for the Bulgarian bakery platform.

## Required Zapier Zaps

### 1. Welcome Email Zap
**Trigger:** Webhook - `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/welcome/`
**Action:** Gmail - Send Email

**Email Template:**
```html
Subject: Добре дошли в ТортоМания! 🎉

Dear {{firstName}} {{lastName}},

Добре дошли в семейството на ТортоМания! Радваме се, че се присъединихте към нашата общност на любители на истински български хляб и сладкиши.

🎁 Като подарък за регистрацията, получавате 50 бонус точки!

Вашият профил:
- Ниво на лоялност: {{loyaltyTier}}
- Дата на регистрация: {{joinDate}}
- Бонус точки: {{welcomeBonus}}

Можете да разгледате нашите продукти на: {{websiteUrl}}

За въпроси: {{supportEmail}}

С уважение,
Екипът на ТортоМания
ул. Витоша 15, София 1000
+359 2 123 4567
```

### 2. Order Confirmation Zap
**Trigger:** Webhook - `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/order-confirmation/`
**Action:** Gmail - Send Email

**Email Template:**
```html
Subject: Потвърждение на поръчка #{{orderNumber}} - ТортоМания

Уважаеми {{customerName}},

Благодарим Ви за поръчката! Вашата поръчка е получена и потвърдена.

📋 ДЕТАЙЛИ НА ПОРЪЧКАТА:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Номер на поръчка: #{{orderNumber}}
Дата: {{orderDate}}
Телефон: {{customerPhone}}

🛍️ ПРОДУКТИ:
{{#each items}}
• {{name}} x{{quantity}} - {{total}} лв
{{/each}}

💰 ОБОБЩЕНИЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Междинна сума: {{subtotal}} лв
Доставка: {{deliveryFee}} лв
ОБЩА СУМА: {{total}} лв

🚚 ДОСТАВКА:
Метод: {{deliveryMethod}}
Адрес: {{deliveryAddress}}
Очаквано време: {{estimatedTime}}

💳 ПЛАЩАНЕ: {{paymentMethod}}

🔍 Следете поръчката: {{trackingUrl}}

За въпроси се свържете с нас:
📞 {{bakeryPhone}}
📍 {{bakeryAddress}}

С благодарност,
Екипът на ТортоМания
```

### 3. Status Update Zap
**Trigger:** Webhook - `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/status-update/`
**Action:** Gmail - Send Email

**Email Template:**
```html
Subject: {{statusTitle}} - Поръчка #{{orderNumber}}

Здравейте {{customerName}},

{{statusIcon}} {{statusMessage}}

📦 Поръчка #{{orderNumber}}
🕐 Актуализация от: {{updateTime}}

{{#if nextSteps}}
➡️ СЛЕДВАЩИ СТЪПКИ:
{{nextSteps}}
{{/if}}

{{#if estimatedCompletion}}
⏱️ Очаквано време: {{estimatedCompletion}}
{{/if}}

{{#if contactInfo}}
📞 Контакт: {{contactInfo}}
{{/if}}

🔍 Следете поръчката: {{trackingUrl}}

Благодарим за доверието!
Екипът на ТортоМания
```

### 4. Loyalty Reward Zap
**Trigger:** Webhook - `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/loyalty/`
**Action:** Gmail - Send Email

**Email Template:**
```html
Subject: 🎉 Нова награда от програмата за лоялност!

Честито, {{customerName}}! 🎊

Спечелихте нова награда от нашата програма за лоялност!

🏆 ВАШАТА НАГРАДА:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{rewardDescription}}
Стойност: {{rewardValue}}

⭐ ВАШИЯТ СТАТУС:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Текущо ниво: {{currentTier}}
Общо точки: {{totalPoints}}
Нови точки: +{{newPoints}}

{{#if nextTier}}
Следващо ниво: {{nextTier}}
Нужни точки: {{pointsToNextTier}}
{{/if}}

🌟 СПЕЦИАЛНА ОФЕРТА: {{specialOffer}}
📅 Валидна до: {{validUntil}}

🎁 Вземете наградата: {{redeemUrl}}

Продължете да събирате точки с всяка поръчка!

С уважение,
Екипът на ТортоМания
```

### 5. Admin Alert Zap
**Trigger:** Webhook - `https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/admin-alert/`
**Action:** Gmail - Send Email to Admin

**Email Template:**
```html
Subject: 🚨 {{alertType}} - {{productCount}} продукта

АДМИНИСТРАЦИЯ - ВАЖНО УВЕДОМЛЕНИЕ

⚠️ {{alertType}}
🕐 Време: {{alertTime}}
📊 Общо продукти: {{productCount}}
🔥 Спешни: {{urgentCount}}

ПРОДУКТИ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{#each products}}
• {{name}} ({{sku}})
  Налични: {{currentStock}}/{{minStock}}
  {{status}}
{{/each}}

{{#if actionRequired}}
⚡ ИЗИСКВА СЕ СПЕШНО ДЕЙСТВИЕ!
{{/if}}

🔗 Админ панел: {{dashboardUrl}}

Автоматично генерирано от системата
{{timestamp}}
```

## Setup Instructions

### Step 1: Create Zapier Account
1. Go to https://zapier.com
2. Sign up or log in with aopopov01@gmail.com
3. Create a new workspace for "ТортоМания"

### Step 2: Create Each Zap
For each of the 5 email types above:

1. **Create New Zap**
2. **Choose Trigger:** Webhooks by Zapier → Catch Hook
3. **Copy Webhook URL** and update in `/src/services/emailIntegration.js`
4. **Choose Action:** Gmail → Send Email
5. **Connect Gmail Account:** aopopov01@gmail.com
6. **Configure Email:**
   - To: Use `{{to}}` from webhook data
   - Subject: Use template subject above
   - Body: Use HTML template above
7. **Test & Activate**

### Step 3: Update Webhook URLs
Replace placeholders in `emailIntegration.js`:

```javascript
this.zapierWebhooks = {
  orderConfirmation: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/order-confirmation/',
  statusUpdate: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/status-update/', 
  welcomeEmail: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/welcome/',
  loyaltyReward: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/loyalty/',
  lowStock: 'https://hooks.zapier.com/hooks/catch/YOUR_ACCOUNT_ID/admin-alert/'
};
```

### Step 4: Test Integration
Use the test functions in the email service:

```javascript
// Test welcome email
await emailService.sendWelcomeEmail({
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Потребител',
  loyaltyTier: 'bronze',
  id: '123'
});

// Test order confirmation
await emailService.sendOrderConfirmation({
  customer: { email: 'test@example.com', firstName: 'Тест', phone: '+359888123456' },
  orderNumber: 'TEST001',
  items: [{ name: { bg: 'Тестов хляб' }, quantity: 2, price: 3.50 }],
  total: 7.00,
  createdAt: new Date(),
  id: 'test-order-123'
});
```

## Advanced Features

### Email Personalization
All emails support Bulgarian language and include:
- Customer name personalization
- Loyalty tier recognition
- Order-specific details
- Branded styling
- Contact information

### Delivery Optimization
- High priority emails (confirmations, order ready) are sent immediately
- Medium/low priority emails are batched and sent every 2 minutes
- Automatic retry with exponential backoff
- Email logging for analytics

### Admin Monitoring
- Real-time low stock alerts
- Email delivery statistics
- Failed email notifications
- Queue monitoring

## Troubleshooting

### Common Issues:
1. **Webhook not triggering:** Check URL and test with Zapier test function
2. **Gmail authentication:** Re-authenticate Gmail connection in Zapier
3. **Template errors:** Verify Handlebars syntax in templates
4. **Rate limiting:** Zapier has daily limits - upgrade if needed

### Logs Location:
- Email queue logs: `/email-logs/queue/`
- Sent emails: `/email-logs/sent/`
- Failed emails: `/email-logs/failed/`

## Security Notes
- Never expose webhook URLs publicly
- Use HTTPS only
- Implement rate limiting
- Monitor for abuse
- Regular security audits

## Cost Estimation
- Zapier Free: 100 tasks/month
- Zapier Starter: $20/month - 750 tasks
- Zapier Professional: $49/month - 2000 tasks

For a bakery with 50 orders/day:
- ~150 emails/day (confirmation + status updates)
- ~4500 emails/month
- Requires Professional plan

## Next Steps
1. Set up all 5 Zapier webhooks
2. Test each email type
3. Monitor delivery rates
4. Optimize templates based on customer feedback
5. Scale to additional email types (promotions, newsletters)