import { createBrowserRouter, data } from 'react-router';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';
import { RootLayout } from './routes/RootLayout';

export const routes = [
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
            loader: () => {
              throw data(null, { status: 404, statusText: 'Not found' });
            },
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
