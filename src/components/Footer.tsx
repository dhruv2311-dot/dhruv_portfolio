import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Github, Linkedin, Twitter, Code } from 'lucide-react';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Set current year
    if (yearRef.current) {
      yearRef.current.textContent = new Date().getFullYear().toString();
    }
    
    // Easter egg - matrix rain when typing "matrix"
    let typedKeys = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      typedKeys += e.key.toLowerCase();
      typedKeys = typedKeys.slice(-6); // Keep only last 6 characters
      
      if (typedKeys === 'matrix') {
        createMatrixRain();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const createMatrixRain = () => {
    // Remove any existing canvas
    const existingCanvas = document.getElementById('matrix-canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1000';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Matrix characters
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%'.split('');
    
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    // Array to track y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    const draw = () => {
      // Black with opacity to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // x = i * fontSize, y = drops[i] * fontSize
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // If reached bottom or random chance, reset to top
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    };
    
    // Run matrix animation for 10 seconds
    const interval = setInterval(draw, 33);
    
    setTimeout(() => {
      clearInterval(interval);
      canvas.remove();
    }, 10000);
  };
  
  return (
    <footer ref={footerRef} className="relative py-12 bg-black overflow-hidden">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Code className="text-[var(--color-secondary)]" size={32} />
            <span className="text-2xl font-bold">Dhruv<span className="text-[var(--color-secondary)]">Portfolio</span></span>
          </div>
          
          <div className="flex gap-6">
            <a href="https://github.com/dhruv2311-dot" className="hover:text-[var(--color-secondary)] transition-colors magnetic-hover">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/dhruvvv23/" className="hover:text-[var(--color-secondary)] transition-colors magnetic-hover">
              <Linkedin size={24} />
            </a>
            <a href="https://x.com/dhruvvv_23_" className="hover:text-[var(--color-secondary)] transition-colors magnetic-hover">
              <Twitter size={24} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; <span ref={yearRef}></span> Dhruv Portfolio. All rights reserved.
          </p>
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;