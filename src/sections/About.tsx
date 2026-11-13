import { SectionHeading } from '../components/ds';
import { DotField, FloatingShape } from '../components/Decor';
import { Reveal } from '../components/Reveal';
import { FactRow, StatTile } from '../components/Small';
import { about, person } from '../data/site';

export function About() {
  return (
    <section className="section bg-raised about" id="about" aria-labelledby="about-title">
      <FloatingShape kind="diamond" at={{ right: '7%', top: 120 }} />
      <FloatingShape kind="triangle-sm" speed="slow" at={{ left: '4%', bottom: 140 }} />
      <FloatingShape kind="squiggle" at={{ left: '44%', top: 80 }} size={{ width: 44, height: 22 }} />
      <div className="wrap">
        <div className="split">
          <div className="col-5 portrait-col">
            <figure className="portrait-frame about-frame">
              <DotField className="violet-block" />
              <div className="cutout about">
                <img
                  src="/img/about-800.webp"
                  srcSet="/img/about-420.webp 420w, /img/about-800.webp 800w"
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 420px"
                  alt="Francis Ciril Arulsamy in a blue shirt, arms crossed"
                  width="800"
                  height="1010"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
          <div className="col-7 about-copy">
            <SectionHeading eyebrow="Introduction" title="About Me" align="left" id="about-title" />
            <p className="t-body about-body">{about.body}</p>
            <Reveal>
              <ul className="stats">
                {about.stats.map((s) => (
                  <StatTile key={s.label} value={s.value} label={s.label} />
                ))}
              </ul>
            </Reveal>
            <FactRow
              items={[
                { icon: 'pin', text: person.location },
                { icon: 'languages', text: person.languages },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
