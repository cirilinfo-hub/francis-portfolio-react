import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  matchRoutes,
  type HydrationState,
  type RouteObject,
} from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { setHydrating } from './lib/hydration';
import { routes } from './router';

declare global {
  interface Window {
    __staticRouterHydrationData?: HydrationState;
  }
}

/** Boots the router: hydrates prerendered HTML for this URL, otherwise renders. */
export async function start() {
  const container = document.getElementById('root');
  if (!container) throw new Error('Missing #root element');
  // Hydrate only HTML that was prerendered for this exact URL.
  const prerendered = container.dataset.path;
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  // 404.html is rendered from the catch-all route, so it only fits URLs that reach it.
  const isCatchAll = path !== '/' && !path.startsWith('/projects/');
  const matchesUrl = prerendered === path || (prerendered === '/404' && isCatchAll);
  const hydrationData = matchesUrl ? window.__staticRouterHydrationData : undefined;

  // Prerendered page: resolve lazy route modules for this URL first, so the
  // first client render matches the HTML instead of showing a fallback.
  if (hydrationData) {
    const lazyMatches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy) ?? [];
    await Promise.all(
      lazyMatches.map(async ({ route }) => {
        if (typeof route.lazy !== 'function') return;
        const resolved = await route.lazy();
        Object.assign(route, { ...resolved, lazy: undefined } as Partial<RouteObject>);
      }),
    );
  }

  const router = createBrowserRouter(routes, hydrationData ? { hydrationData } : undefined);
  const app = (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );

  if (hydrationData && container.hasChildNodes()) {
    setHydrating(true);
    hydrateRoot(container, app);
    // Hydration commits in the next tasks; later mounts animate normally.
    setTimeout(() => setHydrating(false), 0);
  } else {
    container.replaceChildren();
    createRoot(container).render(app);
  }
}
