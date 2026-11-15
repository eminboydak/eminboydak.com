import { test, expect } from '@playwright/test';

test.describe('podcast', () => {
  test('index renders with empty state when no shows exist', async ({ page }) => {
    await page.goto('/podcast');
    await expect(page.locator('main h1')).toHaveText('podcast');
    await expect(page.getByText('İlk show hazırlanıyor.')).toBeVisible();
  });

  test('EN index renders its own empty state', async ({ page }) => {
    await page.goto('/en/podcast');
    await expect(page.locator('main h1')).toHaveText('podcast');
    await expect(page.getByText('The first show is in the works.')).toBeVisible();
  });

  test('unknown show slug serves the 404 page', async ({ page }) => {
    const res = await page.goto('/podcast/yok-boyle-bir-show');
    expect(res?.status()).toBe(404);
  });

  test('podcast is reachable from the nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/podcast"]')).toBeVisible();
  });
});
