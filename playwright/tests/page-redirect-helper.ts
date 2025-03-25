
import { expect, Page } from "@playwright/test";

/**
 * Aller sur une page spécifique
 * @param page 
 * @param url : url à atteindre
 */
export const redirectTo = async (page: Page, url: string) => {
  await page.goto(url);
  await page.waitForURL(url);
  await expect(page).toHaveURL(url);
}

/**
 * Contrôler l'url passée en paramètre
 * @param page 
 * @param url 
 */
export const checkIfUrlIsLoaded = async (page: Page, url: string) => {
  await page.waitForURL(url);
  await expect(page).toHaveURL(url);
}
