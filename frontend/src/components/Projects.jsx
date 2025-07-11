import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaEye, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import SectionWrapper from './SectionWrapper';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const placeholderImg = (
    <div className="w-full h-32 md:h-36 lg:h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-gray-400 rounded-t-2xl border-b border-gray-200">
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
          className="w-full h-32 md:h-36 lg:h-40 object-cover rounded-t-2xl"
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

  if (loading) {
    return (
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-14"></div>
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
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={fetchProjects}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
      <SectionWrapper id="projects" gradient="bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No projects available yet</p>
              <p className="text-gray-400 text-sm mt-2">Projects will appear here once they are added.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Find featured project (featured = 1) or use the first project
  const featuredProject = projects.find(p => p.featured === 1) || projects[0];
  const otherProjects = projects
    .filter(p => (p._id || p.id) !== (featuredProject._id || featuredProject.id))
    .slice(0, 2);
  const totalCards = 3;
  const placeholdersNeeded = totalCards - (1 + otherProjects.length);

  // Sort otherProjects by backend average rating (highest first, one decimal)
  const sortedOtherProjects = [...otherProjects].sort((a, b) => {
    const aAvg = getAverageRating(a._id || a.id);
    const bAvg = getAverageRating(b._id || b.id);
    return bAvg - aAvg;
  });

  return (
    <SectionWrapper id="projects" gradient="bg-gradient-to-b from-indigo-100 via-indigo-200 to-purple-100">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-900 mb-4 tracking-tight px-4 drop-shadow-lg">Featured Projects</h2>
      <p className="text-lg sm:text-xl font-medium text-center text-indigo-700 mb-10 sm:mb-14 max-w-2xl mx-auto px-4">
        Here are some of my recent projects that showcase my skills in full-stack development and AI integration.
      </p>
      <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
        {/* Featured Project */}
        <div className="mb-6">
          {featuredProject ? (
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl shadow-blue-100 border border-blue-100 overflow-hidden hover:shadow-[0_8px_40px_0_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col">
                <div className="relative">
                  {renderProjectImage(featuredProject)}
                  <div className="placeholder-img" style={{ display: !featuredProject.image || featuredProject.image.trim() === '' ? 'flex' : 'none' }}>
                    {placeholderImg}
                  </div>
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Featured
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight leading-tight">{featuredProject.title}</h3>
                    <div className="flex gap-3">
                      {featuredProject.live && featuredProject.live !== '#' && (
                        <a 
                          href={featuredProject.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                          title="View Live Demo"
                        >
                          <FaExternalLinkAlt />
                          <span className="hidden sm:inline">Live Demo</span>
                        </a>
                      )}
                      {featuredProject.github && featuredProject.github !== '#' && (
                        <a 
                          href={featuredProject.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                          title="View Code on GitHub"
                        >
                          <FaGithub />
                          <span className="hidden sm:inline">GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-2">{featuredProject.description}</p>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer transition-colors duration-200 ${getAverageRating(featuredProject._id || featuredProject.id) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        size={22}
                        onClick={() => handleRate(featuredProject._id || featuredProject.id, star)}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-yellow-600 font-semibold">
                      {getAverageRating(featuredProject._id || featuredProject.id)} / 5
                      {getRatingCount(featuredProject._id || featuredProject.id) > 0 && (
                        <span className="ml-1 text-gray-500 font-normal">({getRatingCount(featuredProject._id || featuredProject.id)} rating{getRatingCount(featuredProject._id || featuredProject.id) > 1 ? 's' : ''})</span>
                      )}
                    </span>
                  </div>
                  <button
                    className="mt-1 mb-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition text-sm font-semibold"
                    style={{ width: '200px' }}
                    onClick={() => openFeedback(featuredProject._id || featuredProject.id)}
                  >
                    Give Feedback
                  </button>
                  {showFeedback[featuredProject._id || featuredProject.id] && (
                    <div className="flex flex-col items-start gap-2 bg-white border border-blue-100 rounded-lg p-4 mt-2 shadow-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer transition-colors duration-200 ${pendingRating[featuredProject._id || featuredProject.id] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            size={22}
                            onClick={() => setPendingRating(prev => ({ ...prev, [featuredProject._id || featuredProject.id]: star }))}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded shadow hover:from-blue-600 hover:to-purple-600 text-xs font-semibold transition"
                          onClick={() => submitFeedback(featuredProject._id || featuredProject.id)}
                        >Submit</button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold"
                          onClick={() => closeFeedback(featuredProject._id || featuredProject.id)}
                        >Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tech && Array.isArray(featuredProject.tech) ? featuredProject.tech.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-200"
                      >
                        {tech.trim()}
                      </span>
                    )) : (featuredProject.tech ? featuredProject.tech.split(',').filter(Boolean).map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-200"
                      >
                        {tech.trim()}
                      </span>
                    )) : [])}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-2xl shadow-xl border border-gray-200 h-56 flex items-center justify-center text-gray-300 text-2xl font-bold">No Featured Project</div>
          )}
        </div>
        {/* Other Projects (2 cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {sortedOtherProjects.map((project, idx) => (
            <div key={project._id || project.id || idx} className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl shadow-blue-100 border border-blue-100 overflow-hidden hover:shadow-[0_8px_40px_0_rgba(59,130,246,0.10)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col">
                <div className="relative">
                  {renderProjectImage(project)}
                  <div className="placeholder-img" style={{ display: !project.image || project.image.trim() === '' ? 'flex' : 'none' }}>
                    {placeholderImg}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight leading-tight">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{project.description}</p>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer transition-colors duration-200 ${getAverageRating(project._id || project.id) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        size={20}
                        onClick={() => handleRate(project._id || project.id, star)}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-yellow-600 font-semibold">
                      {getAverageRating(project._id || project.id)} / 5
                      {getRatingCount(project._id || project.id) > 0 && (
                        <span className="ml-1 text-gray-500 font-normal">({getRatingCount(project._id || project.id)} rating{getRatingCount(project._id || project.id) > 1 ? 's' : ''})</span>
                      )}
                    </span>
                  </div>
                  <button
                    className="mt-1 mb-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition text-sm font-semibold"
                    style={{ width: '200px' }}
                    onClick={() => openFeedback(project._id || project.id)}
                  >
                    Give Feedback
                  </button>
                  {showFeedback[project._id || project.id] && (
                    <div className="flex flex-col items-start gap-2 bg-white border border-blue-100 rounded-lg p-4 mt-2 shadow-lg">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer transition-colors duration-200 ${pendingRating[project._id || project.id] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            size={20}
                            onClick={() => setPendingRating(prev => ({ ...prev, [project._id || project.id]: star }))}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded shadow hover:from-blue-600 hover:to-purple-600 text-xs font-semibold transition"
                          onClick={() => submitFeedback(project._id || project.id)}
                        >Submit</button>
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold"
                          onClick={() => closeFeedback(project._id || project.id)}
                        >Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-2">
                    {project.live && project.live !== '#' && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                        title="View Live Demo"
                      >
                        <FaExternalLinkAlt />
                        <span className="hidden sm:inline">Live Demo</span>
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
                        <span className="hidden sm:inline">GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Placeholder cards if less than 2 other projects */}
          {Array.from({ length: placeholdersNeeded }).map((_, idx) => (
            <div key={idx} className="bg-white/80 rounded-2xl shadow-xl border border-gray-200 h-56 flex items-center justify-center text-gray-300 text-2xl font-bold">No Project</div>
          ))}
        </div>
        {/* All Projects Button */}
        <div className="flex justify-center mt-10">
          <Link
            to="/all-projects"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            <FaEye className="mr-2" />
            All Projects
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Projects; 