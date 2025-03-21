[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    


[https://dev.to/luishcastroc/exploring-angular-resource-api-2bl4](https://dev.to/luishcastroc/exploring-angular-resource-api-2bl4)

## Introduction
Angular continue d'innover avec de nouvelles fonctionnalités visant à simplifier les flux de travail des développeurs et à améliorer les performances. L'une des ajouts expérimentaux les plus prometteurs est l'API Resource, conçue pour rationaliser la récupération asynchrone de données avec une réactivité intégrée.

## Pourquoi une nouvelle API Resource ?
Actuellement, les développeurs Angular s'appuient fortement sur les Observables et HttpClient pour les opérations asynchrones. Bien que puissants, les Observables peuvent introduire de la complexité, notamment dans les scénarios impliquant des mises à jour réactives, une gestion précise des erreurs ou un streaming efficace. L'API Resource expérimentale vise à résoudre ces défis en :

* Fournissant une API intuitive et simple.
* Facilitant la récupération réactive des données.
* Incluant un suivi intégré de l'état (chargement, erreur, succès).
* Améliorant les performances grâce à une réactivité plus fine.

## Interface Core Resource
L'API est centrée autour de l'interface Resource, qui encapsule la récupération réactive des données :

````typescript
interface Resource<T> {
  readonly value: Signal<T>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<Error | undefined>;
  readonly isLoading: Signal<boolean>;
  hasValue(): boolean;
}
````
* value : Contient les données réactives sous forme de Signal.
* status : Indique l'état actuel (Idle, Loading, Resolved, Error).
* error : Capture les erreurs lors des opérations de récupération.
* isLoading : Indicateur de chargement facile à utiliser.

## Création de Resources
Angular propose une fonction resource simple pour créer des ressources :

````typescript
const userResource = resource({
  request: () => userId(),
  loader: async ({ value }) => fetchUser(value),
  defaultValue: null,
});
````
* request : Entrée réactive pour la récupération.
* loader : Fonction asynchrone effectuant la récupération.
* defaultValue : Valeur initiale avant la fin de la récupération.

## HTTP Resources Spécialisées
Angular simplifie davantage la récupération HTTP avec httpResource, qui s'intègre directement avec HttpClient et supporte les motifs réactifs.

````typescript
const products = httpResource('/api/products');
````

## Fonctionnalités Avancées

* Sécurité de Type avec Validation Runtime : Intégration avec des bibliothèques comme Zod pour une sécurité de type améliorée.

````typescript
const ProductSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

const product = httpResource('/api/product', { parse: ProductSchema.parse });
````

* Streaming de Resources : Gestion des réponses en streaming.

````typescript
const streamResource = resource({
  stream: async ({ value }) => fetchStreamedData(value),
});
````

* Intégration RxJS : Les Observables existants peuvent s'intégrer facilement avec rxResource.
````typescript
const observableResource = rxResource({
  stream: param => observableService.getData(param),
});
````

## Gestion des Statuts et des Erreurs
Les ressources distinguent clairement les différents états de chargement, facilitant la gestion des erreurs dans les templates.

````typescript
enum ResourceStatus {
  Idle,
  Loading,
  Reloading,
  Resolved,
  Error,
  Local,
}
````

## Préchargement et Chargement Différé
Les ressources s'intègrent parfaitement avec le chargement différé (@defer), optimisant les performances de l'application.

````html
<button #loadBtn>Load Data</button>

@defer (on interaction(loadBtn)) {
  <data-cmp [data]="resource.value()"></data-cmp>
}
````

## Migration et Limitations
L'API est expérimentale, donc certaines fonctionnalités clés comme les mutations et le debouncing ne sont pas encore implémentées. Il est conseillé de faire preuve de prudence lors de l'adoption de cette API dans des environnements de production.

## Conclusion
L'API Resource expérimentale d'Angular offre une nouvelle direction passionnante pour la gestion des données asynchrones, en réduisant la complexité existante et en améliorant les performances. Bien qu'elle soit encore en évolution, elle mérite d'être surveillée.

L'article invite les lecteurs à participer à la discussion ou à contribuer au développement de cette fonctionnalité via l'appel à commentaires (RFC) de l'API Resource d'Angular.
