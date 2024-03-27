[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Form

* [Générateur de formulaire](#générateur-de-formulaire)         
* [FormBuilder](#formbuilder)     
* [Custom validator](#custom-validator)     
* [Reactive form avec pipe async](#reactive-form-avec-pipe-async)      

**Template-driven** : la logique de validation du formulaire est dans la vue (C'EST MAL la vue ne doit faire QUE de la vue !)

**Model-driven-form** : la logique est dans le controller c'est la **bonne pratique** !!

Il utilise des FormGroup qui contiennent d'autres FormGroup ainsi que des FormControl. Le FormGroup permet de définir la logique pour tout un formulaire.
Le FormControl définit la logique d'un input du FormGroup

Pour faciliter l'écriture des formulaires, utiliser Angular FormBuilder : https://angular.io/guide/reactive-forms

````
import { ReactiveFormsModule } from '@angular/forms';
````

## Générateur de formulaires

Générateur automatique de formulaires : http://zerocodeform.com/

## FormBuilder

Permet de simplifier l'écriture des formulaires ReactiveForm

<details>
	<summary>Code à jour Angular 17+ avec Typed form, mat-hint et mat-error</summary>


*controller*
````typescript

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatHint
  ],
  templateUrl: './form.component.html'
})

export default class FormPageComponent implements OnInit {
  formG: FormGroup<{
    name: FormControl<string>,
    email: FormControl<string>,
    age: FormControl<number>
  }> | undefined;

  fb = inject(NonNullableFormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.formG = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: [0, [Validators.required, Validators.min(10)]]
    })
  }

  handleSubmit() { }
}
````

*template*

````html
@if(formG) {
<form (ngSubmit)="handleSubmit()" [formGroup]="formG" id="userForm">
  <mat-form-field appearance="fill">
    <label for="name">Name</label>
    <input type="text" id="name" formControlName="name" matInput required />
  </mat-form-field>
  <mat-form-field appearance="fill">
    <label for="email">Email</label>
    <input type="email" id="email" formControlName="email" matInput required />
    @if (formG.get('email')?.invalid) {
    <mat-error>Invalid email</mat-error>
    }
  </mat-form-field>
  <mat-form-field appearance="fill">
    <label for="age">Age</label>
    <input type="number" id="age" formControlName="age" matInput required />
    @if (formG.get('age')?.invalid) {
    <mat-error>Invalid age</mat-error>
    } @else { }
    <mat-hint align="start">Age must be greater or equal than 10</mat-hint>
  </mat-form-field>
  <button type="submit" [style.marginTop]="'40px'">Save form</button>
</form>
}
````
 
</details>

<details>
	<summary>old code</summary>

*vue.html*
````html
 <div class="container">

    <form [formGroup]="poolForm" novalidate (ngSubmit)="onSubmit()">

      <div class="row">
        <mat-form-field>
            <mat-label>Sample spot</mat-label>
            <input matInput type="text" formControlName="sampleSpot" placeholder="">
        </mat-form-field>
        <div *ngIf="poolForm.controls['sampleSpot'].touched && poolForm.controls['sampleSpot'].errors?.required">
        * Required
        </div>
        <div class="spacer"></div>
        <mat-form-field>
            <mat-label>Number of sample</mat-label>
            <input matInput type="number" formControlName="sampleNumber" placeholder="">
        </mat-form-field>
      </div>

      <div class="row">
        <mat-form-field>
          <mat-label>Date</mat-label>
          <input matInput type="date" formControlName="date">
        </mat-form-field>
        <div class="spacer"></div>
        <mat-form-field>
          <mat-label>Hour</mat-label>
          <div>
              <mat-select formControlName="hour">
                  <mat-option value="{{ h }}" *ngFor="let h of hours">{{ h }}</mat-option>
              </mat-select>
          </div>
        </mat-form-field>
        <div class="spacer"></div>
        <mat-form-field>
          <mat-label>Minute</mat-label>
          <div>
              <mat-select formControlName="minute">
                <mat-option value="{{ m }}" *ngFor="let m of minutes">{{ m }}</mat-option>
              </mat-select>
          </div>
        </mat-form-field>
      </div>
    </form>
    <button mat-raised-button type="submit" [disabled]="poolForm.invalid">Custom Submit button</button>
    <button mat-raised-button type="button" (click)="resetForm()">Reset</button>
  </div>
````

*controller.ts*
````typescript
  poolForm: FormGroup;
  hours = [];
  minutes = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeHourMinute();
  }

  initializeForm(): void {
    this.poolForm = this.formBuilder.group({
      sampleSpot: ['', Validators.required],
      sampleNumber: ['', Validators.required],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      minute: ['', Validators.required],
    });
  }

  initializeHourMinute(): void {
    for(let i = 0; i < 24; i++) {
      this.hours.push(i.toString().padStart(2, "0"));
    }
    for(let i = 0; i < 60; i++) {
      this.minutes.push(i.toString().padStart(2, "0"));
    }
  }

onSubmit() {
   console.log(this.poolForm.value.sampleSpot);
   console.log(this.poolForm.value.sampleNumber);
}

resetForm() {
	this.poolForm.reset();
}
````

**Remarque** : penser à importer le module *ReactiveFormsModule* dans le *app.module.ts*

> Exemple complet : https://github.com/gsoulie/angular-resources/blob/master/angular-forms.md#reactive-form

### Afficher une erreur sur un champ invalide

````html
<form [formGroup]="userForm">
 <label for="name">Name</label>
 <input type="text" placeholder="name" formControlName="name">
 <div [hidden]="userForm.controls['name'].valid || userForm.controls['name'].pristine" class="alert alert-danger">
   Name is required
 </div>
</div>
<div>
 <input type="email" placeholder="email" formControlName="email">
</div>
<div *ngIf="(userForm.controls['email'].dirty || userForm.controls['email'].touched) && userForm.controls['email'].errors" class="errors">
 <span *ngIf="userForm.controls['email'].errors?.required">Email is required</span>
 <span *ngIf="userForm.controls['email'].errors?.email">Email is invalid</span>
</div>

<div
 <input type="password" placeholder="password" formControlName="password">
</div>
<div *ngIf="(password.dirty || password.touched) && password.errors" class="errors">
 <span *ngIf="password.errors?.required">password is required</span>
 <span *ngIf="password.errors?.minLength">password is invalid</span>
</div>
````
 
</details>

## Custom validator
[Back to top](#form) 

### Validator asynchrone

retourne null si tout va bien et retourne un objet en cas d'erreur.

**ATTENTION** Ne jamais faire de ````reject```` mais un ````resolve(<quelque-chose>)```` en cas d'erreur

Un validator custom est une classe dans lequel on défini une methode statique => ````this.champ = new FormControl(null, monvalidator.saMethodeStatique);````

[Back to top](#form)
 
 ## Reactive Form avec pipe async

source : https://www.youtube.com/watch?v=4WBV-7PJ0jM&ab_channel=JoshuaMorony

**SOLUTION LA PLUS PROPRE** pour gérer des formulaires avec observables et pipe async.

**Avantages**

- pas de gestion manuelle des souscriptions
- pas de gestion manuelle d'indicateur de loading
- réaction aux changements automatique
- code plus modulaire

*home.component.html*

````html
<app-my-form
	*ngIf="user$ | async as user; else loading"
	[user]="user">
</app-my-form>
<ng-template #loading>
	<ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
	<ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
	<ion-skeleton-text animated style="width: 90%"></ion-skeleton-text>
</ng-template>
````

*home.component.ts*

````typescript
users$ = this.userService.getUser();
````


*reactiveForm.component.html*

````html
<form [formGroup]="userForm">
	<ion-item>
		<ion-label position="floating">Name</ion-label>
		<ion-input formControlName="name"></ion-input>
	</ion-item>
	<ion-item>
		<ion-label position="floating">Email</ion-label>
		<ion-input formControlName="email"></ion-input>
	</ion-item>
	<ion-item>
		<ion-label position="floating">Bio</ion-label>
		<ion-input formControlName="bio"></ion-input>
	</ion-item>
</form>
````

*reactiveForm.component.ts*

````typescript
@Input() user: User;
userForm: FormGroup;

constructor(private fb: FormBuilder) {
	this.userForm = this.fb.group({
		name: '',
		email: '',
		bio: ''
	});
}

ngOnInit() {
	this.userForm.setValue({
		name: this.user.name,
		email: this.user.email,
		bio: this.user.bio
	});
}
````
[Back to top](#form)
