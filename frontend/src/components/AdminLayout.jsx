import React from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FaFileAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl z-50">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h2>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
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

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group w-full"
            >
              <FaSignOutAlt size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 