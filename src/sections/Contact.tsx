import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mldleroq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 ref={titleRef} className="section-title">
          Get In Touch
        </h2>
        <div className="title-line w-24 h-1 bg-[var(--color-secondary)] mb-16"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact form */}
          <div>
            {isSubmitted ? (
              <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                  <h3 className="text-xl font-semibold text-green-500">Message Sent Successfully!</h3>
                </div>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Thank you for reaching out. I'll get back to you soon.</p>
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
                className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-gray-700"
              >
                <div className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-transparent border-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 rounded-lg transition-colors text-base placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full bg-transparent border-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 rounded-lg transition-colors text-base placeholder-gray-500"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this about?"
                      className="w-full bg-transparent border-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 rounded-lg transition-colors text-base placeholder-gray-500"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full bg-transparent border-2 border-gray-600 focus:border-[var(--color-secondary)] outline-none p-3 rounded-lg transition-colors text-base resize-none placeholder-gray-500"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn magnetic-hover w-full flex items-center justify-center gap-2 text-base sm:text-lg"
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
          <div ref={infoRef} className="space-y-6">
            <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--color-secondary)]">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[var(--color-secondary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-medium mb-1">Email</h4>
                    <a 
                      href="mailto:contact@example.com" 
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Dhruv.sonagra.cg@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[var(--color-secondary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-medium mb-1">Phone</h4>
                    <a 
                      href="tel:+1234567890" 
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      +91 88492 77382
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[var(--color-secondary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-medium mb-1">Location</h4>
                    <p className="text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>Rai University, Ahemdabad</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-secondary)]">Let's Work Together</h3>
              <p className="mb-4 text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                I'm currently available for freelance work and full-time opportunities. If you have a project that needs a creative developer, let's talk!
              </p>
              <div className="bg-[var(--color-primary)]/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm sm:text-base">Status:</span>
                  <span className="text-green-400 flex items-center gap-1 text-sm sm:text-base">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">Response Time:</span>
                  <span className="text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>Within 24 hours</span>
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
