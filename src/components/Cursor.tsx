import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorRings = cursorRingsRef.current;
    
    if (!cursor || !cursorDot || !cursorRings) return;
    
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
      
      gsap.to(cursorRings, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out"
      });
    };
    
    const onMouseDown = () => {
      gsap.to(cursorRings, {
        scale: 0.8,
        duration: 0.2,
      });
    };
    
    const onMouseUp = () => {
      gsap.to(cursorRings, {
        scale: 1,
        duration: 0.2,
      });
    };
    
    const handleMagneticMove = (e: MouseEvent, elem: Element) => {
      const rect = elem.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(elem, {
        x: relX * 0.2,
        y: relY * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cursorRings, {
        width: 60,
        height: 60,
        opacity: 0.5,
        duration: 0.3
      });
    };
    
    const handleMagneticLeave = (elem: Element) => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cursorRings, {
        width: 40,
        height: 40,
        opacity: 1,
        duration: 0.3
      });
    };
    
    const setupMagneticElements = () => {
      const magneticElements = document.querySelectorAll('.magnetic-hover, button, a');
      
      magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => handleMagneticMove(e as MouseEvent, elem));
        elem.addEventListener('mouseleave', () => handleMagneticLeave(elem));
        
        elem.addEventListener('mouseenter', () => {
          gsap.to(cursorDot, {
            scale: 0,
            duration: 0.2
          });
        });
        
        elem.addEventListener('mouseleave', () => {
          gsap.to(cursorDot, {
            scale: 1,
            duration: 0.2
          });
        });
      });
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    setTimeout(setupMagneticElements, 1000);
    
    const observer = new MutationObserver(setupMagneticElements);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);
  
  return (
    <div ref={cursorRef} className="cursor-container">
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={cursorRingsRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-white pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};

export default Cursor;