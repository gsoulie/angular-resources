import { test, expect } from '@playwright/test';
import { redirectTo } from './page-redirect-helper';

test('Authentification - success', async ({ page }) => {
  await redirectTo(page, 'https://my-app/dashboard')

  const searchBox = await page.getByRole('searchbox', { name: 'Submit' })
  await expect(searchBox).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
