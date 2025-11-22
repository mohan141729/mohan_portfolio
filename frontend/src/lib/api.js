import { buildApiUrl, getRequestConfig, getFormDataConfig, ENDPOINTS } from '../config/api';

// Resume API functions - adapted for single resume system
export const fetchAllResumes = async () => {
  const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), getRequestConfig());
  
  if (!response.ok) {
    if (response.status === 404) {
      // No resume found, return empty array
      return [];
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch resume');
  }
  
  const resume = await response.json();
  // Convert single resume to array format for consistency
  return resume ? [resume] : [];
};

export const createResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), {
    ...getFormDataConfig('POST'),
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create resume');
  }
  
  return response.json();
};

export const updateResume = async (id, file) => {
  // For the current backend, update is the same as create (replaces existing)
  return createResume(file);
};

export const deleteResume = async (id) => {
  const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), getRequestConfig('DELETE'));
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete resume');
  }
  
  return response.json();
};
