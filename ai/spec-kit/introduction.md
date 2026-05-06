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
- **Résultat** : Génère un fichier constitution.md avec les principes à respecter.

## 🔍 2. Spécification des Fonctionnalités
### `/specify`
- **Objectif** : Décrire les fonctionnalités et leurs règles (UX/UI, interactions, contraintes).
- **Niveau** : Non technique (ex: "Un clic sur le bouton X ouvre la modale Y").
- **Syntaxe** :
```plaintext
/specify <description-de-la-feature>
```
- **Résultat** : Crée un fichier de spécification dans specs/<feature>.md.    

> ⚠️ **Important** : Lire le fichier généré avant de passer à la planification.

### `/clarify`

- **Quand l'utiliser** : Si le fichier de spécification contient des zones marquées [NEEDS CLARIFICATION].     
- **Objectif** : Analyser les points flous et interroger l'utilisateur pour les préciser.     
- **Résultat** : Met à jour le fichier de spécification avec les clarifications.    

## 🛠️ 3. Planification Technique
### `/plan`

- **Objectif** : Détailler les aspects techniques :    
  * Technologies/librairies (ex: TailwindCSS, shadcnUI).          
  * Services tiers (ex: Auth0, Firebase).       
  * Gestion d'état, normes de développement, etc.      

 **Exemple de prompt** :
````plaintext
/plan plan this using tailwindcss @theme for theme colours, local storage for goals and shadcnUI for UI component.
No unit tests, no e2e tests needed.
````
- **Résultat** : Génère un plan technique.

> ⚠️ **Important** : Lire le plan généré avant de créer les tâches.


## ✅ 4. Génération des Tâches
### `/tasks`

- **Objectif** : Générer une liste de tâches basées sur :
  * La constitution.     
  * Les spécifications (/specify).     
  * Le plan technique (/plan).    

- **Résultat** : Liste structurée des tâches à réaliser (ex: tasks.md).

## 🔄 5. Implémentation et Suivi
### `/implement`

- **Objectif** : Lancer l'implémentation des tâches.
- **Bonnes pratiques** : Lui ajouter en argument de pointer chaque tâche comme terminée une fois réalisée (pour suivre l'avancement).
- **Exemple** :
````plaintext
/implement please check each tasks when finished
````
- **Astuce** : Utiliser cette commande pour suivre la progression du projet.

## 🔍 6. Analyse des Résultats
### `/analyze`
- **Objectif** : Vérifier que le résultat final respecte :
  * Les spécifications (/specify).     
  * Le plan technique (/plan).      
  * Les tâches définies (/tasks).    

- **Quand l'utiliser** : À la fin de l'implémentation ou après une itération majeure.
