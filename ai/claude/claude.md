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

## Politique de dépendances
- Ne pas installer automatiquement de package.
- Vérifier si une dépendance existante répond déjà au besoin.
- Éviter les dépendances inutiles.
- Privilégier les packages activement maintenus.
- Vérifier les licences lorsque nécessaire.
- Évaluer les vulnérabilités connues.
- Éviter les dépendances transitives inutiles.

---

# Accessibilité (non négociable)

- **WCAG 2.1 AA / RGAA 4.1.2** : HTML sémantique, libellés associés, erreurs restituées hors couleur seule (ARIA), focus visible, navigation clavier, contrastes.
- **Responsive** mobile / tablette / desktop sans débordement horizontal.
- Préférer les éléments sémantiques natifs et les primitives CDK a11y aux rustines ARIA.
- Couvrir les pages/flux par la suite Playwright + axe-core sous `e2e/accessibility/` ; zéro violation avant merge.

# Vérification avant validation

- **Ne jamais marquer une tâche terminée sans avoir vérifié son bon fonctionnement** : exécuter le lint pertinent, les tests pertinents et le build du sous-projet concerné. Ne pas considérer une tâche comme terminée tant que ces vérifications ne sont pas passées, sauf impossibilité explicitement signalée.
- **Relecture senior** : avant de valider, se demander : « Un ingénieur senior approuverait-il ce changement en l'état ? » Vérifier notamment la lisibilité, la simplicité, la cohésion, la maintenabilité, la sécurité, la gestion des erreurs et l'absence de complexité ou d'abstraction inutile.
- **Changelog** : après toute tâche validée constituant un changement **fonctionnel ou technique fort** (nouvelle fonctionnalité, changement de comportement visible, mise en place ou refonte d'un outillage structurant, changement d'architecture, correctif de bug impactant), ajouter une entrée **en haut** de `/CHANGELOG.md` (à la racine du repo), sous un titre portant la date de validation au format `YYYY-MM-DD`.
Respecter le format Keep a Changelog (`Added` / `Changed` / `Fixed`) et rédiger l'entrée en français. La description doit rester concise et présenter le changement du point de vue du projet, pas détailler les étapes internes de son implémentation.
- **Changelog — changements mineurs** : ne pas consigner les changements mineurs ou de détail : correctifs de lint/formatage ponctuels, ajustements de configuration sans impact fonctionnel, renommages, typos, mises à jour mineures de dépendances, retouches de commentaires ou de documentation.
En cas de doute sur le franchissement du seuil, demander plutôt que de trancher seul.
- **Contrôle de duplication** : relire le diff complet produit et se demander : « Ai-je ajouté un bloc qui ressemble à un bloc déjà présent dans un fichier que je touche ? » Si oui, rechercher la logique existante et la factoriser ou la réutiliser avant de valider. Ne pas conserver volontairement une duplication au seul motif que la modification du code existant augmenterait le diff.
Effectuer également un contrôle plus général : « Ai-je introduit une fonction, constante, service, abstraction ou structure de données qui existe déjà ailleurs dans le projet ? » Si oui, réutiliser ou factoriser l'existant lorsque les responsabilités et comportements sont réellement communs.
- **Tests après factorisation** : lorsqu'une factorisation ou une modification d'une logique existante a été effectuée, mettre à jour ou compléter les tests concernés dans le même changement et vérifier à nouveau que la suite pertinente est verte.
````

## VARIANTES PRINCIPES FONDAMENTAUX

````markdown
- **SOLID, KISS, DRY** : appliquer ces principes par défaut. Une même règle métier ou logique technique ne doit pas être implémentée indépendamment à plusieurs zndroits lorsqu'elle peut raisonnablement être factorisée. En particulier, le moment à risque est l'ajout du _jumeau_ d'une chose existante : une 2ᵉ liste, un 2ᵉ export, un 2ᵉ filtre, un 2ᵉ appel réactif du même type, etc.
  Avant d'écrire ce jumeau, rechercher et lire la version existante, puis factoriser les deux usages **dans le même changement**. Ne jamais copier du code en prévoyant une factorisation ultérieure. Les commentaires ou formulations du type « symétrique de X », « comme X », « même logique que X » ou « à garder en phase avec X » signalent généralement une duplication qui doit être examinée. Ils ne constituent pas une justification pour maintenir deux implémentations indépendantes.
  La factorisation doit rester proportionnée : ne pas créer une abstraction artificielle uniquement pour supprimer quelques lignes de code similaires. Factoriser lorsque les éléments partagent réellement une responsabilité, une règle métier ou une logique évolutive commune.
- **Simplicité d'abord** : chaque changement aussi simple que possible, impact minimal.
- **Pas de paresse** : traiter les causes profondes, jamais de correctif temporaire. Niveau attendu : développeur senior.
- **Impact minimal** : ne toucher que le strict nécessaire, ne pas introduire de régression et ne pas refactoriser hors périmètre. Le périmètre s'entend **par fichier touché**, pas par ligne : extraire une responsabilité ou factoriser un bloc existant avec celui que l'on ajoute, dans un fichier déjà modifié, fait partie du travail attendu.
  En revanche, ne pas modifier des fichiers voisins non concernés par la tâche et ne pas changer de comportement existant sans nécessité fonctionnelle ou technique démontrée.
  **Arbitrage** : dans un fichier déjà modifié, DRY l'emporte sur « impact minimal ». Dupliquer du code pour éviter de toucher au code voisin est un contournement, pas une précaution. Toute factorisation modifiant une logique existante doit être accompagnée de la mise à jour des tests concernés dans le même changement. Les tests existants et nouveaux doivent rester verts.
- **Une responsabilité cohérente par fichier** : avant d'ajouter du code à un fichier existant, vérifier que la nouvelle logique relève de la responsabilité déjà portée par ce fichier.
  Si ce n'est pas le cas, extraire la logique vers l'abstraction appropriée (fonction pure, service, store, composant, utilitaire, etc.) plutôt que d'ajouter une nouvelle responsabilité au fichier.
  Ne pas créer artificiellement de nouveaux fichiers ou abstractions pour de simples fragments de code. L'extraction est justifiée lorsqu'elle améliore réellement la cohésion, la testabilité, la réutilisabilité ou la maintenabilité.
  **« Impact minimal » n'autorise jamais à ajouter une Nième responsabilité à un fichier qui en porte déjà plusieurs, ni à y ajouter une copie d'une logique qu'il contient déjà.**
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
