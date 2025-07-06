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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Hero Section Management</h1>
          <p className="text-slate-600">Update your hero section content and images</p>
        </div>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Hero Content</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={heroContent.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://github.com/yourusername"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://linkedin.com/in/yourusername"
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
              rows="4"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter a compelling description about yourself..."
              required
            />
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Profile Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'profile')}
                  className="hidden"
                />
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Upload Profile Image</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </label>
              </div>
              {heroContent.profile_image && (
                <div className="text-sm text-slate-600">
                  <p>Current: {heroContent.profile_image}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Background Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="background-image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'background')}
                  className="hidden"
                />
                <label htmlFor="background-image" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Upload Background Image</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </label>
              </div>
              {heroContent.background_image && (
                <div className="text-sm text-slate-600">
                  <p>Current: {heroContent.background_image}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                saving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroManagement; 