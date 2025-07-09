import React, { useState, useEffect } from 'react';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { FaRocket, FaGraduationCap, FaLightbulb } from 'react-icons/fa';

const STRENGTH_COLORS = [
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-yellow-400 to-yellow-600',
  'from-indigo-400 to-indigo-600',
];
const STRENGTH_LEVELS = [90, 85, 80, 75, 70, 65];

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_ABOUT));
      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="about">
        <div className="text-gray-900 text-2xl">Loading...</div>
      </section>
    );
  }

  // Fallback values if API fails
  const defaultAbout = {
    journey_title: 'My Journey',
    journey_points: [
      { point: 'Passion for Technology: My journey began with curiosity about how websites work, evolving into a deep appreciation for seamless user experiences and innovative solutions.' },
      { point: 'Continuous Learning: Currently pursuing NxtWave\'s full-stack certification, expanding expertise in React, Node.js, and exploring AI/ML integration.' },
      { point: 'Future Goals: Seeking opportunities to contribute to innovative projects that make real impact, building intuitive interfaces and robust backend systems.' }
    ],
    education_title: 'Education Timeline',
    education_items: [
      { institution: 'ZP High School', details: '(10 CGPA)' },
      { institution: 'Viswa Bharathi Jr. College', details: '(95%)' },
      { institution: 'Sree Dattha', details: '(8.4 CGPA)' },
      { institution: 'NxtWave Full-Stack Certification', details: '(Ongoing)' }
    ],
    strengths_title: 'Core Strengths',
    strengths_list: ['Problem Solving', 'Collaboration', 'Adaptability', 'Creativity']
  };

  const content = aboutContent || defaultAbout;
  // Update strengths mapping to use object structure
  const strengths = Array.isArray(content.strengths_list) && content.strengths_list.length > 0 && typeof content.strengths_list[0] === 'object'
    ? content.strengths_list.map((strength, i) => ({
        name: strength.name,
        level: strength.level ?? STRENGTH_LEVELS[i % STRENGTH_LEVELS.length],
        color: STRENGTH_COLORS[i % STRENGTH_COLORS.length],
      }))
    : content.strengths_list.map((strength, i) => ({
        name: strength,
        level: STRENGTH_LEVELS[i % STRENGTH_LEVELS.length],
        color: STRENGTH_COLORS[i % STRENGTH_COLORS.length],
      }));

  return (
    <section className="py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="about">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight px-4 drop-shadow-lg">About Me</h2>
      <div className="w-full max-w-5xl flex flex-col gap-12 px-4 sm:px-6">
        {/* Journey Timeline */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:shadow-blue-200 transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-2xl shadow"><FaRocket /></span>
            <h3 className="text-2xl font-bold text-blue-700">{content.journey_title}</h3>
          </div>
          <ol className="relative border-l-4 border-blue-200 ml-2 space-y-8 pl-8">
            {content.journey_points.map((item, index) => (
              <li key={index} className="relative">
                <span className="absolute -left-7 top-1 w-5 h-5 rounded-full border-4 border-white shadow bg-blue-400"></span>
                <div className="bg-white rounded-xl shadow p-4 ml-2 hover:bg-blue-50 transition-colors duration-200">
                  <span className="block text-lg font-semibold text-blue-800 mb-1">{item.point.split(':')[0]}</span>
                  <span className="text-gray-700 text-base">{item.point.split(':').slice(1).join(':')}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {/* Education Card with Stepper */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-xl p-8 border border-purple-100 hover:shadow-purple-200 transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-2xl shadow"><FaGraduationCap /></span>
            <h3 className="text-2xl font-bold text-purple-700">{content.education_title}</h3>
          </div>
          <div className="relative flex flex-col gap-0 pl-8">
            {/* Vertical pipeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-blue-200 to-blue-100 rounded-full z-0"></div>
            {content.education_items.map((item, index) => (
              <div key={index} className="relative flex items-center group mb-8 last:mb-0">
                {/* Step circle */}
                <div className={`z-10 w-8 h-8 flex items-center justify-center rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${index === content.education_items.length - 1 ? 'bg-purple-500' : 'bg-blue-500'}`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                {/* Card */}
                <div className="ml-6 flex flex-col bg-white rounded-xl shadow px-5 py-3 border border-purple-100 group-hover:bg-purple-50 transition-colors duration-200 w-full">
                  <span className="font-semibold text-base text-purple-900">{item.institution}</span>
                  <span className="text-gray-500 text-base">{item.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Core Strengths - Animated Progress Bars */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl p-8 border border-green-100 hover:shadow-green-200 transition-shadow duration-300 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-2xl shadow"><FaLightbulb /></span>
            <h3 className="text-2xl font-bold text-green-700">{content.strengths_title}</h3>
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-10 w-full">
            {strengths.map((strength, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-gradient-to-br ${strength.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradientColor)"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * strength.level) / 100}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
                    />
                    <defs>
                      <linearGradient id="gradientColor" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#fff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{strength.level}%</span>
                </div>
                <span className="text-base font-semibold text-gray-700 text-center mt-1 group-hover:text-green-700 transition-colors duration-300">{strength.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 