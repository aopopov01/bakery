#!/usr/bin/env node

/**
 * ТортоМания Email Server Test Script
 * Tests all email endpoints with sample Bulgarian data
 */

const axios = require('axios');

const EMAIL_SERVER_URL = 'http://localhost:3001';

// Test data
const testData = {
  welcome: {
    userData: {
      email: 'test@example.com',
      firstName: 'Тест',
      lastName: 'Потребител',
      loyaltyTier: 'bronze',
      id: 'user-123'
    }
  },
  
  orderConfirmation: {
    orderData: {
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
        },
        {
          name: { bg: 'Традиционен хляб' },
          quantity: 2,
          price: 3.50
        }
      ],
      subtotal: 32.90,
      deliveryFee: 5.00,
      total: 37.90,
      delivery: {
        type: 'delivery',
        address: {
          street: 'ул. Витоша 15',
          city: 'София',
          postalCode: '1000'
        }
      },
      payment: {
        method: 'Карта'
      },
      createdAt: new Date(),
      id: 'order-123'
    }
  },
  
  statusUpdate: {
    orderId: 'order-123',
    newStatus: 'ready',
    customerData: {
      email: 'customer@example.com',
      firstName: 'Мария'
    },
    orderNumber: 'TM-001'
  },
  
  loyaltyReward: {
    userData: {
      email: 'loyal@example.com',
      firstName: 'Петър',
      loyaltyTier: 'silver',
      loyaltyPoints: 750
    },
    rewardData: {
      pointsEarned: 50,
      type: 'purchase',
      value: '5 лв отстъпка',
      description: 'За поръчка над 30 лв',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('bg-BG')
    }
  },
  
  adminAlert: {
    products: [
      {
        name: { bg: 'Шоколадова торта' },
        sku: 'CAKE_CHOC_001',
        stock: 0,
        minStock: 5,
        id: 'prod-1'
      },
      {
        name: { bg: 'Традиционен хляб' },
        sku: 'BREAD_TRAD_001',
        stock: 2,
        minStock: 10,
        id: 'prod-2'
      }
    ],
    adminEmail: 'aopopov01@gmail.com'
  }
};

async function testEndpoint(endpoint, data, description) {
  try {
    console.log(`\n🧪 Testing ${description}...`);
    console.log(`📤 POST ${EMAIL_SERVER_URL}${endpoint}`);
    
    const response = await axios.post(`${EMAIL_SERVER_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data.success) {
      console.log(`✅ ${description} - SUCCESS`);
      console.log(`   Queue ID: ${response.data.queueId || 'N/A'}`);
    } else {
      console.log(`❌ ${description} - FAILED`);
      console.log(`   Error: ${response.data.error}`);
    }
    
    return response.data;
    
  } catch (error) {
    console.log(`❌ ${description} - ERROR`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error || error.message}`);
    } else if (error.request) {
      console.log(`   Connection error: ${error.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

async function checkServerHealth() {
  try {
    console.log('🏥 Checking server health...');
    const response = await axios.get(`${EMAIL_SERVER_URL}/health`, { timeout: 5000 });
    
    console.log('✅ Email server is healthy');
    console.log(`   Service: ${response.data.service}`);
    console.log(`   Queue length: ${response.data.stats.queueLength}`);
    console.log(`   Total sent: ${response.data.stats.totalSent}`);
    console.log(`   Total failed: ${response.data.stats.totalFailed}`);
    
    return true;
  } catch (error) {
    console.log('❌ Email server is not responding');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure to start the server with: npm start');
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 ТортоМания Email Server Test Suite');
  console.log('=====================================');
  
  // Check server health first
  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    console.log('\n❌ Cannot proceed with tests - server is not running');
    console.log('   Start the server with: cd email-server && npm start');
    process.exit(1);
  }
  
  // Test all endpoints
  const results = [];
  
  results.push(await testEndpoint('/api/email/welcome', testData.welcome, 'Welcome Email'));
  results.push(await testEndpoint('/api/email/order-confirmation', testData.orderConfirmation, 'Order Confirmation'));
  results.push(await testEndpoint('/api/email/status-update', testData.statusUpdate, 'Status Update'));
  results.push(await testEndpoint('/api/email/loyalty-reward', testData.loyaltyReward, 'Loyalty Reward'));
  results.push(await testEndpoint('/api/email/admin-alert', testData.adminAlert, 'Admin Alert'));
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📧 Total: ${results.length}`);
  
  if (successful === results.length) {
    console.log('\n🎉 All tests passed! Email server is working correctly.');
    console.log('   Check your Gmail inbox for test emails.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  // Check final server stats
  console.log('\n📈 Final Server Stats');
  try {
    const statsResponse = await axios.get(`${EMAIL_SERVER_URL}/api/email/stats`);
    console.log(`   Queue length: ${statsResponse.data.queueLength}`);
    console.log(`   Processing: ${statsResponse.data.isProcessing ? 'Yes' : 'No'}`);
    console.log(`   Total sent: ${statsResponse.data.totalSent}`);
    console.log(`   Total failed: ${statsResponse.data.totalFailed}`);
  } catch (error) {
    console.log('   Could not fetch stats');
  }
}

// Handle command line arguments
if (process.argv.includes('--health')) {
  checkServerHealth();
} else if (process.argv.includes('--welcome')) {
  testEndpoint('/api/email/welcome', testData.welcome, 'Welcome Email');
} else if (process.argv.includes('--order')) {
  testEndpoint('/api/email/order-confirmation', testData.orderConfirmation, 'Order Confirmation');
} else if (process.argv.includes('--status')) {
  testEndpoint('/api/email/status-update', testData.statusUpdate, 'Status Update');
} else if (process.argv.includes('--loyalty')) {
  testEndpoint('/api/email/loyalty-reward', testData.loyaltyReward, 'Loyalty Reward');
} else if (process.argv.includes('--admin')) {
  testEndpoint('/api/email/admin-alert', testData.adminAlert, 'Admin Alert');
} else {
  runAllTests();
}