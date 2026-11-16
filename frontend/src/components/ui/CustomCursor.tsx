import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mouseCoords = useRef({ x: -100, y: -100 });
  const ringCoords = useRef({ x: -100, y: -100 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        // Immediately snap coordinates to first mouse position
        mouseCoords.current = { x: e.clientX, y: e.clientY };
        ringCoords.current = { x: e.clientX, y: e.clientY };
        
        if (dotRef.current) {
          dotRef.current.style.left = `${e.clientX}px`;
          dotRef.current.style.top = `${e.clientY}px`;
        }
        if (ringRef.current) {
          ringRef.current.style.left = `${e.clientX}px`;
          ringRef.current.style.top = `${e.clientY}px`;
        }
        
        setHasMoved(true);
      } else {
        mouseCoords.current = { x: e.clientX, y: e.clientY };
      }
      setIsHidden(false);
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      setIsHidden(false);
    };

    // Check if hovering interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.interactive-item') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Lerp logic for lagging ring (factor 0.18)
    let animationFrameId: number;
    const render = () => {
      if (hasMoved) {
        // Immediate position for dot
        if (dotRef.current) {
          dotRef.current.style.left = `${mouseCoords.current.x}px`;
          dotRef.current.style.top = `${mouseCoords.current.y}px`;
        }
        
        // Lerped position for ring (factor 0.18)
        const lerpFactor = 0.18;
        ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * lerpFactor;
        ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * lerpFactor;
        
        if (ringRef.current) {
          ringRef.current.style.left = `${ringCoords.current.x}px`;
          ringRef.current.style.top = `${ringCoords.current.y}px`;
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);

    // Hide standard cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, [hasMoved]);

  return (
    <div className={isHovered ? 'cursor-hover' : ''}>
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ 
          left: '-100px', 
          top: '-100px', 
          opacity: isHidden || !hasMoved ? 0 : 1, 
          transition: 'width 0.2s, height 0.2s, background-color 0.2s, opacity 0.25s' 
        }}
      />
      <div 
        ref={ringRef} 
        className="custom-cursor-ring" 
        style={{ 
          left: '-100px', 
          top: '-100px', 
          opacity: isHidden || !hasMoved ? 0 : 1, 
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, opacity 0.25s' 
        }}
      />
    </div>
  );
};

export default CustomCursor;
