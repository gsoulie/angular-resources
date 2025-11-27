[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Observables

* [Liens](#liens)         
* [Notions Subject et BehaviorSubject](#notions-subject-et-behaviorsubject)     
* [Bonnes pratiques](#bonnes-pratiques)      
* [Cold et Hot](#cold-et-hot)      
* [Observables imbriqués](#observables-imbriqués)     
* [Exemples cold et hot](#exemples-cold-et-hot)     
* [Chaîner les observables](#chaîner-les-observables)     
* [Unsubscribe to all / takeUntilDestroy / takeUntil](#unsubscribe-to-all)
* [Unsubscribe auto avec signal](#unsubscribe-auto-avec-signal)           
* [async pipe](#async-pipe)    
* [Exemples code](#exemples-code)      
* [Tester la taille du contenu](#tester-la-taille-du-contenu)     
* [Gestion des erreurs](#gestion-des-erreurs)
* [Catch error](#catch-error)      
* [Filtrer un observable dans la vue via un pipe](#filtrer-un-observable-dans-la-vue-via-un-pipe)      
* [Gérer un indicateur de loading](#gérer-un-indicateur-de-loading)      


## Liens
[Les observables c'est quoi ?](https://www.learn-angular.fr/comprendre-rxjs/)      
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

<details>
	<summary>Ne pas sur-uriliser RxJS lorsque cela n'est pas nécessaire</summary>

**RxJS** est un **outil très puissant** pour gérer les observables. Cependant on peut rapidement se retrouver à **complexifier son code** alors que cela n'est pas nécessaire

**Voici un exemple d'utilisation complexe, dans lequel on réalise 3 appels http imbriqués** :

````typescript
complexSaveOperation(newLessons: Lesson[], newCourse: Course, newUser: User) {
    this.isLoading = true;

    // Enregistrement des lessons
    this.http.post<Lesson[]>("/api/lessons", { lessons: newLessons })
      .pipe(
        // Récupération de la réponse du premier appel, et enregistrement des cours
        concatMap(lessons => this.http.post<Course[]>("/api/courses", { course: newCourse, lessons })
          .pipe(
            // On retourne les résultats du premier et second appels http
            map(([course, lessons]) => [course, lessons])
          )
        ),
      // Récupération des résultats des 2 premiers appels, et enregistrement de l'utilisateur
      concatMap(([course, lessons]) => this.http.post<User[]>("/api/users", { user: newUser, course, lessons })),
      catchError(err => {
        console.error(err);
        return throwError(() => new Error("error saving data"))
      }),
        finalize(() => this.isLoading = false)
    ),
  }
````

L'exemple proposé est parfaitement opérationnel, mais il demeure compliqué à lire, comprendre et à maintenir. Il est aussi très facile de se tromper dans son écriture et de mal gérer les erreurs et la fusion des réponses.

**Voici une proposition de simplification du code précédent** :

````typescript
async simpleSaveOperation(newLessons: Lesson[], newCourse: Course, newUser: User) {
    try {
      this.isLoading = true;

      const lesson = await firstValueFrom(this.http.post<Lesson[]>("/api/lessons", {lessons: newLessons}));
      
      const course = await firstValueFrom(this.http.post<Course[]>("/api/courses", { course: newCourse, lessons }));
      
      const user = await firstValueFrom(this.http.post<User[]>("/api/users", { user: newUser, course, lessons }));

    } catch (err) {
      // return and/or show error here
    } finally {
      this.isLoading = false;
    }
  }
````

Dans cette réécriture, on créé une fonction parente de type **async** et l'on transforme les appels http en promise via ````firstValueFrom()```` (attention l'utilisation de ````.toPromise()```` est désormais déprécié). 

De cette manière **on supprime les appels http imbriqués**, ce qui rend le code **beaucoup plus clair, simple et facile à maintenir**.

> **Note** : Dans la pluspart des cas classiques d'appels HTTP, l'utilisation de RxJS n'est pas justifiée, un fonctionnement à base de promise (async/await) comme présenté ci-dessous est très largement suffisant est optimal.
 
</details>

https://adrien.pessu.net/post/angular_best_practices/       
https://nicolasfazio.ch/programmation/angular/angular-creer-service-reactif-observables        
https://makina-corpus.com/front-end/mise-en-pratique-rxjs-angular     

**Il est préférable d'utiliser la syntaxe basée sur l'utilisation des stream plutôt que la syntaxe de "souscription". En effet on a ainsi un code
plus léger, plus clair, plus maintenable et qui limite les risques de fuites mémoire.**

Peut importe la méthode, le principe reste toujours le même, s'abonner à un stream (observable, Subject, BehaviourSubject) et mettre à jour ce stream par la suite via **next()**

Eviter la création d'une subscription avec les appels API qui ne retournent qu'un seul résultat (non pas un flux comme pour les sockets) 

````this.apiService.getUsers().pipe(take(1)).subscribe(result => this.users = result); // évite de unsubscribe manuellement````

**Eviter** autant que possible de récupérer les données avec un observable avec subscribe directement dans un composant.
Il est préférable de récupérer les données dans un service dédié ex :

**A éviter** bien que fonctionnel

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

Préférer les solutions suivantes proposées :

### Solutions "propres" à privilégier
[Back to top](#observables)

#### Solution 1 : Observable retournant une seule valeur (pas un flux type socket) avec Promise

**Dans ce cas, il n'est pas nécessaire de faire un subscribe depuis le component**

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
        // on assigne la reponse à la Behavior Subject
        this._users.next(response.data);
      })
      .catch(err => console.log(err))
  }
  
  async update(userData) {
    const updated = await this._http.put('https://reqres.in/api/users/' + userData.id, userData).toPromise().catch(err => err);
    this._users.next([
      // non filtre les donnée privée et assign une nouvelle valeur
      ...this._users.value.filter(u => u.id !== updated.id),
      updated
    ]);
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

**Avec la version observable, une souscription est nécessaire côté component**

````typescript
  async load() {
    await this._http.get('https://reqres.in/api/users')
      .pipe(
      	first(),
	tap((res) => this._users.next(response.data);)
      )
  }


ngOnInit() {
    this._service.load().subscribe();
    this.users$ = this._service.users$;
  }
````

#### Solution 2 : utiliser directement le stream
[Back to top](#observables)

Voici un exemple simple qui récupère les données depuis une api via http, ajoute, modifie et supprime des éléments du stream.

**A noter :** on affecte le stream dans le **constructor** pour éviter d'avoir une erreur "undefined" si un élément venait à chercher à lire l'objet avant son
affectation étant donné que le stream est asynchrone.

*Vue.html*

````html
<ng-container *ngIf="posts$ | async as posts; else loading">
	<h3>nb posts = {{ posts.length }}</h3>
	<button mat-raised-button (click)="addPost()">Add post</button>
	
	<mat-list>
		<mat-list-item *ngFor="let p of posts">
			{{ p.id }} - {{ p.title }} <button mat-button (click)="deletePost(p)">X</button> <button mat-button (click)="updatePost(p)">add suffix</button>
		</mat-list-item>
	</mat-list>
	<mat-spinner #loading></mat-spinner>
</ng-container>
````

*Controller.ts*

````typescript
export class BehaviourWithRefresh2Component{

  posts$: Observable<IPost[]>;

  constructor(private behaviourService: BehaviourService) {
    this.fetchData();
  }
  
  fetchData() { this.posts$ = this.behaviourService.fetchPosts(); }

  addPost() {
    this.behaviourService.addPost({
      id: 999,
      title: 'Nouveau post',
      userId: 1,
      body: 'corps du nouveau message'
    });
  }

  deletePost(p: IPost) { this.behaviourService.deletePost(p); }

  updatePost(p: IPost) {
	// Ajout d'un PREFIX au titre
    p.title = '[PREFIX]' + p.title;
    this.behaviourService.updatePost(p);
  }
}

````

*Service.ts*

````typescript
export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export class BehaviourService {

  private posts$: BehaviorSubject<IPost[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  fetchPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(
		shareReplay(),	// transformer de Cold vers Hot pour ne pas faire plusieurs appels
        tap(res => this.posts$.next(res))
      );
  }

  addPost(post: IPost) {
    let current = this.posts$.getValue();
    current.push(post);
    this.posts$.next(current);
  }

  deletePost(post: IPost) {
    let current = this.posts$.getValue();
    const index = current.findIndex(p => p.id === post.id);
    if (index >= 0) {
      current.splice(index, 1);
      this.posts$.next(current);
    }
  }

  updatePost(post: IPost) {
    let current = this.posts$.getValue();
    const index = current.findIndex(p => p.id === post.id);
    if (index >= 0) {
      current[index] = post;
      this.posts$.next(current);
    }
  }
}
````

**A T T E N T I O N - PIPE ASYNC** Si la vue contient plusieurs pipe *async* elle va créer une souscription pour chacun !!

````html
<li>{{ (user$ | async).name }}</li>
<li>{{ (user$ | async).lastname }}</li>
<li>{{ (user$ | async).age }}</li>
````

==> va créer 3 souscription et donc jouer autant de fois la requêtes qui retourne les informations.

**Solution** regrouper le contenu sous une seule souscription 
````html
<!-- With alias 'as' -->
<ng-container *ngIf="user$ | async as user">
	<li>{{ user.name }}</li>
	<li>{{ user.lastname }}</li>
	<li>{{ user.age }}</li>
</ng-container>

<!-- using stream directly -->
<div *ngIf="myself$">
  <p>Name: <span>{{ (myself$ | async).name }}</span></p>
  <p>Place: <span>{{ (myself$ | async).place }}</span></p>
</div>
````

#### Solution 3 : Méthode avec BehaviourSubject dédié à l'état **refresh**
[Back to top](#observables)

````html
<mat-list-item>
<input mat-input type="text" [(ngModel)]="cityName">
<button mat-raised-button (click)="addCity()" [disabled]="cityName == ''">add city</button>
</mat-list-item>
<mat-list>
  <mat-list-item *ngFor="let c of cities$ | async">
	  {{ c.name }} 
	  <button mat-icon-button (click)="deleteCity(c)">
		<mat-icon>delete</mat-icon>
	  </button>
  </mat-list-item>
</mat-list>   
````

*Controller.ts*

````typescript
export class BehaviourWithRefreshComponent implements OnInit {

  cityName = '';
  cities$: Observable<{ name: string }[]>;
  citiesRefresh$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private data: DataService) { }

  ngOnInit(): void {
	// Déclenchement du fetch à chaque modification de l'état du behaviourSubject
    this.cities$ = this.citiesRefresh$
      .pipe(switchMap(_ => this.data.fetchCities()));
  }

  addCity() {
    this.data.addCity(this.cityName);
    this.cityName = '';
    this.citiesRefresh$.next(true);	// déclencher le refresh des data
  }

  deleteCity(city) {
    this.data.deleteCity(city);
    this.citiesRefresh$.next(true);	// déclencher le refresh des data
  }

}
````

*Service.ts*

````typescript
  cities = [{ name: 'Atlanta' }, { name: 'Portland' }, { name: 'San Fransisco' }];

  constructor() { }

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

### Souscription
[Back to top](#observables)

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
[Back to top](#observables)

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


### Tips

* S'abonner et se désabonner dans la foulée après avoir reçu une réponse

````typescript
this.dataService
.pipe(take(1))	// se désabonne automatiquement après réception de la première réponse
.subscribe(res => this.data = res)
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

> Voir aussi : https://dev.to/railsstudent/create-type-ahead-search-using-rxjs-and-angular-standalone-components-4m4a       

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

> **Toute souscription à un observable DOIT OBLIGATOIREMENT avoir un désabonnement associé**

Pour rappel, un observable représente un flux de données. Ce dernier ne s'exécute pas tant qu'on ne s'y abonne pas (````.subscribe````).
En revanche, ce dernier **reste ouvert tant qu'on ne s'en désabonnement pas explicitement**, ce qui peut entrainer des **fuites mémoires**

### Bonnes pratiques
#### Méthode avec pipe takeUntilDestroyed recommandée depuis Angular 16

**Depuis Angular 16** un nouveau pipe **takeUntilDestroyed** fait son apparition et facilite l'écriture du désabonnement des observables :

````typescript
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent implements OnInit {
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  myData;

  ngOnInit() {
    this.dataService.fetchData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(response => this.myData = response);
  }
}
````

#### Méthode DestroyRef (depuis Angular 16)

Une autre façon de gérer les désabonnements de manière plus moderne est l'utilisation de *DestroyRef*. Cette solution évite d'implémenter l'interface *OnDestroy*

````typescript
import { Injectable , DestroyRef } de  '@angular/core' ; 
class ExampleComponent {
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      // do something when the component is destroyed
    })
  }
}
````

*Exemple type*

````typescript
export class UsersComponent implements OnInit {

  userService = inject(UserService);
  userSubscription: Subscription | undefined;
  users: User[] = [];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.userSubscription) {
        this.userSubscription?.unsubscribe();
      }
    })
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.fetchUsers()
    .subscribe((res) => this.users = res);
  }
}
````


#### Méthode traditionnelle avec OnDestroy

La méthode la plus courante pour se désabonner des observables est l'utilisation du pipe ````takeUntil```` dont voici une illustration :

````typescript
export class Component implements OnInit, OnDestroy {
  data;
  destroyed = new Subject()

  ngOnInit(): void {
    this.service.getData()
      .pipe(
        takeUntil(this.destroyed),
      )
      .subscribe(
        response => this.data = response
      )
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
````

## Unsubscribe auto avec signal

Il est possible de faire en sorte qu'une souscription se désabonne automatiquement, en transformant l'observable en signal de la manière suivante : 

````typescript
private readonly dataService = inject(DataService);
data = toSignal(this.dataService.getData());

<span>{{ data() }}</span>
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

### Accéder à une propriété d'un observable

````html
<h2>{{ (myObs$ | async)?.firstname }}</h2>
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

## Gestion des erreurs
[Back to top](#observables)

Solution pour gérer proprement les erreurs levées par les observables utilisant un pipe async.

*home.component.ts*

````typescript
user$ = this.userService.getUserWithError();	// observable qui déclenche une erreur

userError$ = this.user$.pipe(
	ignoreElements(), // ignorer les autres éléments du stream qui ne sont pas en erreur
	catchError((err) => of(err))	// émet un nouvel observable en cas d'erreur
);
````

En cas de présence d'une donnée en erreur dans le stream, on affiche un message d'erreur déclenché par *userError$*. Cependant, on remarque que *user$* ne sera jamais *true*,
de fait, en cas d'erreur le skeleton-text sera toujours affiché. Ce n'est pas ce que l'on souhaite, en cas d'erreur on ne veut pas voir le skeleton-text

*home.component.html*

````html
<ion-card *ngIf="user$ | async as user; else loading">
	<ion-card-content>{{ user }}</ion-card-content>
</ion-card>
<ion-note *ngIf="userError$ | async as error">{{ error }}</ion-note>

<ng-template #loading>
	<ion-card>
		<ion-card-content>
			<ion-skeleton-text animated></ion-skeleton-text>
		</ion-card-content>
	</ion-card>
</ng-template>
````

### Solution

````html
<!-- IMPORTANT : le fait de déclarer un objet avec "as" permet d'éviter une multiple souscription pour chaque pipe -->
<ng-container *ngIf="{user: user$ | async, userError: userError$ | async} as vm">
	<ion-card *ngIf="!vm.userError && vm.user as user; else loading">
		<ion-card-content>{{ user }}</ion-card-content>
	</ion-card>
	<ion-note *ngIf="vm.userError as error">{{ error }}</ion-note>

	<ng-template #loading>
		<ion-card *ngIf="!vm.userError">
			<ion-card-content>
				<ion-skeleton-text animated></ion-skeleton-text>
			</ion-card-content>
		</ion-card>
	</ng-template>
</ng-container>
````
### Solution avec pipe

Voir : https://github.com/gsoulie/angular-resources/blob/master/ng-concept-observable.md#g%C3%A9rer-un-indicateur-de-loading       

### Solution avec souscription depuis composant

*Home.component.ts*
````typescript
error = null;

fetchPosts() {
	this.postService.fetchPosts()
	.subscribe(data => {
	},
	error => {
		this.error = error.message;
	});
}
````

### Solution avec subject et souscription dans le service

*PostService.service.ts*
````typescript
error$ = new Subject<string>();

createPost(post: Post) {
	this.http.post<Post>('https://jsonplaceholder.typicode.com/posts', post)
    .subscribe(
		data => { ... },
		error => this.error$.next(error.message)
    );
}
````

Il suffit ensuite de souscrire au *Subject* **error$** dans le composant

### Solution avec opérateur catchError

*PostService.service.ts*
````typescript
import { throwError } from 'rxjs';

fetchPosts() {
	this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')
    .pipe(
		catchError(error => {
			// log error or send it to server...
			return throwError(error);
		})
    );
}
````
[Back to top](#observables)

## Filtrer un observable dans la vue via un pipe

**Cas d'usage** depuis une source unique (observable) on souhaite dispatcher dans la vue les données dans des zones différentes selon un critère particulier. Afin d'éviter de créer plusieurs observables basés sur la source unique en utilisant les opétateurs classique pipe, map, filter, on peut utiliser un *pipeTransform* directement dans la vue. 

### Limitation

**TRES IMPORTANT : LIMITATION** : Attention, le caractère "pure" des pipes ne permet pas de rafraichir une liste de données dans le cas d'un ajout/suppression/modification d'un élément. 
Une modification pure est soit une modification d'une valeur d'entrée primitive (telle que *string, number, boolean ou symbole*), soit une **référence d'objet modifiée** (telle que date, tableau, fonction ou objet). 
On insiste ici sur le terme de **référence modifiée**, en effet, le pipe reçoit une référence à un tableau et par conséquent l'ajout/modification/suppression ne déclenche pas de modification de la vue puisque la référence n'est pas modifiée. 

voir la documentation : https://angular.io/guide/pipes#detecting-pure-changes-to-primitives-and-object-references      

Pour passer outre cette contrainte, il faut donc recréer une nouvelle référence à l'objet tableau lors d'un ajout/modification/suppression.

*pipe.ts*

````typescript
transform(inventory: MsEffetPersonnelDto[], ...args: unknown[]): MsEffetPersonnelDto[] {
    if (args.length <= 0) { return inventory;}
    return inventory.filter(i => i.categorieId === args[0]);
}
````
*page.component.html*

````html
<ion-item *ngFor="let item of inventory | inventoryCategoryContent:'type3'">
            <ion-label>{{ item.name }}</ion-label>
</ion-item>
````

*page.controller.ts*

````typescript
inventory: inventoryType[] = [];
ngOnInit() {
	this.inventory = this.myService.fetchInventory();
}
addItem() {
    const newInv: inventoryType[] = Object.assign([], this.inventory);	// création d'une nouvelle référence
    newInv.push(/* some stuff here */);
    this.inventory = newInv;	// affectation de la nouvelle référence
}
````

### Filtrage observable

**Important** cette méthode permet de garder l'aspect rafraichissement des données lorsque le critère change. Attention cependant au nombre de souscription engendrées par les pipes async

*vue.html*

````html
<h1>Filtrer les données d'un observable depuis un pipe dans la vue</h1>

<mat-form-field class="example-form-field" appearance="fill">
    <mat-label>Type(1, 2 ou 3)</mat-label>
    <input matInput type="text" [(ngModel)]="newType">
</mat-form-field>
<button mat-raised-button (click)="update()">update</button>

<div class="row" [style.backgroundColor]="'lightgreen'">
    <div class="cell" *ngFor="let c of data$ | filtering:'1' | async">{{ c.label }}</div>
</div>
<div class="row" [style.backgroundColor]="'lightblue'">
    <div class="cell" *ngFor="let c of data$ | filtering:'2' | async">{{ c.label }}</div>
</div>
<div class="row" [style.backgroundColor]="'coral'">
    <div class="cell" *ngFor="let c of data$ | filtering:'3' | async">{{ c.label }}</div>
</div>

<!-- !!
ATTENTION : LA SYNTAXE CI-DESSOUS NE FONCTIONNE PAS, ON PERD LA SOUSCRIPTION ET LES DONNEES NE SE RAFRAICHISSENT PAS DANS LA VUE
-->
<!--<div *ngIf="data$ | async as data">
	<div class="row" [style.backgroundColor]="'lightgreen'">
	    <div class="cell" *ngFor="let c of data | filtering:'1'">{{ c.label }}</div>
	</div>
	<div class="row" [style.backgroundColor]="'lightblue'">
	    <div class="cell" *ngFor="let c of data | filtering:'2'">{{ c.label }}</div>
	</div>
	<div class="row" [style.backgroundColor]="'coral'">
	    <div class="cell" *ngFor="let c of data | filtering:'3'">{{ c.label }}</div>
	</div>
</div>-->
````

*vue.component.ts*

````typescript
export class ObsPipeComponent implements OnInit {

  data$: Observable<any[]>;
  newType = '1';
  
  constructor(private dataService: ObsPipeDataService) { }

  ngOnInit(): void {
  // Attention il est obligatoire de souscrire dans le composant.
  // la souscription dans la vue ne fonctionne pas avec le pipe
    this.dataService.fetchData()
      .subscribe(res => {
        this.data$ = this.dataService.dataObs$;
      });
  }

  update() { this.dataService.updateItem(1, this.newType); }
}
````

*service.ts*

````typescript
export interface item {
  label: string;
  type: string;
}

export class ObsPipeDataService {
  dataSubj$ = new BehaviorSubject<item[]>([]);
  dataObs$: Observable<item[]> = this.dataSubj$.asObservable();

  constructor() { }

  fetchData(): Observable<any[]> {
    return of([{ label: 'item de type 1', type: '1' },
    { label: 'item de type 1', type: '1' },
    { label: 'item de type 2', type: '2' },
    { label: 'item de type 3', type: '3' }]
    )
    .pipe(tap(res => this.dataSubj$.next(res)));
  }

  updateItem(index, type) {
    const items = this.dataSubj$.value;
    items[index].type = type;
    this.dataSubj$.next(items);
    console.log(this.dataSubj$.value);
  }
}
````

*filtering.pipe.ts*
````typescript
import { item } from './../../components/obs-pipe/data.service';
import { Observable, isObservable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'filtering'
})
export class FilteringPipe implements PipeTransform {

  transform(data: Observable<item[]>, type): unknown {

    return (isObservable(data) ? 
    data.pipe(
       map(m => m.filter(obj => obj.type == type))
    )
    : data) as Observable<any[]>;
  }
}

````

### exemple complexe

````typescript

// structure du DTO : userDto : { user, userStored }

@Pipe({
  name: 'userFilterByStatus'
})
export class UserFilterByStatusPipe implements PipeTransform {

  transform(users: Observable<UserDto[]>, categ: UserCategory) {

    switch (categ) {
      case Categ.valid :
        return (isObservable(users)
        ? users.pipe(
          map((obj: UserDto[]) => obj.filter(m => {
            if (m.userStored.statutId !== null) {
              return m.userStored.statutId === Categ.valid;
            } else if (m.user.statutId){
              return m.user.statutId === Categ.valid;
            }
          }))
        )
        : users) as Observable<UserDto[]>;

      case Categ.invalid :
        return (isObservable(users)
        ? users.pipe(
          map((obj: UserDto[]) => obj.filter(m => {
            if (m.userStored.statutId !== null) {
              return m.userStored.statutId === Categ.invalid;
            } else if (m.user.statutId){
              return m.user.statutId === Categ.invalid;
            }
          }))
        )
        : users) as Observable<UserDto[]>;
      default:
        return of([]) as Observable<UserDto[]>;
    }
  }
}

````

[Back to top](#observables)

## Gérer un indicateur de loading

1 - créer le pipeTransform suivant

*withLoading.pipe.ts*

````typescript
import { catchError, map, startWith } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';

@Pipe({
  name: 'withLoading'
})
export class WithLoadingPipe implements PipeTransform {

  transform(val: any) {
    return (isObservable(val)
      ? val.pipe(
        map((value: any) => ({ loading: false, value })),
        startWith({ loading: true }),
        catchError(error => of({ loading: false, error }))
      )
      : val) as Observable<any>;
  }
}
````

*users.component.html*

````html
<div *ngIf="users$ | withLoading | async as users">
  <ng-template [ngIf]="users.value">
    <mat-list>
      <div *ngFor="let u of users.value">
        <mat-list-item class="list-item">
          <div mat-line>
            <div class="flex-row space-between">
              <div>{{ u.firstName }} <b>{{ u.lastName }}</b> ({{ u.age }} years)</div>
              <mat-icon mat-list-icon>delete</mat-icon>
            </div>
          </div>

          <div mat-line>
            <div class="flex-row">
              <mat-icon mat-list-icon color="primary">email</mat-icon>
              <mat-label class="text">{{ u.email }}</mat-label>
            </div>
          </div>
        </mat-list-item>
        <mat-divider></mat-divider>
      </div>
    </mat-list>
  </ng-template>
  <ng-template [ngIf]="users.error">Error {{ users.error }}</ng-template>
  <ng-template [ngIf]="users.loading">Loading...</ng-template>
</div>
````

*users.component.ts*

````typescript
users$: Observable<User[]> | undefined;

constructor(private dummyDataService: DummyDataService,
	private spinnerService: SpinnerService) { }

ngOnInit(): void {
	this.users$ = this.dummyDataService.fetchUsers();
}
````

[Back to top](#observables)

## Catch error

````typescript
.subscribe({
    complete: () => { ... }, // completeHandler
    error: (err) => { ... },    // errorHandler 
    next: (res) => { ... },     // nextHandler
    someOtherProperty: 42
});
````
