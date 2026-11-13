import { expect, test as base, type Page } from '@playwright/test';

// Prerendered pages hydrate after first paint; wait for the app before interacting.
const ready = (page: Page) => page.waitForSelector('html[data-ready]');
const test = base.extend({
  page: async ({ page }, provide) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args: Parameters<Page['goto']>) => {
      const res = await goto(...args);
      await ready(page);
      return res;
    };
    const reload = page.reload.bind(page);
    page.reload = async (...args: Parameters<Page['reload']>) => {
      const res = await reload(...args);
      await ready(page);
      return res;
    };
    await provide(page);
  },
});

const isMobile = (w: number) => w <= 640;
const isTabletOrMobile = (w: number) => w <= 1024;

test.describe('home', () => {
  test('renders every section with landmarks and one h1', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Front-End Architect/i);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Footer' })).toBeAttached();

    for (const id of [
      'about',
      'services',
      'experience',
      'projects',
      'skills',
      'testimonials',
      'contact',
    ]) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
      await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBe(0);
    expect(errors).toEqual([]);
  });

  test('primary navigation matches the breakpoint', async ({ page, viewport }) => {
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Open menu' });
    if (isTabletOrMobile(viewport?.width ?? 1440)) {
      await expect(menu).toBeVisible();
      await menu.click();
      const sheet = page.getByRole('dialog', { name: 'Site menu' });
      await expect(sheet).toBeVisible();
      await expect(sheet.getByRole('link', { name: 'About' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(sheet).toHaveCount(0);
      await expect(menu).toBeFocused();
    } else {
      await expect(menu).toBeHidden();
      await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    }
  });

  test('experience shows the rail for the breakpoint', async ({ page, viewport }) => {
    await page.goto('/');
    const exp = page.locator('#experience');
    if (isMobile(viewport?.width ?? 1440)) {
      await expect(exp.locator('.fc-tl')).toHaveCount(3);
      await exp.getByRole('button', { name: /See Earlier Roles/ }).click();
      await expect(exp.locator('.fc-tl')).toHaveCount(6);
    } else {
      await expect(exp.locator('.tl-curve')).toBeAttached();
      await expect(exp.locator('.fc-tl')).toHaveCount(6);
    }
  });

  test('projects filter, then open a project page and return', async ({ page, viewport }) => {
    await page.goto('/');
    const perPage = isMobile(viewport?.width ?? 1440) ? 3 : 6;
    await expect(page.locator('.pv-card')).toHaveCount(perPage);
    await page.getByRole('searchbox', { name: 'Search projects' }).fill('cisco');
    await expect(page.locator('.pv-card')).toHaveCount(1);
    await page.getByRole('link', { name: 'View details: PCCE' }).click();
    await expect(page).toHaveURL(/\/projects\/pcce$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/PCCE/i);
    await expect(page).toHaveTitle(/PCCE/);
    await page.getByRole('link', { name: 'All Projects' }).click();
    await expect(page).toHaveURL(/\/#projects$/);
  });

  test('theme toggle persists across reloads', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('contact form blocks invalid input', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused();
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});

test('unknown project shows the 404 page inside the shell', async ({ page }) => {
  await page.goto('/projects/does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/not here/i);
  await expect(page.getByRole('banner')).toBeVisible();
});

test.describe('reduced motion', () => {
  test('shapes, headings and reveals are static', async ({ page }, info) => {
    test.skip(info.project.name !== 'reduced-motion', 'reduced-motion project only');
    await page.goto('/');
    const drift = await page
      .locator('.deco')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(drift).toBe('none');
    // Headings render at full opacity immediately (no fade).
    const opacity = await page
      .locator('#services .fc-heading')
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
    const reveal = await page
      .locator('.sd-reveal')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(reveal).toBe('none');
    // Ring shows its final value without counting.
    await expect(page.locator('.ring').first()).toContainText('9');
  });
});
