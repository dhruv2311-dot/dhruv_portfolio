import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Sun, Moon } from 'lucide-react';
import useSound from 'use-sound';
import PropTypes from 'prop-types';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const [playOn] = useSound('/sounds/switch-on.mp3', { volume: 0.5 });
  const [playOff] = useSound('/sounds/switch-off.mp3', { volume: 0.5 });
  
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    newTheme ? playOn() : playOff();
    
    const tl = gsap.timeline();
    
    tl.to(buttonRef.current, {
      rotate: 360,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    if (overlayRef.current) {
      const x = buttonRef.current?.getBoundingClientRect().left || 0;
      const y = buttonRef.current?.getBoundingClientRect().top || 0;
      
      overlayRef.current.style.left = `${x}px`;
      overlayRef.current.style.top = `${y}px`;
      
      tl.set(overlayRef.current, {
        display: 'block',
        scale: 0
      })
      .to(overlayRef.current, {
        scale: 100,
        duration: 0.8,
        ease: "power2.inOut"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none', scale: 0, opacity: 1 });
        }
      }, "+=0.1");
    }
    
    document.documentElement.style.setProperty('--color-background', newTheme ? '#050505' : '#ffffff');
    document.documentElement.style.setProperty('--color-text', newTheme ? '#f9fafb' : '#1a1a1a');
    document.documentElement.style.setProperty('--color-surface', newTheme ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  useEffect(() => {
    document.documentElement.style.setProperty('--color-background', isDark ? '#050505' : '#ffffff');
    document.documentElement.style.setProperty('--color-text', isDark ? '#f9fafb' : '#1a1a1a');
    document.documentElement.style.setProperty('--color-surface', isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)');
  }, [isDark]);
  
  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-secondary)] flex items-center justify-center magnetic-hover shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle theme"
        style={{ position: 'fixed', top: '24px', right: '24px' }}
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
          background: isDark ? '#050505' : '#ffffff',
          display: 'none'
        }}
      />
    </>
  );
};

ThemeToggle.propTypes = {};

export default ThemeToggle;