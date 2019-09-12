
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Forms    

* [Configuration](#configuration)    
* [Template Drive form](#template-drive-form)    


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
onSubmit(form: NgForm) {
  console.log(form);
}
```
console



Quelques propriétés intéressantes :

dirty <bool> : vrai si une valeur a été modifiée
touched / untouched <bool> : vrai si l’utilisateur a cliqué sur un champ du formulaire 
valid / invalid <bool> : utile dans le cas d’utilisation de validators (champ email par exemple)
value <Object> : contient les valeurs des champs


Méthode @ViewChild

L’accès au formulaire via l’utilisation de @ViewChild est utile lorsqu’on désire accéder aux propriétés du formulaire avant ça soumission. Ce qui n’est pas possible via la méthode classique. 
Cette méthode peut-être utilisée afin de pouvoir pré-remplir des champs de saisie par exemple.

Vue

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

Controller

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
 @ViewChild('f', {static: false}) signupForm: NgForm;
 
 constructor(private userService: UserService) {}
 // onSubmit(form: NgForm) {
 //   console.log(form);
 // }
 
 onSubmit() {
   console.log(this.signupForm);
 }
}
 


Validators (lesson 191)

Afficher un cadre rouge autour des champs de saisie lorsqu’ils ont été touchés et afficher un texte d’aide sur le champ email si ce dernier est invalide 

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

app.component.css

input.ng-invalid.ng-touched {
 border: 1px solid red;
}


Valeurs par défaut
A retenir

no binding => pour dire à angular que c’est un formControl
one-way binding => pour donner une valeur par défaut à un formControl
two-way binding => pour obtenir instantanément la valeur d’un élément
Méthode One-way binding

Pour positionner les valeurs par défaut dans un formulaire, il suffit d’utiliser le property binding avec [ngModel].

Vue

<select id="secret" class="form-control" ngModel name="secret" [ngModel]="defaultQuestion">
             <option value="pet">Your first Pet?</option>
             <option value="teacher">Your first teacher?</option>
           </select>

Controller

export class AppComponent implements OnInit, OnDestroy{
 defaultQuestion = 'pet';
…
}

Ceci pré-sélectionnera l’item “pet” dans la combo

FormGroup (lesson 194)

ngModelGroup

Pré-remplir les champs

 suggestUserName() {
   const suggestedName = 'Superuser';
 
   // pré-remplir un champ unitairement - solution 1
   this.signupForm.control.get('username').setValue(suggestedName);
 
   // pré-remplir un champ unitairement - solution 2
   this.signupForm.form.patchValue({
     userData: {	// userData est le nom du ngFormGroup 
       username: suggestedName
     }
   });
 
 
   // pré-remplir tout le formulaire
   // !! il faut obligatoirement que l'objet json liste TOUS les champs du formulaire
   this.signupForm.setValue({
     userData: {
       username: suggestedName,
       email: 'superuser@gmail.com'
     },
     secret: 'pet',
     gender: 'male'
   });
 }

Vue

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

Récupérer les valeurs
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
 


Reactive Form

Importer ReactiveFormsModule dans le app.module.ts

 
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


Vue 

Il faut dire à Angular d’associer le formulaire (la balise <form>) à notre formGroup

<form [formGroup]=”signupForm”>

Ensuite il faut associer chaque champ du formulaire à chaque formControl définis dans le controller 

<input type=”text” id=”username” formControl=”username”>

Récupération des valeurs

Controller

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
 


Exemple complet

Vue

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


Controller

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
 


Custom validator

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

Validators

this.recipeForm = new FormGroup({
     'name': new FormControl(recipeName, Validators.required),
     'amount': new FormControl(imageUrl, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) // requis et nombre positif
   });

Styling

input.ng-invalid.ng-touched {
 border: 1px solid red;
}

FormArray
Implémentation

for (let ingredient of recipe.ingredients) {
         recipeIngredients.push(
           new FormGroup({
             'name': new FormControl(ingredient.name, Validators.required),
             'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
           })
         );
       }
 
// binding sur le formulaire
   this.recipeForm = new FormGroup({
     'name': new FormControl(recipeName, Validators.required),
     'imagePath': new FormControl(imageUrl, Validators.required),
     'description': new FormControl(description),
     'ingredients': recipeIngredients
   });
 

Fetching pour création dynamique des FormControls

/**
  * Récupérer la liste des ingrédients pour le FormControl
  */
 getControls() {
   return (this.recipeForm.get('ingredients') as FormArray).controls;
 }
 
 
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

Suppression d’un élément du FormArray

/**
  * Supprimer l'ingrédient sélectionné
  * @param index
  */
 onDeleteIngredient(index: number) {
   (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
 }


 Suppression de tous les éléments du FormArray

onDeleteAllIngredients() {
   (this.recipeForm.get('ingredients') as FormArray).clear();
 }
