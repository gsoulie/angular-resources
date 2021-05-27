
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Events    

* [Exposing event](#exposing-event)     
* [Local reference](#local-reference)    

## Exposing event
[Back to top](#events)   

*game.component.html*

```<button class="btn" (click)="onStart()">Start</button>```

*game.component.ts*

```javascript
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-component-game',
	...
})
export class GameComponent implements OnInit {
	@Output() intervalFired = new EventEmitter<number>();	// rendre l'event accessible depuis l'extérieur
	interval;
	lastNumber = 0;
	
	constructor() {}
	ngOnInit() {}
	
	onStart() {
		this.interval = setInterval(() => {
			this.interval.emit(this.lastNumber + 1);
			this.lastNumber++;
		}, 1000);
	}
}
```

*app.component.html*

```html
// listening on "intervalFired" event from app-component-game component
<app-component-game (intervalFired)="onIntervalFired()"></app-component-game>
```

*app.component.ts*

```javascript
…
// fonction déclenchée lors de la réception de l’event
onIntervalFired(firedNumber: number) {
	console.log(firedNumber)
}
```

### Another example with inputs

*edit.component.html*

```html
<label>Name</label>
<input #nameInput>
<label>Amount</label>
<input #amountInput>
<button type="submit" (click)="onAddItem()">Add</button>
```

*edit.component.ts*

```javascript
@ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
@ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;
@Ouput() ingredientAdded = new EventEmitter<{name: string, amount: number}>();

onAddItem() {
	this.ingredientAdded.emit({name: this.nameInputRef.nativeElement.value, amount: this.amountInputRef.nativeElement.value});
}
```

*list.compoment.html*

```html
<app-edit-component (ingredientAdded)="addIngredient($event)"></app-edit-component>
<ul>
	<a *ngFor="let i of ingredients">{{ i.name }} {{ i.amount }}</a>
</ul>
```

*list.component.ts*

```javascript
ingredients: {name: string, amount: number}[] = [];
addIngredient(newIngredient: {name: string, amount: number}) {
	this.ingredients.push(newIngredient);
}
```

## Local Reference
[Back to top](#events)   

*cockpit.component.html*

```html
<div class="row">
   <div class="col-xs-12">
       <label>Server Name</label>
       <input type="text" class="form-control" #serverNameReference>
       <button
           class="btn btn-primary"
           (click)="onAddServer(#serverNameReference)">Add Server</button>
            </div>
</div>
```

*cockpit.component.ts*

```javascript
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
 
@Component({
 selector: 'app-cockpit',
 templateUrl: './cockpit.component.html',
 styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
 
 @Output() serverCreated = new EventEmitter<{serverName: string, serverContent: string}>();  //event
 @Output() blueprintCreated = new EventEmitter<{serverName: string, serverContent: string}>(); //event
 
 newServerName = '';
 newServerContent = '';
 
 constructor() {}
 
 ngOnInit() {}
 
 onAddServer(localReference) {
  console.log(localReference.value
 }
```
