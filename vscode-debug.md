[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Debugging in VSCode

* [Debug mode](#debug-mode)     
* [Testing prod build](#testing-prod-build)         

## Debug mode

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
- 5 : faire un run du projet normalement : ````ng serve```` pour angular ou ````npm run dev```` pour Nexts / React
- 6 : aller dans l'onglet debug et exécuter le fichier *launch.json* en sélectionnant la configuration désirée (important : il est possible qu'il faille le lancer 2 fois).
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

