[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Astuces

* [Mémoriser une variable de controller](#mémoriser-une-variable-de-controller)      
* [Propagation événement](#propagation-événement)      
* [Conversion Date vers chaîne YYYY-MM-DD](#conversion-date-vers-chaîne-yyyy-mm-dd)     
* [Gérer les dates en locale FR](#gérer-les-dates-en-locale-fr)      
* [dayjs](#dayjs)     
* [Opérateur reduce](#opérateur-reduce)      

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

## Opérateur reduce

### reduce

*Coût total d'un caddie*
````typescript
const cart = [
	{ banana: 1, price: 24.99 },
	{ tomato: 5, price: 13.75 },
	{ apple: 1, price: 3.80 }
];

const total = cart.reduce((acc, curr) => {
	acc += curr.price
	return acc; // à ne pas oublier
}, 0);

// output
// 42.54
````

> Par défaut on fixe la valeur initiale de l'accumulateur à 0

*Faire une somme par groupe de valeur*
````typescript
const cart = [
  { customer: 'paul', item: 'banana', qte: 2},
  { customer: 'marie', item: 'apple', qte: 7},
  { customer: 'john', item: 'kiwi', qte: 3},
  { customer: 'alex', item: 'apple', qte: 1},
];

console.log('cart cost = ' + JSON.stringify(cart.reduce((acc, curr) => {
  if (Object.keys(acc).includes(curr.item)) {
	acc[curr.item] += curr.qte;
  } else {
	acc[curr.item] = curr.qte;
  }
  return acc;
  }, {}))
);

// output
// {"banana":2, "apple":8, "kiwi":3}
````

> Par défaut on fixe la valeur de l'accumulateur à ````{}```` car le résultat doit être un objet

*Transformer un tableau d'objet en objet json utilisant un id comme clé des sous-objets*
````typescript
const musicians = [
  { id: 1464, name: 'paul', instrument: 'saxo' },
  { id: 849944, name: 'john', instrument: 'guitar' },
  { id: 54664, name: 'mike', instrument: 'drums' },
];

const musicianObj = musicians.reduce((acc, curr) => {
	const {id, ...otherProps } = curr;	// destructuration avec séparation de l'id du reste des propriétés
	
	acc[curr.id] = otherProps;
	return acc;
});

// output
// { '1464': {name: 'paul', instrument: 'saxo'}, '849944': {name: 'john', instrument: 'guitar'}, '54664': {name: 'mike', instrument: 'drums'} }
````

[Back to top](#astuces)    
