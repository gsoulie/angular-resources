[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Animations    

* [Basics](#basics)      
* [List animations](#list-animations)     
* [keyframes](#keyframes)    



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

export class HomeComponent implements OnInit, OnDestroy {
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

*home.html*

```
<button class="btn btn-warning" (click)="onAnimate()">animation</button>
<button class="btn btn-success" (click)="onShrink()">shrink</button>

<div [@divState]="state" style="width: 100px; height: 100px"></div>
<br>
<div [@wildState]="wildState" style="width: 100px; height: 100px" (mouseenter)="onShrink()" (mouseleave)="onAnimate()"></div>
```

*home.ts*

```
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
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
    ]),
    trigger('wildState', [
      state('normal', style({
        backgroundColor: 'red',
        transform: 'translateX(0) scale(1)'
      })),
      state('highlighted', style({
        backgroundColor: 'blue',
        transform: 'translateX(100px) scale(1)'
      })),
      state('shrunken', style({
        backgroundColor: 'green',
        borderRadius: '100px',
        transform: 'translateX(0) scale(0.5)'
      })),
      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(1000)),
      transition('shrunken <=> *', animate(800))
    ])
  ]
})
export class HomeComponent implements OnInit {
  
  state = "normal";
  wildState = 'normal';
  
  onAnimate() {
    this.state === 'normal' ? this.state = 'highlighted' : this.state = 'normal';
    this.wildState === 'normal' ? this.wildState = 'highlighted' : this.wildState = 'normal';
  }
  onShrink() {
    this.wildState = 'shrunken';
  }
  
}
```

Some style can be added into the transition

```
 transition('shrunken <=> *', animate(800, style({
        borderRadius: '100px' 
      }
```

Or more complex

```
 transition('shrunken <=> *', animate(800, [
      style({
        backgroundColor: 'orange'
      }),
      animate(1000, style({
        borderRadius: '50px'
      })),
      animate(500)
    ])
   ])
```

## List animations
[Back to top](#animations)  

*home.html*

```
<div class="row">
    <div class="col-xs-12">
        <input type="text" #input>
        <button class="btn btn-primary" (click)="onAdd(input.value)">Add Item</button>
        <hr>
        <ul class="list-group">
            <li class="list-group-item" [@list1] (click)="onDeleteItem(item)" *ngFor="let item of list">{{ item }}</li>
        </ul>
    </div>
</div>
```

*home.ts*
```
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
    trigger('list1', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  list = ['tomatoes', 'kiwi', 'banana'];
  
  onAdd(value) {
    this.list.push(value);
  }

  onDeleteItem(value) {
    const index = this.list.indexOf(value);
    this.list.splice(index, 1);
  }
}
```

## Keyframes
[Back to top](#animations)  

Keyframes defines a set of animation styles, associating each style with an optional offset value.

*home.ts*
```
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateX(-100px)'
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(-50px)'
            opacity: 0.5,
            offset: 0.3
          }),
          style({
            transform: 'translateX(-20px)'
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(0px)'
            opacity: 1,
            offset: 1
          }),
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {
  list = ['tomatoes', 'kiwi', 'banana'];
  
  onAdd(value) {
    this.list.push(value);
  }

  onDeleteItem(value) {
    const index = this.list.indexOf(value);
    this.list.splice(index, 1);
  }
}
```
