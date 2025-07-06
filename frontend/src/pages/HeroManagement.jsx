import React, { useState, useEffect } from 'react';
import { buildApiUrl, getFormDataConfig, ENDPOINTS } from '../config/api';

const HeroManagement = () => {
  const [heroContent, setHeroContent] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    github_url: '',
    linkedin_url: '',
    welcome_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.HERO), getFormDataConfig('GET'));
      if (response.ok) {
        const data = await response.json();
        setHeroContent(data);
      }
    } catch (err) {
      console.error('Error fetching hero content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', heroContent.name);
      formData.append('title', heroContent.title);
      formData.append('subtitle', heroContent.subtitle);
      formData.append('description', heroContent.description);
      formData.append('github_url', heroContent.github_url);
      formData.append('linkedin_url', heroContent.linkedin_url);
      formData.append('welcome_text', heroContent.welcome_text);

      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      if (backgroundImage) {
        formData.append('background_image', backgroundImage);
      }

      const response = await fetch(buildApiUrl(ENDPOINTS.HERO), {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setMessage('Hero content updated successfully!');
        setProfileImage(null);
        setBackgroundImage(null);
        // Reset file inputs
        document.getElementById('profile-image').value = '';
        document.getElementById('background-image').value = '';
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage('Error updating hero content');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setProfileImage(file);
      } else {
        setBackgroundImage(file);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Hero Section Management</h1>
          <p className="text-slate-600 text-sm sm:text-base">Update your hero section content and images</p>
        </div>
      </div>
      
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Hero Content</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={heroContent.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Welcome Text *
              </label>
              <input
                type="text"
                name="welcome_text"
                value={heroContent.welcome_text}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Welcome message"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subtitle *
              </label>
              <input
                type="text"
                name="subtitle"
                value={heroContent.subtitle}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="e.g., Hi, I'm John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={heroContent.title}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="e.g., Full-Stack Developer | AI/ML Enthusiast"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GitHub URL *
              </label>
              <input
                type="url"
                name="github_url"
                value={heroContent.github_url}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="https://github.com/username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LinkedIn URL *
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={heroContent.linkedin_url}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="https://linkedin.com/in/username"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={heroContent.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
              placeholder="Enter a compelling description about yourself..."
              required
            />
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Image
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profile')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-slate-500 mt-1">Recommended: Square image, 400x400px or larger</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Background Image
              </label>
              <input
                type="file"
                id="background-image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'background')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-slate-500 mt-1">Recommended: Landscape image, 1920x1080px or larger</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroManagement; 