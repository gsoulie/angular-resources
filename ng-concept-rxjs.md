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
|pipe|opérateur principal qui permet le chaînage de plusieurs opérateurs|
|from|converti une entrée en observable (conversion promise en observable)|
|of|émet des valeurs dans une séquence|
|map|permet de créer un nouvel Observable à partir de l'Observable d'origine en transformant simplement chacune de ses valeurs|
|switchMap|permet de retourner un nouvel observable à partir du résultat de la source|
|forkJoin|retourne un tableau contenant le résultat de chaque observable. Important : retournera une erreur si au moins 1 observable est en erreur|
|zip|émet UNIQUEMENT si toutes les sources émettent une donnée|
|combineLatest|émet la dernière valeur de chaque observable lorsqu'un des observable émet une valeur|
|merge|fusionne plusieurs observables en un observable unique. Attention émet pour chaque résultat (si 3 observable, émet 3 fois)|
|tap|étape permettant l'affectation d'une variable ou de faire du debug (console.log) sans modifier le contenu de la source|
|filter|permet de filtrer les résultats de la source|
|every||
|reduce||
|take(x)|émet uniquement la première valeur émise par la source et fait un complete()|
|takeUntil|maintient un observable en vie jusqu'à ce que le Subject rattaché soit complete()|
|debounceTime|permet d'ajouter un délai au traitement (ex : searchbar)|
|distinctUntilChanged|émet uniquement si la valeur a changée (ex : searchbar)|
|finalize|appelé après le bloc .subscribe(), permet de gérer la fin d'un chargement (fermer un indicateur de chargement, afficher un toast etc...)|
|catchError|permet de traiter une erreur proprement|
|retry(x)|permet de rééxécuter une requête x fois|
|shareReplay(x)|permet de mettre en cache des données et éviter d'appeler plusieurs fois un même service si nous n'avons pas besoin d'avoir des données constamment rafraichies|


> Important : les opérateurs appliqués **ne modifient jamais l'observable d'origine**, ils produisent une copie et renvoient un nouvel observable.

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

*forkJoin* 

> Important : si au moins 1 observable est en erreur, alors le forkjoin retournera une erreur et aucun résultat pour les observables qui ont succeeded

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

Utile si utilisation de collections qui changent régulièrement, utilisation de firebase etc...

````typescript
combineLatestExample() {
	const obs1 = this.http.get('https://swapi.dev/api/people/1');
	const obs2 = this.http.get('https://swapi.dev/api/people/2');
	// when any observable emits a value, emit the last emitted value from each
	return combineLatest([obs1, obs2]);
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

````typescript
distinctUntilChangedExample() {
return this.myForm.valueChanges.pipe(
		debounceTime(400),
		distinctUntilChanged((prev, curr) => prev.username === curr.username)
	)
}
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
