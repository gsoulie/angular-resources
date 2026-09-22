# Référence backend et autres écosystèmes

Ne lis que la ou les sections correspondant à la stack détectée. Chaque section donne : les commandes d'outillage (lecture seule), les points d'idiomatisme et les points de sécurité propres à l'écosystème. Les exigences transverses (OWASP, API Security) sont dans `security.md`.

## Sommaire
- Node.js (NestJS, Express, Fastify, Hono)
- Python (Django, FastAPI, Flask)
- Go
- Rust
- JVM (Spring Boot, Kotlin)
- PHP (Laravel, Symfony)
- Ruby (Rails)
- .NET (ASP.NET Core)
- Vue / Nuxt / Svelte (front non couvert ailleurs)

---

## Node.js (NestJS, Express, Fastify, Hono)

**Outillage** : `tsc --noEmit`, linter configuré, audit selon le lockfile (`npm audit --json`, `pnpm audit --json`, `yarn npm audit --json`, `bun audit`) ou `osv-scanner`.

**Version** : Node en fin de vie (versions impaires, ou paires après leur fin de LTS) → `HIGH`. Vérifie `engines`, `.nvmrc` et l'image Docker.

**Idiomatisme et architecture**
- NestJS : modules par domaine, DTO validés globalement (`ValidationPipe` avec `whitelist: true, forbidNonWhitelisted: true`), guards pour l'authentification et l'autorisation, pas de logique métier dans les contrôleurs.
- Express/Fastify/Hono : validation par schéma à chaque route (zod, valibot, TypeBox, schémas Fastify), gestion d'erreurs centralisée, pas de `async` sans gestion d'erreur (Express 4 ne capture pas les rejets ; Express 5 si).
- Configuration validée au démarrage (schéma sur `process.env`) plutôt que des lectures dispersées.
- Promesses non attendues (`no-floating-promises`), `await` dans des boucles sur des opérations indépendantes.

**Sécurité**
- `helmet` (ou équivalent), CORS restreint à une liste d'origines, rate limiting sur l'authentification et les endpoints coûteux, limite de taille des bodies.
- JWT : `verify` avec algorithme explicite, jamais `decode` pour autoriser ; expiration courte ; secret robuste hors du code.
- Cookies de session : `httpOnly`, `secure`, `sameSite`.
- ORM : `$queryRawUnsafe`/`$executeRawUnsafe` (Prisma), `sequelize.query` avec interpolation, `knex.raw` avec concaténation → injection (`CRITICAL` si alimenté par l'utilisateur).
- Prototype pollution : merges profonds sur des entrées utilisateur (`lodash.merge`, `Object.assign` récursif maison).
- `child_process` avec des entrées utilisateur → `CRITICAL`.
- Scripts `postinstall` de dépendances et du projet : surface supply chain à mentionner.

## Python (Django, FastAPI, Flask)

**Outillage** : `ruff check`, `mypy` ou `pyright` si configurés, `pip-audit` (ou `uv pip audit` / `osv-scanner` sur `uv.lock`/`poetry.lock`), `pytest --co -q` pour compter les tests sans les exécuter.

**Version** : Python en fin de vie → `HIGH`. Gestionnaire moderne (uv ou Poetry, avec lockfile) plutôt qu'un `requirements.txt` non épinglé (`MEDIUM` : builds non reproductibles).

**Idiomatisme** : annotations de types sur les fonctions publiques, Pydantic v2 pour les schémas, pas de `except Exception: pass`, `pathlib` plutôt que `os.path`, context managers pour les ressources, pas d'état global mutable partagé entre requêtes.

**Sécurité**
- Django : `DEBUG=False` en production, `SECRET_KEY` hors du code, `ALLOWED_HOSTS` restreint, middleware CSRF actif, `SECURE_*` et `SESSION_COOKIE_SECURE`, pas de `.raw()`/`.extra()` avec interpolation, `mark_safe` sur des données utilisateur → XSS.
- FastAPI : dépendances de sécurité (`Depends`) sur chaque route protégée, schémas de réponse (`response_model`) pour éviter la sur-exposition (API3), `allow_origins=["*"]` avec `allow_credentials=True` → `HIGH`.
- Flask : `app.run(debug=True)` atteignable en production → `CRITICAL` (console Werkzeug = RCE).
- Généraux : `pickle.loads`, `yaml.load` sans `SafeLoader`, `subprocess(..., shell=True)` avec des entrées, `eval`, requêtes SQL en f-string → injection.

## Go

**Outillage** : `go vet ./...`, `golangci-lint run` si configuré, `govulncheck ./...` (analyse d'atteignabilité : ne signale que les vulnérabilités réellement appelées), `go test -count=1 -short ./...` si les tests ne dépendent pas de services externes.

**Idiomatisme** : erreurs vérifiées et enveloppées (`fmt.Errorf("…: %w", err)`), pas d'erreurs ignorées (`_ =` sur une erreur significative), `context.Context` propagé et respecté, pas de goroutines sans mécanisme d'arrêt, `defer rows.Close()`, interfaces petites définies côté consommateur, `any` limité aux frontières.

**Sécurité** : `database/sql` avec placeholders (jamais `fmt.Sprintf` dans une requête), `html/template` (pas `text/template` pour du HTML), timeouts sur `http.Server` (`ReadHeaderTimeout` au minimum — son absence expose à Slowloris → `MEDIUM`), `InsecureSkipVerify: true` → `HIGH`, `math/rand` pour des jetons → `HIGH` (utiliser `crypto/rand`).

## Rust

**Outillage** : `cargo check`, `cargo clippy -- -D warnings` (compter par lint), `cargo audit` ou `cargo deny check` si configuré, `cargo test --no-run` pour vérifier la compilation des tests.

**Idiomatisme** : `unwrap()`/`expect()` dans du code de production sur des chemins atteignables par des entrées → `MEDIUM` (panic = crash) ; erreurs typées (`thiserror`, ou `anyhow` côté application) ; `clone()` excessifs pour contourner le borrow checker ; blocs `unsafe` justifiés par un commentaire `// SAFETY:`, sinon `HIGH` ; pas d'opérations bloquantes dans un contexte async (`std::thread::sleep`, I/O synchrone dans tokio).

**Sécurité** : `sqlx`/`diesel` paramétrés ; attention à `format!` dans des requêtes ; désérialisation de tailles non bornées (DoS).

## JVM (Spring Boot, Kotlin)

**Outillage** : `mvn -q -DskipTests verify` ou `./gradlew check -x test` (uniquement si le wrapper est présent, sans télécharger de plugin non déclaré), OWASP Dependency-Check ou `osv-scanner` pour les vulnérabilités (Dependency-Check télécharge une base volumineuse : si c'est trop long, note-le comme non exécuté).

**Version** : Java non LTS ou LTS en fin de support, Spring Boot hors support OSS → `HIGH`.

**Idiomatisme** : injection par constructeur (pas `@Autowired` sur les champs), DTO distincts des entités JPA, transactions au niveau service, problèmes N+1 JPA (relations `EAGER`, chargements dans des boucles), Kotlin : null-safety respectée (`!!` fréquents → `MEDIUM`).

**Sécurité** : Spring Security configuré explicitement (`SecurityFilterChain`), pas de `permitAll()` large, CSRF désactivé uniquement pour des API stateless à jeton, Actuator non exposé publiquement (`/actuator/env`, `/heapdump` → `CRITICAL`), requêtes JPQL/natives concaténées, désérialisation Java native.

## PHP (Laravel, Symfony)

**Outillage** : `composer audit`, `vendor/bin/phpstan analyse` ou `psalm` si configurés, `php -l` en dernier recours.

**Points clés** : `APP_DEBUG=false` en production, mass assignment (`$guarded = []` → `HIGH`), requêtes `DB::raw`/`whereRaw` avec interpolation, `{!! !!}` Blade avec des données utilisateur (XSS), validation via Form Requests, policies et gates pour l'autorisation, `unserialize` sur des entrées.

## Ruby (Rails)

**Outillage** : `bundle audit check --update` (réseau), `brakeman -q` s'il est disponible (analyse statique de sécurité Rails de référence), `rubocop` si configuré.

**Points clés** : strong parameters, `html_safe`/`raw` sur des entrées, `where("… #{param}")`, `send`/`constantize` avec des entrées utilisateur, autorisation (Pundit/CanCanCan) appliquée à chaque action, requêtes N+1 (`includes`).

## .NET (ASP.NET Core)

**Outillage** : `dotnet build --no-restore` (si déjà restauré), `dotnet list package --vulnerable --include-transitive`, analyseurs Roslyn et `<Nullable>enable</Nullable>`.

**Points clés** : version .NET hors support → `HIGH` ; `[Authorize]` et policies sur les contrôleurs et endpoints minimaux ; `FromSqlRaw` avec interpolation (préférer `FromSqlInterpolated`) ; `async void` hors gestionnaires d'événements ; `.Result`/`.Wait()` (deadlocks) ; secrets dans `appsettings.json` versionné → `CRITICAL` ; `UseDeveloperExceptionPage` en production.

## Vue / Nuxt / Svelte

**Vue 3** : Composition API avec `<script setup lang="ts">`, Pinia pour l'état, `v-html` avec des données non assainies → XSS, `defineProps` typé, clés `v-for` stables, pas de mutation de props.
**Nuxt** : même frontière serveur/client que Next (routes `server/`, `runtimeConfig` : seul `public` est exposé ; un secret dans `runtimeConfig.public` → `CRITICAL`).
**Svelte/SvelteKit** : runes (Svelte 5), `{@html}` avec des données non assainies, `load` serveur (`+page.server.ts`) pour les données sensibles, `$env/static/private` vs `$env/static/public`, form actions avec vérification d'autorisation.
