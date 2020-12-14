[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Navigation    

* [routerLink](#routerlink)    
* [Relative route "relativeTo"](#relative-route-"relativeTo")     
* [Child routes](#child-routes)    
* [Angular routing strategie Hash](#angular-routing-strategie-hash)    
* [Reset routing params](#reset-routing-params)     
* [Tab routing with routing back from modale](#tab-routing-with-routing-back-from-modale)      

## routerLink

```routerLink="<my-route>"``` directive append the wanted route to the current route. So if you are on the *localhost/servers* route and you use ```routerLink="servers"``` so the final route will be *localhost/servers/servers*

To avoid that issue, you can use the following syntax ```routerLink="../servers"``` or navigate by code with  ```this.router.navigate(['servers'])``` or ```this.router.navigateByUrl('servers')```. By using navigation by code, the *Router* component rebuilt all the route from the root */*

## Relative route "relativeTo"
[Back to top](#navigation)  

Considering the following routing : 

```
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
```

**Use case** from the */servers* page wich list all the servers, we want to navigate on a server's detail page when clicking it in the list, to reach the */servers/id* route.
Then from the server's detail page we want to redirect on */servers/id/edit* when clicking on the "Edit" button.

To do that, we just need to use the ```relativeTo``` option provided by the ```route.navigate``` method :

```
onEdit() {
   this.router.navigate(['edit'], {relativeTo: this.route});
}
```

This, will just append *edit* to the current path (*/servers/<id>*) which is retrieved by ```relativeTo: this.route```.

## Child routes
[Back to top](#navigation)  

```
const routes: Routes = [
 { path: '', redirectTo: '/recipes', pathMatch: 'full'},
 { path: 'recipes', component: RecipesComponent, children: [
   { path: '', component: RecipeStartComponent}, 
   { path: ':id', component: RecipeDetailComponent}
 ]}
];
```

## Angular routing strategie Hash
[Back to top](#navigation)  

Add ```{useHash: true}``` in the *app-routing.module.ts *

*app-routing.module.ts*

```
const routes: Routes = [
 { path: '', component: HomeComponent, pathMatch: 'full'},
 { path: 'users', component: UsersComponent, children: [
   { path: ':id', component: UserComponent},
 ]},
 { path: 'servers', component: ServersComponent, children: [
   { path: ':id', component: ServerComponent, resolve: {serverParam: ServerResolver}},
   { path: ':id/edit', component: EditServerComponent},
 ]},
 //{ path: 'not-found', component: PageNotFoundComponent },
 { path: 'not-found', component: ErrorPageComponent, data: {message: 'page not found'} },
 { path: '**', redirectTo: '/not-found' },
];
 
@NgModule({
 imports: [RouterModule.forRoot(routes, {useHash: true})],
 exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Reset routing params
[Back to top](#navigation)  

```
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
```

## Tab Routing with routing back from modale
[Back to top](#navigation)

Here is a full sample of tab routing with routing back integration from child modale. 

Use case : main page *home-tabs* gets 3 tabs (home, queries, lists). From *queries* and *lists* tabs we have a button which open a new modale named *results*

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

Navigate on *results* modale 

````
// Navigating from queries page 
<ion-item tappable routerLink="results/{{ item.queryId }}" routerDirection="forward">

// Navigating from lists page
<ion-button routerLink="results">results</ion-button>
````

Routing back from modale to current tab

````
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button></ion-back-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
````
