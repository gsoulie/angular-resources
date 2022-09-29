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

Les codes utilisés pour identifier les actions **doivent être UNIQUES** dans l'application. En effet la fonction ````store.dispatch```` atteint TOUS les reducers bien que l'on spécifie un reducer particulier lors de l'appel à dispatch. De fait, il faut éviter la duplication des identifiants des actions pour prévenir d'évnetuels effets de bords.

> Recommandation : préfixer les valeurs avec le nom de sa classe / feature ou autre

*Exemples user.actions.ts*
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

*Exemple user.reducer.ts*
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


https://ngrx.io/guide/effects

````typescript
@Injectable()
export class MovieEffects {
 
  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType('[Movies Page] Load Movies'),
    mergeMap(() => this.moviesService.getAll()
      .pipe(
        map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
        catchError(() => EMPTY)
		//catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))	// autre cas de gestion d'erreur
      ))
    )
  );
 
  constructor(
    private actions$: Actions,
    private moviesService: MoviesService
  ) {}
}
````

Dans cet exemple, l'effect *loadMovies$* écoute toutes les actions présentes dans le stream Action (défini par ofType).
ici il n'écoûte que l'action ````[Movies Page] Load Movies````.

> **ofType** permet de filtrer sur le type d'effet que l'on souhaite observer. Il est possible de définir plusieurs types.

Le stream d'action est ensuite applati et mapper dans un autre observable via *mergeMap*.

Le service ````moviesService.getAll()```` retourne un observable qui va mapper le résultat (les films) dans une nouvelle action en cas de succès et retourner un observable vide en cas d'erreur.

L'action est alors dispatché dans le store où elle va être attrapée par le reducer lorsqu'une modification du state sera nécessaire.

IMPORTANT : Il est important de gérer les erreurs d'observable afin de ne pas couper le flux d'observable.


*Autre exemple avec un AuthEffect*

````typescript
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginPageActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(user => AuthApiActions.loginSuccess({ user })),
          catchError(error => of(AuthApiActions.loginFailure({ error })))
        )
      )
    )
  );
}
````

*Exemple avec données provenant du state*

````typescript
@Injectable()
export class CollectionEffects {
  addBookToCollectionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
        tap(([action, bookCollection]) => {
          if (bookCollection.length === 1) {
            window.alert('Congrats on adding your first book!');
          } else {
            window.alert('You have added book number ' + bookCollection.length);
          }
        })
      ),
    { dispatch: false }
  );
 
  constructor(
    private actions$: Actions,
    private store: Store<fromBooks.State>
  ) {}
}
````

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
