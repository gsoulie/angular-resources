import { test, expect } from '@playwright/test';
import { checkIfUrlIsLoaded, redirectTo } from './page-redirect-helper';

// BeforeEach sera exécuté avant tous les tests de ce fichier
test.beforeEach(async ({ page }) => {
  await redirectTo(page, 'https://my-app/dashboard')

  // Clic sur bouton Voir tous les utilisateurs
  const userListButton = await page.locator('#userListBtn')
  await expect(userListButton).toBeVisible();
  await userListButton.click();

  await checkIfUrlIsLoaded(page, 'https://my-app/users')

  // Page utilisateurs : contrôle de la présence du heading
  await expect(page.getByRole('heading', { name: 'Liste des utilisateurs' })).toBeVisible();
})

test('Navigation page utilisateurs depuis menu utilisateurs', async ({ page }) => {
  const userListButton = await page.getByRole('link', { name: 'Utilisateurs' })
  await expect(userListButton).toBeVisible();
  await userListButton.click(); // va router sur la page utilisateurs

  await checkIfUrlIsLoaded(page, 'https://my-app/users')
})


test('Sélection d\'un utilisateur', async ({ page }) => {
  await expect(page.getByText('DOE john')).toBeVisible();
  await page.getByText('DOE john').click();

  await checkIfUrlIsLoaded(page, 'https://my-app/users/244198')
  await expect(page.getByRole('heading', { name: 'DOE John' })).toBeVisible();
})
