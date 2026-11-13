import { SectionHeading, SkillRing } from '../components/ds';
import { DotField, FloatingShape } from '../components/Decor';
import { Reveal } from '../components/Reveal';
import { TagList } from '../components/Small';
import { CAREER_YEARS, rings, skillGroups } from '../data/skills';

export function Skills() {
  return (
    <section className="section bg-raised" id="skills" aria-labelledby="skills-title">
      <FloatingShape kind="diamond" at={{ left: '46%', top: 110 }} />
      <FloatingShape kind="squiggle" at={{ left: '4%', bottom: 120 }} />
      <FloatingShape kind="triangle-sm" speed="slow" at={{ right: '4%', top: 160 }} />
      <div className="wrap">
        <div className="split skills-split">
          <div className="col-7 skills-copy">
            <SectionHeading eyebrow="Expertise" title="Special Skills" align="left" id="skills-title" />
            <div className="rings">
              {rings.map((r) => (
                <SkillRing
                  key={r.label}
                  label={r.label}
                  display={r.display}
                  years={r.years}
                  outOf={CAREER_YEARS}
                  span={r.span}
                  tone={r.tone}
                />
              ))}
            </div>
            <div className="skill-groups">
              {skillGroups.map((g) => (
                <Reveal key={g.name} className="skill-group">
                  <h3>{g.name}</h3>
                  <TagList items={g.items} neutral tech />
                </Reveal>
              ))}
            </div>
          </div>
          <div className="col-5 portrait-col">
            <figure className="portrait-frame skills-frame">
              <DotField className="violet-block" />
              <div className="cutout">
                <img
                  src="/img/skills-900.webp"
                  srcSet="/img/skills-460.webp 460w, /img/skills-900.webp 900w"
                  sizes="(max-width: 640px) 360px, 460px"
                  alt="Francis in a white shirt, facing the camera"
                  width="900"
                  height="1041"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
