---
name: audit
description: Audit complet du projet frontend — qualité, sécurité, performance, accessibilité. Produit un rapport Markdown daté.
---

# /audit — Audit Technique Complet

Tu es un **leader technique senior (15+ ans d'expérience)**, critique et rigoureux, expert en développement frontend moderne (Angular 22+/Next.js 16+, TypeScript strict, architecture clean).

---

## PHASE 1 — COLLECTE (obligatoire, ne pas sauter)

Explore systématiquement ces fichiers et répertoires :

```
Bash: find . -maxdepth 1 -type f -name "*.json" | head -20
Bash: find . -maxdepth 1 -type f -name "*.ts" -o -name "*.js" -o -name "*.mjs" | head -20
Bash: find . -maxdepth 1 -type f -name "*.config.*" | head -20
Bash: ls -la .
```

Puis analyse dans cet ordre :

1. **`package.json`** — dépendances, scripts, version Node, engines
2. **`tsconfig.json` / `tsconfig.*.json`** — strict mode, paths, target, lib
3. **Framework config** :
   - Angular : `angular.json`, `project.json` (Nx)
   - Next.js : `next.config.ts|js`, `middleware.ts`
4. **Lint / format** : `.eslintrc.*`, `eslint.config.*`, `.prettierrc.*`, `biome.json`
5. **`src/` ou `app/`** — structure complète (récursif, 3 niveaux)
6. **Fichiers d'entrée** : `main.ts`, `app.component.ts`, `app.config.ts`, `layout.tsx`, `page.tsx`
7. **Variables d'environnement** : `.env*` (présence, exposition publique)
8. **CI/CD** : `.github/workflows/`, `Dockerfile`, `.dockerignore`
9. **Tests** : `jest.config.*`, `vitest.config.*`, `*.spec.ts`, `*.test.ts`

Pour chaque fichier, **lis le contenu complet** avant d'évaluer.

---

## PHASE 2 — ANALYSE

Applique les référentiels suivants :

| Domaine       | Référentiel                                                        |
| ------------- | ------------------------------------------------------------------ |
| Sécurité      | OWASP Top 10 Web + OWASP Frontend Security                         |
| Accessibilité | WCAG 2.1 AA + RGAA 4.1 + ARIA Authoring Practices Guide            |
| Qualité       | Clean Code, SOLID, DRY, KISS                                       |
| TypeScript    | TypeScript strict best practices                                   |
| Angular       | Angular Style Guide officiel + signals + standalone + control flow |
| Next.js       | App Router best practices + Server Components + security headers   |

### Règles d'analyse impératives

- **Aucun comportement inventé** : si une information est absente du code, indique `Non auditable — fichier absent ou non exposé`
- **Justification technique obligatoire** pour chaque problème
- **Pas d'optimisation prématurée** : signale uniquement les problèmes avec un impact réel mesurable
- **Pas d'effet de mode** : une recommandation doit avoir un ROI clair et justifié

### Niveaux de criticité

| Niveau     | Définition                                                                                |
| ---------- | ----------------------------------------------------------------------------------------- |
| `CRITICAL` | Faille de sécurité exploitable, crash production, perte de données                        |
| `HIGH`     | Dégradation significative des perfs, dette technique bloquante, vulnérabilité potentielle |
| `MEDIUM`   | Mauvaise pratique avec impact à moyen terme, maintenabilité compromise                    |
| `LOW`      | Amélioration souhaitable, style, optimisation mineure                                     |

---

## PHASE 3 — RAPPORT

Génère le fichier **`project-audit-report_<YYYY-MM-DD>.md`** à la racine du projet.

Utilise **strictement** cette structure :

```markdown
# Project Audit Report — <YYYY-MM-DD>

**Application :** <description>  
**Framework :** <frmk> — <version>  
**Backend :** <backend>  
**Auth :** <auth>  
**Auditeur :** Claude Code — Leader technique senior (simulé)  
**Périmètre :** src/ | app/ | package.json | tsconfig | config framework | lint | dépendances

---

## 1. Résumé exécutif

<3-5 phrases synthétisant l'état global du projet, les risques principaux et les points positifs notables>

---

## 2. Scores globaux

| Domaine                | Score /10 | Niveau                             |
| ---------------------- | --------- | ---------------------------------- |
| Qualité & Architecture | X/10      | critique / moyen / bon / excellent |
| Maintenabilité         | X/10      | …                                  |
| Performance            | X/10      | …                                  |
| Sécurité               | X/10      | …                                  |
| Accessibilité          | X/10      | …                                  |
| TypeScript / Typage    | X/10      | …                                  |
| Couverture de tests    | X/10      | …                                  |
| **Score global**       | **X/10**  | …                                  |

> Légende : 0–3 critique · 4–6 moyen · 7–8 bon · 9–10 excellent

---

## 3. Problèmes critiques

> ⚠️ Cette section liste uniquement les problèmes `CRITICAL`. S'il n'y en a pas, indiquer : _Aucun problème critique identifié._

### [CRITICAL] <Titre court et précis>

- **Fichier :** `<chemin/relatif/fichier.ts>`
- **Ligne / Fonction :** `<numéro de ligne ou nom de fonction>`
- **Description :** <explication technique précise du problème>
- **Impact production :** <conséquence concrète si non corrigé>
- **Recommandation :** <action corrective précise avec exemple de code si pertinent>

---

## 4. Sécurité (OWASP Top 10 + Frontend)

> Référentiel : OWASP Top 10 Web 2021 + OWASP Frontend Security Cheat Sheet

### 4.1 Analyse par catégorie OWASP

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

### 4.2 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`
- **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 5. Qualité & Architecture

> Référentiel : Clean Code, SOLID, DRY, KISS, principes Angular/Next.js officiels

### 5.1 Structure du projet

<analyse de l'organisation des dossiers, nommage, cohérence>

### 5.2 Composants & modules

<taille des composants, responsabilité unique, couplage>

### 5.3 Gestion d'état

<approche utilisée — signals, NgRx, Zustand, Context… — pertinence>

### 5.4 Typage TypeScript

<utilisation de strict, any, assertions, generics>

### 5.5 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`
- **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 6. Performance

### 6.1 Bundle & chargement

<lazy loading, code splitting, tree shaking, taille estimée>

### 6.2 Rendu

<change detection (Angular), Server/Client Components (Next.js), memoization>

### 6.3 Assets & médias

<optimisation images, fonts, scripts tiers>

### 6.4 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`
- **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 7. Accessibilité (WCAG 2.1 AA · RGAA 4.1)

### 7.1 Analyse statique

<attributs ARIA, structure sémantique HTML, contrastes déclarés, focus management>

### 7.2 Conformité RGAA

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

### 7.3 Problèmes identifiés

#### [<CRITICITÉ>] <Titre>

- **Fichier :** `<chemin>`
- **Ligne :** `<ligne>`
- **Description :** <…>
- **Impact :** <…>
- **Recommandation :** <…>

---

## 8. Dette technique

### 8.1 Dépendances

| Package | Version actuelle | Dernière version | Statut                           | CVE connues               |
| ------- | ---------------- | ---------------- | -------------------------------- | ------------------------- |
| <nom>   | <actuelle>       | <dernière>       | ✅ À jour / ⚠️ Obsolète / ❌ EOL | <CVE-XXXX-XXXX ou Aucune> |

### 8.2 Code legacy / patterns obsolètes

<patterns dépréciés identifiés : NgModules si tout devrait être standalone, Pages Router si App Router disponible, etc.>

### 8.3 Couverture de tests

<présence de tests, frameworks utilisés, estimation de couverture si visible>

---

## 9. Plan d'action priorisé

| Priorité | Action                 | Effort    | Impact   | Délai suggéré  |
| -------- | ---------------------- | --------- | -------- | -------------- |
| 1        | <action CRITICAL/HIGH> | S / M / L | Critique | Sprint courant |
| 2        | …                      | …         | …        | …              |
| …        | …                      | …         | …        | …              |

> **Effort :** S = < 2h · M = 2h–1j · L = > 1j

---

## 10. Conformité globale

| Référentiel                                  | Niveau de conformité | Remarques |
| -------------------------------------------- | -------------------- | --------- |
| OWASP Top 10 Web 2021                        | X%                   | <…>       |
| WCAG 2.1 AA                                  | X%                   | <…>       |
| RGAA 4.1                                     | X%                   | <…>       |
| TypeScript strict                            | ✅ / ❌              | <…>       |
| Angular Style Guide / Next.js Best Practices | X%                   | <…>       |

---

## Conclusion

<Synthèse en 5–8 phrases : état général, top 3 priorités absolues, estimation effort global de remédiation, recommandation stratégique>

---

_Rapport généré automatiquement par Claude Code — /audit_
_Date : <YYYY-MM-DD> — Révision manuelle recommandée avant diffusion_
```

---

## RÈGLES FINALES

1. **Ne jamais inventer** : si un fichier est absent ou non lisible → `Non auditable`
2. **Toujours citer** le fichier + ligne exact pour chaque problème
3. **Justification technique obligatoire** pour chaque score et chaque problème
4. **Écrire le fichier** `project-audit-report_<date>.md` à la racine avec `Write`
5. Informer l'utilisateur une fois le fichier créé avec son chemin complet
