import React, { useState, useEffect } from 'react';
import { buildApiUrl, ENDPOINTS } from '../config/api';

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

  return (
  <section className="py-24 w-screen min-h-[80vh] bg-gradient-to-b from-white via-blue-50 to-white flex flex-col items-center" id="about">
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">About Me</h2>
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 px-4">
      {/* My Journey Card */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col gap-4 border border-blue-100">
        <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2"><span role="img" aria-label="rocket">🚀</span> {content.journey_title}</h3>
        <ul className="text-gray-700 space-y-3 text-lg">
          {content.journey_points.map((item, index) => (
            <li key={index}>
              {item.point ? (
                <>
                  <span className="font-semibold">{item.point.split(':')[0]}:</span> {item.point.split(':').slice(1).join(':')}
                </>
              ) : (
                <span>No content available</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Education Timeline Card */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-blue-100 flex flex-col">
        <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2"><span role="img" aria-label="graduation">🎓</span> {content.education_title}</h3>
        <ol className="relative border-l-4 border-blue-200 ml-2 space-y-8 pl-6">
          {content.education_items.map((item, index) => (
            <li key={index} className="relative">
              <span className={`absolute -left-7 top-1 w-5 h-5 rounded-full border-4 border-white shadow ${index === content.education_items.length - 1 ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
              <span className="font-semibold">{item.institution}</span> <span className="text-gray-500">{item.details}</span>
          </li>
          ))}
        </ol>
      </div>
    </div>
    {/* Core Strengths Card */}
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-blue-100 flex flex-col items-center">
      <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2"><span role="img" aria-label="bulb">💡</span> {content.strengths_title}</h3>
      <ul className="text-gray-700 space-y-2 text-lg text-center">
        {content.strengths_list.map((strength, index) => (
          <li key={index}>{strength}</li>
        ))}
      </ul>
    </div>
  </section>
);
};

export default About; 