[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Flex layout

[Tutorial flex-layout](https://zoaibkhan.com/blog/create-a-responsive-card-grid-in-angular-using-flex-layout-part-1/)       
[Flex-layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/responsive)      
[Documentation](https://github.com/angular/flex-layout/wiki/API-Documentation)      

### installation

````
npm install -s @angular/flex-layout
````

*app.component.html*

````
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
        <div [fxFlex]="(100/gridColumns) + '%'" fxFlex.xs="100%" fxFlex.sm="33%" *ngFor="let num of [1,2,3,4,5,6,7]">
        
        <!-- Utiliser le redimenssionnement classique sans le slider -->
            <!-- <div fxFlex="25%" fxFlex.xs="100%" fxFlex.sm="33%" *ngFor="let num of [1,2,3,4,5,6,7]"> -->
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

````
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
