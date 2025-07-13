// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // Request configuration
  REQUEST_CONFIG: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/admin/login',
  LOGOUT: '/api/admin/logout',
  
  // Public endpoints
  PUBLIC_HERO: '/api/public/hero',
  PUBLIC_ABOUT: '/api/public/about',
  PUBLIC_CONTACT: '/api/public/contact',
  PUBLIC_PROJECTS: '/api/projects',
  PUBLIC_SKILLS: '/api/skills',
  PUBLIC_CERTIFICATIONS: '/api/certifications',
  PUBLIC_RESUME: '/api/public/resume',
  PUBLIC_AI_TOOLS: '/api/ai-tools',
  
  // Protected endpoints
  HERO: '/api/hero',
  ABOUT: '/api/about',
  CONTACT_INFO: '/api/contact-info',
  PROJECTS: '/api/projects',
  SKILLS: '/api/skills',
  CERTIFICATIONS: '/api/certifications',
  RESUME: '/api/resume',
  CONTACT_MESSAGES: '/api/contact',
  AI_TOOLS: '/api/ai-tools',
  
  // Contact form submission
  CONTACT_SUBMIT: '/api/contact',
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get request config
export const getRequestConfig = (method = 'GET', body = null) => {
  const config = {
    ...API_CONFIG.REQUEST_CONFIG,
    method,
  };
  
  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  
  return config;
};

// Helper function for FormData requests
export const getFormDataConfig = (method = 'POST') => {
  return {
    method,
    credentials: 'include',
  };
};

export default API_CONFIG; 