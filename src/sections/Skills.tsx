// import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import SplitType from 'split-type';

// gsap.registerPlugin(ScrollTrigger);

// interface Skill {
//   category: string;
//   name: string;
//   level: number;
//   icon: JSX.Element;
// }

// // Mock skill data
// const skillsData: Skill[] = [
//   // Frontend
//   { 
//     category: 'frontend',
//     name: 'HTML/CSS', 
//     level: 90,
//     icon: <div className="text-[#e34c26] text-xl font-bold">HTML</div>
//   },
//   { 
//     category: 'frontend',
//     name: 'JavaScript', 
//     level: 90,
//     icon: <div className="text-[#f0db4f] text-xl font-bold">JS</div>
//   },
//   { 
//     category: 'frontend',
//     name: 'React', 
//     level: 90,
//     icon: <div className="text-[#61dafb] text-xl font-bold">⚛</div>
//   },
//   { 
//     category: 'frontend',
//     name: 'Angular.js',
//     level: 75,
//     icon: <div className="text-[#007acc] text-xl font-bold">AJ</div>
//   },
  
//   // Backend
//   { 
//     category: 'backend',
//     name: 'Node.js', 
//     level: 85,
//     icon: <div className="text-[#68a063] text-xl font-bold">Node</div>
//   },
//   { 
//     category: 'backend',
//     name: 'Express', 
//     level: 85,
//     icon: <div className="text-[#828282] text-xl font-bold">Ex</div>
//   },
//   { 
//     category: 'backend',
//     name: 'MongoDB', 
//     level: 80,
//     icon: <div className="text-[#4DB33D] text-xl font-bold">DB</div>
//   },
//   { 
//     category: 'backend',
//     name: 'Redis',
//     level: 80,
//     icon: <div className="text-[#D82C20] text-xl font-bold">R</div>
    
//   },
  
//   // Tools
//   { 
//     category: 'tools',
//     name: 'Git', 
//     level: 90,
//     icon: <div className="text-[#F05032] text-xl font-bold">Git</div>
//   },
//   { 
//     category: 'tools',
//     name: 'Docker', 
//     level: 70,
//     icon: <div className="text-[#2496ED] text-xl font-bold">🐳</div>
//   },
//   { 
//     category: 'tools',
//     name: 'Figma', 
//     level: 75,
//     icon: <div className="text-[#F24E1E] text-xl font-bold">Fig</div>
//   },
//   { 
//     category: 'tools',
//     name: 'Postman',
//     level: 80,
//     icon: <div className="text-[#FF6C37] text-xl font-bold">P</div>
//   },
//   {
//     category:'Problem Solving',
//     name: 'c++/DSA',
//     level: 80,
//     icon: <div className="text-[#F24E1E] text-xl font-bold">DSA</div>
//   }
// ];

// const Skills = () => {
//   const sectionRef = useRef<HTMLElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const skillsRef = useRef<HTMLDivElement>(null);
//   const circleRef = useRef<HTMLDivElement>(null);
  
//   useEffect(() => {
//     if (!titleRef.current || !skillsRef.current || !circleRef.current) return;
    
//     // Split text for animation
//     const splitTitle = new SplitType(titleRef.current, { types: 'chars' });
    
//     // Create animation timeline
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: sectionRef.current,
//         start: "top 70%",
//         end: "bottom 20%",
//         toggleActions: "play none none reverse"
//       }
//     });
    
//     // Title animation
//     tl.from(splitTitle.chars, {
//       opacity: 0,
//       y: 100,
//       rotateX: -90,
//       stagger: 0.02,
//       duration: 0.8,
//       ease: "back.out(1.7)"
//     });
    
//     // Line animation
//     tl.from(".title-line", {
//       scaleX: 0,
//       duration: 1,
//       transformOrigin: "left",
//     }, "-=0.4");
    
//     // Skill bars animation
//     const skillBars = document.querySelectorAll('.skill-progress-bar');
//     tl.fromTo(skillBars, 
//       { width: 0 },
//       { 
//         width: "var(--progress)",
//         duration: 1.5,
//         stagger: 0.1,
//         ease: "power2.out"
//       }, 
//       "-=0.6"
//     );
    
//     // Rotating icons animation
//     gsap.to(".rotating-skills .skill-icon", {
//       rotation: (i) => i % 2 ? 360 : -360,
//       duration: 20,
//       repeat: -1,
//       ease: "none"
//     });
    
//     return () => {
//       if (splitTitle && splitTitle.revert) splitTitle.revert();
//     };
//   }, []);
  
//   return (
//     <section ref={sectionRef} id="skills" className="relative overflow-hidden py-20">
//       <div className="blob-decoration blob-1"></div>
//       <div className="blob-decoration blob-2"></div>
      
//       <div className="container mx-auto px-6">
//         <h2 ref={titleRef} className="section-title">
//           Technical Skills
//         </h2>
//         <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
//           {/* Skill bars */}
//           <div ref={skillsRef}>
//             <h3 className="text-2xl font-bold mb-8 text-[var(--color-secondary)]">Expertise</h3>
            
//             <div className="space-y-6">
//               {skillsData.map((skill, index) => (
//                 <div key={index} className="skill-item">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-medium text-lg">{skill.name}</span>
//                     <span className="text-[var(--color-secondary)]">{skill.level}%</span>
//                   </div>
//                   <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
//                     <div 
//                       className="skill-progress-bar h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
//                       style={{ 
//                         "--progress": `${skill.level}%` 
//                       } as React.CSSProperties}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Rotating skill icons */}
//           <div ref={circleRef} className="flex justify-center">
//             <div className="rotating-skills relative w-64 h-64 md:w-80 md:h-80">
//               {/* Center circle */}
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
//                 <div className="text-lg font-bold">Skills</div>
//               </div>
              
//               {/* Border */}
//               <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-[var(--color-primary)] opacity-20"></div>
              
//               {/* Skill icons positioned in a circle */}
//               {skillsData.map((skill, index) => {
//                 const angle = (index * (360 / skillsData.length)) * (Math.PI / 180);
//                 const radius = 120; // Distance from center
//                 const x = Math.cos(angle) * radius;
//                 const y = Math.sin(angle) * radius;
                
//                 return (
//                   <div 
//                     key={index}
//                     className="skill-icon absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center border-2 border-[var(--color-secondary)] z-10"
//                     style={{
//                       left: `calc(50% + ${x}px)`,
//                       top: `calc(50% + ${y}px)`,
//                     }}
//                   >
//                     {skill.icon}
//                   </div>
//                 );
//               })}
              
//               {/* Connection lines */}
//               <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
//                 <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(138, 43, 226, 0.2)" strokeWidth="0.5" />
//                 <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 255, 255, 0.2)" strokeWidth="0.5" />
//                 <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255, 62, 107, 0.2)" strokeWidth="0.5" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Skills;
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// Mock skill data
const skillsData = [
  // Frontend
  { 
    category: 'frontend',
    name: 'HTML/CSS',
    icon: <div className="text-[#e34c26] text-xl font-bold">HTML</div>
  },
  { 
    category: 'frontend',
    name: 'JavaScript',
    icon: <div className="text-[#f0db4f] text-xl font-bold">JS</div>
  },
  { 
    category: 'frontend',
    name: 'React',
    icon: <div className="text-[#61dafb] text-xl font-bold">⚛</div>
  },
  { 
    category: 'frontend',
    name: 'TypeScript',
    icon: <div className="text-[#007acc] text-xl font-bold">TS</div>
  },
  { 
    category: 'frontend',
    name: 'Angular.js',
    icon: <div className="text-[#007acc] text-xl font-bold">AJ</div>
  },
  
  // Backend
  { 
    category: 'backend',
    name: 'Node.js',
    icon: <div className="text-[#68a063] text-xl font-bold">Node</div>
  },
  { 
    category: 'backend',
    name: 'Express',
    icon: <div className="text-[#828282] text-xl font-bold">Ex</div>
  },
  { 
    category: 'backend',
    name: 'MongoDB',
    icon: <div className="text-[#4DB33D] text-xl font-bold">DB</div>
  },
  { 
    category: 'backend',
    name: 'SQL',
    icon: <div className="text-[#F29111] text-xl font-bold">SQL</div>
  },
  { 
    category: 'backend',
    name: 'Redis',
    icon: <div className="text-[#F29111] text-xl font-bold">Redis</div>
  },
  
  // Tools
  { 
    category: 'tools',
    name: 'Git',
    icon: <div className="text-[#F05032] text-xl font-bold">Git</div>
  },
  { 
    category: 'tools',
    name: 'Docker',
    icon: <div className="text-[#2496ED] text-xl font-bold">🐳</div>
  },
  { 
    category: 'tools',
    name: 'Figma',
    icon: <div className="text-[#F24E1E] text-xl font-bold">Fig</div>
  },
  { 
    category: 'tools',
    name: 'Postman',
    icon: <div className="text-[#FF9900] text-xl font-bold">P</div>
  },
  { 
    category: 'Problem Solving',
    name: 'c/c++/DSA',
    icon: <div className="text-[#FF9900] text-xl font-bold">DSA</div>
  }
];

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const skillsRef = useRef(null);
  const circleRef = useRef(null);
  
  useEffect(() => {
    if (!titleRef.current || !skillsRef.current || !circleRef.current) return;
    
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
    
    // Skills animation
    tl.from(".skill-item", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.6");
    
    // Bio icons animation
    tl.from(".bio-icon", {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.8");
    
    // Rotating icons animation
    gsap.to(".rotating-skills .skill-icon", {
      rotation: (i) => i % 2 ? 360 : -360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          Technical Skills
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Skills list */}
          <div ref={skillsRef}>
            <h3 className="text-2xl font-bold mb-8 text-[var(--color-secondary)]">Technologies</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {skillsData.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-gray-700 hover:border-[var(--color-secondary)] transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                        {skill.icon}
                      </div>
                      <span className="font-medium text-sm md:text-base">{skill.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rotating skill icons */}
          <div ref={circleRef} className="flex justify-center">
            <div className="rotating-skills relative w-64 h-64 md:w-80 md:h-80">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                <div className="text-lg font-bold">Skills</div>
              </div>
              
              {/* Border */}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-[var(--color-primary)] opacity-20"></div>
              
              {/* Skill icons positioned in a circle */}
              {skillsData.map((skill, index) => {
                const angle = (index * (360 / skillsData.length)) * (Math.PI / 180);
                const radius = 120; // Distance from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div 
                    key={index}
                    className="skill-icon absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center border-2 border-[var(--color-secondary)] z-10"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    {skill.icon}
                  </div>
                );
              })}
              
              {/* Connection lines */}
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(138, 43, 226, 0.2)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 255, 255, 0.2)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255, 62, 107, 0.2)" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;