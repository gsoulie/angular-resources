[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Chart

* [Apexchart](#apexchart)     
* [Chartist](#chartist)     
* [Victory](#victory)     

Liste des meilleures librairies : https://www.atatus.com/blog/javascript-chart-libraries     

## Apexchart

### Installation

Documentation : https://apexcharts.com/docs/angular-charts/     
Line chart : https://apexcharts.com/docs/chart-types/line-chart/     

````
npm install apexcharts ng-apexcharts --save 
````

*angular.json*

Ajouter le script suivant dans les noeuds *scripts*

````typescript
"scripts": [
  "node_modules/apexcharts/dist/apexcharts.min.js"
]
````

*import app.module.ts ou dans les standalone component*

````typescript
import { NgApexchartsModule } from 'ng-apexcharts';

imports: [
	...,
	NgApexchartsModule,
]
````

### Exemples

[>> Projet exemple](https://github.com/gsoulie/angular-apexchart)     

[Bact to top](#chart)    

## Chartist

[Bact to top](#chart)    

## Victory

Documentation : https://formidable.com/open-source/victory/docs/victory-pie    

[Bact to top](#chart) 
