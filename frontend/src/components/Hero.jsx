import React, { useState, useEffect } from 'react';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageUtils';

// SVG icons for tech
const icons = [
  {
    name: 'React',
    color: 'text-cyan-400',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" stroke="#06b6d4" strokeWidth="2" fill="white" />
        <g>
          <circle cx="20" cy="20" r="3" fill="#06b6d4" />
          <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#06b6d4" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#06b6d4" strokeWidth="2" transform="rotate(60 20 20)" />
          <ellipse cx="20" cy="20" rx="13" ry="5" stroke="#06b6d4" strokeWidth="2" transform="rotate(120 20 20)" />
        </g>
      </svg>
    ),
    style: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  {
    name: 'Node.js',
    color: 'text-green-500',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" stroke="#22c55e" strokeWidth="2" fill="white" />
        <text x="50%" y="55%" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold" dy=".3em">N</text>
      </svg>
    ),
    style: 'top-8 right-0 -translate-y-1/2',
  },
  {
    name: 'Python',
    color: 'text-yellow-400',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" stroke="#facc15" strokeWidth="2" fill="white" />
        <text x="50%" y="55%" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="bold" dy=".3em">Py</text>
      </svg>
    ),
    style: 'bottom-8 right-2',
  },
  {
    name: 'Tailwind',
    color: 'text-sky-400',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" stroke="#0ea5e9" strokeWidth="2" fill="white" />
        <text x="50%" y="55%" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold" dy=".3em">Tw</text>
      </svg>
    ),
    style: 'bottom-2 left-8',
  },
  {
    name: 'JavaScript',
    color: 'text-yellow-400',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" stroke="#facc15" strokeWidth="2" fill="white" />
        <text x="50%" y="55%" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="bold" dy=".3em">JS</text>
      </svg>
    ),
    style: 'top-8 left-0 -translate-y-1/2',
  },
];

const Hero = () => {
  const [resume, setResume] = useState(null);
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
    fetchHeroContent();
  }, []);

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

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_HERO));
      if (response.ok) {
        const data = await response.json();
        setHeroContent(data);
      }
    } catch (err) {
      console.error('Error fetching hero content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = () => {
    if (resume) {
      // Open resume in new tab
      window.open(`${buildApiUrl('')}${resume.file_path}`, '_blank');
    }
  };

  if (loading) {
    return (
      <section className="relative w-screen h-screen flex items-center justify-center overflow-hidden" id="hero">
        <div className="text-white text-2xl">Loading...</div>
      </section>
    );
  }

  // Fallback values if API fails
  const defaultHero = {
    name: 'Mohan D',
    title: 'Full-Stack Developer | AI/ML Enthusiast',
    subtitle: 'Hi, I\'m Mohan D',
    description: 'Passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
    profile_image: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751693333/drilldown_iq6iin.jpg',
    background_image: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1751692323/hero-bg-CjdCbMYo_htrzjv.jpg',
    github_url: 'https://github.com/mohan-d',
    linkedin_url: 'https://linkedin.com/in/mohan-d',
    welcome_text: 'Welcome to my digital workspace'
  };

  const content = heroContent || defaultHero;

  return (
    <section
      className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Background Image */}
      <img
        src={getImageUrl(content.background_image)}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.7)' }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/70 to-purple-900/80 z-10" />
      
      {/* Main Content Container */}
      <div className="relative z-20 flex flex-col items-center w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Profile Image Section - Moved to top for mobile */}
        <div className="flex justify-center items-center mb-6 sm:mb-8 lg:mb-0 lg:hidden">
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col items-center border border-white/20 animate-float">
            {/* Floating Tech Icons - Hidden on mobile for better performance */}
            <div className="hidden md:block">
              {icons.map((icon, i) => (
                <span
                  key={icon.name}
                  className={`absolute ${icon.style} animate-pulse-slow`}
                  style={{ zIndex: 20, animationDelay: `${i * 0.5}s` }}
                  title={icon.name}
                >
                  {icon.svg}
                </span>
              ))}
            </div>
            <div className="relative mb-4">
              <span className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-lg opacity-60"></span>
              <img
                src={getImageUrl(content.profile_image)}
                alt={content.name}
                className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-full border-4 sm:border-6 border-white shadow-xl relative z-10"
              />
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white drop-shadow">{content.name}</div>
              <div className="text-blue-200 text-sm sm:text-base font-medium">Full-Stack Developer</div>
            </div>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center lg:text-left lg:items-start max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 text-sm sm:text-base text-blue-300 px-4 sm:px-5 py-2 rounded-full mb-4 sm:mb-6 shadow-lg backdrop-blur">
            {content.welcome_text}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 sm:mb-4 text-white leading-tight drop-shadow">
            {content.subtitle} <span className="text-blue-400">{content.name}</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-blue-200">
            {content.title}
          </h2>
          
          <p className="max-w-2xl text-white/90 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl leading-relaxed">
            {content.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 w-full sm:w-auto">
            <a 
              href="#projects" 
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 text-white font-bold transition-all duration-300 text-center text-base sm:text-lg hover:scale-105"
            >
              View Projects
            </a>
            <button
              onClick={handleDownloadResume}
              disabled={!resume}
              className={`px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-blue-300 text-base sm:text-lg
                ${resume
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:from-emerald-600 hover:to-blue-600 hover:scale-105'
                  : 'bg-gray-300 text-gray-400 cursor-not-allowed'}
              `}
            >
              {resume ? 'Download Resume' : 'Resume Unavailable'}
            </button>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-6 sm:gap-8 text-xl sm:text-2xl lg:text-3xl">
            <a 
              href={content.github_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-400 transition-all duration-300 flex items-center gap-2 hover:scale-110"
            >
              <i className="fab fa-github"></i> 
              <span className="hidden sm:inline text-base sm:text-lg">GitHub</span>
            </a>
            <a 
              href={content.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-400 transition-all duration-300 flex items-center gap-2 hover:scale-110"
            >
              <i className="fab fa-linkedin"></i> 
              <span className="hidden sm:inline text-base sm:text-lg">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Desktop Profile Image - Only shown on large screens */}
        <div className="hidden lg:flex flex-1 justify-end items-center">
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 lg:p-8 flex flex-col items-center border border-white/20 animate-float">
            {/* Floating Tech Icons */}
            <div>
              {icons.map((icon, i) => (
                <span
                  key={icon.name}
                  className={`absolute ${icon.style} animate-pulse-slow`}
                  style={{ zIndex: 20, animationDelay: `${i * 0.5}s` }}
                  title={icon.name}
                >
                  {icon.svg}
                </span>
              ))}
            </div>
            <div className="relative mb-4">
              <span className="absolute -inset-6 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-lg opacity-60"></span>
              <img
                src={getImageUrl(content.profile_image)}
                alt={content.name}
                className="w-72 h-72 object-cover rounded-full border-8 border-white shadow-xl relative z-10"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white drop-shadow">{content.name}</div>
              <div className="text-blue-200 text-base font-medium">Full-Stack Developer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <span className="text-white/70 text-sm mb-2">Scroll Down</span>
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/60 rounded-full flex items-center justify-center animate-bounce">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/80">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
};

export default Hero; 