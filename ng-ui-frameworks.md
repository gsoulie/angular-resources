[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# UI

* [Frameworks](#frameworks)       
* [Icons](#icons)      

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

````
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
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
  MatDatepickerModule,
  MatNativeDateModule,
} from '@angular/material';


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
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AppMaterialModule {}
````

Ensuite importer ce fichier dans le **app.module.ts**

````
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

````
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

```
"styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
]

```

## Icons

Liste des icônes Material : https://www.angularjswiki.com/fr/angular/angular-material-icons-list-mat-icon-list/       

[Back to top](#ui)
