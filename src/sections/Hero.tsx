import { m, type Variants } from 'motion/react';
import { Button, SocialBar } from '../components/ds';
import { DotField, FloatingShape } from '../components/Decor';
import { Magnetic } from '../components/Magnetic';
import { ButtonTray } from '../components/Small';
import { person, social } from '../data/site';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { usePointerParallax } from '../hooks/usePointerParallax';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
};
// The role line and portrait are the LCP candidates: they are painted (non-zero
// opacity) from the very first frame, so the entrance never delays LCP.
const words: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const word: Variants = {
  hidden: { opacity: 0.18, y: '0.35em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0, 0, 1] } },
};
const portrait: Variants = {
  hidden: { y: 16 },
  show: { y: 0, transition: { duration: 0.6, ease: [0.2, 0, 0, 1] } },
};

/** Split-text reveal, used on the hero role line only. */
function SplitText({ text }: { text: string }) {
  const parts = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <m.span className="split-text" aria-hidden="true" variants={words}>
        {parts.map((w, i) => (
          <span key={`${w}-${i}`} className="split-word">
            <m.span className="split-inner" variants={word}>
              {w}
            </m.span>
            {i < parts.length - 1 ? ' ' : null}
          </span>
        ))}
      </m.span>
    </>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const parallax = usePointerParallax();
  const field = parallax.layer(-1);
  const shapes = parallax.layer(1);

  return (
    <m.section
      className="hero"
      aria-labelledby="hero-role"
      initial={reduced ? false : 'hidden'}
      animate="show"
      variants={container}
      {...parallax.handlers}
    >
      <DotField className="hero-field" x={field.x} y={field.y} />
      <div className="hero-shapes">
        <FloatingShape kind="diamond" at={{ left: '6%', top: 70 }} x={shapes.x} y={shapes.y} />
        <FloatingShape kind="triangle" speed="slow" at={{ left: '46%', top: 90 }} x={shapes.x} y={shapes.y} />
        <FloatingShape kind="squiggle" at={{ left: '52%', bottom: 120 }} x={shapes.x} y={shapes.y} />
        <FloatingShape kind="diamond-sm" speed="slow" at={{ left: '40%', bottom: 60 }} x={shapes.x} y={shapes.y} />
      </div>
      <div className="hero-shapes-m">
        <FloatingShape kind="diamond-sm" mobile="show" at={{ right: 24, top: 36 }} />
        <FloatingShape kind="squiggle" mobile="show" at={{ right: 40, top: 150 }} size={{ width: 40, height: 20 }} />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <m.p className="greet" variants={item}>
              <b>Hello,</b> I&apos;m {person.firstName}.
            </m.p>
            <h1 className="t-display" id="hero-role">
              <SplitText text={person.role} />
            </h1>
            <m.p className="t-body hero-intro" variants={item}>
              {person.intro}
            </m.p>
            <m.div variants={item}>
              <ButtonTray>
                <Magnetic>
                  <Button variant="primary" href="#contact">
                    Hire Me
                  </Button>
                </Magnetic>
                <Button variant="outline" href={person.cvHref}>
                  Get CV
                </Button>
              </ButtonTray>
            </m.div>
          </div>
          <div className="hero-art">
            <DotField className="hero-art-field" />
            <m.figure className="hero-photo" variants={portrait}>
              <img
                src="/img/hero-920.webp"
                srcSet="/img/hero-460.webp 460w, /img/hero-920.webp 920w"
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 460px"
                alt="Francis Ciril Arulsamy in a blue checked shirt"
                width="840"
                height="1027"
                fetchPriority="high"
                decoding="async"
              />
            </m.figure>
            <m.div className="hero-social" variants={item}>
              <SocialBar items={social} label="Social profiles" />
            </m.div>
          </div>
        </div>
      </div>
    </m.section>
  );
}
