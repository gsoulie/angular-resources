[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Form

* [Générateur de formulaire](#générateur-de-formulaire)         
* [FormBuilder](#formbuilder)     
* [Custom validator](#custom-validator)     

**Template-driven** : la logique de validation du formulaire est dans la vue (C'EST MAL la vue ne doit faire QUE de la vue !)

**Model-driven-form** : la logique est dans le controller c'est la **bonne pratique** !!

Il utilise des FormGroup qui contiennent d'autres FormGroup ainsi que des FormControl. Le FormGroup permet de définir la logique pour tout un formulaire.
Le FormControl définit la logique d'un input du FormGroup

Pour faciliter l'écriture des formulaires, utiliser Angular FormBuilder : https://angular.io/guide/reactive-forms


## Générateur de formulaires

Générateur automatique de formulaires : http://zerocodeform.com/

## FormBuilder

Permet de simplifier l'écriture des formulaires ReactiveForm

*vue.html*
````html
 <div class="container">

    <form [formGroup]="poolForm" novalidate (ngSubmit)="onSubmit()">

      <div class="row">
        <mat-form-field>
            <mat-label>Sample spot</mat-label>
            <input matInput type="text" formControlName="sampleSpot" placeholder="">
        </mat-form-field>
        <!-- <div *ngIf="poolForm.controls.sampleSpot.touched && poolForm.controls.sampleSpot.errors?.required">
        * Required
        </div> -->
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
````

**Remarque** : penser à importer le module *ReactiveFormsModule* dans le *app.module.ts*

> Exemple complet : https://github.com/gsoulie/angular-resources/blob/master/angular-forms.md#reactive-form

### Afficher une erreur sur un champ invalide

````html
<ion-item>
 <ion-input type="email" placeholder="email" formControlName="email"></ion-input>
</ion-item>
<div *ngIf="(email.dirty || email.touched) && email.errors" class="errors">
 <span *ngIf="email.errors?.required">Email is required</span>
 <span *ngIf="email.errors?.email">Email is invalid</span>
</div>

<ion-item>
 <ion-input type="password" placeholder="password" formControlName="password"></ion-input>
</ion-item>
<div *ngIf="(password.dirty || password.touched) && password.errors" class="errors">
 <span *ngIf="password.errors?.required">password is required</span>
 <span *ngIf="password.errors?.minLength">password is invalid</span>
</div>
````

## Custom validator
[Back to top](#form) 

### Validator asynchrone

retourne null si tout va bien et retourne un objet en cas d'erreur.

**ATTENTION** Ne jamais faire de *reject* mais un *resolve(<quelque-chose>)* en cas d'erreur

Un validator custom est une classe dans lequel on défini une methode statique.
=> this.champ = new FormControl(null, monvalidator.saMethodeStatique);

[Back to top](#form)
