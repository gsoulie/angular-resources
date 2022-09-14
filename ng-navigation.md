[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Navigation

* [Généralités](#généralités)         
* [Relative route relativeTo](#relative-route)     
* [Routes enfants](#routes-enfants)     
* [Deep linking](#deep-linking)   
* [Naviguer depuis la vue](#naviguer-depuis-la-vue)     
* [Routing parameters](#routing-parameters)      
* [Naviguer depuis le controller](#naviguer-depuis-le-controller)     
* [Modifier les paramètres sans recharger la page](#modifier-les-paramètres-sans-recharger-la-page)      
* [Lazy-loading routes](#lazy-loading-routes)   
* [router-outlet mutliple](#router-outlet-multiple)   
* [Resolver](#resolver)   
* [Guards](#guards)   
* [Route source](#route-source)   
* [Tab routing avec retour depuis modale ](#tab-routing-avec-retour-depuis-modale)   
* [Routing back previous](#routing-back-previous)       
* [Astuces navigation](#astuces-navigation)   

## Généralités

La route par défaut, doit toujours être à la fin du fichier de routing !!

````typescript
{
	path: 'not-found',
	component: PageNotFoundComponent
},
{
	path: '**',
	redirectTo: '/not-found',	
	pathMatch: 'full'
}
````

### A savoir : *href* recharge la page, pas le *routerLink*

## Relative route

Soit le routage suivant :

````typescript
const routes: Routes = [
 { path: '', component: HomeComponent},
 { path: 'users', component: UsersComponent, children: [
   { path: ':id', component: UserComponent},
 ]},
 { path: 'servers', component: ServersComponent, children: [
   { path: ':id', component: ServerComponent},
   { path: ':id/edit', component: EditServerComponent},
 ]},
];
````

**Exemple** : depuis la page /servers on liste tous les serveurs, ensuite nous souhaitons naviguer sur la page de détail d'un serveur en cliquant dans la liste pour atteindre la route */servers/id*. 
Ensuite, depuis la page de détail, on souhaite rediriger vers la route */servers/id/edit* lorsqu'on clique sur le bouton Editer.

Pour réussir cela, il suffit d'utiliser l'option **relativeTo** fournie par la fonction route.navigate :

````typescript
onEdit() {
   this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
}
````

Ceci aura pour effet de concaténer 'edit' au chemin courant (/servers/) qui sera récupéré par l'option *relativeTo: this.route*


## Routes enfants
[Back to top](#navigation)     

````typescript
const ROUTES: Routes = [
	{ path: 'user', children: [
		{ path: '', component: UserListComponent },
		{ path: 'edit/:id', component: UserEditComponent },
		{ path: 'add', component: UserAddComponent },
		{ path: 'delete/:id', component: UserDeleteComponent },
		{ path: ':id', component: UserComponent }	// ATTENTION à mettre en dernier sinon elle interceptera tous les autres routes
	]},
	{ path: '**', component: ErrorComponent }
]
````

## Deep linking
[Back to top](#navigation)  

Deux solution : 

- Définir les childroutes dans le *app.route.ts*
- **Bonne pratique** : Créer un fichier route dans chaque composant qui aura besoin de routes enfant.

La seconde solution est une meilleure pratique pour éviter d'avoir un fichier app.routes.ts trop conséquent.

*app.routes.ts*
````typescript
export const APP_ROUTES: Routes = [
	{
		path: 'home'
		component: HomeComponent,	// si on souhaite toujours afficher le composant Home en plus de ses enfants
		children: HOME_ROUTES
	}
]
````

*home.routes.ts*
````typescript
export const HOME_ROUTES: Routes = [
	{ path: 'child1', component: ChildComponent },
	{ path: 'child2', component: ChildComponent },
	{ redirectTo: '/default', path: '**' }
]
````
Ajoute ensuite le router-outlet du Home

*home.component.html*
````
<router-outlet></router-outlet>
````

## Naviguer depuis la vue
[Back to top](#navigation)   

Syntaxes possibles :
````html
<button [routerLink]="['./login']">Navigate</button> <!-- tableau de routes -->
<button routerLink="/login">Navigate</button> <!-- route seule -->
<button [routerLink]="['./client', 'product']">Navigate</button> <!-- concatène les 2 routes avec un / automatiquement -->
<button [routerLink]="['/client', client.id]">Navigate</button> <!-- routing avec paramètres -->
<button routerLink="/client/{{ client.id }}">Navigate</button> <!-- routing avec paramètres idem syntaxe ci-dessus -->
<button [routerLink]="['/client', { foo: 'foo' }]">Navigate</button>
<button [routerLink]="['area', businessArea, 'projects']"</button>
````

**routerLinkActive**

Vérifie si l'itinéraire lié d'un élément est actuellement actif et vous permet de spécifier une ou plusieurs classes CSS à ajouter à l'élément lorsque l'itinéraire lié est actif.

````html
<a routerLink="/first-component" routerLinkActive="active">
````

*Exemple*

Chaque fois que l'URL est */user* ou */user/bob*, la classe *active-link* est ajoutée à la balise d'ancrage. Si l'URL change, la classe est supprimée.

````html
<a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
````

On peut aussi définir plusieurs classes à l'aide d'une chaîne séparée par des espaces ou d'un tableau. 
````html
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
````

## Routing parameters
[Back to top](#navigation)   

### Approche impérative vs approche Réactive

> Note : Il est recommandé de préférer l'approche réactive à l'approche impérative

#### Approche impérative

````typescript
ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.userService.getUser(id)
    .subscribe((user) => this.user = user);
}
````

````html
<div *ngIf="user">
     <mat-label>Hello {{ user.name }}</mat-label>
</div>
````

#### Approche réactive

L'approche réactive permet l'utilisation d'un observable

````typescript
public user$ = this.route.paramMap
.pipe(
    switchMap((params) => this.userService.getUser(params.get('id'))
);

constructor(private route: ActivatedRoute, private userService: UserService) {}
````

````html
<div *ngIf="users$ | async as user">
	<mat-label>Hello {{ user.name }}</mat-label>
</div>
````

### Méthode "classique" paramMap

````typescript
{ path: 'fiche-saisie/:id/edit', component: FicheSaisieComponent },
{ path: 'fiche-saisie/:shiftId', component: FicheSaisieComponent },
````

````html
<button mat-button [routerLink]="['/fiche-saisie', '1']">création fiche saisie</button>
<button mat-button [routerLink]="['/fiche-saisie', '1', 'edit']">édition fiche saisie</button>
````

Exemple, on a un mode création qui reçoit un paramètre *shiftId* et un mode edition qui reçoit un paramètre *id*. Il est important de donner des noms différents aux paramètres dans ce cas précis (utilisation d'un même composant en mode création et édition), afin de pouvoir déterminer si nous somme en mode création ou édition.

````typescript
shiftId;
entryId;
editMode = false;

ngOnInit() {
	//this.ticketId = this.activatedRoute.snapshot.params.id // ATTENTION one shot !! ne sera plus mis à jour
	this.activatedRoute.params.subscribe((params: Params) => {
	      this.shiftId = params['shiftId'];
	      this.entryId = params['id'];
	      this.editMode = this.entryId !== undefined;
	      console.warn(`shiftId = ${this.shiftId}\r\n entryId = ${this.entryId}\r\n=> edit mode ? ${this.editMode}`);

        });
}
````

> **IMPORTANT** - **BONNE PRATIQUE** : il faut récupérer le paramètre dans un observable pour éviter la problématique d'appel multiple d'une même route avec un paramètre différent. En effet Angular ne recréé pas un composant si on vient déjà de ce dernier. De fait il ne rééxécute pas la logique codée dans ngOnInit() (appel ws pour récupération des données par exemple).


### queryParamMap 

*home.page.html (routing par la vue)*

````html
<ion-button routerLink="/details" [queryParams]="{category: 'my-categ', filter: 'my-filter'}">Navigate with params</ion-button>
<!-- créé la route : localhost/details?category=my-categ&filter=my-filter -->
````

*home.page.ts (routing par le code)*

````
navigateWithObject() {
	
	// Non recommandé si l'objet contient beaucoup de propriété !!!
	const params: NavigationExtras = {
		queryParams: { userid: 8 }
	};
	
	this.router.navigate(['/detail'], params); // va créer la route localhost/details?userid=8
}
````

*detail.page.ts*

````typescript
ngOnInit() {
	// version snapshot : si la page est détruite après fermeture 
	const category = this.activatedRoute.snapshot.queryParamMap.get('userid');
	
	// version observable : si la page est susceptible d'être rafraichie
	// on utilise une souscription (à détruire dans le onDestroy)
	this.activatedRoute.paramMap.subscribe(res => {
		// ...
	});
}
````

### router State


*home.page.ts*

````typescript
navigateWithState() {
	// Recommandé dans le cas d'un passage d'objet avec beaucoup de propriétés

	const navigationExtras: NavigationExtras = {
		state: { 
			user: {
				id: 38,
				name: 'Paul',
				age: 40
			}
		}
	};
	this.router.navigate('/details', navigationExtras);
}
````

*detail.page.ts*

````typescript
ngOnInit() {
	// version snapshot : Attention le state est perdu en cas de rafraichissement de la page
	const routerState = this.router.getCurrentNavigation().extras.state;
	console.log(routerState);
}
````


### Reset des paramètres de routage

````typescript
import { Subscription } from ‘rxjs/Subscription’;

export class UserComponent implements OnInit, OnDestroy {
	user: {id: number, name: string};
	paramSubscription: Subscription;

	constructor(private route: ActivatedRoute) {}
	
	ngOnInit() {
		this.paramSubscription = this.route.params
		.subscribe((params: Params) => {
			this.user.id = params[‘id’];
			this.user.name = params[‘name’];
		}
}

ngOnDestroy() {
	this.paramSubscription.unsubscribe();
}
````

## Naviguer depuis le controller
[Back to top](#navigation)

````typescript
this.route.navigate(['./ticket', 'edit', idTicket], {relativeTo: this.activatedRoute});	// => /ticket/edit/12
````

#### replaceUrl

Permet de redéfinir la route parent. Utile dans le cas d'une validation d'authentification pour éviter ensuite que lorsque l'utilisateur clique sur "back" il revienne sur l'écran de login alors qu'il est déjà authentifié

````typescript
this.router.navigateByUrl('/tabs', { replaceUrl: true });
````

## Modifier les paramètres sans recharger la page
[Back to top](#navigation)     

Soit une page parent *workflow* permettant de gérer x steps d'un workflow d'achat par exemple. On souhaite pouvoir naviguer d'une étape à l'autre sans avoir à recharger la page 
en utilisant les **queryParams**

*app.routing.module.ts*

````typescript
 {
    path: 'workflow',
    loadChildren: () => import('./pages/workflow/workflow.module').then( m => m.WorkflowPageModule),
    data: { step: '' }
 },
````

*workflow.page.html*
````html
<ion-content>
  <app-compo-step1 *ngIf="currentStep === 1"></app-compo-step1>
  <app-compo-step2 *ngIf="currentStep === 2"></app-compo-step2>
  <app-compo-step3 *ngIf="currentStep === 3"></app-compo-step3>
  <app-compo-step4 *ngIf="currentStep === 4"></app-compo-step4>
</ion-content>
<ion-footer class="ion-no-border">
  <ion-button (click)="previous()">previous</ion-button>
  <ion-button (click)="next()">next</ion-button>
</app-multiple-button-toolbar>
</ion-footer>
````

*workflow.page.ts*
````typescript
  currentStep = 1;
  
  ngOnInit() {
    this.routeParamSubscription$ = this.activatedRoute.queryParams.subscribe((param) => {
      this.currentStep = +param['step'] || null;
    });
  }
  
  next(ev): void {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.changeStepRoute();
    } else {
      this.router.navigate(['summary']);
    }
  }
  previous(ev): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.changeStepRoute();
    }
  }

  private changeStepRoute(): void {
    const params: NavigationExtras = {
      queryParams: { step: this.currentStep }
    };
    this.router.navigate(['workflow'], params);
  }
}
````

Naviguer sur une étape spécifique du workflow depuis un autre écran

*summary.page.html*
````html
<ion-content>
  <div>
    <ion-item button [routerLink]="['/workflow']" [queryParams]="{step: 1}">
      Lieu intervention
    </ion-item>
    <ion-item button [routerLink]="['/workflow']"  [queryParams]="{step: 2}">
      Vérifications lieu intervention
    </ion-item>
    <ion-item button [routerLink]="['/workflow']" [queryParams]="{step: 3}">
      Lieu de séjour
    </ion-item>
    <ion-item button [routerLink]="['/workflow']" [queryParams]="{step: 4}">
      Vérifications lieu de séjour
    </ion-item>
  </div>
</ion-content>
````

## Lazy-loading routes
[Back to top](#navigation)

C'est webpack qui va prendre en charge le lazy loading et créer un chunk du module

*app-routing.module.ts*
````typescript
{
    path: 'user/:id',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
},
{
    path: 'userStandalone',
    loadComponent: () => import('./components/user/user.component').then(m => m.UserComponent)  // standalone component lazy-load
}
````

### Preloading
[Back to top](#navigation)

Permet en background d'une page, de charger le contenu des autres pages

## router-outlet multiple
[Back to top](#navigation)

On peut définir plusieurs <router-outlet>. Mais faire **ATTENTION** de bien les nommer différemment

https://www.techiediaries.com/angular-router-multiple-outlets/

## Resolver
[Back to top](#navigation)

Le cheminement classique lors de la récupération des paramètres après navigation est le suivant :

- ouverture de la page
- récupération des paramètres de la route
- chargement des données (appels http ou autre)
- affectation de l'objet éventuel avec les données
- affichage dans la vue

Afin d'améliorer ce processus et de s'assurer que les données existent immédiatement à l'ouverture de la page on utilisise un resolver. L'avantage est qu'une fois
sur la page, on sait que les données sont chargées, il n'y a pas besoin d'utiliser de loading ou de traitement asynchrone.

Ce dernier est attaché à une ou plusieurs routes (dans le fichier routing). Le resolver est déclenché immédiatement lors du clic sur un lien de redirection et 
va se charger de charger les données voulues.

### Création d'un resolver

Créer le resolver comme un service

````typescript
import { Resolve } from '@angular/router';

export class MyResolverService implements Resolve<any> {
	constructor() {}
	
	resolve(route: ActivatedRouteSnapshot) {
		const category = route.paramMap.get('category'); // Il est possible d'utiliser une souscription
		
		// Retourner les données : appel http, observable, promise etc...
		return [1, 5, 32];
	}
}
````

### Déclaration dans le fichier routing

````typescript
{
	path: 'details/:id',
	loadChildren: () => .....,
	resolve: {
		myResolverData: MyResolverService
	}
	
````

### Utilisation depuis une page

De la même manière que la récupération d'un paramètre classique.

````typescript
ngOnInit() {
	const data = this.route.snapshot.data.myResolverData;	// on peut aussi utiliser une souscription
}
````

### Limitations 

Le resolver est "bloquant", c'est à dire que lors de la navigation, le changement de la page sera fait uniquement après que le resolver ait terminé la récupération des données.

Si un ou plusieurs appels http sont réalisés dans le resolver, il peut y avoir un délai le temps d'obtenir les réponses. Ceci peut poser problème car la navigation ne passera 
pas à la page demandée tant que la réponse n'aura pas été reçue. On peut donc avoir une latence entre le clic sur le lien et l'ouverture de la page demandée, ce qui n'est pas
le meilleur comportement.
Il est donc conseillé de ne pas utiliser de resolver pour gérer des navigations ayants besoin de faire des appels http.

[Back to top](#navigation)


## Guards
	
https://www.youtube.com/watch?v=YJ4dgoHEmGs&ab_channel=CodeShotsWithProfanis      

Le guard retourne toujours un boolean. Soit un boolean directement, soit une promise qui retourne un boolean, soit un observable qui retourne un boolean

````typescript
CanActivate() {
	return this.isLogged().then((res) => {
		if(res){
			return true;
		} else {
			this.router.navigate(['./login']);
			return false;
		}
	}
}
````

**CanDeactivate** permet de vérifier si j'ai le droit de quitter la route actuelle. C'est utilisé dans le cas ou l'utilisaateur est entrain de modifier un formulaire par exemple.

### Exemple guard
	
````typescript
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.user	// user est de type : user = new BehaviorSubject<User>(null);
      .pipe(
        take(1),	// évite de conserver une souscription. Permet de souscrire en one shot à chaque appel du guard
        map(user => {
          const isAuth = !!user;
          if (isAuth) {
            return true;
          }
          return this.router.createUrlTree(['/login']);
        })
      );
  }
````
	
[Back to top](#navigation)
	
## Route source

Connaître la route depuis laquelle on vient

````typescript
private routerEventsSubscription: Subscription;

ngOnInit() {
// On détecte les changements d'URL pour ne pas afficher les boutons de navigation vers la page sur laquelle on est déjà
    this.routerEventsSubscription = this.router.events.subscribe(() => {
      this.isOnLoginPage = this.router.url === '/login';
      this.isOnHomePage = this.router.url === '/home';
    });
}
````

[Back to top](#navigation)

## Tab Routing avec retour depuis modale

Exemple complet d'un routing via un tagGroup (onglet) avec retour sur le parent depuis une modale enfant. 

Cas d'utilisation : Une page principale contient un tab *home-tabs* contenant 3  onglets (home, queries, lists). Depuis les onglets *queries* et *lists* on a un bouton qui ouvre une modale *results*. A la fermeture de la modale on souhaite revenir sur le tab principal

*app.routing.module.ts*
```typescript
// Contains the route of the home-tabs page
const routes: Routes = [ 
  {
    path: '',
    loadChildren: () => import('./home-tabs/home-tabs.module').then( m => m.HomeTabsPageModule)
  },
]
```

*home-tabs-routing.module.ts*

````typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueriesPage } from '../pages/queries/queries.page';
import { HomeTabsPage } from './home-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: HomeTabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'queries',
        children: [
          {
            path: '',
            loadChildren: () => import('./../pages/queries/queries.module').then(m => m.QueriesPageModule)
          },
          {
            path: 'results/:queryId',	// in this case we want to pass a parameter
            loadChildren: () => import('./../pages/results/results.module').then( m => m.ResultsPageModule)
          }
        ]
      },
      {
        path: 'lists',
        children: [
          {
            path: '',
            loadChildren: () => import('./../pages/lists/lists.module').then(m => m.ListsPageModule)
          },
          {
            path: 'results',
            loadChildren: () => import('./../pages/results/results.module').then( m => m.ResultsPageModule)
          }
        ]
        
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabsPageRoutingModule {}

````

Naviguer vers la modale *results*

````html
// Navigating from queries page 
<ion-item tappable routerLink="results/{{ item.queryId }}" routerDirection="forward">

// Navigating from lists page
<ion-button routerLink="results">results</ion-button>
````

Revenir sur l'onglet parent courant depuis la modale

````html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
````
	
## Routing back previous
[Back to top](#navigation)

````typescript
constructor(private location: Location) { }
	
 back(): void {
    this.location.back();
 }
````
[Back to top](#navigation)

## Astuces navigation

### Préciser la direction lors du routing par code (ionic)

````typescript
constructor(private navCtrl: NavController) {}

goBackManually() {
	this.navCtrl.setDirection('back'); // fixe la direction de la prochaine transition
	this.router.navigateByUrl('/home');
}
````
[Back to top](#navigation)
