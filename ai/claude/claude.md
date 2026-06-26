# Sections utiles

````markdown

## Principes fondamentaux

- **Communication directe** : aller à l'essentiel, sans verbiage.
- **Code modulaire et évolutif** : découper par responsabilité, favoriser la réutilisation.
- **SOLID, KISS, DRY** : appliquer ces principes par défaut.
- **Simplicité d'abord** : chaque changement aussi simple que possible, impact minimal.
- **Pas de paresse** : traiter les causes profondes, jamais de correctif temporaire.
  Niveau attendu : développeur senior.
- **Impact minimal** : ne toucher que le strict nécessaire, ne pas introduire de régression.
- **CHANGELOG** : tracer toute nouvelle fonctionnalité dans `CHANGELOG.md` (date + liste). Documente en français.

## Vérification avant validation

- Ne jamais marquer une tâche terminée sans avoir prouvé qu'elle fonctionne
  (lint + tests + build pertinents exécutés).
- Se demander : « Un ingénieur senior approuverait-il ceci ? »
- **Post-task Hook :** Une fois le code validé, mets à jour le fichier `CHANGELOG.md` à la racine en y ajoutant la date du jour et la liste concise des fonctionnalités ajoutées.

## Règles impératives

> Ces règles s'appliquent à chaque interaction dans ce dépôt, sans exception.

- **Ne jamais anticiper une décision fonctionnelle inconnue — toujours demander.**
- **Traiter les causes profondes, jamais de correctif temporaire.** Niveau attendu : développeur senior.
- **Impact minimal** : ne toucher que le strict nécessaire, ne pas introduire de régression, ne pas refactoriser hors périmètre.
- Vérifier que l'application **build** et que les **tests passent** avant de valider un changement.
- Ne pas éditer manuellement du code généré (specs OpenAPI, clients API générés…) ; régénérer via le script dédié.
- **Toujours utiliser les outils dédiés** plutôt que des commandes shell génériques :

  | Action | Outil correct | À ne pas utiliser |
  | --- | --- | --- |
  | Lire un fichier | `Read` | `cat`, `head`, `tail` |
  | Chercher dans le contenu | `Grep` | `grep`, `rg` |
  | Trouver par nom | `Glob` | `find`, `ls` |
  | Modifier un fichier | `Edit` | `sed`, `awk` |
  | Créer / écraser un fichier | `Write` | `echo >`, `cat <<EOF`, redirections |

  Le shell (`Bash`) est **réservé aux actions sans outil dédié** : `npm run build/test/start`, `ng`, `npx`, `git`, commandes de déploiement…

---

## Commentaires dans le code

Par défaut, **ne pas ajouter de commentaires**. Écrire un commentaire uniquement quand le **POURQUOI** n'est pas évident à la lecture : contrainte cachée, invariant subtil, contournement d'un bug spécifique, comportement surprenant.

Pour les **fonctions complexes** (logique non triviale, effets de bord, gestion d'état, séquencement asynchrone), ajouter un bloc de commentaires en **français** juste avant la fonction ou le bloc concerné. Ce commentaire doit expliquer :

- ce que fait le bloc / la fonction (intention générale),
- pourquoi cette approche a été choisie (contrainte, règle métier, cas limite),
- tout comportement qui pourrait surprendre un futur lecteur.

Ne pas commenter ce que les noms des identifiants disent déjà. Ne pas référencer la tâche ou le ticket courant dans les commentaires.

---

## Changelog

Après toute tâche validée ayant modifié du code, ajouter une entrée **en haut** de `/CHANGELOG.md` sous un titre avec la date du jour (`YYYY-MM-DD`), avec une liste concise des fonctionnalités ou changements. Suivre le format Keep a Changelog (`Added` / `Changed` / `Fixed`). Rédiger en **français**.

Un hook Stop bloque la complétion tant que cette mise à jour n'est pas effectuée.

---

## Tests

- **Vitest** pour les tests unitaires et la logique des composants
- **Playwright** pour les parcours end-to-end.
- Un correctif de bug ajoute un test de régression (qui échoue avant, passe après).
- Tests déterministes : pas de réseau réel, ni dépendance au temps ou à l'ordre d'exécution.

---

## Accessibilité (non négociable)

- WCAG 2.1 AA. UI entièrement utilisable au clavier, rôles/états corrects, focus visible.
- Préférer les éléments sémantiques natifs et les primitives CDK a11y aux rustines ARIA.
- Couvrir les pages/flux par la suite Playwright + axe-core sous `e2e/accessibility/` ;
  zéro violation avant merge.

---

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
