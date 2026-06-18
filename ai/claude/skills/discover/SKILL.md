---
name: discover
description: >
  Analyse complète d'un projet frontend inconnu pour produire un document d'onboarding technique
  structuré (functional-analysis_<date>.md). Déclencher ce skill dès que l'utilisateur tape /discover,
  demande une "analyse de projet", veut "comprendre un nouveau projet", effectue un "onboarding technique",
  ou demande une "cartographie du code". Également déclencher si l'utilisateur demande à comprendre
  l'architecture, les fonctionnalités principales, ou les flux d'un projet existant.
  Ce skill est spécialement conçu pour les projets Angular, React et NextJS, mais s'applique
  à tout projet frontend moderne.
---

# Skill : /discover

Analyse rapide d'un projet frontend inconnu pour produire une vision claire, structurée et exploitable
du produit, de son architecture technique et de ses principaux workflows.

## Déclenchement

Ce skill se déclenche sur :

- La commande `/discover`
- Toute demande d'analyse globale d'un projet existant
- Les demandes d'onboarding technique sur une base de code inconnue

---

## Étape 0 — Préparation

Avant toute analyse, identifier le répertoire racine du projet :

- Si un chemin est fourni par l'utilisateur, l'utiliser
- Sinon, inspecter le répertoire courant : `ls -la` puis `find . -maxdepth 2 -name "package.json" | head -5`
- Confirmer silencieusement la racine trouvée avant de démarrer

---

## Étape 1 — Collecte des fichiers de configuration

Lire les fichiers suivants **s'ils existent** (ne jamais inventer leur contenu) :

**Build & runtime**

- `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- `angular.json`, `project.json`, `nx.json`, `workspace.json`
- `next.config.*`, `vite.config.*`, `webpack.config.*`
- `tsconfig*.json`
- `turbo.json`

**Qualité & style**

- `.eslintrc*`, `eslint.config.*`, `prettier.config.*`, `.prettierrc*`
- `tailwind.config.*`, `postcss.config.*`

**Tests**

- `jest.config.*`, `vitest.config.*`, `playwright.config.*`, `cypress.config.*`

**Environnements**

- `.env`, `.env.*`, `environment.ts`, `environments/`

**CI/CD & infra**

- `.github/workflows/`, `.gitlab-ci.yml`, `Dockerfile`, `docker-compose*`

**Commande utile pour scanner rapidement :**

```bash
find . -maxdepth 2 \( -name "*.json" -o -name "*.config.*" -o -name ".env*" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" | sort
```

---

## Étape 2 — Cartographie de la structure

Générer une arborescence des dossiers significatifs (exclure `node_modules`, `.git`, `dist`, `.next`, `coverage`) :

```bash
find . -type d ! -path "*/node_modules/*" ! -path "*/.git/*" \
  ! -path "*/dist/*" ! -path "*/.next/*" ! -path "*/coverage/*" \
  -maxdepth 5 | sort | head -80
```

Identifier :

- Dossiers `pages/`, `app/` (routing NextJS/Angular)
- Dossiers `components/`, `shared/`, `common/`
- Dossiers `features/`, `modules/`, `domain/`
- Dossiers `services/`, `api/`, `http/`
- Dossiers `store/`, `state/`, `context/`
- Dossiers `hooks/`, `composables/`
- Dossiers `guards/`, `interceptors/`, `middleware/`
- Dossiers `models/`, `types/`, `dto/`
- Dossiers `utils/`, `helpers/`, `lib/`
- Dossiers `assets/`, `styles/`, `i18n/`

---

## Étape 3 — Analyse du code source

### Points d'entrée

Lire selon le framework détecté :

- **NextJS** : `app/layout.tsx`, `app/page.tsx`, `pages/_app.tsx`, `pages/index.tsx`
- **Angular** : `main.ts`, `app.module.ts` ou `app.config.ts`, `app-routing.module.ts` ou `app.routes.ts`
- **React/Vite** : `main.tsx`, `App.tsx`, `router.tsx`

### Routing

- **NextJS App Router** : analyser la structure `app/` (dossiers = routes)
- **NextJS Pages** : analyser `pages/`
- **Angular** : lire `app.routes.ts`, `app-routing.module.ts` et les routes lazy-loaded
- **React Router** : lire les fichiers de définition de routes

### Gestion d'état

Chercher selon le framework :

```bash
grep -r "createStore\|configureStore\|createSlice\|NgRx\|StoreModule\|pinia\|zustand\|jotai\|signal\|BehaviorSubject" \
  --include="*.ts" --include="*.tsx" -l . | grep -v node_modules | head -20
```

### Appels HTTP / API

```bash
grep -r "HttpClient\|axios\|fetch\|useQuery\|useMutation\|trpc\|ApiService\|http\." \
  --include="*.ts" --include="*.tsx" -l . | grep -v node_modules | head -20
```

### Authentification

```bash
grep -r "AuthGuard\|canActivate\|useAuth\|getSession\|signIn\|jwt\|token\|AuthService\|middleware" \
  --include="*.ts" --include="*.tsx" -l . | grep -v node_modules | head -15
```

### Internationalisation

```bash
grep -r "i18n\|useTranslation\|TranslateModule\|ngx-translate\|next-intl\|formatMessage" \
  --include="*.ts" --include="*.tsx" -l . | grep -v node_modules | head -10
```

---

## Étape 4 — Analyse fonctionnelle

Pour chaque feature ou module identifié, analyser **uniquement ce qui est visible dans le code** :

- Nom et description synthétique
- Routes associées
- Composants principaux
- Services / hooks impliqués
- APIs consommées si identifiables

Ne pas inventer de fonctionnalités. Si la logique métier est opaque, le mentionner explicitement.

---

## Étape 5 — Analyse qualité

Évaluer rapidement :

- Cohérence de l'architecture (séparation des responsabilités)
- Conventions de nommage observées
- Présence et stratégie de tests
- Qualité du typage TypeScript (strict mode, usage de `any`)
- Dette technique visible (fichiers volumineux, couplage fort, duplication)
- Respect des patterns modernes du framework

```bash
# Vérifier le mode strict TypeScript
grep -r "strict\|noImplicitAny" tsconfig*.json

# Repérer les fichiers volumineux
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | \
  xargs wc -l 2>/dev/null | sort -rn | head -15
```

---

## Étape 6 — Production du document

Créer le fichier **`functional-analysis_<YYYY-MM-DD>.md`** dans le répertoire racine du projet.

La date doit être la date réelle du jour (utiliser `date +%Y-%m-%d` si disponible).

### Structure obligatoire du document

```markdown
# Analyse fonctionnelle — <Nom du projet>

> Généré le <date> | Stack : <framework> <version>

---

## 1. Présentation du projet

### Objectif

<!-- Ce que fait l'application, son domaine métier -->

### Stack technique

| Catégorie | Technologie | Version |
| --------- | ----------- | ------- |
| Framework | ...         | ...     |
| ...       | ...         | ...     |

---

## 2. Architecture générale

### Pattern architectural

<!-- Feature-based, Domain-driven, Layered, etc. -->

### Arborescence simplifiée
```

src/
├── app/ # ...
├── features/ # ...
└── shared/ # ...

```

### Conventions identifiées
<!-- Nommage, organisation, patterns récurrents -->

---

## 3. Fonctionnalités principales

### <Nom de la feature>
- **Description** : ...
- **Routes** : ...
- **Composants clés** : ...
- **Services/Hooks** : ...
- **APIs** : ...

<!-- Répéter pour chaque feature -->

---

## 4. Routing et navigation

<!-- Tableau ou liste des routes principales -->
| Route | Composant / Page | Guard | Description |
|-------|-----------------|-------|-------------|

---

## 5. Gestion des données

### Appels API
<!-- Endpoints identifiés, clients HTTP utilisés -->

### Gestion d'état
<!-- Store, signals, context, services -->

### Cache / Optimistic updates
<!-- Si détecté -->

---

## 6. Authentification et sécurité

- **Mécanisme** : ...
- **Guards / Middleware** : ...
- **Gestion des tokens** : ...
- **Permissions** : ...

---

## 7. Environnements et configuration

| Variable | Rôle | Environnements |
|----------|------|----------------|

---

## 8. Workflows principaux

### Workflow : <Nom>
1. Point d'entrée : ...
2. Composants impliqués : ...
3. Services : ...
4. Flux de données : ...

---

## 9. Qualité et testing

- **Stratégie de test** : ...
- **Couverture apparente** : ...
- **Outils** : ...
- **Qualité TypeScript** : ...

---

## 10. Points d'attention techniques

<!-- Zones sensibles, risques, couplages forts -->

---

## 11. Dette technique visible

<!-- Dette identifiée uniquement sur la base du code observé -->

---

## 12. Dépendances critiques

| Dépendance | Rôle | Risque |
|------------|------|--------|

---

## 13. Fichiers et dossiers importants

| Fichier / Dossier | Rôle |
|-------------------|------|

---

## 14. Recommandations de prise en main

1. Commencer par lire : ...
2. Points à clarifier avec l'équipe : ...
3. Zones à approfondir : ...
```

---

## Règles absolues

1. **Ne jamais inventer** d'informations. Si une donnée est absente, écrire : `Non identifié dans le code source.`
2. **Baser chaque affirmation** sur un fichier ou un pattern réellement observé
3. **Mentionner explicitement** les zones où l'analyse est incomplète ou incertaine
4. **Pas de contenu générique** : chaque section doit refléter ce projet spécifique
5. **Prioriser la densité d'information** : tableaux > listes > prose

---

## Comportement en cas de projet incomplet ou inhabituel

- Monorepo détecté (nx, turborepo) → analyser chaque app séparément et le signaler
- Pas de `src/` → adapter la cartographie à la structure réelle
- Framework non reconnu → documenter la stack observée sans catégoriser
- Projet vide ou minimal → le noter et produire un document partiel honnête

---

## Sortie finale

Après création du fichier :

1. Afficher le chemin du fichier généré
2. Donner un résumé en 5 à 8 lignes de ce qui a été identifié
3. Signaler les zones où l'analyse est incomplète et pourquoi
4. Proposer d'approfondir un aspect spécifique si l'utilisateur le souhaite
