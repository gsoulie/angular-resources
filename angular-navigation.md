[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Navigation    

* [routerLink](#routerlink)    
* [Relative route "relativeTo"](#relative-route-"relativeTo")     
* [Child routes](#child-routes)    
* [Angular routing strategie Hash](#angular-routing-strategie-hash)    

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
