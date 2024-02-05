[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# UI

* [Frameworks](#frameworks)       
* [Icons](#icons)
* [Svg](#svg)     
* [Svg custom et mat-icon](#svg-custom-et-mat-icon)       
* [Theming](#theming)     
* [Variables sass](#variables-sass)     
* [Dynamic styling](#dynamic-styling)     
* [Angular Material tips](https://github.com/gsoulie/angular-resources/blob/master/ng-material-tips.md)       
* [Custom fonts](#custom-fonts)     

[officials links](https://angular.io/resources?category=development)       


## Frameworks

Best 4       
[official](https://material.angular.io/guide/getting-started)       
https://valor-software.com/ngx-bootstrap/#/documentation       
https://primefaces.org/primeng/showcase/#/setup        
https://ng-bootstrap.github.io/#/home       
       
http://ng-lightning.github.io/ng-lightning/#/get-started       
https://ng.ant.design/components/button/en        
http://ng.mobile.ant.design/#/docs/getting-started/en      
https://alyle.io/getting-started/installation       

### Material Angular
[Back to top](#ui)  

Exemple dashboard complet : https://dev.to/cubejs/angular-dashboard-with-material-1aj      

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

### Tailwind

* https://daisyui.com/     
* https://merakiui.com/     
* https://tailblocks.cc/     
* 

## Icons
[Back to top](#ui)

Liste des icônes Material : https://www.angularjswiki.com/fr/angular/angular-material-icons-list-mat-icon-list/       

## Svg

<details>
	<summary>Composant custom permettant de facilement manipuler un svg (couleur, taille, url)</summary>
> Important : si l'icône ne s'affiche pas, essayer de le placer dans une div en mode flex avec des dimensions pour tester
	
*svg-icon.component.ts*

````typescript
import { Component, HostBinding, Input } from "@angular/core";

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: ``,
  styles: `
  :host {
    /*height: 100%;
    width: 100%;*/
    -webkit-mask-size: contain;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
  }
  `
})

export class SvgIconComponent {

  @HostBinding('style.-webkit-mask-image')
  private _path!: string;

  @Input()
  public set path(filePath: string) {
    this._path = `url("${filePath}")`;
    // this._path = `url("./assets/icons/${filePath}")`;	// si on sait que les svg sont localisé de manière précise
  }

  @HostBinding('style.background-color') private _svgColor: string = 'black';
  @Input()
  public set color(color: string) {
    this._svgColor = `${color}`;
  }

  @HostBinding('style.height') private _height: string = '30px';
  @Input()
  public set height(height: string) {
    this._height = `${height}`;
  }

  @HostBinding('style.width') private _width: string = '30px';
  @Input()
  public set width(width: string) {
    this._width = `${width}`;
  }
}
````

*Utilisation*

````typescript
<app-svg-icon path="./assets/icons/user.svg" color="red" height="60px" width="60px" />
<!-- <app-svg-icon path="user.svg" color="red" height="60px" width="60px" />-->
````

</details>

## Svg custom et mat-icon
[Back to top](#ui)

### Traitement des svg

L'utilisation de svg custom avec **mat-icon** nécessite quelques règles. Notamment, l'utilisation de svg avec un format **SANS** classes css dans le code :

**FORMAT A EVITER**

````html
<svg xmlns="http://www.w3.org/2000/svg" width="22.044" height="26" viewBox="0 0 22.044 26"><defs>
<style>.a,.b{fill:none;stroke:#767676;stroke-width:2px;}.a{stroke-miterlimit:10;}
.b{stroke-linecap:round;stroke-linejoin:round;}</style></defs>
<g transform="translate(1.022 1)">
<path class="a" d="M750.259,434.341a2.038,2.038,0,0,1-.134.731,6.268,6.268,0,0,0-2.252-.334,6.2,6.2,0,0,0-1.829.336,2.05,2.05,0,0,1-.134-.734,2.175,2.175,0,0,1,4.349,0Z" transform="translate(-738.111 -432.23)"/>
<path class="b" d="M735.872,460H718.9a1.511,1.511,0,0,1-1.39-2.188l3.221-6.193a3.345,3.345,0,0,0,.38-1.544v-2.207a6.222,6.222,0,0,1,8.244-5.841,6.03,6.03,0,0,1,4.163,5.682v2.265a3.756,3.756,0,0,0,.426,1.738l3.238,6.223A1.426,1.426,0,0,1,735.872,460Z" transform="translate(-717.342 -439.181)"/>
<path class="a" d="M749.655,511.531a2.539,2.539,0,0,1-5.075,0,2.33,2.33,0,0,1,.112-.721h4.851A2.334,2.334,0,0,1,749.655,511.531Z" transform="translate(-737.144 -489.994)"/></g></svg>
````

**FORMAT à privilégier**

````html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24.204" viewBox="0 0 24 24.204">
  <g id="icon-biscuit-24" transform="translate(1 1)">
    <g id="Groupe_379" data-name="Groupe 379" transform="translate(-444.79 -287.413)">
      <path id="Tracé_105" data-name="Tracé 105" d="M446.009,289.033a4.819,4.819,0,0,1,3.607-1.62,4.876,4.876,0,0,1,3.42,1.421l1.692,1.693a1.483,1.483,0,0,0,2.1,0l1.483-1.484a5.029,5.029,0,0,1,7.2-.051,4.831,4.831,0,0,1-.138,6.7l-1.691,1.693a1.485,1.485,0,0,0,0,2.1l1.5,1.5a5.018,5.018,0,0,1,.055,7.174,4.892,4.892,0,0,1-6.7-.136l-1.691-1.692a1.483,1.483,0,0,0-2.1,0l-1.547,1.547a4.989,4.989,0,0,1-6.289.744,4.809,4.809,0,0,1-2.115-4.021,4.749,4.749,0,0,1,1.4-3.422l1.7-1.7a1.485,1.485,0,0,0,0-2.1l-1.512-1.512A5.01,5.01,0,0,1,446.009,289.033Z" fill="none" stroke="#767676" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line id="Ligne_36" data-name="Ligne 36" x1="0.927" y2="0.927" transform="translate(462.26 292.465)" fill="none" stroke="#767676" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line id="Ligne_37" data-name="Ligne 37" x1="0.927" y2="0.927" transform="translate(458.004 293.248)" fill="none" stroke="#767676" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
  </g>
</svg>
````

Pour pouvoir ensuite changer la couleur des svg à la volée via le css, il faut "nettoyer" le fichier svg de tous ses attributs contenants une couleur *#xxxxx*

Par exemple le svg ci-dessus donnerai ceci une fois nettoyé :

````html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24.204" viewBox="0 0 24 24.204">
  <g id="icon-biscuit-24" transform="translate(1 1)">
    <g id="Groupe_379" data-name="Groupe 379" transform="translate(-444.79 -287.413)">
      <path id="Tracé_105" data-name="Tracé 105" d="M446.009,289.033a4.819,4.819,0,0,1,3.607-1.62,4.876,4.876,0,0,1,3.42,1.421l1.692,1.693a1.483,1.483,0,0,0,2.1,0l1.483-1.484a5.029,5.029,0,0,1,7.2-.051,4.831,4.831,0,0,1-.138,6.7l-1.691,1.693a1.485,1.485,0,0,0,0,2.1l1.5,1.5a5.018,5.018,0,0,1,.055,7.174,4.892,4.892,0,0,1-6.7-.136l-1.691-1.692a1.483,1.483,0,0,0-2.1,0l-1.547,1.547a4.989,4.989,0,0,1-6.289.744,4.809,4.809,0,0,1-2.115-4.021,4.749,4.749,0,0,1,1.4-3.422l1.7-1.7a1.485,1.485,0,0,0,0-2.1l-1.512-1.512A5.01,5.01,0,0,1,446.009,289.033Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line id="Ligne_36" data-name="Ligne 36" x1="0.927" y2="0.927" transform="translate(462.26 292.465)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      <line id="Ligne_37" data-name="Ligne 37" x1="0.927" y2="0.927" transform="translate(458.004 293.248)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
  </g>
</svg>

````
[Back to top](#ui)

### Service registry

Ensuite pour utiliser les svg avec des *mat-icon* il faut "enregistrer" les svg au lancement de l'application avec un **MatIconRegistry**

Pour se faire, créer le service ci-dessous

*icon.service.ts*

````typescript
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export enum Icons {
  Gris = 'icon-gris',	// <-- Nom du fichier svg sans l'extension
  Orange = 'icon-orange',
  Rouge = 'icon-rouge',
  Incolore = 'icon-incolore'
}

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer) { }

  public registerIcons(iconPath: string): void {
    this.loadIcons(
      Object.values(Icons),
      iconPath);
  }

  private loadIcons(iconsKey: string[], iconUrl: string): void {
    iconsKey.forEach(key => {
      this.matIconRegistery.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`));
    });
  }
}
````

Injecter le service dans *app.component.ts* et enregistrer les icônes

*app.component.ts*

````typescript
import { IconsService } from './services/icons.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private iconService: IconsService) {
    this.iconService.registerIcons('assets');
  }
}

````
[Back to top](#ui)

### Utilisation

````html
<mat-icon svgIcon="icon-incolore" class="strokeBlue"></mat-icon>
<mat-icon svgIcon="icon-incolore" class="strokeGreen"></mat-icon>
````

````css
.strokeBlue {
  stroke: blue !important;
}
.strokeGreen {
  stroke: green !important;
}
````

## mat-button avec svg custom

<details>
	<summary></summary>

 ````html
<button mat-button>
    <div
      [style.display]="'flex'"
      [style.align-items]="'center'"
      [style.gap]="'10px'"
    >
      <div
	[style.display]="'flex'"
	[style.height]="'24px'"
	[style.width]="'24px'"
      >
	<app-svg
	  path="filter.svg"
	  color="#333333"
	  height="24px"
	  width="24px"
	/>
      </div>
      More filters
    </div>
  </button>
````
</details>

## Theming
[Back to top](#ui)     

## Angular material 15

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

## Ancienne méthode
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


## Custom fonts
[Back to top](#themes)    

Télécharger la font choisie et la copier dans le répertoire *src/assets/fonts*

Ensuite ajouter les déclaration *@font-face* pour chaque font à utiliser, dans le fichier global scss

*variable.scss*

```
@font-face {
    font-family: "AguafinaScript-Regular";
    src: url("../assets/fonts/AguafinaScript-Regular.ttf") format("truetype");
    font-weight: 200;
    font-style: normal;
}
@font-face {
    font-family: "DINPro";
    src: url("../assets/fonts/DINPro.otf") format("opentype");
    font-weight: 200;
    font-style: normal;
    font-display: swap;	// Ensure text remains visible during webfont load 
}
@font-face {
    font-family: "DINPro-Italic";
    src: url("../assets/fonts/DINPro-Italic.otf") format("opentype");
    font-weight: 200;
    font-style: normal;
    font-display: swap;	// Ensure text remains visible during webfont load 
}
:root {
    --ion-font-family: 'DINPro';
    ...
    ...
}
```

**Important** : *format()* doit reprendre le vrai nom de format de la font (i.e ttf = truetype, otf = opentype)

Utiliser ensuite les fonts comme suit :

*home.scss*

```
ion-title{
	font-family: "AguafinaScript-Regular" !important;
}
.label1{
	font-family: "DINPro" !important;
	font-size: 18px;
}
.label2{
	font-family: "DINPro-Italic" !important;
	font-size: 18px;
}
```

** Assign font-family to the entire app**

*global.scss*

```
* {
	font-family: 'My-custom-font' !important;
}
```

### Set default project custom font

*variable.scss*
````css
@font-face {
font-family: AppFont;
src: url("…/assets/fonts/Oxygen-Regular.ttf"); //change url accordingly
}

:root {
	--ion-font-family: ‘AppFont’;
}
````
[Back to top](#ui)    
