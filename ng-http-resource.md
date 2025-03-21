[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

Angular v19.2 a introduit une fonction dédiée (et **expérimentale**) pour créer des ressources utilisant des requêtes HTTP : ````httpResource()```` dans le package @angular/common/http.

Cette fonction utilise ````HttpClient```` en interne, permettant d'utiliser les intercepteurs, utilitaires de test, etc. habituels.

### Introduction

httpResource est une nouvelle fonction introduite pour faciliter la récupération de données HTTP de manière réactive. Elle s'intègre parfaitement avec le système de signaux d'Angular, permettant une gestion automatique des états de chargement, des erreurs et des mises à jour réactives

### Fonctionnement

* Par défaut, httpResource suppose que le serveur renvoie des données au format JSON. Il est possible de spécifier un type pour la réponse afin de récupérer directement un objet typé.

* La fonction httpResource crée une ressource qui effectue une requête HTTP GET vers une URL donnée. Elle expose l'état de la requête et la valeur de la réponse sous forme de WritableResource, facilitant ainsi la gestion réactive des données3.
````typescript
function httpResource<TResult = unknown>(
  url: string | (() => string | undefined),
  options?: HttpResourceOptions<TResult, unknown> | undefined
): HttpResourceRef<TResult | undefined>;
````
### Avantages

* **Réduction de la Complexité** : Contrairement à l'utilisation traditionnelle de HttpClient, qui nécessite une gestion manuelle des états de chargement, des erreurs et des mises à jour réactives, httpResource automatise ces tâches, réduisant ainsi le code boilerplate et améliorant la cohérence.
* **Intégration avec les Signaux** : En passant des signaux dans le paramètre URL, httpResource exécute automatiquement une requête HTTP chaque fois que la valeur des signaux change, assurant ainsi que les données les plus récentes sont toujours récupérées.
  
### Limitations

httpResource est **principalement conçu pour la récupération de données et non pour l'envoi de données au serveur**. Bien qu'il soit possible de définir des méthodes HTTP autres que GET, comme POST, httpResource n'est pas adapté pour écrire des données sur le serveur5.

### Utilisation de base
L'utilisation la plus simple consiste à appeler cette fonction avec l'URL depuis laquelle vous souhaitez récupérer des données :

````typescript
readonly usersResource = httpResource<Array<UserModel>>('/users');
````

````httpResource()```` renvoie un ````HttpResourceRef```` avec les mêmes propriétés que ````ResourceRef````, le type renvoyé par ````resource()````, puisqu'il est construit par-dessus :

|paramètre|description|
|-|-|
|value|un signal contenant le corps de la réponse JSON désérialisée.|
|status|un signal contenant le statut de la ressource (inactif, chargement, erreur, résolu, etc.).|
|error|un signal contenant l'erreur si la requête échoue.|
|isLoading|un signal indiquant si la ressource est en cours de chargement.|
|reload()|une méthode permettant de recharger la ressource.|
|update() et set()|des méthodes permettant de changer la valeur de la ressource.|
|asReadonly()|une méthode permettant d'obtenir une version en lecture seule de la ressource.|
|hasValue()|une méthode permettant de savoir si la ressource a une valeur.|
|destroy()|une méthode permettant d'arrêter la ressource.|

Elle contient également quelques propriétés spécifiques aux ressources HTTP :

|paramètre|description|
|-|-|
|statusCode|un signal contenant le code de statut de la réponse sous forme de number.|
|headers|un signal contenant les en-têtes de la réponse sous forme de HttpHeaders.|
|progress|un signal contenant la progression du téléchargement de la réponse sous forme de HttpProgressEvent.|
 
### Ressources réactives
Il est également possible de définir une ressource réactive en utilisant une fonction qui retourne la requête en tant que paramètre. Si la fonction utilise un signal, la ressource se rechargera automatiquement lorsque le signal change :

````typescript
readonly sortOrder = signal<'asc' | 'desc'>('asc');
readonly sortedUsersResource = httpResource<Array<UserModel>>(() => `/users?sort=${this.sortOrder()}`);
````

Lors de l'utilisation d'une requête réactive, la ressource se rechargera automatiquement lorsqu'un signal utilisé dans la requête change. Si vous souhaitez ignorer le rechargement, vous pouvez retourner ````undefined```` depuis la fonction de requête (comme pour resource()).

### Contrôle avancé des requêtes
Pour un contrôle plus précis de la requête, vous pouvez également passer un objet HttpResourceRequest à la fonction ````httpResource()````, ou une fonction qui retourne un objet ````HttpResourceRequest```` si vous souhaitez rendre la requête réactive.

Cet objet doit avoir une propriété url et peut avoir d'autres options comme method (GET par défaut), params, headers, reportProgress, etc. Si vous souhaitez rendre la requête réactive, vous pouvez utiliser des signaux dans les propriétés url, params ou headers.

*Exemple :*

````typescript
readonly sortedUsersResource = httpResource<Array<UserModel>>(() => ({
  url: `/users`,
  params: { sort: this.sortOrder() },
  headers: new HttpHeaders({ 'X-Custom-Header': this.customHeader() })
}));
````

Vous pouvez également envoyer un corps avec la requête, par exemple pour une requête POST/PUT, en utilisant la propriété body de l'objet de requête.

### Autres options
Dans ces options, vous pouvez également définir :

* ````defaultValue```` : une valeur par défaut de la ressource, à utiliser lorsqu'elle est inactive, en cours de chargement ou en erreur.
* une fonction equal qui définit l'égalité de deux valeurs.
* une fonction map qui permet de transformer la réponse avant de la définir dans la ressource.

Il est également possible de demander autre chose que du JSON, en utilisant les fonctions httpResource.text(), httpResource.blob() ou httpResource.arrayBuffer().
