import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaCode, 
  FaCertificate, 
  FaEnvelope, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaInfoCircle,
  FaUserCog,
  FaFileAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: FaTachometerAlt,
      description: 'Overview and statistics',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Hero Section', 
      path: '/admin/hero', 
      icon: FaUser,
      description: 'Manage hero section content',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'About Section', 
      path: '/admin/about', 
      icon: FaInfoCircle,
      description: 'Manage about section content',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      name: 'Projects', 
      path: '/admin/projects', 
      icon: FaProjectDiagram,
      description: 'Manage portfolio projects',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Skills', 
      path: '/admin/skills', 
      icon: FaCode,
      description: 'Manage technical skills',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Certifications', 
      path: '/admin/certifications', 
      icon: FaCertificate,
      description: 'Manage certifications',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Resume', 
      path: '/admin/resume', 
      icon: FaFileAlt,
      description: 'Manage resume/CV',
      color: 'from-teal-500 to-teal-600'
    },
    { 
      name: 'Messages', 
      path: '/admin/contact', 
      icon: FaEnvelope,
      description: 'View contact messages',
      color: 'from-red-500 to-red-600'
    },
    { 
      name: 'Admin Settings', 
      path: '/admin/settings', 
      icon: FaUserCog,
      description: 'Change admin credentials',
      color: 'from-gray-500 to-gray-600'
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg z-40 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation"
                aria-label="Toggle navigation menu"
              >
                {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -320 } : false}
            animate={isMobile ? { x: 0 } : false}
            exit={isMobile ? { x: -320 } : false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 h-full ${isMobile ? 'w-80 z-50' : 'w-64'} bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl`}
          >
            <div className={`flex flex-col h-full ${isMobile ? 'pt-16' : ''}`}>
              {/* Desktop Header */}
              {!isMobile && (
                <div className="p-4 sm:p-6 border-b border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Admin Panel
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden touch-manipulation ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm sm:text-base block">{item.name}</span>
                          {isMobile && (
                            <span className="text-xs opacity-75 block mt-0.5">{item.description}</span>
                          )}
                        </div>
                        {isActive(item.path) && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white/20 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Logout Button */}
              <div className="p-4 sm:p-6 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group w-full touch-manipulation"
                >
                  <FaSignOutAlt size={18} />
                  <span className="font-medium text-sm sm:text-base">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'pt-16' : 'ml-64'} p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 