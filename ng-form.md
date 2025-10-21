[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Form

* [Signal Forms (Angular 21)](#signal-forms)     
* [Nouveaux événements (Angular 18)](#nouveaux-événements)     
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

## Signal Forms

````21/10/2025````

> **ATTENTION** : Feature **expérimentale** à ce jour (v21 oct 2025).

# Objectifs

* Exploiter le système de réactivité d'Angular
* Fournir une API plus intuitive pour la création et la gestion des formulaires
* Améliorer les performances grâce à des mises à jour précises
* Simplifier la validation des formulaires et la gestion des erreurs
* Intégration transparente avec les fonctionnalités modernes d'Angular basées sur les signaux

# Concept
## FieldState

Le premier concept est le ````FieldState```` qui permet de connaître l'état d'un champ :

````typescript
interface FieldState<TValue> {
  readonly value: WritableSignal<TValue>;
  readonly touched: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly errors: Signal<ValidationError[]>;
  readonly valid: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  // ... more state properties
}
````
Contrairement au ````ReactiveForm````, les propriétés du ````FieldState```` sont désormais des **Signals**, ce qui permet d'être cohérent avec le nouveau système de réactivité et de pouvoir utiliser ces propriétés avec des signaux ````computed()````

## La directive Field 

La directive ````[field]```` permet de connecter les composants UI aux champs du formulaire (connecte l'état des champs aux contrôles du formulaire)

Cette directive gère automatiquement :
* Le binding bi-directionnel entre la valeur du champs et le composant UI
* Synchronisation de l'état du formulaire comme désactivé, requis, etc
* Marquer les champs comme touchés lors d'une saisie
* Compatibilité avec les ReactiveForms existants

## Exemple de Signal Form basique

````typescript
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-book-review',
  template: `
    <form>
      <label for="title">Book Title</label>
      <input id="title" [field]="titleField" />

      <label for="author">Author</label>
      <input id="author" [field]="authorField" />

      <button [disabled]="!reviewForm().valid()">Submit Review</button>
    </form>
  `,
})
export class BookReviewComponent {
  // Create the data model
  reviewData = signal({
    title: '',
    author: '',
    rating: 0,
    review: '',
  });

  // Create the form
  reviewForm = form(this.reviewData);

  // Access individual fields
  titleField = this.reviewForm.title;
  authorField = this.reviewForm.author;
}
````

> Le formulaire crée automatiquement une structure de champ qui reflète votre modèle de données, et les modifications apportées aux valeurs de champ mettent à jour directement le signal d'origine.

## Validation de schéma

Une des évolutions majeures des Signal Forms est son approche de la validation de schéma qui se rapproche de ce que proposent **Zod** ou **Yup**.
L'API utilise une fonction ````schema()```` et permet d'enchaîner des règles de validation d'une manière familière aux autres bibliothèques de validation de schéma.

*Exemple de règles de validations*

````typescript
import { form, schema, required, email, minLength, max } from '@angular/forms/signals';

@Component({})
export class EventRegistrationComponent {
  eventData = signal({
    eventName: '',
    organizerEmail: '',
    description: '',
    maxAttendees: 0,
  });

  eventForm = form(this.eventData, event => {
    required(event.eventName);
    minLength(event.eventName, 5, {
      message: 'Event name must be at least 5 characters',
    });

    required(event.organizerEmail);
    email(event.organizerEmail);

    required(event.description);
    minLength(event.description, 20, {
      message: 'Description must be at least 20 characters',
    });

    max(event.maxAttendees, 1000, {
      message: 'Maximum 1000 attendees allowed',
    });
  });
}
````

### Validateurs intégrés

Signal Forms fourni un ensemble de validateurs natifs :

````typescript
// Required field validation
required(path, { message: 'This field is required' });

// String length validation
minLength(path, 5);
maxLength(path, 100);

// Numeric value validation
min(path, 0);
max(path, 999);

// Pattern matching
pattern(path, /^[A-Za-z]+$/, { message: 'Letters only' });

// Email validation
email(path);
````

### Validateurs personnalisés


<details>
  <summary>Exemple de validateur personnalisé pour une date de livraison :</summary>

````typescript
import { customError, FieldPath, validate } from '@angular/forms/signals';

// Custom validator function that can be reused
function validateShippingAddress(
  path: FieldPath<{
    zipCode: string;
    state: string;
    country: string;
  }>
) {
  validate(path, ctx => {
    const address = ctx.value();

    // Check if we ship to this location
    const restrictedStates = ['AK', 'HI']; // Alaska, Hawaii
    if (address.country === 'US' && restrictedStates.includes(address.state)) {
      return customError({
        kind: 'shippingRestricted',
        message: "Sorry, we don't ship to this state yet",
      });
    }

    // Validate ZIP code format for US addresses
    if (address.country === 'US' && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      return customError({
        kind: 'invalidZip',
        message: 'Please enter a valid US ZIP code',
      });
    }

    return null; // Valid
  });
}

@Component({
  template: `
    <form>
      <label for="country">Country</label>
      <select id="country" [field]="form.country">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>

      <label for="state">State</label>
      <input id="state" [field]="form.state" />

      <label for="zipCode">ZIP Code</label>
      <input id="zipCode" [field]="form.zipCode" />

      @for (error of form().errors(); track error.kind) {
        <span class="error">{{ error.message }}</span>
      }

      <button type="submit" [disabled]="form().invalid()">
        Calculate Shipping
      </button>
    </form>
  `,
})
export class ShippingFormComponent {
  private shippingData = signal({
    country: 'US',
    state: '',
    zipCode: '',
  });

  protected readonly form = form(this.shippingData, address => {
    validateShippingAddress(address);
  });
}
````
  
</details>

## Envoi de formulaire et Gestion des erreurs

Les erreurs sont transmises dans une propriété ````errors()```` de type tableau.

````typescript
port { submit } from '@angular/forms/signals';

@Component({
  template: `
    <form (ngSubmit)="onSubmit()">
      <!-- form fields -->
      <button type="submit" [disabled]="!recipeForm().valid()">
        @if (recipeForm().submitting()) {
          Publishing Recipe...
        } @else {
          Publish Recipe
        }
      </button>
    </form>

    <!-- Error display -->
    @if (recipeForm().errors().length > 0) {
      <div class="error-summary">
        @for (error of recipeForm().errorSummary(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `,
})
export class RecipeFormComponent {
  async onSubmit() {
    if (this.recipeForm().valid()) {
      await submit(this.recipeForm, async form => {
        try {
          await this.recipeService.publishRecipe(form().value());
          return null; // Success
        } catch (error) {
          // Return server validation errors
          return [
            {
              field: form.title,
              error: customError({
                message: 'A recipe with this title already exists',
              }),
            },
          ];
        }
      });
    }
  }
}
````

### Form Control custom

<details>
  <summary>Signal Form rend plus simple la création de champs personnalisé :</summary>

````typescript
@Component({
  selector: 'custom-slider',
  template: `
    <div class="slider-container">
      <input
        type="range"
        [value]="value()"
        (input)="onValueChange($event)"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()" />
      <span>{{ value() }}</span>
    </div>
  `,
})
export class CustomSliderComponent implements FormValueControl<number> {
  value = model.required<number>();
  disabled = input<boolean>(false);
  min = input<number>(0);
  max = input<number>(100);

  onValueChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}
````
  
</details>




## Fonctionnalités avancées

### Logique conditionnelle

<details>
  <summary>Utilisation de logique conditionnelle : disabled, hidden, readonly</summary>

````typescript
jobApplicationForm = form(this.applicationData, application => {
  required(application.fullName);
  required(application.position);

  // Conditionally require portfolio based on role type
  required(application.portfolioUrl, {
    when: ({ fieldOf }) => fieldOf(application.position).value() === 'designer',
  });

  // Hide salary expectations for internship positions
  hidden(
    application.salaryExpectations,
    ({ fieldOf }) => fieldOf(application.position).value() === 'intern'
  );

  // Make references readonly for internal transfers
  readonly(
    application.references,
    ({ fieldOf }) => fieldOf(application.isInternalTransfer).value() === true
  );
});
````

</details>

### Formulaires imbriqués et tableaux

<details>
  <summary>Utilisation de structures complexes</summary>

````typescript
// Nested object form
restaurantData = signal({
  name: '',
  cuisine: '',
  location: {
    address: '',
    city: '',
    zipCode: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
});

restaurantForm = form(this.restaurantData, restaurant => {
  required(restaurant.name);
  required(restaurant.cuisine);
  required(restaurant.location.address);
  required(restaurant.location.city);

  // Validate nested coordinates
  validate(restaurant.location.coordinates.lat, ({ value }) => {
    const lat = value();
    return lat >= -90 && lat <= 90
      ? null
      : customError({ message: 'Invalid latitude' });
  });
});

// Array handling
menuItemsData = signal([
  { name: 'Pasta Carbonara', price: 18.99, category: 'main' },
  { name: 'Caesar Salad', price: 12.5, category: 'appetizer' },
]);

menuForm = form(this.menuItemsData, menuItems => {
  applyEach(menuItems, item => {
    required(item.name);
    min(item.price, 0.01);
    required(item.category);
  });
});
````
</details>

### Validation asynchrone

<details>
  <summary>Validation asynchrone pour un contrôle côté serveur</summary>

````typescript
import { HttpClient } from '@angular/common/http';
import type { Signal } from '@angular/core';
import { Component, inject, resource, signal } from '@angular/core';
import {
  customError,
  form,
  schema,
  validateAsync,
} from '@angular/forms/signals';

@Component({
  selector: 'app-blog-form',
  // ... other config
})
export class BlogFormComponent {
  private httpClient = inject(HttpClient);

  blogData = signal({ slug: '' });

  blogPostForm = form(this.blogData, post => {
    validateAsync(post.slug, {
      params: ({ value }) => ({ slug: value() }),
      factory: (paramsSignal: Signal<{ slug: string } | undefined>) =>
        resource({
          params: () => paramsSignal(),
          loader: ({ params }) => {
            if (!params?.slug || params.slug.trim() === '') {
              return Promise.resolve(null);
            }
            return this.httpClient.post('/api/check-slug', params).toPromise();
          },
        }),
      errors: (result: { available?: boolean } | null, ctx) => {
        if (result && result.available === false) {
          return customError({
            kind: 'slugTaken',
            message: 'This slug is already taken',
          });
        }
        return null;
      },
    });
  });
}

````
</details>

# Exemple complet

````typescript
import { Component, signal } from '@angular/core';
import { apply, Control, email, form, minLength, required, schema, Schema, submit } from '@angular/forms/signals';

// Définition du Modèle

interface User {
  firstName: string;
  lastName: string;
  email: string;
  notifyByEmail: boolean
}

// Définition du Schéma de validation

const nameSchema: Schema<string> = schema((path) => {
  required(path, { message: `This field is required` }),
  minLength(path, 3, { message: `The value is too short` })
})

@Component({
  selector: 'app-root',
  imports: [Control],
  template: `
    <h3>SignUp Signal Form</h3>
    <form (submit)="onSubmit($event)">
      <input [field]="signupForm.firstName" placeholder="Enter Your Name" type="text" />
      @for (error of signupForm.firstName().errors(); track $index) {
        <div class="error">{{error.message}}</div>        
      }
      
      <input [field]="signupForm.lastName" placeholder="Your Last Name" type="text" />
      @for (error of signupForm.lastName().errors(); track $index) {
        <div class="error">{{error.message}}</div>        
      }
      
      <input [field]="signupForm.email" placeholder="Provide valid Email" type="email" />
      @for (error of signupForm.email().errors(); track $index) {
        <div class="error">{{error.message}}</div>        
      }
      
      <label> Notify By Email:
        <input [field]="signupForm.notifyByEmail" type="checkbox" />
      </label>
      <button [disabled]="signupForm().submitting() || !signupForm().valid()" type="submit">Save</button>
    </form>
  `,
})
export class App {
  protected readonly user = signal<User>({
    firstName: '',
    lastName: '',
    email: '',
    notifyByEmail: false,
  });
  
  protected readonly signupForm = form(this.user, (path) => {
    apply(path.firstName, nameSchema),
    apply(path.lastName, nameSchema),
    
    email(path.email, { message: `This is invalid email` }),
    required(path.email, {
      when: ({valueOf}) => valueOf(path.notifyByEmail) === true,
      message: `This field is required...` },
    )
  });
  
  protected onSubmit(event: Event) {
    submit(this.signupForm, async (form) => {
      try {
        await fetch('https://dummyjson.com/users/2', {
          method: 'PUT',
          body: JSON.stringify(form().value()),
        });
        form().reset();
        // throw Error(`Could not save user with this email...`)
        return undefined;
      } catch(e) {
        return [{
          kind: 'server',
          field: form.email,
          message: (e as Error).message
        }]
      }
    })
    event.preventDefault();
  }
}
````

## Nouveaux événements

Angular 18 améliore l'API des formulaires en offrant plus de contrôle sur le processus de validation des formulaires. 

Liste des nouveaux événements disponibles :

* ````PristineChangeEvent````
* ````ValueChangeEvent````
* ````StatusChangeEvent````
* ````TouchedChangeEvent````
* ````FormSubmittedEvent````
* ````FormResetEvent````

<details>
  <summary>Exemple d'implémentation sur un champ</summary>

````html
<input id="title" [formControl]="title">
````

````typescript
title = new FormControl('my app');

title.events.subscribe((event) => {

	if (event instanceof TouchedChangeEvent) {
		console.log('Touched', event.touched)
	}
	if (event instanceof PristineChangeEvent) {
		console.log('Pristine', event.pristine)
	}
	if (event instanceof ValueChangeEvent) {
		console.log('ValueChange', event.value)
	}
	if (event instanceof StatusChangeEvent) {
		console.log('Status change', event.status)	// VALID, INVALID, PENDING, DISABLED
	}
})

````  
</details>

<details>
  <summary>Exemple d'implémentation sur un Form</summary>

````html
<form [formGroup]="myForm">
	<label for="title">Title</label>
	<input id="title" formControlName="title">
	
	<label for="version">Version</label>
	<input id="version" formControlName="version">
	
	<button type="submit">Save</button>
	<button type="reset">Reset</button>
</form>
````


````typescript
myForm = new FormGroup({
	title: new FormControl('my app'),
	version: new FormControl('1.1'),
})


this.myForm.events.subscribe((event) => {

	if (event instanceof TouchedChangeEvent) {
		console.log('Touched', event.touched)
	}
	if (event instanceof PristineChangeEvent) {
		console.log('Pristine', event.pristine)
	}
	if (event instanceof ValueChangeEvent) {
		console.log('ValueChange', event.value.title)
		console.log('ValueChange', event.value.version)
	}
	if (event instanceof StatusChangeEvent) {
		console.log('Status change', event.status)	// VALID, INVALID, PENDING, DISABLED
	}
	
	if (event instanceof FormSubmittedEvent) {
		console.log('Form submitted')
	}
	if (event instanceof FormResetEvent) {
		console.log('Form Reset')
	}
})
````

Ne pas oublier d'importer les events

````typescript
import { TouchedChangeEvent, PristineChangeEvent, ValueChangeEvent, StatusChangeEvent, FormSubmittedEvent, FormResetEvent } from '@angular/forms'
````
  
</details>

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
