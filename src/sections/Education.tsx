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
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    location: "Stanford, CA",
    startDate: "Sept 2020",
    endDate: "May 2022",
    highlights: [
      "Specialized in Human-Computer Interaction and Artificial Intelligence",
      "Published research on interactive visualization techniques",
      "Teaching Assistant for Web Application Development course",
      "Graduated with honors (GPA: 3.9/4.0)"
    ]
  },
  {
    id: 2,
    degree: "Bachelor of Science in Software Engineering",
    institution: "MIT",
    location: "Cambridge, MA",
    startDate: "Sept 2016",
    endDate: "May 2020",
    highlights: [
      "Focused on full-stack development and system architecture",
      "Led team project creating a campus resource allocation app",
      "Participated in hackathons and coding competitions",
      "Dean's List for all semesters"
    ]
  },
  {
    id: 3,
    degree: "Web Development Bootcamp",
    institution: "App Academy",
    location: "San Francisco, CA",
    startDate: "Jan 2016",
    endDate: "Apr 2016",
    highlights: [
      "Intensive 12-week full-stack development program",
      "Built 5 full-stack applications from scratch",
      "Learned modern JavaScript frameworks and deployment techniques",
      "Selected as peer mentor for subsequent cohort"
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
                  
                  <div className="flex items-center gap-2 mb-1 text-gray-300 flex-wrap md:justify-end">
                    <BookOpen size={16} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.institution}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm flex-wrap md:justify-end">
                    <MapPin size={14} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm flex-wrap md:justify-end">
                    <Calendar size={14} className={index % 2 === 0 ? 'md:order-2' : ''} />
                    <span className={index % 2 === 0 ? 'md:order-1' : ''}>{item.startDate} - {item.endDate}</span>
                  </div>
                  
                  <div className={`space-y-2 text-sm md:text-base ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    {item.highlights.map((highlight, i) => (
                      <p key={i} className="text-gray-300">{highlight}</p>
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