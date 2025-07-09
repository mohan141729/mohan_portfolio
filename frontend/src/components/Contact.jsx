import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    title: 'Get In Touch',
    subtitle: "Let's Connect",
    description: 'I\'m passionate about creating innovative web solutions and exploring the frontiers of artificial intelligence. Currently building full-stack applications with modern technologies.',
    location: 'Hyderabad, Telangana, India',
    email: 'mohan.developer@gmail.com',
    github_url: 'https://github.com/mohan-d',
    linkedin_url: 'https://linkedin.com/in/mohan-d'
  });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_CONTACT));
      if (response.ok) {
        const data = await response.json();
        // Merge with default values to ensure all fields exist
        setContactInfo(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      // Keep default values if API call fails
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_SUBMIT), getRequestConfig('POST', formData));

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white" id="contact">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white min-h-[80vh]" id="contact">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{contactInfo?.title || 'Get In Touch'}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
            I'm always open to discussing new opportunities and interesting projects. Feel free to reach out if you'd like to collaborate or just want to say hello!
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Information */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-gray-100 p-6 flex flex-col gap-4 transition-shadow duration-300 hover:shadow-[0_8px_40px_0_rgba(59,130,246,0.15)]">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{contactInfo?.subtitle || "Let's Connect"}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-2">{contactInfo?.description}</p>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center gap-3 group">
                  <span className="p-2 bg-blue-50 rounded-lg"><FaMapMarkerAlt className="text-blue-500" size={18} /></span>
                  <span className="text-gray-800 font-medium">{contactInfo?.location}</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <span className="p-2 bg-green-50 rounded-lg"><FaEnvelope className="text-green-500" size={18} /></span>
                  <a href={`mailto:${contactInfo?.email}`} className="text-blue-600 hover:underline font-medium transition">{contactInfo?.email}</a>
                </div>
                <div className="flex items-center gap-3 group">
                  <span className="p-2 bg-gray-100 rounded-lg"><FaGithub className="text-gray-700" size={18} /></span>
                  <a href={contactInfo?.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium transition">{contactInfo?.github_url?.replace('https://', '')}</a>
                </div>
                <div className="flex items-center gap-3 group">
                  <span className="p-2 bg-blue-50 rounded-lg"><FaLinkedin className="text-blue-600" size={18} /></span>
                  <a href={contactInfo?.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium transition">{contactInfo?.linkedin_url?.replace('https://', '')}</a>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-gray-100 p-8 flex flex-col gap-6 transition-shadow duration-300 hover:shadow-[0_8px_40px_0_rgba(59,130,246,0.15)]">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-4 py-2 mb-2"><FaCheckCircle /> Message sent successfully!</div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-2"><FaExclamationTriangle /> {error}</div>
              )}
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={16} /></span>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" required className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-gray-900" />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={16} /></span>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" required className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-gray-900" />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope size={16} /></span>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" required className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-gray-900" />
                </div>
                <div className="relative">
                  <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required rows={5} className="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-gray-900 resize-none" />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting && <span className="loader border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"></span>}
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 