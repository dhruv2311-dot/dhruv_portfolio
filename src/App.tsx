import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import Background from './components/Background';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Certificates from './sections/Certificates';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import { setupScrollAnimation } from './utils/animations';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let minDelayTimeout: number | null = null;
    const minDisplayDuration = 1200;
    const maxWaitDuration = 4000;
    const startTime = performance.now();

    const finalizeLoading = () => {
      if (!mounted || minDelayTimeout !== null) return;
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minDisplayDuration - elapsed);
      minDelayTimeout = window.setTimeout(() => {
        if (mounted) {
          setIsLoading(false);
        }
      }, remaining);
    };

    if (document.readyState === 'complete') {
      finalizeLoading();
    } else {
      window.addEventListener('load', finalizeLoading, { once: true });
    }

    const maxWaitTimeout = window.setTimeout(() => {
      if (mounted) {
        finalizeLoading();
      }
    }, maxWaitDuration);

    return () => {
      mounted = false;
      window.removeEventListener('load', finalizeLoading);
      if (minDelayTimeout !== null) {
        clearTimeout(minDelayTimeout);
      }
      clearTimeout(maxWaitTimeout);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const cleanup = setupScrollAnimation();
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isLoading]);

  return (
    <div data-barba="wrapper">
      {isLoading ? (
        <Preloader />
      ) : (
        <div data-barba="container">
          <Background />
          <Cursor />
          <ThemeToggle />
          <Header />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Certificates />
            <Education />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
