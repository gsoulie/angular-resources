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
````
<form [formGroup]="loginForm" novalidate (ngSubmit)="onSubmit()">
    
    <div>
        <label>Login</label>
        <input type="text" formControlName="login" placeholder="">
    </div>
    <div>
        <label>Password</label>
        <input type="password" formControlName="password" placeholder="">
    </div>
    
    <button type="submit">Submit</button>
</form>
````

*controller.ts*
````
loginForm: FormGroup;

// Méthode avec FormBuilder
constructor (private fb: FormBuilder) { }

ngOnInit() {
	this.loginForm = this.fb.group({
		login: [isDevMode() ? 'admin' : '', Validators.required],
		password: [isDevMode() ? 'password' : '', Validators.required]
	});
	
	// Méthode sans FormBuilder

	this.loginForm = new FormGroup({
		login: new FormControl('admin', Validators.required),
		password: new FormControl('password', Validators.required)
	});
}

onSubmit() {
   console.log(this.fb.value.login);
   console.log(this.fb.value.password);
}
````

**Remarque** : penser à importer le module *ReactiveFormsModule* dans le *app.module.ts*

> Exemple complet : https://github.com/gsoulie/angular-resources/blob/master/angular-forms.md#reactive-form

## Custom validator
[Back to top](#form) 

### Validator asynchrone

retourne null si tout va bien et retourne un objet en cas d'erreur.

**ATTENTION** Ne jamais faire de *reject* mais un *resolve(<quelque-chose>)* en cas d'erreur

Un validator custom est une classe dans lequel on défini une methode statique.
=> this.champ = new FormControl(null, monvalidator.saMethodeStatique);

[Back to top](#form)
