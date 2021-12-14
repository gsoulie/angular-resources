[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Observables

* [Liens](#liens)         
* [Notions Subject et BehaviorSubject](#notions-subject-et-behaviorsubject)     
* [Bonnes pratiques](#bonnes-pratiques)      
* [Cold et Hot](#cold-et-hot)      
* [Observables imbriqués](#observables-imbriqués)     
* [Exemples cold et hot](#exemples-cold-et-hot)     
* [Chaîner les observables](#chaîner-les-observables)     
* [Unsubscribe to all](#unsubscribe-to-all)      
* [async pipe](#async-pipe)    
* [Exemples code](#exemples-code)      
* [Tester la taille du contenu](#tester-la-taille-du-contenu)     


## Liens
https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular       
https://guide-angular.wishtack.io/angular/observables/creation-dun-observable       
https://www.youtube.com/watch?v=TrDqaABq-UY&ab_channel=DevoxxFR         
[RxJS operators](https://www.learnrxjs.io/learn-rxjs/operators)       
[RxJS Best practices](https://blog.strongbrew.io/rxjs-best-practices-in-angular/)     

on utilise les observables pour représenter l'arrivée de données synchrone ou asynchrone.

on peut recevoir une seule données ex : appel http (cold observable)
ou plusieurs données étalées dans le temps ex : websocket

l'observable a 3 type de notifications :

- next chaque arrivée d'une data
- error va casser l'observable, plus rien ne se passe
- complete est la terminaison, plus rien ne se passe

## Notions Subject et BehaviorSubject
[Back to top](#observables)

[ngConf](https://www.youtube.com/watch?v=_q-HL9YX_pk&ab_channel=ng-conf)     

- **Subject** => le subject permet de multicaster un observable. Chaque nouveau souscripteur, recevra les données en cours d'émission s'il y en a. Si un souscripteur arrive après l'émission des données, il n'aura aucune valeur.
Un Sujet est à la fois un observable et un observateur. Cela nous donne la possibilité d'intégrer nous-mêmes les valeurs suivantes dans le flux

- **BehaviorSubject** => se souvient de la dernière data émise. Permet aux nouveaux souscripteurs d'avoir au moins une data si on subscribe après que l'observable est émis sa dernière donnée.

- **ReplaySubject** => Rejouer les anciennes data aux nouveaux subscribers

- **AsyncSubject** => ne retourne que la valeur la plus faîche aux subscribers (l'envoi se fait lors du completed). C'est à dire
que le subject peut recevoir x data, mais les subscribers ne recevront que la dernière. Utile si uniquement la données la plus récente nous intéresse

### Exemples concrets

#### Observable classique 

````typescript
ngOnInit() {
    const source = interval(1000);

    const subscribe = source.subscribe(val => console.log(`first ${val}`));

    setTimeout(() => {
      const subscribe2 = source.subscribe(val => console.log(`second ${val}`));
      subscribe.unsubscribe();
      setTimeout(() => {
        subscribe2.unsubscribe();
      }, 7000);
    }, 4000);
}

// trace console 
first 0
first 1
first 2
first 3
second 0
second 1
second 2
second 3
second 4
second 5
second 6
````

> On remarque que chaque nouveau souscripteur rejoue toute la séquence depuis le début

#### Subject

````typescript
subj1$ = new Subject();

ngOnInit() {
    const source = interval(1000);
    const subscribe = source.subscribe(val => this.subj1$.next(val));
    this.subj1$.subscribe(val => console.log(`first ${val}`));

    setTimeout(() => {
      this.subj1$.subscribe(val => console.log(`second ${val}`));
      setTimeout(() => {
        this.subj1$.unsubscribe();
      }, 8000);
    }, 4000);
}

// trace console 
first 0
first 1
first 2
first 3
first 4
second 4	// <--
first 5
second 5
first 6
second 6
first 7
second 7
first 8
second 8
````

> On remarque ici que le second souscripteur reçoit les données en cours d'émission mais,
n'a pas connaissance de ce qui a été émis AVANT sa souscription

### BehaviorSubject

````typescript
subj1$ = new BehaviorSubject(0);	// doit être initialisé avec une valeur

ngOnInit() {
    const source = interval(1000);
    const subscribe = source.subscribe(val => this.subj1$.next(val));
    this.subj1$.subscribe(val => console.log(`first ${val}`));

    setTimeout(() => {
      this.subj1$.subscribe(val => console.log(`second ${val}`));
      setTimeout(() => {
        this.subj1$.unsubscribe();
      }, 8000);
    }, 4000);
}

// trace console
first 0 // <-- 1er souscripteur reçoit la valeur initiale
first 0
first 1
first 2
first 3
second 3 // <-- second souscripteur reçoit la dernière valeur mémorisée
first 4
second 4
first 5
second 5
first 6
second 6
first 7
second 7
````

> Au moment de sa souscription, le nouveau souscripteur reçoit la dernière valeur mémorisée, 
puis la suite des valeurs en cours d'émission.

## Bonnes pratiques
[Back to top](#observables)

https://adrien.pessu.net/post/angular_best_practices/       
https://nicolasfazio.ch/programmation/angular/angular-creer-service-reactif-observables        
https://makina-corpus.com/front-end/mise-en-pratique-rxjs-angular       

Eviter la création d'une subscription avec les appels API qui ne retournent qu'un seul résultat (non pas un flux comme pour les sockets) 

````this.apiService.getUsers().pipe(take(1)).subscribe(result => this.users = result); // évite de unsubscribe manuellement````

**Eviter** autant que possible de récupérer les données avec un observable avec subscribe directement dans un composant.
Il est préférable de récupérer les données dans un service dédié ex :

**A éviter**

*service.ts*
````typescript
  load(): Observable<any[]> {
    return this._http.get('https://reqres.in/api/users').pipe(
      map((response: {data: any[]}) => response.data),
      tap(data => this.users = data)
    );
  }
````

*composant.ts*

````typescript
 ngOnInit() {
    // BAD PATTERN: 
    // create service logic inside component
    this._service.load().subscribe(
      res => this.users = res
    )
  }
````

**A Privilégier**

*service.ts*
````typescript
  private _users: BehaviorSubject<any> = new BehaviorSubject(null);
  public users$: Observable<any> = this._users.asObservable();

  constructor(
    private _http: HttpClient
  ) {}

  async load() {
    await this._http.get('https://reqres.in/api/users')
      .pipe(first())
      .toPromise()
      .then((response: {data: any[]}) => {
        // on assign la reponse à la Behavior Subject
        this._users.next(response.data);
      })
      .catch(err => console.log(err))
  }
````

*component.ts*

````typescript
users$: Observable<any[]>;

  constructor(
    private _service: UsersService
  ) {}
  
ngOnInit() {
    this._service.load();
    this.users$ = this._service.users$;
  }
````

#### Souscription

Pour pouvoir récupérer les données d'un observable, il faut s'y abonner via subscribe.

La souscription peut prendre 3 paramètres (next, error et complete) soit :
````subscribe(value, error, ())````
ou un objet de type observer
````subscribe({value, error, ()})````

> Important : Toujours penser à annuler les souscription !!

### Services asynchrones 

Quand on fait un service qui retourne un observable, **on ne souscrit JAMAIS à l'observable dans le service** pour renvoyer les données directement,
car on ne sait pas quand les données arriveront

### Erreurs

Remonter les erreurs là où on peut les traiter.

interception : catchError
rééssayer : retry ou retryWhen

ex : 

````javascript
find(id: string): Observable<Resource> {
	const url = `http://.../.../${id}`;
	return this.httpClient.get<Resource>(url)
	.pipe(
		catchError(error => {
			if (error && error.status === 404) {
				return of(null);
			}
			throw error;
		});
		);
}
````

## Cold et Hot 
[Back to top](#observables)

[source](https://www.youtube.com/watch?v=oKqcL-iMITY&ab_channel=DecodedFrontend)     

- **cold (unicast ex : un CD)** = source démarrée pour chaque souscription. 10 souscriptions = 10 démarrage. recommence du début pour chaque utilisateur
ex appel http, redémarre à chaque appel

- **hot (multicasted ex : une radio)** = 1 seule source diffusé à tout le monde (toutes les souscriptions) simultanément. Si on arrive en cours de route on aura pas les données depuis le début.
ex données qui arrivent sur une websocket

> remarque : on peut transformer un cold en hot

### Création 
of(1, 2, 3); est un observable qui fait next(1); next(2); next(3); complete();

Création d'un hot observable
On va utiliser un Subject qui est à la fois un Observer et un hot Observable

````javascript
const subject = new Subject<number>();
subject.subscribe(v => console.log('observerA : ' + v));
subject.next(1);
// observerA : 1
subject.subscribe(v => console.log('observerB : ' + v));
subject.next(2);
// observerA : 2
// observerB : 2
````

**behaviorSubject** : permet de conserver un état (valeur courante)

**ReplaySubject** : quand on souscrit on reçoit les dernières valeurs qui ont été mises en cache

**fromPromise(p)** : créer un observable à partir d'une promise
**toPromise()** : créer une promise à partir d'un observable
**fromEvent()** : créer un observable à partir d'un event (ex click bouton)

### Cold vers Hot
[Back to top](#observables)

Exemple : Une requête Http est un **cold** observable

Soit le code suivant :

````html
<div>count : {{ (posts$ | async)?.length }}</div>
<ul>
    <li *ngFor="let p of posts$ | async">{{ p.title }}</li>
</ul>
````

````typescript
posts$: Observable<any[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.posts$ = this.http.get<any[]>(`https://jsonplaceholder.typicode.com/posts`);
  }
````

Dans la console nous observons **2 appels** http, le premier pour ````{{ (posts$ | async)?.length }}```` et le second pour ````*ngFor="let p of posts$ | async"````. En effet le chaque pipe ````async```` créé une souscription et donc un appel.

Pour pallier au problème, il suffit de transformer l'appel http en **hot** observable de la manière suivante : 

````typescript
this.posts$ = this.http.get<any[]>(`https://jsonplaceholder.typicode.com/posts`)
      .pipe(shareReplay());
````

### share() : partager un cold à tout un ensemble de souscripteurs
````javascript
// attention exécution se fait à la première souscription. Si on souscrit et que la réponse est déjà arrivée on aura rien
const hot$ = cold$.pipe(share());
````

### shareReplay(5) 

> Important notion NR. Voir rubrique exemple plus bas

````javascript
const hot$ = cold$.pipe(shareReplay(1));
// si la réponse été déjà passée, au moment de la souscription on reçoit immédiatement la réponse (il rejoue le dernier résultat à chaque nouvelle souscription)
// remarque, ne rejoue PAS la requête
````

## Exemples cold et hot
[Back to top](#observables)

### cold to hot observable
On veut créer une liste de livres qui ne va pas souvent être mise à jour, on utilise une requête http (cold donc)
pour renseigner la liste. Le soucis c'est que pour chaque souscription, on va rejouer la requête.

Si on ne veut pas que cela se produise, on va convertir le cold en hot observable

*1 requête http*
````javascript
list$: Observable<Book[]>;

constructor(private httpClient: HttpClient) {
	this.list$ = this.buildRequestObservable();
}

buildRequestObservable() {
	return this.httpClient
	.get<Book[]>(url, {param: params})
	.pipe(
		shareReplay(1);
		);
}

getList(): Observable<Book[]> {
	return this.list$;
}
````

Si on souhaite maintenant rafraichir nos data toutes les heures (uniquement si il y a une nouvelle souscription), il suffira d'ajouter un interval 

*1 requête http max / 1h*
````javascript
constructor(private httpClient: HttpClient) {
	this.list$ = this.buildRequestObservable();
	setInterval(() => {
		this.list$ = this.buildRequestObservable(),
	}, 3600 * 1000);
}
...

````

### auto-complete de recherche

````javascript
this.countryList$ = this.countryControl.valueChanges
.pipe(
	map(name => name.trim()),
	filter(name => length >= 2), // filtrer uniquement si au moins 2 caractères
	debounceTime(200), //attente 200ms après dernière valeur, avant envoi requête
	distinctUntilChanged(), // filtrer uniquement si valeur différente de la valeur précédente
	switchMap(name => this.countryService.search(name))
	);


search(name: string): Observable<string[]> {
	name = name && name.trim();
	if (name) {
		const url = 'https://.......';
		return this.httpClient.get<Country[]>(url + name)
		.pipe(
		map(countries => countries.map(country => country.translations.fr)),
		catchError(error => of([]))
		);
	}
	return of([]);
}
````

## Chaîner les observables
[Back to top](#observables)

Dans cet exemple on souhaite chaîner une promise convertie en observable, avec un second observable. On souhaite néanmoins que le second observable ne soit pas joué avant la fin du premier.

Cas d'utilisation : La fonction *requestApi* retourne un observable qui est le résultat d'une requête http. Cependant, dans cet exemple, toutes les requêtes http nécessitent un Bearer token pour sécuriser l'api. Donc avant d'envoyer la requête http, il faut récupérer un *accessToken* qui est stocké en local storage.
Hors, la récupération de données en local storage est une tâche asynchrone réalisée par une Promise.

La problématique : Attendre la fin de la promise avant d'envoyer la requête http.

La solution : Convertir la promise en observable et la chainer avec l'observable http en utilisant l'opérateur **switchMap** RxJS

````typescript
// Manage HTTP Queries
  requestApi({action, method = 'GET', datas = {}}:
  { action: string, method?: string, datas?: any}): Observable<any> {
    const methodWanted = method.toLowerCase();
    const urlToUse = this.url + action;
    let req: Observable<any>;// = null;

    // switchMap
    return from(this.auth.getValidToken()).pipe(switchMap((res: TokenResponse) => {
      
      const httpOptions = {
        headers: new HttpHeaders({'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + res.accessToken})
      };      
  
      switch (methodWanted) {
        case 'post' :
          req = this.http.post(urlToUse, datas, httpOptions);
          break;
        case 'put' :
          req = this.http.put(urlToUse, datas, httpOptions);
          break;
        case 'delete' :
          req = this.http.delete(urlToUse, httpOptions);
          break;
        case 'patch' :
          req = this.http.patch(urlToUse, datas, httpOptions);
          break;
        default:
          req = this.http.get(urlToUse + '?' + datas, httpOptions);
          break;
      }
      return req;
    }));
  }
````

*data.service.ts*

````javascript
fetchNewPublications({filterUserQueryIds = [], start = 0, size = apiConfig.defaultLength, sortBy = apiConfig.SORT.idte, disableStats = true}:
  {filterUserQueryIds?: number[], start?: number, size?: number, sortBy?: string, disableStats?: boolean}): Observable<ServiceResult> {

    let parameters = `SortOrder=${sortBy}&StartIndex=${start}&Length=${size}`;
    parameters += filterUserQueryIds.length > 0 ? `&filterUserQueryIds=${filterUserQueryIds}` : '';

    return this.apiHelper.requestApi({
      action: apiConfig.services.scientificstudy.getNewScientificStudies,
      method: 'get', datas: parameters});
  }
````

*controller.ts*

````javascript
ngOnInit(): void {
	this.dataService.fetchNewPublications()
	.subscribe((res) => {
		// some stuff here
	});
}
````

## Unsubscribe to all
[Back to top](#observables)

Astuce pour économiser du code lors du désabonnement aux observable. La méthode suivante permet de faciliter l'action de désabonnement à plusieurs observable en une seule ligne. Cette méthode s'appuie sur le package **subsink**

[subsink documentation](https://www.npmjs.com/package/subsink)       

````
npm install subsink
````

*utilisation*
````javascript
export class SomeComponent implements OnDestroy {
  private subs = new SubSink();

  ...

  this.subs.add(observable$.subscribe(...)); 

  this.subs.add(observable$.subscribe(...)); 

  // Ajout de plusieurs souscription en même temps
  this.subs.add( 
    observable$.subscribe(...),
    anotherObservable$.subscribe(...)
  ); 

  ...

  // Désabonnement
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
````

## async pipe
[Back to top](#observables)

(https://malcoded.com/posts/angular-async-pipe/)

Le pipe *async* permet de souscrire à des observables à l'intérieur de la vue. Il prend aussi soin de se désabonner des observables automatiquement, il n'est donc plus nécessaire de faire un unsubscribe manuellement.

**ATTENTION** : chaque utilisation de pipe *async* dans la vue créé une souscription (voir cold vs hot)

*service.ts*
````javascript
fetchData(): Observable<string[]> {
    return of(['Data 1', 'Data 2', 'Data 3']);
}
````

*controller.ts*
````typescript
export class AddOrderComponent implements OnInit {
 
  dataset: Observable<string[]>;

  constructor(
   private dataService: DataService) {}

  ngOnInit(): void {
    this.dataset = this.dataService.fetchData();
  }
````

*view.html*
````html
<mat-form-field class="red-select">
	<mat-label>Laboratory</mat-label>
	<mat-select [(ngModel)]="selectedData">
	  <ng-container *ngFor="let d of dataset | async">
	    <mat-option [value]="d"> {{ d }} </mat-option>
	  </ng-container>
	</mat-select>
</mat-form-field>
````

## Exemples code
[Back to top](#observables)

### Mémoriser les données d'un observable

*service.ts*
````typescript
allTasks$: Observable<Tache[]>;
tasks: Tache[] = []

fetchTasks(): Observable<Tache[]> {
	this.allTasks$ = this.http.getFromPlanningApi(`${this.endpoint}`)
	.pipe(
		map((jsonArray: Object[]) =>
		  jsonArray.map((jsonItem) =>
			createApiMessageInstance(Tache).loadFromJson(jsonItem)
		  )
		),
		shareReplay({
		  bufferSize: 1,
		  refCount: true,
		})
	);
	
	this.allTasks$.subscribe((data) => {
        	this.tasks = data;
	});
	return this.allTasks$;
}
````

### Rafrtaichir les données d'un observable
*component.html*
````html
<input mat-input type="text" [(ngModel)]="cityName">
<button mat-raised-button (click)="addCity()" [disabled]="cityName == ''">add city</button>
<mat-list>
	<mat-list-item *ngFor="let c of cities$ | async">
    	{{ c.name }} <button (click)="deleteCity(c)">delete</button>
	</mat-list-item>
</mat-list>    
````

*component.ts*
````typescript
cityName = '';
cities$: Observable<{ name: string }[]>;
citiesRefresh$: BehaviorSubject<boolean> = new BehaviorSubject(true);

ngOnInit() {
	this.cities$ = this.citiesRefresh$.pipe(switchMap(_ => this.data.fetchCities()))
}

addCity() {
    this.data.addCity(this.cityName);
    this.cityName = '';
    this.citiesRefresh$.next(true);
}
deleteCity(city) {
    this.data.deleteCity(city);
    this.citiesRefresh$.next(true);
}
````

*service.ts*
````typescript
cities = [{ name: 'Atlanta' }, { name: 'Portland' }, { name: 'San Fransisco' }];

fetchCities(): Observable<any[]> {
	return of(this.cities);
}

addCity(cityName: string) {
	this.cities = [...this.cities, { name: cityName }];
}

deleteCity(city) {
	this.cities = this.cities.filter(c => c.name !== city.name);
}
````


### BehaviourSubject partagé entre plusieurs composants
[Back to top](#observables)

*service.ts*

````typescript
export class DataService {

	public users$: BehaviorSubject<any[]> = new BehaviorSubject([]);
	
	constructor(private http: HttpClient) { }
	
	fetchUsers(): Observable<any> {
		return this.http.get(this.url + 'users')
		.pipe(tap(data => {			
			this.users = data as any[];
			this.users$.next(this.users);
		}))
	}
	
	addItem(item) {
		// TODO appel http pour ajout en base et dans le .pipe mettre le code ci-dessous
		let items = this.users$.getValue(); // récupère les dernières valeurs connues
		items.push(item);
		this.users$.next(items);	// mettre à jour les valeurs
	}
	
	deleteItem(item) {
		// TODO appel http pour ajout en base et dans le .pipe mettre le code ci-dessous
		let items = this.users$.getValue(); // récupère les dernières valeurs connues
		items = items.filter(i => i !== item);
		this.users$.next(items);	// mettre à jour les valeurs
	}
}
````

*composant1.html*
````html
<button mat-raised-button (click)="addUser()">update data</button>
<mat-list>
	<mat-list-item *ngFor="let u of users2$ | async">
    	{{ u.id }} {{ u.username }}
	<button mat-raised-button (click)="deleteUser(u)">delete</button>
	</mat-list-item>
</mat-list>     
````

*composant1.ts*

````typescript
users2$: Observable<any[]>;

constructor(private data: DataService) { }

ngOnInit(): void {
    this.data.fetchUsers()	// appelé uniquement par le premier composant qui va devoir accéder aux data
      .subscribe(() => {
        this.users2$ = this.data.users$;
    
	})
}

addUser(): void {
    this.data.addItem({ 
	id: 999, name: 'unknown', 
	username: 'new user', 
	phone: '999999999', 
	email: 'new.user@gmail.com' });
}

deleteUser(user) {
    this.data.deleteItem(user);
}
````

*composant2.html*
````html
<mat-list>
    <mat-list-item *ngFor="let u of users$ | async">
        {{ u.id }} {{ u.username }}
    </mat-list-item>
</mat-list>  
````

*composant2.ts*

````typescript
export class ListComponent implements OnInit {
  users$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.users$ = this.data.users$;
  }
}
````

### Chargement et ajout de données avec BehaviorSubject
[Back to top](#observables)

*component.html*
````html
<mat-list>
        <mat-list-item *ngFor="let u of users">
            {{ u.id }} {{ u.username }}
        </mat-list-item>
</mat-list>    
````

*component.ts*
````typescript
users = [];

ngOnInit() {
 this.data.users$.subscribe(res => this.users = res);
 
 this.data.fetchUser()
 .subscribe(res => {
	this.data.users$.next(res);
 });
}

addUser(): void {
    this.data.addItem({ 
	id: 999,
	name: 'unknown',
	username: 'new user',
	phone: '999999999',
	email: 'new.user@gmail.com' });
}
````

*service.ts*
````typescript
public users$: BehaviorSubject<any[]> = new BehaviorSubject([]);

 fetchUser(): Observable<any> {
    return this.http.get(this.url + 'users');
  }
  
  addItem(item) {
    let items = this.users$.getValue(); // récupère les dernières valeurs connues
    items.push(item);
    this.users$.next(items);	// mettre à jour les valeurs
  }
````

### Gestion classique d'un observable
[Back to top](#observables)

*component.ts*
````typescript
users: User[] = [];

constructor(userService: UserService) {}

fetchData() {
	this.userService.fetchUsers()
	.subscribe(res => {
		this.users = res;
	});
}

addUser(newuser: User): void {
	this.userService.addUser(newuser)
	.subscribe(user => {
		this.users.push(user);
	});
}

deleteUser(user: User): void {
	this.userService.deleteUser(user).subscribe();
	this.users = this.users.filter(u => u !== users);
}
````

*service.ts*
````typescript
fetchUsers(): Observable<User[]> {
	return this.http.get('url');
}

addUser(user: User): Observable<User> {
	return this.http.post<User>('url', user, this.httpOptions)
	.pipe(
		tap((newUser: User) => this.log(`added ${user.id}`)),
		catchError(this.handleError('addUser')
	);
}

deleteuser(user: User): Observable<User> {
  const url = `${this.url}/${user.id}`;

  return this.http.delete<User>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted user id=${user.id}`)),
    catchError(this.handleError<User>('deleteUser'))
  );
}
````

### Mise à jour des données d'un composant 1 suite à un événement déclenché par un composant 2
[Back to top](#observables)

Cas d'usage : 
un composant parent contient 2 composants enfants :
- le composant child1 permet de modifier une variable
- le composant child2 doit réagir au changement de cette variable et rafraîchir ses données

Pour parevenir à faire cela, un service déclare un Subject qui va servir de trigger à la mise à jour de la variable et une fonction permettant de mettre à jour la valeur de ce dernier

Le composant child1 va donc simplement appeler la fonction qui met à jour le Subject en lui passant la nouvelle valeur
Le composant child2 va souscrire à la fonction qui permet de charger les données (via appel http par exemple) et souscrire au Subject afin de pouvoir déclencher un rafraichissement de ses données lorsque le composant child1 déclenchera un .next() du subject

*service.ts*

````typescript
export class EventService {

  $subj: Subject<string> = new Subject();	// permet d'écoûter le trigger de mise à jour de la variable déclencheur

  constructor() { }
  
  fetchData(suffix = ''): Observable<string[]> {
    let temp = [];
    for (let i = 0; i < 5; i++) {
      temp.push('my data ' + suffix);
    }
    return of(temp);
  }

  // trigger de mise à jour de la variable
  updateSubject(suffix): void {
    this.$subj.next(suffix);
  }
}
````

*parent.html*
````html
<app-event-child1></app-event-child1>
<app-event-child2></app-event-child2>
````

*child1.html* déclenche un événement
````html
<div class="child1">
    <h4>Composant child1</h4>
    <input [(ngModel)]="suffix">
    <button mat-raised-button (click)="child1Event()">Event</button>
</div>
````

*child1.ts*
````typescript
export class EventChild1Component {
  suffix = '';
  constructor(private eventService: EventService) { }

  child1Event(): void {
    this.eventService.updateSubject(this.suffix);	// va déclencher un .next() du subject
  }
}
````

*child2.html*
````html
<div class="child2">
    <h4>Composant child 2</h4>
    <mat-card *ngFor="let c of data">
        <mat-card-content><h4>{{ c }}</h4></mat-card-content>
    </mat-card>
</div>
````

*child2.ts*
````typescript
export class EventChild2Component implements OnInit, OnDestroy {

  data = [];
  subscriber$: Subscription;	// pour le réaffecter à chaque refresh des data et éviter la création d'un nouveau subscriber à chaque update

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fillDataset();
    
    // souscription au Subject pour écoûter si un événement est déclenché par child1
    this.eventService.$subj
      .subscribe(res => {
      	// événement détecté, on met à jour les données de child2
        this.fillDataset(res);
      });
  }

  fillDataset(suffix = '') {
    this.subscriber$ = this.eventService.fetchData(suffix)
      .subscribe(res => {
        this.data = res;
      })
  }
  ngOnDestroy(): void { this.subscriber$.unsubscribe(); }
}
````

## tester la taille du contenu
[Back to top](#observables)

Tester le *length* d'un observable pour pouvoir agir sur la vue

````html
<mat-list *ngIf="(items$ | async)?.length > 0; else nodata">
    ...
</mat-list>

 <ng-template #nodata>
   <h1>Aucune donnée trouvée</h1>
 </ng-template>
````


[Back to top](#observables)
