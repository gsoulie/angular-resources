[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI Components

* [mat-table](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#mat-table)        
* [fullcalendar](#fullcalendar)       
* [perso](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#components)
* [Dropdown custom avec type T](dropdown-custom-avec-type-t)     
* [Dropdown directive](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#dropdown-directive)      
* [Swiper](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#swiper)      
* [mat-dialog](#mat-dialog)       
* [loading spinner](#loading-spinner)       
* [virtual scroll](#virtual-scroll)       
* [Signature_pad](#signature-pad)     
* [ng-select](#ng-select)
* [mat-datepicker](#mat-datepicker)    

## fullcalendar

[Doc](https://github.com/gsoulie/angular-resources/blob/master/angular-component.md#fullcalendar)     
[Projet exemple](https://github.com/gsoulie/angular-fullcalendar)      

## Dropdown custom avec type T

<details>
	<summary>Voici un exemple d'implémentation d'une dropdown list personnalisée et utilisant un type générique T</summary>

*dropdown.component.ts*

````typescript
export type DropdownOption<T> = {
  text: string;
  value: T;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: `
	<select>
	  <option *ngFor="let option of options">
		{{ option.text }}
	  </option>
	</select>
  `
})
export class DropdownComponent<T> {
  @Input()
  value: DropdownOption<T>;

  @Input()
  options: DropdownOption<T>[];
}
````

*app.component.ts*

````typescript
type MyCustomType = { name: string, value: number };

@Component({
  selector: 'app-root',
  templateUrl: `
	<app-dropdown [value]="valueAsDropdownItem" [options]="optionsAsDropdownItems" />
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentOption: MyCustomType = { name: 'foo', value: 42};

  options: MyCustomType[] = [
    {
      name: 'foo',
      value: 42,
    },
    {
      name: 'bar',
      value: 13,
    },
  ]

  get valueAsDropdownItem(): DropdownOption<MyCustomType> {
    return this.toDropdownOption(this.currentOption);
  }

  get optionsAsDropdownItems(): DropdownOption<MyCustomType>[] {
    return this.options.map(option => this.toDropdownOption(option));
  }

  toDropdownOption(item: MyCustomType): DropdownOption<MyCustomType> {
    return {
      title: item.name,
      value: item,
    }
  }
}
````
 
</details>

## mat-dialog
[Back to top](#ui-components)

<details>
	<summary>Fonction générique pour appeler des mat-dialog.</summary>


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
 
</details>

## loading spinner
[Back to top](#ui-components)

<details>
	<summary>Méthode avec Signal</summary>

 Composant affichant un lodaing indicator ou n'importe quel contenu

````typescript
@Component({
	selector: 'app-loading-container',
	imports: [MatProgressSpinner],
	template: `
		@if(loading()) {
			<mat-progress-spinner
			class="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			[diameter]="size()"
			mode="indeterminate"
			/>
		} @else {
			<ng-content />
		}
	`,
	styles: `
		:host {
			display: block;
			position: relative;
		}
	`
})
export default class LoadingContainerComponent {
	loading = input<boolean>(false);
	size = input<number>(40);
}
````
 
</details>

<details>
	<summary>Méthode avec Pipe dans la vue</summary>

Voir plus en détail pour les cas plus complexe : 
https://medium.com/angular-in-depth/angular-show-loading-indicator-when-obs-async-is-not-yet-resolved-9d8e5497dd8     

*cas simples : withLoading.pipe.ts*

````typescript
import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

@Pipe({
  name: 'withLoading'
})
export class WithLoadingPipe implements PipeTransform {

  transform(val) {
    return (isObservable(val)
      ? val.pipe(
        map((value: any) => ({ loading: false, value })),
        startWith({ loading: true }),
        catchError(error => of({ loading: false, error }))
      )
      : val) as Observable<any>;
  }
}
````

*home.component.html*

````html
<div *ngIf="posts$ | withLoading | async as obs">
  <ng-template [ngIf]="obs.value">
      <mat-list>
          <mat-list-item *ngFor="let p of obs.value">
              {{ p.id }} - {{ p.title }}
          </mat-list-item>
      </mat-list>
  </ng-template>
  <ng-template [ngIf]="obs.error">Error {{ obs.error }}</ng-template>
  <ng-template [ngIf]="obs.loading">Loading...</ng-template>
</div>
````

*home.component.ts*

````typescript
posts$: Observable<IPost[]>;

ngOnInit() {
  this.posts$ = this.behaviourService.fetchPosts();
}
````
 
</details>

<details>
	<summary>Méthode avec CDK</summary>

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
 
</details>


## virtual scroll
[Back to top](#ui-components)

<details>
	<summary>Implémentation</summary>

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
 
</details>


## Signature pad
[Back to top](#ui-components)

<details>
	<summary>Signature avec signature_pad</summary>

### composant 1

npm : https://www.npmjs.com/package/signature_pad      
git : https://github.com/szimek/signature_pad     
variante composant angular fork (attention semble moins facilement customisable): https://github.com/almothafar/angular-signature-pad    

### Installation

````npm install --save signature_pad````

### Utilisation

*modal-signature.component.ts*

````typescript
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-modal-signature',
  templateUrl: './modal-signature.component.html',
  styleUrls: ['./modal-signature.component.scss'],
})
export class ModalSignatureComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: true }) signaturePadElement: ElementRef;
  signaturePad: any;
  signatureData;
  landscapeMode = false;
  fixedCanvasHeight = 300;
  totalPadding = 60;

  constructor(private modalCtrl: ModalController) {
    
    window.addEventListener('orientationchange', () => {
      this.landscapeMode = (screen.orientation.type === 'landscape-primary' ||
      screen.orientation.type === 'landscape-secondary');
      this.resizeCanvas();
    });
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  ngOnInit() { }
  ngAfterViewInit() { this.initializeCanvas(); }
  clear(): void { this.signaturePad.clear(); }

  submit(): void {
    const base64Data = this.signaturePad.toDataURL();
    this.modalCtrl.dismiss({role: true, data: base64Data});
  }

  cancel(): void { this.modalCtrl.dismiss({role: false, data: null}); }

  private initializeCanvas(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, 
    {backgroundColor: 'rgb(255, 255, 255)'});
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(11,39,58)';

	// listener sur fin de tracé
    this.signaturePad.addEventListener('endStroke', () => {
      // some stuff here
    });
    
	// forcer le recalcul du viewport sinon le tracé de la signature est décalé par rapport au doigt
    this.setNativeElementHeightAndWidth(this.fixedCanvasHeight, window.outerWidth - this.totalPadding);
  }

  private resizeCanvas() {
    this.signatureData = this.signaturePad.toData();  // mémoriser la signature si existante
    this.setNativeElementHeightAndWidth(this.signaturePadElement.nativeElement.offsetHeight,
      this.signaturePadElement.nativeElement.offsetWidth);
    this.signaturePad.fromData(this.signatureData); // redessiner la signature
  }

  /**
   * Recalculer les dimensions du canvas en cas de rotation / redimenssionnement
   *
   * @param height
   * @param width
   */
  private setNativeElementHeightAndWidth(height, width): void {
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePadElement.nativeElement.width = width * ratio;
    this.signaturePadElement.nativeElement.height = height * ratio;
    this.signaturePadElement.nativeElement.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
  }
}
````

*modal-signature.page.html*

````html
<ion-content>
  <canvas class="signature-pad-canvas" #canvas style="touch-action: none;"></canvas>
</ion-content>
<ion-footer class="ion-no-border" *ngIf="!landscapeMode">
  <ion-button (click)="submit()">Submit</ion-button>
  <ion-button (click)="cancel()">Cancel</ion-button>
</ion-footer>
````

*modal-signature.page.scss*

````css
.signature-pad-canvas {
  margin-top: 20px;
  border: 5px solid black;
  border-radius: 10px;
  width: 100%;
  height: 300px;
}
.inline-modal {
  padding: 30px;
}
````
 
</details>

## ng-select

Angular ng-select - Lightweight all in one UI Select, Multiselect and Autocomplete : https://github.com/ng-select/ng-select     

[Back to top](#ui-components)

## mat-datepicker

<details>
	<summary>Configurer le format des dates</summary>

 *app.config.ts*

````typescript
import { MAT_MOMENT_DATE_FORMATS, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [    
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    
  ],
};
````

*Component.ts*
````typescript
 <mat-form-field class="form-field-md simple-field">
	<mat-label for="lastStatusUpdateFrom">From</mat-label>
	<input
	  matInput
	  [matDatepicker]="pickerFrom"
	  formControlName="lastStatusUpdateFrom"
	  id="lastStatusUpdateFrom"
	  (ngModelChange)="setDateToMinValue()"
	  [max]="maxDateFrom"
	  aria-label="Formula last update date from"
	/>
	<mat-datepicker-toggle
	  matIconSuffix
	  [for]="pickerFrom"
            ></mat-datepicker-toggle>
<mat-datepicker #pickerFrom></mat-datepicker>
````
</details>

[Back to top](#ui-components)
