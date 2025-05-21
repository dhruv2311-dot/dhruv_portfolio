import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Code, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const header = headerRef.current;
    
    if (!header) return;

    // Header animation on load
    gsap.from(header, {
      y: -100,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power3.out"
    });
    
    // Header scroll animation
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    // Mobile menu animation
    if (!menuRef.current) return;
    
    if (isMenuOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power3.out"
      });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: "power3.in"
      });
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMenuOpen(false);
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <header 
      ref={headerRef} 
      className="fixed top-0 left-0 w-full z-40 transition-all duration-300"
      style={{
        background: 'rgba(5, 5, 5, 0)',
        backdropFilter: 'blur(0px)',
        boxShadow: 'none'
      }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-3xl font-bold magnetic-hover flex items-center gap-2">
          <Code className="text-[var(--color-secondary)]" />
          <span>Dev<span className="text-[var(--color-secondary)]">Portfolio</span></span>
        </a>
        
        <nav className="hidden md:flex gap-8">
          {['home', 'about', 'skills', 'projects', 'certificates', 'education', 'contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)} 
              className="uppercase text-sm tracking-wider hover:text-[var(--color-secondary)] transition-colors magnetic-hover"
            >
              {item}
            </button>
          ))}
        </nav>
        
        <button 
          className="md:hidden magnetic-hover"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        ref={menuRef} 
        className="fixed top-0 right-0 w-full h-screen bg-[var(--color-background)] transform translate-x-full z-50 md:hidden"
      >
        <div className="p-6 flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} className="magnetic-hover">
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[80%] gap-8">
          {['home', 'about', 'skills', 'projects', 'certificates', 'education', 'contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)} 
              className="text-2xl tracking-wider hover:text-[var(--color-secondary)] transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;