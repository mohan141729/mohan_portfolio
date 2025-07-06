# Portfolio Frontend

A modern, responsive portfolio website built with React and Vite.

## Features

- Dynamic content management through admin panel
- Responsive design with modern UI/UX
- Real-time content updates
- Image upload capabilities
- Contact form with backend integration

## Configuration

### Environment Variables

The application uses environment variables for configuration. Create the following files:

#### `.env` (Development)
```env
# API Configuration
VITE_API_URL=http://localhost:4000

# App Configuration
VITE_APP_NAME=Mohan Portfolio
VITE_APP_VERSION=1.0.0
```

#### `.env.production` (Production)
```env
# API Configuration - Update this with your production API URL
VITE_API_URL=https://your-production-api.com

# App Configuration
VITE_APP_NAME=Mohan Portfolio
VITE_APP_VERSION=1.0.0
```

### API Configuration

The application uses a centralized API configuration system located in `src/config/api.js`. This provides:

- Centralized endpoint management
- Environment-based URL configuration
- Consistent request configuration
- Helper functions for API calls

#### Key Features:

1. **Environment-based URLs**: Automatically uses the correct API URL based on environment
2. **Endpoint Management**: All API endpoints are defined in one place
3. **Request Helpers**: Pre-configured request options for different HTTP methods
4. **FormData Support**: Special handling for file uploads

#### Usage Examples:

```javascript
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';

// GET request
const response = await fetch(buildApiUrl(ENDPOINTS.PROJECTS), getRequestConfig());

// POST request with data
const response = await fetch(buildApiUrl(ENDPOINTS.PROJECTS), getRequestConfig('POST', data));

// FormData request (for file uploads)
const response = await fetch(buildApiUrl(ENDPOINTS.PROJECTS), {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Configuration section above)

3. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── config/             # Configuration files
│   └── api.js         # API configuration
└── assets/            # Static assets
```

## API Integration

All API calls are centralized through the configuration system. The application supports:

- **Public endpoints**: For portfolio content (hero, about, projects, etc.)
- **Protected endpoints**: For admin functionality (requires authentication)
- **File uploads**: For images and documents
- **Authentication**: Session-based admin authentication

## Deployment

1. Update the `VITE_API_URL` in `.env.production` with your production API URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting provider

## Contributing

1. Follow the existing code structure
2. Use the API configuration system for all backend calls
3. Maintain consistent styling with Tailwind CSS
4. Test thoroughly before submitting changes
