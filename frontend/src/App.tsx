import Navbar from './components/portfolio/Navbar';
import Hero from './components/portfolio/Hero';
import About from './components/portfolio/About';
import Skills from './components/portfolio/Skills';
import Projects from './components/portfolio/Projects';
import Contact from './components/portfolio/Contact';
import Footer from './components/portfolio/Footer';

export function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;