# NgRx

## Présentation Application state

Le "state" d'une application est perdu lorsqu'on redémarre / rafraichi une application web puisque ce processus entraine le vidage de la mémoire. Une des solutions pour pallier à ce problème est de créer un backend. On parle alors de "Persistent state". 

Une autre possibilité consiste à utiliser un application state.

- toutes les informations / données qui déterminent ce qui est affiché à l'écran constituent (variables dans les compos / services) => le STATE ou local state     
- les informations / données qui affectent une grande partie voir l'entièreté de l'application forment => l'application state      
- basiquement les informations qui composent le state sont portées par les services ou les composants via leurs variables      

**NgRX Redux**    
NgRx est un framework (angular + rxjs + redux) de state management pattern qui permet de ne gérer qu'un seul State central qu'on pourrait assimiler à un gros objet JSON qui contient toutes les données du state. Cet objet devient donc la seule source de vérité (le **store** -> redux). 
Les services et composants intéragissent toujours entre-eux mais recoivent les informations de ce state unique

Pour manipuler les data de ce state, les composants / services vont utiliser des **actions** ayant un **type** et un **payload** (optionel). L'action va ensuite contacter le **reducer** (fonction js) qui va lui, contacter le store et effectuer l'opération de modification du state de manière immutable (en travaillant sur une copie du state) et va renvoyer un nouveau state

### ce qui ne doit pas etre inlut dans le store 
* état non partagé avec d'autres composants. si un service n'est utile qu'a un seul compo, ce n'est pas la peine de le gerer avec ngrx      
* état d'un formulaire angular    
* objet complexes difficilement modifiables     

## Utilisation

### Installation

````npm i --save @ngrx/store````
### Sample

https://github.com/gsoulie/angular-resources/tree/master/ngrx      
