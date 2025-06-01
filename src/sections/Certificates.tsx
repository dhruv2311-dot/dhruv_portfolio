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
    title: "Hackathon 2025",
    organization: "OdooXGujarat Vidhyapith",
    date: "april 2025",
    description: "Participated in a hackathon organized by OdooXGujarat Vidhyapith, showcasing skills in full-stack development.",
    skills: ["Full Stack Development", "Teamwork", "Problem Solving"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747941112/IMG_6329_o5hsbv.jpg",
    certificateUrl: "https://www.linkedin.com/posts/dhruvvv23_hackathonjourney-innovation-sustainablefarming-activity-7311297836082438145-4Ws0?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFFbQIEBNyvXKq2e2we3ieNXl2L1zznWXvo"
  },
  {
    id: 2,
    title: "Tech Expo 2025",
    organization: "Rai University",
    date: "February 2025",
    description: "Participated in a tech expo organized by Rai University, showcasing skills in frontend development.",
    skills: ["Frontend Development", "Teamwork", "Problem Solving"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747941112/IMG_5893_efxrm2.jpg",
    certificateUrl: "https://www.linkedin.com/posts/dhruvvv23_techexpo-cse-eventura-activity-7302664635332050944-pF9H?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFFbQIEBNyvXKq2e2we3ieNXl2L1zznWXvo"
  },
  {
    id: 3,
    title: "Microsoft PowerBi and Fundamentals",
    organization: "Rai University",
    date:"April 2025",
    description: "Completed a comprehensive program on Microsoft PowerBi and fundamentals, enhancing data visualization and analysis skills.",
    skills: ["PowerBi", "Data Visualization", "Data Analysis"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1748803319/DHRUV_SONAGRA-1_page-0001_q383yt.jpg",
    certificateUrl: "https://www.linkedin.com/posts/dhruvvv23_microsoftpowerbi-dataanalysis-activity-7302664635332050944-pF9H?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFFbQIEBNyvXKq2e2we3ieNXl2L1zznWXvo"
  },
  {
    id: 4,
    title: "Azure Fundamentals",
    organization: "Rai University",
    date: "April 2025",
    description: "Completed a comprehensive program on Azure Fundamentals, enhancing cloud computing skills.",
    skills: ["Azure", "Cloud Computing", "Data Management"],
   
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1748803319/DHRUV_SONAGRA_page-0001_yfs115.jpg",
    certificateUrl: "https://simpli-web.app.link/e/pMTJ2cIiATb"
  },
  {
    id: 5,
    title: "Introduction to the Basics of Azure Services",
    organization: "Simplilearn",
    date: "May 2025",
    description: "Comprehensive program covering modern full-stack development with JavaScript, React, Node.js, and database technologies.",
    skills: ["JavaScript", "Node.js", "MongoDB"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747940426/8374205_87113191747897516884_page-0001_rtjmn1.jpg",
    certificateUrl: "https://simpli-web.app.link/e/pMTJ2cIiATb"
  },
  {
    id: 6,
    title: "Node.js(Basic)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Comprehensive program covering modern full-stack development with JavaScript, React, Node.js, and database technologies.",
    skills: ["JavaScript", "Node.js", "MongoDB"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747812857/nodejs_basic_certificate_page-0001_swygmm.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/edf3c23f04f1"
  },
  {
    id: 7,
    title: "React(Basic)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Focused on user-centered design principles, wireframing, prototyping, and usability testing.",
    skills: ["React", "JavaScript"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747812859/react_basic_certificate_page-0001_ebuadr.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/29f04f97089f"
  },
  {
    id: 8,
    title: "Javascript (Basic)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Deep dive into advanced React patterns, Redux state management, and performance optimization techniques.",
    skills: ["javascript"],
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747812945/javascript_basic_certificate_page-0001_ri3xhc.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/a3b280e1ad5b"
  },
  {
    id: 9,
    title: "Problem Solving (Basic)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Introduction to problem-solving techniques, algorithms, and data structures.",
    skills: ["Algorithms", "Data Structures"],
    
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747813135/problem_solving_basic_certificate_page-0001_bpwwbx.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/62a8fed5cb66"
  },
  {
    id: 10,
    title: "Frontend Development (Basic)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Introduction to frontend development, covering HTML, CSS, and JavaScript basics.",
    skills: ["Node.js", "React", "JavaScript"],
    
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747813135/frontend_developer_react_certificate_page-0001_x9yc1m.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/6f6e8a824ad7"
  },
  
  {
    id: 11,
    title: "Github Copilot Fundamentals",
    organization: "simplileran",
    date: "May 2025",
    description: "Introduction to GitHub Copilot, covering its features, usage, and best practices.",
    skills: ["GitHub", "Copilot"],
   
    
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747854428/Screenshot_2025-05-22_003626_bgbeec.png",
    certificateUrl: "https://simpli-web.app.link/e/b81icFwByTb"
  },
  {
    id: 12,
    title: "Problem Solving (Intermediate)",
    organization: "Hackerrank",
    date: "May 2025",
    description: "Intermediate problem-solving techniques, focusing on algorithms and data structures.",
    skills: ["Algorithms", "Data Structures"],
    
    
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1748157142/problem_solving_intermediate_certificate_page-0001_h72tfw.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/598165441562"
  },
  {
    id: 13,
    title: "Javascript (Intermediate)",
    organization: "Hackerrank",
    date: "June 2025",
    description: "Intermediate JavaScript concepts, including ES6 features, asynchronous programming, and advanced functions.",
    skills: ["JavaScript", "ES6", "Asynchronous Programming"],

    
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1748763239/javascript_intermediate_certificate_page-0001_a3jxf3.jpg",
    certificateUrl: "https://www.hackerrank.com/certificates/e9dc1c182019"
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