[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# RxJS

* [opérateurs](#opérateurs)     
* [exemple](#exemple)     

https://rxjs-dev.firebaseapp.com/guide/subject        
https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular         

## opérateurs

https://rxmarbles.com/#map

|operator|description|
|-|-|
|catchError|permet de traiter une erreur proprement|
|combineLatest|combine les dernières valeurs de chaque observable qui le compose et n'émet un résultat que lorqu'il a reçu au moins une réponse pour chaque observabe|
|debounceTime|permet d'ajouter un délai au traitement (ex : searchbar)|
|distinctUntilChanged|émet uniquement si la valeur a changée (ex : searchbar)|
|distinctUntilKeyChanged|émet uniquement si la valeur de la clé de l'objet passé en paramètre a changée (ex : searchbar)|
|every|retourne vrai si toutes les valeurs de la source valident la condition, retourne faux sinon|
|filter|permet de filtrer les résultats de la source|
|finalize|appelé après le bloc .subscribe(), permet de gérer la fin d'un chargement (fermer un indicateur de chargement, afficher un toast etc...)|
|forkJoin|retourne un tableau contenant le résultat de chaque observable. Important : retournera une erreur si au moins 1 observable est en erreur|
|from|créer un observable à partir d'une promise => converti une entrée en observable (conversion promise en observable : from(this.myPromiseFunction())|
|map|permet de créer un nouvel Observable à partir de l'Observable d'origine en transformant simplement chacune de ses valeurs|
|merge|fusionne plusieurs observables en un observable unique. Attention émet pour chaque résultat (si 3 observable, émet 3 fois)|
|of|créé un observable à partir de données statiques|
|pipe|opérateur principal qui permet le chaînage de plusieurs opérateurs|
|reduce|applique un accumulateur sur la source et retourne le résultat accumulé lorsque la source complete|
|retry(x)|permet de rééxécuter une requête x fois|
|shareReplay(x)|permet de mettre en cache des données et éviter d'appeler plusieurs fois un même service si nous n'avons pas besoin d'avoir des données constamment rafraichies. X est le nombre de dernières valeurs émises que l'on souhaite envoyer à chaque nouveau souscripteur|
|mergeMap|assure la **mise en parallèle** : l'Observable extérieur peut souscrire aux Observables intérieurs suivants sans attendre que les précédents soient complétés. |
|concatMap|assure la **mise en série**. Il attend que les Observables intérieurs complètent avant de souscrire aux suivants– même si l'Observable extérieur émet plusieurs fois. Les Observables intérieurs seront traités en séquence à la suite.|
|exhaustMap|Attend le traitement complet d'un observable avant de lancer l'écoute d'un nouvel observable (**il est bloquant** en qq sortes)|
|switchMap|permet de retourner un nouvel observable à partir du résultat de la source. **Les observables précédents sont annulés**|
|take(x)|ne récupère que les x premières valeurs émises par la source et fait un complete()|
|takeUntil|maintient un observable en vie jusqu'à ce que le Subject rattaché soit complete()|
|tap|étape permettant l'affectation d'une variable ou de faire du debug (console.log) sans modifier le contenu de la source|
|zip|combines les résultats de plusieurs observables, émet UNIQUEMENT **si toutes les sources émettent une donnée**|
|startWith|émet la valeur passée en paramètre en premier|


> <img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : les opérateurs appliqués **ne modifient jamais l'observable d'origine**, ils produisent une copie et renvoient un nouvel observable.

*Exemple*
````typescript
const interval$ = interval(1000)	// 0--1--2--3--4--5--6...
const new$ = interval$
    .pipe(
      skip(1),				// ---1--2--3--4--5--6...
      take(5),				// ---1--2--3--4--5|
      filter(v => v % 2 === 0),		// ------2-----4---|
      map(v => v + 1)			// ------3-----5---|
    );
this.sampleIntervalSubscription$ = new$.subscribe(
	(data) => console.log(data),
	(err) => console.log('Error !'),
	() => console.log('complete !')
);
````

### Aplatir 

|action|opération|opérateur unique|
|-|-|-|
|exécution parallèle|map(), mergeAll()|mergeMap()|
|exécuter à la suite|map(), concatAll()|concatMap()|
|annuler la précédente|map(), switch()|switchMap()|
|annuler la nouvelle|map(), exhaust()|exhaustMap()|

**switchMap** utilisé dans le cas d'une complétion automatique. On veut les résultat de la dernière requête (ce que l'utilisateur a tappé en dernier)
=> A chaque nouvelle frappe on annule la requête précédente

**exhaustMap** : tant que le traitement en cours n'est pas terminé on ne tient pas compte des traitements suivants

### Illustration
[Back to top](#rxjs)     

[source Simon GRIMM](https://www.youtube.com/watch?v=NTs-apc4qz4&ab_channel=SimonGrimmSimonGrimm)     

*pipe*

````javascript
import {filter, map} from 'rxjs/operators;

getAlertMsg(): Observable<string> {
	const notif: Observable<Notification> = this.getNotifications();

   return notif.pipe(
	filter(notif => notif.type === 'ALERT'),
	map(notif => notif.code + ' : ' + notif.message)
   );
}

 fetchUsersAndEmail() {
    return this.http.get(this.url).pipe(
      // Adapt each item in the raw data array
      map((data: User[]) => data.map(item => item.name + ' - ' + item.email))
    );
  }
````

*from*
````typescript
from : convertir une entrée en observable (ex convertir une promise en observable)
ex : const obs = from(Storage.get({key: 'testkey'}));
obs.subscribe(res => console.log(res));
````

#### Combinaison

*forkjoin* VS *combineLatest*

L'opérateur **forkJoin** de RxJS attend que tous les observables fournies en entrée émettent au moins une valeur, puis retourne leurs dernières valeurs sous forme d'un tableau. Si l'une des observables échoue, l'opérateur forkJoin retournera une erreur.

L'opérateur **combineLatest**, quant à lui, combine les dernières valeurs émises par chaque observable en entrée et **retourne une nouvelle valeur chaque fois qu'un de ces observables émet une valeur**. Si l'une des observables échoue, l'opérateur combineLatest ignorera l'erreur et continuera à combiner les valeurs des autres observables.

Voici un exemple pour illustrer la différence entre ces deux opérateurs :

````typescript
const obs1 = of(1, 2, 3);
const obs2 = of(4, 5, 6);

forkJoin([obs1, obs2]).subscribe(console.log);
// Output: [3, 6]

combineLatest([obs1, obs2]).subscribe(console.log);
// Output: [1, 4], [2, 4], [2, 5], [3, 5], [3, 6]
````

*forkJoin* 

> <img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : si au moins 1 observable est en erreur, alors le forkjoin retournera une erreur et aucun résultat pour les observables qui ont succeeded

````typescript
forkJoinExample() {
	const obs1 = this.http.get('https://swapi.dev/api/people/1');
	const obs2 = this.http.get('https://swapi.dev/api/people/2');
	// similar to Pomise.all(), won't emit if there is an error
	return forkJoin([obs1, obs2]);
}
````
*zip*
````typescript
zipExample() {
	const obs1 = this.http.get('https://swapi.dev/api/people/1');
	const obs2 = this.http.get('https://swapi.dev/api/people/2');
	// Emits ONLY when both sources emit values
	return zip(obs1, obs2);
}
````

*combineLatest*

https://www.youtube.com/watch?v=SXOZaWLs4q0&ab_channel=JoshuaMorony

Utile si utilisation de collections qui changent régulièrement, utilisation de firebase etc...Combiner plusieurs observables (pratique pour filtrer un affichage sur plusieurs paramètres)

> <img src="https://img.shields.io/badge/Attention-DD0031.svg?logo=LOGO"> ! Si un ou plusieurs observables du combineLatest lève une erreur, alors combineLatest se désabonne de tous les observables et stoppe l'émission du flux en cours

````typescript
combineLatestExample() {
	const obs1 = this.http.get('https://swapi.dev/api/people/1');
	const obs2 = this.http.get('https://swapi.dev/api/people/2');
	// when any observable emits a value, emit the last emitted value from each
	return combineLatest([obs1, obs2]);
}
````

````typescript
vm$ = combineLatest([stream1$, stream2$, stream3$]).subscribe((res) => console.log(res));

stream1$.next(1);	// => combineLatest ne retourne rien
stream2$.next(2);	// => combineLatest ne retourne rien
stream3$.next(3);	// => combineLatest retorune le résutat
[1, 2, 3]
stream1$.next(4);	// => combineLatest retourne le résultat
[4, 2, 3]
````

**Exemple 2**

*controller*

````typescript
users$ = of(this.users);
usernames$ = this.users$.pipe(map(users => users.map(u => u.name)));
filteredUsers$ = this.users$.pipe(
	filter(users => users.every(u => u.isActive));
);

data$ = combineLatest([
	this.users$,
	this.usernames$,
	this.filteredUsers$
])
.pipe(
	// transformer le type tableau d'observable en type objet pour pouvoir l'exploiter plus facilement dans la vue html
	map(([users, usernames, filteredUsers]) =>
	    ({
		users,
		usernames,
		filteredUsers
	    })
	)
);
````

*Vue*

````html
<div *ngIf="data$ | async as data">
	<div *ngFor="let u of data.users">
		{{ u.name }} {{ u.isActive }}
	</div>
	<div *ngFor="let username of data.usernames">
		{{ username }}
	</div>
	<div *ngFor="let u of data.filteredUsers">
		{{ u.name }} {{ u.isActive }}
	</div>

</div>
````

**Exemple 3**

Dans cet exemple, on souhaite combiner plusieurs observables pour n'utiliser qu'une seule souscription dans la vue. Pour ce faire, nous utilisons l'opérateur
````combineLatest````.

*home.component.ts*

````typescript
Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h2>Home page</h2>
      <h3>{{ vm.greeting }}</h3>
      <p>Welcome back {{ vm.user }}</p>
      <p>{{ vm.count }}</p>
    </ng-container>
  `
})
export class HomeComponent {
  greeting$ = of('Hello!');
  count$ = interval(500);
  
  vm$ = combineLatest([
    this.greeting$,
    this.count$,
    this.userService.user$
  ]).pipe(map(([greeting, count, user]) => ({ greeting, count, user }))
  );

  constructor(private userService: UserService) {}
}
````

**Amélioration** : Dans le code précédent, en cas de traitement asynchrone long ou d'erreur,
la vue est bloquée.

Pour corriger celà, on rajoute des directives structurelles dans la vue ainsi qu'un ````catchError```` permettant
de catch l'erreur est de retourner un observable contenant l'erreur


*home.component.ts*

````typescript
Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h2>Home page</h2>
      <h3>{{ vm.greeting }}</h3>
      <p *ngIf="vm.user; else userLoading">Welcome back {{ vm.user }}</p>
      <p>{{ vm.count }}</p>
      <ng-template #userLoading>
        <p>Loading...</p>
        <p *ngIf="vm.userError">There was an error: {{ vm.userError }}</p>
      </ng-template>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  greeting$ = of('Hello!');
  count$ = interval(500);
  userError$ = this.userService.userErrored$.pipe(
    ignoreElements(),
    startWith(null),
    catchError((err) => of(err))
  );

  vm$ = combineLatest([
    this.greeting$,
    this.count$,
    this.userService.userErrored$.pipe(
      startWith(null),
      catchError(() => EMPTY)
    ),
    this.userError$,
  ]).pipe(
    map(([greeting, count, user, userError]) => ({
      greeting,
      count,
      user,
      userError,
    }))
  );

  constructor(private userService: UserService) {}
}
````

*merge*
````typescript
mergeExample() {
	const obs1 = this.http.get('https://swapi.dev/api/people/1');
	const obs2 = this.http.get('https://swapi.dev/api/people/2');
	// Turn multiple observables into a single observable, EMITS FOR EACH RESULT 
	return merge(obs1, obs2);
}

````

#### Transformation
[Back to top](#rxjs)     

*map*
````typescript
mapExample() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(map((res: any) => {
		return result.films;
	}))
}
````

*switchMap*

Permet de retourner un nouvel observable

````typescript
switchMapExample() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(switchMap((res: any) => {
		const firstFilm = result.films[0];
		return this.http.get(firstFilm);
	}))
}
````

*reduce*
````typescript
reduceExample() {
	const source = of(1, 2, 3, 4);
	return source.pipe(reduce((acc, val) => acc + val));
	//output: Sum: 10'
}
````

#### Filtrage
[Back to top](#rxjs)     

*filter*
````typescript
filterExample() {
	const obs = from([1, 2, 3, 4]);
	return obs.pipe(
		filter(result => result > 2)
	)
}
````

*every*

````typescript
everyExample() {
	const source = of(1, 2, 3, 4, 5);
	return source.pipe(
	  //is every value even?
	  every(val => val % 2 === 0)
	);
}
````

*take*

Emet uniquement la première valeur émise par la source puis fait un *complete()*

````typescript
takeExample() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(take(1))
}

````

*takeUntil*

Maintient l'observable en vie jusqu'à ce que le Subject rattaché soit au statut complete

````typescript
private destroy = new Subject();

takeUntil() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(takeUntik(this.destroy))
}
ngOnDestroy() {
	this.destroy.next();
	this.destroy.complete();	// --> détruit le takeUntil
}

````

*debounceTime*

Ajouter un délai dans le traitement de la source, très utilisé dans le cas d'une searchbar par exemple

````typescript
debouceTimeExample() {
	return this.myForm.valueChanges.pipe(
		debounceTime(400) // Ex : Obtenir la valeur d'un champ de saisie après 0.4s
	)
}
````

*distinctUntilChanged*

Emet uniquement si la valeur a changée. Très utilisé dans le cas d'une searchbar par exemple, évite de refaire un appel si l'utilisateur a saisi la même valeur que la précédente

L'opérateur distinctUntilChanged() compare deux objets pour éffectuer sa comparaison. Si l'on compare 2 types primitifs, il n'y a pas de problème.
En revanche si l'on compare 2 objets (json par exemple) alors la comparaison retournera toujours faux ({} === {} ==> false).

C'est pour quoi, dans le cas où l'observable source émet des valeurs non primitives, il faut, au choix :

* spécifier une fonction de comparaison

````typescript
$myObs: Observable<{userName: string, userAge: number}>

$myObs.pipe(
	distinctUntilChanged((prev, curr) => prev.userName !== curr.userName)
)
````

* utiliser plutôt l'opérateur ````distinctUntilKeyChanged()````

````typescript
$myObs: Observable<{userName: string, userAge: number}>

$myObs.pipe(
	distinctUntilKeyChanged('userName'),
)
````

#### Utilitaires
[Back to top](#rxjs)     

*tap*

Tap est une étape permettant d'affecter une variable locale ou de faire du debug. Il n'affecte pas et ne transforme pas le résultat de l'obsevable

````typescript
tapExample() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(
		tap(data => {
			console.log(data);
		})
	)
}

````

*finalize*

Pratique si on utilise un indicateur de chargement par exemple. Il suffit de fermer le loader dans le finalize. finalize est appelé après le bloc .subscribe()
````typescript
finalizeExample() {
	return this.http.get('https://swapi.dev/api/people/1')
	.pipe(
		finalize(() => {
			console.log('i have finished');
		})
	)
}

````

#### Gestion des erreurs

*catchError*
````typescript
catchExample() {
	return this.http.get('https://swapi.dev/api/people/1337')
	.pipe(
		catchError(e => {
			this.showToast();
			return of(`There was an error: ${e.error.detail}`);
		})
	)
}

````

*retry*
````typescript
retryExample() {
	return this.http.get('https://swapi.dev/api/people/1337')
	.pipe(
		retry(2),
		catchError(e => {
			this.showToast();
			return of(`There was an error: ${e.error.detail}`);
		})
	)
}
````

#### Multicasting

*shareReplay*

Mettre en cache des données avec shareReplay. En appelant x fois la fonction shareReplayExample(), 1 seul appel http sera effectué. Utile lorsque l'on a besoin d'une valeu une fois et que l'on a pas besoin d'avoir tout le temps des données rafraichies

````typescript
sharedData = this.http.get('https://swapi.dev/api/people/1')
.pipe(shareReplay(1));

shareReplayExample() {
	return this.sharedData;
}
````
**ATTENTION** La syntaxe suivante réalisera x appels http. Ceci parce que dans ce cas précis on retourne un nouvel observable à chaque appel de fonction

````typescript
shareReplayExample() {
	this.http.get('https://swapi.dev/api/people/1')
	.pipe(shareReplay(1));
}
````

*behaviourSubject*, *replaySubject*

*behaviourSubject* peut être utile dans le cas de l'authentification. On pourrait récupérer les paramètres par défaut dans le local storage et les mettre à jour plus tard etc...

Le *replaySubject* garde en mémoire les X dernières valeurs. Chaque nouveau souscripteur recevra ces X dernières valeurs replaySubject = new ReplaySubject(2);

````typescript
replaySubjectExample() {
	setTimeout(() => {
		this.replaySubject.next(1),
	}, 1000);
	
	setTimeout(() => {
		this.replaySubject.next(42),
	}, 2000);
	
	setTimeout(() => {
		this.replaySubject.next(200),
	}, 3000);
}

// Ici chaque nouveau souscripteur recevra 42 puis 200
````

## Exemple 
[Back to top](#rxjs)

[Understanding RxJS operators](https://www.digitalocean.com/community/tutorials/rxjs-operators-for-dummies-forkjoin-zip-combinelatest-withlatestfrom)        

*Starting code sample*
````typescript
// 0. Import Rxjs operators
import { forkJoin, zip, combineLatest, Subject } from 'rxjs';
import { withLatestFrom, take, first } from 'rxjs/operators';

// 1. Define shirt color and logo options
type Color = 'white' | 'green' | 'red' | 'blue';
type Logo = 'fish' | 'dog' | 'bird' | 'cow';

// 2. Create the two persons - color and logo observables,
// They will communicate with us later (when we subscribe)
const color$ = new Subject<Color>();
const logo$ = new Subject<Logo>();

// 3. We are ready to start printing shirt. Need to subscribe to color and logo observables to produce shirts, we will write code here later
...

// 4. The two persons(observables) are doing their job, picking color and logo
color$.next('white');
logo$.next('fish');

color$.next('green');
logo$.next('dog');

color$.next('red');
logo$.next('bird');

color$.next('blue');

// 5. When the two persons(observables) has no more info, they said bye bye.. We will write code here later
...
````

### zip

zip : les observables sont inséparables, il n'y aura pas de résultat tant que tous les observables n'auront pas répondus. Tous les observables s'attendent.

````typescript
zip(color$, logo$)
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
	
// color$ est un observable (un Subject) qui retourne une couleur de type "color"
// logo$ est un observable qui retourne un logo de type "logo"	
````	

### combineLatest

combineLatest : les observables ne s'attendent pas après leur première exécution. Au premier appel, couleur ET logo s'attendent et exécutent le log. une fois fait 
la première fois, à chaque fois que la couleur OU le logo changera, le log sera déclenché même si un seul des 2 est modifié.

````typescript
combineLatest(color$, logo$)
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
````

### withLatestFrom

withLatestFrom : de type master - slave. Au début, le master doit rencontrer l'esclave. Après cela, le mater prendra les devants, donnant le commandement, 
l'action est déclenchée à chaque fois uniquement lorsque le maître renvoie une nouvelle valeur

````typescript
color$.pipe(withLatestFrom(logo$))
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
````

Au début (une seule fois), la couleur (master) recherchera le logo (esclave). Une fois que le logo (esclave) a répondu, la couleur (master) prendra la tête.
Le journal sera déclenché chaque fois que la valeur de couleur (principale) suivante est modifiée. Les modifications de la valeur du logo (esclave) ne déclenchent pas le journal de la console.

### forkJoin

forkJoin : ne déclenche uniquement lorsqu'il est certain que tous les observables ont répondus.
````typescript
forkJoin([color$, logo$])
.subscribe({
	next: (data) => {
		console.log(`${data[0]} shirt with ${data[1]}`));
	},
	error: (err) => {

	}
});
````	
Aucun log ne sera déclenché dans ce cas étant donné que les observables color$ et logo$ ne sont jamais terminé (on appelle toujours un .next);

Pour les considérés comme terminés, il faut appeler :

````typescript
// 5. When the two persons(observables) ...
color$.complete();
logo$.complete();
````

[Back to top](#rxjs)
