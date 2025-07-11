import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaSearch, FaFilter, FaArrowLeft, FaStar } from 'react-icons/fa';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import { Link } from 'react-router-dom';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Backend ratings: { [projectId]: { average, count } }
  const [backendRatings, setBackendRatings] = useState({});
  // User's rating for this session (not persisted)
  const [userRatings, setUserRatings] = useState({});
  const [showFeedback, setShowFeedback] = useState({}); // { [projectId]: true/false }
  const [pendingRating, setPendingRating] = useState({}); // { [projectId]: 0-5 }

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log('Fetched projects:', projects);
    filterProjects();
  }, [projects, searchTerm, selectedCategory]);

  useEffect(() => {
    if (filteredProjects.length > 0) {
      filteredProjects.forEach((project) => {
        fetchBackendRating(project._id || project.id);
      });
    }
    // eslint-disable-next-line
  }, [filteredProjects]);

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

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tech && project.tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category (tech stack)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => {
        if (!project.category) return false;
        return project.category.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    setFilteredProjects(filtered);
  };

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

  // 1. Get unique categories from the 'category' field
  const getUniqueCategories = () => {
    const categories = new Set();
    projects.forEach(project => {
      if (project.category && project.category.trim()) {
        categories.add(project.category.trim());
      }
    });
    return Array.from(categories).sort();
  };

  const placeholderImg = (
    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-gray-400 rounded-t-2xl border-b border-gray-200">
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
          className="w-full h-48 object-cover rounded-t-2xl"
          onError={(e) => {
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
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-4">All Projects</h1>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">Explore my complete portfolio of projects showcasing various technologies and skills.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Projects</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <button 
              onClick={fetchProjects}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = getUniqueCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-pink-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-4">All Projects</h1>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">Explore my complete portfolio of projects showcasing various technologies and skills.</p>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 p-4 rounded-xl shadow-md border border-indigo-100">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title, description, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.length === 0 && <option disabled>No categories available</option>}
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id || project.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="relative">
                  {renderProjectImage(project)}
                  <div className="placeholder-img" style={{ display: !project.image || project.image.trim() === '' ? 'flex' : 'none' }}>
                    {placeholderImg}
                  </div>
                  {project.featured === 1 && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight leading-tight">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.live && project.live !== '#' && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 flex items-center gap-1"
                          title="View Live"
                        >
                          <FaExternalLinkAlt />
                          Live
                        </a>
                      )}
                      {project.github && project.github !== '#' && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-gray-700 text-white font-semibold px-3 py-2 rounded-lg shadow hover:bg-gray-900 transition-all duration-200 flex items-center gap-1"
                          title="View Code"
                        >
                          <FaGithub />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1 text-base group-hover:text-gray-900 transition-colors duration-200">{project.description}</p>
                  {/* Star Rating UI */}
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech && Array.isArray(project.tech) ? project.tech.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-100"
                      >
                        {tech.trim()}
                      </span>
                    )) : (project.tech ? project.tech.split(',').filter(Boolean).map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-100"
                      >
                        {tech.trim()}
                      </span>
                    )) : [])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects; 