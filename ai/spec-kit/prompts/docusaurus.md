# Contraintes

* documentation projet réalisée avec docusaurus et le plugin mermaid pour la génération des schémas     
* documentation complète (architecture et fonctionnelle)     
* reprend le design system de l'application (logo, couleurs, styles et fonts)     
* Je n'ai pas besoin de blog, donc tout ce qui est relatif à la partie blog doit être supprimée     
* La documentation doit être localisée dans un répertoire .documentation     
* la documentation doit être mise à jour après tout ajout/modification/suppression de fonctionnalité     
* une section démarrage comprend : vue d'ensemble, prérequis, démarrage rapide, première installation, commandes utiles    
* la documentation respecte les standards C4 et ARC42    
* la documentation est rédigée en anglais

# Prompt `/specify`

````markdown
/speckit.specify

Mettre en place un site de documentation complet pour ce projet, situé dans `.documentation/`, couvrant à la fois les aspects architecturaux et fonctionnels. Le site doit être maintenu à jour à chaque ajout, modification ou suppression de fonctionnalité ou modification d'architecture.

## Ce qu'il faut construire

Un site de documentation autonome, localisé dans le répertoire `.documentation/`, qui couvre l'architecture et les aspects fonctionnels du projet. Ce site doit rester synchronisé avec le code source à tout moment.

## Exigences fonctionnelles

### Mise en place et outillage
- Initialiser Docusaurus (TypeScript) dans le répertoire `.documentation/`.
- Installer et configurer le plugin Mermaid (`@docusaurus/theme-mermaid`) pour le rendu des diagrammes dans les fichiers Markdown.
- La fonctionnalité blog doit être intégralement supprimée : supprimer le répertoire `blog/`, retirer `@docusaurus/plugin-content-blog` de la configuration, et enlever tous les liens blog de la navbar et du footer.
- Les polices personnalisées doivent être auto-hébergées dans `.documentation/static/fonts/` — aucune dépendance à un CDN externe.

### Intégration du design system
- Remplacer le logo Docusaurus par défaut par le logo de l'application (navbar + favicon).
- Appliquer les couleurs de marque, la typographie (famille de police, graisses, tailles) et les styles globaux de l'application via `.documentation/src/css/custom.css`, en utilisant les variables CSS Docusaurus (`--ifm-color-primary` et ses variantes, `--ifm-font-family-base`, `--ifm-heading-font-family`).
- La palette du mode sombre doit correspondre à la variante sombre de l'application.

### Structure du contenu
Le répertoire `docs/` doit contenir les quatre sections suivantes :

**1. Démarrage** (`docs/getting-started/`)
Cinq pages, dans cet ordre :
- `overview.md` — objectif du projet, fonctionnalités principales, public cible, et diagramme de contexte C4 niveau 1.
- `prerequisites.md` — outils requis et leurs versions.
- `quick-start.md` — chemin le plus rapide vers une instance fonctionnelle (3 à 5 commandes maximum).
- `first-installation.md` — guide d'installation pas à pas (clone, installation, variables d'environnement, seed, démarrage).
- `useful-commands.md` — aide-mémoire de toutes les commandes CLI (dev, build, test, lint, migrate, etc.).

**2. Architecture** (`docs/architecture/`)
Onze pages suivant le template ARC42, chacune enrichie de diagrammes C4 Model rédigés en Mermaid :
- `01-introduction.md` — ARC42 §1 : Introduction & Objectifs.
- `02-constraints.md` — ARC42 §2 : Contraintes d'architecture.
- `03-context.md` — ARC42 §3 : Périmètre & Contexte système + diagramme de contexte **C4 niveau 1**.
- `04-solution-strategy.md` — ARC42 §4 : Stratégie de solution.
- `05-building-blocks.md` — ARC42 §5 : Vue des blocs de construction + diagramme de conteneurs **C4 niveau 2**.
- `06-runtime.md` — ARC42 §6 : Vue d'exécution + diagramme de composants **C4 niveau 3** (flux principaux uniquement).
- `07-deployment.md` — ARC42 §7 : Vue de déploiement + diagramme d'infrastructure.
- `08-crosscutting.md` — ARC42 §8 : Concepts transversaux.
- `09-decisions.md` — ARC42 §9 : Décisions d'architecture (format MADR : Statut, Contexte, Décision, Conséquences).
- `10-quality.md` — ARC42 §10 : Exigences qualité.
- `11-risks.md` — ARC42 §11 : Risques & Dette technique.

Tous les diagrammes d'architecture doivent être rédigés en Mermaid inline dans les fichiers Markdown (pas de fichiers image externes). Chaque bloc Mermaid doit inclure un commentaire de légende en en-tête.

**3. Fonctionnel** (`docs/functional/`)
- `index.md` — vue d'ensemble fonctionnelle et modèle de domaine.
- `glossary.md` — termes spécifiques au domaine métier.
- Un sous-répertoire par domaine fonctionnel majeur. Chaque page de domaine doit documenter : l'objectif, les flux utilisateurs (diagrammes de séquence ou flowchart Mermaid), les règles métier et les cas limites.

**4. Changelog** (`docs/changelog.md`)
- Reflète le contenu du fichier `CHANGELOG.md` à la racine du dépôt.

### Navigation
- La navbar Docusaurus doit contenir quatre entrées : Démarrage, Architecture, Fonctionnel, Changelog.
- `sidebars.ts` doit utiliser le mode `autogenerated` pour toutes les sections afin d'éviter toute maintenance manuelle.
- Chaque section doit avoir un fichier `_category_.json` avec les propriétés `position` et `label`.

### Politique de maintenance de la documentation
- Créer un fichier `CONTRIBUTING_DOCS.md` à la racine de `.documentation/` définissant la politique de mise à jour : toute PR qui ajoute, modifie ou supprime une fonctionnalité doit inclure les modifications de documentation correspondantes.
- Ajouter l'élément de checklist suivant dans `.github/pull_request_template.md` :
  `- [ ] Documentation mise à jour dans .documentation/ (si applicable)`
- Ajouter l'instruction suivante dans le fichier `CLAUDE.md` à la racine du dépôt :
  `Après tout ajout, modification ou suppression de fonctionnalité, mettre à jour les pages de documentation concernées dans .documentation/docs/ et maintenir les diagrammes d'architecture synchronisés.`

### Intégration build
- Ajouter des scripts raccourcis dans le `package.json` racine (ou le Makefile) : `docs:dev`, `docs:build`, `docs:serve`.
- Le fichier `.documentation/.gitignore` doit exclure `.docusaurus/` et `build/`.
- Le pipeline CI doit inclure une étape `docs:build` qui échoue en cas d'erreur.

## Contraintes
- Langue de la documentation : **français**.
- Standards : **C4 Model** et **ARC42**.
- Aucune section blog (configuration, navigation, système de fichiers).
- Tous les diagrammes en **Mermaid** (inline dans le Markdown, pas de fichiers externes).
- Polices auto-hébergées, aucune dépendance CDN.
- `sidebars.ts` en mode autogenerated uniquement — pas d'entrées manuelles.

````
