import { test, expect } from '@playwright/test';

test.describe('projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('renders Stancona and AEB sections', async ({ page }) => {
    await expect(page.getByText('Stancona', { exact: true })).toBeVisible();
    await expect(page.getByText('AEB Mühendislik', { exact: true })).toBeVisible();
  });

  test('problem/solution/outcome markers present', async ({ page }) => {
    await expect(page.getByText('problem →')).toHaveCount(2);
    await expect(page.getByText('çözüm →')).toHaveCount(2);
    await expect(page.getByText('sonuç →')).toHaveCount(2);
  });

  test('personal projects are only a note, not cards', async ({ page }) => {
    await expect(page.getByText(/kişisel projeler/i)).toHaveCount(1);
    await expect(page.getByText(/geliştirme aşamasında/i)).toBeVisible();
    await expect(page.getByText('tezgah', { exact: false })).toHaveCount(0);
    await expect(page.getByText('duckTerm', { exact: false })).toHaveCount(0);
  });

  test('no horizontal overflow', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test('full page screenshot', async ({ page }) => {
    await page.screenshot({ path: 'e2e/shots/projects-full.png', fullPage: true });
  });
});
