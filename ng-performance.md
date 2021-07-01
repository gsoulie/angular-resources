[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Performances   

* [Outils](#outils)      
* [Lazyload modules](#lazyload-modules)      

## Outils

* **Lighthouse** : il est recommandé de régulièrement faire un audit lighthouse depuis l'onglet associé dans le chrome dev-tool
* **[source-map-explorer](https://www.npmjs.com/package/source-map-explorer)** : permet d'explorer les fichiers d'une application et de déceler les fichiers les plus volumineux
* **webpack-bundle-analyze** équivalent à source-map-explorer
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

Visualisation

*package.json*

````typescript
"scripts": {
...,
"explore": "source-map-explorer dist/**/*.js" 
}
````

````npm run explore````

## Lazyoload modules
[Back to top](#performances)

*app-routing.module.ts*

````typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) }
]
````

[Back to top](#performances)
