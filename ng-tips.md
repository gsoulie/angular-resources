[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Astuces

* [Mémoriser une variable de controller](#mémoriser-une-variable-de-controller)      

## Mémoriser une variable de controller

Cas d'utilisation : On souhaite avoir une valeur "globale" dans un controller qui soit mémorisée même si l'on change de route entre temps et que l'on revienne sur le composant en question

````typescript
export let globaleValue = 0;  // déclarer la variable

@Component(...)

export class HomeComponent {

	ngOnInit() {
		console.log(globaleValue); // affiche 0 la première fois
	}
  
  // fonction qui met à jour la variable
	updateVariable() {
		globalValue = 12;	// au prochain ngOnInit sur ce composant, la valeur sera de 12
	}
}
````

[Back to top](#astuces)     
