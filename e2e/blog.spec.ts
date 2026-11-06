import { test, expect } from '@playwright/test';

test.describe('blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('renders catalog with 7 posts', async ({ page }) => {
    await expect(page.locator('article')).toHaveCount(7);
  });

  test('bujo date headers: day + month format', async ({ page }) => {
    const first = page.locator('article').first();
    await expect(first.locator('.day')).toHaveText('04');
    await expect(first.locator('.month')).toHaveText('Kasım');
  });

  test('old posts from hex present', async ({ page }) => {
    await expect(page.getByText('Arch Linux MATLAB Kurulumu')).toBeVisible();
    await expect(page.getByText('Ayarlarınızı Git ile Yönetin')).toBeVisible();
  });

  test('category pills present', async ({ page }) => {
    await expect(page.getByText('tümü', { exact: true })).toBeVisible();
    await expect(page.getByText('embedded', { exact: true })).toBeVisible();
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
