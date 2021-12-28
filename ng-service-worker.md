[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Service Workers - Web workers

* [Web worker](#web-worker)     
* [Service worker](#service-worker)      

## Ressources

https://blog.bitsrc.io/angular-performance-web-workers-df382c4d3919      
https://www.youtube.com/watch?v=snnEgzg4-1o&ab_channel=DevTheory     
https://www.youtube.com/watch?v=nC-ZL5albhw&ab_channel=HackagesLearning      
https://www.youtube.com/watch?v=5YtNQJQu31Y&ab_channel=Academind      

## Généralités

Le code javascript d'une application web s'exécute dans un thread unique, attaché à une page html. Ceci implique qu'un traitement lourd (calcul de nombres premiers par exemple)
peut  bloquer ce thread et rendre l'application figée.

Les *workers* permettent de pallier ce problème. En effet les services workers fournissent un second thread séparé du thread javascript principal et décorellé des pages html.

### Service worker vs Web worker

Les **web workers** sont utilisés pour traiter de lourds calculs (traitement images, calcul mathématiques complexes...) en dehors du thread principal, afin de ne pas bloquer ce dernier.
Ils communiquent avec le thread principal via *Web worker API* en créant un objet **Worker** qui va pouvoir communiquer via la méthode **postMessage** pour l'envoi de données
depuis le worker vers le thread principal **main.js** et via la callback **onmessage** pour écouter le retour du worker depuis le thread principal.

Les **Services workers** sont un autre type de worker, dont l'objectif principal est d'être un "proxy" entre le browser et le réseau/cache.

Les services workers sont donc très pratiques pour gérer (mettre en cache): 

* assets (images + fonts + css)     
* traitements de script     
* données provenant d'API      

## Web Worker

### Installation

````ng g web-worker app````

Va générer un fichier *app.worker.ts* dans *src/app*

### Utilisation

*app.component.ts*

````typescript

// Create worker
const myWorker = new Worker('worker.js');	// starting worker thread

// Send message to worker
myWorker.postMessage('Hello!');

// Receive message from worker
myWorker.onmessage = function(e) {
  console.log(e.data);
}
````

*app.worker.ts*

````typescript
// Receive message from main file
self.onmessage = function(e) {
  console.log(e.data);

  // Send message to main file
  self.postMessage(workerResult);
}
````

## Service Worker
[Back to top](#service-workers---web-workers)    

### Installation

````ng add @angular/pwa````

Ceci va engendrer la création / modification des éléments suivants :
* ngsw-config.json      
* src/manifest.webmanifest      
* src/assets/icons/icon-xxxxxx.png       
* index.html      
* angular.json ````"serviceWorker": true````     
* app.module.ts    
* package.json     

> **Par défaut**, le service worker n'est activé qu'en mode *production* (voir détail dans *app.module.ts* et *angular.json*). 
Le fichier *ngsw-worker.js* sera généré dans le répertoire *dist* uniquement après compilation en mode production.

### Configuration ngsw-config.json

Le noeud *assetsGroups* est utilisé pour mettre en cache les ressources statiques

"installMode": "prefetch", // charge les données même si on en a pas encore besoin
"installMode": "lazy", // charge les données au moment où l'on en a besoin

#### mise en cache font google

Dans le cas de l'utilisation d'une font google ou autre via une url, ajouter l'url de la font dans le fichier *ngsw-config.json*

````typescript
"assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ],
        "urls": [	// <-- liste des urls à mettre en cache
		  "https://fonts.gstatic.com",
          "https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@300&family=Pacifico&display=swap"
        ]
      }
    },
````

#### mise en cache données statiques (api)

Ajouter un noeud *dataGroups* pour gérer la mise en cache des données dynamiques

````typescript
"dataGroups": [
    {
      "name": "jsonplaceholder-posts",
      "urls": [
        "https://jsonplaceholder.typicode.com/posts"
      ],
      "version": 1,
      "cacheConfig": {
        "maxAge": "1d", // durée de conservation en cache (ex : 1d, 12h, 50m...) voir documentation officielle pour les unités
        "maxSize" : 100, // nombre d'entrées à garder en cache
        "timeout": "10s", // durée d'attente de la réponse du serveur avant de basculer sur le chargement des données en cache
	"strategy": "freshness" // toujours récupérer les données du backend en premier et si on est offline chercher les données en cache
	//"strategy": "performance" // cache-first, cherche à afficher des données le plus vite possible. Prend en compte le maxAge
      }
    }
  ]
````

[Back to top](#service-workers---web-workers)    