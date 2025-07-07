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
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';

// Helper to safely parse JSON
const safeJson = async (response) => {
  try { return await response.json(); }
  catch { return {}; }
};

const AboutManagement = () => {
  const [aboutContent, setAboutContent] = useState({
    journey_title: '',
    journey_points: [],
    education_title: '',
    education_items: [],
    strengths_title: '',
    strengths_list: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.ABOUT), getRequestConfig());
      if (response.ok) {
        const data = await safeJson(response);
        setAboutContent(data);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.ABOUT), getRequestConfig('PUT', aboutContent));

      if (response.ok) {
        setMessage('About content updated successfully!');
      } else {
        const error = await safeJson(response);
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage('Error updating about content');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addJourneyPoint = () => {
    setAboutContent(prev => ({
      ...prev,
      journey_points: [...prev.journey_points, { point: '' }]
    }));
  };

  const removeJourneyPoint = (index) => {
    setAboutContent(prev => ({
      ...prev,
      journey_points: prev.journey_points.filter((_, i) => i !== index)
    }));
  };

  const updateJourneyPoint = (index, value) => {
    setAboutContent(prev => ({
      ...prev,
      journey_points: prev.journey_points.map((item, i) => 
        i === index ? { ...item, point: value } : item
      )
    }));
  };

  const addEducationItem = () => {
    setAboutContent(prev => ({
      ...prev,
      education_items: [...prev.education_items, { institution: '', details: '' }]
    }));
  };

  const removeEducationItem = (index) => {
    setAboutContent(prev => ({
      ...prev,
      education_items: prev.education_items.filter((_, i) => i !== index)
    }));
  };

  const updateEducationItem = (index, field, value) => {
    setAboutContent(prev => ({
      ...prev,
      education_items: prev.education_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addStrength = () => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: [...prev.strengths_list, '']
    }));
  };

  const removeStrength = (index) => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: prev.strengths_list.filter((_, i) => i !== index)
    }));
  };

  const updateStrength = (index, value) => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: prev.strengths_list.map((item, i) => 
        i === index ? value : item
      )
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
            <p className="mt-4 text-gray-600">Loading about content...</p>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">About Section Management</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Update your about section content and information</p>
        </div>
      </div>
      
      {/* Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Journey Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaUser size={18} />
              Journey Section
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Journey Title *
              </label>
              <input
                type="text"
                name="journey_title"
                value={aboutContent.journey_title}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="e.g., My Journey"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Journey Points
                </label>
                <button
                  type="button"
                  onClick={addJourneyPoint}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <FaPlus size={12} className="inline mr-1" />
                  Add Point
                </button>
              </div>
              
              <div className="space-y-3">
                {aboutContent.journey_points.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={point.point}
                      onChange={(e) => updateJourneyPoint(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                      placeholder="Enter journey point..."
                    />
                    <button
                      type="button"
                      onClick={() => removeJourneyPoint(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaFileAlt size={18} />
              Education Section
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Education Title *
              </label>
              <input
                type="text"
                name="education_title"
                value={aboutContent.education_title}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="e.g., Education"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Education Items
                </label>
                <button
                  type="button"
                  onClick={addEducationItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <FaPlus size={12} className="inline mr-1" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {aboutContent.education_items.map((item, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-3 sm:p-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.institution}
                        onChange={(e) => updateEducationItem(index, 'institution', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Institution name..."
                      />
                      <button
                        type="button"
                        onClick={() => removeEducationItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <textarea
                      value={item.details}
                      onChange={(e) => updateEducationItem(index, 'details', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                      placeholder="Degree, year, details..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strengths Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaCode size={18} />
              Strengths Section
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Strengths Title *
              </label>
              <input
                type="text"
                name="strengths_title"
                value={aboutContent.strengths_title}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="e.g., My Strengths"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Strengths List
                </label>
                <button
                  type="button"
                  onClick={addStrength}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <FaPlus size={12} className="inline mr-1" />
                  Add Strength
                </button>
              </div>
              
              <div className="space-y-3">
                {aboutContent.strengths_list.map((strength, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => updateStrength(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      placeholder="Enter strength..."
                    />
                    <button
                      type="button"
                      onClick={() => removeStrength(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
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
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default AboutManagement; 