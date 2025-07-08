import React, { useState, useEffect, useRef } from 'react';
import { buildApiUrl, getRequestConfig, getFormDataConfig, ENDPOINTS } from '../config/api';
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
  FaUpload,
  FaDownload,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheck,
  FaFilePdf,
  FaFileWord,
  FaFileImage
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Helper to safely parse JSON
const safeJson = async (response) => {
  try { return await response.json(); }
  catch { return {}; }
};

const ResumeManagement = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      console.log('Fetching resume from:', buildApiUrl(ENDPOINTS.RESUME));
      const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), getRequestConfig());
      console.log('Resume fetch response status:', response.status);
      
      if (response.ok) {
        const data = await safeJson(response);
        console.log('Resume data:', data);
        setResume(data);
      } else if (response.status === 401) {
        setResume(null);
        setError('You are not authorized. Please log in as admin.');
        alert('You are not authorized. Please log in as admin.');
      } else if (response.status === 404) {
        console.log('No resume found (404)');
        setResume(null);
      } else {
        const errorData = await safeJson(response);
        console.error('Failed to fetch resume:', errorData);
        setError('Failed to fetch resume');
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      console.log('Uploading to:', buildApiUrl(ENDPOINTS.RESUME));
      const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('Upload response status:', response.status);
      const data = await safeJson(response);
      console.log('Upload response data:', data);

      if (response.ok) {
        setSuccess('Resume uploaded successfully!');
        fetchResume();
      } else if (response.status === 401) {
        setError('You are not authorized. Please log in as admin.');
        alert('You are not authorized. Please log in as admin.');
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Network error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;

    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), getRequestConfig('DELETE'));

      if (response.ok) {
        setSuccess('Resume deleted successfully!');
        setResume(null);
      } else {
        setError('Failed to delete resume');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Network error');
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FaFileAlt className="text-gray-500" size={24} />;
    
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-green-500" size={24} />;
      default:
        return <FaFileAlt className="text-gray-500" size={24} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading resume...</p>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Resume Management</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Upload and manage your resume/CV</p>
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

      {/* Upload Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
            <FaFileAlt size={18} />
            Upload Resume
          </h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-teal-400 bg-teal-50' 
                : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <FaUpload className="text-teal-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                  Upload your resume
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  Drag and drop your resume file here, or click to browse
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                </p>
              </div>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
                disabled={uploading}
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center font-semibold"
              >
                <FaUpload size={16} />
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Resume */}
      {resume && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaEye size={18} />
              Current Resume
            </h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                {getFileIcon(resume.filename)}
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{resume.filename}</h3>
                  <p className="text-sm text-slate-600">
                    Size: {formatFileSize(resume.size)} | Uploaded: {new Date(resume.upload_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a
                  href={`${buildApiUrl('')}${resume.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <FaDownload size={12} className="inline mr-1" />
                  Download
                </a>
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 font-semibold"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Resume State */}
      {!resume && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileAlt className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No resume uploaded</h3>
          <p className="text-sm sm:text-base text-slate-600">
            Upload your resume to make it available for download on your portfolio.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeManagement; 