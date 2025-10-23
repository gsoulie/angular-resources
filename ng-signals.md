[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Signals

* [Concept](#concept)
* [Syntaxe](#syntaxe)     
* [effect](#effect)
* [Bonnes pratiques](#bonnes-pratiques)     
* [Avantages et inconvénients](#avantages-et-inconvénients)     
* [Signal vs RxJS](#signal-vs-rxjs)
* [toObservable, fromObservable](#toObservable-fromObservable)
* [linkedSignal](#linkedSignal)     

> [Documentation angular officielle](https://angular.io/guide/signals)     

## Concept 

<details>
	<summary></summary>

> [Top article, Signals in 3 minutes](https://itnext.io/angular-signals-in-3-minutes-7f70f9e125ae)      

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

### Signal Read only

Il est possible de déclarer un signal en lecture seule de la manière suivante :

````typescript
counter = signal(0);

const readOnlyCounter = this.counter.asReadonly();

// Ceci lèvera une erreur !
readOnlyCounter.set(5);
````


### Exemple d'écriture : signal, control flow

````typescript
@Component({
	standalone: true,
	selector: 'app-detail',
	template: `
		@if(todo() as todo) {
			<h2>{{ todo.title }}</h2>
			<p>{{ todo.description }}</p>
		} @ else {
			<p>Could not find todo...</p>
		}
	`
})

export default class DetailComponent {
	private route = inject(ActivatedRoute);
	private todoService = inject(TodoService);
	
	private paramMap = toSignal(this.route.paramMap);	// transformation de l'observable paramMap en signal
	
	todo = computed(() => 
		this.todoService
			.todos()
			.find((todo) => todo.id === this.paramMap()?.get('id'))
	);
}
````

### Exemple de service avec Signal

export class TodoService {

	// On souhaite que seule cette classe puisse modifier ce signal. 
	// Ajouter un '#' rend cette variable privée
	#todos = signal<Todo[]>([]);
	
	todos = this.#todos.asReadonly();	// cette variable est lisible publiquement
	
	addTodo(todo: CreateTodo) {
		this.#todo.update((todos) => [
			...todos, 
			{...todo, id: Date.now().toString() },
		]);
	}
}

## Bonnes pratiques Signal

https://blog.angular-university.io/angular-signals/
[Back to top](#signals)     

## effect

<details>
	<summary>Détecter le changement d'un signal avec effect</summary>

https://angularexperts.io/blog/angular-signals-push-pull      

Un signal est un wrapper autour d'une valeur, qui est capable d'informer les consommateurs intéressés lorsque cette valeur change. Étant donné que la lecture d'un signal se fait via un getter plutôt que d'accéder à une variable ou à une valeur simple, les signaux sont capables de garder une trace de l'endroit où ils sont lus.

Les signaux **computed** se basent sur la valeur actuelle (la plus récente) des émetteurs référencés s'il est obsolète (une seule fois, même s'il a reçu plusieurs notifications)

Si l'on souhaite uniquement *détecter* le changement de valeur d'un signal, on peut utiliser la fonction **effect()**. Cette dernière doit s'exécuter dans un contexte d'injection (temps du constructeur) car il injecte **DestroyRef** en arrière plan pour fournir un auto-nettoyage. Il est **déclenché** lorsque la valeur des signaux qui sont à l'intérieur du bloc de code sont mises à jour.

**IMPORTANT** Pour traquer le changement de valeur, il faut utiliser le signal dans le ````effect()````. De plus, ce dernier ne se déclenche pas si la valeur observée n'est pas modifiée. 

*exemple 1*

````typescript
//The effect will be re-run whenever any 
// of the signals that it uses changes value.
effect(() => {

  // We just have to use the source signals 
  // somewhere inside this effect
  const currentCount = this.counter();

  const derivedCounter = this.derivedCounter();

  console.log(`current values: ${currentCount} 
    ${derivedCounter}`);

});
````


Dans le code suivant, l'effect est déclenché à l'initialisation et affichera 'Effect runs with : true' :

*Exemple 2*

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

### Cas très particulier

Il peut arriver dans de rares cas, que l'on ait besoin de modifier un signal depuis le *effect*. Pour se faire, il faut utiliser le paramètre ````allowSignalWrites: true````


````typescript
@Component({...})
export class CounterComponent {
  count = signal(0);

  constructor() {

    effect(() => {
      this.count.set(1);
    },
        {
            allowSignalWrites: true
        });
  }
}
````

</details>

## Bonnes pratiques

### Partager un signal entre plusieurs composants 

<details>
	<summary>Voici comment partager un signal dans toute l'application</summary>

 > Attention, cela implique que le signal peut être modifié de n'importe où, il faut donc être prudent avec cette façon de faire. La meilleure solution est de partager le signal via un service (voir solution plus bas)


*Déclarer le signal dans un fichier externe*

````typescript
// main.ts
import { signal } from "@angular/core";

export const count = signal(0);
````

*Utiliser le signal dans les composants*

````typescript
// app.component.ts
import { Component } from "@angular/core";
import { count } from "./main";

@Component({
  selector: "app",
  template: `
    <div>
      <p>Counter: {{ count() }}</p>
      <button (click)="increment()">Increment from HundredIncrComponent</button>
    </div>
  `,
})
export class HundredIncrComponent {
  count = count;

  increment() {
    this.count.update((value) => value + 100);
  }
}
````

La meilleure solution est de partager le Signal via un **service**

````typescript
@Injectable({
  providedIn: "root",
})
export class CounterService {

  // this is the private writeable signal
  private counterSignal = signal(0);

  // this is the public read-only signal
  readonly counter = this.counterSignal.asReadonly();

  constructor() {
    // inject any dependencies you need here
  }

  // anyone needing to modify the signal 
  // needs to do so in a controlled way
  incrementCounter() {
    this.counterSignal.update((val) => val + 1);
  }
}
````
</details>

### Ne pas modifier directement les propriétés ou la valeur d'un signal

<details>
	<summary>Il est fortement déconseillé de modifier directement la valeur ou la propriété d'un Signal </summary>

 ````typescript
@Component(
    selector: "app",
    template: `
  <h3>List value: {{list()}}</h3>
  <h3>Object title: {{object().title}}</h3>
`)
export class AppComponent {

    list = signal([
        "Hello",
        "World"
    ]);

    object = signal({
       id: 1,
       title: "Angular For Beginners"
    });

    constructor() {
        this.list().push("Again");		
        this.object().title = "overwriting title";
    }
}
````

Modifier directement le Signal sans passer par une fonction ````set()```` ou ````update()```` contourne l'ensemble du système de fonctionnement
de Signal, ce qui peut provoquer des bugs. En effet, modifier directement la propriété ou la valeur d'un signal, ne déclenchera pas la mise à jour
des autres Signaux de type ````computed()```` qui pourrait lui être rattaché.

</details>

### Vérification d'égalité

Une autre chose à mentionner concernant les signaux de tableau ou d'objet est que la vérification d'égalité par défaut est "===".

Cette vérification d'égalité est importante car un signal n'émettra une nouvelle valeur que si la nouvelle valeur que nous essayons d'émettre est différente de la valeur précédente.

Si la valeur que nous essayons d'émettre est considérée comme la même que la valeur précédente, alors Angular n'émettra pas la nouvelle valeur du signal.

Il s'agit d'une optimisation des performances qui évite potentiellement un nouveau rendu inutile de la page, au cas où nous émettrions systématiquement la même valeur.

Le comportement par défaut est cependant basé sur l'égalité référentielle "===", ce qui ne nous permet pas d'identifier des tableaux ou des objets fonctionnellement identiques.

## Avantages et inconvénients

<details>
	<summary>Que nous apporte Signal ?</summary>

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

## toObservable fromObservable

<details>
	<summary>Mixer les signals et observables</summary>

````typescript
@Component({
  selector: 'app-desserts',
  standalone: true,
  imports: [DessertCardComponent, FormsModule, JsonPipe],
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DessertsComponent {
  #dessertService = inject(DessertService);
  #ratingService = inject(RatingService);
  #toastService = inject(ToastService);

  originalName = signal('');
  englishName = signal('Cake');
  loading = signal(false);

  ratings = signal<DessertIdToRatingMap>({});
  ratedDesserts = computed(() => this.toRated(this.desserts(), this.ratings()));

  originalName$ = toObservable(this.originalName);
  englishName$ = toObservable(this.englishName);

  desserts$ = combineLatest({
    originalName: this.originalName$,
    englishName: this.englishName$,
  }).pipe(
    filter((c) => c.originalName.length >= 3 || c.englishName.length >= 3),
    debounceTime(300),
    tap(() => this.loading.set(true)),
    switchMap((c) =>
      this.#dessertService.find(c).pipe(
        catchError((error) => {
          this.#toastService.show('Error loading desserts!');
          console.error(error);
          return of([]);
        }),
      ),
    ),
    tap(() => this.loading.set(false)),
  );

  desserts = toSignal(this.desserts$, {
    initialValue: [],
  });

  […]
}
````
</details>

## linkedSignal
````linkedSignal```` permet de créer un signal writable (contrairement à ````computed()```` lié à un autre signal. Il peut se réinitialiser en cas de modification du signal source.

Cela le rend particulièrement utile dans les situations où l'état local doit rester synchronisé avec les données dynamiques.

 ````typescript
 const options = signal(['apple', 'banana', 'fig']);

// Choice defaults to the first option, but can be changed.
const choice = linkedSignal(() => this.options()[0]);
console.log(this.choice()); // apple

this.choice.set('fig');
this.console.log(this.choice()); // fig

// When options change, choice resets to the new default value.
this.options.set(['peach', 'kiwi']);
console.log(this.choice()); // peach
````


**Autre exemple plus concret**

````typescript
import { signal, linkedSignal } from '@angular/core';

@Component({
  // ...
})
export class UserFormComponent {
  // Signal parent
  user = signal({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  });
  
  // Signaux liés - remarquez qu'on extrait directement les propriétés !
  firstName = linkedSignal(
    this.user,
    (user) => user.firstName,
    (user, newFirstName) => ({ ...user, firstName: newFirstName })
  );
  
  lastName = linkedSignal(
    this.user,
    (user) => user.lastName,
    (user, newLastName) => ({ ...user, lastName: newLastName })
  );
  
  // Maintenant, on peut faire ça :
  updateFirstName(name: string) {
    this.firstName.set(name); // Met aussi à jour this.user !
  }
  
  // OU mettre à jour directement le parent :
  resetForm() {
    this.user.set({
      firstName: '',
      lastName: '',
      email: ''
    });
    // Les signaux liés sont automatiquement mis à jour !
  }
}
````


> Chaque modification d’un signal lié met à jour le signal parent, et vice-versa. C’est comme avoir une synchronisation bidirectionnelle sans les inconvénients de la double liaison de données !

**Quels intérêts ?**

* **Moins de code** : Fini les nombreux computed() qui ne font que refléter l'état
* **Cohérence garantie** : Impossible d’oublier de mettre à jour un signal dérivé
* **Structure de données immuable** : On préserve l’immutabilité tout en ayant une API pratique
* **Lisibilité améliorée** : Votre code exprime clairement les relations entre les données
* **Performances optimisées** : Moins de recalculs inutiles comparé à des computed() en cascade

**Attention aux pièges !**
Comme toute bonne chose dans la vie, ````linkedSignal()```` vient avec **quelques avertissements** :

* Évitez les références circulaires (oui, c’est possible, et non, ce n’est pas joli)
* N’abusez pas des signaux liés pour des structures de données trop profondes
* Souvenez-vous que chaque mise à jour du signal parent crée un nouvel objet

### Cas d’usage parfaits
````linkedSignal()```` brille particulièrement dans ces scénarios :

**1. Formulaires complexes**
Parfait pour les formulaires avec de nombreux champs qui doivent tous être synchronisés avec un modèle de données.

````typescript
// État global du formulaire
formData = signal({ name: '', email: '', address: { street: '', city: '' } });

// Extraction d'un sous-objet
addressData = linkedSignal(
  this.formData,
  (data) => data.address,
  (data, newAddress) => ({ ...data, address: newAddress })
);

// Et on peut encore extraire plus profondément
street = linkedSignal(
  this.addressData,
  (addr) => addr.street,
  (addr, newStreet) => ({ ...addr, street: newStreet })
);
````

**2. État partagé entre composants**
Lorsque plusieurs composants partagent un même état mais ont besoin d’accéder à des parties différentes.

**3. Architecture en oignon pour vos données**
Créez une hiérarchie propre de signaux qui reflète la structure de vos données.

