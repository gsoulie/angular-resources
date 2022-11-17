[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Images

* [Lazy loading](#lazy-loading)     
* [Convert base64 with observable](#convert-base64-with-observable)      
* [Directive NgOptimizedImage](#directive-ngoptimizedimage)      


## Lazy loading

[npm package](https://www.npmjs.com/package/ng-lazyload-image)     
[Simon Grimm tutorial](https://www.youtube.com/watch?v=gKhUKKP2IRE&ab_channel=SimonGrimm)     

## Convert base64 with observable

https://www.youtube.com/watch?v=sV20DXZZlAc&ab_channel=SamLama


[Back to top](#images)      

## Directive NgOptimizedImage

Ce document a pour but de présenter une nouveauté d'Angular v14.2, la directive ````NgOptimizedImage````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Cette directive est maintenant disponible en version stable depuis **Angular v15**

Documentation officielle : https://angular.io/api/common/NgOptimizedImage#description
[Back to top](#images)      


### Chargement d'images : quelques bases

#### Fonctionnement classique

Prenons comme exemple le code suivant qui réalise l'affichage dans une liste de 7 images :
````html
<div>
  <ul>
    <li>
      <p>Banff</p>
      <img src="/assets/banff.jpg" 
        width="1000" height="625" alt="Banff">
    </li>
    <li>
      <p>Tofino</p>
      <img src="/assets/tofino.jpg" 
        width="1000" height="625" alt="Tofino">
    </li>
    <li>
      <p>Vancouver</p>
      <img src="/assets/vancouver.jpg" 
        width="1000" height="667" alt="Vancouver">
    </li>
    <li>
      <p>Victoria</p>
      <img src="/assets/victoria.jpg" 
        width="1000" height="667" alt="Victoria">
    </li>
    <li>
      <p>Cyclades</p>
      <img src="/assets/cyclades.jpg" 
        width="1000" height="625"  alt="Cyclades">
    </li>
    <li>
      <p>Sydney</p>
      <img src="/assets/sydney.jpg" 
        width="1000" height="667"  alt="Sydney">
    </li>
    <li>
      <p>Séoul</p>
      <img src="/assets/seoul.jpg" width="1366" height="768" alt="Séoul">
    </li>
  </ul>
</div>
````

Une fois exécuté dans un navigateur (ici chrome) nous observons que ce dernier, charge les X premières images visibles dans le viewport en mode priorité haute *high*, et le reste des images en priorité basse *low*

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Ce n'est pas le cas de tous les navigateurs ! Par exemple, Firefox charge toutes les images en priorité basse

Même si le navigateur charge les images en priorité basse, on observe tout de même qu’il charge toutes les images, même celles qui sont encore invisibles dans le viewport tant qu’on ne scrolle pas vers le bas de la page.

Pour optimiser encore un peu ce comportement, il existe une propriété ````loading="lazy"```` qui permet de charger les images au fur et à mesure du scrolling dès que le navigateur atteint un certain seuil. 

#### Charger les images en mode LAZY-LOAD

Modifions donc notre code de la manière suivante :

````html
<div>
  <ul>
    <li>
      <p>Banff</p>
      <img src="/assets/banff.jpg"
        width="1000" height="625" alt="Banff" loading="lazy">
    </li>
    <li>
      <p>Tofino</p>
      <img src="/assets/tofino.jpg"
        width="1000" height="625" alt="Tofino" loading="lazy">
    </li>
    <li>
      <p>Vancouver</p>
      <img src="/assets/vancouver.jpg"
        width="1000" height="667" alt="Vancouver" loading="lazy">
    </li>
    <li>
      <p>Victoria</p>
      <img src="/assets/victoria.jpg"
        width="1000" height="667" alt="Victoria" loading="lazy">
    </li>
    <li>
      <p>Cyclades</p>
      <img src="/assets/cyclades.jpg"
        width="1000" height="625"  alt="Cyclades" loading="lazy">
    </li>
    <li>
      <p>Sydney</p>
      <img src="/assets/sydney.jpg"
        width="1000" height="667"  alt="Sydney" loading="lazy">
    </li>
    <li>
      <p>Séoul</p>
      <img src="/assets/seoul.jpg" 
      width="1366" height="768" alt="Séoul" loading="lazy">
    </li>
  </ul>
</div>
````

Nous observons alors que le navigateur a chargé les 4 premières images par défaut bien que toutes les images soient marquées comme « lazy ».
En effet, les 2 premières images sont forcément chargées puisque visible initialement dans le viewport, et les 2 suivantes correspondent au seuil que fixe le navigateur pour charger la suite des images.

A présent, si l’on scroll notre page, nous allons voir les images suivantes se charger les unes après les autres au fur et à mesure que l’on déclenche le seuil fixé par le navigateur.

[Back to top](#images)      

### Directive ````NgOptomizedImage````

####	Description

La directive *NgOptimizedImage* est une directive axée sur l'amélioration des performances de chargement d'image. Elle applique les meilleures pratiques et améliore les scores Core Web Vitals. De plus cette directive peut être utilisée en mode **standalone**

Cette dernière permet :

* De prioriser le chargement du LCP (Largest Contentful Paint)
* Optimiser le chargement des images en appliquant par défaut la propriété ````loading="lazy"````
* De charger une image optimale en fonction de la taille du viewport

Cette nouvelle directive possède quelques **prérequis** à son utilisation :

* Remplacer la propriété ````src```` des balises images par ````ngSrc````
* Renseigner obligatoirement une ````width```` et une ````height```` pour les balises img

####	Mise en pratique

En se basant sur l'exemple initial, voici comment modifier le code pour qu'il prenne en compte la nouvelle directive. La première étape consiste à importer la directive (note : cette directive  est de type standalone)

*App.module.ts*

````typescript
import { NgOptimizedImage } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*app.component.html*

````typescript
<div>
  <ul>
    <li>
      <p>Banff</p>
      <img ngSrc="/assets/banff.jpg" 
      width="1000" height="500" alt="Banff"
    </li>
    <li>
      <p>Tofino</p>
      <img ngSrc="/assets/tofino.jpg" 
      width="2100" height="1334" alt="Tofino">
    </li>
    <li>
      <p>Vancouver</p>
      <img ngSrc="/assets/vancouver.jpg"
      width="1000" height="667" alt="Vancouver">
    </li>
    <li>
      <p>Victoria</p>
      <img ngSrc="/assets/victoria.jpg"
      width="1000" height="667" alt="Victoria">
    </li>
    <li>
      <p>Cyclades</p>
      <img ngSrc="/assets/cyclades.jpg"
      width="1000" height="625"  alt="Cyclades">
    </li>
    <li>
      <p>Sydney</p>
      <img ngSrc="/assets/sydney.jpg"
      width="1000" height="667"  alt="Sydney">
    </li>
    <li>
      <p>Séoul</p>
      <img ngSrc="/assets/seoul.jpg"
      width="1366" height="768" alt="Séoul">
    </li>
  </ul>
</div>
````

Une fois le code exécuté dans un navigateur, on observe que la directive affiche des warnings indiquant les images pour lesquelles les dimensions ne respectent pas le ratio initial de l’image, ainsi qu’un warning sur l’image considérée comme étant la LCP (Largest Contentful Paint) c’est-à-dire l’image affichée la plus volumineuse pour laquelle qu’il est conseillé de charger cette dernière en mode prioritaire.

#### Prioriser le chargement des Largest Contentful Paint

La directive introduit une nouvelle propriété ````priority```` qui permet de forcer en priorité haute le chargement des images critiques et/ou importantes à charger pour obtenir la meilleure expérience possible.

Modifions donc le code pour marquer l'image LCP (indiquée par le warning) comme prioritaire :
````html
<li>
      <p>Banff</p>
      <img ngSrc="/assets/banff.jpg" 
      width="1000" height="500" alt="Banff" priority="high">
</li>
````

On observe alors directement que le navigateur ne charge plus que 3 images sur les 4 premières initialement et que la première image est chargée en mode priorité haute.
[Back to top](#images)      

### Charger la bonne image pour la bonne taille d'écran

Une autre propriété intéressante est la propriété ````srcset````. Cette dernière permet de fournir une liste d'images à charger pour différentes tailles de viewport. Ceci permet d'on de charger l'image la plus optimisée par rapport à la taille de l'écran.

Soit l'exemple suivant : 

````html
<li>
  <p>Tofino</p>
  <img src="/assets/tofino.jpg"
       srcset="
       /assets/tofino-600x400.jpg 600w,
       /assets/tofino-1400x933.jpg 1400w,
       /assets/tofino-2400x1600.jpg 2400w"
    width="600" height="400" alt="Tofino">
</li>
````

Dans le code ci-dessus, l'image par défaut est *tofino.jpg*. Via la propriété ````srcset````, nous indiquons différents *"breakpoints"* avec les images correspondantes.

* Viewport Inférieur ou égal à 600, on indique à la directive de charger l'image *tofino-600x400.jpg*. 
* Viewport Inférieur ou égal à 1400 on indique à la directive de charger l'image *tofino-1400x933.jpg*. 
* Viewport Inférieur ou égal à 2400 on indique à la directive de charger l'image *tofino-2400x1600.jpg*. 

Ainsi lors de l'exécution, en fonction de la taille du viewport, l'image correspondante sera chargée.

On observe qu'au fur et à mesure de l'agrandissement de l'écran, les images correspondantes vont être requêtées dès lors qu'un *"breakpoint"* est déclenché

[Back to top](#images)      
