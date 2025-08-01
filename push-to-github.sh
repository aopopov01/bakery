#!/bin/bash

# 🚀 AUTOMATED GITHUB PUSH SCRIPT
# Run this script after creating the GitHub repository

echo "🚀 ТортоМания GitHub Push Script"
echo "================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Committing all changes..."
    git add .
    git commit -m "🔧 Final updates before GitHub push

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
fi

# Prompt for GitHub repository URL
echo "📝 Please provide your GitHub repository URL:"
echo "Example: https://github.com/username/tortomaniya-bakery.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL is required"
    exit 1
fi

# Validate URL format
if [[ ! "$REPO_URL" =~ ^https://github\.com/.+/.+\.git$ ]]; then
    echo "❌ Error: Invalid GitHub repository URL format"
    echo "Expected format: https://github.com/username/repository.git"
    exit 1
fi

# Add remote origin
echo "🔗 Adding GitHub remote..."
if git remote get-url origin >/dev/null 2>&1; then
    echo "📝 Remote 'origin' already exists, updating..."
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Repository pushed to GitHub!"
    echo "=========================="
    echo ""
    echo "📊 What was pushed:"
    echo "   ✅ Complete ТортоМания bakery platform"
    echo "   ✅ All UI/UX enhancements and fixes"
    echo "   ✅ Complete system backup (100% restoration)"
    echo "   ✅ Comprehensive documentation (Claude.md)"
    echo "   ✅ Docker development environment"
    echo "   ✅ Email integration system"
    echo ""
    echo "🌐 Your repository: ${REPO_URL%.git}"
    echo ""
    echo "🔄 Next steps:"
    echo "   • Visit your GitHub repository to verify all files"
    echo "   • Clone in other locations using: git clone $REPO_URL"
    echo "   • Use system-backup/restore.sh for 100% restoration"
else
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo "   • Make sure the GitHub repository exists"
    echo "   • Check your GitHub authentication (git config --global user.name/email)"
    echo "   • Ensure repository URL is correct"
    echo "   • Try: git push --force-with-lease origin main (if needed)"
fi