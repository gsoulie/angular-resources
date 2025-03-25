import { test, expect } from '@playwright/test';
import { checkIfUrlIsLoaded, redirectTo } from './page-redirect-helper';

test.beforeEach(async ({ page }) => {
  await page.goto('https://my-app/dashboard');
  const currentUrl = page.url();

  if (currentUrl === 'https://my-app/dashboard') {
    // Déjà authentifié, il faut se déconnecter avant
    const profileButton = await page.locator('#profileMenuBtn');
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    await expect(page.getByText('Connecté en tant que')).toBeVisible();
    const logoutButton = await page.getByRole('link', { name: 'Me déconnecter' });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    
    await checkIfUrlIsLoaded(page, 'https://my-app/auth')
  }
})


test('Authentification - failed', async ({ page }) => {
  await redirectTo(page, 'https://my-app/auth');

  await expect(page.locator('#email')).toBeVisible();
  await page.locator('#email').fill('xxx@xxx.com');

  await expect(page.locator('#password')).toBeVisible();
  await expect(passwordField).toBeVisible();
  await passwordField.fill('wrongpassword');

  const loginButton = await page.getByRole('button', { name: 'Se connecter' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const errorMessage = await page.getByText('L\'authentification a échouée')
  await expect (errorMessage).toBeVisible()
});


test('Format email invalide', async ({ page }) => {
  await redirectTo(page, 'https://my-app/auth');

  await expect(page.locator('#email')).toBeVisible();
  await page.locator('#email').fill('xxx');

  await expect(page.locator('#password')).toBeVisible();
  await expect(passwordField).toBeVisible();
  await passwordField.fill('wrongpassword');

  const loginButton = await page.getByRole('button', { name: 'Se connecter' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const errorMessage = await page.getByText('Le format du mail n\'est pas valide')
  await expect(errorMessage).toBeVisible()
})

