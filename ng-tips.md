[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Astuces

* [Mémoriser une variable de controller](#mémoriser-une-variable-de-controller)      
* [Propagation événement](#propagation-événement)      
* [Conversion Date vers chaîne YYYY-MM-DD](#conversion-date-vers-chaîne-yyyy-mm-dd)     
* [Gérer les dates en locale FR](#gérer-les-dates-en-locale-fr)      
* [dayjs](#dayjs)        
* [Console en couleur](#console-en-couleur)
* [@Attribute decorator](#décorateur-@attribute)     

## Mémoriser une variable de controller

Cas d'utilisation : On souhaite avoir une valeur "globale" dans un controller qui soit mémorisée même si l'on change de route entre temps et que l'on revienne sur le composant en question

````typescript
export let globaleValue = 0;  // déclarer la variable

@Component(...)

export class HomeComponent {

	ngOnInit() {
		console.log(globaleValue); // affiche 0 la première fois
	}
  
  // fonction qui met à jour la variable
	updateVariable() {
		globalValue = 12;	// au prochain ngOnInit sur ce composant, la valeur sera de 12
	}
}
````

## Propagation événement
[Back to top](#astuces)    

gestion des événements click imbriqués

````html
<div class="main" (click)="open($event)">
    <div class="menu">
        <mat-icon class="popover-menu" [matMenuTriggerFor]="menu" (click)="popoverMenu($event)">more_horiz</mat-icon>
        <mat-menu #menu="matMenu">
		...
	</mat-menu>
    </div>
</div>
````

````typescript
open(event) {
    event.stopPropagation();
    event.preventDefault();
    // do some stuff here
}

popoverMenu(event): void {
    event.stopPropagation();
    event.preventDefault();
}
````

## Conversion Date vers chaîne YYYY-MM-DD
[Back to top](#astuces)    

````typescript
const today = new Date();
console.log(today.toISOString().slice(0, 10));
````

## Gérer les dates en locale FR

*app.module.ts*

````typescript
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { LOCALE_ID } from '@angular/core';

@NgModule({
  declarations: [...],
  imports: [...],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr' }	// Ajouter le LOCAL_ID niveau projet
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````
[Back to top](#astuces)    

## Dayjs

*home.ts*

````typescript
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr' // import locale
dayjs.locale('fr');

currentDate = dayjs();
let listeJours = [];

// Lister tous les jours du mois de la date en cours
for (let i = 1; i <= this.currentDate.daysInMonth(); i++) {
    listeJours.push(dayjs(new Date(this.currentDate.year(), this.currentDate.month(), i)));
}
console.table(listeJours);
````

[Back to top](#astuces)    

## Console en couleur

````typescript
console.log('%cHello world', 'color:red;');
console.log('%cHello world', 'color:green;');
console.log('%cHello world', 'color:yellow;');
````

## Décorateur @Attribute

[Cas d'usage](https://javascript.plainenglish.io/deep-dive-into-angulars-attribute-decorator-real-world-applications-and-tips-7cc4fabf284f)   

Ce décorateur permet d'extraire les attributs d'un élément html

ex: 

````typescript
<app-custom-element data-title="My Custom Element"></app-custom-element>

import { Component, Attribute } from '@angular/core';

@Component({
  selector: 'app-custom-element',
  template: '<p>{{ customTitle }}</p>'
})
export class CustomElementComponent {
  constructor(@Attribute('data-title') public customTitle: string) {}
}
````

Exemple concret 

````typescript
<button appColorChange [enabled]="true">Change Color</button>

/**
 * Directive pour changer la couleur de l'élément en fonction de son attribut
**/
import { Directive, ElementRef, Renderer2, Attribute } from '@angular/core';

@Directive({
  selector: '[appColorChange]'
})
export class ColorChangeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2, @Attribute('enabled') private enabled: string) {
    // 'enabled' attribute value is available in the 'enabled' property
    this.setButtonColor();
  }

  private setButtonColor() {
    if (this.enabled === 'true') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'green');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'red');
    }
  }
}
````

[Back to top](#astuces)    
