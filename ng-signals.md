[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Signals

* [Concept](#concept)     
* [Syntaxe](#syntaxe)     

## Concept 

**Signals** va très probablement introduire un future dans lequel nous n'aurions **plus besoin de zone.js** ce qui pourrait êrte un gros changement ! D'autre part, l'arrivée de **Signals** devrait grandement faciliter l'apprentissage de la programmation réactive aux débutants sur Angular.

En effet, **Signals** permet le contrôle des changements de manière **plus fine et performante** que **zone.js**. 
Contrairement à zone.js, **Signals ne re-contrôle pas la totalité de l'abre de composants** pour effectuer les changements. Et ce mécanisme pourrait bien améliorer considérablement le mécanisme de change detection d'Angular.

Pour illustration, voici actuellement à quel niveau sont effectué les contrôles de changements sur les frameworks Angular, React et Solid :

* Angular : niveau arborescence de l'application
* React : niveau arborescence composant
* Solid : niveau individuel

Par analogie avec RxJS, **Signals se comporte comme un BehaviourSubject en RxJS**, à la différence qu'il n'a **pas besoin de souscription** pour être notifié des changements de valeur.

Avec **Signals**, les souscriptions sont créées et détruites automatiquement, on n'a pas besoin de s'en pré-occuper.
C'est plus ou moins ce qui se passe avec les pipes async d'ailleurs. A la différence, **Signals** n'a pas besoin d'une souscription pour être utilisé en dehors de la vue

> **A noter** : Pour l'instant, Signals n'est disponible que dans la version **v16.0.0-next.0** d'Angular.

Dans les faits, cela va se traduire par une simplification de la syntaxe du code de gestion de la réactivité, et petit à petit, probablement un remplacement de l'utilisation de RxJS par **Signals** (l'avenir nous le dira).

A moyen terme en tout cas, **Signals** ne va pas remplacer RxJS, les 2 peuvent cohabiter. Il est d'ailleurs possible de convertir un Signals en Observable avec le builtin (en béta pour l'instant) ````fromSignal()```` et inversément convertir un observable en Signal avec ````fromObservable()```` pour donner la possibilité d'avoir accès à la valeur directement dans le template sans avoir à utiliser de pipe async.


Pour illustrer rapidement à quoi ça ressemble, voici un exemple :

*Syntaxe RxJS*

````typescript
@Component({
	selector: 'my-app',
	standalone: true,
	template: `
		<div>Count: {{ count$ | async }}</div>
		<div>Double: {{ double$ | async }}</div>
		<button (click)="changeCount()"></button>
	`
})
export class AppComponent {
	count$ = new BehaviourSubject(0);
	double$ = this.count$.pipe(
		map(count => count * 2)
	)
	
	changeCount() { this.count$.next(5); }
}
````

*Syntaxe Signals*

````typescript
@Component({
	selector: 'my-app',
	standalone: true,
	template: `
		<div>Count: {{ count() }}</div>
		<div>Double: {{ double() }}</div>
		<button (click)="changeCount()"></button>
	`
})
export class AppComponent {
	count = signal(0);
	double = computed(() => this.count() * 2);
	
	changeCount() { this.count.set(5); }
}
````

Ce n'est bien sûr qu'un exemple très basique. Vous trouverez plus d'infos et d'exemples ici :

[Vidéo de Josh MORONY](https://www.youtube.com/watch?v=4FkFmn0LmLI&ab_channel=JoshuaMorony)     
[Josj MORONY exemple de code](https://github.com/joshuamorony/quicklist-signals/blob/main/src/app/home/home.component.ts)     
[Signals In Angular - Is RxJS doomed ?](https://levelup.gitconnected.com/signals-in-angular-is-rxjs-doomed-5b5dac574306)     
https://www.angulararchitects.io/en/aktuelles/angular-signals/     

[Back to top](#signals)     

## Syntaxe

Exemples de syntaxes Signals

````typescript
// declarative update
export class SignalComponent {
	list = signal<Items[]>([]);
	
	addItem(item: Item) {
		this.list.update([...list, item]);
	}
}

// impérative mutation
export class SignalComponent {
	list = signal<Items[]>([]);
	
	addItem(item: Item) {
		this.list.mutate(ls => ls.push(item));
	}
}
````

[Back to top](#signals)     
