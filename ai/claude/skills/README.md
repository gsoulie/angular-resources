# /audit-projet
Le skill suivant présente une **base d'audit technique complet d'un dépôt**, toutes stacks (Angular, Next.js/React, Node, Python, Go, Rust, JVM, PHP, .NET…) — **sécurité** (OWASP Top 10 2025, API Security), **qualité** et **architecture**, **performance**, **accessibilité** (WCAG 2.2 / RGAA), **tests**, **dette technique** et **supply chain**. Détecte la stack, exploite l'outillage du projet, puis produit un rapport Markdown daté, sourcé et actionnable.

Il peut  être lancé sur tout le projet via la commande `/audit-projet` ou sur un répertoire particulier. Il intègre également un mode "audit court"

**Arguments reçus** : $ARGUMENTS

* Premier argument optionnel : racine à auditer (défaut : répertoire courant).
* `--quick` : audit court (collecte + outillage + sécurité + top 10 des problèmes). Pas de tests, pas d'analyse perf/a11y détaillée.

## Installation

Le skill peut être installé soit localement dans le projet ou de préférence au niveau de votre machine de manière a être disponible pour tous vos projets.

1. Télécharger le zip du skill
2. Copier le répertoire décompressé dans le répertoire `C:/Users/<username>/.claude/skills/`
3. Lancer une session claude dans le projet à auditer et lancer la commande `/audit-projet`
