import type { ReactNode } from 'react';
import type { Tone } from './types';

export interface ServiceItemProps {
  icon: ReactNode;
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function ServiceItem({ icon, tone = 'violet', title, children, className }: ServiceItemProps) {
  return (
    <div className={['fc-service', className].filter(Boolean).join(' ')}>
      <span className={`fc-chip fc-chip-${tone}`} aria-hidden="true">
        {icon}
      </span>
      <div>
        <h3 className="fc-service-title">{title}</h3>
        {children ? <p className="fc-service-text">{children}</p> : null}
      </div>
    </div>
  );
}
