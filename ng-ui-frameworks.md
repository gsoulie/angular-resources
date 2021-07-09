[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI

* [Frameworks](#frameworks)       
* [Icons](#icons)      
* [Theming](#theming)     
* [Variables sass](#variables-sass)     
* [Dynamic styling](#dynamic-styling)     
* [Angular Material tips](https://github.com/gsoulie/angular-resources/blob/master/ng-material-tips.md)       

[officials links](https://angular.io/resources?category=development)       


## Frameworks

Best 4       
[official] https://material.angular.io/guide/getting-started       
https://valor-software.com/ngx-bootstrap/#/documentation       
https://primefaces.org/primeng/showcase/#/setup        
https://ng-bootstrap.github.io/#/home       
       
http://ng-lightning.github.io/ng-lightning/#/get-started       
https://ng.ant.design/components/button/en        
http://ng.mobile.ant.design/#/docs/getting-started/en      
https://alyle.io/getting-started/installation       

### Material Angular
[Back to top](#ui)  

````ng add @angular/material````

Pour faciliter la gestion des composants material :

Créer un fichier **material.module.ts** dans le répertoire **app** (avec app.module.ts) dans lequel on va importer tous les modules material nécessaire ex :

> ATTENTION : selon la version d'angular, tous les composants ne sont pas à importer depuis *@angular/material* bien vérifier dans la doc

````typescript
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  exports: [
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSortModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDividerModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatButtonToggleModule
  ]
})
export class AppMaterialModule { }

````

Ensuite importer ce fichier dans le **app.module.ts**

````typescript
import { HomeComponent } from './components/home/home.component';
import { AppMaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

````

*Exemple d'utilisation*

````html
  <mat-toolbar color="primary">
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
      <mat-icon>menu</mat-icon>
    </button>
    <span>Home</span>
    <span class="example-spacer"></span>
    <button mat-icon-button class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
      <mat-icon>favorite</mat-icon>
    </button>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with share icon">
      <mat-icon>share</mat-icon>
    </button>
  </mat-toolbar>
````

### Bootstrap
[Back to top](#ui)   

Installation : ```npm install --save bootstrap```, ensuite ajouter la configuration dans le **angular.json** sous la rubrique ```architect/build/styles``` :

```typescript
"styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
]

```

## Icons

Liste des icônes Material : https://www.angularjswiki.com/fr/angular/angular-material-icons-list-mat-icon-list/       

[Back to top](#ui)


## Theming
[Back to top](#ui)     

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

## Variables sass

Pour rendre les variables sass accessibles dans toutes l'application, les regrouper dans le fichier *src/variables.scss* en les encadrant dans un tag **:root**

*variables.scss*

````css
:root
{
  --darkgrey: #23272D;
  --mediumgrey: #3F464B;
  --mediumgrey2: #5B6164;
  --lightgrey: #ECEDED;
  --labelgrey: #D9D9D9;
  --yellow: #FFD400;
  --lightblue: #75C4D5;
  --mediumblue: #009CBE;
  --green: #70B62C;
}
````

Il suffit ensuite d'injecter le fichier variable.scss dans le *angular.json* 

````typescript
...
"styles": [
              {"input":"src/variables.scss"}
            ],
````

*component.scss file*

````css
.container {
  background-color: var(--mediumgrey);
}
````

Si les variables ne sont pas encadrées par le **:root** elles ne sont accessibles qu'à condition d'importer le ficier *variables.scss* dans chaque feuille de style dans lesquelles on souhaite charger ces variables


## Dynamic styling
[Back to top](#ui)    

### ngStlye

````html
<p [ngStyle]="backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
````

### ngClass

````<label [ngClass]="{'myCssCustomClass': i > 5 ? true : false }">my content</label>````

### Form input error

````css
input.ng-invalid.ng-touched {
    border: 1px solid red;
}
````
[Back to top](#ui)    
