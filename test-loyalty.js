#!/usr/bin/env node
// Test script for loyalty program functionality
// Simulates the loyalty point calculation and tier upgrade logic

// Loyalty tier thresholds (in лв spent)
const LOYALTY_TIERS = {
  bronze: { min: 0, max: 99.99, pointsMultiplier: 1, name: 'Бронз' },
  silver: { min: 100, max: 299.99, pointsMultiplier: 1.2, name: 'Сребро' },
  gold: { min: 300, max: 699.99, pointsMultiplier: 1.5, name: 'Злато' },
  platinum: { min: 700, max: Infinity, pointsMultiplier: 2, name: 'Платина' }
};

// Calculate loyalty tier based on total spent
const calculateLoyaltyTier = (totalSpent) => {
  for (const [tier, config] of Object.entries(LOYALTY_TIERS)) {
    if (totalSpent >= config.min && totalSpent <= config.max) {
      return tier;
    }
  }
  return 'bronze';
};

// Test user data
const testUser = {
  id: 'test123',
  email: 'test@example.com',
  firstName: 'Тест',
  lastName: 'Потребител',
  loyaltyPoints: 0,
  loyaltyTier: 'bronze',
  totalSpent: 0,
  orderCount: 0
};

// Add loyalty points function (from AuthContext)
const addLoyaltyPoints = (user, purchaseAmount) => {
  const currentTier = LOYALTY_TIERS[user.loyaltyTier];
  const pointsEarned = Math.floor(purchaseAmount * currentTier.pointsMultiplier);
  const newTotalSpent = user.totalSpent + purchaseAmount;
  const newTier = calculateLoyaltyTier(newTotalSpent);

  const updatedUser = {
    ...user,
    loyaltyPoints: user.loyaltyPoints + pointsEarned,
    totalSpent: newTotalSpent,
    orderCount: user.orderCount + 1,
    loyaltyTier: newTier
  };
  
  return {
    user: updatedUser,
    pointsEarned,
    tierChanged: newTier !== user.loyaltyTier,
    newTier: LOYALTY_TIERS[newTier].name,
    oldTier: LOYALTY_TIERS[user.loyaltyTier].name,
    newTotalPoints: updatedUser.loyaltyPoints,
    newTotalSpent: newTotalSpent
  };
};

console.log('🧪 Testing ТортоМания Loyalty Program\n');

// Test scenarios
const testScenarios = [
  { description: 'Small order - stays in Bronze tier', amount: 25.50 },
  { description: 'Medium order - still Bronze tier', amount: 45.00 },
  { description: 'Large order - upgrade to Silver tier', amount: 50.00 },
  { description: 'Another order in Silver tier', amount: 75.00 },
  { description: 'Big order - upgrade to Gold tier', amount: 150.00 },
  { description: 'Premium order - upgrade to Platinum tier', amount: 400.00 }
];

let currentUser = { ...testUser };

testScenarios.forEach((scenario, index) => {
  console.log(`\n📋 Test ${index + 1}: ${scenario.description}`);
  console.log(`💰 Purchase amount: ${scenario.amount.toFixed(2)} лв`);
  console.log(`📊 Before: ${currentUser.loyaltyPoints} points, ${LOYALTY_TIERS[currentUser.loyaltyTier].name} tier, ${currentUser.totalSpent.toFixed(2)} лв spent`);
  
  const result = addLoyaltyPoints(currentUser, scenario.amount);
  currentUser = result.user;
  
  console.log(`🎯 Points earned: ${result.pointsEarned}`);
  console.log(`📈 After: ${result.newTotalPoints} points, ${result.newTier} tier, ${result.newTotalSpent.toFixed(2)} лв spent`);
  
  if (result.tierChanged) {
    console.log(`🎉 TIER UPGRADE! ${result.oldTier} → ${result.newTier}`);
    console.log(`📧 Would send loyalty reward email with tier upgrade notification`);
  } else if (result.pointsEarned > 0 && scenario.amount >= 50) {
    console.log(`💰 Would send points earned email (significant purchase)`);
  }
});

console.log('\n✅ Loyalty Program Test Complete!');
console.log('\n🎯 Final user status:');
console.log(`- Points: ${currentUser.loyaltyPoints}`);
console.log(`- Tier: ${LOYALTY_TIERS[currentUser.loyaltyTier].name} (${currentUser.loyaltyTier})`);
console.log(`- Total spent: ${currentUser.totalSpent.toFixed(2)} лв`);
console.log(`- Orders: ${currentUser.orderCount}`);

// Test edge cases
console.log('\n🔬 Testing edge cases:');

// Test tier boundaries
const tierBoundaryTests = [
  { spent: 99.99, expected: 'bronze', desc: 'Just below Silver threshold' },
  { spent: 100.00, expected: 'silver', desc: 'Exactly at Silver threshold' },
  { spent: 299.99, expected: 'silver', desc: 'Just below Gold threshold' },
  { spent: 300.00, expected: 'gold', desc: 'Exactly at Gold threshold' },
  { spent: 699.99, expected: 'gold', desc: 'Just below Platinum threshold' },
  { spent: 700.00, expected: 'platinum', desc: 'Exactly at Platinum threshold' },
  { spent: 1000.00, expected: 'platinum', desc: 'Well above Platinum threshold' }
];

tierBoundaryTests.forEach(test => {
  const calculatedTier = calculateLoyaltyTier(test.spent);
  const result = calculatedTier === test.expected ? '✅' : '❌';
  console.log(`${result} ${test.desc}: ${test.spent} лв → ${LOYALTY_TIERS[calculatedTier].name} (expected ${LOYALTY_TIERS[test.expected].name})`);
});