import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Award, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  id: number;
  title: string;
  organization: string;
  date: string;
  description: string;
  skills: string[];
  image: string;
  certificateUrl: string;
}

// Mock certificate data
const certificatesData: Certificate[] = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    organization: "Udacity",
    date: "June 2023",
    description: "Comprehensive program covering modern full-stack development with JavaScript, React, Node.js, and database technologies.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    image: "https://images.pexels.com/photos/5553050/pexels-photo-5553050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    certificateUrl: "https://example.com/certificate1"
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    organization: "Coursera",
    date: "March 2023",
    description: "Focused on user-centered design principles, wireframing, prototyping, and usability testing.",
    skills: ["Figma", "Wireframing", "User Research", "Prototyping"],
    image: "https://images.pexels.com/photos/5939401/pexels-photo-5939401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    certificateUrl: "https://example.com/certificate2"
  },
  {
    id: 3,
    title: "Advanced React & Redux",
    organization: "Udemy",
    date: "January 2023",
    description: "Deep dive into advanced React patterns, Redux state management, and performance optimization techniques.",
    skills: ["React", "Redux", "Performance", "Testing"],
    image: "https://images.pexels.com/photos/1181290/pexels-photo-1181290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    certificateUrl: "https://example.com/certificate3"
  },
  {
    id: 4,
    title: "AWS Certified Developer",
    organization: "Amazon Web Services",
    date: "November 2022",
    description: "Certification for designing, developing and deploying cloud-based solutions using AWS services.",
    skills: ["AWS", "Lambda", "S3", "DynamoDB"],
    image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    certificateUrl: "https://example.com/certificate4"
  }
];

const Certificates = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!titleRef.current || !certificatesRef.current) return;
    
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
    
    // Certificate cards animation
    tl.from(".certificate-card", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.6");
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  return (
    <section ref={sectionRef} id="certificates" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          Certificates
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        {/* Certificates grid */}
        <div ref={certificatesRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificatesData.map(certificate => (
            <div key={certificate.id} className="certificate-card group">
              <div className="relative bg-[var(--color-surface)] rounded-xl overflow-hidden border border-gray-700 hover:border-[var(--color-secondary)] transition-all duration-300 h-full">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Certificate image */}
                  <div className="md:w-1/3 h-40 md:h-auto relative overflow-hidden">
                    <img 
                      src={certificate.image} 
                      alt={certificate.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-2 left-2 bg-[var(--color-primary)] rounded-full p-2">
                      <Award className="text-white" size={20} />
                    </div>
                  </div>
                  
                  {/* Certificate details */}
                  <div className="p-6 md:w-2/3">
                    <div className="mb-1 text-sm text-gray-400">
                      {certificate.organization} • {certificate.date}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-secondary)]">{certificate.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{certificate.description}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {certificate.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs py-1 px-2 rounded-full bg-[var(--color-primary)]/30 text-[var(--color-secondary)] backdrop-blur-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* View Certificate Button */}
                    <a
                      href={certificate.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[var(--color-secondary)] hover:underline magnetic-hover"
                    >
                      <ExternalLink size={16} />
                      View Certificate
                    </a>
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

export default Certificates;