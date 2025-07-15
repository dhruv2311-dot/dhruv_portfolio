import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';
import SplitType from 'split-type';

const Hero = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const codeBlockRef = useRef(null);
  
  useEffect(() => {
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const codeBlock = codeBlockRef.current;
    
    if (!heading || !subtitle || !codeBlock) return;

    // Initialize SplitType
    const splitHeading = new SplitType(heading, { types: 'chars, words' });
    const splitSubtitle = new SplitType(subtitle, { types: 'words' });
    
    // Create GSAP timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Reset initial states
    gsap.set(splitHeading.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
    });
    
    gsap.set(splitSubtitle.words, {
      opacity: 0,
      y: 50,
      rotateY: 45,
    });
    
    // Heading animation
    tl.to(splitHeading.chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      stagger: 0.04,
      ease: "back.out(1.7)"
    });
    
    // Subtitle animation
    tl.to(splitSubtitle.words, {
      opacity: 1,
      y: 0,
      rotateY: 0,
      duration: 0.8,
      stagger: 0.1,
    }, "-=0.5");
    
    // CTA animation
    tl.from(ctaRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scale: 0.8
    }, "-=0.3");

    // Code block typing effect
    const codeText = codeBlock.innerHTML;
    codeBlock.innerHTML = '';
    let currentText = '';
    
    for (let i = 0; i < codeText.length; i++) {
      currentText += codeText[i];
      tl.add(() => {
        if (Math.random() > 0.9) {
          const glitchText = currentText + generateRandomChars(5);
          setTimeout(() => {
            codeBlock.innerHTML = currentText;
          }, 50);
          codeBlock.innerHTML = glitchText;
        } else {
          codeBlock.innerHTML = currentText;
        }
      }, i * 0.03);
    }
    
    // Floating animation for code block
    gsap.to(codeBlock.parentElement, {
      y: -20,
      rotation: 3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
    
    return () => {
      if (splitHeading.revert) splitHeading.revert();
      if (splitSubtitle.revert) splitSubtitle.revert();
    };
  }, []);
  
  const generateRandomChars = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
    return Array(length).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  return (
    <section ref={sectionRef} id="home" className="h-screen overflow-hidden flex items-center justify-center relative">
      <div className="container z-10 px-6 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 
              ref={headingRef} 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Hi, I'm <span className="text-[var(--color-secondary)]">Dhruv Sonagra</span>
              <br />
              Full-Stack Developer
            </h1>
            
            <p 
              ref={subtitleRef} 
              className="text-xl md:text-2xl mb-8 text-gray-300"
            >
              Building scalable and user-friendly applications with modern technologies
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={scrollToProjects} className="btn magnetic-hover">View Projects</button>
              <button className="btn magnetic-hover" onClick={scrollToAbout}>
                About Me
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-transparent opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-l from-[var(--color-secondary)] to-transparent opacity-20 blur-3xl"></div>
              <div className="backdrop-blur-sm bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] p-8 rounded-2xl shadow-2xl transform rotate-3">
                <pre className="text-sm md:text-base overflow-hidden">
                  <code ref={codeBlockRef} className="text-[var(--color-text)]">
                    <span className="text-[var(--color-secondary)]">const</span> <span className="text-[var(--color-accent)]">developer</span> = {'{'}
                    <br />  <span className="text-green-400">skills</span>: [<span className="text-orange-300">'React'</span>, <span className="text-orange-300">'Node'</span>, <span className="text-orange-300">'UI/UX'</span>],
                    <br />  <span className="text-green-400">passion</span>: <span className="text-orange-300">'Creating amazing web experiences'</span>,
                    <br />  <span className="text-green-400">available</span>: <span className="text-blue-400">true</span>
                    <br />{'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={scrollToAbout} className="magnetic-hover">
          <ArrowDown className="text-[var(--color-secondary)]" size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
// import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ArrowDown } from 'lucide-react';
// import SplitType from 'split-type';
// import PropTypes from 'prop-types';

// const Hero = () => {
//   const sectionRef = useRef(null);
//   const headingRef = useRef(null);
//   const subtitleRef = useRef(null);
//   const ctaRef = useRef(null);
//   const codeBlockRef = useRef(null);
//   const layersRef = useRef([]);
  
//   useEffect(() => {
//     const heading = headingRef.current;
//     const subtitle = subtitleRef.current;
//     const codeBlock = codeBlockRef.current;
    
//     if (!heading || !subtitle || !codeBlock) return;

//     // Initialize SplitText
//     const splitHeading = new SplitType(heading, { types: 'chars' });
//     const splitSubtitle = new SplitType(subtitle, { types: 'lines' });
    
//     // Create GSAP timeline with faster animations
//     const tl = gsap.timeline({ defaults: { duration: 0.4 } });
    
//     // Faster heading animation
//     tl.from(splitHeading.chars, {
//       opacity: 0,
//       y: 20,
//       duration: 0.3,
//       stagger: 0.01,
//       ease: "power2.out"
//     });
    
//     // Faster subtitle animation
//     tl.from(splitSubtitle.lines, {
//       opacity: 0,
//       y: 20,
//       stagger: 0.05,
//       duration: 0.3,
//     }, "-=0.2");
    
//     // Faster CTA animation
//     tl.from(ctaRef.current, {
//       opacity: 0,
//       y: 20,
//       duration: 0.3
//     }, "-=0.1");

//     // Code block typing effect
//     const codeText = codeBlock.innerHTML;
//     codeBlock.innerHTML = '';
//     let currentText = '';
    
//     for (let i = 0; i < codeText.length; i++) {
//       currentText += codeText[i];
//       tl.set(codeBlock, { innerHTML: currentText }, i * 0.01);
//     }
    
//     // Floating animation for code block
//     gsap.to(codeBlock.parentElement, {
//       y: -20,
//       rotation: 3,
//       duration: 2,
//       repeat: -1,
//       yoyo: true,
//       ease: "power1.inOut"
//     });
    
//     // Matrix rain effect with optimized performance
//     const canvas = document.createElement('canvas');
//     canvas.style.position = 'absolute';
//     canvas.style.top = '0';
//     canvas.style.left = '0';
//     canvas.style.width = '100%';
//     canvas.style.height = '100%';
//     canvas.style.opacity = '0.1';
//     canvas.style.pointerEvents = 'none';
//     sectionRef.current.appendChild(canvas);
    
//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
    
//     const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
//     const fontSize = 16;
//     const columns = canvas.width / fontSize;
//     const drops = Array(Math.floor(columns)).fill(1);
    
//     let animationFrameId;
//     const drawMatrix = () => {
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
//       ctx.fillStyle = '#0F0';
//       ctx.font = `${fontSize}px monospace`;
      
//       for (let i = 0; i < drops.length; i++) {
//         const text = chars[Math.floor(Math.random() * chars.length)];
//         ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
//         if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
//           drops[i] = 0;
//         }
//         drops[i]++;
//       }
//       animationFrameId = requestAnimationFrame(drawMatrix);
//     };
    
//     drawMatrix();
    
//     // Cleanup
//     return () => {
//       if (splitHeading && splitHeading.revert) splitHeading.revert();
//       if (splitSubtitle && splitSubtitle.revert) splitSubtitle.revert();
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//     };
//   }, []);
  
//   const addToLayersRef = (el) => {
//     if (el && !layersRef.current.includes(el)) {
//       layersRef.current.push(el);
//     }
//   };
  
//   const scrollToAbout = () => {
//     const aboutSection = document.getElementById('about');
//     if (aboutSection) {
//       gsap.to(window, {
//         duration: 0.8,
//         scrollTo: { y: aboutSection, offsetY: 50 },
//         ease: "power2.inOut"
//       });
//     }
//   };
//   const scroolToProjects = () =>{
//     const projectsection = document.getElementById('projects')
//     if(projectsection){
//       gsap.to(window, {
//         duration: 0.8,
//         scrollTo: { y: aboutSection, offsetY: 50 },
//         ease: "power2.inOut"
//       });
//     }
//   }
  
//   return (
//     <section ref={sectionRef} id="home" className="h-screen overflow-hidden flex items-center justify-center relative">
//       <div className="blob-decoration blob-1" ref={addToLayersRef}></div>
//       <div className="blob-decoration blob-2" ref={addToLayersRef}></div>
      
//       <div className="container z-10 px-6 text-center md:text-left">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//           <div>
//             <h1 
//               ref={headingRef} 
//               className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
//             >
//               Hi, I'm <span className="text-[var(--color-secondary)]">Dhruv Sonagra</span>
//               <br />
//               Full-Stack <br /> Developer
//             </h1>
            
//             <p 
//               ref={subtitleRef} 
//               className="text-xl md:text-2xl mb-8 text-gray-300"
//             >
//               Building scalable and user-friendly applications with modern technologies
//             </p>
            
//             <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
//               <button onClick={scrollToAbout} className="btn magnetic-hover">View Projects</button>
//               <button className="btn magnetic-hover" onClick={scrollToAbout}>
//                 About Me
//               </button>
//             </div>
//           </div>
          
//           <div 
//             className="hidden md:block"
//             ref={addToLayersRef}
//           >
//             <div className="relative">
//               <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-transparent opacity-20 blur-3xl"></div>
//               <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-l from-[var(--color-secondary)] to-transparent opacity-20 blur-3xl"></div>
//               <div className="backdrop-blur-sm bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] p-8 rounded-2xl shadow-2xl transform rotate-3">
//                 <pre className="text-sm md:text-base overflow-hidden">
//                   <code ref={codeBlockRef} className="text-[var(--color-text)]">
//                     <span className="text-[var(--color-secondary)]">const</span> <span className="text-[var(--color-accent)]">developer</span> = {'{'}
//                     <br />  <span className="text-green-400">skills</span>: [<span className="text-orange-300">'React'</span>, <span className="text-orange-300">'Node'</span>, <span className="text-orange-300">'UI/UX'</span>],
//                     <br />  <span className="text-green-400">passion</span>: <span className="text-orange-300">'Creating amazing web experiences'</span>,
//                     <br />  <span className="text-green-400">available</span>: <span className="text-blue-400">true</span>
//                     <br />{'}'}
//                   </code>
//                 </pre>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <button onClick={scrollToAbout} className="magnetic-hover">
//           <ArrowDown className="text-[var(--color-secondary)]" size={32} />
//         </button>
//       </div>
//     </section>
//   );
// };

// Hero.propTypes = {};

// export default Hero;