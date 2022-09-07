# NgRx

* [Présentation](#présentation-application-state)     
* [Utilisation](#utilisation)     
* [Important](#important)     
* [Effects](#effects)    

## Présentation Application state

Problématique : Le "state" d'une application est perdu lorsqu'on redémarre / rafraichi une application web puisque ce processus entraine le vidage de la mémoire. Une des solutions pour pallier à ce problème est de créer un backend. On parle alors de "Persistent state". 

Une autre possibilité consiste à utiliser un application state.

- toutes les informations / données qui déterminent ce qui est affiché à l'écran constituent (variables dans les compos / services) => le STATE ou local state     
- les informations / données qui affectent une grande partie voir l'entièreté de l'application forment => l'application state      
- basiquement les informations qui composent le state sont portées par les services ou les composants via leurs variables      

**NgRX Redux**    

NgRx est un framework (angular + rxjs + redux) de state management pattern qui permet de ne gérer qu'un seul State central qu'on pourrait assimiler à un gros objet JSON qui contient toutes les données du state. Cet objet devient donc la seule source de vérité (le **store** -> redux). 
Les services et composants intéragissent toujours entre-eux mais recoivent les informations de ce state unique

Pour manipuler les data de ce state, les composants / services vont utiliser des **actions** ayant un **type** et un **payload** (optionel). L'action va ensuite contacter le **reducer** (fonction js) qui va lui, contacter le store et effectuer l'opération de modification du state de manière immutable (en travaillant sur une copie du state) et va renvoyer un nouveau state

### ce qui ne doit pas etre inlut dans le store 
* état non partagé avec d'autres composants. si un service n'est utile qu'a un seul compo, ce n'est pas la peine de le gerer avec ngrx      
* état d'un formulaire angular    
* objet complexes difficilement modifiables  

### A savoir

NgRx gère tout seul le désabonnement, il n'est donc pas nécessaire de stocker la souscription au store dans une varbiable pour se désabonner dans le *ngOnDestroy*    

[Bact to top](#ngrx)    

## Utilisation

### Installation

````npm i --save @ngrx/store````
### Sample

https://github.com/gsoulie/angular-resources/tree/master/ngrx      

### Import des reducers

*app.module.ts*

````typescript
import * as fromApp from './shared/store/app.reducer';

 imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.globalReducer) // <-- NgRx
  ],
````

### Appel depuis controller (ou service)

````typescript
export class UsersComponent implements OnInit {
  username = '';
  usersStore$: Observable<{ users: User[] }>; // usage NgRx
  
  constructor(private store: Store<fromUser.AppGlobalState>) { }

  ngOnInit(): void {
    // sélection du state correspondant
    this.usersStore$ = this.store.select('userState');
  }
  addUser() {
    if (this.username === '') { return; }
    const newUser: User = { id: Date.now(), name: this.username };

    // Dispatch sur action AddUser
    this.store.dispatch(new UsersReducerActions.AddUser(newUser));
  }

  deleteUser(user: User) {
    // Dispatch sur action DeleteUser
    this.store.dispatch(new UsersReducerActions.DeleteUser(user));
  }

  updateUser(user: User) {
    const updatedUser: User = { id: user.id, name: user.name + ' (updated)' };

    // Dispatch sur action UpdateUser
    this.store.dispatch(new UsersReducerActions.UpdateUser(updatedUser));
  }
}
````
[Bact to top](#ngrx)    

# TRES IMPORTANT

Les codes utilisés pour identifier les actions **DOIVENT ETRES UNIQUES** dans l'application. En effet la fonction ````store.dispatch```` atteint TOUS les reducers bien que l'on spécifie un reducer particulier lors de l'appel à dispatch. De fait, il faut éviter la duplication des identifiants des actions pour prévenir d'évnetuels effets de bords.

*user.actions.ts*
````typescript
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const INIT_USERS = 'INIT_USERS';
...
````

> Recommandation : préfixer les valeurs avec le nom de sa classe / feature ou autre

*Exemples*
````typescript
export const ADD_USER = '[User] Add new user';
export const UPDATE_USER = '[User] Update user';
export const DELETE_USER = '[User] Delete user';
export const INIT_USERS = '[User] Initialize users';

// Or

export const ADD_USER = 'User_ADD_USER';
export const UPDATE_USER = 'User_UPDATE_USER';
...
````
[Bact to top](#ngrx)    
## Effects

Les *Effects* permettent de gérer la problématique des "effets de bords". Sont considérés comme effets de bord : les **appels http**, **local storage** etc...

Installation du package Effects ````npm i --save @ngrx/effects````

Les effects sont ensuite gérés dans des fichier séparés de type *xxxx.effects.ts*. On peut y déléguer les appels http par exemple :

````typescript
import { User } from '../user.model';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from "@ngrx/effects";
import * as UserActions from './users.actions';
import { map } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient) { }

  fetchData$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(UserActions.FETCH_USERS),
      switchMap(() => this.getUsers() ),
      map(users => {
        return users.map(user => {
          return {
            ...user
          }
        })
      }),
      map(users => new UserActions.SetUsers(users))
    )
  });

  getUsers() { return this.http.get<User[]>('/assets/data.json'); }
}
````

> **ofType** permet de filtrer sur le type d'effet que l'on souhaite observer. Il est possible de définir plusieurs types.

Import dans app.module.ts

````typescript
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './components/users/ngrx-store/user.effects';

@NgModule({
  imports: [
    ...
    StoreModule.forRoot(fromApp.globalReducer),
    EffectsModule.forRoot([UserEffects]) // <-- NgRx
  ],
````

Déclenchement depuis un service

*user.service.ts*
````typescript
import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducer'
import * as DataActions from './ngrx-store/data.actions';
import * as UserActions from './ngrx-store/users.actions';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
   private store: Store<fromApp.AppGlobalState>,
   private actions$: Actions) { }

  fetchUsers(): Observable<User[]> {
    this.store.dispatch(new UserActions.FetchUsers());
    
    return this.actions$.pipe(
      ofType(UserActions.SET_USERS),
      take(1)
    );
  }
}
````

Appel depuis le composant

*user.component.ts*
````typescript
import { Store } from '@ngrx/store';
import * as UsersReducerActions from './ngrx-store/users.actions';
import * as fromApp from '../../shared/store/app.reducer';

export class UsersComponent implements OnInit {
 usersStore$: Observable<User[]>; // usage NgRx
 isLoading$: Observable<boolean>;
 
 constructor(
     private dataService: UserDataService,
     private store: Store<fromApp.AppGlobalState>) { }

   ngOnInit(): void {
     // usage NgRx
     this.usersStore$ = this.store.select('userState')
       .pipe(map(state => state.users));

     this.isLoading$ = this.store.select('userState')
       .pipe(map(state => state.isLoading));

     this.dataService.fetchUsers();
 }
}
````

[Bact to top](#ngrx)    
