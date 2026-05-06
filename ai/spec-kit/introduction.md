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

---

## 🚀 **Introduction**
- **Lien officiel** : [GitHub - Spec Kit](https://github.com/github/spec-kit)
- **Tutoriel recommandé** : [YouTube - Introduction à Spec Kit](https://www.youtube.com/watch?v=61K-2VRaC6s&list=PL4cUxeGkcC9h9RbDpG8ZModUzwy45tLjb)
- **Prérequis** :
  - Activer le **mode Agent** dans la fenêtre de chat pour exécuter les commandes.

---

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
