import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { BsChatDotsFill } from 'react-icons/bs';
import { buildApiUrl, ENDPOINTS } from '../config/api';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '../contexts/AuthContext';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Mohan's AI Assistant. Ask me anything about Mohan's projects, tech stack, or how to build something similar!"
    }
  ]);
  const [portfolioData, setPortfolioData] = useState({ projects: [], skills: [], resume: null, hero: null, about: null, contact: null, certifications: [], aiTools: [] });
  const [suggestions, setSuggestions] = useState([]);
  const chatEndRef = useRef(null);
  const [iconPosition, setIconPosition] = useState({ x: 24, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [longPressTimeout, setLongPressTimeout] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const iconRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Fetch all portfolio data when assistant opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [projectsRes, skillsRes, resumeRes, heroRes, aboutRes, contactRes, certRes, aiToolsRes] = await Promise.all([
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_PROJECTS)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_SKILLS)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_RESUME)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_HERO)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_ABOUT)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_CONTACT)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_CERTIFICATIONS)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_AI_TOOLS)),
          ]);
          
          const projects = projectsRes.ok ? await projectsRes.json() : [];
          const skills = skillsRes.ok ? await skillsRes.json() : [];
          const resume = resumeRes.ok ? await resumeRes.json() : null;
          const hero = heroRes.ok ? await heroRes.json() : null;
          const about = aboutRes.ok ? await aboutRes.json() : null;
          const contact = contactRes.ok ? await contactRes.json() : null;
          const certifications = certRes.ok ? await certRes.json() : [];
          const aiTools = aiToolsRes.ok ? await aiToolsRes.json() : [];
          
          setPortfolioData({ projects, skills, resume, hero, about, contact, certifications, aiTools });
        } catch (err) {
          console.error('Error fetching portfolio data:', err);
          setPortfolioData({ projects: [], skills: [], resume: null, hero: null, about: null, contact: null, certifications: [], aiTools: [] });
        }
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, open]);

  // Suggestion logic: update suggestions as user types
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    const { projects, skills, certifications, aiTools } = portfolioData;
    const lower = input.toLowerCase();
    let sugg = [];
    if (projects && projects.length) {
      sugg = sugg.concat(projects.filter(p => p.title && p.title.toLowerCase().includes(lower)).map(p => p.title));
    }
    if (skills && skills.length) {
      sugg = sugg.concat(skills.filter(s => s.name && s.name.toLowerCase().includes(lower)).map(s => s.name));
    }
    if (certifications && certifications.length) {
      sugg = sugg.concat(certifications.filter(c => c.name && c.name.toLowerCase().includes(lower)).map(c => c.name));
    }
    if (aiTools && aiTools.length) {
      sugg = sugg.concat(aiTools.filter(t => t.name && t.name.toLowerCase().includes(lower)).map(t => t.name));
    }
    setSuggestions(sugg.slice(0, 5));
  }, [input, portfolioData]);

  // Update position on window resize (keep icon in view)
  useEffect(() => {
    const handleResize = () => {
      setIconPosition(pos => ({
        x: Math.min(pos.x, window.innerWidth - 72),
        y: Math.min(pos.y, window.innerHeight - 72)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile || !isAuthenticated) return;
    const touch = e.touches[0];
    setLongPressTimeout(setTimeout(() => {
      setDragging(true);
      setDragOffset({
        x: touch.clientX - iconPosition.x,
        y: touch.clientY - iconPosition.y
      });
    }, 400)); // 400ms long press
  };
  const handleTouchMove = (e) => {
    if (!isMobile || !dragging || !isAuthenticated) return;
    const touch = e.touches[0];
    setIconPosition({
      x: Math.max(0, Math.min(touch.clientX - dragOffset.x, window.innerWidth - 72)),
      y: Math.max(0, Math.min(touch.clientY - dragOffset.y, window.innerHeight - 72))
    });
  };
  const handleTouchEnd = () => {
    if (!isMobile || !isAuthenticated) return;
    clearTimeout(longPressTimeout);
    setLongPressTimeout(null);
    setDragging(false);
  };

  const formatPortfolioData = () => {
    const { projects, skills, resume, hero, about, contact, certifications, aiTools } = portfolioData;
    let str = '';
    if (hero) {
      str += `Hero/Profile:\n- Name: ${hero.name}\n- Title: ${hero.title}\n- Subtitle: ${hero.subtitle}\n- Description: ${hero.description}\n- Social: GitHub: ${hero.github_url}, LinkedIn: ${hero.linkedin_url}\n- Welcome: ${hero.welcome_text}\n`;
    }
    if (about) {
      str += `About:\n- Journey: ${about.journey_title}\n  ${about.journey_points?.map(j => j.point).join(' | ')}\n- Education: ${about.education_title}\n  ${about.education_items?.map(e => `${e.institution} ${e.details}`).join(' | ')}\n- Strengths: ${about.strengths_title}\n  ${about.strengths_list?.join(', ')}\n`;
    }
    if (contact) {
      str += `Contact:\n- Email: ${contact.email}\n- Location: ${contact.location}\n- GitHub: ${contact.github_url}\n- LinkedIn: ${contact.linkedin_url}\n`;
    }
    if (projects && projects.length) {
      str += `Projects (title, description, tech):\n`;
      str += projects.map(p => {
        return `- ${p.title}: ${p.description} [${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}]`;
      }).join('\n');
      str += '\n';
    }
    if (skills && skills.length) {
      str += `Skills:\n`;
      str += skills.map(s => `- ${s.name} (${s.category})`).join(', ');
      str += '\n';
    }
    if (aiTools && aiTools.length) {
      str += `AI Tools:\n`;
      str += aiTools.map(t => `- ${t.name}${t.description ? `: ${t.description}` : ''}`).join('\n');
      str += '\n';
    }
    if (certifications && certifications.length) {
      str += `Certifications:\n`;
      str += certifications.map(c => {
        let certStr = `- ${c.name} (Issuer: ${c.issuer}`;
        if (c.issue_date) certStr += `, Issued: ${c.issue_date}`;
        if (c.expiry_date) certStr += `, Expires: ${c.expiry_date}`;
        if (c.credential_id) certStr += `, ID: ${c.credential_id}`;
        if (c.credential_url) certStr += `, URL: ${c.credential_url}`;
        certStr += ")";
        return certStr;
      }).join('\n');
      str += '\n';
    }
    if (resume && resume.file_path) {
      str += `Resume: ${resume.file_path}\n`;
    }
    return str;
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const userMessage = { role: 'user', content: input };
    setChat(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      const systemPrompt = `You are Mohan's AI Portfolio Assistant.\n\nYour role is to act as a smart, helpful, and context-aware guide for anyone visiting Mohan's portfolio — including recruiters, developers, collaborators, and learners. You speak clearly, encouragingly, and intelligently.\n\nHere is Mohan's real portfolio data (always use this for answers):\n${formatPortfolioData()}\n\nYour main functions:\n1. Explain Projects — Give clear, concise summaries of any of Mohan's projects and what tech is used.\n2. Tech Help — Answer questions like "How did Mohan implement X?" or "Why use MongoDB here?"\n3. Recruiter Support — Highlight his experience, skills, availability, and generate a summary pitch.\n4. Learning Guide — If asked "How can I build this?" or "Where should I start?", provide beginner-friendly steps and resources.\n5. Resume & Certifications — Help users find, view, or review Mohan's resume and certifications.\n6. Conversational — Speak like a supportive developer mentor. Avoid buzzwords. Be human.\n\nYour goal is to make Mohan look intelligent, resourceful, and impactful — and to help the visitor understand or build what he's built.\n\nIf the user asks to contact Mohan or book a meeting, share his preferred contact info or Calendly link (if provided in context).`;
      
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }
      
      const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chat.filter(m => m.role !== 'error').map(m => ({ role: m.role, content: m.content })),
          userMessage
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });
      
      const aiReply = res.data.choices[0].message.content;
      setChat(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      console.error('AI Assistant error:', err);
      let errorMessage = "Failed to get response. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "AI service authentication failed. Please contact the administrator.";
      } else if (err.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message === 'OpenRouter API key not configured') {
        errorMessage = "AI service not configured. Please contact the administrator.";
      }
      
      setError(errorMessage);
      setChat(prev => [...prev, { role: 'error', content: errorMessage }]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAsk();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setChat([
      {
        role: 'assistant',
        content: "Hi! I'm Mohan's AI Assistant. Ask me anything about Mohan's projects, tech stack, or how to build something similar!"
      }
    ]);
  };

  return (
    <>
      {/* Floating Button with custom icon */}
      {!open && (
        <div style={isMobile ? { left: iconPosition.x, top: iconPosition.y, right: 'auto', bottom: 'auto', position: 'fixed', zIndex: 50, touchAction: 'none' } : { right: 24, bottom: 24, position: 'fixed', zIndex: 50 }}>
          <button
            ref={iconRef}
            onClick={() => setOpen(true)}
            className={`bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all group ${dragging ? 'ring-4 ring-purple-400' : ''}`}
            aria-label="Open Mohan's AI Assistant"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <span className="relative flex items-center justify-center w-9 h-9">
              <BsChatDotsFill size={32} className="absolute text-white left-0 top-0 w-9 h-9" />
              <FaRobot size={18} className="absolute text-blue-400 left-1.5 top-1.5 w-6 h-6 group-hover:scale-110 transition-transform" />
            </span>
          </button>
          {/* Tooltip for admin on mobile */}
          {isMobile && isAuthenticated && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-80 pointer-events-none whitespace-nowrap shadow-lg">
              Long-press to move
            </div>
          )}
        </div>
      )}
      {/* Popup Card */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-100 w-full max-w-lg min-h-[520px] max-h-[80vh] sm:rounded-3xl shadow-2xl p-0 sm:p-0 m-0 sm:m-8 relative animate-fade-in-up border border-blue-100 flex flex-col">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full focus:outline-none"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
            <div className="flex items-center gap-2 mb-0 px-6 pt-6 pb-2">
              <span className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full shadow-lg">
                <BsChatDotsFill size={28} className="absolute text-white left-1 top-1 w-8 h-8" />
                <FaRobot size={14} className="absolute text-blue-200 left-3 top-3 w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-gray-900">Mohan's AI Assistant</h2>
            </div>
            {/* Chat Area */}
            <div className="flex-1 px-4 pb-2 pt-2 overflow-y-auto" style={{ minHeight: 0 }}>
              <div className="flex flex-col gap-3">
                {chat.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-base whitespace-pre-line
                        ${msg.role === 'user'
                          ? 'bg-gradient-to-tr from-blue-500 to-purple-500 text-white rounded-br-sm'
                          : msg.role === 'assistant'
                            ? 'bg-white border border-blue-100 text-gray-900 rounded-bl-sm'
                            : 'bg-red-100 text-red-700 border border-red-200'}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
            {/* Input Area */}
            <div className="px-6 pb-6 pt-2 flex flex-col gap-1 items-end">
              <div className="w-full flex flex-col-reverse gap-0 items-end relative">
                <div className="w-full flex gap-2 items-end">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="flex-1 p-3 border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-900 text-base shadow-sm"
                    placeholder="Type your message..."
                    onKeyDown={handleInputKeyDown}
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    onClick={handleAsk}
                    className="px-5 py-3 bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-md disabled:opacity-60 transition-all"
                    disabled={loading || !input.trim()}
                  >
                    {loading ? '...' : <BsChatDotsFill size={22} />}
                  </button>
                </div>
                {/* Suggestions Dropdown (above input) */}
                {suggestions.length > 0 && (
                  <div className="w-full mb-2 bg-white border border-blue-200 rounded-xl shadow z-20 max-h-40 overflow-y-auto" style={{ position: 'absolute', bottom: '100%' }}>
                    {suggestions.map((s, i) => (
                      <div
                        key={s + i}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-800 text-sm"
                        onClick={() => setInput(s)}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {error && <p className="px-6 pb-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
} 