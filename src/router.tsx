import { data, type RouteObject } from 'react-router';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';
import { RootLayout } from './routes/RootLayout';

/** Route objects, shared by the browser router (main.tsx) and the prerenderer (entry-server.tsx). */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        // Pathless layout so errors render inside the shell (nav + footer stay).
        ErrorBoundary: NotFound,
        children: [
          { index: true, Component: Home },
          {
            path: 'projects/:slug',
            // Dev server only (no prerendered HTML): nothing to show while the loader runs.
            HydrateFallback: () => null,
            // Code-split: the project page loads on demand.
            lazy: async () => {
              const [page, { loader }] = await Promise.all([
                import('./routes/ProjectDetail'),
                import('./routes/projectDetailLoader'),
              ]);
              return { Component: page.default, loader };
            },
          },
          {
            path: '*',
            // The loader always throws a 404 to the boundary; Component only satisfies the router.
            Component: NotFound,
            loader: () => {
              throw data(null, { status: 404, statusText: 'Not found' });
            },
          },
        ],
      },
    ],
  },
];
