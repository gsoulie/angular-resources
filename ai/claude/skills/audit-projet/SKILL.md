---
name: audit-projet
description: Audit technique complet d'un dépôt, toutes stacks (Angular, Next.js/React, Node, Python, Go, Rust, JVM, PHP, .NET…) — sécurité (OWASP Top 10 2025, API Security), qualité et architecture, performance, accessibilité (WCAG 2.2 / RGAA), tests, dette technique et supply chain. Détecte la stack, exploite l'outillage du projet, puis produit un rapport Markdown daté, sourcé et actionnable.
argument-hint: "[chemin-du-projet] [--quick]"
disable-model-invocation: true
allowed-tools: Read Grep Glob Bash(git log *) Bash(git ls-files *) Bash(git check-ignore *) Bash(git rev-parse *)
---

# /audit-projet — Audit technique multi-stack

Arguments reçus : `$ARGUMENTS`
- Premier argument optionnel : racine à auditer (défaut : répertoire courant).
- `--quick` : audit court (collecte + outillage + sécurité + top 10 des problèmes). Pas de tests, pas d'analyse perf/a11y détaillée.

## Pourquoi ce skill est construit ainsi

Un audit produit par un LLM perd toute valeur dès qu'il contient **une seule** affirmation inventée : le lecteur ne peut plus distinguer le vrai du plausible. Tout le workflow vise donc trois choses :

1. **Des preuves plutôt que des impressions** — chaque problème cite un fichier, une ligne et un extrait que tu as *lus*. Un résultat de grep est un indice, jamais une preuve : ouvre le fichier avant de conclure.
2. **Des données plutôt que des heuristiques** — l'outillage du projet (compilateur, linter, audit de dépendances, tests) est plus fiable que des regex. Les greps servent à orienter la lecture.
3. **De la transparence sur les limites** — ce qui n'a pas pu être vérifié est déclaré comme tel (`Non auditable` / `Non évalué`). Un rapport honnête et incomplet vaut mieux qu'un rapport complet et faux.

## Garde-fous (non négociables)

- **Lecture seule.** Ne modifie aucun fichier du projet, n'installe aucune dépendance, ne lance aucun `--fix`, aucune migration, aucun `git` qui écrit. Seule exception : l'écriture du rapport final. Un audit qui altère ce qu'il audite n'est plus fiable.
- **Aucun secret dans le contexte ni dans le rapport.** Ne lis jamais le contenu d'un `.env`, d'un fichier de clés ou de credentials. Rapporte l'*emplacement* d'un secret (fichier:ligne, nom de variable), jamais sa valeur : le rapport sera partagé et peut être commité.
- **Ne jamais inventer** : pas de version, de score, de pourcentage ou de résultat d'outil qui ne provienne pas d'une sortie réelle. Si l'information manque → `Non auditable — <raison>`.
- **Pas de checklist hors sujet** : une section framework n'apparaît que si le framework est réellement détecté.

## Workflow

### Étape 1 — Collecte automatisée

Exécute le script de collecte fourni avec ce skill (dossier `scripts/` à côté de ce fichier ; sous Claude Code : `${CLAUDE_SKILL_DIR}/scripts/collect.sh`) et redirige sa sortie hors du projet :

```bash
bash "<dossier-du-skill>/scripts/collect.sh" "<racine>" > "${TMPDIR:-/tmp}/audit-collect.md" 2>&1
```

Lis ensuite ce fichier. Il contient : métadonnées git, marqueurs d'écosystème, lockfiles, frameworks et versions, runtimes, fichiers d'environnement (noms de clés uniquement), indices de secrets (emplacements uniquement), tailles et hotspots git, tests, CI/CD, Docker, compteurs de patterns, blocs spécifiques Angular / Next.js / backend / a11y, et la liste des outils disponibles.

Le script est en lecture seule et exclut `node_modules`, `dist`, `.next`, `.angular`, `target`, `.venv`, etc. S'il échoue, poursuis manuellement avec `Grep`/`Glob` et signale-le dans la section « Méthodologie et limites ».

### Étape 2 — Fiche projet et chargement des références

À partir de la collecte, établis la fiche projet : langage(s), gestionnaire de paquets (déduit du **lockfile**), type (front / API / full-stack / CLI / librairie / monorepo), framework(s) **avec version**, runtime.

Puis lis **uniquement** les références pertinentes :

| Condition | Référence à lire |
| --- | --- |
| Toujours | `references/security.md` et `references/scoring.md` |
| `@angular/core` détecté | `references/stacks/angular.md` |
| `next` détecté (ou React seul) | `references/stacks/nextjs.md` |
| Backend Node, Python, Go, Rust, JVM, PHP, Ruby, .NET | `references/stacks/backend-and-others.md` (section concernée) |
| Frontend web (hors `--quick`) | `references/accessibility.md` |

Dans un monorepo, traite chaque application/librairie significative comme une unité : fiche par unité, findings rattachés à leur unité.

### Étape 3 — Outillage natif du projet

Exécute, sans rien modifier, ce que le projet fournit déjà. Consigne chaque commande et son résultat (succès, échec, non exécuté + raison) pour l'annexe du rapport.

- **Typage** : `tsc --noEmit -p <tsconfig>` (ou `ng build` en dernier recours, jamais `ng update`), `mypy`/`pyright`, `go vet`, `cargo check`.
- **Lint** : le linter configuré, sans `--fix` (ex. `npx eslint . --format compact`, `ruff check`, `golangci-lint run`, `cargo clippy`). Compte les erreurs par règle plutôt que de lister 500 lignes.
- **Dépendances vulnérables** (obligatoire) : l'outil de l'écosystème (`npm audit --json` / `pnpm audit --json` / `yarn npm audit`, `pip-audit`, `govulncheck ./...`, `cargo audit`, `composer audit`, `bundle audit`, `dotnet list package --vulnerable`), ou `osv-scanner` s'il est disponible — il couvre tous les lockfiles. Ces commandes interrogent le réseau : en cas d'échec, marque `Non auditable — <erreur>` et liste les dépendances directes avec leur version.
- **Tests** (hors `--quick`) : uniquement s'ils peuvent tourner sans service externe (base de données, API). Préfère la commande avec couverture si elle est configurée. En cas de doute, ne les lance pas et note-le.
- **Code mort** : `npx knip` s'il est installé dans le projet.

Si les dépendances ne sont pas installées (`node_modules` absent, pas de venv), n'installe rien : note ces vérifications comme non exécutées.

### Étape 4 — Analyse ciblée (lecture du code)

Les compteurs et greps disent *où regarder*. Lis réellement :

- les points d'entrée et la configuration applicative (bootstrap, routing, providers, config serveur) ;
- tout ce qui touche à l'authentification, l'autorisation, les sessions, les entrées utilisateur et les requêtes en base ;
- les **hotspots git** (fichiers les plus modifiés) et les plus gros fichiers : c'est là que se concentre la dette ;
- un échantillon représentatif d'unités (composants, services, handlers) pour juger l'architecture, pas seulement les pires cas ;
- chaque emplacement signalé par un grep avant d'en faire un finding.

Pour chaque finding, attribue un niveau de **confiance** : `Confirmé` (vu dans le code, exploitable ou avéré), `Probable` (fortement suggéré, contexte partiel), `À vérifier` (indice nécessitant une vérification humaine ou dynamique). Ne classe jamais `CRITICAL` un finding `À vérifier`.

Sur un dépôt volumineux, si des sous-agents sont disponibles, délègue l'analyse par domaine (sécurité, architecture/qualité, performance, accessibilité) en transmettant la fiche projet et le chemin du fichier de collecte, puis consolide et dédoublonne.

N'applique pas de seuil mécaniquement. Les références expliquent comment interpréter les métriques : un ratio n'est qu'un signal qui justifie une lecture.

### Étape 5 — Notation

Applique le barème de `references/scoring.md`. Il rend les notes reproductibles d'un run à l'autre et explique les plafonds (un problème critique confirmé plafonne le score global). Un domaine insuffisamment couvert reçoit `N/É` (non évalué), pas une note devinée.

### Étape 6 — Rapport

1. Cherche un rapport précédent (`project-audit-report_*.md` à la racine). S'il existe, remplis la section « Évolution depuis le dernier audit » (findings résolus, nouveaux, persistants ; écarts de scores). Sinon, omets cette section — pas de tendance inventée.
2. Remplis `assets/report-template.md`. Chaque finding apparaît **une seule fois** dans le catalogue, avec un identifiant (`SEC-01`, `QUA-03`, `PERF-02`, `A11Y-01`, `DEP-01`, `TEST-01`, `OPS-01`) ; les sections par domaine y renvoient par identifiant.
3. Écris le fichier `project-audit-report_<YYYY-MM-DD>.md` à la racine du projet audité.
4. Réponds à l'utilisateur avec : le chemin complet du fichier, le score global, le nombre de findings par criticité, les 3 actions prioritaires, et les principales limites de l'audit (ce qui n'a pas pu être exécuté).

## Criticité (définitions courtes — détails dans `references/scoring.md`)

| Niveau | Définition |
| --- | --- |
| `CRITICAL` | Faille exploitable, secret exposé, perte de données, crash production avéré |
| `HIGH` | Risque sérieux de sécurité ou de fiabilité, dette bloquante, fuite mémoire probable, version hors support |
| `MEDIUM` | Mauvaise pratique avec impact à moyen terme sur la maintenabilité ou la performance |
| `LOW` | Amélioration souhaitable, cohérence, style |

## Mode `--quick`

Étapes 1 à 3 (sans tests), puis sécurité et top 10 des findings. Le rapport garde la même structure, mais les sections non traitées portent la mention `Non évalué (mode quick)`.
