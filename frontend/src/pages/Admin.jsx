import React from 'react';
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
  FaFileAlt
} from 'react-icons/fa';

const Admin = () => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600 text-lg">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <Link
          to="/"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaUsers size={16} />
          Back to Portfolio
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-slate-800">3</p>
              <p className="text-xs text-green-600 font-medium mt-1">+2 this month</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <FaProjectDiagram className="text-white" size={28} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Skills</p>
              <p className="text-3xl font-bold text-slate-800">6</p>
              <p className="text-xs text-blue-600 font-medium mt-1">+1 this week</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
              <FaCode className="text-white" size={28} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Certifications</p>
              <p className="text-3xl font-bold text-slate-800">2</p>
              <p className="text-xs text-orange-600 font-medium mt-1">+1 this month</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <FaCertificate className="text-white" size={28} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Messages</p>
              <p className="text-3xl font-bold text-slate-800">0</p>
              <p className="text-xs text-slate-500 font-medium mt-1">No new messages</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
              <FaEnvelope className="text-white" size={28} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/hero"
            className="group p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaUser className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-800">Edit Hero Section</h3>
                <p className="text-sm text-indigo-600">Update hero content and images</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/about"
            className="group p-6 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 border border-cyan-200 hover:border-cyan-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaInfoCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-cyan-800">Edit About Section</h3>
                <p className="text-sm text-cyan-600">Update journey and education info</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/projects"
            className="group p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:border-purple-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">Add New Project</h3>
                <p className="text-sm text-purple-600">Create a new portfolio project</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/skills"
            className="group p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:border-green-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Add New Skill</h3>
                <p className="text-sm text-green-600">Add a technical skill</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/certifications"
            className="group p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200 hover:border-orange-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaPlus className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Add Certification</h3>
                <p className="text-sm text-orange-600">Add a new certification</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/resume"
            className="group p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all duration-300 border border-teal-200 hover:border-teal-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-teal-800">Manage Resume</h3>
                <p className="text-sm text-teal-600">Upload and manage your CV</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/contact"
            className="group p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl hover:from-pink-100 hover:to-pink-200 transition-all duration-300 border border-pink-200 hover:border-pink-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FaEnvelope className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-pink-800">Manage Contact Info</h3>
                <p className="text-sm text-pink-600">Update contact details and social links</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Admin; 