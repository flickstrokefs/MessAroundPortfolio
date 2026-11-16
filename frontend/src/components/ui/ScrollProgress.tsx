import React, { useEffect, useRef } from 'react';

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        if (!barRef.current) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          barRef.current.style.width = '0%';
          return;
        }
        const scrolled = (window.scrollY / totalHeight) * 100;
        barRef.current.style.width = `${scrolled}%`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to initialize correct width
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#ff5c00] via-[#ff2d78] to-[#00e5ff] z-[200] transition-all duration-75 ease-out"
      style={{ width: '0%', willChange: 'width' }}
    />
  );
};

export default React.memo(ScrollProgress);
