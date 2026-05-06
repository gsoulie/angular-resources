[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)      

# 📌 Spec Kit - Cheat Sheet
*Outil d'assistance pour la spécification, la planification et l'implémentation de projets.*

---

## 🎯 **TL;DR**
- **Spec Kit** est un outil GitHub pour structurer des projets via des commandes en mode **Agent**.
- **Workflow typique** :
  `Constitution → Specify → Clarify → Plan → Tasks → Implement → Analyze`
- **À retenir** :
  - Toujours **lire les fichiers générés** avant de passer à l'étape suivante.
  - Les commandes génèrent des fichiers dans le répertoire du projet (ex: `specs/`, `constitution.md`).

---

## 🚀 **Introduction**
- **Lien officiel** : [GitHub - Spec Kit](https://github.com/github/spec-kit)
- **Tutoriel recommandé** : [YouTube - Introduction à Spec Kit](https://www.youtube.com/watch?v=61K-2VRaC6s&list=PL4cUxeGkcC9h9RbDpG8ZModUzwy45tLjb)
- **Prérequis** :
  - Activer le **mode Agent** dans la fenêtre de chat pour exécuter les commandes.

---

## 📜 **1. Configuration Initiale**
### `/constitution`
- **Quand l'utiliser** : **Une seule fois**, à la création du projet.
- **Objectif** : Définir les **règles globales** du projet (bonnes pratiques, contraintes techniques, etc.).
- **Exemple de prompt** :
  ```plaintext
  /constitution declare principles for clean code, simple UX, responsive design and minimal dependencies.
  The project must use the next.js, tailwindcss and react versions as per the package.json file.
  Absolutely no testing (no unit tests, no integration tests, no e2e tests) for the moment.




---
---
---

# Spec Kit - Aide-mémoire (Cheat Sheet)

Ce document récapitule le workflow standard pour utiliser **Spec Kit**, un outil de développement piloté par l'IA (Agent mode).

**Dépôt GitHub :** [https://github.com/github/spec-kit](https://github.com/github/spec-kit)  
**Tutoriel de référence :** [Introduction à Spec Kit](https://www.youtube.com/watch?v=61K-2VRaC6s)

---

## ⚠️ Configuration Initiale
Pour exécuter les commandes ci-dessous, assurez-vous que votre fenêtre de chat est en **mode "Agent"**.

---

## 🚀 Le Workflow en 6 étapes

### 0. `/constitution` - Les Fondations
*Généralement exécutée une seule fois à la création du projet.*
Cette commande crée un fichier `constitution` qui définit les règles globales et les principes de développement du projet.
- **Usage :** Déclarer les frameworks, les principes SOLID, l'accessibilité (a11y), les contraintes de dépendances, etc.
- **Exemple de prompt :** > `/constitution declare principles for clean code, simple UX, responsive design and minimal dependencies. The project must use next.js, tailwindcss and react versions as per package.json. Absolutely no testing for the moment.`

### 1. `/specify` - La Spécification Fonctionnelle
Définit le "Quoi" sans la technique. On décrit la fonctionnalité, les règles de gestion, l'UX/UI et les interactions.
- **Résultat :** Crée un fichier de spécification dans le répertoire `specs/`.
- **Exemple :** `/specify <description-de-la-feature>`

### 1b. `/clarify` - Levée d'ambiguïtés
À utiliser si le fichier généré par `/specify` contient des mentions `[NEEDS CLARIFICATION]`.
- **Action :** L'IA analyse les zones d'ombre et interroge l'utilisateur pour mettre à jour la spec.

> 💡 **IMPORTANT :** Relisez toujours les fichiers de specs générés avant de passer à l'étape suivante.

### 2. `/plan` - La Conception Technique
Définit le "Comment". Choix des librairies, services tiers, gestion d'état, authentification, etc.
- **Exemple de prompt :**
  > `/plan plan this using tailwindcss @theme for theme colours, local storage for goals and shadcnUI for UI component. No unit tests needed.`

### 3. `/tasks` - Découpage Opérationnel
Génère la liste des tâches concrètes à réaliser en se basant sur la `constitution`, la `spec` et le `plan`.

### 4. `/analyze` - Validation de la Cohérence
Analyse la qualité du résultat produit par rapport aux documents de référence (Spec, Plan, Tasks).

### 5. `/implement` - Passage au Code
Lance la phase de développement.
- **Astuce :** Demandez à l'agent de "pointer chaque tâche une fois réalisée" pour suivre l'avancement en temps réel.
