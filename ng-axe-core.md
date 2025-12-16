[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Axe-core

Axe-core est un outil permettant de contrôler l'accessibilité des pages web.

## Installation et configuration

Installation axe-core dans un front JS/TS

````
npm install --save-dev axe-core @axe-core/playwright playwright
npm install --save-dev @playwright/test @axe-core/playwright
````

initialisation playwright : ````npx playwright install````

Créer ensuite un dossier **e2e/accessibility** à la racine de votre projet 

### Configuration Playwright

A la racine du projet, configurer playwritght de la manière suivante :

*playwright.config.ts*
<details>
  <summary>code</summary>

````typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
````

</details>


### pipeline

Création d'une pipeline d'exécution des audits

*accessibility.yml*

<details>
  <summary>code</summary>

````yaml
name: Accessibility Tests

on: [push] # Exécute à chaque push
# on: 
#   push:
#     branches: [ main, develop ]
#   pull_request:
#     branches: [ main, develop ]

jobs:
  accessibility-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.14
          cache: 'npm'      
          
      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Run Accessibility Tests
        run: npm run test:a11y:home
        continue-on-error: false

      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload Accessibility Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-reports
          path: accessibility-reports/
          retention-days: 30

      - name: Comment PR with results
        if: github.event_name == 'pull_request' && failure()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            let comment = '## ❌ Tests d\'accessibilité échoués\n\n';
            comment += 'Des violations d\'accessibilité ont été détectées. ';
            comment += 'Consultez les artifacts pour plus de détails.\n\n';
            comment += '### Actions à faire:\n';
            comment += '1. Téléchargez le rapport Playwright depuis les artifacts\n';
            comment += '2. Corrigez les violations d\'accessibilité\n';
            comment += '3. Relancez les tests en local avec `npm run test:a11y`\n';
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
````
  
</details>


### Fichiers de tests

Dans le répertoire **e2e/accessibility** créer l'arborescence suivante :

````
e2e
 + accessibility
 |	  + base.spec.ts      // navigue sur la page souhaitée et lance l'audit
 + helpers
      + axe-helpers.ts    // helper qui défini les règles à inclure et exécute l'audit. Responsable du formattage de sortie dans la console
      + routes.config.ts  // Contient la liste des routes à contrôler avec paramétrage spécifique
````

*routes.config.ts*
<details>
  <summary>code</summary>

````typescript
import { Page } from "playwright/test";

export interface RouteTestConfig {
    path: string;
    label: string;
    waitFor?: number;
    skipInCI?: boolean;
    beforeTest?: (page: Page) => Promise<void>;
    afterTest?: (page: Page) => Promise<void>;
    includeInputs?: boolean
}

export const routesToTest: RouteTestConfig[] = [
  { path: '/', label: 'Page d\'accueil' },
  { path: '/home', label: 'Page Home', includeInputs: true },
  { path: '/users', label: 'Page Users', includeInputs: true },
    { 
    path: '/guard', 
    label: 'Page Guard',
    skipInCI: true, // Nécessite authentification par exemple
    // beforeTest: async (page) => {    // Insérer des conditions de test spécifique à une route si besoin
    //     // Se connecter avant le test
    //     await page.goto('/login');
    //     await page.fill('#username', 'testuser');
    //     await page.fill('#password', 'password');
    //     await page.click('button[type="submit"]');
    // }
  },
  { path: '/addUser', label: 'Page Material', includeInputs: true },
  
  // Routes avec paramètres
  { path: '/user/99', label: 'Page Routing params (id=99)' },
  { 
    path: '/search/user/15?postGuid=Az8sA545aAeeee8a7&page=1&filter=search%20term', 
    label: 'Page Routing params (avec query params)' 
  },
];
````

</details>

*axe-helpers.ts*
<details>
	<summary>code</summary>
	
````typescript	
import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface AxeResults {
  violations: any[];
  passes: any[];
  incomplete: any[];
  url: string;
}

/**
 * Exécute un scan d'accessibilité avec axe-core sur la page
 */
export async function checkA11y(
  page: Page,
  context?: string,
  options?: {
    detailedReport?: boolean;
    detailedReportOptions?: { html?: boolean };
  }
): Promise<void> {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const violations = accessibilityScanResults.violations;

  if (violations.length > 0) {
    console.log(`\n❌ Violations d'accessibilité détectées sur la page [${context}] :\n`)
        
    violations.forEach((violation, index) => {
      console.log(`\n${index + 1}. ${violation.id} - ${violation.impact?.toUpperCase()}`);
      console.log(`   Description: ${violation.description}`);
      console.log(`   Help: ${violation.help}`);
      console.log(`   Help URL: ${violation.helpUrl}`);
      console.log(`   Nombre d'éléments affectés: ${violation.nodes.length}`);
      
      violation.nodes.forEach((node: any, nodeIndex: number) => {
        console.log(`   \n   Élément ${nodeIndex + 1}:`);
        console.log(`   - Sélecteur: ${node.target.join(', ')}`);
        console.log(`   - HTML: ${node.html}`);
        console.log(`   - Message: ${node.failureSummary}`);
      });
    });

    // Créer un message d'erreur détaillé
    const errorMessage = `
      ${violations.length} violation(s) d'accessibilité trouvée(s) ${context ? `sur ${context}` : ''}

      ${violations.map((v, i) => `
      ${i + 1}. [${v.impact?.toUpperCase()}] ${v.id}
        ${v.description}
        ${v.nodes.length} élément(s) affecté(s)
        Plus d'infos: ${v.helpUrl}
      `).join('\n')}
    `;

    throw new Error(errorMessage);
  } else {

    console.log(`✅ Aucune violation d'accessibilité détectée ${context ? `sur ${context}` : ''}`);
  }

}

/**
 * Exécute un scan d'accessibilité et retourne les résultats sans échouer
 */
export async function getA11yResults(page: Page): Promise<AxeResults> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
    url: page.url(),
  };
}

/**
 * Génère un rapport d'accessibilité au format JSON
 */
export function generateA11yReport(results: AxeResults, filename: string): void {
  const reportDir = path.join(process.cwd(), 'accessibility-reports');
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, filename);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`📄 Rapport d'accessibilité généré: ${reportPath}`);
}


const testCheckboxInputs = async (page: Page) => {
  const checkboxes = page.locator('input[type="checkbox"]');
  const checkboxCount = await checkboxes.count();
  console.log(`  📦 Trouvé ${checkboxCount} checkbox(es)`);
   for (let i = 0; i < checkboxCount; i++) {
    const checkbox = checkboxes.nth(i);
    if (await checkbox.isVisible() && await checkbox.isEnabled()) {
      try {
        await checkbox.check();
        expect(await checkbox.isChecked()).toBeTruthy();
      } catch (error) {
        console.warn(`  ⚠️  Impossible de cocher la checkbox ${i}`);
      }
    }
  }
}

const testRadioInputs = async (page: Page) => {
  const radios = page.locator('input[type="radio"]');
  const radioCount = await radios.count();
  console.log(`  🔘 Trouvé ${radioCount} radio button(s)`);
  
  // Grouper les radios par name
  const radioNames = new Set<string>();
  for (let i = 0; i < radioCount; i++) {
    const name = await radios.nth(i).getAttribute('name');
    if (name) radioNames.add(name);
  }
  
  // Sélectionner le premier radio de chaque groupe
  for (const name of radioNames) {
    const groupRadios = page.locator(`input[type="radio"][name="${name}"]`);
    const firstRadio = groupRadios.first();
    if (await firstRadio.isVisible() && await firstRadio.isEnabled()) {
      try {
        await firstRadio.check();
        expect(await firstRadio.isChecked()).toBeTruthy();
      } catch (error) {
        console.warn(`  ⚠️  Impossible de sélectionner le radio group "${name}"`);
      }
    }
  }
}

const testSelectInputs = async (page: Page) => {
  const selects = page.locator('select');
  const selectCount = await selects.count();
  console.log(`  📋 Trouvé ${selectCount} select(s)`);
  
  for (let i = 0; i < selectCount; i++) {
    const select = selects.nth(i);
    if (await select.isVisible() && await select.isEnabled()) {
      try {
        const options = await select.locator('option').all();
        if (options.length > 1) {
          const firstValue = await options[1].getAttribute('value');
          if (firstValue) {
            await select.selectOption(firstValue);
          }
        }
      } catch (error) {
        console.warn(`  ⚠️  Impossible de sélectionner dans le select ${i}`);
      }
    }
  }
}

const INPUT_LOCATOR_NUMBER = { type: 'number', locator: 'input[type="number"]' };
const INPUT_LOCATOR_EMAIL = { type: 'email', locator: 'input[type="email"]' };
const INPUT_LOCATOR_PHONE = { type: 'phone', locator: 'input[type="tel"]' };
const INPUT_LOCATOR_DATE = { type: 'date', locator: 'input[type="date"]' };
const INPUT_LOCATOR_TEXT = { type: 'text', locator: 'input[type="text"], input:not([type])' };
const INPUT_LOCATOR_TEXTAREA = { type: 'textarea', locator: 'textarea' };

type InputLocator = typeof INPUT_LOCATOR_NUMBER | typeof INPUT_LOCATOR_EMAIL | typeof INPUT_LOCATOR_PHONE | typeof INPUT_LOCATOR_DATE | typeof INPUT_LOCATOR_TEXT | typeof INPUT_LOCATOR_TEXTAREA;

const getInputTypePicto = (type: string): string => {
  switch (type) {
    case 'number': return '🔢';
    case 'email': return '📧';
    case 'phone': return '📞';
    case 'date': return '📅';
    default: return '📝';
  }
}

type InputParams = {
  page: Page,
  selector: InputLocator,
  testingValue: string
}
const testInputs = async (testParams: InputParams) => {
  const numberInputs = testParams.page.locator(testParams.selector.locator);
  const numberCount = await numberInputs.count();

  console.log(`  ${getInputTypePicto(testParams.selector.type)} Trouvé ${numberCount} champ(s) ${testParams.selector.type}`);
  
  for (let i = 0; i < numberCount; i++) {
    const input = numberInputs.nth(i);
    if (await input.isVisible() && await input.isEnabled()) {
      try {
        await input.fill(testParams.testingValue);
      } catch (error) {
        console.warn(`  ⚠️  Impossible de remplir le champ ${testParams.selector.type} ${i}`);
      }
    }
  }
}


/**
 * Teste tous les types de champs de formulaire sur une page
 */
export async function testFormInputs(page: Page): Promise<void> {
  console.log('🔍 Test des champs de formulaire...');
  
  // Tester les checkboxes
  await testCheckboxInputs(page);
    
  // Tester les radio buttons
  await testRadioInputs(page)
    
  // Tester les champs texte
  await testInputs({page, selector: INPUT_LOCATOR_TEXT, testingValue: 'Test'})
  
  // Tester les champs email
  await testInputs({page, selector: INPUT_LOCATOR_EMAIL, testingValue: 'test@example.com'})
  
  // Tester les champs number
  await testInputs({ page, selector: INPUT_LOCATOR_NUMBER, testingValue: '123' })
    
  // Tester les champs tel
  await testInputs({ page, selector: INPUT_LOCATOR_PHONE, testingValue: '0123456789' })
  
  // Tester les champs date
  await testInputs({ page, selector: INPUT_LOCATOR_DATE, testingValue: '2024-01-01' })
  
  // Tester les select
  await testSelectInputs(page);
  
  // Tester les textarea
  await testInputs({ page, selector: INPUT_LOCATOR_TEXTAREA, testingValue: 'Texte de test pour le textarea' })
  
  console.log('✅ Test des champs de formulaire terminé');
}
````

</details>

*base.spec.ts*

<details>
	<summary>code</summary>
	
````typescript
import { test } from '@playwright/test';
import { checkA11y, testFormInputs } from '../helpers/axe-helper';
import { routesToTest } from 'e2e/helpers/routes.config';

test.describe('Tests d\'accessibilité - Pages principales', () => {
  
  // Générer dynamiquement un test pour chaque route
  for (const route of routesToTest) {
    const testFn = route.skipInCI && process.env['CI'] ? test.skip : test;
    
    testFn(`${route.label} - Accessibilité`, async ({ page }) => {
      // Exécuter le hook beforeTest si présent
      if (route.beforeTest) {
        await route.beforeTest(page);
      }
      
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      
      // Attendre si nécessaire
      if (route.waitFor) {
        await page.waitForTimeout(route.waitFor);
      }
      
      console.log(`Tests d\`accessibilité - Page ${route.label.toLowerCase()} ===>`)
      
      // Tester les champs de formulaire si demandé
      if (route.includeInputs) {
        await testFormInputs(page);
      }
      // Contrôler l'accessibilité
      await checkA11y(page, route.label.toLowerCase());
      
      // Exécuter le hook afterTest si présent
      if (route.afterTest) {
        await route.afterTest(page);
      }
    });
  }
});
````	
	
</details>



### Ajout des scripts dans package.json

````json
"test:a11y": "playwright test e2e/accessibility",
"test:a11y:ui": "playwright test e2e/accessibility --ui",
"test:a11y:report": "playwright show-report",
"test:a11y:home": "playwright test e2e/accessibility/base.spec.ts show report",
````

### Mettre à jour .gitignore

*.gitignore*

````
# Playwright
/playwright-report/
/playwright/.cache/
/test-results/
/accessibility-reports/
````
