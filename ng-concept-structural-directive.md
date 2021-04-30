[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Directives structurelles
  
````
<p *ngIf="name; else noName">
	cas name non vide
</p>


<ng-template #noName>
	cas else
</ng-template>
````

Rq : *ngIf avec else est équivalent à double blocs *ngIf

*Autre exemple*

````
<ng-container *ngIf="tickets; then okTickets else noTickets"></ng-container>

<ng-template #okTickets>
 <div *ngFor="let ticket of tickets; let i = index" class="ticket">
    <div class="actions" *ngIf="!loadingRequest">
	<span class="remove" (click)="removeTicket(i)">X</span>
	<span class="edit" (click)="editTicket(i)">| Edit |</span>
    </div>

    <div class="left">
	<img [src]="ticket.urlImage"/>
    </div>
 </div>
</ng-template>
````

### mots clés réservés de ngFor 

Il existe trois mots clés pour le ngFor : *index, first, last*
````
<p *ngFor="let item of items; i = index; isFirst = first; isLast = last">

<b *ngIf="isFirst">je suis premier</b>
````

[Back to top](#directives-structurelles)
