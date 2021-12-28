[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# ng-content

* [Généralités](#généralités)      
* [Design pattern - Bridge](#design-pattern---bridge)      


https://wizbii.tech/un-layout-dynamique-avec-ng-content-d00e27ab26d9      
https://github.com/gsoulie/angular-resources/blob/master/angular-summary.md#ng-content    

La balise ````<ng-content>```` permet de définir un modèle de vue fixe et de définir un emplacement pour du contenu dynamique.
Par exemple, imaginons un template dans lequel on aurait un header et du contenu :

*layout.component.html*
````html
<section class="layout">
    <h2 class="layout__header">
        {{ header }}
    </h2>
    <!-- slot de transclusion -->
    <div class="layout__content">    
        <ng-content></ng-content>
    </div>
</section>
````

*layout.component.ts*
````typescript
import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-layout',
  templateUrl: 'card.component.html',
})
export class LayoutComponent {
    @Input() header: string = 'this is header';   
}
````
	
Maintenant, utilisons ce layout dans un autre composant :

*articles.component.html*
````html
<h1>Notre super App !</h1>
<app-layout header="Le header de mon layout !">
    <!-- début du contenu dynamique : -->
    <article class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article>
    <!-- fin du contenu dynamique -->
<app-layout>
````
	
Le slot de transclusion ````<article class="content__article">…</article>```` remplacera le ````<ng-content></ng-content>```` dans notre layout.
Imaginons avoir besoin de plusieurs blocs de contenu dynamique… C’est possible ! ````<ng-content>```` accepte un attribut ````select````, qui nous permet de nommer un slot. Modifions notre layout pour accepter un 2nd slot.

*layout.component.html*
````html
<section class="layout">
    <!-- slot header -->
    <nav class="layout__nav">
       <ng-content select="[cardNav]"></ng-content>
    </nav>
    <!-- slot content--> 
    <div class="layout__content">       
        <ng-content select="[cardContent]"></ng-content>
    </div>
</section>
````
	
A noter que l'on utilise ````select=[cardNav] && select=[cardContent]````. Les "[]" veulent dire "à remplacer uniquement si l'élément possède l'attribut *card-…*".
Et notre composant :
	
*articles.component.html*
````html
<h1>Notre super App !</h1>
<app-layout>
    <!-- contenu dynamique : nav -->
    <a cardNav class="nav__cta">Article 1</a>
    <a cardNav class="nav__cta">Article 2</a>
    <a cardNav class="nav__cta">Article 3</a>        
    
    <!-- contenu dynamique : content -->
    <article cardContent class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article> 
       
    <article cardContent class="content__article">
       <h2>Article 2</h2>
       <p>Mon super résumé...</p>
    </article>   
     
    <article cardContent class="content__article">
       <h2>Article 3</h2>
       <p>Mon super résumé...</p>
    </article>
<app-layout>
````

## Design pattern - Bridge
[Back to top](#ng-content)

[Decoded frontend tutorial](https://www.youtube.com/watch?v=2rQOu9TmuxE&ab_channel=DecodedFrontend)      

Dans cet exemple, le composant parent **Home** contient plusieurs composants widget. Ces sous-composants widget **weather-widget** et **velocity-widget** sont injectés dynamiquement dans un composant wrapper **widget-wrapper** via ````<ng-content>````. Ce dernier permet de contenir dynamiquement n'importe quel type de composant.

Afin de pouvoir déclencher les fonctions de chaque sous-composant **weather-widget** et **velocity-widget** depuis le composant **widget-wrapper**, chaque sous-composant **doit implémenter une interface** permettant de définir les propriétés attendues dans le wrapper afin que chaque sous-composant partage les mêmes propriétés et que le wrapper puisse ainsi faire appel à ces propriétés / fonctions de manière générique.

Chaque sous-composant doit déclarer un **provider** basé sur un **InjectionToken** afin de pouvoir fournir dynamiquement une référence du sous-composant au composant wrapper (description complète plus bas)

````
providers: [{
    provide: WIDGET,
    useExisting: WeatherWidgetComponent
  }]
````

#### Home

*home.html*

````html
<app-widget-wrapper>
    <!-- ng-content -->
    <app-weather-widget></app-weather-widget>
</app-widget-wrapper>

<app-widget-wrapper>
    <!-- ng-content -->
    <app-velocity-widget></app-velocity-widget>
</app-widget-wrapper>

<app-widget-wrapper>
    <!-- ng-content -->
    <p>Other content here...</p>
</app-widget-wrapper>
````
#### widget-wrapper
[Back to top](#ng-content)

*widget-wrapper.html*

````html
<div class="header">
    <h1>Widget</h1>
    <button mat-stroked-button (click)="onRefresh()">Refresh</button>
</div>
<mat-divider></mat-divider>
<section>
    <!-- contenu dynamique -->
    <ng-content></ng-content>
</section>
````

*widget-wrapper.component.ts*

````typescript
import { IWidget } from './../widgets/widget.interface';
import { WIDGET } from './../widgets/widget.token';
import { Component, ContentChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-wrapper',
  templateUrl: './widget-wrapper.component.html',
  styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit {

  // méthode générique pour gérer un nombre inconnu de widget
  // CHAQUE widget DOIT déclarer un providers pointant sur le InjectionToken WIDGET qui référence le composant du widget
  @ContentChild(WIDGET as any, { static: true }) widget: IWidget;  // static: true est obligatoire pour pouvoir accéder à la référence dans le ngOnInit (avant que le changeDetectorRef soit passé) 

  //// widget unique connu. CHAQUE widget DOIT implémenter l'interface IWidget
  //@ContentChild(VelocityWidgetComponent, { static: true }) widget: VelocityWidgetComponent;

  ngOnInit() {
    this.widget.load();
  }
  onRefresh() {
    this.widget.refresh();
  }
}

````
#### velocity-widget
[Back to top](#ng-content)

*velocity-widget.html*
````html
<mat-spinner class="loader" color="danger" diameter="20" *ngIf="isRefreshing"></mat-spinner>

<div [class.content-loading]="isRefreshing">
    <h5>Last print</h5>
    <section>
        <mat-icon name="widget-icon">assessment</mat-icon>
        <div class="value">Planned: <strong>25</strong></div>
        <div class="value">Archived: <strong>20</strong></div>
    </section>
</div>
````

*velocity-widget.component.ts*

````typescript
import { WIDGET } from './../widget.token';
import { IWidget } from './../widget.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-velocity-widget',
  templateUrl: './velocity-widget.component.html',
  styleUrls: ['./velocity-widget.component.scss'],
  providers: [{
    provide: WIDGET,
    useExisting: VelocityWidgetComponent
  }]
})
export class VelocityWidgetComponent implements OnInit, IWidget {

  isRefreshing = false;

  load() {
    console.log('Loading velocity data...')
  }

  refresh(): void {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
    }, 2500);
  }
}

````

#### weather-widget 
[Back to top](#ng-content)

*weather-widget.html*
````html
<mat-progress-bar class="loader" mode="buffer" *ngIf="isLoading"></mat-progress-bar>

<h5>Current weather</h5>
<section [class.loading]="isLoading">
    <mat-icon name="widget-icon" color="warm">wb_sunny</mat-icon>
    <div class="value">+25</div>
</section>
````

*weather-widget.component.ts*

````typescript
import { WIDGET } from './../widget.token';
import { IWidget } from './../widget.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
  providers: [{
    provide: WIDGET,
    useExisting: WeatherWidgetComponent
  }]
})
export class WeatherWidgetComponent implements OnInit, IWidget {
  isLoading = false;

  load() {
    console.log('Loading weather data...')
  }
  refresh() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
  }

}
````

#### interface et injectionToken
[Back to top](#ng-content)

*widget.interface.ts* (paramètres et fonctions que **doivent** implémenter chaque composant)

````typescript
export interface IWidget {
    load: () => void;
    refresh: () => void;
}
````

*widget.token.ts*

````typescript
import { IWidget } from './widget.interface';
import { InjectionToken } from "@angular/core";

export const WIDGET = new InjectionToken<IWidget>('Widget');
````


[Back to top](#ng-content)
