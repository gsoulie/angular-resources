[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# VSCode

* [Tasks](#tasks)         

## Tasks
[Back to top](#vscode) 

Dans le répertoire ````.vscode````, créer un fichier ````tasks.json````

Le fichier tasks.json doit contenir un tableau de tasks et une version 2.2.0
*tasks.json*

````typescript
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "01_Run source-map-explorer",
      "type": "shell",
      "command": "npm",
      "args": [
        "run",
        "explore"
      ]
    },
    {
      "label": "02_Run with open",
      "type": "shell",
      "command": "ng",
      "args": [
          "serve",
          "MyProject",
          "--open"
      ]
    },
  ]
}
````

Après la création du fichier, il est possible qu'il faille redémarrer vscode pour voir s'afficher les tâches dans le sous-menu Tasks

[Back to top](#vscode) 
