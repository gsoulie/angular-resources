[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Components    

* [Dropdown directive](#dropdown-directive)     


## Dropdown directive
[Back to top](#components)  

In this example we create a dropdown button. The ```appDropdown``` directive shows / hides the menu on the click event

*recipe-detail.component.html*

```
<div class="row">
   <div class="col-xs-12">
       <div class="btn-group" appDropdown>
           <button type="button" class="btn btn-primary dropdown-toggle">Manage Recipe <span class="caret"></span></button>
           <ul class="dropdown-menu">
               <li><a href="#">Add to shopping list</a></li>
               <li><a href="#">Edit recipe</a></li>
               <li><a href="#">Delete recipe</a></li>
           </ul>
       </div>
   </div>
</div>
```

*dropdown.directive.ts* (**To add into the app.module.ts**)

```
import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';
 
@Directive({
   selector: '[appDropdown]'
})
export class DropdownDirective {
   @HostBinding('class.open') isOpen = false;
 
   // listener permettant de fermer la dropdown aussi lors d'un clic n'importe où dans la page
   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
       this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
   }
 
 
   // listener sur événement clic
   /*@HostListener('click') toggleOpen() {
       this.isOpen = !this.isOpen;
   }*/
 
   constructor(private elRef: ElementRef) {}
}
```

```
<nav class="navbar navbar-default">
   <div class="container-fluid">
       <div class="navbar-header">
           <button type="button" class="navbar-toggle" (click)="collapsed = !collapsed">
               <span class="icon-bar" *ngFor="let iconBar of [1, 2, 3]"></span>
           </button>
           <a href="#" class="navbar-brand">Recipe book</a>
       </div>
       <div class="navbar-collapse" [class.collapse]="collapsed" (window:resize)="collapsed = true">
           <ul class="nav navbar-nav">
               <li><a href="#" (click)="onSelect('recipe')">Recipes</a></li>
               <li><a href="#" (click)="onSelect('shopping-list')">Shopping list</a></li>
           </ul>
           <ul class="nav navbar-nav navbar-right">
               <li class="dropdown" appDropdown>
                   <a href="#" class="dropdown-toggle" role="button">Manage <span class="caret"></span></a>
                   <ul class="dropdown-menu">
                       <li><a href="#">Save data</a></li>
                       <li><a href="#">Fetch data</a></li>
                   </ul>
               </li>
           </ul>
       </div>
   </div>
</nav>
```
