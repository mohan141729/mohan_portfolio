import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaEye, FaStar, FaChevronLeft, FaChevronRight, FaInfoCircle, FaPlay, FaTimes, FaCalendarAlt, FaUser, FaCode, FaRocket, FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3, FaBootstrap, FaGitAlt, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiTailwindcss, SiTypescript, SiNextdotjs, SiVite, SiPostman, SiFigma, SiDocker, SiMysql, SiPostgresql, SiSqlite } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import SectionWrapper from './SectionWrapper';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const videoRef = useRef(null); // Ref for the video section
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
  const [feedbackForm, setFeedbackForm] = useState({ name: '', comment: '' });

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
    } catch { }
  };

  const handleRate = (projectId, rating) => {
    setUserRatings(prev => ({ ...prev, [projectId]: rating }));
  };

  const openFeedback = (projectId) => {
    setShowFeedback(prev => ({ ...prev, [projectId]: true }));
    setPendingRating(prev => ({ ...prev, [projectId]: userRatings[projectId] || 0 }));
    setFeedbackForm({ name: '', comment: '' });
  };

  const closeFeedback = (projectId) => {
    setShowFeedback(prev => ({ ...prev, [projectId]: false }));
  };

  const submitFeedback = async (projectId, name, comment) => {
    if (pendingRating[projectId]) {
      try {
        // POST to backend
        const response = await fetch(buildApiUrl(`/api/projects/${projectId}/ratings`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: pendingRating[projectId],
            comment: comment,
            user: name
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit rating');
        }

        setUserRatings(prev => ({ ...prev, [projectId]: pendingRating[projectId] }));
        setShowFeedback(prev => ({ ...prev, [projectId]: false }));
        await fetchBackendRating(projectId);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit review. Please try again.');
      }
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

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to get icon for tech
  const getTechIcon = (techName) => {
    const name = techName.toLowerCase().trim();
    if (name.includes('react')) return <FaReact className="text-[#61DAFB]" />;
    if (name.includes('node')) return <FaNodeJs className="text-[#339933]" />;
    if (name.includes('mongo')) return <SiMongodb className="text-[#47A248]" />;
    if (name.includes('express')) return <SiExpress className="text-white" />;
    if (name.includes('python')) return <FaPython className="text-[#3776AB]" />;
    if (name.includes('java') && !name.includes('script')) return <FaCode className="text-[#007396]" />;
    if (name.includes('js') || name.includes('javascript')) return <SiJavascript className="text-[#F7DF1E]" />;
    if (name.includes('ts') || name.includes('typescript')) return <SiTypescript className="text-[#3178C6]" />;
    if (name.includes('html')) return <FaHtml5 className="text-[#E34F26]" />;
    if (name.includes('css')) return <FaCss3 className="text-[#1572B6]" />;
    if (name.includes('tailwind')) return <SiTailwindcss className="text-[#06B6D4]" />;
    if (name.includes('bootstrap')) return <FaBootstrap className="text-[#7952B3]" />;
    if (name.includes('next')) return <SiNextdotjs className="text-white" />;
    if (name.includes('vite')) return <SiVite className="text-[#646CFF]" />;
    if (name.includes('git')) return <FaGitAlt className="text-[#F05032]" />;
    if (name.includes('sql') && !name.includes('my') && !name.includes('lite')) return <FaDatabase className="text-gray-400" />;
    if (name.includes('mysql')) return <SiMysql className="text-[#4479A1]" />;
    if (name.includes('sqlite')) return <SiSqlite className="text-[#003B57]" />;
    if (name.includes('postgres')) return <SiPostgresql className="text-[#336791]" />;
    if (name.includes('docker')) return <SiDocker className="text-[#2496ED]" />;
    if (name.includes('figma')) return <SiFigma className="text-[#F24E1E]" />;
    if (name.includes('postman')) return <SiPostman className="text-[#FF6C37]" />;

    return <FaCode className="text-gray-400" />; // Default
  };

  // High-quality fallback images from Unsplash
  const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1920&auto=format&fit=crop", // Coding laptop
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop", // Code screen
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop", // Cyberpunk city
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop", // Team working
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1920&auto=format&fit=crop", // Server room
  ];

  const getFallbackImage = (projectId) => {
    // Deterministic fallback based on ID
    if (!projectId) return FALLBACK_IMAGES[0];
    const charCode = projectId.charCodeAt(projectId.length - 1);
    return FALLBACK_IMAGES[charCode % FALLBACK_IMAGES.length];
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


  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderDemoMedia = (project) => {
    const rawUrl = (project.demo_video || '').trim();
    if (!rawUrl) return null;

    // Check if it's a YouTube URL
    const youtubeVideoId = getYouTubeVideoId(rawUrl);

    if (youtubeVideoId) {
      // Use YouTube iframe embed for YouTube videos
      return (
        <div className="relative rounded-xl overflow-hidden bg-gray-800">
          <div className="w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&playsinline=1`}
              title="Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <FaPlay size={12} />
            Demo Video
          </div>
          <div className="p-3 text-right">
            <a href={rawUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-blue-200 underline">Open video in new tab</a>
          </div>
        </div>
      );
    } else {
      // Use ReactPlayer for non-YouTube videos
      const abs = /^https?:\/\//i.test(rawUrl);
      const src = abs ? rawUrl : (rawUrl.startsWith('/') ? `${buildApiUrl('')}${rawUrl}` : `${buildApiUrl('')}/uploads/${rawUrl}`);
      return (
        <div className="relative rounded-xl overflow-hidden bg-gray-800">
          <div className="w-full h-64 md:h-80">
            <ReactPlayer
              url={src}
              width="100%"
              height="100%"
              controls
              playsinline
              onError={(e) => console.error('Demo video failed to load:', src, e)}
              config={{
                file: { attributes: { controlsList: 'nodownload', poster: project.image ? getImageUrl(project.image) : undefined } }
              }}
            />
          </div>
          <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <FaPlay size={12} />
            Demo Video
          </div>
          <div className="p-3 text-right">
            <a href={src} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-blue-200 underline">Open video in new tab</a>
          </div>
        </div>
      );
    }
  };

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
                        {[1, 2, 3, 4, 5].map(star => (
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
                            {[1, 2, 3, 4, 5].map(star => (
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f172a] w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-7xl sm:rounded-xl shadow-2xl overflow-y-auto relative scrollbar-hide">

            {/* Close Button (Absolute Top Right) */}
            <button
              onClick={closeProjectModal}
              className="absolute top-4 right-4 z-[110] p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all duration-200 group"
            >
              <FaTimes size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Hero Section */}
            <div className="relative w-full h-[50vh] md:h-[65vh]">
              {/* Background Image/Video */}
              <div className="absolute inset-0 w-full h-full">
                {selectedProject.image ? (
                  <img
                    src={getImageUrl(selectedProject.image)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getFallbackImage(selectedProject._id || selectedProject.id);
                    }}
                  />
                ) : (
                  <img
                    src={getFallbackImage(selectedProject._id || selectedProject.id)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/40 to-transparent"></div>
              </div>

              {/* Hero Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col justify-end h-full pointer-events-none">
                <div className="max-w-4xl pointer-events-auto space-y-4 animate-fade-in-up">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                    {selectedProject.category && (
                      <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-md text-white rounded-md uppercase tracking-wider text-xs shadow-lg">
                        {selectedProject.category}
                      </span>
                    )}
                    {selectedProject.status && (
                      <span className={`px-3 py-1 backdrop-blur-md text-white rounded-md uppercase tracking-wider text-xs shadow-lg ${selectedProject.status === 'completed' ? 'bg-green-600/90' : 'bg-yellow-600/90'
                        }`}>
                        {selectedProject.status}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-yellow-400 bg-black/40 px-3 py-1 rounded-md backdrop-blur-md">
                      <FaStar />
                      <span className="font-bold">{getAverageRating(selectedProject._id || selectedProject.id)}</span>
                      <span className="text-gray-300 text-xs ml-1">({getRatingCount(selectedProject._id || selectedProject.id)} reviews)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                    {selectedProject.title}
                  </h1>

                  {/* Short Description */}
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-3 drop-shadow-md leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    {selectedProject.demo_video && (
                      <button
                        onClick={scrollToVideo}
                        className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.5)] transform hover:scale-105"
                      >
                        <FaPlay size={18} />
                        <span>Watch Trailer</span>
                      </button>
                    )}
                    {selectedProject.live && selectedProject.live !== '#' && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:scale-105"
                      >
                        <FaExternalLinkAlt size={18} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {selectedProject.github && selectedProject.github !== '#' && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-gray-600/80 hover:bg-gray-500/80 text-white font-bold rounded-lg backdrop-blur-md transition-all duration-200 shadow-lg transform hover:scale-105"
                      >
                        <FaGithub size={20} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Main Details (2/3) */}
              <div className="lg:col-span-2 space-y-10">

                {/* Demo Video (if available) */}
                {selectedProject.demo_video && (
                  <div className="space-y-4" ref={videoRef}>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaPlay className="text-purple-500" /> Demo Preview
                    </h3>
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                      {renderDemoMedia(selectedProject)}
                    </div>
                  </div>
                )}

                {/* Detailed Description */}
                {selectedProject.long_description && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Storyline</h3>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {selectedProject.long_description}
                    </p>
                  </div>
                )}

                {/* Key Features */}
                {selectedProject.features && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(selectedProject.features) ?
                        selectedProject.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                            <div className="mt-1 min-w-[20px]">
                              <FaRocket className="text-purple-500" />
                            </div>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        )) :
                        selectedProject.features.split(',').map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                            <div className="mt-1 min-w-[20px]">
                              <FaRocket className="text-purple-500" />
                            </div>
                            <span className="text-gray-300">{feature.trim()}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar (1/3) */}
              <div className="space-y-8">

                {/* Tech Stack */}
                <motion.div
                  className="bg-gray-800/20 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <FaCode className="text-purple-500" />
                    </motion.div>
                    Technologies
                  </h3>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                  >
                    {selectedProject.tech && Array.isArray(selectedProject.tech) ?
                      selectedProject.tech.map((tech, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-200 text-sm font-medium rounded-md border border-gray-600/50 hover:bg-gray-700 hover:border-purple-500/50 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                          variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                          }}
                          whileHover={{
                            scale: 1.15,
                            rotate: [0, -2, 2, 0],
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="group-hover:scale-110 transition-transform duration-300"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            {getTechIcon(tech)}
                          </motion.div>
                          <span>{tech.trim()}</span>
                        </motion.div>
                      )) :
                      selectedProject.tech.split(',').filter(Boolean).map((tech, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 text-gray-200 text-sm font-medium rounded-md border border-gray-600/50 hover:bg-gray-700 hover:border-purple-500/50 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                          variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                          }}
                          whileHover={{
                            scale: 1.15,
                            rotate: [0, -2, 2, 0],
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="group-hover:scale-110 transition-transform duration-300"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            {getTechIcon(tech)}
                          </motion.div>
                          <span>{tech.trim()}</span>
                        </motion.div>
                      ))
                    }
                  </motion.div>
                </motion.div>

                {/* Metadata */}
                <motion.div
                  className="bg-gray-800/20 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm space-y-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">Details</h3>

                  {selectedProject.created_at && (
                    <motion.div
                      className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-gray-400 flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <FaCalendarAlt className="text-purple-400" />
                        </motion.div>
                        Released
                      </span>
                      <span className="text-white font-medium">{formatDate(selectedProject.created_at)}</span>
                    </motion.div>
                  )}

                  {selectedProject.updated_at && (
                    <motion.div
                      className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-gray-400 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <FaRocket className="text-blue-400" />
                        </motion.div>
                        Last Updated
                      </span>
                      <span className="text-white font-medium">{formatDate(selectedProject.updated_at)}</span>
                    </motion.div>
                  )}

                  <motion.div
                    className="pt-4 border-t border-gray-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="text-gray-400">License</span>
                      <motion.span
                        className="text-white font-medium px-2 py-1 bg-green-600/20 border border-green-500/30 rounded"
                        whileHover={{ scale: 1.1 }}
                      >
                        MIT
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Ratings & Feedback */}
                <motion.div
                  className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.h3
                    className="text-xl font-bold text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Rate this Project
                  </motion.h3>

                  <motion.div
                    className="flex justify-center gap-2 mb-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <motion.div
                        key={star}
                        variants={{
                          hidden: { opacity: 0, scale: 0, rotate: -180 },
                          visible: { opacity: 1, scale: 1, rotate: 0 }
                        }}
                        whileHover={{
                          scale: 1.4,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{
                          scale: 0.9,
                          rotate: [0, -15, 15, -15, 15, 0],
                          transition: { duration: 0.5 }
                        }}
                        animate={{
                          y: [0, -5, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <FaStar
                          className={`cursor-pointer transition-all duration-200 ${getAverageRating(selectedProject._id || selectedProject.id) >= star
                            ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                            : 'text-gray-600 hover:text-yellow-300'
                            }`}
                          style={{
                            filter: getAverageRating(selectedProject._id || selectedProject.id) >= star
                              ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))'
                              : 'none'
                          }}
                          size={28}
                          onClick={() => handleRate(selectedProject._id || selectedProject.id, star)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.span
                      className="text-3xl font-bold text-white"
                      key={getAverageRating(selectedProject._id || selectedProject.id)}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {getAverageRating(selectedProject._id || selectedProject.id)}
                    </motion.span>
                    <span className="text-gray-400 text-sm"> / 5</span>
                    {getRatingCount(selectedProject._id || selectedProject.id) > 0 && (
                      <motion.div
                        className="text-xs text-gray-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <motion.span
                          key={getRatingCount(selectedProject._id || selectedProject.id)}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                        >
                          {getRatingCount(selectedProject._id || selectedProject.id)}
                        </motion.span> ratings
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.button
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-lg relative overflow-hidden"
                    onClick={() => openFeedback(selectedProject._id || selectedProject.id)}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0"
                      whileHover={{ opacity: 0.3 }}
                    />
                    <span className="relative z-10">Write a Review</span>
                  </motion.button>

                  {/* Reviews List */}
                  {backendRatings[selectedProject._id || selectedProject.id]?.reviews?.length > 0 && (
                    <motion.div
                      className="mt-6 pt-6 border-t border-gray-700/50 space-y-4 max-h-60 overflow-y-auto custom-scrollbar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <h4 className="text-white font-semibold text-sm">Recent Reviews</h4>
                      {backendRatings[selectedProject._id || selectedProject.id].reviews.map((review, idx) => (
                        <div key={idx} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-purple-400 text-xs font-bold">{review.user || 'Anonymous'}</span>
                            <div className="flex text-yellow-500 text-[10px]">
                              {[...Array(Math.max(0, Math.floor(Number(review.rating) || 0)))].map((_, i) => <FaStar key={i} />)}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-300 text-xs italic break-words whitespace-pre-wrap">"{review.comment}"</p>
                          )}
                          <span className="text-gray-500 text-[10px] block mt-1">{formatDate(review.createdAt)}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

              </div>
            </div>

            {/* Bottom Close Button for Mobile */}
            <div className="p-6 md:hidden flex justify-center pb-12">
              <button
                onClick={closeProjectModal}
                className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-full shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {Object.keys(showFeedback).some(key => showFeedback[key]) && selectedProject && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedback({})}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFeedback({})}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-2">Rate & Review</h3>
              <p className="text-gray-400 mb-6">Share your thoughts on <span className="text-purple-400">{selectedProject.title}</span></p>

              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer transition-all duration-200 hover:scale-125 ${(pendingRating[selectedProject._id || selectedProject.id] || 0) >= star
                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                        : 'text-gray-700 hover:text-yellow-300'
                        }`}
                      size={32}
                      onClick={() => setPendingRating(prev => ({
                        ...prev,
                        [selectedProject._id || selectedProject.id]: star
                      }))}
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Name (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="John Doe"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feedback</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                    placeholder="What did you like? What can be improved?"
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                  ></textarea>
                </div>

                <button
                  className={`w-full py-3 font-bold rounded-lg transition-all shadow-lg transform ${pendingRating[selectedProject._id || selectedProject.id]
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white hover:scale-[1.02]'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  disabled={!pendingRating[selectedProject._id || selectedProject.id]}
                  onClick={() => {
                    if (pendingRating[selectedProject._id || selectedProject.id]) {
                      submitFeedback(selectedProject._id || selectedProject.id, feedbackForm.name, feedbackForm.comment);
                    }
                  }}
                >
                  {pendingRating[selectedProject._id || selectedProject.id] ? 'Submit Review' : 'Select a Rating'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default Projects;