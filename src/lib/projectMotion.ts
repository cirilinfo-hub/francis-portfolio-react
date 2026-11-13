import type { Variants } from 'motion/react';

/** Shared-element name: the card title morphs into the project page heading. */
export const projectTitleTransition = (slug: string) => `project-title-${slug}`;

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
};
