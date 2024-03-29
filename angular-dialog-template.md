[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

* [Helper générique](#helper-generique)
* [Angular Dialog Template](#angular-dialog-template)    

# Helper générique

<details>
  <summary>Service générique pour gérer les mat-dialog</summary>

*dialog-helper.service.ts*

````typescript
import { ComponentType } from "@angular/cdk/portal";
import { Injectable, inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

export type InfoDialogProps = {
  title?: string,
  message?: string,
  closeButtonLabel?: string,
}

export type ConfirmDialogProps = InfoDialogProps & {
  cancelButtonLabel?: string,
  confirmButtonLabel?: string
}

@Injectable({
  providedIn: 'root'
})

export class DialogHelperService {
  private _dialog = inject(MatDialog);

  showInfoDialog<T>(props: InfoDialogProps, dialogComponent: ComponentType<T>): MatDialogRef<T> {
    const dialogRef = this._dialog.open<T>(dialogComponent, {
      panelClass: 'custom-dialog',
      data: {
        title: props.title || 'Title',
        message: props.message || '',
        closeButtonLabel: props.closeButtonLabel || 'Close'
      }
    })
    return dialogRef;
  }

  showConfirmDialog<T>(props: ConfirmDialogProps, dialogComponent: ComponentType<T>): MatDialogRef<T> {
    const dialogRef = this._dialog.open<T>(dialogComponent, {
      panelClass: 'custom-dialog',
      data: {
        title: props.title || 'Confirm',
        message: props.message || '',
        cancelButtonLabel: props.cancelButtonLabel || 'Cancel',
        confirmButtonLabel: props.confirmButtonLabel || 'Confirm',
        closeButtonLabel: props.closeButtonLabel || 'Close'
      }
    })

    return dialogRef;
  }
}
````

**Utilisation depuis un composant**

````typescript
import { DialogConfirmComponent } from '../../../ui/modals/confirm/confirm.component';
import { DialogComponent } from '../../../ui/modals/info/dialog.component';
import { DialogHelperService } from '../../../../libs/helpers/dialog-helper.service';

_dialogHelper = inject(DialogHelperService);

handleInfo() {
  const dialogRef = this._dialogHelper.showInfoDialog({
    title: 'Info dialog',
    message: 'This is just an info',
  }, DialogComponent)

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });

}
handleConfirm() {
  const dialogRef = this._dialogHelper.showConfirmDialog({
    title: 'Confirm changes',
    message: 'Do you want to delete this user ?',
  }, DialogConfirmComponent)

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}
````
  
</details>

# Angular Dialog Template

<details>
  <summary>Créer une mat-dialog basée sur un template générique avec ng-container</summary>

*template-dialog.component.html*

````html
  <h1 class="test" mat-dialog-title>
    {{ title }}
  </h1>
  
  <mat-dialog-content>
    <ng-container [ngTemplateOutlet]="template"></ng-container>
  </mat-dialog-content>
  
  <mat-dialog-actions>
    <button class="btn-outline-rc" mat-button (click)="onDismiss()">No</button>
    <button class="btn-rc" mat-raised-button color="primary" (click)="onConfirm()">Yes</button>
  </mat-dialog-actions>
  
````

*template-dialob.component.ts*

````javascript
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {
  title = '';
  template;

  constructor(
    public dialogRef: MatDialogRef<TemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Update view with given values
    this.title = this.data.title;
    this.template = this.data.template;
  }

  ngOnInit() { }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}

````

*home.compoennt.html*

````html
<button mat-raised-button color="primary" (click)="openDialogWithTemplateRef(myDialog)">Dialog 1</button>
<button mat-raised-button color="accent" (click)="openDialogWithoutRef()">Dialog 2</button>

<ng-template #myDialog>
    <div>
        <h2>Ma dialog option 1</h2>
        <p>
            <mat-form-field appearance="legacy">
              <mat-label>Legacy form field</mat-label>
              <input matInput placeholder="Placeholder">
              <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
              <mat-hint>Hint</mat-hint>
            </mat-form-field>
          </p>
          <p>
            <mat-form-field appearance="standard">
              <mat-label>Standard form field</mat-label>
              <input matInput placeholder="Placeholder">
              <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
              <mat-hint>Hint</mat-hint>
            </mat-form-field>
          </p>
          <p>
            <mat-form-field appearance="fill">
              <mat-label>Fill form field</mat-label>
              <input matInput placeholder="Placeholder">
              <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
              <mat-hint>Hint</mat-hint>
            </mat-form-field>
          </p>
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Outline form field</mat-label>
              <input matInput placeholder="Placeholder">
              <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
              <mat-hint>Hint</mat-hint>
            </mat-form-field>
          </p>
    </div>
  </ng-template>
  
  <!-- Dialog template #2 -->
  <ng-template #secondDialog>
    <div>
        <p>The content of this dialog came from an <code>ng-template</code>! Mind-blowing, right? (However, this wasn't passed in to a method while the other one was)</p>
        <mat-slide-toggle>I'm a slide toggle!</mat-slide-toggle>
        <mat-checkbox>I'm a checkbox!</mat-checkbox>
    </div>
  </ng-template>
````

*home.component.ts*

````javascript
import { TemplateDialogComponent } from './../template-dialog/template-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog-dashboard',
  templateUrl: './dialog-dashboard.component.html',
  styleUrls: ['./dialog-dashboard.component.scss']
})
export class DialogDashboardComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }
  @ViewChild('secondDialog', { static: true }) secondDialog: TemplateRef<any>;

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    //this.dialog.open(templateRef);
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '40%',
      data: {
        title: 'Dialog by TemplateRef',
        template: templateRef
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDialogWithoutRef() {
    //this.dialog.open(this.secondDialog);

    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '40%',
      data: {
        title: 'Dialog without TemplateRef',
        template: this.secondDialog
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }
}

````
  
</details>


