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

> **!!! ATTENTION !!!** lors de la destruction d'un composant auquel est rattaché un worker, ce dernier n'est pas détruit et continue de tourner !! Il est donc impératif à minima de stopper le worker dans le ````ngOnDestroy```` du composant associé à moins qu'il soit vraiment indispensable de laisser tourner le worker

[Back to top](#service-workers---web-workers)    

## Service Worker

[Tutorial Academind](https://www.youtube.com/watch?v=5YtNQJQu31Y&ab_channel=Academind)      

Le service worker s'exécute dans un thread différent du thread principal JS et il est découplé des pages html lui permettant ainsi de s'exécuter en arrière plan de manière autonome.

Il permet entre autre d'écouter les requêtes http sortantes et de mettre en cache les réponses afin de les restituer en cas de perte de connexion.

Il agit comme un proxy entre le front et le backend

### Installation

````ng add @angular/pwa````

Ceci va engendrer la création / modification des éléments suivants :
* ngsw-config.json : configuration du service worker     
* src/manifest.webmanifest : paramétrage couleur et icônes de l'application     
* src/assets/icons/icon-xxxxxx.png       
* index.html      
* angular.json ````"serviceWorker": true````     
* app.module.ts    
* package.json     

### Important
**Par défaut**, le service worker n'est activé qu'en mode **production** (voir détail dans *app.module.ts* et *angular.json*). 
Le fichier *ngsw-worker.js* sera généré dans le répertoire *dist* uniquement après compilation en mode production.

Pour tester son fonctionnement il faut donc compiler en mode production et faire un serve depuis le répertoire *dist* ou *www* 

### Configuration ngsw-config.json

Le noeud *assetsGroups* est utilisé pour mettre en cache les ressources statiques

````"installMode": "prefetch",```` **// Met en cache les ressources même si on en a pas encore besoin. Conseillé pour les ressources importantes**        
````"installMode": "lazy",```` **// Met en cache uniquement les ressources pour lesquelles on a reçu une requête. Conseillé pour les ressources moins importantes**

### Configuration du *web.config*

Rajouter la ligne suivante pour éviter une erreur 404 lors du chargement du fichier *manifest.webmanifest*

````html
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <mimeMap fileExtension=".webmanifest" mimeType="application/json" />
        </staticContent>
     </system.webServer>
</configuration>
````

### Tester le fonctionnement

compiler le projet en mode production puis se positionner dans le répertoire *dist/<nom_app>* et lancer un serveur ````http-server -p 8080````

Charger les données de l'application en utilisation normale puis se rendre dans l'onglet *Application -> Service Workers* de chrome et passer le 
service en mode *Offline*.

Recharger la page, les données devraient maintenant être chargées depuis le service worker (voir onglet Network)

> Attention : couper la connexion internet ou passer en mode Offline depuis l'onglet network va rendre la récupération des data en échec. Cependant 
l'application ne présentera pas une page 404 mais bien la page attendue avec son contenu statique affiché.

*app.module.ts*

````typescript
 imports: [
    
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      scope: './'
    })
  ],
````

### Configuration de la mise en cache

Dans le cas de l'utilisation d'une font google ou autre via une url, ajouter l'url de la font dans le fichier *ngsw-config.json*

````typescript
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",	// root page que l'on souhaite mettre en cache
  "assetGroups": [	// détermine quels données STATIQUES doivent être mises en cache
    {
      "name": "app",
      "installMode": "prefetch",	// prefetch = seront mis en cache même s'ils ne sont pas utilisés
      "resources": {
        "files": [	// fichiers à mettre en cache
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ],
	"urls": [	// données provenant d'url externes
	    "https://fonts.gstatic.com/**",	// obligatoire pour les fonts google
	    "https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swa"	//google font par ex
	]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",	// quand on déploie une nouvelle version de l'application
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [	// donnés DYNAMIQUES
	{
		"name": "jsonPlaceHolderPosts",	// <-- naming au choix
		"urls": [
			"https://jsonplaceholder.typicode.com/posts"
		],
		"cacheConfig": {
			"maxSize": 10, // combien de réponses d'api on souhaite garder en cache
			"maxAge": "2d", // combien de temps on souhaite conserver les données
			"timeout": "10s", // durée d'attente de la réponse du serveur avant de basculer sur le chargement des données en cache
			"strategy": "freshness" // toujours récupérer les données du backend en premier et si on est offline chercher les données en cache
			//"strategy": "performance" // cache-first, cherche à afficher des données le plus vite possible. Prend en compte le maxAge
		}
		//"version": 2
	}
  ]
}
````

[Back to top](#service-workers---web-workers)    
