import { TrustStrip } from '../components/Small';
import { clients } from '../data/site';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Services } from '../sections/Services';
import { Skills } from '../sections/Skills';
import { Testimonials } from '../sections/Testimonials';

export function Home() {
  return (
    <div id="top" className="page">
      <title>Francis Ciril Arulsamy — Front-End Architect</title>
      <Hero />
      <TrustStrip label="Delivered For" names={clients} />
      <About />
      <Services />
      <Experience />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </div>
  );
}
