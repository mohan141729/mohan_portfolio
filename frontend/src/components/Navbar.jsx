import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaProjectDiagram, FaFileAlt, FaTachometerAlt, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Home', url: '#hero', icon: FaHome },
  { name: 'About', url: '#about', icon: FaUser },
  { name: 'Projects', url: '#projects', icon: FaProjectDiagram },
  { name: 'Resume', url: '#certifications', icon: FaFileAlt },
];

export default function Navbar({ onAdminLogin }) {
  const [activeTab, setActiveTab] = useState(navItems[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Debug authentication state
  useEffect(() => {
    console.log('Navbar - Authentication state:', { isAuthenticated });
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = [
        { id: 'hero', name: 'Home' },
        { id: 'about', name: 'About' },
        { id: 'projects', name: 'Projects' },
        { id: 'certifications', name: 'Resume' },
      ];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && scrollY + 80 >= section.offsetTop) {
          setActiveTab(sections[i].name);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, url, name) => {
    e.preventDefault();
    setActiveTab(name);
    const section = document.querySelector(url);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminDashboard = () => {
    console.log('Admin Dashboard button clicked');
    navigate('/admin');
  };

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'top-0 pt-6 left-1/2 -translate-x-1/2'} z-50 w-full flex justify-center pointer-events-none px-4`}>
      <div className={`flex items-center gap-1 ${isMobile ? 'gap-1' : 'gap-3'} bg-white/80 border border-gray-200 backdrop-blur-lg py-1 px-1 rounded-full shadow-2xl pointer-events-auto`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={(e) => handleClick(e, item.url, item.name)}
              className={`relative cursor-pointer text-sm font-semibold ${isMobile ? 'px-4 py-2' : 'px-6 py-2'} ${isTablet ? 'px-5 py-2' : ''} rounded-full transition-colors duration-200
                text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
                ${isActive ? 'text-blue-700 font-bold scale-105' : ''}`}
              style={{ 
                minWidth: isMobile ? 60 : isTablet ? 80 : 110, 
                borderRadius: '9999px', 
                letterSpacing: '0.01em' 
              }}
            >
              <span className={`${isMobile ? 'hidden' : isTablet ? 'hidden' : 'inline'}`}>{item.name}</span>
              <span className={`${isMobile ? 'flex' : isTablet ? 'flex' : 'hidden'} items-center justify-center`}>
                <Icon size={isMobile ? 18 : 20} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full h-full bg-blue-100/80 rounded-full -z-10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className={`absolute -top-2 left-1/2 -translate-x-1/2 ${isMobile ? 'w-6 h-1' : 'w-8 h-1'} bg-blue-300 rounded-t-full`}>
                    <div className={`absolute ${isMobile ? 'w-8 h-4' : 'w-12 h-6'} bg-blue-200/40 rounded-full blur-md -top-2 -left-2`} />
                    <div className={`absolute ${isMobile ? 'w-6 h-4' : 'w-8 h-6'} bg-blue-200/40 rounded-full blur-md -top-1`} />
                    <div className={`absolute ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-blue-200/40 rounded-full blur-sm top-0 left-2`} />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
        
        {/* Admin Login/Dashboard/Logout Buttons */}
        {!isAuthenticated ? (
          <button
            onClick={onAdminLogin}
            className={`ml-2 p-2 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 text-blue-700 hover:bg-blue-200 shadow-md transition relative group ${isMobile ? 'p-1.5' : ''}`}
            title="Admin Login"
          >
            <FaSignInAlt size={isMobile ? 18 : 22} />
            <span className={`absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap ${isMobile ? 'hidden' : ''}`}>Admin Login</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleAdminDashboard}
              className={`ml-2 p-2 rounded-full bg-gradient-to-tr from-green-100 to-blue-100 text-green-700 hover:bg-green-200 shadow-md transition relative group ${isMobile ? 'p-1.5' : ''}`}
              title="Admin Dashboard"
            >
              <FaTachometerAlt size={isMobile ? 18 : 22} />
              <span className={`absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap ${isMobile ? 'hidden' : ''}`}>Admin Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className={`ml-2 p-2 rounded-full bg-gradient-to-tr from-red-100 to-pink-100 text-red-600 hover:bg-red-200 shadow-md transition relative group ${isMobile ? 'p-1.5' : ''}`}
              title="Logout"
            >
              <FaSignOutAlt size={isMobile ? 18 : 22} />
              <span className={`absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap ${isMobile ? 'hidden' : ''}`}>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
} 