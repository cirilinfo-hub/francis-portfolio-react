// Prerenders every route to static HTML after `vite build`.
// 1. `vite build --ssr src/entry-server.tsx` produces dist/.server/entry-server.js
// 2. This script renders each path, moves the <title>/<meta description> React
//    emits into <head>, and writes dist/index.html, dist/projects/<slug>.html
//    and dist/404.html.
// The browser then hydrates (src/main.tsx), so the hero paints from HTML.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const serverDir = resolve(dist, '.server');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const { render, paths } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href);

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

for (const path of paths) {
  const { html, status } = await render(path);

  // React 19 renders <title>/<meta> from components inline; hoist them into <head>.
  let body = html;
  let page = template;
  const title = body.match(/<title>([\s\S]*?)<\/title>/);
  if (title) {
    body = body.replace(title[0], '');
    page = page.replace(/<title>[\s\S]*?<\/title>/, title[0]);
    page = page.replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${escapeAttr(title[1])}$2`,
    );
  }
  const desc = body.match(/<meta name="description" content="([^"]*)"\/?>/);
  if (desc) {
    body = body.replace(desc[0], '');
    page = page.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${desc[1]}$2`);
    page = page.replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${desc[1]}$2`,
    );
  }
  if (path !== '/') {
    // Only the home page needs the hero portrait preloaded.
    page = page.replace(
      /\s*<!-- LCP: hero portrait. -->\s*<link[\s\S]*?fetchpriority="high"\s*\/>/,
      '',
    );
    const url = path === '/404' ? null : path;
    page = page.replace(/(<link rel="canonical" href="[^"]*?)\/"/, url ? `$1${url}"` : '$1/"');
    page = page.replace(/(<meta property="og:url" content="[^"]*?)\/"/, url ? `$1${url}"` : '$1/"');
    if (!url)
      page = page.replace(
        '<meta name="color-scheme"',
        '<meta name="robots" content="noindex" />\n    <meta name="color-scheme"',
      );
  }

  // data-path lets the client hydrate only when this HTML belongs to the URL
  // (a host falling back to index.html for an unknown URL then just renders).
  page = page.replace('<div id="root"></div>', `<div id="root" data-path="${path}">${body}</div>`);
  // /projects/gma -> dist/projects/gma.html (served for /projects/gma by vite preview and most hosts).
  const out = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  console.log(`prerendered ${path} (${status})`);
}

rmSync(serverDir, { recursive: true, force: true });
