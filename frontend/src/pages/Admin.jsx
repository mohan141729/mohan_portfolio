import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaCode, 
  FaCertificate, 
  FaEnvelope, 
  FaUsers,
  FaPlus,
  FaUser,
  FaInfoCircle,
  FaFileAlt,
  FaRobot
} from 'react-icons/fa';
import { buildApiUrl, getRequestConfig } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import notificationSound from '../assets/notification.mp3'; // Place a notification.mp3 in assets

const Admin = () => {
  const [stats, setStats] = useState({ projects: 0, skills: 0, certifications: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(buildApiUrl('/api/stats'), getRequestConfig());
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          // Fetch unread messages count
          const messagesResponse = await fetch(buildApiUrl('/api/contact'), getRequestConfig());
          if (messagesResponse.ok) {
            const messages = await messagesResponse.json();
            const unread = Array.isArray(messages) ? messages.filter(m => m.status !== 'read').length : 0;
            setUnreadCount(unread);
          }
        } else if (response.status === 401) {
          setStats({ projects: '-', skills: '-', certifications: '-', messages: '-' });
          alert('You are not authorized. Please log in as admin.');
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to fetch stats:', errorData);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated]);

  // Show notification only if there are unread messages
  useEffect(() => {
    if (isAuthenticated && !loading && unreadCount > 0) {
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Unread Messages', {
          body: `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}.`,
          icon: '/vite.svg'
        });
      }
      // Play sound
      const audio = new Audio(notificationSound);
      audio.play();
      // Show toast message
      setToast(`You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}.`);
      setTimeout(() => setToast(''), 5000);
    }
  }, [isAuthenticated, loading, unreadCount]);

  // Request notification permission on mount if not already granted
  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <div className="flex gap-2">
        <Link
          to="/"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaUsers size={16} />
          Back to Portfolio
        </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Total Projects</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{loading ? '-' : stats.projects}</p>
              <p className="text-xs text-green-600 font-medium mt-1">&nbsp;</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <FaProjectDiagram className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Skills</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{loading ? '-' : stats.skills}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">&nbsp;</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
              <FaCode className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Certifications</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{loading ? '-' : stats.certifications}</p>
              <p className="text-xs text-orange-600 font-medium mt-1">&nbsp;</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <FaCertificate className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Messages</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{loading ? '-' : stats.messages}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">&nbsp;</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
              <FaEnvelope className="text-white" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/admin/hero"
            className="group p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaUser className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-800 text-sm sm:text-base">Edit Hero Section</h3>
                <p className="text-xs sm:text-sm text-indigo-600">Update hero content and images</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/about"
            className="group p-4 sm:p-6 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 border border-cyan-200 hover:border-cyan-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaInfoCircle className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-cyan-800 text-sm sm:text-base">Edit About Section</h3>
                <p className="text-xs sm:text-sm text-cyan-600">Update journey and education info</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/projects"
            className="group p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:border-purple-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 text-sm sm:text-base">Add New Project</h3>
                <p className="text-xs sm:text-sm text-purple-600">Create a new portfolio project</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/skills"
            className="group p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:border-green-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">Add New Skill</h3>
                <p className="text-xs sm:text-sm text-green-600">Add a technical skill</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/certifications"
            className="group p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200 hover:border-orange-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Add Certification</h3>
                <p className="text-xs sm:text-sm text-orange-600">Add a new certification</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/resume"
            className="group p-4 sm:p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all duration-300 border border-teal-200 hover:border-teal-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-teal-800 text-sm sm:text-base">Manage Resume</h3>
                <p className="text-xs sm:text-sm text-teal-600">Upload and manage your CV</p>
              </div>
            </div>
          </Link>
          {/* New Quick Action: Manage AI Tools */}
          <Link
            to="/admin/ai-tools"
            className="group p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaRobot className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Manage AI Tools</h3>
                <p className="text-xs sm:text-sm text-blue-600">Add or edit AI tools</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Admin; 