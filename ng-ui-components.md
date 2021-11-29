[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI Components

* [mat-table](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#mat-table)        
* [fullcalendar](#fullcalendar)       
* [perso](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#components)        
* [Dropdown directive](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#dropdown-directive)      
* [Swiper](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#swiper)      
* [mat-dialog](#mat-dialog)       
* [loading spinner](#loading-spinner)       
* [virtual scroll](#virtual-scroll)       

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

Intégrer un layout transparent noir sur toute une page avec un *mat-spinner*. La technique conciste à utiliser le package **cdk portal** (https://material.angular.io/cdk/portal/overview) d'angular material qui permet d'insérer dynamiquement un composant dans un conteneur.
  
Il suffit donc de créer un overlay via le package **cdk Overlay** et de lui *attacher* un portal contenant un *mat-spinner*
  
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
      panelClass: 'overlay-spinner',  // pour pouvoir customiser le spinner
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

*style.scss*

````css
// mat-spinner
.overlay-spinner {
  .mat-progress-spinner circle, .mat-spinner circle {
    stroke: red !important;
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

## virtual scroll
[Back to top](#ui-components)

````
npm install @angular/cdk
````

*app.module.ts*

````typescript
import { ScrollingModule } from '@angular/cdk/scrolling';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ScrollingModule
  ],
  declarations: [HomePage]
})
````

*home.html*

````html
  <cdk-virtual-scroll-viewport itemSize="56" minBufferPx="900" maxBufferPx="1350">
    <ion-list>
      <ion-item *cdkVirtualFor="let item of items" tappable (click)="selectItem(item)">
        <ion-avatar slot="start">
          <img src="https://loremflickr.com/100/100" />
        </ion-avatar>
        <ion-label>
          {{ item }}
        </ion-label>
      </ion-item>
 
    </ion-list>
 
  </cdk-virtual-scroll-viewport>
````

*home.css* **IMPORTANT !! il faut renseigner la hauteur du viewport**
````css
cdk-virtual-scroll-viewport {
  height: calc(100% - 68px);
  width: 100%;
}
````

[Back to top](#ui-components)
