import { LazyMotion, MotionConfig } from 'motion/react';
import { useEffect, ViewTransition } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';

// Motion features load after first paint; `m` components render static until then.
const loadFeatures = () => import('../lib/motionFeatures').then((mod) => mod.default);

/**
 * App shell. Route changes cross-fade through React's <ViewTransition>
 * (React Router 8 docs). The boundary is keyed by pathname and only animates
 * enter/exit, so in-page transitions (filtering, paging) never trigger a
 * document-wide view transition. Reduced motion: instant swap (motion.css).
 * <ScrollRestoration> restores positions and scrolls to #hash targets.
 */
export function RootLayout() {
  const { pathname } = useLocation();
  const onProject = pathname.startsWith('/projects/');

  // Signals that React has hydrated (used by the e2e tests and handy for debugging).
  useEffect(() => {
    document.documentElement.dataset.ready = 'true';
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <NavBar />
        <ViewTransition key={pathname} default="none" enter="auto" exit="auto">
          <main id="main" tabIndex={-1}>
            <Outlet />
          </main>
        </ViewTransition>
        <Footer mini={onProject} />
        <ScrollRestoration />
      </LazyMotion>
    </MotionConfig>
  );
}
