import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Sun, Moon } from 'lucide-react';
import useSound from 'use-sound';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark theme
  });
  
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const [playOn] = useSound('/sounds/switch-on.mp3', { volume: 0.5 });
  const [playOff] = useSound('/sounds/switch-off.mp3', { volume: 0.5 });
  
  const updateThemeVariables = (darkMode) => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.style.setProperty('--color-background', '#050505');
      root.style.setProperty('--color-text', '#f9fafb');
      root.style.setProperty('--color-surface', 'rgba(30, 30, 30, 0.7)');
      root.style.setProperty('--color-primary', '#8a2be2');
      root.style.setProperty('--color-secondary', '#00ffff');
      root.style.setProperty('--color-accent', '#ff3e6b');
    } else {
      root.style.setProperty('--color-background', '#ffffff');
      root.style.setProperty('--color-text', '#1a1a1a');
      root.style.setProperty('--color-surface', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--color-primary', '#6366f1');
      root.style.setProperty('--color-secondary', '#8b5cf6');
      root.style.setProperty('--color-accent', '#ec4899');
    }
  };
  
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Play sound
    try {
      newTheme ? playOn() : playOff();
    } catch (error) {
      console.log('Sound not available');
    }
    
    // Button animation
    const tl = gsap.timeline();
    
    tl.to(buttonRef.current, {
      rotate: 360,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    // Overlay animation
    if (overlayRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      overlayRef.current.style.left = `${x}px`;
      overlayRef.current.style.top = `${y}px`;
      
      tl.set(overlayRef.current, {
        display: 'block',
        scale: 0,
        opacity: 1
      })
      .to(overlayRef.current, {
        scale: 50,
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlayRef.current, { 
            display: 'none', 
            scale: 0, 
            opacity: 1 
          });
        }
      }, "+=0.1");
    }
    
    // Update CSS variables
    updateThemeVariables(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDark: newTheme } 
    }));
  };
  
  useEffect(() => {
    // Initialize theme on component mount
    updateThemeVariables(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Dispatch initial theme event
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDark } 
    }));
  }, [isDark]);
  
  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-secondary)] flex items-center justify-center magnetic-hover shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="text-[var(--color-secondary)]" size={20} />
        ) : (
          <Moon className="text-[var(--color-secondary)]" size={20} />
        )}
      </button>
      
      <div
        ref={overlayRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-40"
        style={{
          background: isDark ? '#ffffff' : '#050505',
          display: 'none',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
};

export default ThemeToggle;