[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Navigation

* [Généralités](#généralités)         
* [Routes enfants](#routes-endants)     
* [Deep linking](#deep-linking)   
* [Naviguer depuis la vue](#naviguer-depuis-la-vue)     
* [Routing parameters](#routing-parameters)      
* [Naviguer depuis le controller](#naviguer-depuis-le-controller)     
* [Lazy-loading routes](#lazy-loading-routes)   
* [router-outlet mutliple](#router-outlet-multiple)   
* [Guards](#guards)   
* [Route source](#route-source)   
* [Tab routing avec retour depuis modale ](#tab-routing-avec-retour-depuis-modale)   

## Généralités

La route par défaut, doit toujours être à la fin du fichier de routing !!

````
{
	redirectTo: '/default',
	path: '**'
}
````

> A savoir : *href* recharge la page, pas le *routerLink*

## Routes enfants

````
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

- Définir les childroutes dans le app.route.ts
- Créer un fichier route dans chaque composant qui aura besoin de routes enfant. **Bonne pratique**

La seconde solution est une meilleure pratique pour éviter d'avoir un fichier app.routes.ts trop conséquent.

*app.routes.ts*
````
export const APP_ROUTES: Routes = [
	{
		path: 'home'
		component: HomeComponent,	// si on souhaite toujours afficher le composant Home en plus de ses enfants
		children: HOME_ROUTES
	}
]
````

*home.routes.ts*
````
export const HOME_ROUTES: Routes = [
	{
		path: 'child1'
		component: ChildComponent
	},
	{
		path: 'child2'
		component: ChildComponent
	},

	},
	{
		redirectTo: '/default',
		path: '**'
	}
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
````
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

````
<a routerLink="/first-component" routerLinkActive="active">
````

*Exemple*

Chaque fois que l'URL est */user* ou */user/bob*, la classe *active-link* est ajoutée à la balise d'ancrage. Si l'URL change, la classe est supprimée.

````
<a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
````

On peut aussi définir plusieurs classes à l'aide d'une chaîne séparée par des espaces ou d'un tableau. 
````
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
````

## Routing parameters
[Back to top](#navigation)    

````
{
	path: 'ticket/edit/:id'
	component: TicketComponent
}
````

## Naviguer depuis le controller
[Back to top](#navigation)

````
this.route.navigate(['./ticket', 'edit', idTicket], {relativeTo: this.activatedRoute});	// => /ticket/edit/12
````

*Récupérer les paramètres de route dans le controller*
````
ngOnInit() {
	//this.ticketId = this.activatedRoute.snapshot.params.id // ATTENTION one shot !! ne sera plus mis à jour
	this.activatedRoute.params.subscribe((params) => {
		this.ticketId = params.idTicket;
	});
}
````

> **IMPORTANT** - **BONNE PRATIQUE** : il faut récupérer le paramètre dans un observable pour éviter la problématique d'appel multiple d'une même route avec un paramètre différent. En effet Angular ne recréé pas un composant si on vient déjà de ce dernier. De fait il ne rééxécute pas la logique codée dans ngOnInit() (appel ws pour récupération des données par exemple).

## Lazy-loading routes
[Back to top](#navigation)

C'est webpack qui va prendre en charge le lazy loading et créer un chunk du module

*Syntaxe Angular 8*
````
{
	path: 'tickets',
	loadChildren:() => import('./lazy/Lazy.module').then(m=>m.NomModule)
}
````

### Preloading
[Back to top](#navigation)

Permet en background d'une page, de charger le contenu des autres pages

## router-outlet multiple
[Back to top](#navigation)

On peut définir plusieurs <router-outlet>. Mais faire **ATTENTION** de bien les nommer différemment

https://www.techiediaries.com/angular-router-multiple-outlets/

## Guards
[Back to top](#navigation)

Le guard retourne toujours un boolean. Soit un boolean directement, soit une promise qui retourne un boolean, soit un observable qui retourne un boolean

````
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

## Route source

Connaître la route depuis laquelle on vient

````
private routerEventsSubscription: Subscription;

ngOnInit() {
// On détecte les changements d'URL pour ne pas afficher les boutons de navigation vers la page sur laquelle on est déjà
    this.routerEventsSubscription = this.router.events.subscribe(() => {
      this.isOnLoginPage = this.router.url === '/login';
      this.isOnHomePage = this.router.url === '/home';
    });
}
````

## Tab Routing avec retour depuis modale
[Back to top](#navigation)

Exemple complet d'un routing via un tagGroup (onglet) avec retour sur le parent depuis une modale enfant. 

Cas d'utilisation : Une page principale contient un tab *home-tabs* contenant 3  onglets (home, queries, lists). Depuis les onglets *queries* et *lists* on a un bouton qui ouvre une modale *results*. A la fermeture de la modale on souhaite revenir sur le tab principal

*app.routing.module.ts*
```
// Contains the route of the home-tabs page
const routes: Routes = [ 
  {
    path: '',
    loadChildren: () => import('./home-tabs/home-tabs.module').then( m => m.HomeTabsPageModule)
  },
]
```

*home-tabs-routing.module.ts*

````
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

````
// Navigating from queries page 
<ion-item tappable routerLink="results/{{ item.queryId }}" routerDirection="forward">

// Navigating from lists page
<ion-button routerLink="results">results</ion-button>
````

Revenir sur l'onglet parent courant depuis la modale

````
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
````
[Back to top](#navigation)
