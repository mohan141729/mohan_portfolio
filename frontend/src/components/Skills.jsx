import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import SectionWrapper from './SectionWrapper';

const categoryColors = {
  Frontend: 'from-blue-100 to-cyan-100',
  Backend: 'from-green-100 to-emerald-100',
  Programming: 'from-purple-100 to-pink-100',
  Database: 'from-orange-100 to-red-100',
  Tools: 'from-gray-100 to-slate-100',
  Other: 'from-slate-100 to-gray-50',
};

const ringColors = {
  Frontend: '#38bdf8',
  Backend: '#22d3ee',
  Programming: '#a78bfa',
  Database: '#fbbf24',
  Tools: '#64748b',
  Other: '#a3a3a3',
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_SKILLS));
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load skills');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const skillsByCategory = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {}) : {};

  // Animated proficiency bar component
  const AdvancedBar = ({ percent = 0, color = '#38bdf8' }) => {
    // If percent is very low, show label outside the bar for readability
    const showInside = percent > 15;
    return (
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-visible shadow-sm">
        <motion.div
          className="absolute left-0 top-0 h-4 rounded-full"
          style={{ background: color, boxShadow: '0 2px 8px 0 rgba(56,189,248,0.08)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1 }}
        />
        <motion.span
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm transition-colors duration-300 select-none ${showInside ? 'text-white bg-black/60' : 'text-gray-700 bg-white/90 border border-gray-200'}`}
          style={{
            left: showInside ? `calc(${percent}% - 2.5rem)` : `calc(${percent}% + 0.5rem)`,
            minWidth: '2.2rem',
            zIndex: 2,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percent}%
        </motion.span>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="skills">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Technical Skills</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4 ">A comprehensive overview of my technical expertise and proficiency levels.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="skills">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Technical Skills</h2>
        <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4">A comprehensive overview of my technical expertise and proficiency levels.</p>
        <div className="w-full max-w-6xl flex flex-col gap-6 sm:gap-8 px-4 sm:px-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionWrapper id="skills" gradient="bg-gradient-to-b from-purple-100 via-blue-50 to-green-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight px-4">Technical Skills</h2>
      <p className="text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl px-4 mx-auto">A comprehensive overview of my technical expertise and proficiency levels.</p>
      <div className="w-full max-w-6xl flex flex-col gap-8 px-4 sm:px-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className={`rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 bg-gradient-to-br ${categoryColors[category] || 'from-slate-100 to-gray-50'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{category}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categorySkills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.id || `${category}-${skill.name}-${skillIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                  className="relative group bg-white/90 rounded-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center"
                >
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 text-center mb-3">{skill.name}</h4>
                  <AdvancedBar percent={skill.proficiency} color={ringColors[category] || '#38bdf8'} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {(!Array.isArray(skills) || skills.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No skills available</h3>
          <p className="text-gray-600">Skills will be displayed here once added.</p>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Skills; 