[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Components    

* [Dropdown directive](#dropdown-directive)     
* [mat-table](#mat-table)      
* [Fullcalendar](#fullcalendar)     
* [mat-button-toggle-group](#mat-button-toggle-group)     
* [mat-dialog](#mat-dialog)      
* [mat-input](#mat-input)       


## Dropdown directive
[Back to top](#components)  

<details>
	<summary>Implementation</summary>

In this example we create a dropdown button. The ```appDropdown``` directive shows / hides the menu on the click event

*recipe-detail.component.html*

```html
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

```javascript
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

```html
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
 
</details>


## mat-table
[Back to top](#components)  

### Important

Le conditionnement de l'affichage d'une mat-table avec une directive ````*ngIf```` casse la fonctionnalité de tri
 
Il faut donc préférer l'utilisation de la propriété ````[hidden]```` de mat-table plutôt qu'un ````*ngIf````

````html
<mat-table
    *ngIf="poolList.length > 0" // => casse le tri
</mat-table>
<mat-table 
    [hidden]="poolList.length <= 0" // => ok
</mat-table>
````

De plus, il faut **s'assurer** que le nom donné au ````matColumnsDef```` corresponde au nom de la propriété de l'élément affiché

````html
<ng-container matColumnDef="samplingCode">
      <mat-header-cell *matHeaderCellDef mat-sort-header> Sample code </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{element.samplingCode}} </mat-cell>
 </ng-container>
````

### Datasource observable

<details>
	<summary>Implémentation</summary>

> Noter l'importance de ````?? []```` dans le template qui évite une erreur à cause du mode strict

````typescript
@Component({
  selector: 'app-formula-list-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, SvgComponent, FormulaIndicatorIconPipe, MatSortModule],
  template: `
	<table mat-table [dataSource]="(dataset$ | async) ?? []" matSort>
		<!-- ... -->
	</table>
  `,
  styleUrl: './formula-list-table.component.scss'
})

export class FormulaListTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['fmStatus', 'factory', 'code', 'version',
    'order', 'description', 'scada', 'calisto', 'veritas', 'date'];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  private dataSource = new MatTableDataSource<Formula>();
  private formualService = inject(FormulaService);

  dataset$: Observable<MatTableDataSource<Formula>> = this.formualService.fetchFormulas()
    .pipe(
      map(formulas => {
        const dataSource = this.dataSource;
        dataSource.data = formulas;
        return dataSource
      })
    )


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
}
````
 
</details>

### Propriétés

````matSortDisableClear```` : Par défaut, la mat-table présente 3 sort-directions (*asc*, *desc*, "" -> réinitialiser le tri). Cette propriété permet de supprimer le sortDirection = ""

<details>
	<summary>Exemple d'utilisation</summary>

*View file*

````html
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

````javascript
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

*style file*

````css
// Set specific width to column
.mat-column-property2 {
  width: $property-col-width !important;
  flex: 0 0 $property-col-width !important;
}

.table-header {
  background: #2D2D2D !important;
  font-weight: bold;
  border-bottom-right-radius: 15px !important;
  border-bottom-left-radius: 15px !important;
}
.table-row:hover {
  // background au survol d'une ligne
  background: #5D5D5D;
  cursor: pointer;
}
````

Pour définir un style particulier à une colonne, il suffit d'ajouter une classe *.mat-column-* suffixée par la valeur de l'attribut **matColumnDef** 
 
</details>

### mat-table avec checkbox

<details>
	<summary>Implémentation</summary>


*view file*

````html
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

  <!-- Checkbox Column -->
  <ng-container matColumnDef="select">
    <mat-header-cell *matHeaderCellDef>
      <mat-checkbox (change)="$event ? masterToggle() : null"
                    [checked]="selection.hasValue() && isAllSelected()"
                    [indeterminate]="selection.hasValue() && !isAllSelected()">
      </mat-checkbox>
    </mat-header-cell>
    <mat-cell *matCellDef="let row">
      <mat-checkbox (click)="$event.stopPropagation()"
                    (change)="$event ? selection.toggle(row) : null"
                    [checked]="selection.isSelected(row)">
      </mat-checkbox>
    </mat-cell>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>


  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"
      (click)="selection.toggle(row)">
  </tr>
</table>

````

*controller file*

````javascript
import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

export interface PeriodicElement {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen'},
  {position: 2, name: 'Helium'},
  {position: 3, name: 'Lithium'},
  {position: 4, name: 'Beryllium'},
  {position: 5, name: 'Boron'},
  {position: 6, name: 'Carbon'},
  {position: 7, name: 'Nitrogen'},
  {position: 8, name: 'Oxygen'},
  {position: 9, name: 'Fluorine'},
  {position: 10, name: 'Neon'},
];

@Component({
  selector: 'table-selection-example',
  styleUrls: ['table-selection-example.css'],
  templateUrl: 'table-selection-example.html',
})
export class TableSelectionExample {
  displayedColumns: string[] = ['select','name'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
````
 
</details>

### mat-table avec ruptures

<details>
	<summary>home.html</summary>


*home.html*

````html
<h1 [style.marginTop]="'50px'">Table unique avec travail sur le jeu de données</h1>
<div class="example-container mat-elevation-z8">
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
 
    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef>Etat</th>
      <td mat-cell *matCellDef="let element"
      [attr.colspan]="element.header ? fullDataColumns.length : 1"
      [class.rupture-row]="element.header"
      [class.left-indicator]="!element.header"
      > {{element.header ? element.date : element.status }} </td>
    </ng-container>       
    <ng-container matColumnDef="agent">
      <th mat-header-cell *matHeaderCellDef>Agent</th>
      <td mat-cell *matCellDef="let element" 
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> 
        <mat-label *ngIf="!element.header">{{ element.agent.prenom }} <b>{{ element.agent.nom }}</b></mat-label>
      </td>
    </ng-container>
    <ng-container matColumnDef="shift">
        <th mat-header-cell *matHeaderCellDef>Shift</th>
        <td mat-cell *matCellDef="let element"
        [class.hidden]="element.header"
        [attr.colspan]="element.header ? 0 : 1"> {{element.header ? '' : element.shift }} </td>
      </ng-container>
    <ng-container matColumnDef="driving">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Conduite</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.driving }} </td>
    </ng-container>
    <ng-container matColumnDef="maintening">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Atelier</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.maintening }} </td>
    </ng-container>
    <ng-container matColumnDef="basket">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Panier</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> 
        <div *ngIf="!element.header" class="basket-container">
            <div *ngIf="!element.header"
            [class.no-basket-alert]="!element.basketAlert"
            [class.basket-alert]="element.basketAlert">
                {{element.basket}} 
        </div> 
        </div>
      </td>
    </ng-container>
    <ng-container matColumnDef="movement">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Déplacement</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.movement }} </td>
    </ng-container>
    <ng-container matColumnDef="dirt">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Salissure</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.dirt }} </td>
    </ng-container>
    <ng-container matColumnDef="height">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Hauteur</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.height }} </td>
    </ng-container>
    <ng-container matColumnDef="hour">
      <th mat-header-cell *matHeaderCellDef>Heure supp</th>
      <td mat-cell *matCellDef="let element" 
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.suppHour }} </td>
    </ng-container>
    <ng-container matColumnDef="option">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">Option</th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.option }} </td>
    </ng-container>
    <ng-container matColumnDef="comment">
      <th mat-header-cell *matHeaderCellDef class="centered-cell">
        <img src="./../assets/images/icon_commentaire_16_blanc.svg">
      </th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header"> {{element.header ? '' : element.comment }} </td>
    </ng-container>
    <ng-container matColumnDef="action" class="centered-cell">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let element" 
      class="centered-cell"
      [attr.colspan]="element.header ? 0 : 1"
      [class.hidden]="element.header">
            <button mat-button 
            class="btn-rounded-std btn-light-blue"
            *ngIf="!element.header">Valider</button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="fullDataColumns; sticky: true" class="table-header"></tr>
    <tr mat-row *matRowDef="let row; columns: fullDataColumns;"></tr>
  </table>
</div>
````

</details>

<details>
	<summary>home.ts</summary>

 ````typescript
  dataSource = new MatTableDataSource<any>([]);
  fullDataColumns: string[] = [];

  constructor(private mock: MockService) { }

  ngOnInit() {
    this.fullDataColumns = this.mock.fullDataColumns;
    this.dataSource = new MatTableDataSource(this.mock.ruptures2);
  }
````

</details>

<details>
	<summary>mock.service.ts</summary>

*mock.service.ts*

````typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  dataset = [
    { date: '2021-10-13', status: 'SentForApproval', agent: { nom: 'AvecUnNomSuperLong', prenom: 'Jean-Sébastien' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G', basket: 1, basketAlert: true, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Oui' },
    {
      date: '2021-10-13', status: 'SentForApproval', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: true, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Non'
    },
    {
      date: '2021-10-13', status: 'SentForApproval', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: true, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Non'
    },
    {
      date: '2021-10-13', status: 'SentForApproval', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: false, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Non'
    },
   
    {
      date: '2021-10-14', status: 'SentForApproval', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: false, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Non'
    },
    {
      date: '2021-10-14', status: 'SentForApproval', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: false, movement: 0, dirt: 2, height: 3, suppHour: 'Vacations spéciales', option: false, comment: 'Non'
    },
    {
      date: '2021-10-14', status: 'ExportedWithFixes', agent: { nom: 'Nom', prenom: 'Prénom' }, shift: 'Shift matin 6/13', driving: 2, maintening: 1, wharf: 'G',
      basket: 1, basketAlert: false, movement: 0, dirt: 2, height: 3, suppHour: '', option: false, comment: 'Non'
    },
   
  ];

  ruptures2 = [];

  fullDataColumns: string[] = ['status', 'shift', 'agent', 'driving', 'maintening', 'basket',
    'movement', 'dirt', 'height', 'hour', 'option', 'comment', 'action'];
  ruptureColumn = ['date'];

  constructor() {
    this.buildDataset();    
  }

  buildDataset() {
    let compareDate = '';
    for (let i = 0; i < this.dataset.length; i++) {
      if (i === 0) {
        compareDate = this.dataset[i].date;
   
        let row = JSON.parse(JSON.stringify(this.dataset[i])); // casser la référence sinon écrase les valeurs des lignes suivantes
        row['header'] = true;
        this.ruptures2.push(row);
        console.table(this.ruptures2);

        let row2 = JSON.parse(JSON.stringify(this.dataset[i]));
        row2['header'] = false;
        this.ruptures2.push(row2);
        console.table(this.ruptures2);

      } else {
        if (compareDate !== this.dataset[i].date) {
          compareDate = this.dataset[i].date;

          let row = JSON.parse(JSON.stringify(this.dataset[i]));
          row['header'] = true;
          this.ruptures2.push(row);

          let row2 = JSON.parse(JSON.stringify(this.dataset[i]));
          row2['header'] = false;
          this.ruptures2.push(row2);
          console.table(this.ruptures2);
        } else {
          let row = JSON.parse(JSON.stringify(this.dataset[i]));
          row['header'] = false;
          this.ruptures2.push(row);
        }
      }
    }
  }
}
````
 
</details>

<details>
	<summary>home.scss</summary>

*home.css*

````css
table {
  width: 100% !important;
}
.example-container {
    height: 600px;
    overflow: auto;
}
.table-header {
    background: #2D2681 !important;
    font-weight: bold !important;
    color: white !important;
    border-top-left-radius: 5px !important;
    border-top-right-radius: 5px !important;
    .mat-header-cell {
        color: #EDF0F8;
        font-size: 16px !important;
    }
}

// Définir la hauteur minimal d'une ligne
tr.mat-footer-row,
tr.mat-row {
  height: 20px !important;
}
// ligne de rupture  
.rupture-row {
    background-color: #D8E0ED;
    height: 30px !important;
}
.hidden {
    width: 0px !important;
}
// retrait du padding right de la table
th.mat-header-cell:last-of-type, td.mat-cell:last-of-type, td.mat-footer-cell:last-of-type {
    padding-right: 0px !important;
}
th.mat-header-cell:first-of-type, td.mat-cell:first-of-type, td.mat-footer-cell:first-of-type {
  padding-left: 10px;
}
.left-indicator {
  border-left: 3px solid red;
}
.centered-cell {
  text-align: center !important;
}
td.mat-cell {
  word-wrap: break-word !important;
}
.mat-cell {
  word-wrap: break-word !important;
}
.mat-header-cell {
  word-wrap: break-word !important;
}
.basket-container {
    display: flex;
    width: 100%;
    justify-content: center;
}
.basket-alert {
  background-color: #F5575D;
  color: white;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  text-align: center;
}
.no-basket-alert {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    text-align: center;
  }
  .btn-rounded-std {
    border-radius: 50px !important;
    text-transform: none;
    font-size: 16px;
    height: 30px !important;
    line-height: 30px !important;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: transparent !important;
  }
  .btn-light-blue {
    color: white;
    background-color: #009DE0 !important;
  }
````
 
</details>

### Filtrage avec prédicat

<details>
	<summary>En partant du jeu de données de l'exemple précédant</summary>

````typescript
ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dataset);
    
    // création du prédicat pour choisir les colonnes à filtrer
    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.status.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      data.agent.nom.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      data.agent.prenom.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      data.shift.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      data.suppHour.toLowerCase().indexOf(filter.toLowerCase()) !== -1
     };
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
````

````html
<input matInput (keyup)="applyFilter($event)" placeholder="Valeur à filtrer" #input>
<table mat-table [dataSource]="dataSource" matSort>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Etat</th>
        <td mat-cell *matCellDef="let element" class="left-indicator"> {{ element.status }} </td>
      </ng-container>
   ...
</table>
````

</details>

### mat-table avec observable

mat-table avec observable + tri : https://stackblitz.com/edit/angular-6fomv1-h2hdk3?file=app%2Ftable-basic-example.ts
https://stackblitz.com/edit/angular-ivy-seskzc?file=src%2Fapp%2Fuser.ts
https://stackblitz.com/edit/angular-6fomv1?file=app%2Ftable-basic-example.ts

### mat-table avec pagination

[Voir le tuto : https://www.youtube.com/watch?v=I5wnWaa2g14&ab_channel=AngularUniversity](https://www.youtube.com/watch?v=I5wnWaa2g14&ab_channel=AngularUniversity)

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

````javascript
import {MatButtonToggleModule} from '@angular/material/button-toggle';
````

Global styling to set in *style.scss*

````css
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

````html
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

````css
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

````javascript
@ViewChild('activityToggle', { static: false }) activityToggle: MatButtonToggleGroup;
@ViewChild('stateToggle', { static: false }) stateToggle: MatButtonToggleGroup;

selectByState(ev) {
  console.log(this.stateToggle.value);
}
selectByActivity(ev) {
  console.log(this.activityToggle.value);
}
  
````

## mat-dialog
[Back to top](#components)  

Masquer le scroll d'une dialog ayant une hauteur de plus de 100%

1 - créer une classe css pour la dialog dans le fichier de style global *style.scss*

````css
.fullHeightDialog .mat-dialog-container {
  overflow-y: hidden;
}
````

2 - Appliquer la classe css lors de l'appel de la modale

````javascript
const dialogRef = this.dialog.open(PoolDetailComponent, {
      width: '80%',
      height: '90%',
      data: ...,
      panelClass: 'fullHeightDialog'
    });
````

## mat-input
[Back to top](#components)  

La surcharge du style des mat-input doit se faire dans le fichier global *styles.scss*

*style.scss*
````css
// label
.mat-form-field-label {
  color: orange !important;
}
// ligne quand champ inactif
.mat-form-field-underline {
  background-color: red !important;
}
// ligne quand champ survolé et focus
.mat-form-field-ripple {
  background-color: red !important;
}
.mat-input-element {
  color: blue !important;
}
// .mat-form-field-appearance-outline .mat-form-field-outline-thick {
//   color: white !important;
// }
.mat-form-field-appearance-outline .mat-form-field-outline {
  color: slategray !important;
}
````

[Back to top](#components)  
