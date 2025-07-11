import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { BsChatDotsFill } from 'react-icons/bs';
import { buildApiUrl, ENDPOINTS } from '../config/api';

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
  const [portfolioData, setPortfolioData] = useState({ projects: [], skills: [], resume: null, hero: null, about: null, contact: null, certifications: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [projectRatings, setProjectRatings] = useState({}); // { [projectId]: { average, count } }
  const chatEndRef = useRef(null);

  // Fetch all portfolio data when assistant opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [projectsRes, skillsRes, resumeRes, heroRes, aboutRes, contactRes, certRes] = await Promise.all([
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_PROJECTS)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_SKILLS)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_RESUME)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_HERO)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_ABOUT)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_CONTACT)),
            fetch(buildApiUrl(ENDPOINTS.PUBLIC_CERTIFICATIONS)),
          ]);
          const projects = projectsRes.ok ? await projectsRes.json() : [];
          // Fetch ratings for all projects
          const ratingsObj = {};
          await Promise.all(projects.map(async (p) => {
            const id = p._id || p.id;
            const res = await fetch(buildApiUrl(`/api/projects/${id}/ratings`));
            if (res.ok) {
              const data = await res.json();
              ratingsObj[id] = data;
            }
          }));
          setProjectRatings(ratingsObj);
          const skills = skillsRes.ok ? await skillsRes.json() : [];
          const resume = resumeRes.ok ? await resumeRes.json() : null;
          const hero = heroRes.ok ? await heroRes.json() : null;
          const about = aboutRes.ok ? await aboutRes.json() : null;
          const contact = contactRes.ok ? await contactRes.json() : null;
          const certifications = certRes.ok ? await certRes.json() : [];
          setPortfolioData({ projects, skills, resume, hero, about, contact, certifications });
        } catch (err) {
          setPortfolioData({ projects: [], skills: [], resume: null, hero: null, about: null, contact: null, certifications: [] });
          setProjectRatings({});
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
    const { projects, skills, certifications } = portfolioData;
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
    setSuggestions(sugg.slice(0, 5));
  }, [input, portfolioData]);

  const formatPortfolioData = () => {
    const { projects, skills, resume, hero, about, contact, certifications } = portfolioData;
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
      str += `Projects (title, description, tech, average rating, rating count):\n`;
      str += projects.map(p => {
        const id = p._id || p.id;
        const rating = projectRatings[id]?.average ? (Math.round(projectRatings[id].average * 10) / 10) : 0;
        const count = projectRatings[id]?.count || 0;
        return `- ${p.title}: ${p.description} [${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}] | Rating: ${rating} / 5 (${count} rating${count !== 1 ? 's' : ''})`;
      }).join('\n');
      str += '\n';
    }
    if (skills && skills.length) {
      str += `Skills:\n`;
      str += skills.map(s => `- ${s.name} (${s.category})`).join(', ');
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
      const systemPrompt = `You are Mohan’s AI Portfolio Assistant.\n\nYour role is to act as a smart, helpful, and context-aware guide for anyone visiting Mohan’s portfolio — including recruiters, developers, collaborators, and learners. You speak clearly, encouragingly, and intelligently.\n\nHere is Mohan's real portfolio data (always use this for answers):\n${formatPortfolioData()}\n\nYour main functions:\n1. Explain Projects — Give clear, concise summaries of any of Mohan’s projects and what tech is used.\n2. Tech Help — Answer questions like “How did Mohan implement X?” or “Why use MongoDB here?”\n3. Recruiter Support — Highlight his experience, skills, availability, and generate a summary pitch.\n4. Learning Guide — If asked “How can I build this?” or “Where should I start?”, provide beginner-friendly steps and resources.\n5. Resume & Certifications — Help users find, view, or review Mohan’s resume and certifications.\n6. Conversational — Speak like a supportive developer mentor. Avoid buzzwords. Be human.\n\nYour goal is to make Mohan look intelligent, resourceful, and impactful — and to help the visitor understand or build what he’s built.\n\nIf the user asks to contact Mohan or book a meeting, share his preferred contact info or Calendly link (if provided in context).`;
      const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chat.filter(m => m.role !== 'error').map(m => ({ role: m.role, content: m.content })),
          userMessage
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const aiReply = res.data.choices[0].message.content;
      setChat(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      setChat(prev => [...prev, { role: 'error', content: "Failed to get response. Please try again." }]);
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
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all group"
          aria-label="Open Mohan's AI Assistant"
        >
          <span className="relative flex items-center justify-center w-9 h-9">
            <BsChatDotsFill size={32} className="absolute text-white left-0 top-0 w-9 h-9" />
            <FaRobot size={18} className="absolute text-blue-400 left-1.5 top-1.5 w-6 h-6 group-hover:scale-110 transition-transform" />
          </span>
        </button>
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