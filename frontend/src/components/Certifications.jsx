import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertifications();
    fetchResume();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_CERTIFICATIONS));
      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }
      const data = await response.json();
      setCertifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications');
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_RESUME));
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    }
  };

  const handleDownloadResume = () => {
    if (resume) {
      const link = document.createElement('a');
      link.href = `${buildApiUrl('')}${resume.file_path}`;
      link.download = resume.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="certifications">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Certifications & Resume</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Professional certifications and achievements that validate my expertise.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="certifications">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Certifications & Resume</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Professional certifications and achievements that validate my expertise.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="certifications">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Certifications & Resume</h2>
      <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Professional certifications and achievements that validate my expertise.</p>
      
      <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
        {/* Resume Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center"
        >
          <div className="mb-4 sm:mb-6">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📄</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Download Resume</h3>
            <p className="text-gray-600 text-sm sm:text-base">Get a detailed overview of my experience and skills</p>
          </div>
          <button 
            onClick={handleDownloadResume}
            disabled={!resume}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {resume ? `Download ${resume.filename}` : 'Resume Unavailable'}
          </button>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {Array.isArray(certifications) && certifications.map((certification, index) => (
            <motion.div
              key={certification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {certification.image && (
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img
                    src={getImageUrl(certification.image)}
                    alt={certification.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{certification.name}</h3>
                  {certification.expiry_date && isExpired(certification.expiry_date) && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Expired
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBuilding size={14} />
                    <span className="text-xs sm:text-sm">{certification.issuer}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt size={14} />
                    <span className="text-xs sm:text-sm">
                      Issued: {formatDate(certification.issue_date)}
                    </span>
                  </div>
                  
                  {certification.expiry_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt size={14} />
                      <span className={`text-xs sm:text-sm ${isExpired(certification.expiry_date) ? 'text-red-600' : ''}`}>
                        Expires: {formatDate(certification.expiry_date)}
                      </span>
                    </div>
                  )}
                  
                  {certification.credential_id && (
                    <div className="text-xs sm:text-sm text-gray-500">
                      ID: {certification.credential_id}
                    </div>
                  )}
                </div>
                
                {certification.credential_url && (
                  <a
                    href={certification.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                  >
                    <FaExternalLinkAlt size={12} />
                    View Credential
                  </a>
                )}
            </div>
            </motion.div>
          ))}
        </div>

        {(!Array.isArray(certifications) || certifications.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No certifications available</h3>
            <p className="text-gray-600">Certifications will be displayed here once added.</p>
          </div>
        )}
    </div>
  </section>
);
};

export default Certifications; 