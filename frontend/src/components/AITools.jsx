import React, { useRef, useEffect, useState } from 'react';
import { buildApiUrl, ENDPOINTS } from '../config/api';

const CARD_WIDTH = 90; // px, min-w-[90px]
const GAP = 16; // px, mx-2

function useInfiniteScroll(ref, items, duplicationCount, direction = 'left') {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let isHovered = false;
    let scrollAmount = 1; // px per tick
    let scrollInterval;
    const totalWidth = () => container.scrollWidth / duplicationCount;
    const scrollContent = () => {
      if (isHovered) return;
      if (direction === 'left') {
        if (container.scrollLeft >= totalWidth()) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollAmount;
        }
      } else {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = totalWidth();
        } else {
          container.scrollLeft -= scrollAmount;
        }
      }
    };
    scrollInterval = setInterval(scrollContent, 16); // ~60fps
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, items, duplicationCount, direction]);
}

const AITools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const [topDuplication, setTopDuplication] = useState(2);
  const [bottomDuplication, setBottomDuplication] = useState(2);

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      try {
        const res = await fetch(buildApiUrl(ENDPOINTS.PUBLIC_AI_TOOLS));
        const data = await res.json();
        setTools(Array.isArray(data) ? data : []);
      } catch {
        setTools([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  // Split tools for top and bottom rows
  const mid = Math.ceil(tools.length / 2);
  const topRow = tools.slice(0, mid);
  const bottomRow = tools.slice(mid);

  // Update duplication counts on mount and resize
  useEffect(() => {
    function updateDuplication() {
      if (topRef.current) {
        const containerWidth = topRef.current.offsetWidth;
        const rowWidth = topRow.length * (CARD_WIDTH + GAP);
        setTopDuplication(Math.max(2, rowWidth ? Math.ceil((containerWidth * 2) / rowWidth) : 2));
      }
      if (bottomRef.current) {
        const containerWidth = bottomRef.current.offsetWidth;
        const rowWidth = bottomRow.length * (CARD_WIDTH + GAP);
        setBottomDuplication(Math.max(2, rowWidth ? Math.ceil((containerWidth * 2) / rowWidth) : 2));
      }
    }
    updateDuplication();
    window.addEventListener('resize', updateDuplication);
    return () => window.removeEventListener('resize', updateDuplication);
  }, [topRow.length, bottomRow.length]);

  useInfiniteScroll(topRef, topRow, topDuplication, 'left');
  useInfiniteScroll(bottomRef, bottomRow, bottomDuplication, 'right');

  const topRowIcons = Array.from({ length: topDuplication }, () => topRow).flat();
  const bottomRowIcons = Array.from({ length: bottomDuplication }, () => bottomRow).flat();

  return (
    <section className="relative py-12 bg-gradient-to-b from-black via-gray-900 to-black w-full overflow-hidden" id="ai-tools">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-2 tracking-tight px-4 drop-shadow-lg">I Know AI Tools</h2>
      <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto px-4">A showcase of AI tools and platforms I have experience with.</p>
      {loading ? (
        <div className="text-center text-white py-10">Loading AI tools...</div>
      ) : (
        <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-8">
          {/* Top Row: left to right, infinite */}
          <div className="overflow-hidden w-full" ref={topRef} style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div className="flex gap-4 px-2" style={{ minWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
              {topRowIcons.map((tool, idx) => (
                <div key={(tool._id || tool.name) + idx} className="flex flex-col items-center justify-center bg-black/60 rounded-2xl shadow-lg border border-gray-800 p-4 min-w-[90px] mx-2">
                  {tool.iconImage ? (
                    <img 
                      src={tool.iconImage} 
                      alt={tool.name}
                      className="w-12 h-12 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs" style={{ display: tool.iconImage ? 'none' : 'flex' }}>
                    No Icon
                  </div>
                  <span className="text-gray-200 text-xs mt-2 text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom Row: right to left, infinite */}
          <div className="overflow-hidden w-full" ref={bottomRef} style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div className="flex gap-4 px-2" style={{ minWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
              {bottomRowIcons.map((tool, idx) => (
                <div key={(tool._id || tool.name) + idx} className="flex flex-col items-center justify-center bg-black/60 rounded-2xl shadow-lg border border-gray-800 p-4 min-w-[90px] mx-2">
                  {tool.iconImage ? (
                    <img 
                      src={tool.iconImage} 
                      alt={tool.name}
                      className="w-12 h-12 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs" style={{ display: tool.iconImage ? 'none' : 'flex' }}>
                    No Icon
                  </div>
                  <span className="text-gray-200 text-xs mt-2 text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AITools; 