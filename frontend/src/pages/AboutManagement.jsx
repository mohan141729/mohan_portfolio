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
  FaUser,
  FaImage
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, getRequestConfig, getFormDataConfig, ENDPOINTS } from '../config/api';

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
    strengths_list: [],
    about_image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
        if (data.about_image) {
          setImagePreview(data.about_image);
        }
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('journey_title', aboutContent.journey_title);
      formData.append('journey_points', JSON.stringify(aboutContent.journey_points));
      formData.append('education_title', aboutContent.education_title);
      formData.append('education_items', JSON.stringify(aboutContent.education_items));
      formData.append('strengths_title', aboutContent.strengths_title);
      formData.append('strengths_list', JSON.stringify(aboutContent.strengths_list));

      if (imageFile) {
        formData.append('about_image', imageFile);
      }

      const response = await fetch(buildApiUrl(ENDPOINTS.ABOUT), {
        ...getFormDataConfig('PUT'),
        body: formData
      });

      if (response.ok) {
        const data = await safeJson(response);
        setMessage('About content updated successfully!');
        if (data.about?.about_image) {
          setAboutContent(prev => ({ ...prev, about_image: data.about.about_image }));
        }
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

  // Change strengths_list to be an array of objects: { name, level }
  // Update addStrength, removeStrength, updateStrength
  const addStrength = () => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: [
        ...prev.strengths_list,
        { name: '', level: 80 }
      ]
    }));
  };

  const removeStrength = (index) => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: prev.strengths_list.filter((_, i) => i !== index)
    }));
  };

  const updateStrength = (index, field, value) => {
    setAboutContent(prev => ({
      ...prev,
      strengths_list: prev.strengths_list.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
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
        {/* Image Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaImage size={18} />
              Profile Image
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors">
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg mb-4">
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUser size={40} className="text-gray-400" />
                </div>
              )}
              <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2">
                <FaUpload />
                <span>Choose Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              <p className="text-sm text-gray-500">Recommended: Square aspect ratio, max 5MB</p>
            </div>
          </div>
        </motion.div>
        {/* Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaBriefcase />
              Journey
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                name="journey_title"
                value={aboutContent.journey_title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. My Journey"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Journey Points</label>
              <AnimatePresence>
                {aboutContent.journey_points.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-2"
                  >
                    <textarea
                      value={item.point}
                      onChange={(e) => updateJourneyPoint(index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      rows="2"
                      placeholder="Share a milestone..."
                    />
                    <button
                      type="button"
                      onClick={() => removeJourneyPoint(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addJourneyPoint}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FaPlus size={12} /> Add Point
              </button>
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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaGraduationCap />
              Education
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                name="education_title"
                value={aboutContent.education_title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Education"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Education Items</label>
              <AnimatePresence>
                {aboutContent.education_items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeEducationItem(index)}
                      className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash size={14} />
                    </button>
                    <input
                      type="text"
                      value={item.institution}
                      onChange={(e) => updateEducationItem(index, 'institution', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="Institution Name"
                    />
                    <textarea
                      value={item.details}
                      onChange={(e) => updateEducationItem(index, 'details', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                      rows="2"
                      placeholder="Details (Degree, Year, etc.)"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addEducationItem}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <FaPlus size={12} /> Add Education
              </button>
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
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaCode />
              Strengths
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                name="strengths_title"
                value={aboutContent.strengths_title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Core Strengths"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Strengths List</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {aboutContent.strengths_list.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 group"
                    >
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => updateStrength(index, 'name', e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 placeholder-gray-400"
                        placeholder="Strength..."
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.level || 80}
                        onChange={(e) => updateStrength(index, 'level', e.target.value)}
                        className="w-16 bg-white border border-gray-300 rounded px-1 py-0.5 text-xs text-center"
                        title="Proficiency Level %"
                      />
                      <button
                        type="button"
                        onClick={() => removeStrength(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                      >
                        <FaTimes size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={addStrength}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-2 text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  <FaPlus size={12} /> Add Strength
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 sticky bottom-6 z-20">
          <Link
            to="/admin"
            className="px-6 py-2.5 rounded-xl text-gray-600 bg-white border border-gray-200 font-medium hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:translate-y-[-1px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutManagement;