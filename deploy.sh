#!/bin/bash

# Deployment script for New Thrifts theme

echo "🚀 Starting deployment process..."

# Check if we're on the main branch
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Error: You must be on the main branch to deploy"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Deploy to staging first
echo "🧪 Deploying to staging..."
shopify theme push --store=your-staging-store.myshopify.com --live

# Wait for user confirmation
read -p "✅ Staging deployed. Deploy to production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    shopify theme push --store=your-production-store.myshopify.com --live
    echo "🎉 Deployment complete!"
else
    echo "⏸️ Deployment cancelled"
fi

