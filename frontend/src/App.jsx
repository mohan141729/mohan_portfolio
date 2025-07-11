import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Admin from './pages/Admin';
import HeroManagement from './pages/HeroManagement';
import AboutManagement from './pages/AboutManagement';
import ProjectManagement from './pages/ProjectManagement';
import SkillManagement from './pages/SkillManagement';
import CertificationManagement from './pages/CertificationManagement';
import ContactManagement from './pages/ContactManagement';
import AdminSettings from './pages/AdminSettings';
import ResumeManagement from './pages/ResumeManagement';
import AllProjects from './pages/AllProjects';
import LoginModal from './components/LoginModal';
import AIAssistant from './components/AIAssistant';

function Portfolio() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLogin = () => setShowLoginModal(false);
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar onAdminLogin={() => setShowLoginModal(true)} />
      <main className="pt-20 flex-1">
        <AIAssistant />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  );
}

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/all-projects" element={<AllProjects />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Admin />} />
            <Route path="hero" element={<HeroManagement />} />
            <Route path="about" element={<AboutManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="skills" element={<SkillManagement />} />
            <Route path="certifications" element={<CertificationManagement />} />
            <Route path="resume" element={<ResumeManagement />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="contact" element={<ContactManagement />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
