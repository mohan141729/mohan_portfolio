import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import SectionWrapper from './SectionWrapper';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [activeBubble, setActiveBubble] = useState(0);
  const cardWidth = 288; // w-72 in px
  const gap = 24; // gap-6 in px
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
      const url = `${buildApiUrl(ENDPOINTS.PUBLIC_RESUME)}/download`;
      window.open(url, '_blank');
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

  // Bubble logic
  const getBubbleCount = () => {
    if (!Array.isArray(certifications) || certifications.length === 0) return 0;
    const visibleCards = Math.floor((window.innerWidth - 64) / (cardWidth + gap));
    return Math.max(1, certifications.length - visibleCards + 1);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const visibleCards = Math.floor((window.innerWidth - 64) / (cardWidth + gap));
    const bubble = Math.round(scrollLeft / (cardWidth + gap));
    setActiveBubble(Math.min(bubble, getBubbleCount() - 1));
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [certifications]);

  // Infinite auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !Array.isArray(certifications) || certifications.length === 0) return;

    let isHovered = false;
    let scrollAmount = 1; // px per tick
    let scrollInterval;

    // Duplicate cards for seamless looping
    const scrollContent = () => {
      if (isHovered) return;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        // Reset to start of first set
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    };

    scrollInterval = setInterval(scrollContent, 16); // ~60fps

    // Pause on hover
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [certifications]);

  // Modal close handler
  const handleModalClose = (e) => {
    if (e.target.id === 'cert-modal-overlay' || e.target.id === 'cert-modal-close') {
      setModalOpen(false);
      setModalImage(null);
    }
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
    <SectionWrapper id="certifications" gradient="bg-gradient-to-b from-green-50 via-white to-blue-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Certifications & Resume</h2>
      <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4 mx-auto">Professional certifications and achievements that validate my expertise.</p>
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

        {/* Certifications Horizontal Scroll Row */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide" ref={scrollRef} style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <div className="flex gap-6 sm:gap-8 px-2 sm:px-4" style={{ WebkitOverflowScrolling: 'touch', minWidth: '100%' }}>
            {/* Duplicate cards for infinite scroll */}
            {Array.isArray(certifications) && [...certifications, ...certifications].map((certification, index) => (
              <motion.div
                key={certification.id + '-' + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % certifications.length) * 0.1 }}
                className="relative group rounded-2xl shadow-xl border border-blue-100 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 hover:shadow-2xl transition-all duration-300 w-72 h-80 flex-shrink-0 flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                  if (certification.image) {
                    setModalImage(getImageUrl(certification.image));
                    setModalOpen(true);
                  }
                }}
              >
                {/* Certificate Image */}
                {certification.image ? (
                  <img
                    src={getImageUrl(certification.image)}
                    alt={certification.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl bg-gradient-to-br from-blue-100 to-indigo-100">No Image</div>
                )}
                {/* Overlay with details on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-black/80 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-center drop-shadow-lg">{certification.name}</h3>
                  {certification.expiry_date && isExpired(certification.expiry_date) && (
                    <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 shadow">Expired</span>
                  )}
                  <div className="space-y-1 text-sm mb-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <FaBuilding size={14} />
                      <span>{certification.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <FaCalendarAlt size={14} />
                      <span>Issued: {formatDate(certification.issue_date)}</span>
                    </div>
                    {certification.expiry_date && (
                      <div className="flex items-center gap-2 justify-center">
                        <FaCalendarAlt size={14} />
                        <span className={`${isExpired(certification.expiry_date) ? 'text-red-200' : 'text-white'}`}>Expires: {formatDate(certification.expiry_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Bubble Indicators */}
        {getBubbleCount() > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: getBubbleCount() }).map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${activeBubble === idx ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'} transition-colors duration-200`}
              />
            ))}
          </div>
        )}

        {(!Array.isArray(certifications) || certifications.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No certifications available</h3>
            <p className="text-gray-600">Certifications will be displayed here once added.</p>
          </div>
        )}
      </div>
      {/* Modal for certificate image */}
      {modalOpen && (
        <div
          id="cert-modal-overlay"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
          onClick={handleModalClose}
        >
          <div className="relative max-w-3xl w-full mx-4">
            <button
              id="cert-modal-close"
              className="absolute top-2 right-2 text-black text-3xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
              onClick={handleModalClose}
              aria-label="Close"
            >
              <IoClose  className='text-black'/>
            </button>
            <img
              src={modalImage}
              alt="Certificate Large"
              className="w-full h-auto max-h-[80vh] rounded-2xl shadow-2xl border-4 border-white object-contain bg-white"
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Certifications; 