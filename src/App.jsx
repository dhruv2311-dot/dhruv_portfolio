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
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Initialize animations after preloader is complete
      setupScrollAnimation();
    }
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