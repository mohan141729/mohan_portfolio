import React, { useState, useEffect, useRef } from 'react';
import { FaExternalLinkAlt, FaGithub, FaEye, FaStar, FaChevronLeft, FaChevronRight, FaInfoCircle, FaPlay, FaTimes, FaCalendarAlt, FaUser, FaCode, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import SectionWrapper from './SectionWrapper';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [activeBubble, setActiveBubble] = useState(0);
  const cardWidth = 400; // Project card width in px (adjusted for better fit)
  const gap = 24; // gap-6 in px
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Backend ratings: { [projectId]: { average, count } }
  const [backendRatings, setBackendRatings] = useState({});
  // User's rating for this session (not persisted)
  const [userRatings, setUserRatings] = useState({});
  const [showFeedback, setShowFeedback] = useState({}); // { [projectId]: true/false }
  const [pendingRating, setPendingRating] = useState({}); // { [projectId]: 0-5 }

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all project ratings from backend
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((project) => {
        fetchBackendRating(project._id || project.id);
      });
    }
    // eslint-disable-next-line
  }, [projects]);

  const fetchBackendRating = async (projectId) => {
    try {
      const res = await fetch(buildApiUrl(`/api/projects/${projectId}/ratings`));
      if (res.ok) {
        const data = await res.json();
        setBackendRatings(prev => ({ ...prev, [projectId]: data }));
      }
    } catch {}
  };

  const handleRate = (projectId, rating) => {
    setUserRatings(prev => ({ ...prev, [projectId]: rating }));
  };

  const openFeedback = (projectId) => {
    setShowFeedback(prev => ({ ...prev, [projectId]: true }));
    setPendingRating(prev => ({ ...prev, [projectId]: userRatings[projectId] || 0 }));
  };
  
  const closeFeedback = (projectId) => {
    setShowFeedback(prev => ({ ...prev, [projectId]: false }));
  };
  
  const submitFeedback = async (projectId) => {
    if (pendingRating[projectId]) {
      // POST to backend
      await fetch(buildApiUrl(`/api/projects/${projectId}/ratings`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: pendingRating[projectId] })
      });
      setUserRatings(prev => ({ ...prev, [projectId]: pendingRating[projectId] }));
      setShowFeedback(prev => ({ ...prev, [projectId]: false }));
      fetchBackendRating(projectId);
    }
  };

  // Helper: get backend average rating (to one decimal)
  const getAverageRating = (projectId) => {
    const avg = backendRatings[projectId]?.average || 0;
    return Math.round(avg * 10) / 10;
  };
  
  const getRatingCount = (projectId) => backendRatings[projectId]?.count || 0;

  const fetchProjects = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_PROJECTS));
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const placeholderImg = (
    <div className="w-full h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400 rounded-t-2xl">
      <div className="text-center">
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto mb-2">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
          <path d="M8 17l4-4 4 4M8 13l4-4 4 4" />
        </svg>
        <p className="text-xs">No Image</p>
      </div>
    </div>
  );

  const renderProjectImage = (project) => {
    if (project.image && project.image.trim() !== '') {
      return (
        <img 
          src={getImageUrl(project.image)} 
          alt={project.title}
          className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-t-2xl"
          onError={(e) => {
            // Hide the image and show placeholder
            e.target.style.display = 'none';
            const placeholder = e.target.parentElement.querySelector('.placeholder-img');
            if (placeholder) {
              placeholder.style.display = 'flex';
            }
          }}
        />
      );
    }
    return null;
  };

  // Bubble logic
  const getBubbleCount = () => {
    if (!Array.isArray(projects) || projects.length === 0) return 0;
    const visibleCards = Math.floor((window.innerWidth - 64) / (cardWidth + gap));
    return Math.max(1, projects.length - visibleCards + 1);
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
  }, [projects]);

  // Infinite auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !Array.isArray(projects) || projects.length === 0) return;

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
  }, [projects]);

  if (loading) {
    return (
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            <span className="text-white">Featured</span> <span className="text-purple-400">Projects</span>
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Showcasing innovative solutions built with modern technologies. Each project represents a unique challenge and creative approach to problem-solving.
          </p>
        </div>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-700 rounded w-14"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            <span className="text-white">Featured</span> <span className="text-purple-400">Projects</span>
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Showcasing innovative solutions built with modern technologies. Each project represents a unique challenge and creative approach to problem-solving.
          </p>
        </div>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8">
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
              <button 
                onClick={fetchProjects}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            <span className="text-white">Featured</span> <span className="text-purple-400">Projects</span>
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Showcasing innovative solutions built with modern technologies. Each project represents a unique challenge and creative approach to problem-solving.
          </p>
        </div>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
              </div>
              <p className="text-gray-300 font-medium">No projects available yet</p>
              <p className="text-gray-400 text-sm mt-2">Projects will appear here once they are added.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Sort projects by rating (highest first)
  const sortedProjects = [...projects].sort((a, b) => {
    const aAvg = getAverageRating(a._id || a.id);
    const bAvg = getAverageRating(b._id || b.id);
    return bAvg - aAvg;
  });

  return (
    <SectionWrapper id="projects" gradient="bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          <span className="text-white">Featured</span> <span className="text-purple-400">Projects</span>
        </h2>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
          Showcasing innovative solutions built with modern technologies. Each project represents a unique challenge and creative approach to problem-solving.
        </p>
      </div>

      {/* Project Carousel */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Project Cards Horizontal Scroll */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide" ref={scrollRef} style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <div className="flex gap-6 sm:gap-8 px-2 sm:px-4" style={{ WebkitOverflowScrolling: 'touch', minWidth: '100%' }}>
            {/* Duplicate cards for infinite scroll */}
            {Array.isArray(sortedProjects) && [...sortedProjects, ...sortedProjects].map((project, index) => (
              <div 
                key={`${project._id || project.id}-${index}`} 
                className="group relative bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:shadow-[0_8px_40px_0_rgba(147,51,234,0.3)] hover:-translate-y-2 transition-all duration-300 flex-shrink-0 w-[300px] md:w-[400px] min-w-[300px] md:min-w-[400px] max-w-[300px] md:max-w-[400px]"
              >
                <div className="flex flex-col h-full">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    {renderProjectImage(project)}
                    <div className="placeholder-img" style={{ display: !project.image || project.image.trim() === '' ? 'flex' : 'none' }}>
                    {placeholderImg}
                  </div>
                    {project.featured === 1 && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Featured
                  </span>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2">
                        {project.live && project.live !== '#' && (
                        <a 
                            href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                          title="View Live Demo"
                        >
                          <FaExternalLinkAlt />
                            <span>Live Demo</span>
                        </a>
                      )}
                        {project.github && project.github !== '#' && (
                        <a 
                            href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                          title="View Code on GitHub"
                        >
                          <FaGithub />
                            <span>Code</span>
                        </a>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech && Array.isArray(project.tech) ? project.tech.map((tech, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-700 text-gray-200 text-xs font-semibold px-3 py-1 rounded-md border border-gray-600"
                        >
                          {tech.trim()}
                        </span>
                      )) : (project.tech ? project.tech.split(',').filter(Boolean).map((tech, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-700 text-gray-200 text-xs font-semibold px-3 py-1 rounded-md border border-gray-600"
                        >
                          {tech.trim()}
                        </span>
                      )) : [])}
                    </div>

                    {/* Rating Section */}
                    <div className="mt-auto">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                            className={`cursor-pointer transition-colors duration-200 ${getAverageRating(project._id || project.id) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                            size={18}
                            onClick={() => handleRate(project._id || project.id, star)}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      />
                    ))}
                        <span className="ml-2 text-xs text-yellow-400 font-semibold">
                          {getAverageRating(project._id || project.id)} / 5
                          {getRatingCount(project._id || project.id) > 0 && (
                            <span className="ml-1 text-gray-400 font-normal">({getRatingCount(project._id || project.id)} rating{getRatingCount(project._id || project.id) > 1 ? 's' : ''})</span>
                      )}
                    </span>
                  </div>
                      
                      <div className="flex gap-2">
                  <button
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition text-sm font-semibold"
                          onClick={() => openFeedback(project._id || project.id)}
                  >
                    Give Feedback
                  </button>
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow hover:from-gray-700 hover:to-gray-800 transition text-sm font-semibold"
                          onClick={() => openProjectModal(project)}
                          title="View Project Details"
                        >
                          <FaInfoCircle />
                        </button>
                      </div>
                      
                      {showFeedback[project._id || project.id] && (
                        <div className="flex flex-col items-start gap-2 bg-gray-700 border border-gray-600 rounded-lg p-4 mt-2 shadow-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <FaStar
                            key={star}
                                className={`cursor-pointer transition-colors duration-200 ${pendingRating[project._id || project.id] >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                                size={18}
                                onClick={() => setPendingRating(prev => ({ ...prev, [project._id || project.id]: star }))}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                              className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded shadow hover:from-purple-600 hover:to-blue-600 text-xs font-semibold transition"
                              onClick={() => submitFeedback(project._id || project.id)}
                        >Submit</button>
                        <button
                              className="px-3 py-1 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 text-xs font-semibold"
                              onClick={() => closeFeedback(project._id || project.id)}
                        >Cancel</button>
                      </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bubble Indicators */}
        {getBubbleCount() > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: getBubbleCount() }).map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full ${activeBubble === idx ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-600'} transition-colors duration-200`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <p className="text-gray-300 text-lg mb-6">
          Interested in working together on your next project?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
        >
          <FaEye className="mr-2" />
          Get In Touch
        </a>
      </div>

      {/* Project Detail Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              <button
                onClick={closeProjectModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Project Image/Video */}
              <div className="mb-6">
                {selectedProject.demo_video ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-800">
                    <video
                      className="w-full h-64 md:h-80 object-cover"
                      controls
                      poster={selectedProject.image ? getImageUrl(selectedProject.image) : undefined}
                    >
                      <source src={getImageUrl(selectedProject.demo_video)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FaPlay size={12} />
                      Demo Video
                    </div>
                  </div>
                ) : selectedProject.image ? (
                  <img
                    src={getImageUrl(selectedProject.image)}
                    alt={selectedProject.title}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto mb-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                        <path d="M8 17l4-4 4 4M8 13l4-4 4 4" />
                      </svg>
                      <p className="text-sm">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <FaRocket className="text-purple-400" />
                      Project Overview
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {selectedProject.long_description && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Detailed Description</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedProject.long_description}
                      </p>
                    </div>
                  )}

                  {selectedProject.features && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                      <ul className="text-gray-300 space-y-1">
                        {Array.isArray(selectedProject.features) ? 
                          selectedProject.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          )) : 
                          selectedProject.features.split(',').map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{feature.trim()}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Tech Stack */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <FaCode className="text-purple-400" />
                      Technologies Used
                    </h3>
                  <div className="flex flex-wrap gap-2">
                      {selectedProject.tech && Array.isArray(selectedProject.tech) ? 
                        selectedProject.tech.map((tech, index) => (
                      <span 
                        key={index} 
                            className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md border border-gray-600"
                      >
                        {tech.trim()}
                      </span>
                        )) : 
                        selectedProject.tech.split(',').filter(Boolean).map((tech, index) => (
                      <span 
                        key={index} 
                            className="bg-gray-700 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md border border-gray-600"
                      >
                        {tech.trim()}
                      </span>
                        ))
                      }
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <FaUser className="text-purple-400" />
                      Project Details
                    </h3>
                    
                    {selectedProject.created_at && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaCalendarAlt className="text-purple-400" />
                        <span>Created: {formatDate(selectedProject.created_at)}</span>
                </div>
                    )}

                    {selectedProject.updated_at && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaCalendarAlt className="text-purple-400" />
                        <span>Updated: {formatDate(selectedProject.updated_at)}</span>
              </div>
                    )}

                    {selectedProject.category && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-purple-400">Category:</span>
                        <span>{selectedProject.category}</span>
            </div>
                    )}

                    {selectedProject.status && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-purple-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedProject.status === 'completed' ? 'bg-green-600 text-white' :
                          selectedProject.status === 'in-progress' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {selectedProject.status}
                        </span>
        </div>
                    )}
                  </div>

                  {/* Rating Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Project Rating</h3>
                    <div className="flex items-center gap-2 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                          className={`cursor-pointer transition-colors duration-200 ${getAverageRating(selectedProject._id || selectedProject.id) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                        size={20}
                          onClick={() => handleRate(selectedProject._id || selectedProject.id, star)}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      />
                    ))}
                      <span className="ml-2 text-sm text-yellow-400 font-semibold">
                        {getAverageRating(selectedProject._id || selectedProject.id)} / 5
                        {getRatingCount(selectedProject._id || selectedProject.id) > 0 && (
                          <span className="ml-1 text-gray-400 font-normal">({getRatingCount(selectedProject._id || selectedProject.id)} rating{getRatingCount(selectedProject._id || selectedProject.id) > 1 ? 's' : ''})</span>
                      )}
                    </span>
                  </div>
                  <button
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition text-sm font-semibold"
                      onClick={() => openFeedback(selectedProject._id || selectedProject.id)}
                  >
                    Give Feedback
                  </button>
                      </div>
                      </div>
                    </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700">
                {selectedProject.live && selectedProject.live !== '#' && (
                      <a 
                    href={selectedProject.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                      >
                        <FaExternalLinkAlt />
                    View Live Demo
                      </a>
                    )}
                {selectedProject.github && selectedProject.github !== '#' && (
                      <a 
                    href={selectedProject.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                      >
                        <FaGithub />
                    View Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
      )}
    </SectionWrapper>
  );
};

export default Projects; 