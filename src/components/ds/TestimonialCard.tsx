import type { ReactNode } from 'react';

export interface TestimonialCardProps {
  name: string;
  role?: string;
  avatar?: string;
  /** Alt for the avatar: "[Name] at their desk." Real name only with consent. */
  avatarAlt?: string;
  initials?: string;
  signature?: string;
  children: ReactNode;
  className?: string;
}

export function TestimonialCard({
  name,
  role,
  avatar,
  avatarAlt = '',
  initials,
  signature,
  children,
  className,
}: TestimonialCardProps) {
  return (
    <figure className={['fc-quote', className].filter(Boolean).join(' ')}>
      <figcaption className="fc-quote-head">
        <span className="fc-quote-avatar" aria-hidden={avatar ? undefined : true}>
          {avatar ? <img src={avatar} alt={avatarAlt} width="48" height="48" /> : initials}
        </span>
        <span>
          <span className="fc-quote-name">{name}</span>
          {role ? <span className="fc-quote-role">{role}</span> : null}
        </span>
      </figcaption>
      <blockquote className="fc-quote-body">
        <p>{children}</p>
      </blockquote>
      {signature ? <p className="fc-quote-sign">{signature}</p> : null}
    </figure>
  );
}
