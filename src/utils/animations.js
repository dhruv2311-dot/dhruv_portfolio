import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export const setupScrollAnimation = () => {
  const lenis = new Lenis({
    duration: 0.8, // Reduced from 1.2 for faster scrolling
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.2, // Increased from 1 for more responsive scrolling
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Header scroll effect
  const header = document.querySelector('header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: 'header' },
      onUpdate: (self) => {
        const scrolled = self.isActive;
        gsap.to(header, {
          background: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'rgba(5, 5, 5, 0)',
          backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
          duration: 0.2 // Reduced from 0.3
        });
      }
    });
  }

  // Optimize section animations
  document.querySelectorAll('section').forEach((section) => {
    const hiddenElements = section.querySelectorAll('.hidden');
    if (hiddenElements.length) {
      ScrollTrigger.batch(hiddenElements, {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.1, // Reduced from 0.15
            duration: 0.6, // Reduced from 0.8
            ease: 'power2.out' // Changed from power3.out for smoother animation
          });
        },
        start: 'top 85%', // Changed from 80% to trigger earlier
        once: true // Add this to ensure animations only play once
      });
    }
  });

  // Optimize mouse move parallax
  let timeout;
  const handleMouseMove = (e) => {
    if (timeout) return;
    timeout = setTimeout(() => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      gsap.to('.blob-decoration', {
        x: (i) => moveX * (i + 1) * 0.5,
        y: (i) => moveY * (i + 1) * 0.5,
        duration: 0.8, // Reduced from 1
        ease: 'power1.out' // Changed from power2.out
      });
      timeout = null;
    }, 16); // Throttle to ~60fps
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (timeout) clearTimeout(timeout);
    lenis.destroy();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
};