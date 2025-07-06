import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaCode, 
  FaCertificate, 
  FaEnvelope, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheck,
  FaUpload,
  FaFileAlt,
  FaUserCog,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    email: '',
    github_url: '',
    linkedin_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_INFO), getRequestConfig());
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_INFO), getRequestConfig('PUT', contactInfo));

      if (response.ok) {
        setMessage('Contact information updated successfully!');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage('Error updating contact information');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FaTachometerAlt },
    { name: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
    { name: 'Skills', path: '/admin/skills', icon: FaCode },
    { name: 'Certifications', path: '/admin/certifications', icon: FaCertificate },
    { name: 'Resume', path: '/admin/resume', icon: FaFileAlt },
    { name: 'Messages', path: '/admin/contact', icon: FaEnvelope },
    { name: 'Admin Settings', path: '/admin/settings', icon: FaUserCog },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="flex-1 p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Contact Information Management</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Update your contact details and social media links</p>
        </div>
      </div>
      
      {/* Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 sm:p-4 rounded-xl flex items-center justify-between text-sm sm:text-base ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-slate-400 hover:text-slate-600">
              <FaTimes size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaEnvelope size={18} />
              Basic Information
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={contactInfo.title}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., Get In Touch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={contactInfo.subtitle}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., Let's work together"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={contactInfo.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                placeholder="Brief description about how people can reach you..."
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaPhone size={18} />
              Contact Details
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={contactInfo.location}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaGithub size={18} />
              Social Media Links
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={contactInfo.github_url}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={contactInfo.linkedin_url}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactManagement; 