import { test, expect } from '@playwright/test';

test.describe('rss feeds', () => {
  test('TR feed serves xml with at least one item', async ({ request }) => {
    const res = await request.get('/rss.xml');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('xml');
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<item>');
    expect(body).toContain('/blog/');
  });

  test('EN feed serves xml with locale-prefixed item links', async ({ request }) => {
    const res = await request.get('/en/rss.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('<item>');
    expect(body).toContain('/en/blog/');
  });

  test('pages declare their feed in the head', async ({ page }) => {
    await page.goto('/blog');
    const href = await page
      .locator('link[rel="alternate"][type="application/rss+xml"]')
      .getAttribute('href');
    expect(href).toBe('https://eminboydak.com/rss.xml');
  });

  test('EN pages declare the EN feed', async ({ page }) => {
    await page.goto('/en/blog');
    const href = await page
      .locator('link[rel="alternate"][type="application/rss+xml"]')
      .getAttribute('href');
    expect(href).toBe('https://eminboydak.com/en/rss.xml');
  });
});
