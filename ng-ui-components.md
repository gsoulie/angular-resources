[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI Components

* [mat-table](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#mat-table)        
* [fullcalendar](#fullcalendar)       
* [perso](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#components)        
* [Dropdown directive](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#dropdown-directive)      
* [Swiper](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#swiper)      
* [mat-dialog](#mat-dialog)       

## fullcalendar

[Doc](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#fullcalendar)     
[Projet exemple](https://github.com/gsoulie/angular-fullcalendar)      

## mat-dialog
[Back to top](#ui-components)

Fonction générique pour appeler des mat-dialog. 

````typescript
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  showDialog<T>(dialogComponent: new (...args: any[]) => T, data: any): MatDialogRef<T,any> {
    const dialogRef = this.dialog.open(dialogComponent, data);
    return dialogRef;
  }
}
````
*utilisation* 

````typescript
  const dialogRef = this.dialogService.showDialog(SelectPoolMapComponent, {
    minWidth: '500px',
    data: {
      title: 'Add task',
      subTitle: 'Select the sample spot',
      okBtnLabel: 'Next'
    },
    panelClass: 'fullHeightDialog'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== false) {
      this.addPool(poolType);
    }
  });
````
