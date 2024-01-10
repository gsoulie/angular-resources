[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Interaction composant    

Angular fonctionne en single way data-binding, c'est à dire que les enfants ne peuvent communiquer qu'avec leur parent direct. C'est donc le parent qui transmet ses propriété via un *@Input*. Si l'enfant souhaite modifier une valeur, il doit en notifier son parent via un Event Emitter dans avec un *@Output*

### @Input

Depuis Angular v16, le décorateur ````@Input```` prend en charge plusieurs nouvelles fonctionnalités, notamment :

* required 
* alias 
* transform (fn)
* transform (booleanAttribute)
* transform (numberAttribute)

*Child component*
````typescript
export class WidgetComponent {
  @Input({required: true}) title: string = '';
  @Input({alias: 'content'}) body: string | undefined;
  @Input({transform: booleanAttribute}) disable = false;
  @Input({transform: numberAttribute}) zoom = 5;
  @Input({transform: (value: number) => value * 1000 }) value: number | undefined;
}
````

*Parent*

````html
<app-widget
	title="Hello"
	content="..."
	disabled
	zoom="7"
	[value]="100" />
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
