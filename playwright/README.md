

# Playwright

# Présentation

Playwright est un outil de test automatisé développé par Microsoft qui permet d’interagir avec des navigateurs web pour tester des applications. Il prend en charge Chromium, Firefox et WebKit et permet d’exécuter des tests sur différentes plateformes (Windows, Mac, Linux) ainsi que sur des navigateurs en mode headless (sans interface graphique).

> [Best practices](https://playwright.dev/docs/best-practices)    

## Commandes principales

*Créer un test via l'enregistrement codegen*
````
// npx playwright codegen <my-app-url> -o ./tests/<test-filename>.spec.ts
npx playwright codegen https://my-app/dashboard -o ./tests/01_INT-authenticate.spec.ts
````

*Jouer un test*
````
// Jouer le test 01
npx playwright test ./tests/01_INT-authenticate.spec.ts --headed

// Jouer plusieurs tests spécifiques
npx playwright test tests/todo-page/ tests/landing-page/

// Jouer tous les tests
npx playwright test

// Visualiser les tests dans un dashboard avec timeline etc...
npx playwright test --ui

//  Jouer les test sur webkit
npx playwright test --project webkit

// Jouer les tests sur webkit et firefox
npx playwright test --project webkit --project firefox

````
* ````--headed```` : permet de lancer le test en mode UI

*Consulter les rapports*
Les rapports sont enregistrés dans le répertoire *test-results*
````
npx playwright show-report test-results
````


## Fonctionnalités Clés :

* Automatisation Multi-Navigateurs : Playwright permet de tester des applications web sur plusieurs navigateurs (Chromium, Firefox, WebKit) avec une seule API, ce qui simplifie le processus de test et assure une couverture plus large.
* Tests End-to-End (E2E) : Il simule les interactions utilisateur, ce qui permet de tester le comportement de l'application du point de vue de l'utilisateur final.
* Support Multi-Langages : Playwright supporte plusieurs langages de programmation, y compris TypeScript, JavaScript, Python, .NET, et Java, ce qui le rend facilement intégrable dans différents environnements de développement.
* Fixtures Réutilisables : Les fixtures permettent de configurer et de nettoyer l'environnement de test automatiquement, ce qui évite les interférences entre les tests.
* Intégration Continue (CI) : Playwright s'intègre bien avec les pipelines CI/CD, facilitant ainsi l'automatisation des tests dans le processus de déploiement.
* Tests multi-plateformes : Fonctionne sur Windows, Linux et macOS.
* Exécution en mode headless : Permet d’automatiser les tests sans affichage du navigateur.
* Interaction avancée avec les pages : Gestion du DOM, des événements clavier et souris, du réseau, etc.
* Tests parallélisés : Accélère les tests en exécutant plusieurs scénarios en parallèle.
* Capture de screenshots et vidéos : Utile pour le debugging des tests.
* Mocks et interception réseau : Permet de tester des cas spécifiques en simulant des réponses API.

Playwright permet aussi d'enregitrer des scenarios de tests automatiquement en naviguant sur l'application via **Codegen**. Cette fonctionnalité permet de générer rapidement des scénarios sans écrire de code.


## Avantages dans un Projet

* Robustesse et Fiabilité : En automatisant les tests E2E, Playwright aide à identifier les bugs et les problèmes de compatibilité entre navigateurs avant qu'ils n'affectent les utilisateurs finaux.
* Gain de Temps : L'automatisation des tests réduit le temps nécessaire pour effectuer des tests manuels, permettant aux développeurs de se concentrer sur d'autres aspects du développement
* Couverture de Test Étendue : En testant sur plusieurs navigateurs, Playwright assure que l'application fonctionne correctement pour une large base d'utilisateurs.


## Ressources

https://www.youtube.com/watch?v=kD1jjfwer5Y&ab_channel=HudsonYuen


## Installation et Configuration

````npm init playwright@latest````

### Configuration

Lors de l'installation, le fichier *playwright.config.ts* est créé à la racine de votre projet. Ce fichier contiendra les paramètres de configuration pour Playwright, comme les navigateurs à utiliser et les options de lancement.

[Voici un exemple de fichier de configuration](https://github.com/gsoulie/angular-resources/blob/master/playwright/playwright.config.ts)    

### baseURL

Il est possible de définir une url de base afin de simplifier le routing lors des tests :

````typescript
export default defineConfig({
  use: {
    baseURL: 'https://my.app.dev',
  },
//  ...
})
````

Utilisation dans les tests : 

````typescript
await page.goto('./auth');  // pointe https://my.app.dev/auth
await page.waitForURL('./dashboard'); // pointe https://my.app.dev/dashboard
await expect(page).toHaveURL('./dashboard');
````

## Écriture des Tests

> [Ecriture des tests](https://playwright.dev/docs/writing-tests)     

Placez vos tests E2E dans un répertoire dédié, par exemple *tests/e2e*. Utilisez les fixtures et les fonctions fournies par Playwright pour écrire vos tests.

````typescript
import { test, expect } from '@playwright/test';

test('La page d’accueil affiche le bon titre', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mon Application/);
});
````

> [Exemple de fichiers de tests](https://github.com/gsoulie/angular-resources/tree/master/playwright/tests)

Créer des regroupements de tests :

````typescript
test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://playwright.dev/');
  });

  test('main navigation', async ({ page }) => {
    // Assertions use the expect API.
    await expect(page).toHaveURL('https://playwright.dev/');
  });
});
````

### Ajouter des restrictions
````
test.skip(process.env.AUTH === '1')

// skip if mobile
test.skip(({isMobile}) => isMobile)
````


## Enregistrer des scénarios avec Codegen

````npx playwright codegen https://ton-site.com````

ou

1 : démarrer le serveur local dans un terminal

2 : lancer codegen dans un second terminal 
````npx playwright codegen localhost:3000 --save-storage=auth.json````

* ````--save-storage=<your-file-name>.json```` : enregistre l'état de connexion (cookies et localStorage) une fois la session terminée

Exemples de commandes :
````
npx playwright codegen localhost:3000/dev -o ./tests/mkp-dev-codegen.spec.ts
npx playwright codegen https://gecet.groupeisia.dev/int/marketplace/auth -o ./tests/mkp-int-codegen.spec.ts --channel=chrome
````

* ````-o <test-filename.spec.ts>```` : permet de copier la sortie dans un fichier
* ````--channel=chrome```` : forcer l'exécution sur un browser précis


Cela va :
✅ Ouvrir un navigateur Playwright
✅ Enregistrer toutes tes interactions (clics, saisies, navigation, etc.)
✅ Générer automatiquement un script de test en TypeScript, JavaScript, Python ou Java

### Gérer l'authentification

De base, la navigation enregistre l'intégralité des saisies. Ce qui signifie que lors de l'authentification, le scénario va enregistrer en clair
le contenu des champs login et mot de passe. Ceci n'étant pas sécurisé, Playwright permet d'enregistrer les informations du contexte d'authentification (cookies et localStorage)
de manière cryptée dans un fichier json.
Ceci permet pour l'exécution des tests, d'utiliser ce contexte pour se connecter à l'application, sans avoir accès en clair aux informations
de connexion dans le fichier de test.

Voici les étapes à suivre pour mettre en place cette fonctionnalité :

1 - créer un répertoire *playwright/.auth* à la racine du projet
2 - créer un fichier json dans ce répertoire qui contiendra les informations de connexion (par ex: 'auth.json')
3 - Dans un terminal, lancer l'application (npm run dev)
4 - dans un second terminal, lancer la génération de test via la commande : 
````npx playwright codegen http://localhost:3000/dev -o ./tests/mkp-localhost-codegen.spec.ts --save-storage=./playwright/.auth/auth.json````
5 - s'authentifier manuellement dans l'application et fermer Codegen. Ceci va implémenter le fichier auth.json avec les informations de connexion
6 - Créer un fichier */tests/auth.setup.ts*
7 - Ajouter la propriété *storageState* dans le projet correspondant dans  le fichier *playwright.config.ts*

Notez que vous devez supprimer l'état stocké à son expiration. Si vous n'avez pas besoin de conserver l'état entre les tests, écrivez l'état du navigateur dans testProject.outputDir, qui est automatiquement nettoyé avant chaque test.

### Personnalisation et modification

Une fois enregistré, on peut modifier ce script pour :

✔ Ajouter des assertions supplémentaires (ex. vérifier la présence d’un élément spécifique)     
✔ Paramétrer les tests avec des variables dynamiques     
✔ Exécuter les tests sur plusieurs navigateurs ou appareils     


## Exécution des Tests

Pour exécuter les tests il suffit d'utiliser les commandes ````npx playwright test````

Il est possible d'ajouter une commande dans le package.json 
````
"scripts": {
  "test:e2e": "playwright test"
}
````
Lancez les tests avec la commande suivante :

````npm run test:e2e````

### Jouer les tests en localhost

Si l'on souhaite jouer les tests en localhost (en mode dev) il suffit de rajouter la configuration suivante dans le fichier *playwright.conf.ts*

````typescript
export default defineConfig({
webServer: {
    command: "npm run dev",

 //command: 'npm run start',
    url: 'http://localhost:3000/dev',
    reuseExistingServer: !process.env.CI,
    // timeout: 120 * 1000,
  },
})
````

Ensuite remplacer les urls utilisées dans les tests (fonction goto...) pour qu'elle pointent vers 'http://localhost:3000'

## Intégration CI/CD

> [Intégration CI](https://playwright.dev/docs/ci)

* Ajouter les éléments suivants dans le fichier de configuration de Playwright

*playwright.config.ts*

````typescript
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

  reporter: [
    ['list'], // Affiche les résultats des tests dans la console
    ['html', { outputFolder: 'test-results' }], // Génère un rapport HTML dans le dossier test-results
    ['junit', { outputFile: 'test-results/e2e-junit-results.xml' }]
  ],
})
````

* Ajouter la commande de test dans la partie script du *package.json*

````
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test --reporter=html"  // <-- nécessaire pour la pipeline
  },
````

