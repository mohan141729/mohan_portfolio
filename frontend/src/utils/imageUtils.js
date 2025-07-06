import { buildApiUrl } from '../config/api';

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from the database
 * @returns {string} The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, check if it's localhost and convert
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // If it's a localhost URL, convert it to production URL
    if (imagePath.includes('localhost:4000')) {
      const filename = imagePath.split('/').pop(); // Get the filename
      return `${buildApiUrl('')}/uploads/${filename}`;
    }
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  if (imagePath.startsWith('/')) {
    return `${buildApiUrl('')}${imagePath}`;
  }
  
  // If it's just a filename, add the uploads path
  return `${buildApiUrl('')}/uploads/${imagePath}`;
};

/**
 * Check if an image URL is valid
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} True if the URL is valid
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl) return false;
  
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get a fallback image URL
 * @returns {string} A fallback image URL
 */
export const getFallbackImageUrl = () => {
  return '/placeholder-image.jpg'; // You can add a placeholder image to your public folder
};

/**
 * Debug function to log image URL conversion
 * @param {string} originalPath - The original image path
 * @param {string} convertedUrl - The converted URL
 */
export const debugImageUrl = (originalPath, convertedUrl) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🖼️ Image URL Debug:');
    console.log('  Original:', originalPath);
    console.log('  Converted:', convertedUrl);
  }
}; 