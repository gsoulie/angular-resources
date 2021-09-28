[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Angular material tips

Pour surcharger les composant Angular Material, il est important d'utiliser le combinator **::ng-deep** (qui remplace l'ancienne syntaxe */deep/*).
* [Comprendre ::ng-deep](#comptendre-ng-deep)     
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

## Comprendre ng-deep

La surcharge de composant Angular Material requiert souvent l'utilisation du combinator **::ng-deep**.

L'application de la pseudo-classe **::ng-deep** à n'importe quelle règle CSS **désactive complètement l'encapsulation** de la vue pour cette règle. Tout style avec *::ng-deep* appliqué **devient un style global** !

Afin d'étendre le style spécifié au composant actuel et à tous ses descendants, assurez-vous d'inclure le sélecteur d'hôte **:host** avant *::ng-deep*. Sans ça, le style surchargé avec *::ng-deep* sera appliqué partout dans le projet.

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

### mat-slide-toggle
[Back to top](#angular-material-tips)      

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

*html*

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

[Back to top](#angular-material-tips)    
