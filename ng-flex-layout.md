[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Flex layout

## Grid vs Flexbox

https://css-irl.info/to-grid-or-to-flex/       
https://webdesign.tutsplus.com/articles/flexbox-vs-css-grid-which-should-you-use--cms-30184       

**Grid** est **2D** (ligne ET colonne), **Flex** est **1D** (ligne OU colonne)

En résumé, Grid est à 2 dimensions, il crée des colonnes ET des lignes réelles. Le contenu s'alignera de l'un à l'autre, comme vous le lui demandez, ce que ne fera pas Flexbox qui est sur 1 seule dimension.

Un des paramètres qui rentre en compte dans le choix d'une méthode ou d'une autre est le fait de devoir utiliser *calc()*. Si vous êtes amenés à utiliser *calc()* pour ajuster un positionnement, alors c'est qu'il faut utiliser *grid* au lieu de *flexbox*. 
Un second paramètre à prendre en compte est qu'un layout est divisé en 12 colonnes, il faut donc se poser la question de ce que l'on souhaite faire lorsque l'on a plus de 9 items et moins de 12 (un débordement sur un multiple de 3 donc). Souhaite-t-on que le dernier item prenne toute la largeur de la dernière ligne, ou faut il qu'il soit centré ?

Il est à noter que *grid* permet aussi de gérer le responsive via l'utilisation de ````auto-fill```` et ````minmax```` là où flexbox nécessite l'utilisation de media-queries pour le faire.

Les 2 méthodes se combinent très bien ensemble et il est recommandé de les utiliser ensemble.

*html*

````html
<h1>css grid</h1>
<div class="container grid">
    <div class="cell">1</div>
    <div class="cell">2</div>
    <div class="cell">3</div>
</div>
<h1>css flexbox</h1>
<div class="container flex">
    <div class="cell">1</div>
    <div class="cell">2</div>
    <div class="cell">3</div>
</div>
<h1>Content shape the layout (flexbox)</h1>
<p>The layout adapts to the content</p>
<div class="container flex2">
    <div class="cell">This is some very long content which willl most likely span on a few lines, depending on the size of the parent and the available space</div>
    <div class="cell">2</div>
    <div class="cell">3</div>
    <div class="cell">4</div>
    <div class="cell">5</div>
</div>
<h1>The layout shape the content (grid with responsive)</h1>
<p>The content adapts to the layout</p>
<div class="flex3">
    <div class="cell2">This is some very long content which willl most likely span on a few lines, depending on the size of the parent and the available space</div>
    <div class="cell2">2</div>
    <div class="cell2">3</div>
    <div class="cell2">4</div>
    <div class="cell2">5</div>
</div>
````

````css
.container {
    padding: 2rem;
}
.cell {
    background-color: lightgreen;
    padding: 2rem;
}
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 1rem;
}

// Equivalent avec Flexbox
.flex {
    display: flex;
    gap: 1rem;
}
.flex > .cell {
    flex-grow: 1;
}
.flex > .cell:nth-child(2) {
    flex-grow: 2;
}

// content shape the layout
.flex2 {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

// the layout shape the content
.flex3 {
    padding: 2rem;
    display: grid;
    grid-gap: 1rem;
    //grid-template-columns: 1fr 1fr 1fr;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));   // to make layout responsive
    // => display many columns as possible with minimum of 1 column
}
.cell2 {
    background-color: lightgreen;
    padding: 2rem;
}
````


## Flex-Layout

Une solution alternative à grid + flexbox qui est basée sur flex-box avec l'intégration directe des media-queries, facilitant ainsi sont utilisation pour faire du responsive.

[Tutorial flex-layout](https://zoaibkhan.com/blog/create-a-responsive-card-grid-in-angular-using-flex-layout-part-1/)       
[Flex-layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/responsive)      
[Documentation](https://github.com/angular/flex-layout/wiki/API-Documentation)      
[Dimensions](https://github.com/angular/flex-layout/wiki/Responsive-API)     

### installation

````
npm install -s @angular/flex-layout
````

*app.component.html*

````html
<mat-toolbar color="primary">
    <span>Card view demo</span>
    <div fxHide.lt-md>
      <span class="column-label">Columns</span>
      <mat-slider [max]="6" [min]="3" [(ngModel)]="gridColumns" [thumbLabel]="true">
      </mat-slider>
    </div>
  </mat-toolbar>
<div class="content">
    <div fxLayout="row wrap" fxLayoutGap="16px grid">
        <div [fxFlex]="(100/gridColumns) + '%'" fxFlex.xs="100%" fxFlex.sm="50%" fxFlex.md="33%" fxFlex.xl="20%" *ngFor="let num of [1,2,3,4,5,6,7]">
        
        <!-- Utiliser le redimenssionnement classique sans le slider -->
            <!-- <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="50%" fxFlex.md="33%" fxFlex.xl="20%" *ngFor="let num of [1,2,3,4,5,6,7]">-->
            <!-- Documentation on sizing : https://github.com/angular/flex-layout/wiki/Responsive-API -->
            <mat-card class="mat-elevation-z4" appCardBorder>
            <mat-card-header>
                <mat-card-title>Himalayan Peaks</mat-card-title>
            </mat-card-header>
            <img mat-card-image src="./../assets/images/2-chtulhu.jpg">
            <mat-card-content>
                <p>
                The Himalayas is a mountain range in Asia.
                </p>
            </mat-card-content>
            <mat-card-actions>
                <button mat-button>LIKE</button>
                <button mat-button>SHARE</button>
            </mat-card-actions>
            </mat-card>
        </div>
    </div>
  </div>
````

*app.component.scss*

````css
.flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}
.box {
    min-width: 200px;
    height: 180px;
    padding: 50px;
    font-size: 22px;
}
.content {
    padding: 16px;
}

.content > mat-card {
    width: 200px;
}

mat-toolbar {
    justify-content: space-between;
}
.content > mat-card {
    margin-bottom: 16px;
}

.column-label {
    margin-right: 8px;
    font-size: 1rem;
}
````
[Back to top](#flex-layout)
