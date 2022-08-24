[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Bonnes pratiques et NR

* [Input ou Service ?](#input-ou-service-?)      
* [Workflow complet](#workflow-complet)      
* [Model Adapter Pattern](#model-adapter-pattern)     
* [Blocs conditionnels](#blocs-conditionnels)        
* [Pipe](#pipe)      
* [Numérique Responsable](https://github.com/gsoulie/angular-resources/blob/master/ng-nr.md)      
* [Unsubscriber](#unsubscriber)     
* [Optimisations](https://github.com/gsoulie/angular-resources/blob/master/ng-optimization.md)     

## Input ou Service ?

Passer des données à un composant peut se faire de plusieurs manières. Les plus courantes sont le passage via *@Input / @Ouput* ou via un service.

Pour connaître la meilleur solution à adopter, il est recommandé de préférer l'utilisation d'un service dans le cas d'un composant "parent" c'est à dire un composant qui contient des "enfants". Et utiliser les *@Input() / @Output()* dans le cas d'un composant "enfant".

De cette façon on évite d'avoir des chaînes interminables de *@Input() / @Output()* qui transportent des paramètres d'un bout à l'autre de la chaîne.

## Workflow complet

Workflow complet TDD, Dev, PR, Ci/CD

https://eliteionic.com/tutorials/simple-project-management-workflow-for-ionic-developers/        
https://www.youtube.com/watch?v=CdsJrIpGWSg&ab_channel=JoshuaMorony


## Model Adapter Pattern

Utiliser au maximum la technique du [adapter pattern](https://github.com/gsoulie/angular-resources/blob/master/ng-adapter-pattern.md) pour gagner en maintenabilité

## Blocs conditionnels

Il est bien d'encadrer les blocs conditionnels *ngIf* avec des **ng-content**

````
<ng-container *ngIf="requestLoading">
     <app-loading></app-loading>
</ng-container>

<ng-container *ngIf="!requestLoading">
     <button type="submit" *ngIf="!isEdit" [disabled]="!formTicket.valid" (click)="create()">Créer</button>
     <button type="submit" *ngIf="isEdit" [disabled]="!formTicket.valid" (click)="edit()">Editer</button>
</ng-container>
````

## Pipe
[Back to top](#bonnes-pratiques-et-nr)     

Tout traitement qui modifie la vue doit préférablement utiliser les pipes plutôt qu'une méthode. Les pipes sont très optimisés et offrent un gain de performance énorme.

## Unsubscriber

Utiliser un service "Unsubscriber" permettant de gérer les désabonnements aux observables via un service générique qui sera étendu par tous les composants 

*unsubscriber.service.ts*

````typescript
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Unsubscriber implements OnDestroy {

  private subscription$: Subscription = new Subscription();
  constructor() {}

  set anotherSubscription(sub: Subscription) {
    this.subscription$.add(sub);
  }

  ngOnDestroy(): void {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

  addSubscription(sub: Subscription): void {
    this.subscription$.add(sub);
  }

  protected resetSubscriptions() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }
}
````

Appel depuis un composant :

````typescript
export class ControlsPage extends Unsubscriber implements OnInit {

 liste1: number[];
 liste2: string[];
  
 ngOnInit() {
    this.anotherSubscription = of([1, 2, 3]).subscribe(res => this.liste1 = res);
    this.addSubscription(of(['toto', 'tata', 'titi']).subscribe(res => this.liste2 = res));
  }
  
}
````

**I M P O R T A N T** : Il ne faut surtout pas implémenter la fonction *ngOnDestroy()* dans le composant, sinon celle-ci prendra l'ascendant sur celle du service *unsubscriber* qui ne sera pas joué

[Back to top](#bonnes-pratiques-et-nr)

