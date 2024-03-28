[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Angular material tips

Pour surcharger les composant Angular Material, il est important d'utiliser le combinator **::ng-deep** (qui remplace l'ancienne syntaxe */deep/*).
* [Schematic commands](#schematic-commands)      
* [Customiser le thème angular material](https://dev.to/codingcatdev/angular-material-theming-32km)     
* [Surcharge de style](#surcharge-de-style)     
* [mat-progress-bar](#mat-progress-bar)       
* [mat-badge](#mat-badge)      
* [mat-checkbox](#mat-checkbox)      
* [mat-radio-button](#mat-radio-button)      
* [mat-input](#mat-input)   
* [mat-form-field](#mat-form-field)          
* [mat-slide-toggle](#mat-slide-toggle)     
* [mat-dialog](#mat-dialog)     
* [mat-select](#mat-select)     
* [unités % vs vh](#unites-%-vs-vh)     
* [custom css menu](#custom-css-menu)       
* [mat-table](#mat-table)       
* [input](#input)
* [matTooltip](#matTooltip)     

## Schematic commands

Générer un composant contenant un nav menu :
````ng g @angular/material:nav <component-name>````

## Customiser le theme Material

<details>
    <summary>Créer un thème custom (Angular 15+)</summary>

Créer un fichier scss contenant les palettes personnalisées. Les palettes custom peuvent être créées via le site http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5       

*custom-palette.scss*

````css
$md-customprimary: (
  50: #e0f1ff,
  100: #b3ddff,
  200: #80c7ff,
  300: #4db0ff,
  400: #269fff,
  500: #008eff,
  600: #0086ff,
  700: #007bff,
  800: #0071ff,
  900: #005fff,
  A100: #ffffff,
  A200: #f2f6ff,
  A400: #bfd3ff,
  A700: #a6c1ff,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #000000,
    400: #000000,
    500: #ffffff,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #000000,
    A200: #000000,
    A400: #000000,
    A700: #000000,
  ),
);

$md-customaccent: (
  50: #e5f4f3,
  100: #bee4e1,
  200: #93d3cd,
  300: #67c1b8,
  400: #47b3a9,
  500: #26a69a,
  600: #229e92,
  700: #1c9588,
  800: #178b7e,
  900: #0d7b6c,
  A100: #adfff3,
  A200: #7affec,
  A400: #47ffe4,
  A700: #2dffe0,
  contrast: (
    50: #000000,
    100: #000000,
    200: #000000,
    300: #000000,
    400: #000000,
    500: #ffffff,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #000000,
    A200: #000000,
    A400: #000000,
    A700: #000000,
  ),
);

````

Ensuite dans le **styles.scss** importer le fichier contenant les palettes custom en utilisant la structure suivante :

*styles.scss*

````css
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@use "@angular/material" as mat;
@import "./theme.scss";	// <========== Import du fichier contenant les palettes custom

@include mat.core();

$testAngular16-primary: mat.define-palette($md-customprimary);	// <======= définir les palettes pour chaque niveau
$testAngular16-accent: mat.define-palette($md-customaccent);

// The warn palette is optional (defaults to red).
$testAngular16-warn: mat.define-palette($md-customprimary);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as "color" or "typography".
$testAngular16-theme: mat.define-light-theme(
  (
    color: (
      primary: $testAngular16-primary,
      accent: $testAngular16-accent,
      warn: $testAngular16-warn,
    ),
  )
);

@include mat.all-component-themes($testAngular16-theme);

* {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
````

### Ancienne méthode
[Documentation](https://material.angular.io/guide/theming)     

Créer un fichier src/mon-theme.scss contenant la structure suivante (attention le fichier doit être de type **scss**):

````typescript
@import '~@angular/material/theming';
@include mat-core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$my-app-primary: mat-palette($mat-green);
$my-app-accent:  mat-palette($mat-pink, A200, A100, A400);

// The warn palette is optional (defaults to red).
$my-app-warn:    mat-palette($mat-red);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as `color` or `typography`.
$my-app-theme: mat-light-theme($my-app-primary, $my-app-accent, $my-app-warn);

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include angular-material-theme($my-app-theme);

.alternate-theme {
  $alternate-primary: mat-palette($mat-light-blue);
  $alternate-accent:  mat-palette($mat-yellow, 400);
  $alternate-theme: mat-light-theme($alternate-primary, $alternate-accent);
  @include angular-material-theme($alternate-theme);
}

````

Mettre à jour le *angular.json* pour pointer sur ce fichier thème

````typescript
"styles": [
      {
	"input": "src/mon-theme.scss"
      },
      "src/styles.scss"
],
````

*Utilisation*

````html
<mat-card>
      Main Theme:
      <button mat-raised-button color="primary">
        Primary
      </button>
      <button mat-raised-button color="accent">
        Accent
      </button>
      <button mat-raised-button color="warn">
        Warning
      </button>
    </mat-card>
    <br>
    <mat-card class="alternate-theme">
      Alternate Theme:
      <button mat-raised-button color="primary">
        Primary
      </button>
      <button mat-raised-button color="accent">
        Accent
      </button>
      <button mat-raised-button color="warn">
        Warning
      </button>
</mat-card>
````

</details>

## Surcharge de style

### mat-progress-bar
[Back to top](#angular-material-tips)      

Customize progress bar colors :

````css
:host ::ng-deep .mat-progress-bar-fill::after {
    background-color: #E2001A;
}

:host ::ng-deep .mat-progress-bar-buffer {
    background: #D7D7D7;
}
````

### mat-badge
[Back to top](#angular-material-tips)      

````css
// surcharge de la couleur de fond et de la font
:host ::ng-deep .mat-badge-content {
    background: #767676 !important;
    color: red;
}
````

### mat-checkbox
[Back to top](#angular-material-tips)     

````css
// changer le border radius de la coche
.mat-mdc-checkbox._mat-animation-noopable *,
.mat-mdc-checkbox._mat-animation-noopable *::before {
  border-radius: 5px !important;
}

// changer le background et le border en mode disabled
.mdc-checkbox--disabled {
  .mdc-checkbox__background {
    background-color: $grey150 !important;
    border-color: $grey200 !important;
  }
}
````

<details>
	<summary>old</summary>
 
*html* 
````html 
<mat-checkbox class="custom-frame">Indeterminate</mat-checkbox>
````

````css
::ng-deep .custom-frame {
  & .mat-checkbox-background, .mat-checkbox-frame {
    border-radius: 70% !important;
    border-color: #009DE0;
    height: 24px;
    width: 24px;
  }

  & .mat-checkbox-checkmark-path {
    stroke: white !important;
  }

  & .mat-checkbox-checkmark {
    width: 20px;
    top: 2px;
    left: 2px;
  }
}
::ng-deep .mat-checkbox-checked.mat-accent .mat-checkbox-background {
  background-color: #48CE8B !important;

  & .mat-checkbox-background, .mat-checkbox-frame {
    border-radius: 70% !important;
    border-color: #48CE8B;
    height: 24px;
    width: 24px;
  }
}
::ng-deep .mat-checkbox-inner-container {
  height: 24px !important;
  width: 24px !important;
}
````
</details>

### mat-radio-button 
[Back to top](#angular-material-tips)    

````<mat-radio-button class="custom-radio">Indeterminate</mat-checkbox>````

*global.scss*
````css
.custom-radio {
  & .mat-radio-outer-circle {
    border-color: $color-light-blue;
    height: 24px;
    width: 24px;
  }
  & .mat-radio-inner-circle {
    background-color: $color-status-green !important;
    height: 32px;
    width: 32px;
    left: -4px;
    top: -4px;
  }
}
.mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle {
  border-color: $color-status-green !important;
}
````

### mat-input
[Back to top](#angular-material-tips)    

*styles.scss*
````css
.mat-input-element {
  padding: 10px !important;
  border: 2px solid $color-border-grey !important;
  border-radius: 5px !important;
  color: $color-text !important;
  font-size: 20px !important;
  font-family: $font-family-bold !important;
  width: auto;
}
.mat-input-element::placeholder{
  color: $color-text;
  font-size: 20px;
  font-family: $font-family-bold;
}
````

#### Customiser un input de type="time"

Exemple, afficher un champ ````<input matInput type="time">```` pour lequel la partie minute est bloquée et non modifiable et pour lequel le bouton "horloge" qui affiche les rouleaux natifs n'est pas visible (pour éviter de pouvoir saisir des minutes).

*html*
````html
<input matInput type="time" step="3600" [(ngModel)]="startTime" (change)="changeTime()">
````

*css*
````css
input[type="time"]::-webkit-calendar-picker-indicator {
  background: none !important;
  display:none !important;
}
````

**Explications :** le paramètre ````step="3600"```` permet l'incrémentation du champ par pas de 1h (via les flèches haut/bas).

### mat-form-field
[Back to top](#angular-material-tips)    

Pour masquer le sous-lignage de l'input, il suffit de positionner la propriété *appearance* à **none**

*view.html*
````html
<mat-form-field appearance="none">
    <input matInput placeholder="my text">
</mat-form-field>
````

Supprimer la couleur de fond lors du survol

````css
// Supprimer le fond du mat-form-field lors du focus
.mat-mdc-form-field-focus-overlay {
  background-color: transparent !important;
}
````

Supprimer la zone "info" sous le champs de saisie (peut être insérer dans une classe pour ne pas l'appliquer à tous les champs)

````css
// Supprimer la zone d'info sous le champs de saisie
.mat-mdc-form-field-subscript-wrapper {
display: none !important;
}
````

Autres customisations 

````css
mat-form-field {
  width: 100%;
}
::ng-deep .mat-form-field-label {
  color: darkgrey !important;
}
::ng-deep .mat-focused .mat-form-field-label {
  color: #C2185B !important;
 }

 ::ng-deep.mat-form-field-underline {
  /*change color of underline*/
  background-color: #C2185B !important;
}

::ng-deep.mat-form-field-ripple {
 /*change color of underline when focused*/
 background-color: #C2185B !important;;
}
````

### mat-slide-toggle
[Back to top](#angular-material-tips)      

<details>
	<summary>Depuis Angular 15</summary>

*style.scss*
````typescript
@use "@material/switch/switch" as mdc-switch;
@use "@material/switch/switch-theme" as mdc-switch-theme;

$_color-selected-handle: red;
$_color-unselected-handle: yellow;

$_color-unselected-track: grey;
$_color-selected-track: purple;
$_color-disabled-selected-track: $_color-selected-track;
$_color-disabled-unselected-track: $_color-unselected-track;

.mat-mdc-slide-toggle {
  .mdc-switch {
    @include mdc-switch-theme.theme(
      (
        //handle color
        disabled-selected-handle-color: $_color-selected-handle,
        disabled-unselected-handle-color: $_color-unselected-handle,

        selected-handle-color: $_color-selected-handle,
        selected-focus-handle-color: $_color-selected-handle,
        selected-hover-handle-color: $_color-selected-handle,
        selected-pressed-handle-color: $_color-selected-handle,

        unselected-handle-color: $_color-unselected-handle,
        unselected-focus-handle-color: $_color-unselected-handle,
        unselected-hover-handle-color: $_color-unselected-handle,
        unselected-pressed-handle-color: $_color-unselected-handle,

        //tracks color
        // disabled-selected-track-color: $_color-selected-track,
        // disabled-unselected-track-color: $_color-unselected-track,
        // selected-track-color: $_color-selected-track,
        // selected-focus-track-color: $_color-selected-track,
        // selected-hover-track-color: $_color-selected-track,
        // selected-pressed-track-color: $_color-selected-track,
        // unselected-track-color: $_color-unselected-track,
        // unselected-focus-track-color: $_color-unselected-track,
        // unselected-hover-track-color: $_color-unselected-track,
        // unselected-pressed-track-color: $_color-unselected-track,
        // icon colors
        disabled-selected-icon-color: $_color-selected-handle,
        disabled-unselected-icon-color: $_color-unselected-handle,
        selected-icon-color: $_color-selected-handle,
        unselected-icon-color: $_color-unselected-handle
      )
    );
  }
}

// Retirer l'indicateur checkmark

.mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon {
  display: none !important;
}
.mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon {
  display: none !important;
}

````
</details>
 
<details>
	<summary>Avant Angular 15</summary>

 *home.component.scss*
````css
:host ::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {
  background-color: #009DE0 !important;
}
:host ::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {
  background-color: white !important;
  border: 1px solid #009DE0;
}
:host ::ng-deep .mat-slide-toggle-bar {
  background-color: #D8E0ED !important;
}
:host ::ng-deep .mat-slide-toggle-thumb {
  background-color: white !important;
  border: 1px solid #D8E0ED;
}
````

</details>


### mat-dialog
[Back to top](#angular-material-tips)    

*modale.html*
````html
<div class="dialog-title">
  <button mat-icon-button aria-label="Fermer fenêtre de confirmation"
   class="close-button"
   (click)="close()">
    <img src="./assets/icons/icon_close_w.svg">
  </button>
</div>
<mat-dialog-content>
  {{ message }}
</mat-dialog-content>
<mat-dialog-actions>
  <button
    aria-label="Ne pas supprimer la saisie"
    [autofocus]="false"
    mat-button
    class="btn-rounded-std btn-basic-white"
    (click)="cancel()">Non</button>
    <button
    aria-label="Confirmer la suppression de la saisie"
    mat-button class="btn-white"
    (click)="validate()">Oui</button>
</mat-dialog-actions>
````
*global style.scss*

````css
.dialog-overlay {
  mat-dialog-container {
    background-color: $color-dark-grey !important;
    color: white !important;
    border-radius: 10px !important;
    padding: 0 30px 30px 30px !important;
    font-family: $font-family-bold;
  }
}
````

*modale.scss*
````css
@import "../../../styles/variables.scss";
.dialog-title {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
mat-dialog-actions {
  button {
    flex-grow: 1;
  }
}
.btn-white {
  border-radius: 50px !important;
  text-transform: none;
  font-family: $font-family-medium !important;
  font-size: 16px;
  height: 44px !important;
  padding-left: 20px;
  padding-right: 20px;
  background-color: white !important;
  color: $color-dark-grey !important;
}
.mat-icon-button ::ng-deep .mat-button-focus-overlay {
  display: none !important;
}

````

### mat-select
[Back to top](#angular-material-tips)    

<details>
    <summary>Material 15+</summary>

## Angular Material 3

### mat-select

````css
.mdc-list-item--selected {
  //font-family: $font-family-base !important;
}

// Couleur de l'item sélectionné (liste dépliée)
.mdc-list-item--selected .mdc-list-item__primary-text {
  color: orange !important;
}

// Couleur de l'item sélectionné (liste repliée)
.mat-mdc-select-value-text {
  color: red !important;
}

// Couleur de la checkmark de l'item sélectionné (liste dépliée)
.mat-pseudo-checkbox-checked::after {
  color: var(--color-green-text) !important;
}
````
</details>

<details>
    <summary>Anciennes versions de material</summary>

````html
<mat-select
  panelClass="comboOverlay"
  placeholder="Select entry"
  [(ngModel)]="selectedEntry">
    <mat-option [value]="w.id" *ngFor="let w of wharf">{{ w.title }}</mat-option>
</mat-select>
````

*style.scss*

````css
.mat-select {
  padding: 10px 0 10px 0 !important;
  border: 2px solid $color-border-grey !important;
  border-radius: 5px !important;
  color: $color-text !important;
  font-family: $font-family-base !important;
  font-size: 16px !important;
  width: auto;
  text-align: center !important;
}
.mat-select-value-text, .mat-select-placeholder {
  color: $color-text;
  font-family: $font-family-base !important;
  font-size: 16px !important;
}
.mat-select-panel .mat-option.mat-selected:not(.mat-option-multiple) {
  background: $color-light-grey !important;
}
.mat-option.mat-active {
  background: $color-light-grey !important;
  color: $color-dark-blue-font !important;
  font-weight: bold;
}

.comboOverlay.mat-select-panel {
  background-color: white !important;

  .mat-option-text {
    color: $color-text !important;
  }
  .mat-option.mat-active {
    color: $color-dark-blue-font !important;
  }
}
````
</details>


[Back to top](#angular-material-tips)    

*home.html*

````typescript
<app-header
  class="entry-header"
  [title]="'Annuler ma saisie'"
  [subTitle]="'Informations'"
  (cancelShift)="cancelShift($event)"
  (saveEntry)="save($event)"></app-header>
<app-sub-header
  [leftInfo]="currentEntry?.date | date:'EEE d MMMM' | titlecase"
  [rightInfo]="shiftLabel">
</app-sub-header>

<div class="scrolling-content">
</div>
````

*home.scss*

````css
.entry-header {
  position: fixed !important;
  top: 0px !important;
  width: 100%;
  background: transparent !important;
  z-index: 20;
}
.scrolling-content {
  z-index: 10;
  position: relative;
  width: 100%;
  //top: 180px !important;
  margin-bottom: 60px;
}
````

*app-header.html*

````html
<mat-toolbar class="header-toolbar">
  <div class="header-toolbar-overlay">
    <button mat-icon-button (click)="close()" aria-label="Annuler la saisie">
      <img src="../assets/icons/icon_close_w.svg">
    </button>
    <span>{{ title }}</span>
    <span class="toolbar-spacer"></span>
    <button mat-icon-button (click)="save()" aria-label="Enregistrer la saisie">
      <mat-icon>save</mat-icon>
    </button>
  </div>
</mat-toolbar>
````
````css
.mat-icon-button ::ng-deep .mat-button-focus-overlay {
  display: none !important;
}
.toolbar-spacer {
  flex: 1 1 auto;
}
.header-toolbar {
  background-color: transparent !important;
  height: 64px;
  padding: 0px !important;
}
.header-toolbar-overlay {
  background-color: $color-dark-blue;
  color: white;
  font-family: $font-family-base;
  font-size: 16px;
  height: 64px;
  width: 100%;
  border-radius: 0 0 30px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px 0 20px;
}
.header-toolbar-content {
  background-color: $color-dark-blue-header;
  color: white;
  font-family: $font-family-base;
  font-size: 16px;
  border-radius: 0 0 30px 30px;
  padding: 20px;
  margin-top: -1px;
}
.header-toolbar-content-section-title {
  color: white;
  font-family: $font-family-bold;
  font-size: 16px;
  width: 100%;
}
````

*app-sub-header.html*

````html
<div class="header-toolbar-content top-spacer">
  <span class="header-toolbar-content-section-title">Informations</span>
  <div class="bottom-line">
    <div class="bottom-line-col">
      <img aria-label="Date de la saisie" src="../assets/icons/icon_calendrier_18_bleu.svg">
      <span class="text-white">{{ leftInfo }}</span>
    </div>
    <div class="bottom-line-col">
      <img aria-label="Plage horaire du shift sélectionné" src="../assets/icons/icon_horloge_18_bleu.svg">
      <span class="text-white">{{ rightInfo }}</span>
    </div>
  </div>
</div>
````

````css
.top-spacer {
  padding-top: 78px;
}
.bottom-line {
  padding-top: 10px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.bottom-line-col {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;

  img {
    margin-right: 10px;
  }
}
.mat-icon-button ::ng-deep .mat-button-focus-overlay {
  display: none !important;
}
.toolbar-spacer {
  flex: 1 1 auto;
}

````

## Custom css menu
[Back to top](#angular-material-tips)    

https://www.youtube.com/watch?v=ArTVfdHOB-M&ab_channel=OnlineTutorials

[Back to top](#angular-material-tips)    

## mat-table

<details>
	<summary>Table avec column chooser, drag and drop colonne, colonne éditable</summary>

*table.component.html*
````html
<button mat-icon-button [matMenuTriggerFor]="menu" aria-label="column chooser">
  <mat-icon>view_column</mat-icon>
</button>
<mat-menu #menu="matMenu">
  <button mat-menu-item (click)="showHideCol('code')">
    <mat-icon>{{
      colIsVisible("code") ? "visibility_off" : "visibility"
    }}</mat-icon>
    <span>Code</span>
  </button>
  <button mat-menu-item (click)="showHideCol('description')">
    <mat-icon>{{
      colIsVisible("description") ? "visibility_off" : "visibility"
    }}</mat-icon>
    <span>Description</span>
  </button>
</mat-menu>

<div class="table-container">
  <table
    mat-table
    [dataSource]="(dataset$ | async) ?? []"
    matSort
    cdkDropList
    cdkDropListOrientation="horizontal"
    (cdkDropListDropped)="drop($event)"
  >
    <ng-container matColumnDef="code">
      <th
        mat-header-cell
        *matHeaderCellDef
        mat-sort-header
        cdkDrag
        sortActionDescription="Sort by code"
      >
        Code
        <button
          mat-icon-button
          aria-label="switch to edit mode"
          (click)="setEditMode()"
        >
          <mat-icon>edit</mat-icon>
        </button>
      </th>
      <td mat-cell *matCellDef="let element">
        @if(editMode()) {
        <mat-form-field>
          <mat-select matNativeControl id="code" [value]="element.code">
            <mat-option [value]="element.code">{{ element.code }}</mat-option>
          </mat-select>
        </mat-form-field>
        } @else {
        {{ element.code }}
        }
      </td>
    </ng-container>

    <ng-container matColumnDef="description">
      <th
        mat-header-cell
        *matHeaderCellDef
        mat-sort-header
        cdkDrag
        sortActionDescription="Sort by description"
      >
        Description
      </th>
      <td mat-cell *matCellDef="let element">
        @if(editMode()) {
        <mat-form-field class="form-field-flex">
          <input matInput id="description" [value]="element.description" />
        </mat-form-field>
        } @else {

        {{ element.description }}
        }
      </td>
    </ng-container>

    <ng-container matColumnDef="rate">
      <th
        mat-header-cell
        *matHeaderCellDef
        mat-sort-header
        cdkDrag
        sortActionDescription="Sort by rate"
      >
        Rate (%)
      </th>
      <td mat-cell *matCellDef="let element">{{ element.rate }}</td>
    </ng-container>

    <tr
      mat-header-row
      *matHeaderRowDef="displayedColumns()"
      class="table-header"
    ></tr>
    <tr
      class="table-row"
      mat-row
      *matRowDef="let row; columns: displayedColumns()"
    ></tr>
  </table>
</div>

````

*table.component.ts*
````typescript
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ViewChild, computed, inject, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { FormulaDetail } from "../../../models/formula.model";
import { FormulaService } from "../../../services/formula/formula.service";
import { Observable, map } from "rxjs";
import { MatIconModule } from "@angular/material/icon";

export type TableColumnWithVisible = {
  name: string,
  isVisible: boolean
}

@Component({
  standalone: true,
  selector: 'app-example-table',
  imports: [MatButtonModule, CommonModule, MatTableModule, MatSortModule, CdkDropList, CdkDrag,
    MatSelectModule, MatMenuModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatIconModule],
  templateUrl: './example-table.component.html'
})

export class ExampleTableComponent implements AfterViewInit {
  fullColumns = signal<TableColumnWithVisible[]>([
    { name: 'code', isVisible: true },
    { name: 'description', isVisible: true },
    { name: 'rate', isVisible: true }]);

  //displayedColumns: string[] = ['code', 'description', 'rate'];
  displayedColumns = computed<string[]>(() => this.fullColumns().filter(c => c.isVisible === true).map(c => c.name));

  editMode = signal(false);

  private dataSource = new MatTableDataSource<FormulaDetail>();
  @ViewChild(MatSort) sort!: MatSort;
  private formualService = inject(FormulaService);

  dataset$: Observable<MatTableDataSource<FormulaDetail>> = this.formualService.fetchFormulaDetail()
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
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns(), event.previousIndex, event.currentIndex);
  }

  showHideCol(colName: string) {
    this.fullColumns.update(old =>
      old.map(c => c.name === colName ? { ...c, isVisible: !c.isVisible } : c)
    );
  }

  colIsVisible(colName: string): boolean {
    return this.fullColumns().find(c => c.name === colName)?.isVisible ?? false;
  }

  setEditMode() {
    this.editMode.update(old => !old);
  }
}
````

*service.ts*

````typescript
fetchFormulaDetail(): Observable<FormulaDetail[]> {
    return of([
      { id: 1, code: '2015', description: 'Lorem ipsum dolor', rate: 52.7645 },
      { id: 2, code: '5468', description: 'Lorem ipsum dolor', rate: 21.054 },
      { id: 3, code: '1111', description: 'Lorem ipsum dolor', rate: 10.1523 },
      { id: 4, code: '2457', description: 'Lorem ipsum dolor', rate: 6.0914 },
      { id: 5, code: '3567', description: 'Lorem ipsum dolor', rate: 3.0457 },
      { id: 6, code: '1894', description: 'Lorem ipsum dolor', rate: 2.0305 },
      { id: 7, code: '3237', description: 'Lorem ipsum dolor', rate: 1.5228 },
      { id: 8, code: '6549', description: 'Lorem ipsum dolor', rate: 1.0152 },
      { id: 9, code: '8440', description: 'Lorem ipsum dolor', rate: 0.9949 },
      { id: 10, code: '6549', description: 'Lorem ipsum dolor', rate: 0.9566 },
      { id: 11, code: '7789', description: 'Lorem ipsum dolor', rate: 0.8454 },
      { id: 12, code: '6646', description: 'Lorem ipsum dolor', rate: 0.8445 },
      { id: 13, code: '1123', description: 'Lorem ipsum dolor', rate: 0.7879 },
      { id: 14, code: '6542', description: 'Lorem ipsum dolor', rate: 0.3553 },
      { id: 15, code: '5432', description: 'Lorem ipsum dolor', rate: 0.1604 },
      { id: 16, code: '2984', description: 'Lorem ipsum dolor', rate: 0.014 },
    ])
  }
````

</details>

<details>
	<summary>Customisation</summary>

 ````css
.mat-mdc-table {
  border: 1px solid $grey200 !important;
  border-radius: 6px !important;
}

// border arrondi sur la dernière ligne
table tr:last-child td /*to remove the last border*/ {
  border-bottom-left-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

// Configuration header avec bord arrondi et couleur
.table-header {
  .mat-mdc-header-cell {
    border-top-left-radius: 6px !important;
    border-top-right-radius: 6px !important;
    color: $grey400 !important;
    font-weight: 800 !important;
  }
}
.mat-mdc-header-row {
  background-color: $grey100 !important;
}

// couleur du suvrol d'une ligne
.mat-row:hover > .mat-cell {
  color:  white;
  background: #333;
}

// couleur ligne dépliée (cas d'une table avec expandable row)
.mat-row.expanded {
  border-bottom-color: transparent;
  background-color: rgba(103, 58, 183, 0.1);
}

// affichage curseur sur les lignes non déployées
.mat-row:not(.expanded) {
  cursor: pointer;
}

// style en-tête ligne dépliée
.mat-row.expanded {
  border-bottom-color: transparent;
  background-color: rgba(103, 58, 183, 0.1);
}
````
</details>

[Back to top](#angular-material-tips)    

## input

Ajouter un padding dans les ````<input>```` sans générer un décalage du champ

````css
input {
  border: none;
  padding: 10px;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box;    /* Firefox, other Gecko */
  box-sizing: border-box;         /* Opera/IE 8+ */
}
````

## matTooltip

````css
.mat-mdc-tooltip {
  --mdc-plain-tooltip-supporting-text-size: 14px;
  // --mdc-plain-tooltip-supporting-text-weight: 100;
  // --mdc-plain-tooltip-supporting-text-color: #000;

  display: flex !important;
  padding: 12px !important;
  justify-content: center !important;
  align-items: center !important;
}

.mdc-tooltip__surface {
  border-radius: 4px !important;
  border: 1px solid $grey200 !important;
  background: $grey100 !important;
  padding: 12px !important;
  color: $grey300 !important;

  //letter-spacing: -0.5px !important;
  //border: 1px solid #333 !important;
}
````

[Back to top](#angular-material-tips)    
