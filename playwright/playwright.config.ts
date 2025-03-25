
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [
    ['list'], // Affiche les résultats des tests dans la console
    ['html', { outputFolder: 'test-results' }], // Génère un rapport HTML dans le dossier test-results
    ['junit', { outputFile: 'test-results/e2e-junit-results.xml' }]
  ],
  //timeout: 30000, // 30s par défaut
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000/dev',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // headless: true, // Exécution en mode headless (sans UI)
    // screenshot: 'on', // Capture d'écran automatique en cas d'échec
  },

  /* Configure projects for major browsers */
  projects: [
    /*{
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel:"chrome",
        viewport: { width: 1500, height: 889 },// 1920*1080
        trace: "on", // génère un fichier dans le répertoire test-results/trace/index.html
        // video: "on", // ajoute une vidéo du test dans le rapport
        // screenshot: "on" // ajout des screenshot dans le rapport,
      },
    },*/



    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: "chrome",
        viewport: { width: 1500, height: 889 },// 1920*1080
        trace: "on", // génère un fichier dans le répertoire test-results/trace/index.html
        storageState: 'playwright/.auth/auth.json'
      },
      dependencies: ['setup'],  // Ajouter une dépendance au setup défini dans auth.setup.ts. Sera joué en premier avant tous les tests (pratique pour gérer l'authentification)
    },

   /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    env: {
      "NODE_TLS_REJECT_UNAUTHORIZED": "0",
      "WITH_PATHPREFIX": "1"
    },
    //command: 'npm run start',
    url: 'http://localhost:3000/dev',
    reuseExistingServer: !process.env.CI,
  },
});
