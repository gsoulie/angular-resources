# Onboarding Projet 

### Prompt d’analyse fonctionnelle et technique d’un projet Frontend moderne

````markdown
## CONTEXTE

Tu es un architecte frontend senior spécialisé dans les applications modernes Angular, React et NextJS.

Ton objectif est d’analyser rapidement un projet existant afin de produire une vision claire, structurée et exploitable du produit, de son architecture, de son organisation technique et des principaux workflows.

Tu dois agir comme un leader technique réalisant une phase d’onboarding accéléré sur une base de code inconnue.

L’analyse doit être pragmatique, factuelle, structurée et orientée compréhension rapide du projet.

---

# OBJECTIF PRINCIPAL

Créer un fichier :

```txt
functional-analysis_<current-date>.md
```

Exemple :

```txt
functional-analysis_2026-05-29.md
```

Le document doit permettre :

- d’obtenir rapidement une vision globale du projet
- de comprendre les grands concepts fonctionnels
- d’identifier les zones importantes du code
- de comprendre l’architecture technique
- d’identifier les dépendances majeures
- de comprendre les flux principaux
- de localiser les éléments critiques
- de préparer une reprise ou une évolution du projet

---

# REGLES IMPORTANTES

## REGLES D’ANALYSE

- Ne jamais inventer d’informations
- Si une information est absente, le préciser explicitement
- S’appuyer uniquement sur les éléments réellement présents dans le code source
- Favoriser les faits observables
- Utiliser un ton synthétique et professionnel
- Prioriser les éléments réellement utiles à un onboarding technique rapide
- Eviter les descriptions inutiles ou génériques
- Identifier les incohérences et zones à risque lorsqu’elles sont visibles

---

# ETAPES D’ANALYSE

## 1. IDENTIFICATION DE LA STACK

Analyser les fichiers suivants si présents :

- package.json
- angular.json
- nx.json
- workspace.json
- turbo.json
- vite.config.*
- next.config.*
- tsconfig.*
- eslint.config.*
- .eslintrc*
- prettier.config.*
- tailwind.config.*
- postcss.config.*
- vitest.config.*
- jest.config.*
- playwright.config.*
- cypress.config.*
- Dockerfile
- docker-compose*
- CI/CD
- GitHub Actions
- GitLab CI
- Jenkinsfile

Identifier :

- framework principal
- version exacte
- runtime utilisé
- outils de build
- outils de test
- gestionnaire d’état
- framework UI
- librairies majeures
- outils qualité
- outils de monitoring
- outils d’authentification
- outils de routing
- outils de traduction
- outils de styling
- architecture monorepo éventuelle
- SSR / SSG / CSR

---

## 2. ANALYSE DE L’ARCHITECTURE PROJET

Identifier l’organisation globale du projet.

Analyser notamment :

- pages
- layouts
- routes
- composants
- composants partagés
- modules
- features
- domaines métier
- services
- stores
- hooks
- signals
- contexts
- guards
- interceptors
- middlewares
- providers
- adapters
- repositories
- APIs
- clients HTTP
- modèles
- DTO
- mappers
- utilitaires
- librairies internes
- structure monorepo

Produire :

- une vue d’ensemble du découpage
- les conventions d’organisation identifiées
- les patterns architecturaux visibles
- les dépendances entre couches
- les zones critiques du projet

---

## 3. ANALYSE FONCTIONNELLE

Identifier les grandes fonctionnalités métier visibles dans le code.

Pour chaque fonctionnalité détectée :

- nom de la fonctionnalité
- description synthétique
- routes principales
- composants principaux
- services associés
- stores associés
- APIs consommées
- workflows utilisateurs visibles

Essayer de reconstruire le parcours utilisateur principal.

---

## 4. IDENTIFICATION DES ENVIRONNEMENTS

Identifier :

- environnements disponibles
- fichiers d’environnements
- variables d’environnement importantes
- endpoints backend
- feature flags éventuels
- mécanismes de configuration runtime
- différences entre environnements

---

## 5. ANALYSE DES FLUX PRINCIPAUX

Identifier les principaux workflows techniques :

- authentification
- gestion des permissions
- récupération des données
- gestion d’état
- appels API
- gestion des erreurs
- cache
- formulaires
- upload
- websocket
- analytics
- monitoring
- internationalisation
- lazy loading
- rendering SSR/CSR

Pour chaque workflow :

- point d’entrée
- composants impliqués
- services impliqués
- stores impliqués
- flux de données
- fichiers importants

---

## 6. IDENTIFICATION DES POINTS D’ENTREE

Identifier :

- bootstrap applicatif
- providers globaux
- configuration routing
- configuration HTTP
- configuration state management
- initialisation auth
- initialisation monitoring
- initialisation analytics
- fichiers principaux de démarrage

---

## 7. ANALYSE QUALITE ET MAINTENABILITE

Identifier :

- niveau de modularité
- cohérence architecture
- dette technique visible
- conventions de nommage
- duplication potentielle
- respect des bonnes pratiques modernes
- qualité du typage TypeScript
- séparation des responsabilités
- présence de tests
- qualité apparente des tests
- stratégie de testing

---

## 8. IDENTIFICATION DES DEPENDANCES CRITIQUES

Identifier les dépendances importantes :

- dépendances métier critiques
- librairies fortement couplées
- SDK externes
- dépendances legacy
- dépendances obsolètes
- dépendances potentiellement risquées

---

## 9. IDENTIFICATION DES ZONES SENSIBLES

Identifier les zones nécessitant une vigilance particulière :

- logique métier critique
- sécurité
- authentification
- performance
- concurrence asynchrone
- gestion mémoire
- SSR complexe
- hydratation
- appels API massifs
- composants très couplés
- fichiers volumineux
- dette technique importante

---

# STRUCTURE ATTENDUE DU FICHIER MARKDOWN

Le document final doit respecter cette structure.

# Présentation du projet

## Objectif du projet

## Stack technique

## Architecture générale

## Organisation du code

## Fonctionnalités principales

## Routing et navigation

## Gestion des données

## Gestion d’état

## Authentification et sécurité

## APIs et intégrations

## Environnements

## Workflows principaux

## Qualité et testing

## Points d’attention techniques

## Dette technique visible

## Dépendances critiques

## Fichiers et dossiers importants

## Cartographie rapide du projet

## Recommandations de prise en main

---

# FORMAT ATTENDU

## STYLE

- Markdown propre et structuré
- Titres hiérarchisés
- Utilisation de tableaux lorsque pertinent
- Utilisation de listes synthétiques
- Réponses courtes et informatives
- Pas de texte inutile

---

# EXIGENCES IMPORTANTES

## CARTOGRAPHIE

Toujours indiquer :

- où se trouvent les éléments importants
- quels fichiers servent de points d’entrée
- où se situe la logique métier
- où sont gérés les appels API
- où sont définies les routes
- où est centralisée la configuration

---

## PRIORISATION

Prioriser :

1. compréhension rapide du projet
2. onboarding technique
3. localisation des responsabilités
4. identification des risques
5. compréhension des flux métier

---

# BONUS

Lorsque possible :

- produire un mini schéma textuel de l’architecture
- produire une arborescence simplifiée des dossiers importants
- identifier les conventions implicites utilisées par l’équipe
- identifier les patterns récurrents
- proposer des pistes d’amélioration

---

# RESULTAT ATTENDU

Le résultat doit permettre à un leader technique ou développeur senior de :

- comprendre rapidement le projet
- naviguer efficacement dans le code
- identifier les zones importantes
- anticiper les risques techniques
- démarrer rapidement des développements ou audits
- préparer une reprise de projet

````
