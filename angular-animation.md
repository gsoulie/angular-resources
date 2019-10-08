[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Animations    

* [Basics](#basics)      



## Basics
[Back to top](#animations)  

### Plugin installation

```
npm install --save @angular/animations
```

*app.module.ts*

```
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Basic example
[Back to top](#animations)  

In this example, we have a square div represented by ```<div [@divState]="state">```. When clicking on the button, we animate the square div

*home.html*

```
<button class="btn btn-warning" (click)="onAnimate()">animation</button>

<div [@divState]="state" style="width: 100px; height: 100px"></div>
```

*home.ts*

```
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [                 // <= here, describe all states and transitions
    trigger('divState', [
      state('normal', style({
        backgroundColor: 'red',
        transform: 'translateX(0)'
      })),
      state('highlighted', style({
        backgroundColor: 'blue',
        transform: 'translateX(100px)'
      })),
      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(1000))
    ])
  ]
})

export class RecipeListComponent implements OnInit, OnDestroy {
  state = 'normal';
  
  onAnimate() {
    this.state === 'normal' ? this.state = 'highlighted' : this.state = 'normal';
  }
}
```

> **Tip** if you want to use the same duration for the two way transition, you can use the following syntax ```transition('normal <=> highlighted', animate(300))```

> **Tip** If you have more than 2 states you can use ```transition('normal <=> *', animate(300))```

## Control style during transition
[Back to top](#animations)  


