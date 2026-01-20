#!/bin/bash

# 🚀 Prepare Repository for Vercel Deployment
# This script stages all the files needed for Vercel deployment

echo "📦 Preparing files for Vercel deployment..."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Stage the important files
echo "📋 Staging Vercel configuration files..."
git add vercel.json
git add .vercelignore
git add package.json

echo "📋 Staging documentation..."
git add VERCEL_DEPLOYMENT_GUIDE.md
git add VERCEL_QUICK_START.md
git add VERCEL_ARCHITECTURE_GUIDE.md

echo "📋 Staging frontend files..."
git add frontend/package.json
git add frontend/src/
git add frontend/public/
git add frontend/tailwind.config.js
git add frontend/craco.config.js

echo "📋 Staging backend files (for reference)..."
git add backend/requirements.txt
git add backend/server.py

echo ""
echo "✅ Files staged successfully!"
echo ""

# Show status
echo "📊 Git status:"
git status --short

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Review the changes:"
echo "   git diff --staged"
echo ""
echo "2️⃣  Commit the changes:"
echo "   git commit -m \"Configure for Vercel deployment\""
echo ""
echo "3️⃣  Push to GitHub:"
echo "   git push origin main"
echo "   (or: git push origin master)"
echo ""
echo "4️⃣  Deploy to Vercel:"
echo "   → Go to: https://vercel.com/new"
echo "   → Import your GitHub repository"
echo "   → Follow the settings in VERCEL_QUICK_START.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 For detailed instructions, read:"
echo "   - VERCEL_QUICK_START.md (quick reference)"
echo "   - VERCEL_DEPLOYMENT_GUIDE.md (full guide)"
echo "   - VERCEL_ARCHITECTURE_GUIDE.md (technical details)"
echo ""
