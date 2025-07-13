import React, { useState, useEffect, useRef } from 'react';
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';
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
  FaTimes,
  FaCheck,
  FaFileAlt,
  FaUserCog
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Helper to safely parse JSON
const safeJson = async (response) => {
  try { return await response.json(); }
  catch { return {}; }
};

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { logout } = useAuth();

  // Ensure resetForm is defined before use
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      proficiency: 50
    });
    setEditingSkill(null);
    setError('');
    setSuccess('');
  };

  // Debug showForm state
  useEffect(() => {
    console.log('SkillManagement - showForm state changed:', showForm);
  }, [showForm]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.SKILLS), getRequestConfig());
      if (response.ok) {
        const data = await safeJson(response);
        setSkills(data);
      } else {
        setError('Failed to fetch skills');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const body = JSON.stringify(formData);
      const url = editingSkill
        ? `${buildApiUrl(ENDPOINTS.SKILLS)}/${editingSkill._id || editingSkill.id}`
        : buildApiUrl(ENDPOINTS.SKILLS);
      const method = editingSkill ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body
      });
      const data = await safeJson(response);
      if (response.ok) {
        setSuccess(editingSkill ? 'Skill updated successfully!' : 'Skill created successfully!');
        resetForm();
        setShowForm(false);
        fetchSkills();
      } else {
        setError(data.error || 'Operation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`${buildApiUrl(ENDPOINTS.SKILLS)}/${id}`, getRequestConfig('DELETE'));

      if (response.ok) {
        setSuccess('Skill deleted successfully!');
        fetchSkills();
      } else {
        setError('Failed to delete skill');
      }
    } catch (err) {
      setError('Network error');
    }
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

  const categories = ['Frontend', 'Backend', 'Programming', 'Database', 'Tools', 'Other'];

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="flex-1 p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading skills...</p>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Skill Management</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Manage your technical skills</p>
        </div>
        <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center font-semibold"
          >
            <FaPlus size={16} />
            Add Skill
          </button>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between text-sm sm:text-base"
          >
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <FaTimes size={16} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center justify-between text-sm sm:text-base"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
              <FaTimes size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={category || index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Proficiency Level: {formData.proficiency}%
                  </label>
                  <input
                    type="range"
                    name="proficiency"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {submitting ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Create Skill')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Skills List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {skills
          .filter(skill => {
            // Only include skills with at least one non-empty unique identifier
            return skill && (
              (skill._id && skill._id !== '') ||
              (skill.id && skill.id !== '') ||
              (skill.name && skill.name !== '')
            );
          })
          .map((skill, idx) => {
            // Always generate a unique, non-empty key
            let key = '';
            if (skill._id && skill._id !== '') key = skill._id;
            else if (skill.id && skill.id !== '') key = skill.id;
            else if (skill.name && skill.name !== '') key = `${skill.name}-${idx}`;
            else key = `skill-${idx}`;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">{skill.name || 'Unnamed Skill'}</h3>
                      <p className="text-sm text-slate-600">{skill.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Proficiency</span>
                    <span>{typeof skill.proficiency === 'number' ? skill.proficiency : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${typeof skill.proficiency === 'number' ? skill.proficiency : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 font-semibold"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id || skill.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 font-semibold"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default SkillManagement; 