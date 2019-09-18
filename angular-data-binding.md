
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Data binding    

* [Binding property on component](#binding-property-on-component)     
* [Binding on custom event](#binding-on-custom-event)    



## Binding property on component
[Back to top](#data-binding)   

Work with components needs to pass and/or update data between them (like list-detail model for example). To achieve this, it is possible to bind some component's properties from another component.

**Warning** By default, each property is only available inside it's own controller. Accessing to a component's properties from it's parent, you need to use ```@Input()``` directive in front of the property.

*server-element.component.ts*

```
export class ServerElementComponent {
	@Input() element: {type: string, name: string, content: string};

	constructor() {}
}
```

*app.component.ts*

```
export class AppComponent {
  serverElements = [{type: 'server', name: 'Test server', content: 'just a test'}]
}
```

*app.component.html*

```<app-server-element *ngFor="let serverElt of serverElements" [element]="serverElt"></app-server-element>```


## Binding on custom event
[Back to top](#data-binding)   

In the following example, we bind the ```serverCreated``` and ```blueprintCreated``` events emitted by the ```app-cockpit``` component to the ```onServerAdded()``` and ```onBlueprintAdded()``` functions in the de *app.component.ts*.

*app.component.html*
 
```
<app-cockpit
   (serverCreated)="onServerAdded($event)"
   (blueprintCreated)="onBlueprintAdded($event)">
</app-cockpit>
 
<app-server-element *ngFor="let serverElt of serverElements" [element]="serverElt"></app-server-element>
```

*app.component.ts*
 
```
import { element } from 'protractor';
import { Component } from '@angular/core';
 
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent {
 name = 'angular-sandbox';
 serverElements = [{type: 'server', name: 'Test Server', content: 'this is a test'}];
 
 onAddServer() {
   this.name = '';
 }
 onUpdateServeName(e) {
   this.name = e.target.value;
 }
 onServerAdded(serverData: {serverName: string, serverContent: string}) {
   this.serverElements.push({
     type: 'server',
     name: serverData.serverName,
     content: serverData.serverContent
   });
 }
 onBlueprintAdded(blueprintData: {serverName: string, serverContent: string}) {
   this.serverElements.push({
     type: 'blueprint',
     name: blueprintData.serverName,
     content: blueprintData.serverContent
   });
 }
}
```
  
*cockpit.component.html*

```
<div class="row">
   <div class="col-xs-12">
       <p>Add new servers or blueprint</p>
       <label>Server Name</label>
       <input type="text" class="form-control" [(ngModel)]="newServerName">
       <label>Server Content</label>
       <input type="text" class="form-control" [(ngModel)]="newServerContent">
       <br>
       <button
           class="btn btn-primary"
           (click)="onAddServer()">Add Server</button>
           <button
           class="btn btn-primary"
           (click)="onAddBlueprint()">Add Blueprint</button>
   </div>
</div>
```
 
[Back to top](#data-binding)   

*cockpit.component.ts*
 
```
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
 
 constructor() { }
 
 ngOnInit() {
 }
 
 onAddServer() {
   // emit serverCreated event
   this.serverCreated.emit({
     serverName: this.newServerName,
     serverContent: this.newServerContent
   });
 }
 onAddBlueprint() {
   // emit blueprintCreated event
   this.blueprintCreated.emit({
     serverName: this.newServerName,
     serverContent: this.newServerContent
   });
 }
 
}
``` 

We created 2 *EventEmitter* with ```@Output``` keyword to be reached from other components, and we specified the data type with ```{serverName: string, serverContent: string})```
