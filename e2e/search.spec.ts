import { test, expect } from '@playwright/test';

async function indexAvailable(request: import('@playwright/test').APIRequestContext) {
  const res = await request.get('/pagefind/pagefind.js');
  return res.ok();
}

test.describe('search', () => {
  test('pill opens the modal and focuses the input', async ({ page }) => {
    await page.goto('/blog');
    await page.getByRole('button', { name: 'ara' }).click();
    const input = page.locator('[role="dialog"] input');
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('placeholder', 'yazılarda ara');
  });

  test('Escape closes the modal', async ({ page }) => {
    await page.goto('/blog');
    await page.getByRole('button', { name: 'ara' }).click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"] input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });

  test('typing finds posts when the index is present', async ({ page, request }) => {
    test.skip(!(await indexAvailable(request)), 'pagefind index only exists after a build');
    await page.goto('/blog');
    await page.getByRole('button', { name: 'ara' }).click();
    await page.locator('[role="dialog"] input').fill('git');
    await expect(page.getByRole('dialog').getByText('Ayarlarınızı Git ile Yönetin')).toBeVisible();
    await expect(page.getByRole('dialog').getByText(/sonuç$/)).toBeVisible();
  });
});
