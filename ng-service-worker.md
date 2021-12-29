[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Service Workers - Web workers

* [Web worker](#web-worker)     
* [Service worker](#service-worker)      

## Ressources

https://blog.bitsrc.io/angular-performance-web-workers-df382c4d3919      
https://www.youtube.com/watch?v=snnEgzg4-1o&ab_channel=DevTheory     
https://www.youtube.com/watch?v=nC-ZL5albhw&ab_channel=HackagesLearning      

## Alertes

Vérifier support *web workers* sous **safari**

## Généralités

Le code javascript d'une application web s'exécute dans un thread unique, attaché à une page html. Ceci implique qu'un traitement lourd (calcul de nombres premiers par exemple)
peut  bloquer ce thread et rendre l'application figée.

Les *workers* fournissent des threads séparés du thread javascript principal (ils ont leur propre heap, stack et queue) et décorellés des pages html, permettant ainsi de **réaliser des traitements en tâche de fond sans interférer avec le thread principal**

### Service worker vs Web worker

Les **web workers** sont utilisés pour **traiter de lourds calculs** (traitement images, calcul mathématiques complexes, encryptage de données...) **en arrière-plan du thread principal**, afin de ne pas bloquer ce dernier.
Ils communiquent avec le thread principal via *Web worker API* en créant un objet **Worker** qui va pouvoir communiquer via la méthode **postMessage** pour l'envoi de données
depuis le worker vers le thread principal **main.js** et via la callback **onmessage** pour écouter le retour du worker depuis le thread principal.

A noter qu'ils n'ont pas accès au DOM.

Les **Services workers** sont un autre type de worker, dont l'objectif principal est de jouer un rôle de "proxy" entre le browser et le réseau/cache et ainsi permettre une expérience utilisateur même en étant hors-ligne.

Les services workers sont donc très utiles pour gérer la mise en cache d'information et permettre le mode hors-ligne : 

* assets (images + fonts + css)     
* traitements de script     
* données provenant d'API     

#### En résumé

|| Web Workers  | Service Workers  |
|-|-|-|
| Instances    | Plusieurs par composant | Une pour tous |
| Durée de vie     | La même que le composant  | Indépendante      |
| Utilisation | Parallelisation  | support Offline  |

## Web Worker

### Création

````ng g web-worker <WebWorker-name>````

### Utilisation

````ng g web-worker WebWorker````

Va générer un fichier *app.webWorker.ts* dans *src/app*

*app.component.ts*

````typescript
export class App implements OnInit{
    private number
    private output
    private webworker: Worker
    
    ngOnInit() {
        if(typeof Worker !== 'undefined') {
            this.webWorker = new Worker('./webWorker')	// create worker 
	    //const myWorker = new Worker('worker.js');	// starting worker thread
            this.webWorker.onmessage = function(data) {
                this.output = data
            }
        }
    }
    calcFib() {
        this.webWorker.postMessage(this.number)
    }
}
````

*app.worker.ts*

````typescript
function fibonacci(num) {
    if (num == 1 || num == 2) {
        return 1
    }
    return fibonacci(num - 1) + fibonacci(num - 2)
}

// Receive message from main file
self.addEventListener('message', (evt) => {
    const num = evt.data
    // Send message to main file
    postMessage(fibonacci(num))
})
````

### Destruction

S'il y a besoin de stopper l'exécution du web worker depuis le thread principal, il suffit d'exécuter la commande ````webWorker.terminate();````

> **!!! ATTENTION !!!** lors de la destruction d'un composant auquel est rattaché un worker, ce dernier n'est pas détruit et continue de tourner !! Il est donc imératif à minima de stopper le worker dans le ````ngOnDestroy```` du composant associé à moins qu'il soit vraiment indispensable de laisser tourner le worker

## Service Worker
[Back to top](#service-workers---web-workers)    

[Tutorial Academind](https://www.youtube.com/watch?v=5YtNQJQu31Y&ab_channel=Academind)      

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

Imaginons qu'une application utilise l'api jsonplaceholder pour lister des posts : 

*home.component.html*
````
 ngOnInit(): void {
    this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')
    .subscribe(res => this.posts = res);
  }
````

Pour pouvoir mettre en cache les résultats de l'api, ajouter un noeud **dataGroups** dans le fichier *ngsw-config.json* pour gérer la mise en cache des données dynamiques

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
