import { SectionHeading, TestimonialCard } from '../components/ds';
import { FloatingShape } from '../components/Decor';
import { Reveal } from '../components/Reveal';
import { PlaceholderNote } from '../components/Small';
import { testimonial } from '../data/site';

/** Placeholder only, clearly marked. No quote has been invented. */
export function Testimonials() {
  return (
    <section className="section" id="testimonials" aria-labelledby="testimonials-title">
      <FloatingShape kind="diamond-sm" at={{ right: '10%', top: 120 }} />
      <FloatingShape kind="squiggle" at={{ left: '6%', top: 140 }} />
      <FloatingShape kind="triangle-sm" speed="slow" at={{ right: '8%', bottom: 100 }} />
      <div className="wrap">
        <div className="gap-head">
          <SectionHeading eyebrow="Testimonial" title="What People Say" id="testimonials-title" />
        </div>
        <Reveal className="testi-row">
          <div
            className="candid"
            role="img"
            aria-label="Placeholder for a candid photo of the person giving the recommendation"
          >
            <span className="t-label candid-label">
              Candid Photo Placeholder
              <span className="t-small candid-sub">Recommender at work, natural light</span>
            </span>
          </div>
          <div className="testi-quote">
            {testimonial.placeholder ? (
              <PlaceholderNote>
                <span className="ph-long">Placeholder — Replace With A Real Recommendation</span>
                <span className="ph-short">Placeholder Quote</span>
              </PlaceholderNote>
            ) : null}
            <TestimonialCard name={testimonial.name} role={testimonial.role} initials={testimonial.initials}>
              {testimonial.quote}
            </TestimonialCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
