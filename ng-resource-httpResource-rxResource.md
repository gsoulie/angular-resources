[< Back to main menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)   


## Présentation
Introduites dans Angular 19, ces apis proposent une nouvelle façon de connecter les sources de données aux controlleurs.

Dans les versions récentes d'Angular (à partir d'Angular 19/20), `resource()` et `httpResource()` appartiennent à la nouvelle approche réactive basée sur les Signals, mais ils n'ont pas exactement le même objectif.

## Vue d'ensemble

| Critère                 | `resource()`                                                 | `httpResource()`                     |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------ |
| Objectif                | Gérer n'importe quelle ressource asynchrone                  | Gérer spécifiquement des appels HTTP |
| Dépendance à HttpClient | Non                                                          | Oui                                  |
| Type de données         | Libre                                                        | Réponse HTTP                         |
| Gestion de l'annulation | Oui                                                          | Oui                                  |
| Parsing JSON            | Manuel                                                       | Automatique                          |
| Intercepteurs Angular   | Non                                                          | Oui                                  |
| Gestion headers/auth    | Manuel                                                       | Via HttpClient                       |
| Cas d'usage             | API REST, IndexedDB, WebSocket, Firebase, Promesses diverses | API REST Angular classique           |

## `resource()`

`resource()` est l'API générique. Elle permet de **transformer n'importe quelle opération asynchrone en signal réactif**.

*Exemples :*
````typescript
const userId = signal('123');

const userResource = resource({
  request: () => userId(),
  loader: async ({ request }) => {
    const response = await fetch(`/api/users/${request}`);
    return response.json();
  }
});
````

````typescript
/**
 * Code example featuring weather forecasts using resource
 */
import { resource, signal, computed } from '@angular/core';

const selectedCity = signal('Chicago');

const weatherResource = resource({
  params: () => ({ city: selectedCity() }),
  loader: ({ params }) => fetchWeatherForecast(params.city),
});

const currentTemperature = computed(() => {
  if (weatherResource.hasValue()) {
    return `${weatherResource.value().temperature}°F`;
  }
  return 'Loading weather...';
});
````
Ici Angular ne sait rien de HTTP.

Le loader pourrait tout aussi bien appeler :
````
localStorage
IndexedDB
Firebase
GraphQL client
WebSocket
Electron API
Tauri API
````
ou n'importe quelle Promise.

### États exposés
````typescript
userResource.value()
userResource.error()
userResource.status()
userResource.isLoading()
````
Exemple :
````typescript
@if (userResource.isLoading()) {
  Loading...
}

@if (userResource.error()) {
  Error
}

@if (userResource.value()) {
  {{ userResource.value().name }}
}
````

## `httpResource()`

`httpResource()` est une **spécialisation construite au-dessus de HttpClient**.

*Exemple :*
````typescript
export class WeatherComponent {
  selectedCity = signal('Chicago');

  weather = httpResource<{ temperature: number; condition: string }>(() => {
    return `https://api.example.com/v1/forecast/${this.selectedCity()}`;
  });

  changeCity(newCity: string) {
    this.selectedCity.set(newCity);
  }
}
````


````typescript
  protected readonly filter = signal({ from: 'Hamburg', to: 'Graz' });

  protected readonly flightsResource = httpResource<Flight[]>(
    () => ({
      url: 'https://demo.angulararchitects.io/api/flight',
      params: {
        from: this.filter().from,
        to: this.filter().to,
      },
    }),
    { defaultValue: [] },
  );

  protected readonly flights = this.flightsResource.value;
  protected readonly error = this.flightsResource.error;
  protected readonly isLoading = this.flightsResource.isLoading;

  protected search(): void {
    this.flightsResource.reload();
  }
````

Angular réalise automatiquement : `http.get(...)` et expose directement le résultat sous forme de Resource.

## Pourquoi Angular a créé httpResource ?

L'équipe Angular a observé qu'une très grande partie des usages de resource() ressemblait à :
````typescript
resource({
  request: () => id(),
  loader: async ({ request }) => {
    const response = await fetch(...);
    return response.json();
  }
})
````
Donc beaucoup de code répétitif.

`httpResource()` simplifie ce scénario.

*Exemple complet*

Avec **resource()** :
````typescript
const products = resource({
  request: () => category(),
  loader: async ({ request }) => {
    const response = await fetch(
      `/api/products?category=${request}`
    );

    return response.json();
  }
});
````
Avec **httpResource()** :
````typescript
const products = httpResource(() => ({
  url: '/api/products',
  params: {
    category: category()
  }
}));
````
Beaucoup moins de boilerplate.

## Intégration avec HttpClient

C'est probablement la différence la plus importante.

Avec `resource()` :

`fetch(...)`

ou
````typescript
firstValueFrom(
  this.http.get(...)
)
````
Il faut gérer soi-même la récupération.

Avec `httpResource()` :
````
httpResource(...)
````
Angular utilise directement le pipeline HttpClient :

* Interceptors
* Authentification
* Retry
* XSRF
* Headers globaux
* Logging
* Error handling centralisé

fonctionnent automatiquement.

## Gestion de l'annulation

Les deux APIs annulent automatiquement les requêtes devenues obsolètes.

*Exemple :*
````typescript
search.set('a');
search.set('ab');
search.set('abc');
````
Angular va :
````typescript
lancer la requête "a"
annuler "a"
lancer "ab"
annuler "ab"
lancer "abc"
````
Seule la dernière réponse est conservée.

## Réactivité

Les deux APIs reposent sur les Signals.
````typescript
const category = signal('books');

const products = httpResource(() => ({
  url: '/api/products',
  params: {
    category: category()
  }
}));
````
Quand :
````
category.set('games');
````
Angular recharge automatiquement la ressource.

* Aucun `subscribe()`.
* Aucun `switchMap()`.
* Aucun `effect()` nécessaire.

## Cas où `resource()` reste préférable
**Agrégation de plusieurs sources**
````typescript
resource({
  loader: async () => {
    const [user, permissions] = await Promise.all([
      userApi.load(),
      permissionApi.load()
    ]);

    return { user, permissions };
  }
});
````
**IndexedDB**
````typescript
resource({
  loader: () => db.users.get(id())
});
````

**Firebase**
````typescript
resource({
  loader: () => getDoc(...)
});
````

**Logique métier complexe**
````typescript
resource({
  loader: async () => {
    const data = await api.load();

    return transform(data);
  }
});
````

## Cas où `httpResource()` est généralement préférable

*Pour un projet Angular moderne utilisant** :
````
HttpClient
REST API
JWT
Interceptors
Backend classique
````
`httpResource()` est généralement le meilleur choix :
````typescript
const users = httpResource(() => ({
  url: '/api/users',
  params: {
    page: page()
  }
}));
````
car :

* moins de code
* intégration native Angular
* compatible avec tous les intercepteurs existants
* gestion automatique des erreurs HTTP
* annulation automatique
* typage cohérent avec HttpClient

## `rxResource`

`rxResource` a été créé car tout l'écosystème Angular repose historiquement sur RxJS :

````
HttpClient
Router
Forms
NgRx
SignalStore
WebSocket
SSE
````

Et beaucoup de services existants exposent déjà `Observable<T>`

* `resource()` → basé sur des Promises / loaders async
* `httpResource()` → spécialisé pour HttpClient
* `rxResource()` → spécialisé pour les Observables RxJS

| API              | Source de données attendue |
| ---------------- | -------------------------- |
| `resource()`     | Promise ou fonction async  |
| `rxResource()`   | Observable                 |
| `httpResource()` | Requête HttpClient         |

Le loader retourne un Observable : 

````typescript
const user = rxResource({
  request: () => userId(),
  loader: ({ request }) =>
    this.userService.getUser(request)
});
````

où :

`getUser(id: string): Observable<User>`

## Recommandation pour un projet Angular 20+

Pour une application métier Angular moderne :

* `httpResource()` pour les appels directs REST via `HttpClient` sans aucun pipeline RxJS complexe.
* `resource()` pour toute source asynchrone non HTTP ou lorsque le chargement nécessite une orchestration complexe de plusieurs sources (logique asynchrone non RxJS, travail avec des Promises, autres api).
* `rxResource()` lorsqu'un service expose déjà des Observables, on utilise des `pipe(...), retry, combineLatest, switchMap`

Une façon simple de les voir est :

* `resource()` est l'abstraction générique.
* `httpResource()` est l'implémentation spécialisée pour le monde HttpClient Angular.
