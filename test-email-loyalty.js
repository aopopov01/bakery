#!/usr/bin/env node
// Test loyalty reward email functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const EMAIL_SERVER_URL = 'http://localhost:3001';

// Test user data
const testUser = {
  id: 'test123',
  email: 'aopopov01@gmail.com', // Send to the configured Gmail account for testing
  firstName: 'Тест',
  lastName: 'Потребител',
  loyaltyPoints: 950,
  loyaltyTier: 'platinum',
  totalSpent: 745.50,
  orderCount: 6
};

// Test loyalty reward email for tier upgrade
async function testTierUpgradeEmail() {
  console.log('🎉 Testing tier upgrade loyalty reward email...');
  
  const rewardData = {
    pointsEarned: 600,
    type: 'tier_upgrade',
    value: 'Повишение до Платина',
    description: 'Поздравления! Достигнахте ново ниво в програмата за лоялност.',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('bg-BG') // 90 days
  };

  const emailData = {
    userData: testUser,
    rewardData: rewardData
  };

  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/email/loyalty-reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Tier upgrade email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      return true;
    } else {
      console.log('❌ Failed to send tier upgrade email:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error sending tier upgrade email:', error.message);
    return false;
  }
}

// Test purchase points reward email
async function testPurchasePointsEmail() {
  console.log('\n💰 Testing purchase points loyalty reward email...');
  
  const rewardData = {
    pointsEarned: 90,
    type: 'purchase',
    value: '90 бонус точки',
    description: 'Получихте бонус точки за поръчка на стойност 75.00 лв.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('bg-BG') // 1 year
  };

  const emailData = {
    userData: testUser,
    rewardData: rewardData
  };

  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/email/loyalty-reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Purchase points email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      return true;
    } else {
      console.log('❌ Failed to send purchase points email:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error sending purchase points email:', error.message);
    return false;
  }
}

// Test order confirmation with loyalty integration
async function testOrderConfirmationWithLoyalty() {
  console.log('\n🛒 Testing order confirmation email with loyalty points...');
  
  const orderData = {
    id: 'test-order-' + Date.now(),
    orderNumber: 'ZZ' + new Date().getFullYear().toString().substr(-2) + 
                 (new Date().getMonth() + 1).toString().padStart(2, '0') + 
                 new Date().getDate().toString().padStart(2, '0') + 
                 Date.now().toString().substr(-4),
    customer: {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      name: testUser.firstName + ' ' + testUser.lastName,
      email: testUser.email,
      phone: '+359 88 123 4567'
    },
    delivery: {
      type: 'pickup',
      address: {
        street: '',
        city: 'София',
        postalCode: ''
      }
    },
    payment: {
      method: 'В брой'
    },
    items: [
      {
        id: 'croissant-chocolate',
        name: 'Кроасан с шоколад',
        quantity: 2,
        price: 4.50,
        total: 9.00
      },
      {
        id: 'bread-sourdough',
        name: 'Хляб закваска',
        quantity: 1,
        price: 6.00,
        total: 6.00
      }
    ],
    subtotal: 15.00,
    deliveryFee: 0,
    total: 15.00,
    status: 'pending',
    createdAt: new Date().toISOString(),
    notes: 'Тест поръчка за лоялността'
  };

  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/email/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderData })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log(`📋 Order: ${orderData.orderNumber} for ${orderData.total.toFixed(2)} лв`);
      return true;
    } else {
      console.log('❌ Failed to send order confirmation email:', result.error);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error sending order confirmation email:', error.message);
    return false;
  }
}

// Check email server stats
async function checkEmailStats() {
  console.log('\n📊 Checking email server statistics...');
  
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/email/stats`);
    const stats = await response.json();
    
    console.log(`📬 Queue length: ${stats.queueLength}`);
    console.log(`📧 Total sent: ${stats.totalSent}`);
    console.log(`❌ Total failed: ${stats.totalFailed}`);
    console.log(`⚙️ Processing: ${stats.isProcessing}`);
    
    if (stats.recentLog && stats.recentLog.length > 0) {
      console.log('\n📝 Recent activity:');
      stats.recentLog.slice(-5).forEach(log => {
        console.log(`  ${log.timestamp} - ${log.type}: ${log.message}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Could not fetch email stats:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Loyalty Email Integration Tests\n');
  
  // Check email server health first
  try {
    const healthResponse = await fetch(`${EMAIL_SERVER_URL}/health`);
    const health = await healthResponse.json();
    console.log(`✅ Email server is healthy: ${health.service}`);
  } catch (error) {
    console.log('❌ Email server is not accessible:', error.message);
    return;
  }
  
  const tests = [
    testTierUpgradeEmail,
    testPurchasePointsEmail,
    testOrderConfirmationWithLoyalty
  ];
  
  let passed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  await checkEmailStats();
  
  console.log(`\n🎯 Test Results: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All loyalty email tests passed! The system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the email server logs.');
  }
}

// Add timeout and error handling
if (require.main === module) {
  const timeout = setTimeout(() => {
    console.log('⏰ Tests timed out after 30 seconds');
    process.exit(1);
  }, 30000);
  
  runAllTests()
    .then(() => {
      clearTimeout(timeout);
      process.exit(0);
    })
    .catch((error) => {
      clearTimeout(timeout);
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}