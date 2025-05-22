import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Flip from 'gsap/Flip';
import SplitType from 'split-type';
import { ExternalLink, Github, FileText, Play, Volume2, VolumeX } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Flip);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string[];
  techStack?: string[];
  deploymentLink: string;
  githubLink: string;
  apiDocsLink?: string;
  demoVideoId: string;
  
}

// Mock project data
const projectsData: Project[] = [
  {
    id: 1,
    title: "Eventura",
    description: "Event management platform with real-time updates and interactive features.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1739943406/eventura_tuntzx.png",
    category: ["React", "MERN",],
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    deploymentLink: "https://eventura-23.netlify.app/",
    githubLink: "https://github.com/dhruv2311-dot/eventura-",
    apiDocsLink: "https://documenter.getpostman.com/view/39189509/2sAYX3s4Dc",
    demoVideoId: "12ZT1sU_Z6EKmnUcxC1f6Leg-DSP0OT5z",
    
  },
  {
    id: 2,
    title: "Farmtrust",
    description: "FarmTrust is a comprehensive platform for farmers, offering real-time updates, an AI chatbot for assistance, and a user-friendly interface. It connects farmers with buyers, ensuring efficient transactions and support.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747942311/Screenshot_2025-05-23_005646_qd6hzt.png",
    category: ["React","MERN"],
    techStack: ["React","Node.js","MongoDB","Express","Socket.io","Ai Chatbot","i18n","Authentication"],
    githubLink: "https://github.com/dhruv2311-dot/FarmTrust",
    apiDocsLink: "https://documenter.getpostman.com/view/39189509/2sAYX3s4Dc",

    deploymentLink: "https://farmtrust.netlify.app/"
  },
  {
    id:3,
    title: "Youtube",
    description: "A dynamic YouTube clone featuring real-time video updates, interactive UI, and seamless streaming. Built with React and Node.js, it integrates a custom YouTube API for personalized content delivery.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1740156747/Screenshot_2025-02-21_221308_uqsfq2.png",
    category: ["React","HTML/CSS"],
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    deploymentLink: "https://youtube-api-lomc.vercel.app/",
    githubLink: "https://github.com/dhruv2311-dot/Youtube-API",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id:4,
    title:"spotify",
    description: "A sleek Spotify clone built using React with a modular, component-based architecture. It offers seamless music playback, dynamic UI updates, and an interactive user experience. 🚀🎵",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1740156966/igvbvpgmgyzkbrthcdma.png",
    category: ["React","HTML/CSS"],
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    deploymentLink: "https://spotify-react-component.vercel.app/",
    githubLink: "https://github.com/dhruv2311-dot/spotify-react-component",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: 5,
    title: "Netflix",
    description: "A Netflix clone built with React, featuring a responsive design, smooth navigation, and dynamic content loading. It offers a seamless streaming experience with an intuitive user interface. 🎬✨",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1747942711/Screenshot_2025-05-23_010754_duojcu.png",
    category: ["React"],
    techStack: ["React", "Tailwind CSS"],
    deploymentLink: "https://netflix-u9ng.onrender.com/",
    githubLink: "https://github.com/dhruv2311-dot/netflix"},
  {
    id: 6,
    title: "Tic-Tac-Toe",
    description: "A classic Tic Tac Toe game developed using React, featuring a responsive UI, smooth gameplay, and dynamic state management for an engaging experience. 🎮✨",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1740157368/gtsplesiovqz4emqthn2.png",
    category: [ "React"],
    techStack: ["React", "Tailwind CSS"],
    deploymentLink: "https://tic-tac-toe-sandy-two.vercel.app/",
    githubLink: "https://github.com/dhruv2311-dot/Tic-Tac-Toe",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: 7,
    title: "Purple",
    description: "E-commerce platform with modern UI and seamless shopping experience.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1739943602/bgrat7sxisqwumu4x1vn.png",
    category: ["HTML/CSS", "React"],
    techStack: ["React", "Tailwind CSS"],
    deploymentLink: "https://purple21.netlify.app/",
    githubLink: "https://github.com/dhruv2311-dot/PURPLE",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: 8,
    title: "PharmEasy",
    description: "Online pharmacy platform with medicine delivery system.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1739943561/y4vnpuulvuibf86l0dj9.png",
    category: ["HTML/CSS"],
    techStack: [ "HTML", "CSS"," JavaScript"],
    deploymentLink: "https://bespoke-blini-7c10e3.netlify.app/",
    githubLink: "https://github.com/dhruv2311-dot/pharmeasy",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: 9,
    title: "HireAVilla",
    description: "Property booking platform with advanced filtering and booking system.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1739943420/hireavilla_ag5gso.png",
    category: ["HTML/CSS"],
    techStack: ["HTML", "CSS", "JavaScript"],
    deploymentLink: "https://hireavilla12.netlify.app/",
    githubLink: "https://github.com/dhruv2311-dot/HIREAVILLA",
    demoVideoId: "1a2b3c4d5e6f7g8h9i0j",
  },
  {
    id: 10,
    title: "Eventura (Figma)",
    description: "A clean and modern dashboard interface design with white mode support.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1739943406/eventura_tuntzx.png",
    category: ["Figma"],
    techStack: ['Figma', 'Auto Layout', 'Components', 'Variants'],
    deploymentLink: "https://www.figma.com/design/VTpYgGhHaIuRfob33itg2p/codinggita?node-id=124-532&t=vtIPVwzy8GVvCr3a-1"
    },
  {
    id: 11,
    title: "CodingGita (Figma)",
    description: "CodingGita is a well-structured and visually appealing website page design.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1740253761/wfdtwsnrsexc4xkkumvw.png",
    category: ["Figma"],
    techStack: ['Figma', 'Auto Layout', 'Components', 'Variants'],
    deploymentLink: "https://www.figma.com/design/VTpYgGhHaIuRfob33itg2p/codinggita?node-id=138-5416&t=vtIPVwzy8GVvCr3a-1",
  },
  {
    id: 12,
    title: "Furnishly (Figma)",
    description: "Furnishly features a sleek and intuitive interface with a focus on user experience.",
    image: "https://res.cloudinary.com/dtkzxbcjx/image/upload/v1740253407/j0jnuta7tknmxkfrplka.jpg",
    category: ["Figma"],
    techStack: ['Figma', 'Auto Layout', 'Components', 'Variants'],
    deploymentLink: "https://www.figma.com/design/VTpYgGhHaIuRfob33itg2p/codinggita?node-id=124-532&t=vtIPVwzy8GVvCr3a-1",
  },
  {
    
  }
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // Filter categories
  const categories = ["All", "HTML/CSS", "React", "MERN", "API", "Figma"];
  
  useEffect(() => {
    if (!titleRef.current || !projectsRef.current) return;
    
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
    
    // Project cards animation
    tl.from(".project-card", {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.6");
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  useEffect(() => {
    // Filter projects based on selected category
    if (filter === "All") {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => 
        project.category.includes(filter)
      ));
    }
    
    // GSAP Flip animation for smooth filter transition
    if (projectsRef.current) {
      const state = Flip.getState(".project-card");
      
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.out",
        absolute: true,
        stagger: 0.05,
        onEnter: elements => 
          gsap.fromTo(elements, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.6 }
          ),
        onLeave: elements => 
          gsap.to(elements, 
            { opacity: 0, scale: 0.8, duration: 0.6 }
          )
      });
    }
  }, [filter]);

  const handleVideoHover = (projectId: number) => {
    setActiveVideo(projectId);
  };

  const handleVideoLeave = () => {
    setActiveVideo(null);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };
  
  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          Featured Projects
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 magnetic-hover ${
                filter === category 
                  ? 'bg-[var(--color-secondary)] text-[var(--color-background)] border-[var(--color-secondary)]' 
                  : 'bg-transparent border-gray-600 text-gray-300 hover:border-[var(--color-secondary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects grid */}
        <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="project-card group"
              onMouseEnter={() => handleVideoHover(project.id)}
              onMouseLeave={handleVideoLeave}
            >
              <div className="relative overflow-hidden rounded-xl bg-[var(--color-surface)] h-full transform transition-transform duration-500 hover:scale-[1.02]">
                {/* Project image/video */}
                <div className="relative h-60 overflow-hidden">
                  {activeVideo === project.id ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src={`https://drive.google.com/file/d/${project.demoVideoId}/preview?autoplay=1&mute=${isMuted ? 1 : 0}`}
                        allow="autoplay"
                        className="w-full h-full"
                      ></iframe>
                      <button
                        onClick={toggleMute}
                        className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full"
                      >
                        {isMuted ? (
                          <VolumeX size={20} className="text-white" />
                        ) : (
                          <Volume2 size={20} className="text-white" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4">
                      <div className="flex gap-2 mb-2">
                        {project.category.map((cat, index) => (
                          <span 
                            key={index} 
                            className="text-xs py-1 px-2 rounded bg-[var(--color-primary)]/70 backdrop-blur-sm"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Project info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-secondary)]">{project.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Project links */}
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={project.deploymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline magnetic-hover"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                    <a 
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline magnetic-hover"
                    >
                      <Github size={16} />
                      Code
                    </a>
                    {project.apiDocsLink && (
                      <a 
                        href={project.apiDocsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline magnetic-hover"
                      >
                        <FileText size={16} />
                        API Docs
                      </a>
                    )}
                    <button 
                      className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline magnetic-hover"
                      onClick={() => handleVideoHover(project.id)}
                    >
                      <Play size={16} />
                      Demo Video
                    </button>
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

export default Projects;