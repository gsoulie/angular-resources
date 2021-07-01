[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Performances   

## Outils

* **Lighthouse** : il est recommandé de régulièrement faire un audit lighthouse depuis l'onglet associé dans le chrome dev-tool
* **[source-map-explorer](https://www.npmjs.com/package/source-map-explorer)** : permet d'explorer les fichiers d'une application et de déceler les fichiers les plus volumineux

### source-map-explorer

````
npm install --save-dev source-map-explorer
````

Utilisation en spécifiant unitairement que l'on souhaite générer la map :
````
ng build --prod --source-map
````

Utilisation permanente ne nécessite plus de spécifier le flag ````--source-map```` lors du build

*angular.json*
````typescript
"sourceMap": false, // --> set to true

// or

"sourceMap": {
  "scripts": true,
  "styles": true,
  "vendor": true,
  "hidden": true
}
````

[Back to top](#performances)
