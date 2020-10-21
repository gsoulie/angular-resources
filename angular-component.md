[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Components    

* [Dropdown directive](#dropdown-directive)     
* [mat-table](#mat-table)      
* [Fullcalendar](#fullcalendar)     
* [mat-button-toggle-group](#mat-button-toggle-group)     


## Dropdown directive
[Back to top](#components)  

In this example we create a dropdown button. The ```appDropdown``` directive shows / hides the menu on the click event

*recipe-detail.component.html*

```
<div class="row">
   <div class="col-xs-12">
       <div class="btn-group" appDropdown>
           <button type="button" class="btn btn-primary dropdown-toggle">Manage Recipe <span class="caret"></span></button>
           <ul class="dropdown-menu">
               <li><a href="#">Add to shopping list</a></li>
               <li><a href="#">Edit recipe</a></li>
               <li><a href="#">Delete recipe</a></li>
           </ul>
       </div>
   </div>
</div>
```

*dropdown.directive.ts* (**To add into the app.module.ts**)

```
import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';
 
@Directive({
   selector: '[appDropdown]'
})
export class DropdownDirective {
   @HostBinding('class.open') isOpen = false;
 
   // listener permettant de fermer la dropdown aussi lors d'un clic n'importe où dans la page
   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
       this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
   }
 
 
   // listener sur événement clic
   /*@HostListener('click') toggleOpen() {
       this.isOpen = !this.isOpen;
   }*/
 
   constructor(private elRef: ElementRef) {}
}
```

```
<nav class="navbar navbar-default">
   <div class="container-fluid">
       <div class="navbar-header">
           <button type="button" class="navbar-toggle" (click)="collapsed = !collapsed">
               <span class="icon-bar" *ngFor="let iconBar of [1, 2, 3]"></span>
           </button>
           <a href="#" class="navbar-brand">Recipe book</a>
       </div>
       <div class="navbar-collapse" [class.collapse]="collapsed" (window:resize)="collapsed = true">
           <ul class="nav navbar-nav">
               <li><a href="#" (click)="onSelect('recipe')">Recipes</a></li>
               <li><a href="#" (click)="onSelect('shopping-list')">Shopping list</a></li>
           </ul>
           <ul class="nav navbar-nav navbar-right">
               <li class="dropdown" appDropdown>
                   <a href="#" class="dropdown-toggle" role="button">Manage <span class="caret"></span></a>
                   <ul class="dropdown-menu">
                       <li><a href="#">Save data</a></li>
                       <li><a href="#">Fetch data</a></li>
                   </ul>
               </li>
           </ul>
       </div>
   </div>
</nav>
```

## mat-table
[Back to top](#components)  


*View file*

````
<button mat-button color="primary" (click)="addItem()">Add item</button>

  <mat-table [dataSource]="dataSource" class="mat-elevation-z8">
    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <mat-header-cell *matHeaderCellDef> No. </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.position}} </mat-cell>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.name}} </mat-cell>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="weight">
      <mat-header-cell *matHeaderCellDef> Weight </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.weight}} </mat-cell>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="symbol">
      <mat-header-cell *matHeaderCellDef> Symbol </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.symbol}} </mat-cell>
    </ng-container>

    <ng-container matColumnDef="action">
      <mat-header-cell *matHeaderCellDef> Action </mat-header-cell>
      <mat-cell *matCellDef="let element">
        <button mat-icon-button color="primary" (click)="removeItem(element)">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
    <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
  </mat-table>
````

*Controller file*

````
import { MatTableDataSource } from '@angular/material';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  constructor() { }

  ngOnInit() {
    this.dataSource.data = ELEMENT_DATA;
  }
  addItem() {
    this.dataSource.data = [...this.dataSource.data, {position: 11, name: 'Barium', weight: 20.1797, symbol: 'Ba'}];
  }
  removeItem(item: PeriodicElement) {
    let newData = this.dataSource.data;
    const index = newData.findIndex(elt => elt.position === item.position);
    newData.splice(index, 1);
    this.dataSource.data = newData;
  }

}
````

## Fullcalendar
[Back to top](#components)  

[Documentation](https://fullcalendar.io/docs/angular)       

During the installation, it's possible to import specific calendar's modules. As example, here we import core, daygrid, timegrid, list and interaction :

````
npm install --save @fullcalendar/core @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/list @fullcalendar/interaction
````

> Warning : The import line ````import { FullCalendarModule } from '@fullcalendar/angular';```` **MUST** be the very first line in *app.module.ts*

If not, the following error may occurs :

````
vdom.js:3 Uncaught Error: Please import the top-level full calendar lib before attempting to import a plugin.
    at Module../node_modules/@fullcalendar/common/vdom.js (vdom.js:3)
    at __webpack_require__ (bootstrap:79)
    at Module../node_modules/@fullcalendar/common/main.js (main.js:1)
    at __webpack_require__ (bootstrap:79)
    at Module../node_modules/@fullcalendar/daygrid/main.js (main.js:1)
    at __webpack_require__ (bootstrap:79)
    at Module../src/app/demo/demo.component.ts (demo.component.ts:1)
    at __webpack_require__ (bootstrap:79)
    at Module../src/app/Modules/app-routing.module.ts (app-routing.module.ts:1)
    at __webpack_require__ (bootstrap:79)
````

## mat-button-toggle-group
[Back to top](#components)     

Customize *mat-button-toggle-group* buttons 

First, add the following import in you *material.module.ts* file

````
import {MatButtonToggleModule} from '@angular/material/button-toggle';
````

Global styling to set in *style.scss*

````
.section-label {
  color: #56686D;
  font-weight: bold;
  font-size: 16px;
}
mat-button-toggle-group {
  border: none !important;
  background-color: transparent !important;
}
mat-button-toggle-group .mat-button-toggle-label-content {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: inline-block;
  line-height: 36px;
  padding: 0 16px;
  position: relative;
  line-height: 35px !important;
  background-color: transparent !important;
}
.mat-button-toggle {
  margin-right: 10px;
}
.mat-button-toggle {
  border-radius: 12px !important;
  color: #56686D !important;
}
.mat-button-toggle-checked {
  background-color: #56686D !important;
  border-radius: 12px !important;
  color: white !important;
}
````

*View file*

````
<div class="search-div">
      <div class="search-row">
        <mat-label class="section-label">
          Par activité
        </mat-label>
        <mat-button-toggle-group (click)="selectByActivity($event)" #activityToggle="matButtonToggleGroup">
          <mat-button-toggle value="1">Actif</mat-button-toggle>
          <mat-button-toggle value="2">Inactif</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      <div class="search-row">
        <mat-label class="section-label">
          Par état
        </mat-label>
        <mat-button-toggle-group (click)="selectByState($event)" #stateToggle="matButtonToggleGroup">
          <mat-button-toggle value="3">En cours</mat-button-toggle>
          <mat-button-toggle value="4">Clôturé</mat-button-toggle>
          <mat-button-toggle value="5">Prévisionnel</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>
````

*Style file*

````
 .search-div {
    background-color: #DAE8EB;
    margin-top: 20px;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
  }
  .search-row {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
  }
  .search-row mat-select {
    margin-top: 10px;
  }
  mat-button-toggle-group {
    margin-top: 20px;
  }
````

*Controller file*

````
@ViewChild('activityToggle', { static: false }) activityToggle: MatButtonToggleGroup;
@ViewChild('stateToggle', { static: false }) stateToggle: MatButtonToggleGroup;

selectByState(ev) {
  console.log(this.stateToggle.value);
}
selectByActivity(ev) {
  console.log(this.activityToggle.value);
}
  
````
