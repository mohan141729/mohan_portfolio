import { buildApiUrl } from '../config/api';

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from the database
 * @returns {string} The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
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