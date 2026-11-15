import { test, expect } from '@playwright/test';

test.describe('series', () => {
  test('unknown series slug serves the 404 page', async ({ page }) => {
    const res = await page.goto('/blog/series/yok-boyle-bir-seri');
    expect(res?.status()).toBe(404);
  });

  test('blog index renders without series badges when no series exists', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('article').first()).toBeVisible();
    await expect(page.getByText(/seri ·/)).toHaveCount(0);
  });

  test('post pages render without a series banner when not part of a series', async ({ page }) => {
    await page.goto('/blog/arch-linux-matlab-kurulumu');
    await expect(page.locator('[data-series-banner]')).toHaveCount(0);
    await expect(page.locator('main h1')).toContainText('Arch Linux MATLAB');
  });
});
