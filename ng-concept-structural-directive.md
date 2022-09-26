[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Directives structurelles

* [ngIf](#ngif)     
* [ngFor](#ngfor)     
* [ngSwitch](#ngSwitch)     
  
## ngIf
````html
<p *ngIf="name; else noName">
	cas name non vide
</p>


<ng-template #noName>
	cas else
</ng-template>
````

Rq : *ngIf avec else est équivalent à double blocs *ngIf

## ngFor

````html
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
````html
<p *ngFor="let item of items; i = index; isFirst = first; isLast = last">

<b *ngIf="isFirst">je suis premier</b>
````

### Fonction trackBy

````html
<mat-item *ngFor="let u of users; tackBy: trackUserId">{{ user.name }}</mat-item>
````

````typescript
users: any[] = [...]
trackUserId(index, user) { return user.id }
````
## ngSwitch

````html
<div [ngSwitch]="value">
	<p *ngSwitchCase="5">value is 5</p>
	<p *ngSwitchCase="10">value is 10</p>
	<p *ngSwitchCase="100">value is 100</p>
	<p ngSwitchDefault="5">value is default</p>
</div>
````

[Back to top](#directives-structurelles)
