[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Optimisations

## Général
- Virtual scroll
- Pagination
- Render à la demande


## Optimisation lancement application
[Back to top](#optimisations) 

1 - lazy loading
ne charger que les routes nécessaires au démarrage

2 - server side rendering
faire une capture de la page côté backend et l'envoyer au client, pendant ce temps là, angular charge le reste.
C'est juste une capture, le client ne peut pas intérragir. C'est juste en attendant.
cf : https://angular.io/guide/universal

## zone.js
[Back to top](#optimisations) 

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


**ATTENTION : la stratégie OnPush ne fonctionne pas de base avec tous les traitement asynchrone (timer, timeout, promise, observable...). Il faut donc penser à forcer manuellement le rafraichissement ou le cas échéant utiliser le pipe async qui gère tout seul le rafraichissement)**

### Detacher - Réattacher 

On peut aussi manuellement désactiver / réactiver l'écoute des zones pour un composant avec :

````typescript
this.cd.detach();	// ne sera plus mis à jour
this.cd.reattach();	// se remet à jour
````

## Optimisation JS
[Back to top](#optimisations)

### JSON parse vs litteral

https://www.youtube.com/watch?v=h34Dbdl9twc&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&ab_channel=DevTheory

*exemple*
````typescript
const data1 = { foo: 42, bar: 13 };

const data2 = JSON.parse('{ "foo": 42, "bar": 13 }'); // jusqu'à 2x plus rapide suivant le navigateur
````

> Remarque : la différence est surtout effective sur de très gros objets. Dans l'exemple ci-dessus, le gain est négligeable

### Memoization

https://whatthefork.is/memoization
https://www.youtube.com/watch?v=jmnI7PKsCVQ&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&index=2&ab_channel=DevTheory

### Animation au scroll
https://www.youtube.com/watch?v=x0Dvpu2jcUo&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&index=3&ab_channel=DevTheory

méthode plus performante pour déclencher des éléments lors d'un scroll (exemple dpage web bootstrap avec des animations lors du scroll qui font apparaître des éléments) SANS utiliser l'event scroll mais le IntersectionObserver qui est plus performant et très simple d'utilisation

[Back to top](#optimisations)
