@echo off
echo 🚀 Mohan Portfolio Deployment Script
echo =====================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first.
    pause
    exit /b 1
)

REM Check if there are uncommitted changes
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  You have uncommitted changes. Please commit them first.
    git status --short
    echo.
    set /p commit_changes="Do you want to commit all changes? (y/n): "
    if /i "%commit_changes%"=="y" (
        git add .
        git commit -m "Auto-commit before deployment"
        echo ✅ Changes committed
    ) else (
        echo ❌ Please commit your changes manually and run this script again.
        pause
        exit /b 1
    )
)

echo.
echo 📋 Deployment Checklist:
echo ========================

echo 🔧 Backend (Render):
echo    [ ] Create Render account at https://render.com
echo    [ ] Connect GitHub repository
echo    [ ] Create Web Service with:
echo        - Root Directory: backend
echo        - Environment: Node
echo        - Build Command: npm install
echo        - Start Command: npm start
echo    [ ] Set environment variables:
echo        - NODE_ENV=production
echo        - PORT=10000
echo        - JWT_SECRET=your_strong_secret
echo        - ALLOWED_ORIGINS=https://your-frontend.vercel.app

echo.
echo 🎨 Frontend (Vercel):
echo    [ ] Create Vercel account at https://vercel.com
echo    [ ] Import GitHub repository
echo    [ ] Configure project:
echo        - Framework: Vite
echo        - Root Directory: frontend
echo        - Build Command: npm run build
echo        - Output Directory: dist
echo    [ ] Set environment variables:
echo        - VITE_API_URL=https://your-backend.onrender.com
echo        - VITE_DEV_MODE=false

echo.
echo 📝 Next Steps:
echo ==============
echo 1. Deploy backend to Render first
echo 2. Get the Render URL (e.g., https://your-backend.onrender.com)
echo 3. Update frontend/.env.production with the Render URL
echo 4. Deploy frontend to Vercel
echo 5. Update backend CORS with Vercel URL
echo 6. Test the application

echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo.
echo 🎯 Quick Commands:
echo ==================
echo Backend health check: curl https://your-backend.onrender.com/api/health
echo Frontend URL: https://your-project.vercel.app
echo Admin panel: https://your-project.vercel.app/admin

echo.
echo ✅ Deployment script completed!
echo Happy deploying! 🚀
pause 