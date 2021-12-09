[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Bonnes pratiques et NR

* [Workflow complet](#workflow-complet)      
* [Model Adapter Pattern](#model-adapter-pattern)     
* [Blocs conditionnels](#blocs-conditionnels)        
* [Pipe](#pipe)      
* [Numérique Responsable](https://github.com/gsoulie/angular-resources/edit/master/ng-nr.md)      

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

Tout traitement qui modifie la vue doit préférablement utiliser les pipes plutôt qu'une méthode. Les pipes sont très optimisés et offrent un gain de performance énorme.

[Back to top](#bonnes-pratiques-et-nr)

