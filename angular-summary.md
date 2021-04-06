# Angular essentials

* [Observable](#observable)        
* [rxjs](#rxjs)       
* [Directive](#directive)      

## Observable
[Back to top](#angular-essentials)

https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular       
https://guide-angular.wishtack.io/angular/observables/creation-dun-observable
https://www.youtube.com/watch?v=TrDqaABq-UY&ab_channel=DevoxxFR       
[RxJS operators](https://www.learnrxjs.io/learn-rxjs/operators)     
[RxJS Best practices](https://blog.strongbrew.io/rxjs-best-practices-in-angular/)     

on utilise les observables pour représenter l'arrivée de données synchrone ou asynchrone.

on peut recevoir une seule données ex : appel http
ou plusieurs données étalées dans le temps ex : websocket

l'observable a 3 type de notifications :

- next chaque arrivée d'une data
- error va casser l'observable, plus rien ne se passe
- complete est la terminaison, plus rien ne se passe

### opérateurs

**pipe** : opérateur principal qui va permettre le branchement de plusieurs autres opérateurs à la suite les uns des autres et ainsi travailler sur le flux de données
 
ex :
````
import {filter, map} from 'rxjs/operators;

getAlertMsg(): Observable<string> {
	const notif: Observable<Notification> = this.getNotifications();

   return notif.pipe(
	filter(notif => notif.type === 'ALERT'),
	map(notif => notif.code + ' : ' + notif.message)
   );
}
````

**filter**     
**every**      
**map**       
**reduce**      

> Important : les opérateurs appliqués **ne modifient jamais l'observable d'origine**, ils produisent une copie et renvoient un nouvel observable.


Pour pouvoir récupérer les données d'un observable, il faut s'y abonner via subscribe.

La souscription peut prendre 3 paramètres (next, error et complete) soit :
subscribe(value, error, ())
ou un objet de type observer
subscribe({value, error, ()})

> Important : Toujours penser à annuler les souscription !!

### 2 types d'observables 

- **cold (unicast)** = source démarrée pour chaque souscription. 10 souscriptions = 10 démarrage. recommence du début pour chaque utilisateur
ex appel http, redémarre à chaque appel

- **hot (multicasted)** = 1 seule source diffusé à tout le monde (toutes les souscriptions) simultanément. Si on arrive en cours de route on aura pas les données depuis le début.
ex données qui arrivent sur une websocket

> remarque : on peut transformer un cold en hot

### Création 
of(1, 2, 3); est un observable qui fait next(1); next(2); next(3); complete();

Création d'un hot observable
On va utiliser un Subject qui est à la fois un Observer et un hot Observable

````
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

### Transformer un cold (ex : requête http) en hot

#### share() : partager un cold à tout un ensemble de souscripteurs
````
// attention exécution se fait à la première souscription. Si on souscrit et que la réponse est déjà arrivée on aura rien
const hot$ = cold$.pipe(share());
````

#### shareReplay(5) 

> Important notion NR. Voir rubrique exemple plus bas

````
const hot$ = cold$.pipe(shareReplay(1));
// si la réponse été déjà passée, au moment de la souscription on reçoit immédiatement la réponse (il rejoue le dernier résultat à chaque nouvelle souscription)
// remarque, ne rejoue PAS la requête
````

### Observable imbriqués 

#### Aplatir 

|action|opération|opérateur unique|
|-|-|-|
|exécution parallèle|map(), mergeAll()|mergeMap()|
|exécuter à la suite|map(), concatAll()|concatMap()|
|annuler la précédente|map(), switch()|switchMap()|
|annuler la nouvelle|map(), exhaust()|exhaustMap()|

**switchMap** utilisé dans le cas d'une complétion automatique. On veut les résultat de la dernière requête (ce que l'utilisateur a tappé en dernier)
=> A chaque nouvelle frappe on annule la requête précédente

**exhaustMap** : tant que le traitement en cours n'est pas terminé on ne tient pas compte des traitements suivants

### Bonnes pratiques

#### Services asynchrones 

Quand on fait un service qui retourne un observable, **on ne souscrit JAMAIS à l'observable dans le service** pour renvoyer les données directement,
car on ne sait pas quand les données arriveront

#### Erreurs

Remonter les erreurs là où on peut les traiter.

interception : catchError
rééssayer : retry ou retryWhen

ex : 

````
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

### Exemples

#### cold to hot observable
On veut créer une liste de livres qui ne va pas souvent être mise à jour, on utilise une requête http (cold donc)
pour renseigner la liste. Le soucis c'est que pour chaque souscription, on va rejouer la requête.

Si on ne veut pas que cela se produise, on va convertir le cold en hot observable

*1 requête http*
````
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
````
constructor(private httpClient: HttpClient) {
	this.list$ = this.buildRequestObservable();
	setInterval(() => {
		this.list$ = this.buildRequestObservable(),
	}, 3600 * 1000);
}
...

````

#### auto-complete de recherche

````
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

### Chaining observables

Dans cet exemple on souhaite chaîner une promise convertie en observable, avec un second observable. On souhaite néanmoins que le second observable ne soit pas joué avant la fin du premier.

Cas d'utilisation : La fonction *requestApi* retourne un observable qui est le résultat d'une requête http. Cependant, dans cet exemple, toutes les requêtes http nécessitent un Bearer token pour sécuriser l'api. Donc avant d'envoyer la requête http, il faut récupérer un *accessToken* qui est stocké en local storage.
Hors, la récupération de données en local storage est une tâche asynchrone réalisée par une Promise.

La problématique : Attendre la fin de la promise avant d'envoyer la requête http.

La solution : Convertir la promise en observable et la chainer avec l'observable http en utilisant l'opérateur **switchMap** RxJS

````
// Manage HTTP Quesries
  requestApi({action, method = 'GET', datas = {}}:
  { action: string, method?: string, datas?: any}): Observable<any> {
    const methodWanted = method.toLowerCase();
    const urlToUse = this.url + action;
    let req: Observable<any>;// = null;

    return from(this.auth.getValidToken()).pipe(switchMap((res: TokenResponse) => {
      console.debug(res.accessToken);
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

````
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

````
ngOnInit(): void {
	this.dataService.fetchNewPublications()
	.subscribe((res) => {
		// some stuff here
	});
}
````

## rxjs
[Back to top](#angular-essentials)      

https://rxjs-dev.firebaseapp.com/guide/subject
https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular

### opérateurs

|operator|description|
|-|-|
|pipe|permet le chaînage de plusieurs opérateurs|
|map|L'opérateur map permet de créer un nouvel Observable à partir de l'Observable d'origine en transformant simplement chacune de ses valeurs.|
|tap|obsolète|


[Understanding RxJS operators](https://www.digitalocean.com/community/tutorials/rxjs-operators-for-dummies-forkjoin-zip-combinelatest-withlatestfrom)    

*Starting code sample*
````
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

````
zip(color$, logo$)
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
	
// color$ est un observable (un Subject) qui retourne une couleur de type "color"
// logo$ est un observable qui retourne un logo de type "logo"	
````	

### combineLatest

combineLatest : les observables ne s'attendent pas après leur première exécution. Au premier appel, couleur ET logo s'attendent et exécutent le log. une fois fait 
la première fois, à chaque fois que la couleur OU le logo changera, le log sera déclenché même si un seul des 2 est modifié.

````
combineLatest(color$, logo$)
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
````

### withLatestFrom

withLatestFrom : de type master - slave. Au début, le master doit rencontrer l'esclave. Après cela, le mater prendra les devants, donnant le commandement, 
l'action est déclenchée à chaque fois uniquement lorsque le maître renvoie une nouvelle valeur

````
color$.pipe(withLatestFrom(logo$))
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
````

Au début (une seule fois), la couleur (master) recherchera le logo (esclave). Une fois que le logo (esclave) a répondu, la couleur (master) prendra la tête.
Le journal sera déclenché chaque fois que la valeur de couleur (principale) suivante est modifiée. Les modifications de la valeur du logo (esclave) ne déclenchent pas le journal de la console.

### forkJoin

forkJoin : ne déclenche uniquement lorsqu'il est certain que tous les observables ont répondus.
````
forkJoin(color$, logo$)
    .subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));
````	
Aucun log ne sera déclenché dans ce cas étant donné que les observables color$ et logo$ ne sont jamais terminé (on appelle toujours un .next);

Pour les considérés comme terminés, il faut appeler :

````
// 5. When the two persons(observables) ...
color$.complete();
logo$.complete();
````

## Directive
[Back to top](#angular-essentials)      

https://www.learn-angular.fr/les-directives/         
https://www.digitalocean.com/community/tutorials/angular-using-renderer2    

Lss directives permettent de modifier les éléments du DOM. **Leur responsabilité est relative à la vue**

Dans l'idéal :
- Si on **modifie l'aspect** d'un élément on utilise une **directive**. 
- SI on **créé un élément** alors on utilise un **component**

*Appel d'une directive (ici : appHighlight)*
````
<div appHighlight (click)="maFonction()">TEXT</div>

<!-- Une directive peut aussi envoyer un EventEmitter -->
<div appHighlight (eventDirective)="gererEmitterDeLaDirective()">TEXT</div>
````

*Directive qui applique un fond rouge sur un click de la div*
````
@Directive({
	selector: '[appHighlight]'
})

export class HighlightDirective {
	constuctor(private _element: ElementRef) { }

	// Ecouter événement click. Sur un click il applique la fonction onClick()
	@HostListener('click') 
	onClick(){
		this._element.nativeElement.style.backgroundColor = 
		this._element.nativeElement.style.backgroundColor ? null : 'red';
	}
}
````

### Ajouter des propriétés à une directive
[Back to top](#angular) 

````
<div [appHighlight]="'red'" [isMaj]="true"">TEXT</div>
````

*Directive qui applique un fond rouge sur un click de la div*
````
@Directive({
	selector: '[appHighlight]'
})

export class HighlightDirective {
	@Input('appHighlight') actualColorText: string;
	@Input() isMaj: boolean;

	constuctor(private _element: ElementRef) { }

	onClick(){
		const colorToApply = this.actualColorText || 'green';
		this._element.nativeElement.style.backgroundColor = 
		colorToApply;
	
		if(this.isMaj) {
			this._element.nativeElement.style.textTransform = 'uppercase';
		}
	}
}
````

### ngclass
Selon le contexte, si un traitement conditionnel est utilisé plusieurs fois dans l'appli et/ou avec de l'algo à faire, utiliser une directive.

Si c'est un cas très ponctuel, utiliser ````[ngClass]````

### Exemple 1

*directive.ts*

````
import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {

  @Input('appColor') highlightColor: string;

  private _defaultColor = 'blue';

  // Directive permettant de changer la couleur d'un élément
  constructor(private el: ElementRef, private renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'color', this._defaultColor);
  }

  // mouseenter listener
  @HostListener('mouseenter', ['$event']) onMouseEnter(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'color', this.highlightColor);
  }

  // mouseleave listener
  @HostListener('mouseleave', ['$event']) onMouseLeave(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'color', this._defaultColor);
  }

}

````

*app.component.html*

````
<div mat-subheader [appColor]="'red'">Directives typescript</div>
````

### Exemple 2 

````
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cardContent]'
})
export class CardContentDirective {

  constructor(
    readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
  ) {}
  toggleClass(addClass: boolean) {
      if (addClass) {
          this.renderer.addClass(
              this.elementRef.nativeElement, 'content-active'
          );
      } else {
          this.renderer.removeClass(
              this.elementRef.nativeElement, 'content-active'
          );
      }
  }
}

````

## ng-content
[Back to top](#angular-essentials)    

La balise <ng-content> permet de définir un modèle de vue fixe et de définir un emplacement pour du contenu dynamique.
Par exemple, imaginons un template dans lequel on aurait un header et du contenu :

*layout.component.ts*
````
import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-layout',
  templateUrl: 'card.component.html',
})
export class LayoutComponent {
    @Input() header: string = 'this is header';   
}
````

*layout.component.html*
````
<section class="layout">
    <h2 class="layout__header">
        {{ header }}
    </h2>
    <!-- slot de transclusion -->
    <div class="layout__content">    
        <ng-content></ng-content>
    </div>
</section>
````
	
Maintenant, utilisons ce layout dans un autre composant :

*articles.component.html*
````
<h1>Notre super App !</h1>
<app-layout header="Le header de mon layout !">
    <!-- début du contenu dynamique : -->
    <article class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article>
    <!-- fin du contenu dynamique -->
<app-layout>
````
	
Et voilà ! Le slot de transclusion<article class="content__article">…</article> remplacera le<ng-content></ng-content> dans notre layout.
Simple, me direz-vous, mais imaginons avoir besoin de plusieurs blocs de contenu dynamique… C’est possible ! <ng-content> accepte un attribut select, qui nous permet de nommer un slot. Modifions notre layout pour accepter un 2nd slot.

*layout.component.html*
````
<section class="layout">
    <!-- slot header -->
    <nav class="layout__nav">
       <ng-content select="[cardNav]"></ng-content>
    </nav>
    <!-- slot content--> 
    <div class="layout__content">       
        <ng-content select="[cardContent]"></ng-content>
    </div>
</section>
````
	
Notez que l’on utilise select=[cardNav] && select=[cardContent]. Les “[]” veulent dire “à remplacer uniquement si l’élément possède l’attribut card-…”.
Et notre composant :
	
*articles.component.html*
````
<h1>Notre super App !</h1>
<app-layout>
    <!-- contenu dynamique : nav -->
    <a cardNav class="nav__cta">Article 1</a>
    <a cardNav class="nav__cta">Article 2</a>
    <a cardNav class="nav__cta">Article 3</a>        
    
    <!-- contenu dynamique : content -->
    <article cardContent class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article> 
       
    <article cardContent class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article>   
     
    <article cardContent class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article>
<app-layout>
````

## ng-template
[Back to top](#angular-essentials)      

https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/

*ng-template* défini un template qui n'affiche rien tant qu'il n'est pas utilisé

````
<div class="lessons-list" *ngIf="lessons else loading">
  ... 
</div>

<!-- Ne sera affiché uniquement dans le cas else -->
<ng-template #loading>
    <div>Loading...</div>
</ng-template>
````

Il n'est pas possible d'appliquer plusieurs directives à un même élément, par exemple un *ngIf* et *ngFor* sur un même conteneur.
Pour palier ce problème, on peut créer une div pour le *ngIf* et une div pour le *ngFor*. Cela fonctionne mais oblige à créer une nouvelle div.

Il est donc possible d'utiliser un *ng-container*

Le ng-container permet en outre l'injection dynamique d'un template dans une page, un placeholder en quelques sortes

````
<ng-container *ngTemplateOutlet="loading"></ng-container>

<ng-template #loading>
    <div>Loading...</div>
</ng-template>
````

Il est possible de passer un template à un composant enfant :

*parent*
````
    <ng-template #testTemplate let-clientVar="client">
        <div class="customTemplate">
            <h1>Hello {{ clientVar }} !</h1>
            <p>This is my custom template</p>
        </div>
    </ng-template>
    
    <app-generic-collapsible-list [itemTemplate]="testTemplate"></app-generic-collapsible-list>
````

*enfant app-generic-collapsible-list*
````
<ng-template #defaultTabButtons>
    <div class="default-tab-buttons">
        ...
    </div>
</ng-template>

<ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate: defaultTabButtons">
</ng-container>
````

*enfant controller*
````
@Input() itemTemplate: TemplateRef<any>;
````

### Variable contexte

#### Exemple 1

Les ng-template peuvent prendre des paramètres. Ici le paramètre *when* contient une valeur comme "morning", "afternoon" ou "evening" :

````
<ng-template #hello let-when="whenValue">
  Good {{ when }} !
</ng-template>
````
*let-xxx* permet de définir des variables utilisables dans le ng-template (ici when) à partir de la propriété (ici whenValue) d'un objet passé en "context" du *ngTemplateOutlet*. Ces variables ne sont pas accessible depuis l'extérieur directement. Pour accéder à ces variables depuis le ng-container, il faut créer un contexte (objet json par exemple) qui a un attribut
ayant le nom de la variable à toucher :

````
<ng-container *ngTemplateOutlet="itemTemplate;context:{whenValue: 'morning'}">
</ng-container>
````

#### Exemple 2
````
<ng-template #testTemplate let-clientVar="client">
    <div class="customTemplate">
        <h1>Hello {{ clientVar }} !</h1>
        <p>This is my custom template</p>
    </div>
</ng-template>

<ng-container *ngTemplateOutlet="testTemplate;context:ctx"></ng-container>
````

*controller*
````
client = "gsoulie";
ctx = {client: this.client};
````

### Accéder au contexte depuis un composant enfant 

*View*

````
<div *ngFor="let num of [1,2,3,4,5,6,7]">
    <ng-container *ngTemplateOutlet="itemTemplate;context:{client:num}">
    </ng-container>
</div>
````

*Controller*
````
@Input() itemTemplate: TemplateRef<{client:any}>;
````

### boucles génériques de composant extand/collapse

ATTENTION : ne fonctionne pas avec un jeu de données qui vient d'un observable

https://makina-corpus.com/blog/metier/2019/des-boucles-generiques-de-composants-avec-angular
