#!/bin/bash

# 🔍 SYSTEM VERIFICATION SCRIPT
# Verifies all features work correctly after restoration

echo "🔍 ТортоМания System Verification"
echo "=================================="

# Check if application is running
echo "1. 🌐 Checking application availability..."
if curl -s http://localhost:4000 > /dev/null; then
    echo "   ✅ Application accessible at http://localhost:4000"
else
    echo "   ❌ Application not accessible. Check if Docker container is running."
    echo "   Run: docker-compose -f docker-compose.dev.yml up --build"
    exit 1
fi

# Check Docker container
echo ""
echo "2. 🐳 Checking Docker container status..."
if docker ps | grep -q "bakery-app-dev"; then
    echo "   ✅ Docker container running"
else
    echo "   ❌ Docker container not found"
fi

# Check essential files
echo ""
echo "3. 📁 Checking essential files..."
files=(
    "src/components/customer/HomePage.jsx"
    "src/components/shared/Header.jsx"
    "src/components/shared/ScrollToTop.jsx"
    "src/components/customer/AboutPage.jsx"
    "src/components/shared/CartSidebar.jsx"
    "src/components/customer/ShoppingCart.jsx"
    "package.json"
    "tailwind.config.js"
    "docker-compose.dev.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file MISSING"
    fi
done

# Check component content
echo ""
echo "4. 🔧 Checking component implementations..."

# Check HomePage for timeline icons
if grep -q "Sparkles" src/components/customer/HomePage.jsx; then
    echo "   ✅ Timeline Sparkles icon implemented"
else
    echo "   ❌ Timeline Sparkles icon missing"
fi

if grep -q "Flame" src/components/customer/HomePage.jsx; then
    echo "   ✅ Timeline Flame icon implemented"
else
    echo "   ❌ Timeline Flame icon missing"
fi

# Check Header for mobile menu
if grep -q "mobileMenuOpen" src/components/shared/Header.jsx; then
    echo "   ✅ Mobile navigation menu implemented"
else
    echo "   ❌ Mobile navigation menu missing"
fi

# Check ScrollToTop component
if [ -f "src/components/shared/ScrollToTop.jsx" ]; then
    echo "   ✅ ScrollToTop component exists"
else
    echo "   ❌ ScrollToTop component missing"
fi

# Check cart images
if grep -q "item.image" src/components/shared/CartSidebar.jsx; then
    echo "   ✅ Cart sidebar images implemented"
else
    echo "   ❌ Cart sidebar images missing"
fi

if grep -q "item.image" src/components/customer/ShoppingCart.jsx; then
    echo "   ✅ Shopping cart images implemented"
else
    echo "   ❌ Shopping cart images missing"
fi

echo ""
echo "5. 🎨 Checking responsive styling..."
if grep -q "md:hidden" src/components/shared/Header.jsx; then
    echo "   ✅ Responsive classes implemented"
else
    echo "   ❌ Responsive classes missing"
fi

echo ""
echo "📊 VERIFICATION SUMMARY"
echo "======================"
echo ""
echo "✅ All critical features should be working if no errors above"
echo ""
echo "🧪 Manual Testing Checklist:"
echo "   1. Open http://localhost:4000"
echo "   2. Hover over timeline icons (should spin/change color)"
echo "   3. Test mobile menu (resize browser window)"
echo "   4. Navigate between pages (should scroll to top)"
echo "   5. Add items to cart (images should display)"
echo "   6. Check About page (should have content and images)"
echo "   7. Test responsive design on different screen sizes"
echo ""
echo "📞 If issues found:"
echo "   • Check docker-compose logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   • Rebuild container: docker-compose -f docker-compose.dev.yml up --build"
echo "   • Ensure port 4000 is not blocked by other services"