import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaEye } from 'react-icons/fa';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="projects">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="projects">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
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
      </section>
    );
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="projects">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Featured Projects</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
        <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
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
      </section>
    );
  }

  // Find featured project (featured = 1) or use the first project
  const featuredProject = projects.find(p => p.featured === 1) || projects[0];
  const otherProjects = projects.filter(p => p.id !== featuredProject.id).slice(0, 2);

  return (
    <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="projects">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Featured Projects</h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl">Here are some of my recent projects that showcase my skills in full-stack development and AI integration.</p>
      <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
        {/* Featured Project */}
        {featuredProject && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
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
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{featuredProject.title}</h3>
                  <div className="flex gap-3">
                    {featuredProject.live && featuredProject.live !== '#' && (
                      <a 
                        href={featuredProject.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                        title="View Live"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    {featuredProject.github && featuredProject.github !== '#' && (
                      <a 
                        href={featuredProject.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                        title="View Code"
                      >
                        <FaGithub />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{featuredProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {featuredProject.tech && Array.isArray(featuredProject.tech) ? featuredProject.tech.map((tech, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-200"
                    >
                      {tech.trim()}
                    </span>
                  )) : (featuredProject.tech ? featuredProject.tech.split(',').filter(Boolean).map((tech, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-200"
                    >
                      {tech.trim()}
                    </span>
                  )) : [])}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((project) => (
              <div key={project.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  {renderProjectImage(project)}
                  <div className="placeholder-img" style={{ display: !project.image || project.image.trim() === '' ? 'flex' : 'none' }}>
                    {placeholderImg}
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <div className="flex gap-3">
                      {project.live && project.live !== '#' && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          title="View Live"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                      {project.github && project.github !== '#' && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                          title="View Code"
                        >
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech && Array.isArray(project.tech) ? project.tech.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 text-xs font-semibold px-3 py-1 rounded-md border border-gray-200"
                      >
                        {tech.trim()}
                      </span>
                    )) : (project.tech ? project.tech.split(',').filter(Boolean).map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 text-xs font-semibold px-3 py-1 rounded-md border border-gray-200"
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
    </section>
  );
};

export default Projects; 