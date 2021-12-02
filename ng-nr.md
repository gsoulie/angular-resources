[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Numérique Responsable

Quelques bonnes pratiques pour optimiser le code Angular / Ionic

* Maintenir à jour son CLI / RxJS 6 (2021)
* Lazy load des composants dans le fichier routing : ````loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)````
* Supprimer les effets d'animation de transition des pages 
* Utilisation de fonts standard
* privilégier le format de font WOFF2
* Faire la chasse au fonts non utilisés
* Observable ````pipe(first)```` ou conversion en promise lorsqu'un observable n'est pas nécessaire
* Systématiquement ````unsubscribe```` chaque souscription à un observable
* Utiliser des images JPEG (compressées avec TinyPNG par ex...) et SVG
* Compiler en aot (ahead-of-time) : par défaut en mode prod. Sinon build en mode JIT
* Configurer les app Angular comme des PWA : ````ng add @angular/pwa && ng build — prod````. Et configurer le service worker pour mettre certaines ressources en cache
* Limiter le nombre de module tiers utilisés. utiliser autant que possible ce qui est faisable directement en JS ou Angular
* Supprimer tous les console.log avant de mettre en prod => peut causer des memory leak
* Utiliser la fonction **TrackBy** dans les boucle **ngFor**. Permet de créer un index sur chaque item et évite de recréer complètement la liste lors d'un ajout/modification/suppression d'un item   

````html
<mat-item *ngFor="let u of users; tackBy: trackUserId">{{ user.name }}</mat-item>
````
````typescript
users: any[] = [...]
trackUserId(index, user) { return user.id }
````

[Back to top](#numérique-responsable)
