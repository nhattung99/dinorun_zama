#!/bin/bash

echo "🚀 CryptoRace Zama - Demo Deployment Script"
echo "============================================="

# Check if required tools are installed
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Install with: npm i -g vercel"; exit 1; }
command -v railway >/dev/null 2>&1 || { echo "❌ Railway CLI not found. Install with: npm i -g @railway/cli"; exit 1; }

echo "✅ Required tools found"

# Deploy Frontend to Vercel
echo "🌐 Deploying Frontend to Vercel..."
cd frontend-fhe-race

# Check if already logged in to Vercel
if ! vercel whoami >/dev/null 2>&1; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo "📦 Building and deploying frontend..."
vercel --prod --yes

FRONTEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Frontend deployed to: $FRONTEND_URL"

# Deploy Backend to Railway
echo "🔧 Deploying Backend to Railway..."
cd ../server

# Check if already logged in to Railway
if ! railway whoami >/dev/null 2>&1; then
    echo "🔐 Please login to Railway:"
    railway login
fi

echo "📦 Building and deploying backend..."
railway up --detach

BACKEND_URL=$(railway status | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Backend deployed to: $BACKEND_URL"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Frontend Demo: $FRONTEND_URL"
echo "Backend API: $BACKEND_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend environment variables in Vercel dashboard"
echo "2. Update backend environment variables in Railway dashboard"
echo "3. Test the demo links"
echo "4. Share with users!"
echo ""
echo "🔗 Demo Links:"
echo "- Frontend: $FRONTEND_URL"
echo "- Backend: $BACKEND_URL"
