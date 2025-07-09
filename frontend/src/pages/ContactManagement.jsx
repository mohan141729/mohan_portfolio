import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaCode, 
  FaCertificate, 
  FaEnvelope, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheck,
  FaUpload,
  FaFileAlt,
  FaUserCog,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, getRequestConfig, ENDPOINTS } from '../config/api';

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState({
    title: '',
    subtitle: '',
    description: '',
    location: '',
    email: '',
    github_url: '',
    linkedin_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  // 1. Add state for messages and loading
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState('');
  // 1. Add state for reply modal
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');
  const [replyError, setReplyError] = useState('');
  // 1. Add state for viewing a message
  const [viewMessage, setViewMessage] = useState(null);

  const { logout } = useAuth();

  // 2. Fetch messages on mount
  useEffect(() => {
    fetchContactInfo();
    fetchMessages();
  }, []);

  // 1. useEffect to show notification for unread messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const unreadCount = messages.filter(m => m.status !== 'read').length;
      if (unreadCount > 0 && window.Notification && Notification.permission === 'granted') {
        new Notification('Unread Messages', {
          body: `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}.`,
          icon: '/vite.svg'
        });
      }
    }
  }, [messages]);

  // 2. Request notification permission on mount if not already granted
  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_INFO), getRequestConfig());
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError('');
    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_MESSAGES), getRequestConfig());
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } else {
        setMessagesError('Failed to fetch messages');
      }
    } catch (err) {
      setMessagesError('Network error');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(buildApiUrl(ENDPOINTS.CONTACT_INFO), getRequestConfig('PUT', contactInfo));

      if (response.ok) {
        setMessage('Contact information updated successfully!');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setMessage('Error updating contact information');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 1. Add delete and mark as read logic
  const handleMarkAsRead = async (msg) => {
    if (msg.status !== 'read') {
      try {
        await fetch(buildApiUrl(`/api/contact/${msg._id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'read' })
        });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m));
      } catch (err) {
        // Optionally show error
      }
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const response = await fetch(buildApiUrl(`/api/contact/${msgId}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m._id !== msgId));
      } else {
        // Optionally show error
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FaTachometerAlt },
    { name: 'Projects', path: '/admin/projects', icon: FaProjectDiagram },
    { name: 'Skills', path: '/admin/skills', icon: FaCode },
    { name: 'Certifications', path: '/admin/certifications', icon: FaCertificate },
    { name: 'Resume', path: '/admin/resume', icon: FaFileAlt },
    { name: 'Messages', path: '/admin/contact', icon: FaEnvelope },
    { name: 'Admin Settings', path: '/admin/settings', icon: FaUserCog },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="flex-1 p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Contact Information Management</h1>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Update your contact details and social media links</p>
        </div>
      </div>
      
      {/* Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 sm:p-4 rounded-xl flex items-center justify-between text-sm sm:text-base ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-slate-400 hover:text-slate-600">
              <FaTimes size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaEnvelope size={18} />
              Basic Information
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={contactInfo.title}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., Get In Touch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={contactInfo.subtitle}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., Let's work together"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={contactInfo.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                placeholder="Brief description about how people can reach you..."
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaPhone size={18} />
              Contact Details
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={contactInfo.location}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-3">
              <FaGithub size={18} />
              Social Media Links
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={contactInfo.github_url}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={contactInfo.linkedin_url}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      </form>

      {/* User Contact Messages Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaEnvelope className="text-red-500" /> User Contact Messages
        </h2>
        {messagesLoading ? (
          <div className="text-gray-500">Loading messages...</div>
        ) : messagesError ? (
          <div className="text-red-500">{messagesError}</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500">No messages found.</div>
        ) : (
          <>
            {/* Cards for mobile and tablets */}
            <div className="block md:hidden space-y-4">
              {messages.map(msg => (
                <div key={msg._id} className="bg-white rounded-xl shadow border border-gray-200 p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-blue-700">{msg.name}</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${msg.status === 'unread' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{msg.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{msg.email}</div>
                  <div className="text-xs text-gray-500 mb-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}</div>
                  <div className="font-semibold text-sm">Subject: {msg.subject || '-'}</div>
                  <div className="text-gray-700 text-sm mb-2 line-clamp-3">{msg.message}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-blue-600 hover:underline text-xs font-semibold" onClick={async () => { setViewMessage(msg); await handleMarkAsRead(msg); }}>View</button>
                    <button className="text-blue-600 hover:underline text-xs font-semibold" onClick={() => { setReplyTo(msg); setReplySubject(msg.subject ? `Re: ${msg.subject}` : 'Re:'); setReplyMessage(''); setReplySuccess(''); setReplyError(''); }}>Reply</button>
                    <button className="text-red-600 hover:underline text-xs font-semibold" onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Table for desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Message</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{msg.name}</td>
                      <td className="px-4 py-2 text-sm text-blue-700 underline"><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                      <td className="px-4 py-2 text-sm text-gray-700">{msg.subject || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${msg.status === 'unread' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{msg.status}</span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2 text-xs">
                        <button className="text-blue-600 hover:underline text-xs font-semibold mr-2" onClick={async () => { setViewMessage(msg); await handleMarkAsRead(msg); }}>View</button>
                        <button className="text-blue-600 hover:underline text-xs font-semibold" onClick={() => { setReplyTo(msg); setReplySubject(msg.subject ? `Re: ${msg.subject}` : 'Re:'); setReplyMessage(''); setReplySuccess(''); setReplyError(''); }}>Reply</button>
                        <button className="text-red-600 hover:underline text-xs font-semibold ml-2" onClick={() => handleDeleteMessage(msg._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Reply Modal */}
      {replyTo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setReplyTo(null)}><FaTimes /></button>
            <h3 className="text-lg font-bold mb-2">Reply to {replyTo.name}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setReplyLoading(true);
              setReplySuccess('');
              setReplyError('');
              try {
                const response = await fetch(buildApiUrl('/api/contact/reply'), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    to: replyTo.email,
                    subject: replySubject,
                    message: replyMessage
                  })
                });
                if (response.ok) {
                  setReplySuccess('Reply sent successfully!');
                  setReplyMessage('');
                } else {
                  const data = await response.json();
                  setReplyError(data.error || 'Failed to send reply');
                }
              } catch (err) {
                setReplyError('Network error');
              } finally {
                setReplyLoading(false);
              }
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">To</label>
                <input type="email" value={replyTo.email} disabled className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Subject</label>
                <input type="text" value={replySubject} onChange={e => setReplySubject(e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Message</label>
                <textarea value={replyMessage} onChange={e => setReplyMessage(e.target.value)} className="w-full px-3 py-2 border rounded" rows={4} required />
              </div>
              {replySuccess && <div className="text-green-600 text-xs">{replySuccess}</div>}
              {replyError && <div className="text-red-600 text-xs">{replyError}</div>}
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => setReplyTo(null)}>Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white" disabled={replyLoading}>{replyLoading ? 'Sending...' : 'Send Reply'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add a modal to view the full message */}
      {viewMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setViewMessage(null)}><FaTimes /></button>
            <h3 className="text-lg font-bold mb-2">Message from {viewMessage.name}</h3>
            <div className="mb-2 text-xs text-gray-500">{viewMessage.email} | {viewMessage.createdAt ? new Date(viewMessage.createdAt).toLocaleString() : '-'}</div>
            <div className="mb-2 text-sm font-semibold">Subject: {viewMessage.subject || '-'}</div>
            <div className="mb-4 text-gray-800 whitespace-pre-line">{viewMessage.message}</div>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => setViewMessage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement; 