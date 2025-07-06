import React, { useState } from 'react';
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
  FaUserCog,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaLock,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { logout, user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/api/admin/change-password'), getRequestConfig('PUT', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }));

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          newEmail: formData.newEmail
        });
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.newEmail || !formData.currentPassword) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(buildApiUrl('/api/admin/change-email'), getRequestConfig('PUT', {
        currentPassword: formData.currentPassword,
        newEmail: formData.newEmail
      }));

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email changed successfully! You will need to log in again.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          newEmail: ''
        });
        // Logout after email change
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        setError(data.error || 'Failed to change email');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Admin Settings</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Manage your admin account credentials</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Change Password Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaLock size={18} />
              Change Password
            </h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </motion.div>

        {/* Change Email Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaUser size={18} />
              Change Email
            </h2>
          </div>
          
          <form onSubmit={handleEmailChange} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm sm:text-base"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Email *
              </label>
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? 'Changing Email...' : 'Change Email'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Current User Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
            <FaUserCog size={18} />
            Account Information
          </h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <p className="text-sm sm:text-base text-slate-800 font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <p className="text-sm sm:text-base text-slate-800 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings; 