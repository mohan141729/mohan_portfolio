import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import SectionWrapper from './SectionWrapper';
import { FaCode, FaServer, FaDatabase, FaTools, FaLayerGroup, FaBrain, FaNetworkWired, FaChartBar, FaGlobe, FaLaptopCode, FaCloud, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

const categoryIcons = {
  'Machine Learning': <FaBrain className="text-purple-400" />,
  'Deep Learning': <FaNetworkWired className="text-indigo-400" />,
  'Data Science': <FaChartBar className="text-blue-400" />,
  'Web Development': <FaGlobe className="text-cyan-400" />,
  'Programming': <FaLaptopCode className="text-emerald-400" />,
  'Tools & Platforms': <FaTools className="text-orange-400" />,
  'Frontend': <FaCode className="text-blue-300" />,
  'Backend': <FaServer className="text-green-400" />,
  'Database': <FaDatabase className="text-yellow-400" />,
  'Cloud': <FaCloud className="text-sky-400" />,
  'Mobile': <FaMobileAlt className="text-pink-400" />,
  'Security': <FaShieldAlt className="text-red-400" />,
  'Tools': <FaTools className="text-gray-400" />,
  'Other': <FaLayerGroup className="text-pink-400" />
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (loading) {
    return (
      <section className="py-20 w-screen min-h-[60vh] bg-gray-900 flex flex-col items-center justify-center" id="skills">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-96 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 w-screen min-h-[60vh] bg-gray-900 flex flex-col items-center justify-center" id="skills">
        <div className="text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-500/30 backdrop-blur-sm">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <SectionWrapper id="skills" className="bg-[#0f172a] py-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold tracking-wider uppercase">
              Technical Proficiency
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Expertise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive toolkit of modern technologies and frameworks I leverage to build scalable, high-performance intelligent solutions.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
            <TiltCard
              key={category}
              className="h-full"
            >
              <motion.div
                variants={itemVariants}
                className="h-full bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-colors duration-300 group shadow-lg hover:shadow-purple-500/10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 3D Floating Elements */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500"
                  style={{ transform: "translateZ(-20px)" }}
                />

                <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3.5 bg-gray-900/50 rounded-xl border border-gray-700/50 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300 shadow-inner">
                      <div className="text-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {categoryIcons[category] || <FaLayerGroup className="text-gray-400" />}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                      {category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill, idx) => (
                      <motion.div
                        key={skill._id || idx}
                        whileHover={{ scale: 1.1, z: 10 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group/tag"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover/tag:opacity-50 transition-opacity duration-300" />
                        <span className="relative block px-3 py-1.5 bg-gray-900/80 text-gray-300 text-sm font-medium rounded-lg border border-gray-700 group-hover/tag:border-transparent group-hover/tag:text-white transition-all duration-300 cursor-default">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {(!Array.isArray(skills) || skills.length === 0) && (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-gray-800/50 mb-4">
              <FaLayerGroup className="text-4xl text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">No skills found.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Skills;
