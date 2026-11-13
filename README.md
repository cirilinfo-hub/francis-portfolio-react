# Francis Ciril Arulsamy — Portfolio

Production React build of the `francis-ciril` design canvas (`design/*.dc.html`).
Desktop 1440, tablet 768 and mobile 390 come from one responsive tree; light and dark themes come from the design tokens.

```bash
npm install
npm run dev        # Vite dev server (client-rendered)
npm run build      # typecheck + client build + SSR build + prerender every route
npm run preview    # serve dist/ on http://localhost:4173
```

Other scripts:

| Script                            | What it does                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run tokens`                  | regenerate `src/styles/tokens.css` (also runs before `dev` and `build`)                      |
| `npm run lint`                    | ESLint: typescript-eslint strict, jsx-a11y strict, react-hooks (incl. React Compiler rules)  |
| `npm run format` / `format:check` | Prettier                                                                                     |
| `npm test`                        | Vitest + React Testing Library                                                               |
| `npm run test:e2e`                | Playwright smoke tests at 1440, 768, 390 and with reduced motion (builds and previews first) |

## Stack (versions checked on npm, 13 Nov 2026)

| Package                                                                       | Version | Notes                                                                   |
| ----------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| react / react-dom                                                             | 19.3.1  | function components and hooks only                                      |
| react-router                                                                  | 8.5.1   | data router (`createBrowserRouter`), lazy project route                 |
| motion (`motion/react`)                                                       | 14.13.0 | `LazyMotion` + `m`, features (`domMax`) loaded after first paint        |
| vite                                                                          | 8.3.8   | with `@vitejs/plugin-react` 6.3.0                                       |
| babel-plugin-react-compiler                                                   | 1.0.0   | **React Compiler is on** (see below)                                    |
| typescript                                                                    | 6.0.3   | strict; **not** 7.0.2, because typescript-eslint 8.72 supports `<6.1`   |
| eslint                                                                        | 9.39.5  | **not** 10.x, because eslint-plugin-jsx-a11y 6.10.2 supports eslint ≤ 9 |
| vitest 5.1, @testing-library/react 16.3, @playwright/test 1.65, prettier 3.10 |         |                                                                         |

**React Compiler.** Enabled through the stable Babel plugin, using plugin-react's documented helper:
`babel({ presets: [reactCompilerPreset()] })` in `vite.config.ts`. Plugin-react 6 also offers a Rust compiler (`react({ compiler: true })`), but its docs mark it experimental, so it is not used. No `useMemo` or `useCallback` anywhere; the compiler memoises.

## Structure

```
design-source/tokens.json      copy of ds/francisciril/tokens.json (source of truth)
scripts/build-tokens.mjs       tokens.json -> src/styles/tokens.css
scripts/prerender.mjs          renders every route to static HTML after the build
public/fonts, public/img       self-hosted Poppins (latin), responsive portraits
src/
  main.tsx                     tiny entry: CSS + boots the app after first paint
  app.tsx                      creates the router; hydrates prerendered HTML or renders
  entry-server.tsx             static render used by the prerenderer
  router.tsx                   route objects: /, lazy /projects/:slug, 404
  routes/                      RootLayout, Home, ProjectDetail (lazy) + loader, NotFound
  sections/                    Hero, About, Services, Experience, Projects, Skills,
                               Testimonials, Contact + sections.css
  components/ds/               ported design-system components: Button, SectionHeading,
                               ServiceItem, SocialBar, TimelineItem, TestimonialCard,
                               SkillRing (years variant) + ds.css
  components/                  new components: NavBar, MenuSheet, ThemeToggle, CurvedRail,
                               Disclosure, ProjectGridCard, TextField, ContactCard,
                               DotField / FloatingShape (Decor), ButtonTray, TrustStrip,
                               StatTile, FactRow, Tag, Reveal, Magnetic, ScrollProgress
  data/                        typed content: site, services, experience, projects, skills,
                               techIcons
  hooks/                       useMediaQuery (+ usePrefersReducedMotion), useTheme,
                               useFocusTrap / useScrollLock, useActiveSection,
                               usePointerParallax
  lib/                         theme store, submitContact (backend stub), validation,
                               feature detection, hydration flag
  styles/                      tokens (generated), fonts, base, motion
e2e/smoke.spec.ts              Playwright smoke tests
```

Styling is plain CSS that keeps the design's class names (`fc-btn`, `pv-card`, `tl-row` and so on), so the port can be checked line by line against `site.css` and `bundle.css`. Component grids (stats, services, projects, rings, skill groups) respond to **container queries** on `.wrap`; page-level layout (nav, hero, splits) uses the canvas breakpoints (1024, 640).

## Tokens → CSS

`scripts/build-tokens.mjs` reads `design-source/tokens.json` and writes `src/styles/tokens.css`:

| tokens.json                                | CSS                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `color.tokens[].value.light / .dark`       | `--surface`, `--violet-ink`, … in `:root` (light) and `:root[data-theme='dark']` |
| `shadow.tokens[]`                          | `--shadow-card`, `--shadow-coral`, `--shadow-chip` (themed like colours)         |
| `spacing.tokens[]`                         | `--space-1` … `--space-9`                                                        |
| `radius.tokens[]`                          | `--radius-sm/md/lg/pill` (4, 8, 16, 999 px: near-square cards, pill buttons)     |
| `type.families` / `type.groups[].styles[]` | `--font-sans`, `--type-display-size`, `--type-display-line`, …                   |

Theme resolution:

- **No saved choice:** the theme follows `prefers-color-scheme`, via `@media (prefers-color-scheme: dark) :root:not([data-theme='light'])`.
- **Saved choice:** the ThemeToggle writes `data-theme` on `<html>` and stores it in `localStorage['fc-theme']`. A small inline script in `index.html` re-applies it before first paint, so there is no flash.

Two values `site.css` uses are missing from `tokens.json` (`--shadow-photo`, `--shadow-card-hover`). They live in an `EXTENSIONS` block in the script, ready to move into the token file.

Edit `design-source/tokens.json` (never `tokens.css`), then `npm run tokens`.

## Adding a project

1. Add an entry to `src/data/projects.ts`. The `slug` is derived from the title unless you set one.
2. Optionally add a `caseStudy` (`lede`, `overview`, `role[]`, `stackSummary`, `stackTags`, `impact`, `facts[]`, `headTags`, `screenshots[]`). Without one, the project page shows the facts it has and a clearly marked "Case Study To Be Written" note.
3. `npm run build` prerenders `/projects/<slug>` automatically. Summary tiles and counts are computed from the list.

## Rendering and performance

- **Prerendering.** Every route is prerendered (`dist/index.html`, `dist/projects/<slug>.html`, `dist/404.html`) with React Router's `createStaticHandler` / `StaticRouterProvider`. The client hydrates with `hydrationData`, resolving the lazy project route first so the HTML matches. `#root[data-path]` records which URL the HTML was made for; if a host serves the wrong file, the app renders instead of hydrating.
- **Deferred boot.** `main.tsx` is tiny. It waits for `load` plus the first paint, then imports the app. React, the router and Motion therefore never compete with the hero portrait (the LCP element) for bandwidth or the main thread.
- **Hydration slicing.** Below-the-fold sections sit in their own `<Suspense>` boundaries, so hydration yields between them.
- **Images.** Responsive portraits (`srcset` 460/600/920w). The hero portrait has `fetchpriority="high"` and is preloaded on the home page only; the others lazy-load.
- **Fonts.** Poppins is self-hosted (300, 300 italic, 400, 500, 600, 700) with `font-display: swap`. Only the above-the-fold weights (400, 500, 600, 700) are preloaded.

Lighthouse 13.6 against `npm run preview`, simulated throttling:

| Page                             | Performance                             | Accessibility | Best Practices | SEO       |
| -------------------------------- | --------------------------------------- | ------------- | -------------- | --------- |
| `/` mobile                       | 95–99 (LCP 1.9 s, TBT 60–240 ms, CLS 0) | 97            | 100            | 100       |
| `/` desktop                      | 100                                     | 97            | 100            | 100       |
| `/projects/gma` mobile / desktop | 100 / 100                               | 100 / 100     | 100 / 100      | 100 / 100 |

The 97 on the home page is the placeholder testimonial avatar's initials (see Open items).

## Animation and reduced motion

Motion explains the interface and stays out of the way of reading. **Transform and opacity only.** There are two deliberate exceptions, both paint-only and small:

- **SkillRing arc:** animates `stroke-dashoffset` inside a 56 px SVG.
- **Theme switch:** a circular reveal animates `clip-path` on the view-transition snapshot.

Nothing animates width, height, top or left.

| Effect                          | How                                                                                                                                                                                                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section headings fade up (Spec) | Motion `whileInView`, once: opacity 0→1, 8 px→0, 200 ms                                                                                                                                                                                                                                            |
| Floating shapes drift (Spec)    | CSS `translate` 6 px across, 10 px up, 9/11/13 s, alternate. The only looping animation. Hidden at ≤640 px except where the mobile artboard shows them, so they never cross text.                                                                                                                  |
| Hovers (Spec)                   | CSS 150 ms: primary button rises 1 px; outline fills coral-soft; social chips flip to violet; project cards rise 1 px (spring) with a violet-ink underlined title                                                                                                                                  |
| Scroll progress bar in the nav  | CSS `animation-timeline: scroll(root)`, `scaleX`; fallback Motion `useScroll`                                                                                                                                                                                                                      |
| Section reveals                 | CSS `animation-timeline: view()` on `.sd-reveal`, translate only (text never loses contrast); fallback Motion + IntersectionObserver                                                                                                                                                               |
| CurvedRail draws in             | `view-timeline` on the rail, `scaleY` on an SVG mask; fallback Motion `useScroll`                                                                                                                                                                                                                  |
| Route transitions               | React 19.3 `<ViewTransition>` (React Router 8 docs: the router's own `viewTransition` prop is deprecated). Pages cross-fade; the project title is a shared element from card to page heading. Boundaries animate only enter/exit/share, so filtering and paging never start a document transition. |
| Hero entrance                   | Motion variants stagger greeting, role line, intro, buttons and portrait. On the prerendered first load the same choreography runs in CSS from the first frame (`.hero-css-in`). The role line and portrait never start transparent, so the LCP is never delayed.                                  |
| Split text                      | Hero role line only, word by word; screen readers get the whole line once                                                                                                                                                                                                                          |
| Pointer parallax                | DotField moves up to 6 px, shapes up to 8 px; spring-smoothed `transform`; fine pointers only                                                                                                                                                                                                      |
| Magnetic Hire Me                | Hero primary button, up to 4 px, fine pointers only                                                                                                                                                                                                                                                |
| Experience disclosure           | "See Earlier Roles" (≤640 px, as in the canvas) expands with Motion `layout`, items stagger                                                                                                                                                                                                        |
| SkillRing                       | Arc draws 0→value on view and the count ticks up; `role="img"` label holds the final value from the start                                                                                                                                                                                          |
| Services and projects           | Stagger reveal on view, gentle spring on hover                                                                                                                                                                                                                                                     |
| Theme switch                    | View Transition with a circular reveal from the toggle                                                                                                                                                                                                                                             |
| MenuSheet                       | `AnimatePresence` spring; focus lands on the first link; Tab is trapped; Esc closes and returns focus to the menu button; page is `inert`; scroll is locked                                                                                                                                        |

**Reduced motion** (`prefers-reduced-motion: reduce`) is handled in three places that agree:

1. **`usePrefersReducedMotion()`** (`src/hooks/useMediaQuery.ts`) is the one JS source. Components use it to skip entrances, parallax, magnetic pull and the ring count.
2. **`<MotionConfig reducedMotion="user">`** wraps the app.
3. **One media query in `src/styles/motion.css`** turns off the drift, reveals, rail drawing and scroll bar, and replaces view transitions with an instant swap. It also forces any prerendered Motion start state to its end state, so headings appear without the fade.

Hover colour changes stay.

## Accessibility

- **Landmarks and headings:** a skip link; header with the primary nav, main, and footer with the second nav. One h1 (the role line) and one h2 per section. The current nav link is bold, underlined and has `aria-current`.
- **Focus and targets:** a 2 px focus ring at 2 px offset on every interactive element. 44 px targets; small visual controls get an invisible 44 px hit area.
- **Form:** errors use a coral 2 px edge, an icon and text, wired with `aria-invalid` and `aria-describedby`. Focus moves to the first invalid field.
- **Alt text and decoration:** alt text follows the Spec. Shapes, dot fields and chip glyphs are `aria-hidden`.

## Contact form

`ContactCard` uses React 19 form Actions:

- `useActionState` runs validation and the submit.
- `useFormStatus` drives the Send button's pending state.
- `useOptimistic` shows the confirmation immediately and rolls it back if the request fails.

Inline validation runs on blur and re-checks while a field shows an error. **Backend hook:** replace the body of `submitContact()` in `src/lib/submitContact.ts`. It currently simulates a 700 ms request and succeeds.

---

## Decisions

1. **Design source.** The files were in `../../design/`, not `project/`. Tokens are copied into `design-source/`; portraits were resized into `public/img`.
2. **Projects section follows `Main.dc.html`.** That is the dashboard with summary tiles, search, framework filter, list/card toggle and pagination (6 per page, 3 on mobile). It is not the older `pcard` grid shown in `States.dc.html`. `ProjectGridCard` is that dashboard card. Search uses `useDeferredValue`; filter, view and page changes use `useTransition`.
3. **Shared element is the title.** The dashboard card has no screenshot, so the transition morphs the card title into the project page h1, instead of an image into the hero.
4. **Route transitions use React's `<ViewTransition>`.** React Router 8's own `viewTransition` prop is deprecated in its docs.
5. **Prerender plus deferred boot.** This took mobile Performance from 82 to 95–99. The trade-off: on the first load, JS-only controls (menu button, theme toggle, form, project filters) start working a moment after first paint, typically under a second on a phone. Anchor links and all content work from the HTML immediately.
6. **Pinned versions.** TypeScript 6.0.3 and ESLint 9.39.5 instead of the latest majors, for plugin peer ranges (see the table).
7. **Landmark count.** SocialBar renders as a labelled list rather than `<nav>`, and project pagination is a labelled group of buttons. That keeps exactly two navigation landmarks on the home page, as the Spec asks.
8. **Footer on project pages.** It uses the canvas's mini footer (wordmark and copyright). The theme toggle lives in the home footer.
9. **Prev/next pager.** It follows project-list order and wraps around; the canvas shows example targets.
10. **Other project pages.** Only GMA has a written case study in the canvas. The others show their known facts and a "Case Study To Be Written" placeholder. No content was invented.

## Deviations from the canvas (and why)

- **Project card hover.** It now rises 1 px with an underlined violet-ink title, as the Spec states, instead of `site.css`'s 2 px with no underline.
- **Project card min-width.** The card gets `grid-template-columns: minmax(0, 1fr)`. Long titles overflowed the left column at 1440 with the canvas CSS.
- **Shapes at ≤640 px.** Only those on the mobile artboard show (hero, Services, menu). Others crossed text at phone width, against the Spec rule.
- **Social chip size.** Chips are 44 px at ≤640 px. On desktop they stay 32 px visually with a 44 px hit area.
- **Alt text.** Portrait alt text follows the Spec's rules but describes the actual photos:
  - Hero: "Francis Ciril Arulsamy in a blue checked shirt". The Spec's example, "smiling, arms crossed", doesn't match the hero photo.
  - About: "Francis Ciril Arulsamy in a blue shirt, arms crossed".
  - Skills: "Francis in a white shirt, facing the camera". It is a different photo from the hero, so it is not empty alt.
- **Reply note on mobile.** "I reply within two working days" is hidden at ≤640 px, and Send is full width, as on the mobile artboard.

## Suggested visual changes (not applied)

- **Coral on coral-soft.** In the light theme this pair is 4.49:1, just under AA 4.5:1 for small text (it shows in the testimonial avatar initials). A coral one step darker, e.g. `#c92b53`, would clear it.
- **Trust strip wrapping.** When it wraps on mobile, a line can start with a separator dot. Separators could be hidden at line starts, or the list allowed to scroll horizontally.

## Open items

Carried over from Spec.dc.html:

- **Skill years:** Angular 9, TypeScript 10, React 6, HTML/CSS 18+ come from CV project dates. Francis to confirm (`src/data/skills.ts`).
- **Phone:** hidden (`person.phone = null`) until Francis confirms it can be public. Setting it shows the phone row in Contact.
- **Danger token:** the system has no danger token, so errors use coral with a 2 px edge, an icon and text. Proposed: add a separate `danger` token.

Added during the build:

- **Testimonial:** placeholder only (quote, name and candid photo). Paste a real recommendation into `src/data/site.ts` and set `placeholder: false`.
- **Site URL:** `VITE_SITE_URL` in `.env` is a placeholder (`https://francisciril.example`). It feeds canonical, Open Graph and JSON-LD URLs.
- **Project screenshots and outcomes:** all screenshots are flat placeholders. GMA's Impact still needs a measured outcome.
- **Hosting:** serve `dist/projects/<slug>.html` at `/projects/<slug>` (vite preview, Netlify, Vercel and Cloudflare Pages do by default) and `dist/404.html` for unknown URLs.
- **Tooling advisory:** `npm audit` reports a moderate minimatch advisory inside typescript-eslint. It is dev-only and does not ship.
- **Social chip names:** Lighthouse's unscored "label in name" check flags the chips, because the visible glyphs ("in", "GH") aren't part of their accessible names. That follows the Spec's rule; revisit if WCAG 2.5.3 strictness matters.
