[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Optimisations & Numérique Responsable

* [Bonnes pratiques](#bonnes-pratiques)     
* [Optimisation lancement application](#optimisation-lancement-application)     
* [Zone.js](#zone.js)     
* [Optimisations js](#optimisations-js)      
* [Optimisation font](#optimisation-font)      
* [Analyse du bundle](#analyse-du-bundle)       

## Bonnes pratiques

Quelques bonnes pratiques pour optimiser le code Angular / Ionic

* Maintenir à jour son CLI / RxJS 6 (2021)
* Respecter le principe de responsabilité unique pour chaque fonction, service, composant    
* Utilisation d'un interceptor http pour gérer les entête de requête / codes erreurs    
* Depuis Angular 13, vérifier que le répertoire **.angular/cache** est bien ajouté au fichier *.gitignore* ````/.angular/cache````       
* Sous Angular 14, utiliser les composants en mode standalone     
* Auditer chaque page de l'application via **lighthouse** depuis la console chrome. **Attention !** l'audit de *performance* ne sera cohérent que s'il est réalisé sur le projet compilé et hosté en local ou sur un serveur (voir ici : [tester le bundle compilé](https://github.com/gsoulie/angular-resources/blob/master/ng-unit-test.md#tester-le-bundle-g%C3%A9n%C3%A9r%C3%A9-dans-le-r%C3%A9pertoire-dist)    ). L'audit d'accessibilité, lui, peut-être directement réalisé en mode *serve* classique
* Lazy load des composants dans le fichier routing : ````loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)```` et ne pas importer les modules lazy-loadé dans les fichiers *app.module.ts* car ils seraient alors chargés 2 fois !
* Utiliser la strategy **ChangeDetectionStrategy.OnPush** pour gagner en performance    
* Utilisation du package **a11y** pour l'accessibilité     
* Supprimer les effets d'animation de transition des pages 
* Utilisation de fonts standard
* privilégier le format de font **WOFF2**
* Faire la chasse au fonts non utilisées      
* Utiliser l'attribut ````font-display: swap```` dans les ````@font-face````  
* Rendu à la demande avec Angular Universal     
* Utilisation du Virtual scroll    
* Utiliser en priorité les **pipe** dans la vue lorsqu'il s'agit de mettre en forme du contenu plutôt que de passer par des fonctions    
* Implémenter un service unsubscriber pour se désabonner automatiquement des observables     
* Utiliser au maximum les pipe ````async````   
* Observable ````pipe(take(1))```` ou conversion en promise lorsqu'un observable n'est pas nécessaire
* Systématiquement ````unsubscribe```` chaque souscription à un observable
* Utiliser des images JPEG (compressées avec TinyPNG par ex...) et SVG
* Compiler en aot (ahead-of-time) => par défaut en mode prod. Sinon build en mode JIT
* Configurer les app Angular comme des PWA : ````ng add @angular/pwa && ng build — prod````. Et configurer le service worker pour mettre certaines ressources en cache (assets/fonts)    
* Limiter le nombre de module tiers utilisés. Utiliser autant que possible ce qui est faisable directement en JS ou Angular
* Supprimer tous les ````console.log```` avant de mettre en prod => peut causer des memory leak => ajouter le code suivant dans le fichier **main.ts** pour faire simple :
 ````typescript
 if (environment.production) {
  window.console.log = () => {};
}
````
* Utiliser la fonction **TrackBy** dans les boucle **ngFor**. Permet de créer un index sur chaque item et évite de recréer complètement la liste lors d'un ajout/modification/suppression d'un item   

````html
<mat-item *ngFor="let u of users; tackBy: trackUserId">{{ user.name }}</mat-item>
````
````typescript
users: any[] = [...]
trackUserId(index, user) { return user.id }
````

## Optimisation lancement application
[Back to top](#optimisations--numérique-responsable) 

1 - lazy loading
ne charger que les routes nécessaires au démarrage

2 - server side rendering
faire une capture de la page côté backend et l'envoyer au client, pendant ce temps là, angular charge le reste.
C'est juste une capture, le client ne peut pas intérragir. C'est juste en attendant.
cf : https://angular.io/guide/universal

## zone.js
[Back to top](#optimisations--numérique-responsable) 

[Très bonne explication ici](https://www.youtube.com/watch?v=SEyaCR7NYXg&ab_channel=YounessHoudass)      

Un changeDetector par composant. Il gère pour chacun les 3 zones à écouter (events, timers, network).
Par défaut, Angular écoûte les 3 zones de chacun en permanence.

zone *Event* : événement utilisateur (click, entrée clavier etc...)
zone *Timers* : setTimeout() et setInterval()
zone *Network*: Appel http

**BONNE PRATIQUE** mettre tous les composants en mode *OnPush()* c'est un gain d'optimisation important.
Il va faloir ensuite provoquer la mise à jour de la vue à la main.
Ajouter dans le code suivant 
````typescript
@Component{
	changeDetection: ChangeDetectionStrategy.OnPush;	// il ne va écouter QUE la zone event
}
````

Ce mode est **hérité par tous les enfants**. Car le changeDetector hérite de la stratégie du père.
Donc il suffit de le déclarer dans le père et il n'y aura pas besoin de le déclarer dans les enfants

Le mode OnPush est utilisé pour écouter la zone Event uniquement. Le mode Default écoute toutes les zones.

Pour forcer le déclenchement à la main il faudra utiliser 

````typescript
constructor(private ref: ChangeDetectorRef) {

	setInterval(() => {
		this.increase ++;
		this.ref.markForCheck(); // demande à Angular de forcer le refresh. Il le fera quand il aura un peu de temps et met à jour toute la branche concernée (père et tous les enfants)
	}, 1000);

}
````

On peut aussi utiliser 
````this.ref.detectChanges(); // force le refresh maintenant lors de l'appel et ne met à jour que le compo actif et ses enfants````

Le **markForCheck** est un markage. On dit à ANgular, quand tu as le temps, rafraichi toute la branche (du père au dernier fils)

Le **detectChanges** est instantané, on force Angular à rafraichir tout de suite le composant en cours et ses enfants.

L'utilisation de l'un ou l'autre est à voir au cas par cas mais de manière générale, préférer le markForCheck qui est moins violent car c'est Angular qui le gère.


**ATTENTION : la stratégie OnPush ne fonctionne pas de base avec tous les traitement asynchrone (timer, timeout, promise, observable...). Il faut donc penser à forcer manuellement le rafraichissement ou le cas échéant utiliser le pipe async qui gère tout seul le rafraichissement en appelant lui même changeDetectorRef**

### Detacher - Réattacher 

On peut aussi manuellement désactiver / réactiver l'écoute des zones pour un composant avec :

````typescript
this.cd.detach();	// ne sera plus mis à jour
this.cd.reattach();	// se remet à jour
````
[Back to top](#optimisations--numérique-responsable) 

## Optimisations JS

### JSON parse vs litteral

https://www.youtube.com/watch?v=h34Dbdl9twc&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&ab_channel=DevTheory

*exemple*
````typescript
const data1 = { foo: 42, bar: 13 };

const data2 = JSON.parse('{ "foo": 42, "bar": 13 }'); // jusqu'à 2x plus rapide suivant le navigateur
````

> Remarque : la différence est surtout effective sur de très gros objets. Dans l'exemple ci-dessus, le gain est négligeable

[Back to top](#optimisations--numérique-responsable) 

### Memoization

https://whatthefork.is/memoization
https://www.youtube.com/watch?v=jmnI7PKsCVQ&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&index=2&ab_channel=DevTheory

### Animation au scroll
https://www.youtube.com/watch?v=x0Dvpu2jcUo&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&index=3&ab_channel=DevTheory

méthode plus performante pour déclencher des éléments lors d'un scroll (exemple dpage web bootstrap avec des animations lors du scroll qui font apparaître des éléments) SANS utiliser l'event scroll mais le IntersectionObserver qui est plus performant et très simple d'utilisation

[Back to top](#optimisations--numérique-responsable) 

## Optimisation font

Afin de limiter l'impact du chargement des fonts est d'utiliser ````font-display : swap```` sur votre police CSS. Cela indiquera au navigateur d'utiliser une police système comme espace réservé si la police n'est pas encore téléchargée et de la remplacer par la vraie police une fois qu'elle est prête.

[Back to top](#optimisations--numérique-responsable) 

## Analyse du bundle

Analyser le bundle généré par la compilation permet de contrôler la taille de ce dernier. En effet, cette analyse peut permettre de détecter
des dépendances trop volumineuses voir inutiles.

### Solution *source-map-explorer*

**Installation**
````npm i source-map-explorer````

**configuration Angular**

*tsconfig.json*
````typescript
compilerOptions: {
	"sourceMap": true
}
````

*commandes*
````
ng build --configuration=production --source-map
source-map-explorer dist/<app-name>/*.js
````

### Solution *webpack-bundle-analyzer*

**configuration Vue**

*vue.config.js*
````typescript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
    module.exports = {
        configureWebpack: {
            plugins: [new BundleAnalyzerPlugin()]
        }
   };
````

Une fois installé et configuré, il suffit de relancer une compilation du projet. Un browser va alors s'ouvrir présentant ainsi la carte détaillée du bundle

[Back to top](#optimisations--numérique-responsable) 
