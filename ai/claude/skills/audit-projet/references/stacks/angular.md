# Référence Angular

À lire uniquement si `@angular/core` est détecté. Cible : Angular moderne (v22+). **Adapte toujours le jugement à la version réellement installée** : une recommandation n'est un écart que si la version du projet la permet. Pour une version ancienne, le premier finding est la migration elle-même.

## Sommaire
1. Version et support
2. Architecture et API modernes
3. Réactivité, détection de changements et fuites mémoire
4. Templates
5. Sécurité spécifique
6. Performance
7. Tests et outillage
8. Interpréter les métriques de la collecte

---

## 1. Version et support

Angular publie une version majeure environ tous les 6 mois. Chaque version est supportée 18 mois (6 mois actifs + 12 mois LTS). Vérifie la politique à jour sur angular.dev/reference/releases plutôt que de supposer.

- Version hors support → `HIGH` (plus de correctifs de sécurité).
- Version en LTS mais avec plus de deux majeures de retard → `MEDIUM`, avec un chemin de migration (`ng update`, une majeure à la fois).
- Désalignements entre paquets `@angular/*` → `MEDIUM`.
- Vérifie aussi la compatibilité TypeScript et Node déclarée.

## 2. Architecture et API modernes

| Sujet | Attendu (version compatible) | Pourquoi |
| --- | --- | --- |
| Standalone | Composants standalone ; `NgModule` réservé au legacy ou aux librairies tierces | Standalone est le défaut depuis v19 ; les NgModules ajoutent de l'indirection sans bénéfice. Ne compte **pas** `standalone: true` : son absence est normale. Seuls `standalone: false` et `@NgModule` sont des signaux. |
| Bootstrap | `bootstrapApplication` + `app.config.ts` avec `provide*()` | Configuration fonctionnelle, tree-shakable. |
| Injection | `inject()` plutôt que l'injection par constructeur | Compatible avec l'héritage, les fonctions (guards, interceptors, resolvers fonctionnels) et les initialiseurs de champs. Un mélange des deux styles est un `LOW` de cohérence, pas un défaut. |
| Inputs/outputs | `input()`, `input.required()`, `output()`, `model()` | Inputs réactifs typés, fin des `ngOnChanges`. `@Input()`/`@Output()` restent valides : c'est de la dette de modernisation (`LOW`/`MEDIUM` selon le volume), pas un bug. |
| Requêtes de vue | `viewChild()`, `viewChildren()`, `contentChild()` | Signaux au lieu de hooks de cycle de vie. |
| Guards/interceptors | Fonctionnels (`CanActivateFn`, `HttpInterceptorFn`) | Les versions classe sont dépréciées. |
| État | Signaux pour l'état local/partagé simple ; NgRx SignalStore ou service à signaux pour l'état complexe ; RxJS pour les flux d'événements asynchrones | Juge la **cohérence** et l'adéquation à la complexité, pas la présence d'une librairie. Un store global pour trois écrans est de la sur-ingénierie. |
| Formulaires | Reactive Forms typés (`FormGroup<…>`, `nonNullable`) | Les Signal Forms sont récents : leur absence n'est pas un défaut. |
| Style guide | Guide officiel révisé en 2025 (v20) : suffixes `.component`/`.service` facultatifs, organisation par fonctionnalité, `protected` pour les membres utilisés par le template | Ne pénalise pas les anciens suffixes ; signale seulement l'incohérence au sein d'un même projet. |

Signaux d'architecture à chercher en lisant le code :
- composants de plus de ~400 lignes ou mêlant appels HTTP, logique métier et présentation ;
- services « fourre-tout » ;
- logique métier dans les templates ;
- dépendances circulaires entre features ;
- `any` dans les modèles de données API ;
- appels HTTP directs dans les composants sans couche d'accès.

## 3. Réactivité, détection de changements et fuites mémoire

**Zoneless.** Les nouveaux projets sont zoneless par défaut dans les versions récentes (`provideZonelessChangeDetection`, pas de `zone.js` dans les polyfills). Sur un projet existant, rester sous zone.js n'est pas un défaut en soi. Signale-le comme une opportunité (`LOW`) si le code est déjà majoritairement à base de signaux et d'OnPush.

**OnPush.** Il est recommandé sur tous les composants d'une application qui n'est pas zoneless. Interprétation : plutôt qu'un seuil fixe, regarde *quels* composants ne sont pas OnPush. Des composants de liste ou fréquemment rendus sans OnPush → `MEDIUM`. Des composants feuilles triviaux → `LOW`. En zoneless, OnPush reste une bonne pratique mais son absence pèse moins.

**`effect()`.** Il est réservé aux effets de bord : synchronisation avec le DOM, le stockage ou des API non Angular. Un `effect()` qui écrit dans un autre signal pour dériver un état est un anti-pattern (`MEDIUM`) : utilise `computed()` ou `linkedSignal()`.

**Fuites de souscription.** Ne calcule pas un ratio aveugle subscribe/takeUntil. Pour chaque `.subscribe(` dans un composant, une directive ou un service non root, vérifie :
- Observable HTTP (`HttpClient`) → se complète seul, pas de fuite (mais souscription impérative souvent remplaçable par `toSignal` ou `httpResource`).
- `takeUntilDestroyed()`, `take(1)`, `first()`, pipe `async`, `toSignal()` → géré.
- `interval`, `fromEvent`, `Subject`/`BehaviorSubject` d'un service, `valueChanges`, `router.events`, store → **fuite probable si non géré** : `HIGH` si le composant est instancié de façon répétée (routes, listes), `MEDIUM` sinon.
- Souscriptions imbriquées (`subscribe` dans `subscribe`) → `MEDIUM` : remplacer par `switchMap`/`concatMap`.

## 4. Templates

- Le control flow moderne (`@if`, `@for`, `@switch`) est préféré à `*ngIf`/`*ngFor` (dépréciés dans les versions récentes). La migration est automatisable (`ng generate @angular/core:control-flow`). Legacy restant → `LOW` à `MEDIUM` selon le volume et la version.
- `@for` exige `track`. Un `track $index` sur des listes dont les éléments peuvent être réordonnés ou modifiés → `MEDIUM` (rendu incorrect et coûteux). Préfère un identifiant stable.
- Appels de méthodes dans les templates (`{{ compute() }}`) sur des fonctions non-signal coûteuses → `MEDIUM` ; `computed()` ou pipe pur.
- `@defer` pour les blocs lourds sous la ligne de flottaison : opportunité, pas défaut.
- `strictTemplates: true` dans `angularCompilerOptions` → son absence est un `MEDIUM` (erreurs de binding non détectées).

## 5. Sécurité spécifique

- Angular échappe et assainit par défaut. Le risque XSS vient des contournements : `bypassSecurityTrustHtml/Url/ResourceUrl/Script/Style` avec une donnée non maîtrisée → `CRITICAL` si la donnée vient de l'utilisateur ou d'une API, `HIGH` sinon. `[innerHTML]` reste assaini, donc c'est un risque faible sauf s'il est combiné à un `bypass`. `ElementRef.nativeElement.innerHTML = …` court-circuite l'assainissement → `HIGH`.
- Rendu SSR : aucune donnée sensible dans `TransferState` ; ne pas se fier aux guards côté client pour l'autorisation (toute autorisation est revalidée côté serveur).
- Guards de route = confort UX, jamais une frontière de sécurité. Si l'API ne vérifie pas les droits, c'est un finding A01 côté backend.
- Jetons : les stocker dans `localStorage` expose au vol par XSS ; un cookie `HttpOnly` + `SameSite` est préféré. Traite-le comme un `MEDIUM`, ou `HIGH` si l'application contient d'autres vecteurs XSS.
- CSP : `security.autoCsp` dans `angular.json` (build) ou en-têtes côté serveur. Absence totale de CSP → `MEDIUM` (A02).
- Interceptors HTTP : vérifier qu'ils n'envoient pas le jeton à des domaines tiers (comparaison d'URL stricte).

## 6. Performance

- Routes chargées en lazy (`loadComponent`/`loadChildren`) pour toute feature non critique. Une application de plus de 5 routes entièrement eager → `MEDIUM`.
- Builder `@angular/build:application` (esbuild/Vite). L'ancien builder webpack sur une version récente → `LOW`, opportunité.
- `budgets` configurés dans `angular.json` : leur absence prive d'un garde-fou de régression (`LOW`).
- `NgOptimizedImage` (`ngSrc`) pour les images de contenu, avec `priority` pour l'image LCP.
- SSR/hydratation (`provideClientHydration`, hydratation incrémentale) : pertinent pour le SEO et le LCP d'un site public, inutile pour un back-office. Ne le recommande que si le contexte le justifie.
- Grosses dépendances importées globalement (lodash complet, moment, librairies de graphiques) → vérifie les imports.

## 7. Tests et outillage

- Runner : Vitest est le défaut des versions récentes ; Jest reste acceptable. Karma est déprécié : présence → `LOW`/`MEDIUM` avec migration.
- Tests de composants via `TestBed` ou Angular Testing Library ; tests E2E Playwright ou Cypress (Protractor est mort → `MEDIUM`).
- Lint : `angular-eslint` avec les règles de template, y compris les règles d'accessibilité. Absence de lint → `MEDIUM`.
- Si le projet est installé, `npx tsc --noEmit -p tsconfig.app.json` suffit pour le typage TS. `ng build` valide aussi les templates, mais il est plus lent.

## 8. Interpréter les métriques de la collecte

| Métrique | Lecture |
| --- | --- |
| `@NgModule` > 0 sur v19+ | Legacy à migrer (`ng g @angular/core:standalone`), sauf module de librairie tierce |
| `@Input` élevé vs `input()` faible | Dette de modernisation ; migration `ng g @angular/core:signal-input-migration` |
| OnPush / @Component | Signal, pas verdict : identifie les composants concernés (§3) |
| `.subscribe(` vs takeUntilDestroyed | Point d'entrée pour la lecture ciblée (§3), jamais un finding direct |
| Control flow legacy > 0 | Migration schématique disponible |
| `ngSrc` = 0 avec beaucoup de `<img src` | Opportunité perf (LCP), `LOW`/`MEDIUM` |
| Constructeur DI élevé | Cohérence, `LOW` ; migration `ng g @angular/core:inject` |
| `bypassSecurityTrust` > 0 | Lecture obligatoire de chaque occurrence |

Les schematics de migration officiels (`ng generate @angular/core:<migration>`) sont une recommandation concrète à mettre dans le plan d'action : ils transforment un finding `L` en effort `S`/`M`.
