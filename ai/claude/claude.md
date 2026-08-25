# Sections utiles

````markdown
# Principes fondamentaux

- **Communication directe** : aller à l'essentiel, sans verbiage. Limiter les explications au strict nécessaire.
- **Simplicité d'abord** : solution la plus simple possible, impact minimal sur l'existant. Niveau attendu : développeur senior.
- **SOLID, KISS, DRY** : factoriser dès la 2ᵉ duplication de logique **métier** ; dépendre d'abstractions.
- **Pas de paresse** : toujours traiter la cause profonde, jamais de correctif temporaire.
- **Impact minimal** : ne toucher que le strict nécessaire ; aucune régression ; pas de refactorisation opportuniste hors périmètre.
- N'introduire aucun design pattern inutile, aucune optimisation prématurée, aucun code "entreprise" non demandé.
- Lire uniquement les fichiers nécessaires ; ne pas relire un fichier déjà analysé sauf nécessité.
- Attendre une validation avant toute refonte importante.

## Règles impératives

> S'appliquent à chaque interaction dans ce dépôt, sans exception.

- **Ne jamais anticiper une décision fonctionnelle inconnue — toujours demander.**
- Ne pas éditer manuellement du code généré (specs OpenAPI, clients API générés…) ; régénérer via le script dédié.
- Vérifier que l'application **build** et que les **tests passent** avant de valider tout changement.

## Outils

Toujours utiliser les outils dédiés plutôt que des commandes shell génériques :

| Action | Outil correct | À ne pas utiliser |
| --- | --- | --- |
| Lire un fichier | `Read` | `cat`, `head`, `tail` |
| Chercher dans le contenu | `Grep` | `grep`, `rg` |
| Trouver par nom | `Glob` | `find`, `ls` |
| Modifier un fichier | `Edit` | `sed`, `awk` |
| Créer / écraser un fichier | `Write` | `echo >`, `cat <<EOF`, redirections |

Le shell (`Bash`) est réservé aux actions sans outil dédié : `npm run build/test/start`, `ng`, `npx`, `git`, commandes de déploiement…

---

# Avant de valider une tâche

- Ne jamais marquer une tâche terminée sans avoir prouvé qu'elle fonctionne (lint + tests + build pertinents exécutés).
- Se demander : « Un ingénieur senior approuverait-il ceci ? »
- Run `npm run check` avant de committer ; la CI échoue sur les erreurs de lint.

## CHANGELOG

Après toute tâche validée constituant un **changement fonctionnel ou technique fort** (nouvelle fonctionnalité, changement de comportement visible, mise en place/refonte d'outillage structurant, changement d'architecture, correctif de bug impactant) :

- Ajouter une entrée **en haut** de `/CHANGELOG.md` (racine du repo), sous un titre avec la date du jour (`YYYY-MM-DD`).
- Liste concise des changements, format Keep a Changelog (`Added` / `Changed` / `Fixed`).
- Rédigée en **français**.

Ne pas consigner les changements mineurs : correctifs de lint/formatage ponctuels, ajustements de config sans impact fonctionnel, renommages, typos, mises à jour de dépendances mineures, retouches de commentaires/documentation. En cas de doute sur le seuil, demander plutôt que de trancher seul.

Un hook Stop bloque la complétion tant que cette mise à jour n'est pas effectuée.

---

# Style de code

## Commentaires

Par défaut, **ne pas ajouter de commentaires**. Écrire un commentaire uniquement quand le **POURQUOI** n'est pas évident à la lecture : contrainte cachée, invariant subtil, contournement d'un bug spécifique, comportement surprenant. Ne pas commenter ce que les noms des identifiants disent déjà. Ne pas référencer la tâche ou le ticket courant dans les commentaires.

Pour les **fonctions complexes** (logique non triviale, effets de bord, gestion d'état, séquencement asynchrone), ajouter un bloc de commentaires en **français** juste avant la fonction/le bloc, expliquant :

- ce que fait le bloc (intention générale),
- pourquoi cette approche a été choisie (contrainte, règle métier, cas limite),
- tout comportement qui pourrait surprendre un futur lecteur.

## Règles de linting

- Interdiction du type `any` (`noExplicitAny` — erreur)
- Interdiction des variables ou imports inutilisés (`noUnusedVariables`, `noUnusedImports` — erreur)
- Interdiction des assertions de non-null `!` (`noNonNullAssertion` — warn)
- `innerHTML` déclenche un avertissement de sécurité
- Corps de fonction limité à 100 lignes maximum
- Éléments JSX/template auto-fermants requis en l'absence d'enfants

---

# Tests

- **Vitest** pour les tests unitaires et la logique des composants.
- **Playwright** pour les parcours end-to-end.
- Un correctif de bug ajoute un test de régression (qui échoue avant, passe après).
- Tests déterministes : pas de réseau réel, ni dépendance au temps ou à l'ordre d'exécution.

---

# Sécurité & dépendances

- Aucune dépendance ajoutée sans justification (préférer la plateforme/standard).
- Routes protégées `[Authorize]`.
- Entrées validées (DataAnnotations + invariants de domaine).
- Secrets externalisés (jamais en code/config/CI).
- PKCE obligatoire, ROPC interdit.

---

# Accessibilité (non négociable)

- **WCAG 2.1 AA / RGAA 4.1.2** : HTML sémantique, libellés associés, erreurs restituées hors couleur seule (ARIA), focus visible, navigation clavier, contrastes.
- **Responsive** mobile / tablette / desktop sans débordement horizontal.
- Préférer les éléments sémantiques natifs et les primitives CDK a11y aux rustines ARIA.
- Couvrir les pages/flux par la suite Playwright + axe-core sous `e2e/accessibility/` ; zéro violation avant merge.

````

## Spécificités Angular 

````markdown
## Bonnes pratiques Angular

### Architecture des composants

- **Standalone uniquement** : pas de `NgModule` pour du nouveau code. Composants,
  directives et pipes en `standalone`.
- **`ChangeDetectionStrategy.OnPush`** sur tous les composants.
- **Signals** (`signal`, `computed`, `effect`) pour l'état et les valeurs dérivées,
  plutôt que des champs mutables ou des souscriptions manuelles. Utiliser `input()` /
  `output()` (signal-based) et `model()` pour le two-way binding.
- **Injection via `inject()`** plutôt que l'injection par constructeur.
- **Flux de contrôle natif** dans les templates : `@if`, `@for` (avec `track`), `@switch`.
  Pas de `*ngIf` / `*ngFor`.
- **Lazy loading** au niveau des routes de fonctionnalité ; pas de dépendance lourde dans
  le bundle initial.

### Type safety & validation

- TypeScript `strict` et `strictTemplates` restent activés ; ne pas les affaiblir pour
  faire compiler.
- `any` interdit sauf à une frontière documentée et justifiée.
- Toute donnée externe (réponses HTTP, params de route, storage, SDK) validée à
  l'exécution avec **Zod** avant usage ; le type inféré par Zod fait foi.

### Style & UI

- **SCSS** pour les styles. Respecter le budget `anyComponentStyle` de `angular.json`.
- Privilégier **Angular Material** et **Angular CDK** pour les primitives interactives.
- TailwindCSS v4

````
