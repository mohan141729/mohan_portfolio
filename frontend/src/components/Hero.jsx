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
    className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
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
    <div className="relative z-20 flex flex-col md:flex-row items-center w-full h-full max-w-7xl mx-auto px-6 gap-12">
      {/* Left: Text */}
      <div className="flex-1 flex flex-col justify-center items-start text-left mt-24 md:mt-0">
        <div className="inline-block bg-white/10 text-xs text-blue-300 px-4 py-1 rounded-full mb-4 shadow-lg backdrop-blur">{content.welcome_text}</div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-2 text-white leading-tight drop-shadow">{content.subtitle} <span className="text-blue-400">{content.name}</span></h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-200">{content.title}</h2>
        <p className="max-w-lg text-white/80 mb-8 text-lg">{content.description}</p>
        <div className="flex flex-wrap gap-4 mb-8">
          <a href="#projects" className="px-7 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 text-white font-bold transition">View Projects</a>
          <button
            onClick={handleDownloadResume}
            disabled={!resume}
            className={`px-7 py-2 rounded-lg font-bold transition border-0 outline-none focus:ring-2 focus:ring-blue-300
              ${resume
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:from-emerald-600 hover:to-blue-600 hover:scale-105'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed'}
            `}
          >
            {resume ? 'Download Resume' : 'Resume Unavailable'}
          </button>
        </div>
        <div className="flex gap-6 text-2xl">
          <a href={content.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><i className="fab fa-github"></i> GitHub</a>
          <a href={content.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><i className="fab fa-linkedin"></i> LinkedIn</a>
        </div>
      </div>
      {/* Right: Profile Photo in Modern Glass Card */}
      <div className="flex-1 flex justify-center md:justify-end items-center mt-12 md:mt-0">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/20 animate-float">
          {/* Floating Tech Icons */}
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
          <div className="relative mb-4">
            <span className="absolute -inset-2 md:-inset-4 lg:-inset-6 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-lg opacity-60"></span>
            <img
              src={getImageUrl(content.profile_image)}
              alt={content.name}
              className="w-40 h-40 md:w-60 md:h-60 lg:w-72 lg:h-72 object-cover rounded-full border-4 md:border-8 border-white shadow-xl relative z-10"
            />
          </div>
          <div className="text-center mt-2">
            <div className="text-xl font-bold text-white drop-shadow">{content.name}</div>
            <div className="text-blue-200 text-sm font-medium">Full-Stack Developer</div>
          </div>
        </div>
      </div>
    </div>
    {/* Scroll Down Indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <span className="text-white/70 text-xs mb-1">Scroll Down</span>
      <div className="w-6 h-6 border-2 border-white/60 rounded-full flex items-center justify-center animate-bounce">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/80"><path d="M19 9l-7 7-7-7" /></svg>
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