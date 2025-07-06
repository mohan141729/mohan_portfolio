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
        const data = await response.json();
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
        const error = await response.json();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h2>
            <p className="text-sm text-slate-600">About Management</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    item.path === '/admin/about'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group w-full"
            >
              <FaSignOutAlt size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">About Section Management</h1>
            <p className="text-slate-600 text-lg">Update your journey, education, and strengths information</p>
          </div>
          
          {/* Alerts */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Journey Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FaUser size={20} />
                  My Journey
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Journey Title *
                  </label>
                  <input
                    type="text"
                    name="journey_title"
                    value={aboutContent.journey_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., My Journey"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Journey Points
                  </label>
                  <div className="space-y-4">
                    {aboutContent.journey_points.map((point, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={point.point}
                            onChange={(e) => updateJourneyPoint(index, e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter journey point (e.g., Passion for Technology: My journey began...)"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeJourneyPoint(index)}
                          className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addJourneyPoint}
                      className="w-full px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:border-blue-400 hover:text-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaPlus size={16} />
                      Add Journey Point
                    </button>
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
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FaCertificate size={20} />
                  Education Timeline
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Education Title *
                  </label>
                  <input
                    type="text"
                    name="education_title"
                    value={aboutContent.education_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Education Timeline"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Education Items
                  </label>
                  <div className="space-y-4">
                    {aboutContent.education_items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => updateEducationItem(index, 'institution', e.target.value)}
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Institution name"
                          required
                        />
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={item.details}
                            onChange={(e) => updateEducationItem(index, 'details', e.target.value)}
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Details (e.g., CGPA, percentage)"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeEducationItem(index)}
                            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEducationItem}
                      className="w-full px-4 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:border-purple-400 hover:text-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaPlus size={16} />
                      Add Education Item
                    </button>
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
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <FaCode size={20} />
                  Core Strengths
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Strengths Title *
                  </label>
                  <input
                    type="text"
                    name="strengths_title"
                    value={aboutContent.strengths_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Core Strengths"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Strengths List
                  </label>
                  <div className="space-y-4">
                    {aboutContent.strengths_list.map((strength, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={strength}
                          onChange={(e) => updateStrength(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter strength"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeStrength(index)}
                          className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStrength}
                      className="w-full px-4 py-3 border-2 border-dashed border-green-300 text-green-600 rounded-xl hover:border-green-400 hover:text-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaPlus size={16} />
                      Add Strength
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end pt-6"
            >
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaCheck size={16} />
                    Save Changes
                  </div>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AboutManagement; 