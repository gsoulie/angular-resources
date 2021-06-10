[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# RxJS

* [Opérateurs](#opérateurs)         


https://rxjs-dev.firebaseapp.com/guide/subject        
https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular         

## opérateurs

https://rxmarbles.com/#map

|operator|description|
|-|-|
|pipe|permet le chaînage de plusieurs opérateurs|
|map|L'opérateur map permet de créer un nouvel Observable à partir de l'Observable d'origine en transformant simplement chacune de ses valeurs.|
|tap|obsolète|


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
