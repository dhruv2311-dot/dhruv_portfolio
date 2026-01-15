import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { GraduationCap, BookOpen, Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

// Mock education data
const educationData: Education[] = [
  {
  id: 1,
  degree: "Computer Science",
  institution: "Rai University",
  location: "Dholka, Ahmedabad, India",
  startDate: "Aug 2024",
  endDate: "Aug 2028",
  highlights: [
    "Strong foundation in both Frontend and Backend Web Development",
    "Proficient in full-stack development with hands-on experience in HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB",
    "Skilled in basic problem solving, UI/UX design, and database management",
    "Secured 9.62 CGPA in the first semester",
    "Actively learning advanced web technologies and software engineering principles"
  ]
},
// 12th Grade Object
{
  id: 2,
  degree: "Higher Secondary Education (Science)",
  institution: "Vivekanand Science Academy",
  location: "Halvad, Dhrangadhra, India",
  startDate: "Jun 2022",
  endDate: "Mar 2024",
  highlights: [
    "Completed 12th grade with Science stream focusing on Physics, Chemistry, and Mathematics",
    "Achieved 75.66% and secured a 72 percentile in board examinations",
    "Built a strong academic foundation for engineering and computer science",
    "Participated in various science fairs and school tech activities"
  ]
},

// 10th Grade Object
{
  id: 3,
  degree: "Secondary School Certificate (SSC)",
  institution: "Sunrise Smart School",
  location: "Dhrangadhra, Surendranagar, India",
  startDate: "Jun 2021",
  endDate: "Mar 2022",
  highlights: [
    "Achieved outstanding academic results with 91% and 98.66 percentile",
    "Awarded A1 grade for exceptional performance in all subjects",
    "Demonstrated strong aptitude in Mathematics and Science",
    "Recognized for discipline and consistent academic excellence"
  ]
}

];

const Education = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!titleRef.current || !timelineRef.current) return;
    
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
    
    // Timeline animation
    tl.from(".timeline-icon", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.6");
    
    tl.from(".timeline-line", {
      height: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.4");
    
    tl.from(".education-card", {
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.8");
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  return (
    <section ref={sectionRef} id="education" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          Education
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          <div className="timeline-line absolute left-0 md:left-1/2 transform md:translate-x-[-50%] w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
          
          {educationData.map((item, index) => (
            <div key={item.id} className="relative flex flex-col md:flex-row md:items-center mb-16 last:mb-0">
              {/* Timeline connector and icon */}
              <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] flex items-center justify-center">
                <div className="timeline-icon w-12 h-12 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-secondary)] flex items-center justify-center z-10">
                  <GraduationCap className="text-[var(--color-secondary)]" size={20} />
                </div>
              </div>
              
              {/* Education card - alternating sides on desktop */}
              <div className={`education-card ml-16 md:ml-0 md:w-1/2 ${
                index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'
              }`}>
                <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-gray-700 hover:border-[var(--color-secondary)] transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-secondary)]">{item.degree}</h3>
                  
                  <div className="flex items-center gap-2 mb-1 flex-wrap md:justify-end" style={{ color: 'var(--color-text-secondary)' }}>
                    <BookOpen size={16} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.institution}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1 text-sm flex-wrap md:justify-end" style={{ color: 'var(--color-text-muted)' }}>
                    <MapPin size={14} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm flex-wrap md:justify-end" style={{ color: 'var(--color-text-muted)' }}>
                    <Calendar size={14} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.startDate} - {item.endDate}</span>
                  </div>
                  
                  <div className={`space-y-2 text-sm md:text-base ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    {item.highlights.map((highlight, i) => (
                      <p key={i} style={{ color: 'var(--color-text-secondary)' }}>{highlight}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;