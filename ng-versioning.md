[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

## Gestion du versioning avec Git Tag

Ce document présente comment mettre en place le versionning pour les frontends Angular et NextJS, de manière automatisée avec Git Tag.

Ce que l'on cherche à éviter pour gérer le versioning d'application :

* Gérer manuellement les numéros de versions
* Modifier package.json manuellement
* Commit de version dans le code manuellement
* Hardcoder la version dans l'application
* Version locale différente de prod

**La solution proposée s'appuie sur le Git Tag et l'injection via les pipelines CI/CD**

````
git tag v2.4.1
        ↓
CI récupère tag
        ↓
CI calcule commits depuis tag = BUILD
        ↓
Version finale = 2.4.1.BUILD
        ↓
Injection build-time
        ↓
Build frontend

````

Les avantages de la méthode sont les suivants : 

✅ Git Tag comme source de vérité   
✅ Version calculée automatiquement   
✅ .env.production généré en CI (NextJS)   
✅ NEXT_PUBLIC_* pour exposition frontend (NextJS)  
✅ Aucun fichier versionné manuellement

### Création du Git Tag 

Le tag de version doit respepcter le standard **[SemVer](https://semver.org/lang/fr/)**

````
MAJOR.MINOR.PATCH[.BUILD]
````

|Champ|Gestion|Responsable|
|-|-|-|
|MAJOR|breaking change|manuel (rare)|
|MINOR|feature|automatique ou manuel PR label|
|PATCH|bugfix|automatique|
|BUILD (optionnel)|pipeline|	automatique|

> Le BUILD est idéal pour différencier deux déploiements sans changer la version fonctionnelle


### Intégration Angular

Utiliser les fichiers environnement Angular pour gérer une variable ````appVersion```` :

*app/environments/environment.template.ts*

````typescript
export const environment = {
  production: true,
  appVersion: "${APP_VERSION}"
};
````

*app/environments/environment.ts* : fichier **local** à ajouter dans le *.gitignore* pour ne pas le committer
````typescript
export const environment = {
  production: false,
  appVersion: 'v1.0.0'
};
````

> **Fonctionnement** : Lors de la compilation, la pipeline prendra le fichier *environment.template.ts* comme modèle, remplacera les mots clés et substituera ce contenu à celui du fichier *environment.ts*

*Pipeline de build* (ajuster les triggers selon le besoin)
<details>
  <summary>Code YML</summary>

````
name: Build

on:
  push:
    branches: [main, master]
    tags:
      - 'v*.*.*'
  pull_request:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # obligatoire pour lire les tags

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ------------------------------------------------
      # VERSION COMPUTATION (ONLY WHEN TAG BUILD)
      # ------------------------------------------------

      - name: Compute version from Git Tag
        if: startsWith(github.ref, 'refs/tags/')
        run: |
          TAG=${GITHUB_REF#refs/tags/}

          echo "Detected tag: $TAG"

          if [[ ! $TAG =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "❌ Invalid tag format"
            exit 1
          fi

          BASE_VERSION=${TAG#v}
          COMMITS=$(git rev-list ${TAG}..HEAD --count)

          VERSION="${BASE_VERSION}.${COMMITS}"

          echo "APP_VERSION=$VERSION" >> $GITHUB_ENV
          echo "✔ Computed version: $VERSION"  

      # ------------------------------------------------
      # DEFAULT VERSION FOR NON TAG BUILDS (DEV/PR)
      # ------------------------------------------------

      - name: Set dev version fallback
        if: "!startsWith(github.ref, 'refs/tags/')"
        run: |
          VERSION="dev-${GITHUB_RUN_NUMBER}"
          echo "APP_VERSION=$VERSION" >> $GITHUB_ENV
          echo "✔ Dev version: $VERSION"


      # Injection des variables dans environment.prod.ts
      - name: Inject environment variables + version
        run: |
          envsubst < src/app/environments/environment.template.ts > src/app/environments/environment.ts

          # Fail si placeholder non remplacé
          grep -q '\${APP_VERSION}' src/app/environments/environment.ts && exit 1 || echo "✔ Version injected"


      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Build Angular app
        run: npm run build -- --configuration=production

      # ------------------------------------------------
      # VERSION TRACEABILITY (ARTIFACT)
      # ------------------------------------------------

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: angular-build
          path: dist/<appName>/browser
     
````

*Utilisationd du numéro de version dans l'appli*
````typescript
import { environment } from '../environments/environment';

this.version = environment.version;
````
  
</details>




### Intégration NexJS

> **Fonctionnement** : Dans un front NextJS, la configuration se fait via les fichiers *.env*. La pipeline viandra écraser la valeur lors de la compilation

*.env.production*
````
NEXT_PUBLIC_APP_VERSION=2.4.0.3
````

*Utilisation*
````
const version = process.env.NEXT_PUBLIC_APP_VERSION
````

*Pipeline de build* (ajuster les triggers selon le besoin)
<details>
  <summary>Code YML</summary>

````yml
name: Build Next.js

on:
  push:
    branches: [main, master]
    tags:
      - 'v*.*.*'
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # obligatoire pour lire les tags

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ------------------------------------------------
      # VERSION COMPUTATION (ONLY WHEN TAG BUILD)
      # ------------------------------------------------

      - name: Compute version from Git Tag
        if: startsWith(github.ref, 'refs/tags/')
        run: |
          TAG=${GITHUB_REF#refs/tags/}

          echo "Detected tag: $TAG"

          if [[ ! $TAG =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "❌ Invalid tag format"
            exit 1
          fi

          BASE_VERSION=${TAG#v}
          COMMITS=$(git rev-list ${TAG}..HEAD --count)
          VERSION="${BASE_VERSION}.${COMMITS}"

          echo "NEXT_PUBLIC_APP_VERSION=$VERSION" >> $GITHUB_ENV
          echo "✔ Computed version: $VERSION"

      # ------------------------------------------------
      # DEFAULT VERSION FOR NON TAG BUILDS (DEV/PR)
      # ------------------------------------------------

      - name: Set dev version fallback
        if: "!startsWith(github.ref, 'refs/tags/')"
        run: |
          VERSION="dev-${GITHUB_RUN_NUMBER}"
          echo "NEXT_PUBLIC_APP_VERSION=$VERSION" >> $GITHUB_ENV
          echo "✔ Dev version: $VERSION"

      # ------------------------------------------------
      # ENV INJECTION (Next.js equivalent of environment.ts)
      # ------------------------------------------------

      - name: Generate .env.production
        run: |
          echo "NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION" > .env.production

          # Fail si la variable n’est pas injectée
          grep -q "NEXT_PUBLIC_APP_VERSION" .env.production || exit 1
          echo "✔ .env.production generated"

      - name: Install dependencies
        run: npm install

      - name: Build Next.js app
        run: npm run build

      # ------------------------------------------------
      # VERSION TRACEABILITY (ARTIFACT)
      # ------------------------------------------------

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: |
            .next
            .env.production

````

</details>
