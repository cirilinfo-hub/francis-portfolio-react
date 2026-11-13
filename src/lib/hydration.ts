/**
 * True while React hydrates prerendered HTML (set by app.tsx). Components read
 * it once, in a state initialiser, to skip JS entrances for content that was
 * already painted from HTML. On the server it is always true for the same reason.
 */
let hydrating = typeof document === 'undefined';

export const isHydrating = () => hydrating;
export const setHydrating = (value: boolean) => {
  hydrating = value;
};
