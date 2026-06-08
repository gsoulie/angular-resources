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

## Initialiser un projet

````
// Nouveau projet
specify init <my-project>

// run dans un projet existant
specify init --here
````
---

## Commandes

Les commandes doivent être préfixées si elles sont utilisées depuis un autre agent que copilot :

````
/speckit.constitution
/speckit.plan
````

---

## 📜 **1. Configuration Initiale**
### `/constitution`
- **Quand l'utiliser** : **Une seule fois**, à la création du projet.
- **Objectif** : Définir les **règles globales** du projet (bonnes pratiques, contraintes techniques, SOLID, a11y,  etc.).
- **Exemple de prompt** :
  ```plaintext
  /constitution declare principles for clean code, simple UX, responsive design and minimal dependencies.
  The project must use the next.js, tailwindcss and react versions as per the package.json file.
  Absolutely no testing (no unit tests, no integration tests, no e2e tests) for the moment.

````
/constitution Créé des principes axés sur la qualité du code, les standards de test,
la cohérence de l'expérience utilisateur et les exigences de sécurité, d'accessibilité et de performance
````

- **Résultat** : Génère un fichier constitution.md avec les principes à respecter.

Exemples de fichiers *constitution.md* : 
- [exemple 1](https://github.com/gsoulie/angular-resources/blob/master/ai/spec-kit/constitution-1.md)
- [exemple 2](https://github.com/gsoulie/angular-resources/blob/master/ai/spec-kit/constitution-2.md)     

### `constitution.md` et `CLAUDE.md`

il est fortement recommandé de configurer les deux, car ils ne s'adressent pas du tout au même public ni au même moment du workflow.

Voici comment ils s'articulent, leurs priorités, et les bonnes pratiques pour éviter les doublons.

### 🧭 Le Rôle Distinct de chaque fichier
Pour éviter les conflits, il faut voir ces deux fichiers comme deux types de manuels différents dans une usine :

* `constitution.md` (Le Guide de Style du Projet - Spec Kit) :

	* **Qui le lit ?** Principalement l'humain et le CLI de Spec Kit lors de la génération des plans techniques.

	* **Son but** : Il définit les standards technologiques et architecturaux absolus du projet (ex: "Ici, on fait du NestJS, de l'architecture hexagonale, et les interfaces commencent toujours par un I"). Il sert à cadrer la pensée avant d'écrire la moindre ligne de code.

* `CLAUDE.md` (Le Manuel de Pilotage de l'Agent - Claude Code) :

	* **Qui le lit ?** Exclusivement l'agent Claude Code, à l'ouverture de chaque session de terminal.

	* **Son but** : C'est un fichier opérationnel et comportemental. Il dit à Claude comment se comporter dans le terminal (ex: quels scripts lancer pour tester, comment formater ses réponses, et la liste des commandes/hooks autorisés).
	
### ⚡ Qui est prioritaire ?
Il n'y a pas de "priorité" technique au sens où un fichier écraserait l'autre, car ils interviennent à des étapes différentes. Cependant, dans le flux logique du développement :

🥇 `constitution.md` est supérieur sur le fond (L'Architecture).
🥈 `CLAUDE.md` est supérieur sur la forme et l'exécution (L'Action).

Si Claude Code lit un ordre dans le `CLAUDE.md` (ex: "Utilise le linter du projet"), il va l'exécuter. Mais quand il va générer du code via `/speckit.implement`, il va s'appuyer sur le plan technique généré par Spec Kit, qui lui-même aura été dicté par la `constitution.md`.

### 🛠️ Les Bonnes Pratiques pour éviter les conflits
Pour éviter d'écrire deux fois la même chose et risquer de désynchroniser vos fichiers, appliquez ces trois règles simples :

#### 1. Ne dupliquez pas les règles techniques dans le `CLAUDE.md`
Dans le `CLAUDE.md`, ne listez pas vos conventions de nommage de variables ou vos choix de frameworks. À la place, faites une référence explicite pour que Claude sache où chercher.

Dans votre `CLAUDE.md`, écrivez simplement ceci :

````
## 📐 Architecture & Standards de Code
- Pour toute modification ou création de code, tu dois impérativement respecter les règles définies dans le fichier de référence `constitution.md` à la racine du projet.
````

#### 2. Répartissez strictement les responsabilités
Utilisez cette matrice pour savoir où ranger une nouvelle règle :

|Si la règle concerne...|📂 Rangez-la dans...|Exemple|
|-|-|-|
|La tech ou le design pattern|`constitution.md`|"Les requêtes SQL doivent passer par Prisma."|
|La structure des fichiers|`constitution.md`|"Les composants UI vont dans `/src/components`."|
|Le comportement de Claude|`CLAUDE.md`|"Ne me donne jamais de longues explications, sois concis."|
|Les raccourcis / commandes|`CLAUDE.md`|"Déclaration des alias ou des hooks (`pre-task`, `post-task`)."|

#### 3. Utilisez `CLAUDE.md` comme la passerelle de sécurité
C'est dans le `CLAUDE.md` que vous rappelez à l'agent ses limites (interdiction de commit, obligation de demander l'avis de l'humain). Même si vous le mettez dans la constitution, Claude a besoin de le voir dans son fichier dédié pour ajuster son "système de pensée" dès le démarrage du terminal.



## 🔍 2. Spécification des Fonctionnalités
### `/specify`
- **Objectif** : Décrire les fonctionnalités et leurs règles (UX/UI, interactions, contraintes).
- **Niveau** : Non technique (ex: "Un clic sur le bouton X ouvre la modale Y").
- **Syntaxe** :
```plaintext
/specify <description-de-la-feature>

// ex
/specify drag and drop - let's make it so that users can reorder goals by dragging and dropping them above or below other goals in the list.
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
  * Technologies/librairies (ex: Angular, TailwindCSS, shadcnUI).          
  * Services tiers (ex: Authentification keycloak, Firebase, cache redis...).       
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
