import { ContactCard } from '../components/ContactCard';
import { Button, SectionHeading } from '../components/ds';
import { DotField } from '../components/Decor';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { contact, person, social } from '../data/site';

const linkedIn = social.find((s) => s.label === 'LinkedIn');

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap gap-head">
        <SectionHeading eyebrow="Get In Touch" title="Let's Work Together" id="contact-title" />
      </div>
      <div className="band">
        <DotField className="band-bg" />
        <div className="wrap">
          <div className="contact-grid">
            <div className="col-5 contact-info">
              <p className="contact-lead">{contact.lead}</p>
              <ul className="contact-list">
                <li>
                  <span className="cchip" aria-hidden="true">
                    <Icon name="mail" size="sm" />
                  </span>
                  <a href={`mailto:${person.email}`}>{person.email}</a>
                </li>
                <li>
                  <span className="cchip" aria-hidden="true">
                    <Icon name="pin" size="sm" />
                  </span>
                  {person.location}
                </li>
                {person.phone ? (
                  <li>
                    <span className="cchip" aria-hidden="true">
                      <Icon name="user" size="sm" />
                    </span>
                    <a href={`tel:${person.phone.replace(/\s/g, '')}`}>{person.phone}</a>
                  </li>
                ) : null}
                {linkedIn ? (
                  <li>
                    <a className="cchip" href={linkedIn.href} aria-label="LinkedIn profile">
                      <span aria-hidden="true">in</span>
                    </a>
                    LinkedIn
                  </li>
                ) : null}
              </ul>
              <Button variant="primary" href={`mailto:${person.email}`}>
                Hire Me
              </Button>
            </div>
            <Reveal className="col-7">
              <ContactCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
