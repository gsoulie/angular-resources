[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# NgRx

* [Présentation](#présentation-application-state)     
* [Utilisation](#utilisation)     
* [Important](#important)     
* [Utilisation](#utilisation)     
* [Créer les actions](#créer-les-actions)     
* [Reducer](#reducer)    
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
### Projet exemple

https://github.com/gsoulie/angular-resources/tree/master/ngrx      

[Bact to top](#ngrx)    

## Créer les actions

Les codes utilisés pour identifier les actions **DOIVENT ETRES UNIQUES** dans l'application. En effet la fonction ````store.dispatch```` atteint TOUS les reducers bien que l'on spécifie un reducer particulier lors de l'appel à dispatch. De fait, il faut éviter la duplication des identifiants des actions pour prévenir d'évnetuels effets de bords.

> Recommandation : préfixer les valeurs avec le nom de sa classe / feature ou autre

*Exemples*
````typescript
const ADD_USER = '[User] Add new user';
const UPDATE_USER = '[User] Update user';
const DELETE_USER = '[User] Delete user';
const INIT_USERS = '[User] Initialize users';

// Déclaration d'un groupe d'action - Nouvelle syntaxe NgRx 14
export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    FETCH_USERS: emptyProps(),
    SET_USERS: props<{ payload: User[] }>(),
    ADD_USER: props<{ payload: User }>(),
    DELETE_USER: props<{ payload: User }>(),
    UPDATE_USER: props<{ payload: User }>()
  }
})

// Création d'actions à l'unité
//export const fetchUsers = createAction(FETCH_USERS);
//export const setUsers = createAction(SET_USERS, props<{ payload: User[] }>())
````

[Bact to top](#ngrx)    

## Reducer

````typescript
// définition d'un state en particulier
export interface State {
  users: User[];
  isLoading: boolean;
}

const initialState: State = {
  users: [{
    id: 1, name: 'Guillaume'
  }], // possibilité d'ajouter des dummy data ici
  isLoading: false
}

export const usersReducer = createReducer(
  initialState,
  on(
    UsersActions.fetch_users,
    (state) => ({
      ...state, // BONNE PRATIQUE : copier le contenu de l'ancien state. évite de perdre des données en route
      isLoading: false
    })
  ),
  on(
    UsersActions.set_users,
    (state, action) => ({
      ...state,
      isLoading: false,
      users: [...action.payload]
    })
  ),
  on(
    UsersActions.add_user,
    (state, action) => ({
      ...state,
      users: [...state.users, action.payload]
    })
  ),
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
      ofType(UserActions.fetchUser),
      switchMap(() => this.getUsers() ),
      map(users => {
        return users.map(user => {
          return {
            ...user
          }
        })
      }),
      map(users => UserActions.setUsers({ payload: users }))
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
    this.store.dispatch(UserActions.fetchUsers());
    
    return this.actions$.pipe(
      ofType(UserActions.setUsers),
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
