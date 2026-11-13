import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { projects } from './data/projects';
import { routes } from './router';

/** Every URL that gets a static HTML file at build time. */
export const paths = ['/', ...projects.map((p) => `/projects/${p.slug}`), '/404'];

/** Renders one URL to HTML (plus React Router's hydration script). Used by scripts/prerender.mjs. */
export async function render(url: string): Promise<{ html: string; status: number }> {
  const { query, dataRoutes } = createStaticHandler(routes);
  const context = await query(new Request(new URL(url, 'http://localhost')));
  if (context instanceof Response) throw new Error(`Unexpected response for ${url}`);
  const router = createStaticRouter(dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  );
  return { html, status: context.statusCode };
}
