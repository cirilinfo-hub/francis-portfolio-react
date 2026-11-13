/** Native scroll-driven animations (CSS animation-timeline). Checked once. */
export const supportsViewTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

export const supportsScrollTimeline =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
