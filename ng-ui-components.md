[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI Components

* [mat-table](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#mat-table)        
* [fullcalendar](#fullcalendar)       
* [perso](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#components)        
* [Dropdown directive](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#dropdown-directive)      
* [Swiper](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#swiper)      
* [mat-dialog](#mat-dialog)       
* [loading spinner](#loading-spinner)       

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


## loading spinner
[Back to top](#ui-components)

Intégrer un layout transparent noir sur toute une page avec un *<mat-spinner>*. La technique conciste à utiliser le package **cdk portal** (https://material.angular.io/cdk/portal/overview) d'angular material qui permet d'insérer dynamiquement un composant dans un conteneur.
  
Il suffit donc de créer un overlay via le package **cdk Overlay** et de lui *attacher* un portal contenant un *<mat-dialog>*
  
Pour plus de généricité, ce traitement peut être placé dans un service 

*overlay.service.ts*

````typescript
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

export class OverlayService {

   private spinnerTopRef: OverlayRef = this.cdkSpinnerCreate(); // création de l'overlay
   
   constructor(private overlay: Overlay) {}
   
   private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      panelClass: 'overlay-spinner',
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }

  showSpinner() {
    if (this.spinnerTopRef) {
      this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
    }
  }

  stopSpinner() {
    this.spinnerTopRef.detach();
  }
}
````

*app.component.ts*

````typescript
{
  constructor(os: OverlayService) {}
  loadData() {
    this.os.showSpinner();
    this.dataService.loadData()
    .subscribe((result) => {
      this.os.stopSpinner();
    }, (error) => {
      this.os.stopSpinner();
    };
  }
}
````
