#!/bin/bash

# UTM Generator - GitHub Deployment Script
# This script will help you push to GitHub and enable GitHub Pages

echo "🚀 Deploying UTM Generator to GitHub..."

# Check if GitHub CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo "📝 GitHub CLI authentication required."
    echo "Please run: gh auth login"
    echo "Then run this script again."
    exit 1
fi

# Create repository and push
echo "📦 Creating GitHub repository..."
gh repo create utm-generator --public --source=. --remote=origin --description "A modern UTM Generator for tracking marketing campaigns, ads, and emails" --push

if [ $? -eq 0 ]; then
    echo "✅ Repository created and code pushed!"
    
    # Enable GitHub Pages
    echo "🌐 Enabling GitHub Pages..."
    gh api repos/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/pages -X POST -f source='{"branch":"main","path":"/"}'
    
    if [ $? -eq 0 ]; then
        echo "✅ GitHub Pages enabled!"
        echo ""
        echo "🎉 Your UTM Generator is now live at:"
        echo "   https://$(gh repo view --json owner,name -q '.owner.login + ".github.io/" + .name')"
        echo ""
        echo "Note: It may take a few minutes for the site to be available."
    else
        echo "⚠️  Could not enable GitHub Pages automatically."
        echo "   Please enable it manually in Settings > Pages"
    fi
else
    echo "❌ Failed to create repository. It might already exist."
    echo "   If it exists, you can just push: git push -u origin main"
fi

