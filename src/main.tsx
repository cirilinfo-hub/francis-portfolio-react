// Entry. Kept tiny on purpose: styles load here (render-blocking, so no flash),
// and the app (React, router, Motion) is fetched and evaluated only after the
// prerendered page has loaded and painted, so it never competes with the hero
// portrait (the LCP element) for bandwidth or the main thread.
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/base.css';
import './components/ds/ds.css';
import './components/components.css';
import './components/layout.css';
import './sections/sections.css';
import './routes/project-detail.css';
import './styles/motion.css';

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const loaded = () =>
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
/** Resolves after the browser has actually painted (rAF alone does not guarantee it). */
const painted = () =>
  new Promise<void>((resolve) => {
    if (performance.getEntriesByName('first-contentful-paint').length) return resolve();
    const done = () => {
      observer.disconnect();
      resolve();
    };
    const observer = new PerformanceObserver(done);
    observer.observe({ type: 'paint', buffered: true });
    setTimeout(done, 2500); // background tabs may never paint
  });

async function boot() {
  // Prerendered pages: let the first view (hero portrait = LCP) load and paint
  // before React starts. The HTML is fully readable and its anchor links work
  // meanwhile; JS-only controls (menu, theme, form) wire up right after.
  if (document.getElementById('root')?.hasChildNodes()) {
    await loaded();
    await painted();
    await frame();
  }
  const { start } = await import('./app');
  await start();
}

void boot();
