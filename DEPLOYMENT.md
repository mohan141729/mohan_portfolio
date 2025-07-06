# Deployment Guide

This guide will help you deploy your portfolio application with the backend on Render and frontend on Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Update Environment Variables**:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values with your production settings:
   ```bash
   # Generate a strong JWT secret
   JWT_SECRET=your_very_strong_jwt_secret_here
   
   # Update CORS origins to include your Vercel frontend URL
   ALLOWED_ORIGINS=https://your-frontend-name.vercel.app,http://localhost:5173
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Connect to GitHub**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" and select "Web Service"
   - Connect your GitHub account and select your repository

2. **Configure the Web Service**:
   - **Name**: `mohan-portfolio-backend` (or your preferred name)
   - **Root Directory**: `backend` (since your backend is in a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose the free plan

3. **Environment Variables**:
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your_very_strong_jwt_secret_here
   ALLOWED_ORIGINS=https://your-frontend-name.vercel.app,http://localhost:5173
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Note the URL (e.g., `https://mohan-portfolio-backend.onrender.com`)

### Step 3: Test Backend Deployment

1. **Health Check**: Visit `https://your-backend-name.onrender.com/api/health`
2. **Should return**: `{"status":"OK","timestamp":"..."}`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update API URL**:
   - Edit `frontend/.env.production`
   - Replace `your-backend-name.onrender.com` with your actual Render backend URL:
   ```
   VITE_API_URL=https://your-actual-backend-name.onrender.com
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Update frontend API URL for production"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Connect to GitHub**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure the Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   Add these environment variables in Vercel:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   VITE_DEV_MODE=false
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend
   - Note the URL (e.g., `https://your-project-name.vercel.app`)

### Step 3: Update Backend CORS

1. **Update Render Environment Variables**:
   - Go back to your Render dashboard
   - Update the `ALLOWED_ORIGINS` environment variable to include your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-frontend-name.vercel.app,http://localhost:5173
   ```
   - Redeploy the backend

## Post-Deployment Setup

### Step 1: Create Admin Account

1. **Generate Password Hash**:
   ```bash
   cd backend
   node generate-hash.js your_admin_password
   ```

2. **Update Database**:
   - Use the generated hash to create an admin account
   - You can use the `create-admin.js` script or manually insert into the database

### Step 2: Test the Application

1. **Frontend**: Visit your Vercel URL
2. **Admin Panel**: Navigate to `/admin` and log in
3. **Test Features**: Try uploading images, creating content, etc.

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `ALLOWED_ORIGINS` includes your Vercel URL
   - Check that the backend URL in frontend environment variables is correct

2. **Database Issues**:
   - Render uses ephemeral storage, so the database will reset on each deployment
   - Consider using a persistent database service for production

3. **File Upload Issues**:
   - Uploaded files will be lost on Render redeployments
   - Consider using a cloud storage service (AWS S3, Cloudinary, etc.)

4. **Build Failures**:
   - Check the build logs in Render/Vercel
   - Ensure all dependencies are in `package.json`

### Environment Variables Checklist

**Backend (Render)**:
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `JWT_SECRET=your_secret`
- [ ] `ALLOWED_ORIGINS=https://your-frontend.vercel.app`

**Frontend (Vercel)**:
- [ ] `VITE_API_URL=https://your-backend.onrender.com`
- [ ] `VITE_DEV_MODE=false`

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **CORS**: Only allow necessary origins
3. **Environment Variables**: Never commit sensitive data to git
4. **HTTPS**: Both Render and Vercel provide HTTPS by default

## Monitoring

1. **Render**: Monitor logs in the Render dashboard
2. **Vercel**: Check deployment status and logs in Vercel dashboard
3. **Health Checks**: Use the `/api/health` endpoint to monitor backend status

## Next Steps

1. **Custom Domain**: Configure custom domains for both services
2. **Database**: Migrate to a persistent database service
3. **File Storage**: Implement cloud storage for uploaded files
4. **Monitoring**: Set up proper logging and monitoring
5. **CI/CD**: Configure automatic deployments on git push 