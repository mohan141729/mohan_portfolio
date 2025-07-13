# Mohan Portfolio

A full-stack portfolio website with a React frontend and Node.js (Express) backend, using MongoDB for data storage.

## Recent Improvements

- Advanced UI colors and gradients for Certifications and Skills sections for a modern, consistent look
- Center-aligned section descriptions for improved readability
- Enhanced certification card overlays and tag styles
- Improved responsive design and accessibility

## Planned Features

- AI-powered portfolio guide: An agent that helps visitors explore the portfolio based on their interests
- Interactive knowledge graph: Visualize connections between skills, certifications, and projects
- Real-time project analytics dashboard
- Blockchain-verified certificates for authenticity
- Personalized learning path generator for visitors

## Project Structure

```
mohan_portfolio/
├── backend/          # Node.js Express server (MongoDB)
├── frontend/         # React Vite application
└── README.md
```

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Icons
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer, Cloudinary
- **Deployment:** Backend on Render, Frontend on Vercel

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment file:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your values:
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD_HASH`: Hashed password (use the generate-hash.js script)
   - `JWT_SECRET`: A secure random string for JWT signing
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLOUDINARY_URL`: Cloudinary config for image uploads
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs
5. Generate password hash (optional):
   ```bash
   node generate-hash.js your_password
   ```
6. Start the backend server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see below for variables):
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_APP_NAME=Mohan Portfolio
   VITE_APP_VERSION=1.0.0
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Features

### Backend API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (admin)
- `GET /api/certifications` - Get all certifications
- `POST /api/certifications` - Create certification (admin)
- `GET /api/public/hero` - Get hero section content
- `POST /api/hero` - Update hero section (admin)
- `GET /api/public/about` - Get about section content
- `POST /api/about` - Update about section (admin)
- `GET /api/public/contact` - Get contact info
- `POST /api/contact-info` - Update contact info (admin)
- `GET /api/public/resume` - Get resume info
- `POST /api/resume` - Upload resume (admin)
- `GET /api/certifications` - Get certifications
- `POST /api/certifications` - Add certification (admin)
- `GET /api/contact` - Get contact messages (admin)
- `POST /api/contact` - Submit contact form
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify JWT token

### Frontend Features

- Responsive portfolio website
- Admin authentication and protected admin panel
- Dynamic project, skills, certifications, and resume management
- Contact form with backend integration
- Modern UI with Tailwind CSS
- Smooth animations with Framer Motion
- Image upload support (Cloudinary)

### Admin Panel Management

- Hero section content
- About section content
- Projects (CRUD)
- Skills (CRUD)
- Certifications (CRUD)
- Resume upload
- Contact info and messages
- Admin settings

## Database

The backend uses **MongoDB** with the following collections:
- projects
- skills
- certifications
- heroContent
- aboutContent
- contactInfo
- resume
- contactMessages
- admin

## Environment Variables

### Backend
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `MONGODB_URI`, `CLOUDINARY_URL`, `ALLOWED_ORIGINS`

### Frontend
- `VITE_API_URL`, `VITE_APP_NAME`, `VITE_APP_VERSION`

## Authentication

Admin authentication uses:
- JWT tokens for session management
- bcrypt for password hashing
- Environment variables for secure configuration

## Deployment

- Backend is deployed on **Render**
- Frontend is deployed on **Vercel**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment steps

**Note:**
- Render's free plan uses ephemeral storage; uploaded files (images, resumes) may be lost on redeploy. Use a persistent storage solution (e.g., Cloudinary for images).
- Update CORS and environment variables for your production domains.

## Troubleshooting

1. **CORS Errors**: Ensure the backend CORS configuration includes your frontend URL
2. **Database Issues**: Check your MongoDB connection string and database permissions
3. **Authentication Issues**: Verify environment variables are set correctly
4. **Port Conflicts**: Change the PORT in .env if 4000 is already in use
5. **File Upload Issues**: Ensure Cloudinary is configured for image uploads

## License

Specify your license here (e.g., MIT, Apache-2.0, etc.)