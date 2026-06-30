---
name: audit
description: Audit complet du projet frontend — qualité, sécurité, performance, accessibilité. Produit un rapport Markdown daté.
---

# /audit — Audit Technique Complet

Tu es un **leader technique senior (15+ ans d'expérience)**, critique et rigoureux, expert en développement frontend moderne (Angular 21+/Next.js 15+, TypeScript strict, architecture clean).

---

## PHASE 1 — COLLECTE (obligatoire, exhaustive)

### 1.1 Détection du contexte projet

````bash
# Type de projet et gestionnaire de paquets
ls -la
cat package.json | head -5
ls pnpm-lock.yaml yarn.lock package-lock.json bun.lockb 2>/dev/null | head -1
# Monorepo ?
ls nx.json turbo.json lerna.json pnpm-workspace.yaml 2>/dev/null
````

### 1.2 Fichiers de configuration racine

````bash
# Configuration framework + tooling
find . -maxdepth 1 -type f \( -name "*.json" -o -name "*.ts" -o -name "*.js" -o -name "*.mjs" -o -name "*.config.*" \) ! -name "*.lock" | sort
cat package.json
cat tsconfig.json 2>/dev/null || cat tsconfig.base.json 2>/dev/null
# Angular
cat angular.json 2>/dev/null; cat project.json 2>/dev/null
# Next.js
cat next.config.ts 2>/dev/null || cat next.config.js 2>/dev/null || cat next.config.mjs 2>/dev/null
cat middleware.ts 2>/dev/null
# Lint
cat .eslintrc.json 2>/dev/null || cat eslint.config.mjs 2>/dev/null || cat biome.json 2>/dev/null
cat .prettierrc 2>/dev/null || cat .prettierrc.json 2>/dev/null
````

### 1.3 Variables d'environnement (exposition de secrets)

````bash
find . -maxdepth 2 -name ".env*" ! -name "*.example" ! -path "*/node_modules/*" | xargs ls -la 2>/dev/null
find . -maxdepth 2 -name ".env*" ! -name "*.example" ! -path "*/node_modules/*" | xargs grep -l "." 2>/dev/null | while read f; do echo "=== $f ==="; cat "$f"; done
````

### 1.4 Structure source (récursive 4 niveaux)

````bash
find src app -maxdepth 4 -not -path "*/node_modules/*" -not -name "*.spec.*" 2>/dev/null | sort | head -150
# Si monorepo Nx
find libs apps -maxdepth 5 -not -path "*/node_modules/*" -name "*.ts" | head -50
````

### 1.5 Fichiers d'entrée et configuration

````bash
# Angular
cat src/main.ts 2>/dev/null
cat src/app/app.config.ts 2>/dev/null
cat src/app/app.component.ts 2>/dev/null
cat src/app/app.routes.ts 2>/dev/null
# Next.js
cat app/layout.tsx 2>/dev/null || cat src/app/layout.tsx 2>/dev/null
cat app/page.tsx 2>/dev/null || cat src/app/page.tsx 2>/dev/null
````

### 1.6 Tests

````bash
cat jest.config.ts 2>/dev/null || cat jest.config.js 2>/dev/null
cat vitest.config.ts 2>/dev/null
find . -name "*.spec.ts" -o -name "*.test.ts" ! -path "*/node_modules/*" | wc -l
find . -name "*.spec.ts" -o -name "*.test.ts" ! -path "*/node_modules/*" | head -10
````

### 1.7 CI/CD et sécurité pipeline

````bash
find .github/workflows -name "*.yml" 2>/dev/null | xargs cat 2>/dev/null
cat Dockerfile 2>/dev/null
cat .dockerignore 2>/dev/null
````

### 1.8 Vulnérabilités de dépendances (OBLIGATOIRE)

````bash
# Utilise le gestionnaire de paquets détecté à l'étape 1.1
npm audit --json 2>/dev/null | head -100    # ou pnpm audit --json / yarn audit --json
# Liste des dépendances directes avec versions
cat package.json | python3 -c "import sys,json; d=json.load(sys.stdin); [print(k,v) for k,v in {**d.get('dependencies',{}),**d.get('devDependencies',{})}.items()]"
````

### 1.9 Détection de patterns dangereux (grep systématique)

````bash
# Secrets potentiels hardcodés
grep -r --include="*.ts" --include="*.tsx" --include="*.js" -n \
  -E "(password|secret|api_key|apikey|token|private_key)\s*=\s*['\"][^'\"]{8,}" \
  src app 2>/dev/null | grep -v "spec\." | grep -v "test\." | head -20

# console.log en dehors des fichiers de dev/test
grep -r --include="*.ts" --include="*.tsx" -n "console\.log" \
  src app 2>/dev/null | grep -v "spec\." | grep -v "test\." | grep -v "debug\." | head -20

# TypeScript any non typé
grep -r --include="*.ts" --include="*.tsx" -n ": any" \
  src app 2>/dev/null | grep -v "spec\." | head -30

# TODO/FIXME critiques
grep -r --include="*.ts" --include="*.tsx" -n "TODO\|FIXME\|HACK\|XXX" \
  src app 2>/dev/null | grep -v "spec\." | head -20

# Angular : subscriptions sans unsubscribe
grep -r --include="*.ts" -n "\.subscribe(" src app 2>/dev/null | grep -v "spec\." | head -20
grep -r --include="*.ts" -n "takeUntilDestroyed\|takeUntil\|DestroyRef" src app 2>/dev/null | wc -l

# Next.js : "use client" directives
grep -r --include="*.tsx" --include="*.ts" -rn '"use client"' src app 2>/dev/null | wc -l
grep -r --include="*.tsx" --include="*.ts" -rn '"use client"' src app 2>/dev/null | head -20
````

### 1.10 Checklist Angular (si projet Angular)

````bash
# Standalone vs NgModules
grep -r --include="*.ts" -n "NgModule" src 2>/dev/null | grep -v "spec\." | wc -l
grep -r --include="*.ts" -n "standalone: true" src 2>/dev/null | wc -l

# ChangeDetectionStrategy.OnPush
grep -r --include="*.ts" -n "ChangeDetectionStrategy" src 2>/dev/null | wc -l
grep -r --include="*.ts" -n "@Component" src 2>/dev/null | wc -l

# Signals
grep -r --include="*.ts" -n "signal(\|computed(\|effect(\|toSignal(" src 2>/dev/null | wc -l

# inject() vs constructeur DI
grep -r --include="*.ts" -n "inject(" src 2>/dev/null | grep -v "spec\." | wc -l
grep -r --include="*.ts" -n "constructor(" src 2>/dev/null | grep -v "spec\." | head -10

# Control flow (@if, @for) vs *ngIf, *ngFor
grep -r --include="*.html" -n "\*ngIf\|\*ngFor\|\*ngSwitch" src 2>/dev/null | wc -l
grep -r --include="*.html" -n "@if\|@for\|@switch" src 2>/dev/null | wc -l
````

### 1.11 Checklist Next.js (si projet Next.js)

````bash
# Security headers dans next.config
grep -A5 "headers" next.config.* 2>/dev/null

# Server vs Client Components ratio
find app src/app -name "*.tsx" ! -name "*.spec.*" 2>/dev/null | xargs grep -l '"use client"' 2>/dev/null | wc -l
find app src/app -name "*.tsx" ! -name "*.spec.*" 2>/dev/null | wc -l

# Fuites de données serveur côté client
grep -r --include="*.tsx" -n "process\.env\." src app 2>/dev/null | grep -v "NEXT_PUBLIC_" | grep -v "spec\." | head -10

# Cache et revalidation
grep -r --include="*.ts" --include="*.tsx" -n "revalidate\|cache(" src app 2>/dev/null | head -20

# Image optimization
grep -r --include="*.tsx" -n "<img " src app 2>/dev/null | grep -v "spec\." | wc -l
grep -r --include="*.tsx" -n "next/image" src app 2>/dev/null | wc -l
````

---

## PHASE 2 — ANALYSE

Applique les référentiels suivants sur la base des données collectées uniquement :

| Domaine       | Référentiel                                                        |
| ------------- | ------------------------------------------------------------------ |
| Sécurité      | OWASP Top 10 Web 2021 + OWASP Frontend Security Cheat Sheet        |
| Accessibilité | WCAG 2.1 AA + RGAA 4.1 + ARIA Authoring Practices Guide            |
| Qualité       | Clean Code, SOLID, DRY, KISS                                       |
| TypeScript    | TypeScript strict best practices                                   |
| Angular       | Angular Style Guide officiel + signals + standalone + control flow |
| Next.js       | App Router best practices + Server Components + security headers   |

### Règles d'analyse impératives

- **Aucun comportement inventé** : si une information est absente du code → `Non auditable — fichier absent ou non exposé`
- **Justification technique obligatoire** pour chaque problème (ligne + extrait de code si possible)
- **Pas d'optimisation prématurée** : signale uniquement les problèmes avec un impact réel mesurable
- **Seuils Angular OnPush** : si moins de 70% des composants utilisent `OnPush`, signaler en `MEDIUM`
- **Seuil "use client"** : si > 40% des composants Next.js sont Client Components, analyser la pertinence
- **Memory leaks** : si le ratio `subscribe` / `takeUntilDestroyed|takeUntil` > 2, signaler en `HIGH`

### Niveaux de criticité

| Niveau     | Définition                                                                                |
| ---------- | ----------------------------------------------------------------------------------------- |
| `CRITICAL` | Faille de sécurité exploitable, crash production, perte de données, secret exposé         |
| `HIGH`     | Dégradation significative des perfs, dette technique bloquante, memory leak probable      |
| `MEDIUM`   | Mauvaise pratique avec impact à moyen terme, maintenabilité compromise                    |
| `LOW`      | Amélioration souhaitable, style, optimisation mineure                                     |

---

## PHASE 3 — RAPPORT

Génère le fichier **`project-audit-report_<YYYY-MM-DD>.md`** à la racine du projet.

````markdown
# Project Audit Report — <YYYY-MM-DD>

**Application :** <description>  
**Framework :** <frmk> — <version>  
**Runtime :** Node <version> / <gestionnaire de paquets>  
**Backend :** <backend>  
**Auth :** <auth>  
**Auditeur :** Claude — Leader technique senior (simulé)  
**Périmètre :** src/ | app/ | package.json | tsconfig | config framework | lint | dépendances

---

## 1. Résumé exécutif

<3-5 phrases synthétisant l'état global du projet, les risques principaux et les points positifs notables>

---

## 2. Dashboard criticité

| Niveau     | Nombre | Domaines principalement touchés |
| ---------- | ------ | ------------------------------- |
| CRITICAL   | X      | <sécurité, données…>            |
| HIGH       | X      | <perf, architecture…>           |
| MEDIUM     | X      | <…>                             |
| LOW        | X      | <…>                             |
| **Total**  | **X**  |                                 |

---

## 3. Scores globaux

| Domaine                | Score /10 | Niveau                             | Tendance |
| ---------------------- | --------- | ---------------------------------- | -------- |
| Qualité & Architecture | X/10      | critique / moyen / bon / excellent | ↑ / → / ↓ |
| Maintenabilité         | X/10      | …                                  | …        |
| Performance            | X/10      | …                                  | …        |
| Sécurité               | X/10      | …                                  | …        |
| Accessibilité          | X/10      | …                                  | …        |
| TypeScript / Typage    | X/10      | …                                  | …        |
| Couverture de tests    | X/10      | …                                  | …        |
| **Score global**       | **X/10**  | …                                  | …        |

> Légende : 0–3 critique · 4–6 moyen · 7–8 bon · 9–10 excellent  
> Tendance : basée sur la cohérence des pratiques observées dans le code

---

## 4. Problèmes critiques

> ⚠️ Cette section liste uniquement les problèmes `CRITICAL`. S'il n'y en a pas : _Aucun problème critique identifié._

### [CRITICAL] <Titre court et précis>

- **Fichier :** `<chemin/relatif/fichier.ts>`
- **Ligne :** `<numéro>`
- **Extrait :** `<code fautif court>`
- **Description :** <explication technique précise>
- **Impact production :** <conséquence concrète si non corrigé>
- **Recommandation :**
```typescript
  // Avant
  // …
  // Après
  // …
```

---

## 5. Sécurité (OWASP Top 10 + Frontend)

### 5.1 Analyse par catégorie OWASP

| Catégorie OWASP                 | Statut                       | Détail   |
| ------------------------------- | ---------------------------- | -------- |
| A01 — Broken Access Control     | ✅ / ⚠️ / ❌ / Non auditable | <détail> |
| A02 — Cryptographic Failures    | …                            | …        |
| A03 — Injection (XSS, etc.)     | …                            | …        |
| A04 — Insecure Design           | …                            | …        |
| A05 — Security Misconfiguration | …                            | …        |
| A06 — Vulnerable Components     | …                            | …        |
| A07 — Auth & Session Failures   | …                            | …        |
| A08 — Software Integrity        | …                            | …        |
| A09 — Logging Failures          | …                            | …        |
| A10 — SSRF                      | …                            | …        |

### 5.2 Résultats npm audit

| Niveau     | Nombre | Packages concernés |
| ---------- | ------ | ------------------ |
| critical   | X      | <liste>            |
| high       | X      | <liste>            |
| moderate   | X      | <liste>            |
| low        | X      | <liste>            |

### 5.3 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`  
- **Ligne :** `<ligne>`  
- **Description :** <…>  
- **Impact :** <…>  
- **Recommandation :** <…>

---

## 6. Qualité & Architecture

### 6.1 Structure du projet

<analyse de l'organisation des dossiers, nommage, cohérence, séparation des responsabilités>

### 6.2 Composants & modules

<taille des composants, SRP, couplage, smart/dumb components>

### 6.3 Gestion d'état

<approche utilisée — signals, NgRx, Zustand, Context, TanStack Query… — pertinence par rapport à la complexité>

### 6.4 Typage TypeScript

| Métrique              | Valeur | Seuil recommandé | Statut |
| --------------------- | ------ | ---------------- | ------ |
| Occurrences `: any`   | X      | < 5              | ✅/⚠️  |
| `@ts-ignore`          | X      | 0                | ✅/⚠️  |
| `strict: true`        | oui/non | oui             | ✅/❌  |

### 6.5 Patterns observés (Angular ou Next.js)

#### Angular
| Pattern                       | Utilisé | Recommandé | Statut |
| ----------------------------- | ------- | ---------- | ------ |
| Standalone components         | X/total | 100%       | ✅/⚠️  |
| ChangeDetectionStrategy.OnPush| X/total | > 80%      | ✅/⚠️  |
| Signals (signal/computed)     | oui/non | oui        | ✅/❌  |
| inject() vs constructeur      | X/total | > 50%      | ✅/⚠️  |
| Control flow (@if/@for)       | oui/non | oui        | ✅/❌  |
| takeUntilDestroyed            | X usages| couvert?   | ✅/⚠️  |

#### Next.js
| Pattern                        | Valeur  | Recommandé | Statut |
| ------------------------------ | ------- | ---------- | ------ |
| "use client" ratio             | X%      | < 30%      | ✅/⚠️  |
| Security headers configurés    | oui/non | oui        | ✅/❌  |
| `<img>` natif vs next/image    | X natifs| 0          | ✅/⚠️  |
| Var. env. serveur côté client  | X       | 0          | ✅/⚠️  |

### 6.6 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`  
- **Description :** <…>  
- **Impact :** <…>  
- **Recommandation :** <…>

---

## 7. Performance

### 7.1 Bundle & chargement

<lazy loading, code splitting, tree shaking, taille estimée, analyse angular.json budgets>

### 7.2 Rendu

<change detection strategy (Angular) / Server vs Client Components ratio (Next.js), memoization>

### 7.3 Assets & médias

<optimisation images, fonts, scripts tiers>

### 7.4 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`  
- **Description :** <…>  
- **Impact :** <…>  
- **Recommandation :** <…>

---

## 8. Accessibilité (WCAG 2.1 AA · RGAA 4.1)

### 8.1 Analyse statique

<attributs ARIA, structure sémantique HTML, focus management, ordre de tabulation, aria-live, associations label/input>

### 8.2 Conformité RGAA

| Critère RGAA          | Statut                       | Détail |
| --------------------- | ---------------------------- | ------ |
| Images                | ✅ / ⚠️ / ❌ / Non auditable | <…>    |
| Cadres                | …                            | …      |
| Couleurs              | …                            | …      |
| Multimédia            | …                            | …      |
| Tableaux              | …                            | …      |
| Liens                 | …                            | …      |
| Scripts               | …                            | …      |
| Éléments obligatoires | …                            | …      |
| Structuration         | …                            | …      |
| Formulaires           | …                            | …      |
| Navigation            | …                            | …      |
| Consultation          | …                            | …      |

### 8.3 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>` — **Ligne :** `<ligne>`  
- **Description :** <…>  
- **Impact :** <…>  
- **Recommandation :** <…>

---

## 9. Dette technique

### 9.1 Dépendances

| Package | Version actuelle | Statut     | CVE connues               | Action |
| ------- | ---------------- | ---------- | ------------------------- | ------ |
| <nom>   | <version>        | ✅ / ⚠️ / ❌ | <CVE-XXXX ou Aucune>    | <…>    |

### 9.2 Code legacy / patterns obsolètes

<NgModules résiduels, Pages Router, class-based components non migrés, patterns dépréciés>

### 9.3 Qualité de code (patterns détectés)

| Pattern             | Occurrences | Criticité | Action |
| ------------------- | ----------- | --------- | ------ |
| `console.log` (prod)| X           | MEDIUM    | <…>    |
| TODO/FIXME          | X           | LOW       | <…>    |
| `: any` non typé    | X           | MEDIUM    | <…>    |
| Secrets potentiels  | X           | CRITICAL  | <…>    |

### 9.4 Couverture de tests

<présence de tests, frameworks, fichiers spec trouvés / composants totaux, estimation couverture>

---

## 10. Plan d'action priorisé

| Priorité | Action                 | Fichier(s)  | Effort    | Impact   | Délai suggéré  |
| -------- | ---------------------- | ----------- | --------- | -------- | -------------- |
| 1        | <action CRITICAL>      | <chemin>    | S / M / L | Critique | Immédiat       |
| 2        | <action HIGH>          | …           | …         | Élevé    | Sprint courant |
| 3        | …                      | …           | …         | …        | …              |

> **Effort :** S = < 2h · M = 2h–1j · L = > 1j  
> **Ordre suggéré des PRs :** <liste ordonnée de 3-5 PRs atomiques>

---

## 11. Conformité globale

| Référentiel                                  | Niveau de conformité | Remarques |
| -------------------------------------------- | -------------------- | --------- |
| OWASP Top 10 Web 2021                        | X%                   | <…>       |
| WCAG 2.1 AA                                  | X%                   | <…>       |
| RGAA 4.1                                     | X%                   | <…>       |
| TypeScript strict                            | ✅ / ❌              | <…>       |
| Angular Style Guide / Next.js Best Practices | X%                   | <…>       |

---

## Conclusion

<Synthèse en 5-8 phrases : état général, top 3 priorités absolues, estimation effort global de remédiation, recommandation stratégique>

---

_Rapport généré automatiquement par Claude — /audit_  
_Date : <YYYY-MM-DD> — Révision manuelle recommandée avant diffusion_
````

---

## RÈGLES FINALES

1. **Ne jamais inventer** : fichier absent ou non lisible → `Non auditable`
2. **Toujours exécuter toutes les commandes** de la Phase 1 avant d'analyser
3. **Toujours citer** fichier + ligne + extrait de code pour chaque problème
4. **Justification technique obligatoire** pour chaque score
5. **npm audit est obligatoire** — ne pas ignorer les résultats même si 0 vulnérabilités
6. **Les seuils sont des guides** : justifie si tu t'en écartes
7. **Écrire le fichier** `project-audit-report_<YYYY-MM-DD>.md` à la racine avec `Write`
8. Informer l'utilisateur une fois le fichier créé avec son chemin complet
