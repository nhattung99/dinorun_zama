@echo off
echo 🚀 CryptoRace Zama - Demo Deployment Script
echo =============================================

REM Check if required tools are installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Install with: npm i -g vercel
    pause
    exit /b 1
)

where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Install with: npm i -g @railway/cli
    pause
    exit /b 1
)

echo ✅ Required tools found

REM Deploy Frontend to Vercel
echo 🌐 Deploying Frontend to Vercel...
cd frontend-fhe-race

REM Check if already logged in to Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel:
    vercel login
)

echo 📦 Building and deploying frontend...
vercel --prod --yes

echo ✅ Frontend deployed!

REM Deploy Backend to Railway
echo 🔧 Deploying Backend to Railway...
cd ..\server

REM Check if already logged in to Railway
railway whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Please login to Railway:
    railway login
)

echo 📦 Building and deploying backend...
railway up --detach

echo ✅ Backend deployed!

echo.
echo 🎉 Deployment Complete!
echo ======================
echo.
echo 📋 Next Steps:
echo 1. Update frontend environment variables in Vercel dashboard
echo 2. Update backend environment variables in Railway dashboard
echo 3. Test the demo links
echo 4. Share with users!
echo.
echo 🔗 Check your Vercel and Railway dashboards for demo links
pause
