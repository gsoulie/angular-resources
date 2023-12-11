[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Signals

* [Concept](#concept)
* [Syntaxe](#syntaxe)     
* [effect](#effect)     
* [Avantages et inconvénients](#avantages-et-inconvénients)     
* [Signal vs RxJS](#signal-vs-rxjs)    

> [Documentation angular officielle](https://angular.io/guide/signals)     

## Concept 

<details>
	<summary></summary>

 Les signaux sont la pierre angulaire de la réactivité dans Solid. Ils contiennent des valeurs qui changent avec le temps ; lorsque vous modifiez la valeur d'un signal, il met automatiquement à jour tout ce qui l'utilise. Un signal est un **wrapper autour d'une valeur simple qui enregistre ce qui dépend de cette valeur et notifie ces dépendants chaque fois que sa valeur change**

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

**Série de vidéos courtes Josh MORONY**

* [Angular is about to get its most IMPORTANT change in a long time...](https://www.youtube.com/watch?v=4FkFmn0LmLI&ab_channel=JoshuaMorony)    
* [Why didn't the Angular team just use RxJS instead of Signals?](https://www.youtube.com/watch?v=iA6iyoantuo&ab_channel=JoshuaMorony)      
* [The end of Angular's "service with a subject" approach?](https://www.youtube.com/watch?v=SVPyr6u3sqU&ab_channel=JoshuaMorony)       
* [Exemple de code](https://github.com/joshuamorony/quicklist-signals/blob/main/src/app/home/home.component.ts)  

[Signals everything you need to know](https://medium.com/@PurpleGreenLemon/angular-and-signals-everything-you-need-to-know-2ff349b6363a)     
[Angular Signals push-pull](https://angularexperts.io/blog/angular-signals-push-pull)      
[Signals In Angular - Is RxJS doomed ?](https://levelup.gitconnected.com/signals-in-angular-is-rxjs-doomed-5b5dac574306)     
https://www.angulararchitects.io/en/aktuelles/angular-signals/      

</details>

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

## effect

<details>
	<summary>Détecter le changement d'un signa avec effect</summary>

https://angularexperts.io/blog/angular-signals-push-pull      

Un signal est un wrapper autour d'une valeur, qui est capable d'informer les consommateurs intéressés lorsque cette valeur change. Étant donné que la lecture d'un signal se fait via un getter plutôt que d'accéder à une variable ou à une valeur simple, les signaux sont capables de garder une trace de l'endroit où ils sont lus.

Les signaux **computed** se basent sur la valeur actuelle (la plus récente) des émetteurs référencés s'il est obsolète (une seule fois, même s'il a reçu plusieurs notifications)

Si l'on souhaite uniquement *détecter* le changement de valeur d'un signal, on peut utiliser la fonction **effect()**. Cette dernière doit s'exécuter dans un contexte d'injection (temps du constructeur) car il injecte **DestroyRef** en arrière plan pour fournir un auto-nettoyage. Il est **déclenché** lorsque la valeur des signaux qui sont à l'intérieur du bloc de code sont mises à jour.

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

* ````mutate```` : mute l'ancienne valeur
* ````update```` : prend en paramètre l'ancienne valeur et fourni une nouvelle valeur
* ````set```` : équivalent à *update*

[Back to top](#signals)     

</details>

## Avantages et inconvénients

<details>
	<summary></summary>

 AVANTAGE SIGNALS

* Réactivité fine     
Avec les signaux, les modifications apportées à des propriétés de données spécifiques peuvent déclencher des mises à jour uniquement sur les composants qui en dépendent, plutôt que de mettre à jour l'intégralité de l'arborescence des composants. Cette réactivité fine conduit à une détection des changements plus rapide et plus efficace.


* Utilisation réduite de la mémoire     
Avec les signaux, les composants s'abonnent uniquement aux propriétés de données spécifiques dont ils ont besoin, plutôt que de s'abonner à un magasin ou à un service entier. Cela réduit l'utilisation de la mémoire et améliore les performances.

* Fini les contrôles inutiles      
Avec les signaux, seuls les composants qui dépendent d'une propriété de données spécifique sont avertis lorsque cette propriété change. Cela élimine les vérifications et les mises à jour inutiles, ce qui permet une détection des modifications plus rapide et plus efficace.

* Tout a un inconvénient, quels sont les inconvénients des signaux ?     
Le débogage peut également être plus difficile lors de l'utilisation de signaux dans Angular. La complexité de la programmation réactive et l'utilisation de signaux peuvent rendre difficile le suivi du flux de données et l'identification de la source des bogues.

* Quelques différences       
Les observables sont basés sur le modèle d'observateur, où un producteur envoie des données à un consommateur. En revanche, les signaux utilisent un modèle basé sur l'extraction dans lequel les consommateurs extraient les données d'un producteur.

> Les signaux sont **synchrones** tandis que les observables peuvent être **synchrones** et **asynchrones**

Pendant ce temps, les signaux ont un support intégré pour le suivi des dépendances et une réactivité à grain fin, ce qui les rend particulièrement bien adaptés pour une utilisation dans des frameworks d'interface utilisateur comme Angular. RxJS, d'autre part, est une bibliothèque plus générale pour la programmation réactive en JavaScript. Bien que RxJS puisse être utilisé pour le développement de l'interface utilisateur, il n'a pas le même niveau d'intégration avec Angular que les signaux.

Cela étant dit, les signaux et RxJS ne s'excluent pas mutuellement. En fait, ils peuvent être utilisés ensemble pour créer de puissantes applications réactives. Par exemple, vous pouvez utiliser RxJS pour modéliser des flux asynchrones complexes, puis utiliser des signaux pour déclencher des mises à jour de l'interface utilisateur en fonction des modifications apportées à ces données.

</details>

## Signal vs RxJS

[source - Josh MORONY](https://www.youtube.com/watch?v=iA6iyoantuo&ab_channel=JoshuaMorony)     

<details>
	<summary></summary>

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

### Untracked

Il est possible de définir comme **untracked** un signal dans une fonction *effect()* afin de n ce qui aura pour effet de ne pas déclencher l*'effect()* si la-dite valeur est modifiée

````typescript
const counter0 = signal(0);
const counter1 = signal(0);

// Executes when `counter0` changes, not when `counter1` changes:
effect(() => console.log(counter0(), untracked(counter1));

counter0.set(1);
// logs 1 0
counter1.set(1);
// does not log
counter1.set(2);
// does not log
counter1.set(3);
// does not log
counter0.set(2);
// logs 2 3
````
[Back to top](#signals)  

</details>
   
