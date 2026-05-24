import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Hide on mobile/touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId = null;

    const move = (e) => {
      // Use requestAnimationFrame for smooth, non-blocking updates
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Spotlight effect
        const target = e.target;
        if (target && target.closest) {
          const card = target.closest('.bento-card, .glass');
          if (card) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          }
        }
      });
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;
      
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      if (isClickable) {
        cursor.classList.add("hovering");
      } else {
        cursor.classList.remove("hovering");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div 
      ref={cursorRef}
      className="custom-cursor"
      style={{ left: -100, top: -100 }}
    />
  );
}
