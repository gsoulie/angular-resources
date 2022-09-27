[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Interaction composant    

Angular fonctionne en single way data-binding, c'est à dire que les enfants ne peuvent communiquer qu'avec leur parent direct. C'est donc le parent qui transmet ses propriété via un *@Input*. Si l'enfant souhaite modifier une valeur, il doit en notifier son parent via un Event Emitter dans avec un *@Output*

### @Input

**Enfant**

Propriété dans composant enfant

````typescript
@Input() public user: Object;

<input type="text" [(ngModel)]="user.name" />
````

**Parent**

````typescript
<app-compo-enfant [user]="myUser"></app-compo-enfant>

myUser: Object

ngOnInit() {
	this.myUser = {
		name: 'Mon user'
	}
}
````


> Important : l'enfant ne peut pas modifier l'objet fourni par le parent !
Si l'enfant modifie l'objet, il doit remonter l'information au père avec event emitter

### Event emitter
[Back to top](#interaction-composant) 

**Enfant**

````typescript
@Output() vider = new EventEmitter();

public vider() {
	this.vider.emit('param de retour');
}

// on peut éviter de créer une méthode relais 
// en appelant directement emit dans la vue
<button (click)="vider.emit()">vider</button>
<!-- <button (click)="vider()">vider</button>-->
````

**Parent**

````typescript
<app-compo-enfant (vider)="onVider($event)">

public onVider(val) {
	this.user = { name: val }
}
````

[Back to top](#interaction-composant)
