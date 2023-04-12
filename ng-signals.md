[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Signals

* [Concept](#concept)     
* [Syntaxe](#syntaxe)     
* [Signal vs RxJS](#signal-vs-rxjs)    

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

### Complément

https://angularexperts.io/blog/angular-signals-push-pull      

Un signal est un wrapper autour d'une valeur, qui est capable d'informer les consommateurs intéressés lorsque cette valeur change. Étant donné que la lecture d'un signal se fait via un getter plutôt que d'accéder à une variable ou à une valeur simple, les signaux sont capables de garder une trace de l'endroit où ils sont lus.

Les signaux **computed** se basent sur la valeur actuelle (la plus récente) des émetteurs référencés s'il est obsolète (une seule fois, même s'il a reçu plusieurs notifications)

**effect()** doit s'exécuter dans un contexte d'injection (temps du constructeur) car il injecte **DestroyRef** en arrière plan pour fournir un auto-nettoyage.

**IMPORTANT** ````effect()```` ne se déclenche pas si la valeur observée n'est pas modifiée. 

Dans le code suivant, l'effect est déclenché à l'initialisation et affichera 'Effect runs with : true' :

````typescript
@Component({
  template: `<button (click)="update()">Update</update>`,
})
export class EffectExampleComponent {
  counter = signal(0);

  constructor() {
    const isEven = computed(() => {
      return this.counter() % 2 === 0;
    });

    effect(() => {
      console.log('Effect runs with: ', isEven());
    });
    // logs "Effect runs with: true" when component is initialy rendered
  }

  update() {
    this.counter.update((current) => current + 2); // notice + 2
  }
}
````

Par la suite, un clic que le bouton update ne déclenchera plus le effect car la valeur *computed* ````isEven```` sera toujours égale à sa valeur initiale *true*

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


## Signal vs RxJS

[source - Josh MORONY](https://www.youtube.com/watch?v=iA6iyoantuo&ab_channel=JoshuaMorony)     

syntaxe plus claire, concise
signal gère lui-même les souscription, il n'est donc plus nécessaire de se préoccuper d'utiliser les pipe async ou de unsubscribe ses observables
intégrité des valeurs

### Comparaison de syntaxe

````typescript
count = signal(0);

count = new BehaviourSubject(0);
````

dans le template, Signal est appelé comme une fonction

````typescript
template: `
	{{ count() }} <!-- signal -->
	
	{{ count | async }} <!-- BehaviourSubject --> 
	{{ count.getValue() }} <!-- BehaviourSubject --> 
	{{ count.value }} <!-- BehaviourSubject --> 
`
````

````typescript
logValue() {
	console.log(this.count()); // signal
	
	console.log(this.count.value); // BehaviourSubject
}
````

*Valeur calculée*

````typescript
count = signal(0);
doubleCount = computed(() => this.count() * 2);
console.log(this.doubleCount());

//------------------------------------------

count = new BehaviourSubject(0);
doubleCount = this.count.pipe(map((count) => count * 2));
this.doubleCount.subscribe((value) => console.log(value));
// need unsubscribe on destroy !!
````


*Combiner plusieurs valeurs et intégrité des valeurs*
````typescript
valueOne = signal(1);
valueTwo = signal(10);

derived = computed(() => this.valueOne() * this.valueTwo());	// va afficher 10 la première fois, puis 40 après l'appel de changeValues()

changeValues() {
	this.valueOne.set(2);
	this.valueTwo.set(20);
}

//------------------------------------------

valueOne = new behaviourSubject(1);
valueTwo = new behaviourSubject(10);

derived = combineLatest([this.valueOne, this.valueTwo]).pipe(
	map(([one, two]) => one * two)
);	// va afficher 10 la première fois, puis 20 un très court instant à cause du combineLatest, puis 40

changeValues() {
	this.valueOne.next(2);
	this.valueTwo.next(20);
}
````

*Side effect*
````typescript
myService = inject(MyService);

count = this.myService.getCount();
doubleCount = computed(() => this.count() * 2);

constructor() {
	effect(() => {
		console.log('Mise à jour count', this.count());
	})
}

//------------------------------------------

myService = inject(MyService);

count = this.myService
.getCount()
.pipe(
	tap((count) => console.log('Mise à jour count', count))
);

doubleCount = this.count.pipe(map((count) => count * 2));
````

l'````effect()```` est exécuté une fois initialement et il s'exécutera à chaque fois que la valeur d'un signal sera modifiée. Si une valeur est modifiée plusieurs fois avec le même contenu, l'````effect()````
ne sera **pas déclenché** une nouvelle fois

Avec RxJS, si on fait plusieurs pipe async, on déclenche plusieurs fois le effect

````
{{ count | async }}
{{ count | async }}
{{ count | async }}
````
de même que ````{{ doubleCount | async }}```` déclenchera lui aussi l'effect

[Back to top](#signals)     
