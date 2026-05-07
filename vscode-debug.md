[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)     

# Debugging in VSCode

* [Solution simple et rapide](#solution-simple-et-rapide)     
* [Debug mode](#debug-mode)     
* [Testing prod build](#testing-prod-build)         

## Solution simple et rapide

Solution utilisant chrome

1. Exécuter le projet `ng serve -o`
2. Ouvrir le volet developpeur de chrome
3. Aller dans la section **Source**
4. Se placer sur le **Workspace** (Si le projet ne s'ouvre pas, il est possible de l'ajouter manuellement)
5. Ouvrir le projet et naviguer dans les sources pour sélectionner le fichier à debugger
6. Ajouter des points d'arrêts sur les lignes voulues

> Il est également possible de placer des points d'arrêts dans le html des composants (pas sur les balise directement mais sur leurs attributs ou interactions)

<img width="1692" height="909" alt="image" src="https://github.com/user-attachments/assets/ec58e6af-1f27-40e2-9b91-76b3287f420f" />


## Principe debug avec point d'arrêt d'une application NextJS :

**1 - créer un fichier .vscode/launch.json**

Créer une configuration pour le debug  de la partie front avec chrome 

*launch.json*

````json
{
    "version": "0.2.0",
    "configurations": [      
      {
        "name": "Debug Client (Chrome)",
        "type": "chrome",
        "request": "launch",
        "url": "http://localhost:3000/", // URL de votre front en mode serve
        "webRoot": "${workspaceFolder}/Frontends", // Répertoire de travail
        "sourceMaps": true,
        "skipFiles": ["<node_internals>/**"]
      },
]}
````

**2 - ajouter des breakpoints dans le code**

**3 - Run de l'application depuis le terminal : npm run dev (ou via task vscode)**

**4 - Run and Debug puis sélectionnez la configuration "Debug Client (Chome)" créée précédemment**

## Debug mode

[Angular Debugging](https://www.youtube.com/watch?v=LYP_iLQZLQg)    

- 1 : Installer l'extension vscode debugger for chrome
- 2 : Dans l'onglet debug, créer une nouvelle configuration. Ceci va créer un répertoire .vscode contenant un fichier *launch.json*

````
{
    "version": "0.2.0",
    "configurations": [
	{
		"name": "launch ng serve and chrome",
            	"type": "chrome",
            	"request": "launch",
            	"preLaunchTask": "npm: start",
            	"url": "http://localhost:4200/",
            	"webRoot": "${workspaceFolder}",
            	"sourceMaps": true,
            	"sourceMapPathOverrides": {
                	"webpack:/*": "${webRoot}/*",
                	"/./*": "${webRoot}/*",
                	"/src/*": "${webRoot}/*",
                	"/*": "*",
                	"/./~/*": "${webRoot}/node_modules/*"
              	}
	}
	// CONFIGURATION NEXTJS
	{
		  "name": "Debug Next.js",
		  "type": "chrome",
		  "request": "launch",
		  "url": "<YOUR_URL>",	// ex: http://localhost:3000
		  "webRoot": "${workspaceFolder}",
		  "sourceMaps": true,
		  "skipFiles": ["node_modules/**"]
	},
    ]
}
````

- 3 : (facultatif) créer une nouvelle task dans le fichier *task.json*

````
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "npm",
			"script": "start",
			"isBackground": true,
			"presentation": {
				"focus": false,
				"panel": "dedicated",
				"showReuseMessage": true,
				"clear": false
			},
			"group": {
				"kind": "build",
				"isDefault": true
			},
			"problemMatcher": [],
			"label": "npm: start",
			"detail": "ng serve --open",
			"options": {
				"cwd": "${workspaceFolder}"
			}
		}
	]
}
````

- 4 : placer des points d'arrêts dans le code ou le mot "debugger" aux endroits stratégiques
- 5 : exécuter le projet via l'onglet debug *Run and Debug*

*(Les étapes suivantes ne sont plus nécessaires)*
- 6 : faire un run du projet normalement : ````ng serve```` pour angular ou ````npm run dev```` pour Nexts / React
- 7 : aller dans l'onglet debug et exécuter le fichier *launch.json* en sélectionnant la configuration désirée (important : il est possible qu'il faille le lancer 2 fois).
  	* Un second navigateur chrome va alors s'ouvrir

Depuis le volet debug on a alors accès aux variables du scope dans le volet *variables* et il est possible d'ajouter des variables spécifiques à surveiller en les ajoutant dans l'onglet *watch*

> remarque : il est possible d'éditer un point d'arrêt pour lui dire de se déclencher sur une valeur précise par exemple


## Testing prod build
[Back to top](#debugging-in-vscode)

This show how to test a production build (*build --prod*) artifact in local machine :

````
npm install http-server -g	// install http server in local
http-server dist/your-project-name // move on the project directory to start http server
// open a web browser and go on http://localhost:8080/
````

