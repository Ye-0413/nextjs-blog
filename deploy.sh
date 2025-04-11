#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install dependencies if node_modules doesn't exist or if package.json has changed
if [ ! -d "node_modules" ] || [ package.json -nt node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the project
echo "🏗️ Building the project..."
npm run build

# Run any pre-deployment tasks (like generating sitemap or RSS)
echo "🔧 Running pre-deployment tasks..."
npm run generate-sitemap
npm run generate-rss

# Deploy to production
echo "🚀 Deploying to Vercel production..."
vercel --prod --yes

echo "✅ Deployment complete! Your site is now live."
echo "Visit your Vercel dashboard to see more details and configure settings." 