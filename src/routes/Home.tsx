import { Suspense } from 'react';
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
      {/* Each boundary hydrates as its own low-priority task, so hydrating the
          long page never blocks the main thread in one piece. */}
      <Suspense>
        <About />
      </Suspense>
      <Suspense>
        <Services />
      </Suspense>
      <Suspense>
        <Experience />
      </Suspense>
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Skills />
      </Suspense>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
    </div>
  );
}
