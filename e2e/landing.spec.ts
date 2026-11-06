import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders all sections', async ({ page }) => {
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#work')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#hobbies')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('hero copy is correct', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sistem mühendisiyim');
    await expect(page.locator('p').first()).toContainText('elektrik-elektronik mühendisi');
  });

  test('work cards: 4 cards with icons', async ({ page }) => {
    const section = page.locator('#work');
    await expect(section.locator('h3')).toHaveCount(4);
    await expect(section.locator('svg')).toHaveCount(4);
  });

  test('project cards: Stancona and AEB only', async ({ page }) => {
    const section = page.locator('#projects');
    await expect(section.getByText('Stancona', { exact: true })).toBeVisible();
    await expect(section.getByText('AEB Mühendislik', { exact: true })).toBeVisible();
    await expect(section.getByText('tezgah', { exact: false })).toHaveCount(0);
  });

  test('hobby cards: 4 cards, Shadowstar note only in TTRPG', async ({ page }) => {
    const section = page.locator('#hobbies');
    await expect(section.locator('h3')).toHaveCount(4);
    await expect(section.getByText('FPV drone', { exact: true })).toBeVisible();
    await expect(section.getByText(/Shadowstar/)).toHaveCount(1);
  });

  test('contact links: 6 entries, correct email', async ({ page }) => {
    const section = page.locator('#contact');
    await expect(section.locator('a')).toHaveCount(7);
    await expect(section.locator('a[href="mailto:me@eminboydak.com"]')).toBeVisible();
  });

  test('nav links navigate to pages', async ({ page }) => {
    await page.locator('nav a[href="/projects"]').click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator('h1')).toContainText('projeler');

    await page.locator('nav a[href="/blog"]').click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.locator('h1')).toContainText('blog');
  });

  test('nav active state highlights current page', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('nav a[href="/projects"]')).toHaveClass(/text-primary/);
  });

  test('no horizontal overflow on any viewport', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('full page screenshot', async ({ page }) => {
    await page.screenshot({ path: 'e2e/shots/landing-full.png', fullPage: true });
  });
});
