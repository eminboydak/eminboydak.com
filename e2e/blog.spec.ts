import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

test.describe('blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('renders one article per published post', async ({ page }) => {
    const posts = readdirSync('src/content/posts/tr').filter((f) => f.endsWith('.md')).length;
    await expect(page.locator('article')).toHaveCount(posts);
  });

  test('bujo date headers: day + month format', async ({ page }) => {
    const first = page.locator('article').first();
    await expect(first.locator('.day')).toHaveText(/^\d{2}$/);
    await expect(first.locator('.month')).not.toBeEmpty();
  });

  test('old posts from hex present', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Arch Linux MATLAB Kurulumu' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ayarlarınızı Git ile Yönetin' })).toBeVisible();
  });

  test('category pills present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'tümü', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'linux', exact: true })).toBeVisible();
  });

  test('no horizontal overflow', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('full page screenshot', async ({ page }) => {
    await page.screenshot({ path: 'e2e/shots/blog-full.png', fullPage: true });
  });
});
