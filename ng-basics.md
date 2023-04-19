[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Notions de base   

* [Event loop](#event-loop-javascript)     
* [Webpack](#webpack)      
* [Fonctionnement webpack et optimisations](https://christianlydemann.com/the-complete-guide-to-angular-load-time-optimization/)     
* [Rendering](#rendering)     

## Event loop Javascript

> Important: JS est **single thread**

<img src="https://github.com/gsoulie/angular-resources/blob/master/js.png" align="center" width="600">

JavaScript gère la concurrence grâce à une « boucle d'événements ».

- **File (Queue)** : contient tous les messages (instructions à jouer : fonctions, événements etc...). Exemple : si on clique 5 fois sur un bouton, on aura 5 messages dans la File en attente d'exécution par la pile.    
- **Pile (Stack)** taille finie : contient toutes les instructions à exécuter / en cours d'exécution    
- **Tas (Heap)** : zone mémoire utilisée pour faire fonctionner les instructions. La heap est gérée par le garbage collector      
- **Mono thread** : JS ne peut pas exécuter de tâches en parallèlle. Chaque message sera traité complètement avant tout autre message. Cela permet de savoir que, lorsqu'une fonction s'exécute, on ne peut pas observer l'exécution d'un autre code qui prendrait le pas      

**Quand la stack est vide ou possède suffisamment de place, l'event loop y ajoute les instructions suivantes provenant de la queue**

**Note :** un web worker possède sa propre heap, sa propre pile et sa propre stack

## Cycle de vie du projet

Les 3 fichiers principaux pour créer une appli angular

- **main.ts** permet de définir le type d'application (mobile, web, ...). Ensuite il appelle le module racine (AppModule)      
- **app.module.ts** => déclare tous les composants/directive/pipe/services de l'appli      
- **app.component.ts** => c'est le bootstrap component      

## Cycle de vie d'un composant

| Order   |
|----------|
|constructor|
|ngOnChanges|
|ngOnInit|
|ngDoCheck|
|ngAfterContentInit|
|ngAfterContentChecked|
|ngAfterViewInit|
|ngAfterViewChecked|

## ngModel
[Back to top](#notions-de-base)   

| Name | Description |
| --- | --- |
| ngModel | Bind element to formControl | 
| [ngModel] | Simple-way binding (i.e. property binding) | 
| [(ngModel)] | Two-way binding | 

[Back to top](#notions-de-base)

## ViewEncapsulation et Shadow DOM

https://medium.com/@simonb90/comprendre-la-viewencapsulation-dans-un-component-angular-83decae8f092      

*Vous pouvez considérer le Shadow DOM comme un “DOM dans un DOM”. C'est son propre arbre DOM isolé avec ses propres éléments et styles, complètement isolé du DOM original. A noter qu'un shadow dom est toujours rattaché à un élément du DOM (ex : <input type="range"> tout le shadow DOM qui découle du composant range est rattaché à l'élément <input> du DOM)*


## Webpack

https://blog.neolynk.fr/2019/11/20/a-quoi-sert-webpack-et-comment-fonctionne-t-il/

Webpack est un outil de compilation, sont but est de prendre tous les fichiers du projet est d'en faire un bundle utilisable dans le browser

## Rendering

````mermaid
flowchart TD
  A[Rendering] --> B[Where ?];
  B[Where ?] --> C[Browser];
  C[Browser] --> D[Client-Side Rendering CSR];
  B[Where ?] --> E[Server];
  E[Server] --> F[When ?];
  F[When ?] --> G[At build time];
  G[At build time] --> H[Prerendering / Static Site Generation SSG];
  F[When ?] --> I[With a client request];
  I[With a client request] --> J[Server-Side Rendering SSR];
````
