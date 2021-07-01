[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Performances   

* [Bonnes pratiques](#bonnes-pratiques)      
* [Outils](#outils)      
* [Lazyload modules](#lazyload-modules)      

## Bonnes pratiques

* éviter les ````import * from '<lib>'````, n'importez que les fonctionnalités dont vous avez besoin : ````import { Observable } from 'rxjs'```` au lieu de ````import * from 'rxjs'````
* charger les composant en lazy-load
* analyser régulièrement les packages avec lighthouse, source-map-explorer etc... pour déceler les problème au plus tôt

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

## Lazyload modules
[Back to top](#performances)

*app-routing.module.ts*

````typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) }
]
````

*home.module.ts*

````typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
````

*home-routing.module.ts*

````typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
````

[Back to top](#performances)
