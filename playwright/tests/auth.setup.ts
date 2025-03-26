
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/auth.json');

setup('Authentification', async ({ page }) => {
  await page.goto('https://my-app/auth');

  const emailField = await page.locator('#email');
  await expect(emailField).toBeVisible();
  await page.locator('#email').fill(process.env.AUTH_EMAIL!); // process.env.AUTH_EMAIL! est utilisé par la pipeline CI/CD. 
                                                              //Pour des tests exécutés depuis vscode, il faut renseigner la valeur du login/pwd en clair ici

  const passwordField = await page.locator('#password');
  await expect(passwordField).toBeVisible();
  await passwordField.fill('xxx'); // process.env.AUTH_PASSWORD! est utilisé par la pipeline CI/CD. 
                                   //Pour des tests exécutés depuis vscode, il faut renseigner la valeur du login/pwd en clair ici

  const loginButton = page.getByRole('button', { name: 'Se connecter' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await page.waitForTimeout(2000); // Vérifie si la page change

  // Attendre la redirection ou vérifier que l'utilisateur est connecté
  await page.waitForURL('https://my-app/dashboard');
  await expect(page).toHaveURL('https://my-app/dashboard');

  const searchBox = await page.getByRole('searchbox', { name: 'Submit' })
  await expect(searchBox).toBeVisible()

  await page.context().storageState({ path: authFile });  // Enregistrer le contexte d'authentification (token, cookies) dans un storageState qui sera créé sous ../playwright/.auth/auth.json
  // Ce contexte peut être réutilisé pour éviter de se réauthentifier pour chaque test. 
  // Rajouter l'option dependencies: ['setup'] dans le playwrgith.config.ts pour activer la dépendence
})
