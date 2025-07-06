import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaPython, FaTools, FaJava } from 'react-icons/fa';
import { SiTailwindcss, SiBootstrap, SiJavascript, SiHtml5, SiCss3, SiGit } from 'react-icons/si';
import { buildApiUrl, ENDPOINTS } from '../config/api';

const skillCategories = [
  {
    name: 'Frontend',
    icon: <FaReact className="text-cyan-400 text-3xl" />,
    skills: [
      { name: 'HTML', icon: <SiHtml5 className="text-orange-500" /> },
      { name: 'CSS', icon: <SiCss3 className="text-blue-500" /> },
      { name: 'JavaScript', icon: <SiJavascript className="text-yellow-400" /> },
      { name: 'React', icon: <FaReact className="text-cyan-400" /> },
      { name: 'Bootstrap', icon: <SiBootstrap className="text-purple-600" /> },
      { name: 'Tailwind', icon: <SiTailwindcss className="text-sky-400" /> },
    ],
  },
  {
    name: 'Backend',
    icon: <FaNodeJs className="text-green-500 text-3xl" />,
    skills: [
      { name: 'Node.js', icon: <FaNodeJs className="text-green-500" /> },
      { name: 'Express', icon: <FaNodeJs className="text-green-700" /> },
      { name: 'Python', icon: <FaPython className="text-blue-400" /> },
    ],
  },
  {
    name: 'Database',
    icon: <FaDatabase className="text-indigo-400 text-3xl" />,
    skills: [
      { name: 'SQLite', icon: <FaDatabase className="text-indigo-400" /> },
    ],
  },
  {
    name: 'AI/ML Tools',
    icon: <FaPython className="text-yellow-400 text-3xl" />,
    skills: [
      { name: 'Gemini API', icon: <FaPython className="text-yellow-400" /> },
      { name: 'NumPy', icon: <FaPython className="text-blue-400" /> },
      { name: 'Python', icon: <FaPython className="text-blue-400" /> },
    ],
  },
  {
    name: 'Others',
    icon: <FaTools className="text-gray-500 text-3xl" />,
    skills: [
      { name: 'Git', icon: <SiGit className="text-orange-600" /> },
      { name: 'Java', icon: <FaJava className="text-red-500" /> },
      { name: 'C', icon: <span className="text-blue-700 font-bold text-lg">C</span> },
    ],
  },
];

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
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'frontend':
        return 'from-blue-500 to-cyan-500';
      case 'backend':
        return 'from-green-500 to-emerald-500';
      case 'programming':
        return 'from-purple-500 to-pink-500';
      case 'database':
        return 'from-orange-500 to-red-500';
      case 'tools':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'frontend':
        return '🎨';
      case 'backend':
        return '⚙️';
      case 'programming':
        return '💻';
      case 'database':
        return '🗄️';
      case 'tools':
        return '🛠️';
      default:
        return '🔧';
    }
  };

  if (loading) {
    return (
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="skills">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Technical Skills</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl">A comprehensive overview of my technical expertise and proficiency levels.</p>
        <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
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
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="skills">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Technical Skills</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl">A comprehensive overview of my technical expertise and proficiency levels.</p>
        <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Group skills by category
  const skillsByCategory = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {}) : {};

  return (
    <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="skills">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">Technical Skills</h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl">A comprehensive overview of my technical expertise and proficiency levels.</p>
      
      <div className="w-full max-w-6xl flex flex-col gap-8 px-4">
        {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySkills.map((skill, skillIndex) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{skill.name}</h4>
                    <span className="text-sm font-medium text-gray-600">{skill.proficiency}%</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: (categoryIndex * 0.1) + (skillIndex * 0.1) }}
                      />
                    </div>
                  </div>
                  
                  {skill.icon && (
                    <div className="text-xs text-gray-500">
                      Icon: {skill.icon}
                    </div>
                  )}
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
    </section>
  );
};

export default Skills; 