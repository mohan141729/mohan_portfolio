import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaCode, FaChevronRight } from 'react-icons/fa';
import { buildApiUrl, ENDPOINTS, getRequestConfig } from '../config/api';

const About = () => {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animations - Only active on desktop
    const imageWidth = useTransform(scrollYProgress, [0, 0.3], ["100%", "45%"]);
    const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
    const contentX = useTransform(scrollYProgress, [0.2, 0.4], [50, 0]);

    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('journey');

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_ABOUT), getRequestConfig());
                if (response.ok) {
                    const data = await response.json();
                    setAboutData(data);
                }
            } catch (error) {
                console.error("Failed to fetch about data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    const tabs = [
        { id: 'journey', label: aboutData?.journey_title || 'Journey', icon: FaBriefcase },
        { id: 'education', label: aboutData?.education_title || 'Education', icon: FaGraduationCap },
        { id: 'strengths', label: aboutData?.strengths_title || 'Strengths', icon: FaCode },
    ];

    return (
        <section
            ref={containerRef}
            className={`relative bg-gray-50 ${isMobile ? 'h-auto py-10' : 'h-[200vh]'}`}
            id="about"
        >
            <div className={`${isMobile ? 'relative h-auto flex-col space-y-8' : 'sticky top-0 h-screen w-full overflow-hidden flex-row'} flex`}>

                {/* Image Section */}
                <motion.div
                    style={{ width: isMobile ? "100%" : imageWidth }}
                    className={`relative overflow-hidden z-10 shrink-0 ${isMobile ? 'h-[300px] w-full rounded-2xl shadow-lg mx-auto max-w-[90%]' : 'h-full'}`}
                >
                    <img
                        src={aboutData?.about_image || "https://res.cloudinary.com/dovmtmu7y/image/upload/v1765868286/mohan.jpg"}
                        alt="Developer Workspace"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
                </motion.div>

                {/* Content Section */}
                <motion.div
                    style={isMobile ? { opacity: 1, x: 0 } : { opacity: contentOpacity, x: contentX }}
                    className={`${isMobile ? 'w-full px-4 h-auto' : 'flex-1 h-full flex items-center justify-center p-12'}`}
                >
                    <div className={`${isMobile ? 'w-full h-auto p-6 backdrop-blur-xl bg-white/70 border border-white/50 shadow-xl rounded-2xl relative overflow-hidden' : 'max-w-xl w-full max-h-full backdrop-blur-xl bg-white/70 border border-white/50 shadow-2xl rounded-3xl p-12 relative overflow-hidden flex flex-col'}`}>
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

                        <div className={`relative z-10 ${isMobile ? '' : 'overflow-y-auto no-scrollbar flex-1'}`}>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight"
                            >
                                About Me
                            </motion.h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-blue-600 font-medium mb-6"
                            >
                                Student Software Developer
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600 leading-relaxed mb-8 text-lg"
                            >
                                I'm a passionate developer focused on building intuitive, high-performance web applications.
                                With a strong foundation in full-stack development and a curiosity for AI,
                                I strive to create digital experiences that are not just functional, but exceptional.
                            </motion.p>

                            {/* Dynamic Tabs Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col h-full"
                            >
                                {loading ? (
                                    <div className="flex justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : aboutData ? (
                                    <>
                                        {/* Tab Headers - Segmented Control Style */}
                                        <div className="flex p-1 mb-6 bg-gray-100/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                                            ? 'bg-white text-blue-600 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5'
                                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                                        }`}
                                                >
                                                    <tab.icon className={`text-base ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab Content */}
                                        <div className="min-h-[200px]">
                                            <AnimatePresence mode="wait">
                                                {activeTab === 'journey' && aboutData.journey_points && (
                                                    <motion.div
                                                        key="journey"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-3"
                                                    >
                                                        {aboutData.journey_points.map((item, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 group"
                                                            >
                                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0 group-hover:scale-125 group-hover:bg-blue-500 transition-all" />
                                                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                                                    {typeof item === 'string' ? item : item.point}
                                                                </p>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}

                                                {activeTab === 'education' && aboutData.education_items && (
                                                    <motion.div
                                                        key="education"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-3"
                                                    >
                                                        {aboutData.education_items.map((item, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/30 rounded-2xl p-5 border border-gray-100 hover:border-blue-200/50 hover:shadow-lg transition-all duration-300"
                                                            >
                                                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-3xl -mr-4 -mt-4 transition-transform group-hover:scale-150" />
                                                                <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{item.institution}</h4>
                                                                <p className="text-sm text-gray-500 mt-2 font-medium">{item.details}</p>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}

                                                {activeTab === 'strengths' && aboutData.strengths_list && (
                                                    <motion.div
                                                        key="strengths"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="grid grid-cols-1 gap-4"
                                                    >
                                                        {aboutData.strengths_list.map((item, idx) => {
                                                            const name = typeof item === 'string' ? item : item.name;
                                                            const level = typeof item === 'string' ? null : item.level;

                                                            return (
                                                                <motion.div
                                                                    key={idx}
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: idx * 0.05 }}
                                                                    className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
                                                                >
                                                                    <div className="flex justify-between items-center mb-2">
                                                                        <span className="font-semibold text-gray-700">{name}</span>
                                                                        {level && <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{level}%</span>}
                                                                    </div>
                                                                    {level && (
                                                                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                whileInView={{ width: `${level}%` }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="text-4xl mb-3">📭</div>
                                        <p>No details available yet.</p>
                                    </div>
                                )}{/* End of Dynamic Tabs Section */}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
