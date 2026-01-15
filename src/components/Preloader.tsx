import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Code } from 'lucide-react';

const Preloader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Disable scrolling during preloader
    document.body.classList.add('is-loading');
    
    const tl = gsap.timeline();
    
    // Create a timeline for loading progress
    tl.to(progressBarRef.current, {
      width: '100%',
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (percentageRef.current) {
          const progress = Math.round(tl.progress() * 100);
          percentageRef.current.textContent = `${progress}%`;
        }
      }
    });
    
    // Animate the logo
    tl.to(logoRef.current, {
      scale: 1.2,
      duration: 0.5,
      ease: 'back.out(1.7)',
    }, 2);
    
    // Fade out the preloader
    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        document.body.classList.remove('is-loading');
      }
    }, 2.5);
    
    return () => {
      document.body.classList.remove('is-loading');
    };
  }, []);
  
  return (
    <div ref={preloaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md px-6 text-center">
        <div ref={logoRef} className="mb-8 inline-block">
          <Code size={80} className="text-[var(--color-secondary)]" />
        </div>
        
        <div className="relative h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            ref={progressBarRef} 
            className="absolute h-full w-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
          />
        </div>
        
        <div className="mt-4 text-2xl font-medium">
          <span ref={percentageRef}>0%</span>
        </div>
        
        <div className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Loading Portfolio Experience
        </div>
      </div>
    </div>
  );
};

export default Preloader;