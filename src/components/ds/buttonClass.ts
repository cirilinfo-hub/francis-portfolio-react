export type Variant = 'primary' | 'outline' | 'ghost';
export type Size = 'md' | 'sm';

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  ['fc-btn', `fc-btn-${variant}`, `fc-btn-${size}`, extra].filter(Boolean).join(' ');
