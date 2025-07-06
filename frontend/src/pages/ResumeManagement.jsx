import React, { useState, useEffect } from 'react';
import { buildApiUrl, getFormDataConfig, ENDPOINTS } from '../config/api';
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

const ResumeManagement = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), getRequestConfig());
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      } else if (response.status === 404) {
        setResume(null);
      } else {
        setError('Failed to fetch resume');
      }
    } catch (err) {
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

      const response = await fetch(buildApiUrl(ENDPOINTS.RESUME), {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Resume uploaded successfully!');
        fetchResume();
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (err) {
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
      setError('Network error');
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading resume...</p>
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
            <p className="text-sm text-slate-600">Resume Management</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    item.path === '/admin/resume'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg'
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Resume Management</h1>
              <p className="text-slate-600 text-lg">Upload and manage your resume/CV</p>
            </div>
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaFileAlt size={16} />
              Back to Portfolio
            </Link>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between"
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
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center justify-between"
              >
                <span>{success}</span>
                <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
                  <FaTimes size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {resume ? (
            /* Current Resume Display */
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl">
                  <FaFileAlt className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Current Resume</h2>
                  <p className="text-slate-600">Your uploaded resume file</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4">
                  {getFileIcon(resume.filename)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg">{resume.filename}</h3>
                    <p className="text-slate-600 text-sm">
                      Size: {formatFileSize(resume.size)} • Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${buildApiUrl('')}${resume.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="View Resume"
                    >
                      <FaEye size={16} />
                    </a>
                    <a
                      href={`${buildApiUrl('')}${resume.file_path}`}
                      download
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Download Resume"
                    >
                      <FaDownload size={16} />
                    </a>
                    <button
                      onClick={handleDelete}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Delete Resume"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Upload New Resume</h4>
                <p className="text-blue-600 text-sm">
                  Upload a new file to replace your current resume. Supported formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>
          ) : (
            /* Upload Area */
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl">
                  <FaUpload className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Upload Resume</h2>
                  <p className="text-slate-600">Upload your resume or CV file</p>
                </div>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-teal-400 bg-teal-50' 
                    : 'border-slate-300 bg-gradient-to-r from-slate-50 to-slate-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto">
                      <FaUpload className="text-teal-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {dragActive ? 'Drop your resume here' : 'Click to upload or drag and drop'}
                      </h3>
                      <p className="text-slate-600 mb-4">
                        Supported formats: PDF, DOC, DOCX, JPG, PNG
                      </p>
                      <p className="text-sm text-slate-500">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {uploading && (
                <div className="mt-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-2 text-slate-600">Uploading resume...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeManagement; 