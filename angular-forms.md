
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Forms    

* [Configuration](#configuration)    
* [Reactive form](#reactive-form)    
* [Template Drive form](#template-drive-form)    
* [Validators](#validators)    
* [Default form values](#default-form-values)    
* [FormGroup](#formgroup)    
* [Full example](#full-example)    


## Configuration
[Back to top](#forms)   

First you need to import ```FormsModule``` in your *app.module.ts* file

*app.module.ts*

```
@NgModule({
 declarations: [
   AppComponent,
   HomeComponent,
   UserComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   AppRoutingModule
 ],
 providers: [],
 bootstrap: [AppComponent]
})
```

## Reactive Form
[Back to top](#forms)   

**Reactive Forms is the BEST WAY to implement forms !**

First you need to import ```ReactiveFormsModule``` into *app.module.ts*

*app.module.ts*
```
@NgModule({
 declarations: [
   AppComponent,
   HomeComponent,
   UserComponent,
   FormComponent
 ],
 imports: [
   BrowserModule,
   FormsModule,
   ReactiveFormsModule,
   AppRoutingModule
 ],
 providers: [],
 bootstrap: [AppComponent]
})
```

*Vue file*

You have to tell Angular to associate the form with the formGroup

```<form [formGroup]=”signupForm”>```

Then you have to associate each field with each formControl defined in the controller

```<input type=”text” id=”username” formControl=”username”>```

Accessing form's data

*Controller file*

```
export class FormComponent implements OnInit {
 
 genders = ['male', 'female'];
 signupForm: FormGroup;
 
 constructor() { }
 ngOnInit() {
   this.signupForm = new FormGroup({
     'username': new FormControl(null, Validators.required),
     'email': new FormControl(null, [Validators.email, Validators.required]),
     'gender': new FormControl('male')
   });
 }
 
 onSubmit() {
   console.log(this.signupForm.value.username);
   console.log(this.signupForm.value.email);
   console.log(this.signupForm.value.gender);
 }
}
```

## Full example
[Back to top](#forms)   

*Vue file*
```
<div class="container">
   <h3>Reactive Form</h3>
   <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
       <div class="form-group">
           <label for="name">Project name</label>
           <input type="text" id="name" formControlName="projectName" class="form-control">
       </div>
       <div class="form-group">
           <label for="email">Email</label>
           <input type="email" id="email" formControlName="projectEmail" class="form-control">
       </div>
       <div class="form-group">
           <label for="status">Project satus</label>
           <select name="" class="form-control" id="status" formControlName="projectStatus" >
               <option value="stable">stable</option>
               <option value="critical">critical</option>
               <option value="finished">finished</option>
           </select>
       </div>
       <button class="btn btn-primary" type="submit">Create</button>
   </form>
</div>
```

*Controller file*

```
import { CustomValidators } from './custom-validator';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
 
@Component({
 selector: 'app-form',
 templateUrl: './form.component.html',
 styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
 
 projectForm: FormGroup;
 
 constructor() { }
 
 ngOnInit() {
   this.projectForm = new FormGroup({
     'projectName': new FormControl(null,
       [Validators.required, CustomValidators.invalidProjectName],
       CustomValidators.asyncInvalidProjectName), // using custom validator
     'projectEmail': new FormControl(null, [Validators.required, Validators.email]),
     'projectStatus': new FormControl("critical"),
   });
 }
 
 onSubmit() {
   console.log(this.projectForm);
 }
}
```

*Custom validator* 

Create custom validator file
```
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
export class CustomValidators {
   static invalidProjectName(control: FormControl): {[s: string]: boolean} {
       if (control.value === 'Test') {
           return {'invalidProjectName': true};
       }
       return null;
   }
 
   static asyncInvalidProjectName(control: FormControl): Promise<any> | Observable<any> {
       const promise = new Promise((resolve, reject) => {
           setTimeout(() => {
               if (control.value === 'Testproject') {
                   resolve({'invalidProjectName': true});
               } else {
                   resolve(null);
               }
           }, 2000);
       });
       return promise;
   }
}
```

## FormArray
[Back to top](#forms)   

*Controller file*

```
for (let ingredient of recipe.ingredients) {
         recipeIngredients.push(
           new FormGroup({
             'name': new FormControl(ingredient.name, Validators.required),
             'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
           })
         );
       }
 
   // form binding
   this.recipeForm = new FormGroup({
     'name': new FormControl(recipeName, Validators.required),
     'imagePath': new FormControl(imageUrl, Validators.required),
     'description': new FormControl(description),
     'ingredients': recipeIngredients
   });
 
```

*FormControl dynamic creation*

```
/**
  * Récupérer la liste des ingrédients pour le FormControl
  */
 getControls() {
   return (this.recipeForm.get('ingredients') as FormArray).controls;
 }
 ```
 
*Vue file*
 
``` 
<div class="row"
  *ngFor="let ingredientCtrl of getControls(); let i = index"
  [formGroupName]="i"
  style="margin-top: 10px;">
  <div class="col-xs-8">
        <input type="text" class="form-control" formControlName="name">
  </div>
  <div class="col-xs-2">
        <input type="number" class="form-control" formControlName="amount">
  </div>                  
```

*Delete item from FormArray*

```
/**
  * Delete the selected item
  * @param index
  */
 onDeleteIngredient(index: number) {
   (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
 }
```


*Remove all elements from FormArray*

```
onDeleteAllIngredients() {
   (this.recipeForm.get('ingredients') as FormArray).clear();
 }
```


## Template Drive Form
[Back to top](#forms)   

### Classic method

*view file*

```
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
  <div id="user-data">
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" class="form-control" ngModel name="username">
    </div>
    <button class="btn btn-default" type="button">Suggest an Username</button>
    <div class="form-group">
      <label for="email">Mail</label>
      <input type="email" id="email" class="form-control" ngModel name="email">
    </div>
  </div>
  <div class="form-group">
    <label for="secret">Secret Questions</label>
    <select id="secret" class="form-control" ngModel name="secret">
      <option value="pet">Your first Pet?</option>
      <option value="teacher">Your first teacher?</option>
    </select>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

*controller file*

```
@ViewChild('f') courseForm: NgForm;

/*
onSubmit(form: NgForm) {
  console.log(form);
}
*/
 onSubmit(form: NgForm) {
	  console.log(form.value.username);
	  console.log(form.value.email);
 }
```

**Some interesting properties**

```dirty <bool>``` : *true* if some values has been modified
```touched / untouched <bool>``` : *true* if the user has clicked on a field
```valid / invalid <bool>``` : useful in case of using validators
```value <Object>``` : contains the values of the fields

### @ViewChild values
[Back to top](#forms)   

Manage form with *@ViewChild* is useful when you want to get access on the form's properties before it's submission. Which it's not possible with the classic method. This permit to preload input's values for example.

*Vue file*

```
<form (ngSubmit)="onSubmit()" #f="ngForm">
 <div id="user-data">
  <div class="form-group">
   <label for="username">Username</label>
   <input type="text" id="username" class="form-control" ngModel name="username">
  </div>
  <button class="btn btn-default" type="button">Suggest an Username</button>
  <div class="form-group">
   <label for="email">Mail</label>
   <input type="email" id="email" class="form-control" ngModel name="email">
  </div>
 </div>
 <div class="form-group">
  <label for="secret">Secret Questions</label>
  <select id="secret" class="form-control" ngModel name="secret">
   <option value="pet">Your first Pet?</option>
   <option value="teacher">Your first teacher?</option>
  </select>
 </div>
 <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

*Controller file*

```
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
 
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
 @ViewChild('f', {static: false}) signupForm: NgForm;

 constructor(private userService: UserService) {}
 
 onSubmit() {
  console.log(this.signupForm);
 }
}
```

## Validators
[Back to top](#forms)   

This is the way of display a red border when the user touch the input and show a help text if email is not valid.

```
<div class="form-group">
 <label for="email">Mail</label>
 <input
  type="email"
  id="email"
  class="form-control"
  ngModel
  name="email"
  required
  email
  #email="ngModel">
 <span class="help-block" *ngIf="!email.valid && email.touched">Please enter a valid email !</span>
</div>
```

*app.component.css*

```
input.ng-invalid.ng-touched {
 border: 1px solid red;
}
```

### Pattern validator

```
this.recipeForm = new FormGroup({
     'name': new FormControl(recipeName, Validators.required),
     'amount': new FormControl(imageUrl, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) // requis et nombre positif
   });
```

## Default form values
[Back to top](#forms)   


no binding => tells to Angular that it is a formControl
one-way binding => To set formControl default value
two-way binding => To get value in realtime

### One-way binding method

Just use property binding by using ```[ngModel]```

*Vue file*

```
<select id="secret" class="form-control" ngModel name="secret" [ngModel]="defaultQuestion">
 <option value="pet">Your first Pet?</option>
 <option value="teacher">Your first teacher?</option>
</select>
```

*Controller file*

```
export class AppComponent {
 defaultQuestion = 'pet';
 ...
}
```

This will select *pet* in the dropdown list

## FormGroup
[Back to top](#forms)   

*controller file*

```
 suggestUserName() {
   const suggestedName = 'Superuser';
 
   // set specific field default value - solution 1
   this.signupForm.control.get('username').setValue(suggestedName);
 
   // set specific field default value - solution 2
   this.signupForm.form.patchValue({
     userData: {	// userData is the ngFormGroup's name
       username: suggestedName
     }
   });
 
   // set whole form default values
   // !! The json object MUST list all the form's fields
   this.signupForm.setValue({
     userData: {
       username: suggestedName,
       email: 'superuser@gmail.com'
     },
     secret: 'pet',
     gender: 'male'
   });
 }
```

*Vue file*

```
<div id="user-data"
   ngModelGroup="userData"
   #userData="ngModelGroup">
     <div class="form-group">
       <label for="username">Username</label>
       <input
       type="text"
       id="username"
       class="form-control"
       ngModel
       name="username"
       required>
     </div>
</div>
```

*Get form's values*

```
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
 
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
 title = 'angular-observable';
 userActivated = false;
 defaultQuestion = 'pet';
 private activatedSub: Subscription;
 @ViewChild('f', {static: false}) signupForm: NgForm;
 genders = ['male', 'female'];
 dataset = {
   username: '',
   email: '',
   secret: '',
   gender: ''
 };
 
 constructor(private userService: UserService) {}
 onSubmit() {
   this.dataset.username = this.signupForm.value.userData.username;// userData = ngFormGroup
   this.dataset.email = this.signupForm.value.userData.email;
   this.dataset.secret = this.signupForm.value.secret;
   this.dataset.gender = this.signupForm.value.gender;
 }
}
```
 
