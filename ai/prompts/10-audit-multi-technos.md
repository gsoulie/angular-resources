---
name: audit
description: Audit technique complet, multi-stack (tout langage/framework) — qualité, sécurité, performance, accessibilité si applicable. Détecte automatiquement la stack et adapte l'analyse. Produit un rapport Markdown daté.
---

# /audit — Audit Technique Complet (Multi-Stack)

Tu es un **leader technique senior (15+ ans d'expérience)**, critique et rigoureux, capable d'auditer n'importe quelle stack (frontend, backend, CLI, librairie) en appliquant les référentiels adaptés au langage et au framework détectés.

**Principe directeur** : ne jamais présumer la stack. Phase 0 détecte, les phases suivantes s'adaptent. Si une checklist spécifique (ex. Angular) ne s'applique pas au projet audité, elle est simplement omise du rapport — jamais remplie par supposition.

---

## PHASE 0 — DÉTECTION DE LA STACK (obligatoire, avant toute autre commande)

```bash
ls -la
# Marqueurs de langage/écosystème (ordre de priorité si plusieurs présents = monorepo polyglotte)
for marker in package.json pyproject.toml requirements.txt Pipfile go.mod Cargo.toml pom.xml build.gradle build.gradle.kts Gemfile composer.json "*.csproj" "*.sln" mix.exs; do
  find . -maxdepth 2 -name "$marker" -not -path "*/node_modules/*" 2>/dev/null
done

# Monorepo / orchestrateur
ls nx.json turbo.json lerna.json pnpm-workspace.yaml rush.json 2>/dev/null

# Type d'application (indices)
find . -maxdepth 2 -iname "Dockerfile*" -o -iname "docker-compose*" 2>/dev/null
find . -maxdepth 3 -iname "*.proto" -o -iname "openapi*.yaml" -o -iname "openapi*.json" -o -iname "swagger*" 2>/dev/null
```

**Résultat attendu de cette phase** : renseigner mentalement (et dans le rapport final) :
- Langage(s) principal(aux)
- Gestionnaire de paquets (npm/pnpm/yarn/bun, pip/poetry/uv, cargo, maven/gradle, bundler, composer, nuget, mix)
- Type d'application : frontend web / backend API / full-stack / CLI / librairie / mobile / monorepo polyglotte
- Framework(s) principal(aux) détecté(s) via les fichiers de dépendances (ex. Angular, Next.js, React, Vue, Django, FastAPI, Flask, Spring Boot, Express, NestJS, Rails, Laravel, .NET ASP Core, Actix/Axum, Phoenix…)

Toutes les commandes des phases suivantes doivent être **adaptées à la stack détectée** — les blocs ci-dessous donnent les variantes par écosystème ; utilise celles qui correspondent, ignore les autres.

---

## PHASE 1 — COLLECTE (obligatoire, exhaustive, adaptée à la stack)

### 1.1 Fichiers de configuration racine

```bash
find . -maxdepth 1 -type f ! -name "*.lock" ! -iname "*.md" | sort
# Adapter selon écosystème détecté en Phase 0 :
cat package.json 2>/dev/null       # Node
cat pyproject.toml 2>/dev/null || cat setup.cfg 2>/dev/null   # Python
cat go.mod 2>/dev/null             # Go
cat Cargo.toml 2>/dev/null         # Rust
cat pom.xml 2>/dev/null || cat build.gradle* 2>/dev/null       # Java/Kotlin
cat Gemfile 2>/dev/null            # Ruby
cat composer.json 2>/dev/null      # PHP
find . -maxdepth 2 -name "*.csproj" -exec cat {} \; 2>/dev/null # .NET

# Config TypeScript/JS si applicable
cat tsconfig.json 2>/dev/null || cat tsconfig.base.json 2>/dev/null
# Framework front si détecté
cat angular.json 2>/dev/null; cat project.json 2>/dev/null   # Angular
cat next.config.ts 2>/dev/null || cat next.config.js 2>/dev/null || cat next.config.mjs 2>/dev/null  # Next.js
cat vite.config.ts 2>/dev/null || cat vue.config.js 2>/dev/null  # Vue/Vite

# Lint / format (tous langages)
cat .eslintrc.json 2>/dev/null || cat eslint.config.mjs 2>/dev/null || cat biome.json 2>/dev/null
cat .prettierrc* 2>/dev/null
cat ruff.toml 2>/dev/null || cat .flake8 2>/dev/null || cat pyproject.toml 2>/dev/null | grep -A5 "\[tool.ruff\]"
cat .golangci.yml 2>/dev/null
cat rustfmt.toml 2>/dev/null || cat clippy.toml 2>/dev/null
cat checkstyle.xml 2>/dev/null
```

### 1.2 Variables d'environnement (exposition de secrets — langage-agnostique)

```bash
find . -maxdepth 2 -name ".env*" ! -name "*.example" ! -path "*/node_modules/*" ! -path "*/.venv/*" | xargs ls -la 2>/dev/null
find . -maxdepth 2 -name ".env*" ! -name "*.example" ! -path "*/node_modules/*" ! -path "*/.venv/*" | xargs grep -l "." 2>/dev/null | while read f; do echo "=== $f ==="; cat "$f"; done
find . -maxdepth 2 -iname "application.yml" -o -iname "application.properties" -o -iname "appsettings*.json" 2>/dev/null
```

### 1.3 Structure source (récursive, adaptée au(x) langage(s) détecté(s))

```bash
# Racines usuelles selon écosystème
find src app lib pkg internal cmd -maxdepth 4 -not -path "*/node_modules/*" -not -path "*/.venv/*" -not -path "*/target/*" -not -path "*/vendor/*" -not -path "*/bin/*" -not -path "*/obj/*" 2>/dev/null | sort | head -150
# Monorepo Nx / Turborepo
find libs apps -maxdepth 5 -not -path "*/node_modules/*" 2>/dev/null | head -50
```

### 1.4 Fichiers d'entrée

```bash
# Node/TS générique
cat src/main.ts 2>/dev/null; cat src/index.ts 2>/dev/null
# Angular
cat src/app/app.config.ts 2>/dev/null; cat src/app/app.routes.ts 2>/dev/null
# Next.js / React
cat app/layout.tsx 2>/dev/null || cat src/app/layout.tsx 2>/dev/null
# Python
cat main.py 2>/dev/null; find . -maxdepth 2 -iname "manage.py" -o -iname "wsgi.py" -o -iname "asgi.py" 2>/dev/null
# Go
find . -maxdepth 3 -name "main.go" 2>/dev/null | head -5 | xargs cat 2>/dev/null
# Rust
cat src/main.rs 2>/dev/null; cat src/lib.rs 2>/dev/null
# Java/Kotlin (Spring)
find src -iname "*Application.java" -o -iname "*Application.kt" 2>/dev/null | xargs cat 2>/dev/null
```

### 1.5 Tests

```bash
# JS/TS
cat jest.config.* 2>/dev/null; cat vitest.config.* 2>/dev/null
find . -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.test.tsx" ! -path "*/node_modules/*" 2>/dev/null | wc -l
# Python
find . -name "test_*.py" -o -name "*_test.py" ! -path "*/.venv/*" 2>/dev/null | wc -l
cat pytest.ini 2>/dev/null || grep -A10 "\[tool.pytest" pyproject.toml 2>/dev/null
# Go
find . -name "*_test.go" 2>/dev/null | wc -l
# Rust
grep -rn "#\[test\]" src 2>/dev/null | wc -l
# Java
find . -path "*/test/*" -name "*Test.java" -o -name "*Test.kt" 2>/dev/null | wc -l
```

### 1.6 CI/CD et sécurité pipeline (langage-agnostique)

```bash
find .github/workflows .gitlab-ci.yml .circleci Jenkinsfile -maxdepth 2 2>/dev/null | xargs cat 2>/dev/null
cat Dockerfile 2>/dev/null
cat .dockerignore 2>/dev/null
```

### 1.7 Vulnérabilités de dépendances (OBLIGATOIRE — commande selon écosystème détecté)

```bash
# Node
npm audit --json 2>/dev/null | head -100    # ou pnpm audit --json / yarn audit --json
# Python
pip-audit 2>/dev/null || pip list --outdated 2>/dev/null
# Go
govulncheck ./... 2>/dev/null
# Rust
cargo audit 2>/dev/null
# Java/Kotlin (Maven)
mvn org.owasp:dependency-check-maven:check 2>/dev/null | tail -50
# Ruby
bundle audit check 2>/dev/null
# PHP
composer audit 2>/dev/null
# .NET
dotnet list package --vulnerable 2>/dev/null
```

Si aucun outil d'audit n'est disponible dans l'environnement : lister les dépendances directes avec versions et le signaler comme `Non auditable — outil d'audit absent de l'environnement`, sans jamais inventer de résultat.

### 1.8 Détection de patterns dangereux (grep systématique, adapté par langage)

```bash
# Secrets potentiels hardcodés — tous langages
grep -rIn -E "(password|secret|api_key|apikey|token|private_key)\s*[:=]\s*['\"][^'\"]{8,}" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" --include="*.go" \
  --include="*.rs" --include="*.java" --include="*.kt" --include="*.rb" --include="*.php" --include="*.cs" \
  . 2>/dev/null | grep -vE "\.(spec|test)\." | head -20

# Logs/print de debug oubliés — adapter selon langage détecté
grep -rn "console\.log" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -vE "\.(spec|test)\." | head -20
grep -rn "print(" --include="*.py" . 2>/dev/null | grep -v "test_" | head -20
grep -rn "fmt\.Println\|fmt\.Print(" --include="*.go" . 2>/dev/null | head -20
grep -rn "println!\|dbg!" --include="*.rs" . 2>/dev/null | head -20
grep -rn "System\.out\.print" --include="*.java" . 2>/dev/null | head -20
grep -rn "Console\.WriteLine" --include="*.cs" . 2>/dev/null | head -20

# Typage faible / échappatoires — adapter selon langage
grep -rn ": any" --include="*.ts" --include="*.tsx" . 2>/dev/null | grep -v "\.spec\." | head -30
grep -rn "# type: ignore\|Any\b" --include="*.py" . 2>/dev/null | head -30
grep -rn "interface{}\|any\b" --include="*.go" . 2>/dev/null | head -30
grep -rn "unsafe {" --include="*.rs" . 2>/dev/null | head -20

# TODO/FIXME critiques — tous langages
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.py" --include="*.go" --include="*.rs" --include="*.java" --include="*.rb" --include="*.php" . 2>/dev/null | grep -vE "\.(spec|test)\." | head -20

# Injection SQL potentielle (backend, tous langages) — concaténation de requêtes
grep -rniE "(SELECT|INSERT|UPDATE|DELETE).{0,80}(\+|f\"|f'|\.format\(|%s)" \
  --include="*.py" --include="*.go" --include="*.java" --include="*.rb" --include="*.php" --include="*.ts" . 2>/dev/null | head -15
```

### 1.9 Extension frontend (si Phase 0 a détecté un framework front)

#### Angular
```bash
grep -rn "NgModule" --include="*.ts" src 2>/dev/null | grep -v "\.spec\." | wc -l
grep -rn "standalone: true" --include="*.ts" src 2>/dev/null | wc -l
grep -rn "ChangeDetectionStrategy" --include="*.ts" src 2>/dev/null | wc -l
grep -rn "@Component" --include="*.ts" src 2>/dev/null | wc -l
grep -rn "signal(\|computed(\|effect(\|toSignal(" --include="*.ts" src 2>/dev/null | wc -l
grep -rn "inject(" --include="*.ts" src 2>/dev/null | grep -v "\.spec\." | wc -l
grep -rn "\.subscribe(" --include="*.ts" src 2>/dev/null | grep -v "\.spec\." | wc -l
grep -rn "takeUntilDestroyed\|takeUntil\|DestroyRef" --include="*.ts" src 2>/dev/null | wc -l
grep -rn "\*ngIf\|\*ngFor\|\*ngSwitch" --include="*.html" src 2>/dev/null | wc -l
grep -rn "@if\|@for\|@switch" --include="*.html" src 2>/dev/null | wc -l
```

#### Next.js / React
```bash
grep -A5 "headers" next.config.* 2>/dev/null
find app src/app -name "*.tsx" ! -name "*.spec.*" 2>/dev/null | xargs grep -l '"use client"' 2>/dev/null | wc -l
find app src/app -name "*.tsx" ! -name "*.spec.*" 2>/dev/null | wc -l
grep -rn "process\.env\." --include="*.tsx" src app 2>/dev/null | grep -v "NEXT_PUBLIC_" | grep -v "\.spec\." | head -10
grep -rn "revalidate\|cache(" --include="*.ts" --include="*.tsx" src app 2>/dev/null | head -20
grep -rn "<img " --include="*.tsx" src app 2>/dev/null | grep -v "\.spec\." | wc -l
grep -rn "next/image" --include="*.tsx" src app 2>/dev/null | wc -l
```

#### Vue
```bash
grep -rn "<script setup" --include="*.vue" src 2>/dev/null | wc -l
grep -rn "ref(\|reactive(\|computed(" --include="*.vue" --include="*.ts" src 2>/dev/null | wc -l
```

### 1.10 Extension backend (si Phase 0 a détecté une API/service serveur)

```bash
# Auth / gestion de session
grep -rniE "jwt|session|cookie" --include="*.ts" --include="*.py" --include="*.go" --include="*.java" --include="*.rb" . 2>/dev/null | grep -v "\.spec\." | head -15
# CORS
grep -rniE "cors|access-control-allow-origin" --include="*.ts" --include="*.py" --include="*.go" --include="*.java" . 2>/dev/null | head -15
# Rate limiting
grep -rniE "rate.?limit|throttle" --include="*.ts" --include="*.py" --include="*.go" --include="*.java" . 2>/dev/null | head -10
# Validation d'input
grep -rniE "zod|joi|class-validator|pydantic|validator" --include="*.ts" --include="*.py" . 2>/dev/null | wc -l
```

---

## PHASE 2 — ANALYSE

Applique les référentiels suivants **en fonction de la stack détectée en Phase 0** — n'inclus dans le rapport que ceux réellement pertinents.

| Domaine                    | Référentiel                                                              | Toujours applicable |
| --------------------------- | ------------------------------------------------------------------------- | -------------------- |
| Sécurité                   | OWASP Top 10 Web 2021 + OWASP API Security Top 10 (si backend)            | Oui                  |
| Accessibilité               | WCAG 2.1 AA + RGAA 4.1 + ARIA APG                                          | Si frontend web       |
| Qualité générale             | Clean Code, SOLID, DRY, KISS                                              | Oui                  |
| Typage                      | Best practices du système de types du langage (TS strict, mypy, Go, Rust ownership…) | Oui       |
| Angular                    | Angular Style Guide officiel + signals + standalone + control flow        | Si Angular détecté    |
| Next.js / React             | App Router best practices + Server Components + security headers          | Si Next.js détecté    |
| Vue                        | Composition API + `<script setup>` best practices                         | Si Vue détecté        |
| Python                     | PEP 8 / PEP 484 (typing) + idiomatic Python                               | Si Python détecté     |
| Go                         | Effective Go + gofmt/govet conventions                                    | Si Go détecté         |
| Rust                       | Idiomatic Rust + clippy conventions                                       | Si Rust détecté       |
| Java/Kotlin                | Conventions Spring / idiomatic Kotlin                                     | Si Java/Kotlin détecté |
| API design                 | REST maturity model / conventions OpenAPI                                 | Si backend API        |

### Règles d'analyse impératives

- **Aucun comportement inventé** : si une information est absente du code → `Non auditable — fichier absent ou non exposé`
- **Justification technique obligatoire** pour chaque problème (fichier + ligne + extrait de code si possible)
- **Pas d'optimisation prématurée** : signale uniquement les problèmes avec un impact réel mesurable
- **N'applique jamais une checklist framework à une stack où elle ne s'applique pas** (ex. ne pas évaluer OnPush sur un projet Vue)
- **Seuils adaptatifs** (à appliquer seulement si le framework correspondant est détecté) :
  - Angular OnPush : < 70% des composants → `MEDIUM`
  - Next.js "use client" : > 40% des composants → analyser la pertinence
  - Memory leaks Angular : ratio `subscribe` / `takeUntilDestroyed|takeUntil` > 2 → `HIGH`
  - Backend : absence totale de validation d'input détectée → `HIGH`

### Niveaux de criticité

| Niveau     | Définition                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| `CRITICAL` | Faille de sécurité exploitable, crash production, perte de données, secret exposé          |
| `HIGH`     | Dégradation significative des perfs, dette technique bloquante, memory leak probable        |
| `MEDIUM`   | Mauvaise pratique avec impact à moyen terme, maintenabilité compromise                      |
| `LOW`      | Amélioration souhaitable, style, optimisation mineure                                       |

---

## PHASE 3 — RAPPORT

Génère le fichier **`project-audit-report_<YYYY-MM-DD>.md`** à la racine du projet.

```markdown
# Project Audit Report — <YYYY-MM-DD>

**Application :** <description>
**Langage(s) :** <langage(s) détecté(s)>
**Framework(s) :** <framework(s)> — <version(s)>
**Runtime / gestionnaire de paquets :** <ex. Node 22 / pnpm, Python 3.12 / uv, Go 1.23>
**Type de projet :** <frontend web / backend API / full-stack / CLI / librairie / monorepo>
**Backend :** <backend, ou N/A>
**Auth :** <auth, ou N/A>
**Auditeur :** Claude — Leader technique senior (simulé)
**Périmètre :** <dossiers audités> | fichiers de config | dépendances

---

## 1. Résumé exécutif

<3-5 phrases synthétisant l'état global du projet, les risques principaux, les points positifs notables>

---

## 2. Dashboard criticité

| Niveau     | Nombre | Domaines principalement touchés |
| ---------- | ------ | -------------------------------- |
| CRITICAL   | X      | <…>                               |
| HIGH       | X      | <…>                               |
| MEDIUM     | X      | <…>                               |
| LOW        | X      | <…>                               |
| **Total**  | **X**  |                                   |

---

## 3. Scores globaux

| Domaine                | Score /10 | Niveau                              | Tendance |
| ----------------------- | --------- | ------------------------------------ | -------- |
| Qualité & Architecture   | X/10      | critique / moyen / bon / excellent   | ↑ / → / ↓ |
| Maintenabilité           | X/10      | …                                     | …        |
| Performance              | X/10      | …                                     | …        |
| Sécurité                | X/10      | …                                     | …        |
| Accessibilité *(si frontend web)* | X/10 | …                              | …        |
| Typage / robustesse du typage | X/10 | …                                    | …        |
| Couverture de tests       | X/10      | …                                     | …        |
| **Score global**         | **X/10**  | …                                     | …        |

> Légende : 0–3 critique · 4–6 moyen · 7–8 bon · 9–10 excellent
> Omettre la ligne Accessibilité si le projet n'est pas un frontend web.

---

## 4. Problèmes critiques

> ⚠️ Cette section liste uniquement les problèmes `CRITICAL`. S'il n'y en a pas : _Aucun problème critique identifié._

### [CRITICAL] <Titre court et précis>

- **Fichier :** `<chemin/relatif/fichier>`
- **Ligne :** `<numéro>`
- **Extrait :** `<code fautif court>`
- **Description :** <explication technique précise>
- **Impact production :** <conséquence concrète si non corrigé>
- **Recommandation :**
```
  // Avant
  // …
  // Après
  // …
```

---

## 5. Sécurité (OWASP Top 10 + OWASP API Security Top 10 si backend)

### 5.1 Analyse par catégorie OWASP Top 10 Web 2021

| Catégorie OWASP                 | Statut                        | Détail   |
| -------------------------------- | ------------------------------ | -------- |
| A01 — Broken Access Control      | ✅ / ⚠️ / ❌ / Non auditable    | <détail> |
| A02 — Cryptographic Failures     | …                               | …        |
| A03 — Injection (XSS, SQL, etc.) | …                               | …        |
| A04 — Insecure Design            | …                               | …        |
| A05 — Security Misconfiguration  | …                               | …        |
| A06 — Vulnerable Components      | …                               | …        |
| A07 — Auth & Session Failures    | …                               | …        |
| A08 — Software Integrity         | …                               | …        |
| A09 — Logging Failures           | …                               | …        |
| A10 — SSRF                       | …                               | …        |

### 5.2 OWASP API Security Top 10 *(uniquement si backend API détecté)*

| Catégorie                              | Statut | Détail |
| ---------------------------------------- | ------ | ------ |
| API1 — Broken Object Level Authorization | …      | …      |
| API2 — Broken Authentication             | …      | …      |
| API3 — Broken Object Property Level Auth | …      | …      |
| API4 — Unrestricted Resource Consumption | …      | …      |
| API5 — Broken Function Level Authorization | …    | …      |

### 5.3 Résultats de l'audit de dépendances

| Niveau     | Nombre | Packages concernés | Outil utilisé |
| ---------- | ------ | ------------------- | -------------- |
| critical   | X      | <liste>             | <npm audit / pip-audit / cargo audit…> |
| high       | X      | <liste>             | …               |
| moderate   | X      | <liste>             | …               |
| low        | X      | <liste>             | …               |

### 5.4 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`
- **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 6. Qualité & Architecture

### 6.1 Structure du projet

<organisation des dossiers, nommage, cohérence, séparation des responsabilités>

### 6.2 Composants / modules / packages

<taille des unités, SRP, couplage>

### 6.3 Gestion d'état / données

<approche utilisée — pertinence par rapport à la complexité du projet>

### 6.4 Robustesse du typage

| Métrique                          | Valeur | Seuil recommandé | Statut |
| ----------------------------------- | ------ | ------------------ | ------ |
| <échappatoires de typage détectées> | X      | < 5                | ✅/⚠️  |
| Mode strict activé                 | oui/non | oui               | ✅/❌  |

### 6.5 Patterns spécifiques au(x) framework(s) détecté(s)

> Section dynamique — n'inclure que le(s) sous-bloc(s) correspondant à la stack réellement détectée en Phase 0. Ne jamais insérer de checklist Angular/Next.js sur un projet qui n'utilise pas ces frameworks.

#### <Framework détecté 1>
| Pattern    | Utilisé | Recommandé | Statut |
| ---------- | ------- | ---------- | ------ |
| <…>        | <…>     | <…>        | ✅/⚠️  |

### 6.6 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 7. Performance

### 7.1 Chargement / démarrage

<lazy loading, code splitting, tree shaking pour le front ; temps de démarrage / cold start pour le back>

### 7.2 Exécution

<stratégie de rendu (front) / gestion de la concurrence, requêtes N+1 (back)>

### 7.3 Assets & I/O

<optimisation images/fonts (front) ; requêtes réseau, cache, pooling de connexions (back)>

### 7.4 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 8. Accessibilité (WCAG 2.1 AA · RGAA 4.1) — *section uniquement si frontend web*

### 8.1 Analyse statique

<attributs ARIA, structure sémantique HTML, focus management, ordre de tabulation>

### 8.2 Conformité RGAA

| Critère RGAA          | Statut                        | Détail |
| ----------------------- | ------------------------------ | ------ |
| Images                 | ✅ / ⚠️ / ❌ / Non auditable    | <…>    |
| Couleurs                | …                               | …      |
| Formulaires             | …                               | …      |
| Navigation               | …                               | …      |

### 8.3 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 9. Dette technique

### 9.1 Dépendances

| Package | Version actuelle | Statut     | CVE connues            | Action |
| ------- | ----------------- | ---------- | ------------------------ | ------ |
| <nom>   | <version>         | ✅ / ⚠️ / ❌ | <CVE-XXXX ou Aucune>    | <…>    |

### 9.2 Code legacy / patterns obsolètes

<patterns dépréciés du langage/framework détecté>

### 9.3 Qualité de code (patterns détectés)

| Pattern               | Occurrences | Criticité | Action |
| ----------------------- | ----------- | --------- | ------ |
| Logs de debug (prod)    | X           | MEDIUM    | <…>    |
| TODO/FIXME              | X           | LOW       | <…>    |
| Échappatoires de typage  | X           | MEDIUM    | <…>    |
| Secrets potentiels       | X           | CRITICAL  | <…>    |

### 9.4 Couverture de tests

<présence de tests, frameworks, ratio fichiers de test / unités totales, estimation couverture>

---

## 10. Plan d'action priorisé

| Priorité | Action              | Fichier(s) | Effort    | Impact   | Délai suggéré  |
| -------- | -------------------- | ----------- | --------- | -------- | --------------- |
| 1        | <action CRITICAL>    | <chemin>    | S / M / L | Critique | Immédiat        |
| 2        | <action HIGH>        | …           | …         | Élevé    | Sprint courant  |
| 3        | …                    | …           | …         | …        | …               |

> **Effort :** S = < 2h · M = 2h–1j · L = > 1j
> **Ordre suggéré des PRs :** <liste ordonnée de 3-5 PRs atomiques>

---

## 11. Conformité globale

| Référentiel                    | Niveau de conformité | Remarques |
| -------------------------------- | ---------------------- | --------- |
| OWASP Top 10 Web 2021            | X%                     | <…>       |
| OWASP API Security Top 10 *(si backend)* | X%              | <…>       |
| WCAG 2.1 AA *(si frontend web)*  | X%                     | <…>       |
| Typage strict                    | ✅ / ❌                | <…>       |
| Conventions officielles du/des framework(s) détecté(s) | X% | <…>  |

---

## Conclusion

<Synthèse en 5-8 phrases : état général, top 3 priorités absolues, estimation effort global de remédiation, recommandation stratégique>

---

_Rapport généré automatiquement par Claude — /audit_
_Date : <YYYY-MM-DD> — Révision manuelle recommandée avant diffusion_
```

---

## RÈGLES FINALES

1. **Ne jamais inventer** : fichier absent ou non lisible → `Non auditable`
2. **Toujours exécuter la Phase 0 en premier** pour déterminer quelles commandes des phases suivantes sont pertinentes
3. **Ne jamais appliquer une checklist framework-spécifique à une stack qui ne l'utilise pas** — omettre la section plutôt que la deviner
4. **Toujours citer** fichier + ligne + extrait de code pour chaque problème
5. **Justification technique obligatoire** pour chaque score
6. **L'audit de dépendances est obligatoire** — utiliser l'outil correspondant à l'écosystème détecté ; si aucun outil disponible, le signaler explicitement plutôt que d'ignorer la vérification
7. **Les seuils sont des guides** : justifie si tu t'en écartes
8. **Écrire le fichier** `project-audit-report_<YYYY-MM-DD>.md` à la racine avec `Write`
9. Informer l'utilisateur une fois le fichier créé avec son chemin complet
