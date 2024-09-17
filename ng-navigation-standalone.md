[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    


# Navigation Angular v15+

* [Lazy-loading standalone component](#lazy-loading-standalone-component)
* [Routing en mode standalone](#routing-en-mode-standalone)
* [Routing parameters](#routing-parameters)
* [Functional Guards](#functional-guards)
* [DeactivateGuard](#deactivateguard)      

## Lazy-loading standalone component

````typescript
{
    path: 'userStandalone',
    loadComponent: () => import('./components/user/user.component').then(m => m.UserComponent)
},
````

En exportant le standalone component en mode **default** on peut ainsi simplifier l'import de la manière suivante

````typescript

export default HomeComponent { ... }


{
    path: 'userStandalone',
    loadComponent: () => import('./components/user/user.component')
},
````

## Routing en mode standalone

<details>
	<summary>Depuis Angular 14 il est possible d'utiliser des composants de type standalone. Cette utilisation présente quelques différences dans la gestion du routage.</summary>
	
Le chargement d'un composant standalone se fait avec la fonction loadComponent. Si ce dernier comporte des routes enfants, alors on utilisera la fonction loadChildren

*app.routes.ts*
````typescript
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'parent',
    loadChildren: () => import('./components/standalone/parent/routes').then(mod => mod.STANDALONE_ROUTES)	// chargement avec routes enfant
    //loadComponent: () => import('./components/standalone/parent/parent.component').then(m => m.ParentComponent)	// chargement composant standalone seul sans routes enfant
  }
];
````

L'utilisation de routes enfant dans un composant standalone nécessite de créer un fichier contenant les routes un peu à la manière du app-routing.module.ts

> Code complet disponible ici : [https://github.com/gsoulie/ng-routing-v14](https://github.com/gsoulie/ng-routing-v14)     
	
</details>

## Routing parameters

<details>
	<summary>Récupération des paramètres de route avec @Input()</summary>

Depuis Angular 16, il est possible de récupérer les paramètres de route comme tout paramètre d'un composant avec un @Input

Afin d'utiliser cette nouvelle fonctionnalité, nous devons l'activer dans le RouterModule :


*app.config.ts* (**mode standalone**)
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),	// <-- 
  ]
};
````


*app.module.ts* (**Activation via router module**)
````typescript
@NgModule({
	imports: [
		RouterModule.forRoot([], {
			// ... autres fonctionnalités
			bindToComponentInputs: true // <-- activer cette fonctionnalité
		})
	],
})
export class AppModule {}
````

Avec cette fonctionnalité, il est désormais possible de simplement récupérer les paramètres de route et data de la route de la manière suivante :

````typescript
const routes: Routes = [
	{
		path: "search/:id",		// <-- paramètre id
		component: SearchComponent,
		data: { title: "Recherche" },	// <-- data de la route
		resolve: { searchData: SearchDataResolver }
	},
];

@Component({})
export class SearchComponent implements OnInit {
	query = input<string>(''); // Ce paramètre viendra des query params
	id = input<string>.required(); // Ce paramètre viendra des path params
	title = input<string>(''); // Ce paramètre viendra des data
	searchData = input<any>(); // Ce paramètre viendra des resolved data
}
````

On peut aussi renommer les paramètres si besoin de la manière suivante :

````typescript
@Input() query?: string; 
@Input('id') pathId?: string; 
@Input('title') dataTitle?: string;
@Input('searchData') resolvedData?: any;
````

### Version Angular 17+

Important, tous les paramètres doivent avoir le même nom que ceux déclarés dans le composant qui va les recevoir

*routes.ts*
````typescript
  {
    path: 'routing-params/:id',
    data: {
      info: 'Text informatif'
    },
    loadComponent: () => import('./components/routing-parameters/routing-parameters.component')
  },
````

*routage avec ajout de paramètres dans la route en plus du paramètre obligatoire*
````typescript
  routerService = inject(Router);

  routeWithQueryParam(childGuild: string, page: number, filter: string) {
    this.routerService.navigate(['/routing-params/15'], {
      queryParams: {
        childGuid: childGuild,
        page: page,
        filter: filter
      }
    })
  }
````

*composant enfant*
````typescript
export default class RoutingParametersComponent implements OnInit {
  id = input<string>('');
  info = input<string>('');
  childGuid = input<string>('');
  page = input<number>(0);
  filter = input<string>('')

  ngOnInit(): void {
    console.log('PARAM ', this.id());
    console.log('-- child param --', this.childGuid());
    console.log('-- page param --', this.page());
    console.log('-- filter param --', this.filter());
  }
}
````

**Ajout des query parameters depuis la vue**

*parent.html*
````typescript
<div routerLink="/routing-params/15" [queryParams]="{
	childGuid: 'Az8sA545aAeeee8a7',
	page: 1,
	filter: 'search term'
}">Link</div>
````

	
</details>

## Functional Guards

<details>
	<summary>utilisation des guards fonctionnels</summary>
	
Depuis Angular 15, il est conseillé de convertir ses guards en guards fonctionnels. En effet, les guards classiques basés sur des classes sont dépréciés en v17. La raison principale de ce changement est que les gardes basées sur les classes injectables et les Injection Token sont moins configurables et réutilisables. De plus, ils ne peuvent pas être intégrés, ce qui les rend moins puissants et plus lourds.


<details>
	<summary>Exemple de migration de class-based guard en functional guard</summary>
	
````typescript
// Class-based classic guard
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
	#authService = inject(AuthService);
	
	canActivate() {
		return this.#authService.isLoggedIn$;
	}
}

// Functional guard
export const authGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	return authService.isLoggedIn$;
}

// Utilisation actuelle
const routes: Routes = [
	{
		path: 'admin',
		canActivate: [authGuard],
		loadComponent: () => import('./user-admin.component'),
	}
]

// Utilisation FUTURE lorsque les class-based guard et resolver seront dépréciés
const routes: Routes = [
	{
		path: 'admin',
		canActivate: mapToGuards.canActivate([AuthGuard]),
		loadComponent: () => import('./user-admin.component'),
	}
]
````
	
</details>

<details>
	<summary>Exemple de functional guard avec gestion de rôle</summary>
	
````typescript
const hasRole = (role: string): boolean => {
	return inject(AuthService).role$.pipe(
		map(roles => roles.map(x => x.name).includes(role))
	)
}

export const routes: Routes = [
	{
		path: 'home',
		children: [
			{
				path: '',
				canMatch: [() => hasRole('user')],
				loadComponent: () => import('./user-home.component'),
			},
			{
				path: '',
				canMatch: [() => hasRole('admin')],
				loadComponent: () => import('./user-admin.component'),
			}
		]
	}
]
````
</details>

<details>
	<summary>Exemple de functional guard avec redirection</summary>
	
*auth-guard.guard.ts*
````typescript
import { inject } from "@angular/core";
import { AuthJwtService } from "../services/auth-jwt.service";
import { CanActivateFn, Router } from "@angular/router";

export function authJwtGuard(fallbackRoute: string = 'login'): CanActivateFn {
  return () => {
    const isLoggedIn = inject(AuthJwtService).isLoggedIn();
    const router = inject(Router);

    if (!isLoggedIn) {
      router.navigate([fallbackRoute]);
    }
    return isLoggedIn;
  }
};
````
	
*app.routes.ts*
````typescript
import { Routes } from '@angular/router';
import { authJwtGuard } from './lib/auth/auth-jwt/guards/auth-jwt.guard';
import { inject } from '@angular/core';
import { AuthJwtService } from './lib/auth/auth-jwt/services/auth-jwt.service';

export const routes: Routes = [{
  path: 'todos',
  loadComponent: () => import('./pages/todolist/todos.component')
}, {
  path: 'protected',
  loadComponent: () => import('./pages/protected/protected.component').then(m => m.ProtectedPage),
  canActivate: [authJwtGuard('/login')]
}, {
  path: 'login',	// Accessible uniquement si on n'est pas connecté
  loadComponent: () => import('./lib/auth/auth-jwt/components/auth-jwt-login.component').then(m => m.LoginJwtComponent),
  canActivate: [() => !inject(AuthJwtService).isLoggedIn()]
}];
````

</details>

<details>
	<summary>Exemple avec injection de service</summary>

 ````typescript
export const canActivate = (authService = inject(AuthService)) => authService.isLogged

export const routes: Routes = [
{
    path: 'guard',
    canActivate: [() => canActivate()],
    loadComponent: () => import('./components/functionl-guards/functionl-guards.component')
  }
]
````
</details>

</details>

## DeactivateGuard

Petit "tuto" sur les guards de **"désactivation"**. Voici donc à quoi cela peut servir

Les guards de désactivation **CanDeactivate permettent de contrôler si une route peut être "désactivée" ou non**. Ils peuvent être très pratiques pour se prémunir d'une perte de données dans des écrans de type formulaire par exemple. L'utilisateur pourrait quitter la page involontairement après avoir modifié des informations dans le formulaire sans les avoir sauvegardées au préalable.

Les Guards de désactivation sont couplées aux composants car ils doivent communiquer avec le composant pour établir leur décision d'accès. Ce type de guard est un service qui implémente l'interface **CanDeactivate**. Ce service doit donc implémenter la méthode **canDeactivate()**.

Cette méthode est appelée à chaque fois que l'utilisateur souhaite quitter la route (clic sur un lien ou déclenchement automatique). Elle doit alors retourner une valeur de type boolean ou Promise ou Observable indiquant si l'accès à la "route" est autorisé ou non.

Contrairement au Guards d'activation, ce Guard prend en premier paramètre l'instance du composant. C'est pour cette raison que l'interface CanDeactivate est générique.

<details>
  <summary>Implémentation AVANT Angular 15</summary>

Voici un exemple de création basique de guard de désactivation sur un écran avec de la sasie utilisateur.

*can-deactivate-guard.service.ts*

```
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
 
  canDeactivate(component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return component.canDeactivate();
  }
}

```

Il faut ensuite implémenter ce guard dans le composant concerné

*user-detail.component.ts*

```
import { CanComponentDeactivate } from './../deactivate/deactivate.guard';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class UserComponent implements OnInit, CanComponentDeactivate {
  inputData: UserData;
  nom = '';
  prenom = '';
  editingData = false;    // indiquer si un des champs a été modifié ou non (on pourrait utiliser la propriété dirty des formControl)
 
  constructor(private route: ActivatedRoute, private userService: UserService) { }
 
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userId = +params['id'];  
      this.inputData = this.userService.getUser(this.userId);
      
      // initialisation des champs du formulaire
      this.nom = this.inputData.nom;
      this.prenom = this.inputData.prenom;
    });
  }
 
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    
    if (!this.editingData) { return true; }
    
    // Affichage modale de confirmation si des données ont été modifiées
    if (this.inputData.nom !== this.nom || this.inputData.prenom !== this.prenom) {
      return confirm('Êtes-vous certain de vouloir abandonner vos modifications ?');
    }
    return true;
  }
 
  editing(ev) { this.editingData = true; }
  
  submit() { /*... enregistrement des données */ }
}

```

Enfin, attacher le guard à la route

*app-routing.module.ts*

```
import { CanDeactivateGuard } from './components/deactivate/deactivate.guard';
 
const routes: Routes = [{
    path: 'user/:id',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],    // <-- Guard de désactivation
    loadComponent: () => import('./components/user/user.component').then(m => m.UserComponent)
  },
];

```
  
</details>

<details>
  <summary>Implémentation Angular 15+</summary>

Depuis Angular 15 et l'arrivée des guard fonctionnels, l'interface **CanDeactivate** est **déprécié**.

L'écriture du guard se fait donc de manière fonctionnelle.

Imaginons un composant de type formulaire, pour lequel on positionnerait une variable ````canExit```` à ````false```` lorsque le formulaire serait en mode édition

*CustomForm.component.ts*

````typescript
export class CustomForm {

  canExit = true;

  isEditing() {
    this.canExit = false;
  }
}
````
Définissons ensuite le guard fonctionnel :

*CustomForm-deactivate-guard.service.ts*

````typescript
import { CanDeactivateFn } from "@angular/router";
import { CustomForm } from "./custom-form.component";
import { Observable } from "rxjs";

export const hasUnsavedChangesGuard: CanDeactivateFn<CustomForm> = (component: CustomForm): Observable<boolean> | Promise<boolean> | boolean => {
  
  if (!component.canExit) {
    return confirm('Are you sure you want to leave this page? If you do, any unsaved changes will be lost.');
  }

  return true;
}
````

Enfin, attachons le guard à la route concernée :

*app.routes.ts*

````typescript
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'form'
  },
  {
    path: 'form',
    canDeactivate: [hasUnsavedChangesGuard],
    loadComponent: () => import('./pages/custom-form/custom-form.component').then(m => m.CustomForm)
  },
]
````
  
</details>



