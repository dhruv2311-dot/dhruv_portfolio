import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    if (!titleRef.current || !formRef.current || !infoRef.current) return;
    
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
    
    // Form animation
    tl.from(formRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");
    
    // Info animation
    tl.from(infoRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8");
    
    // Label animations
    tl.from(".form-group label", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.6");
    
    return () => {
      if (splitTitle && splitTitle.revert) splitTitle.revert();
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form state
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset submission state after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const label = e.target.previousElementSibling;
    if (label) {
      gsap.to(label, {
        y: -25,
        scale: 0.8,
        color: 'var(--color-secondary)',
        duration: 0.3
      });
    }
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const label = e.target.previousElementSibling;
    if (label && !e.target.value) {
      gsap.to(label, {
        y: 0,
        scale: 1,
        color: 'var(--color-text)',
        duration: 0.3
      });
    }
  };
  
  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden py-20">
      <div className="blob-decoration blob-1"></div>
      <div className="blob-decoration blob-2"></div>
      
      <div className="container mx-auto px-6">
        <h2 ref={titleRef} className="section-title">
          Get In Touch
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            {isSubmitted ? (
              <div className="bg-[var(--color-surface)] p-8 rounded-xl border border-green-500">
                <h3 className="text-2xl font-bold mb-4 text-green-500">Message Sent!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn magnetic-hover"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form 
                ref={formRef} 
                onSubmit={handleSubmit}
                className="bg-[var(--color-surface)] p-8 rounded-xl border border-gray-700"
              >
                <div className="space-y-6">
                  <div className="form-group relative">
                    <label 
                      htmlFor="name" 
                      className="absolute left-3 top-3 transition-all duration-300 pointer-events-none"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 pt-6 transition-colors"
                    />
                  </div>
                  
                  <div className="form-group relative">
                    <label 
                      htmlFor="email" 
                      className="absolute left-3 top-3 transition-all duration-300 pointer-events-none"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 pt-6 transition-colors"
                    />
                  </div>
                  
                  <div className="form-group relative">
                    <label 
                      htmlFor="subject" 
                      className="absolute left-3 top-3 transition-all duration-300 pointer-events-none"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 pt-6 transition-colors"
                    />
                  </div>
                  
                  <div className="form-group relative">
                    <label 
                      htmlFor="message" 
                      className="absolute left-3 top-3 transition-all duration-300 pointer-events-none"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                      rows={5}
                      className="w-full bg-transparent border-b-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 pt-6 transition-colors resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn magnetic-hover w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Contact info */}
          <div ref={infoRef}>
            <div className="bg-[var(--color-surface)] p-8 rounded-xl border border-gray-700 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[var(--color-secondary)]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Email</h4>
                    <a href="mailto:contact@example.com" className="text-gray-300 hover:text-[var(--color-secondary)] transition-colors">
                      contact@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[var(--color-secondary)]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Phone</h4>
                    <a href="tel:+11234567890" className="text-gray-300 hover:text-[var(--color-secondary)] transition-colors">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[var(--color-secondary)]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Location</h4>
                    <p className="text-gray-300">
                      San Francisco, California, USA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--color-surface)] p-8 rounded-xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">Availability</h3>
              <p className="text-gray-300 mb-4">
                I'm currently available for freelance work and full-time opportunities. If you have a project that needs a creative developer, let's talk!
              </p>
              <div className="bg-[var(--color-primary)]/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Response Time:</span>
                  <span className="text-gray-300">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;