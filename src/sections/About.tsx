import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { User, Code, Hash, Rocket } from 'lucide-react';
import Profile from '../assets/dhruv1.jpg'; // Adjust the path as necessary
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!titleRef.current || !contentRef.current || !imageRef.current) return;
    
    // Split text for animation
    const splitTitle = new SplitType(titleRef.current, { types: 'chars' });
    
    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
    
    // Title animation
    tl.from(splitTitle.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: "back.out(1.7)"
    });
    
    // Line animation
    tl.from(".title-line", {
      scaleX: 0,
      duration: 1,
      transformOrigin: "left",
    }, "-=0.4");
    
    // Content animation
    tl.from(contentRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.6");
    
    // Image animation
    tl.from(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=1");
    
    // Bio icons animation
    tl.from(".bio-icon", {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.8");
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          About Me
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Profile image */}
          <div ref={imageRef} className="order-2 md:order-1">
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
              {/* Main circular image */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--color-secondary)] p-2">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={Profile} 
                    alt="Developer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Animated ring */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-[var(--color-primary)] border-dashed animate-spin-slow opacity-70"></div>
              
              {/* Bio icons */}
              <div className="bio-icon absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[var(--color-primary)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                <User className="text-white" size={24} />
              </div>
              
              <div className="bio-icon absolute top-1/2 -right-5 transform -translate-y-1/2 bg-[var(--color-secondary)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-secondary)]/30">
                <Code className="text-white" size={24} />
              </div>
              
              <div className="bio-icon absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-[var(--color-accent)] w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/30">
                <Hash className="text-white" size={24} />
              </div>
              
              <div className="bio-icon absolute top-1/2 -left-5 transform -translate-y-1/2 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <Rocket className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div ref={contentRef} className="order-1 md:order-2">
            <p className="text-lg mb-6 leading-relaxed">
              I'm a passionate Full-Stack Developer with a strong foundation in both frontend and backend technologies. My journey in web development started with a curiosity about how things work on the internet, and it has evolved into a professional pursuit of creating elegant, efficient, and user-friendly applications.
            </p>
            
            <p className="text-lg mb-6 leading-relaxed">
              My technical interests include:
            </p>
            
            <ul className="list-disc list-inside mb-6 space-y-2 text-lg">
              <li className="pl-2">Building scalable web applications</li>
              <li className="pl-2">Creating intuitive user interfaces</li>
              <li className="pl-2">Optimizing application performance</li>
              <li className="pl-2">Learning new technologies and frameworks</li>
            </ul>
            
            <p className="text-lg mb-8 leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical blog posts.
            </p>
            
            <button className="btn magnetic-hover">Download Resume</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;