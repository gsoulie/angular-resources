[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Operateurs

* [Spread et Rest](#spread-et-rest)         
* [Destructuration d'objet](#destructuration-objet)       

## Spread et Rest
[Back to top](#operateurs) 

L'opérateur **...** permet de copier toutes les propriétés d'un objet. Peut être utile si l'on souhaite retourner une copie d'un objet avec toutes ses propriétés en y ajoutant en plus des nouvelles.

````typescript
// Here, we are useing the map operator on the dataset to ensure that each recipe
// has at least a non null list of ingredients.
// If it doesn't, we initialize that list with an empty array.
this.http.get<Recipe[]>(this.firebaseDatabase)
.pipe(map(recipes => { js
    return recipes.map(recipe => {
    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}  // '...' operator copy all of the existing object properties 
    });
}))
.subscribe(recipes => {
    this.recipeService.onInitializeRecipes(recipes);
});
````

**Exemples génériques**

````typescript
let arr = [1, 2, 3]; 

// let arr2 = [...arr, 4, 5] => [...[1, 2, 3], 4, 5] => [1, 2, 3, 4, 5]

let arr2 = [...arr, 4, 5]; // SPREAD

console.log(arr2); // [1, 2, 3, 4, 5]

let obj = {a: 1, b: 2};

let obj2 = {...obj, c: 3};

console.log(obj2); // {a: 1, b: 2, c: 3}
````

## Destructuration objet
[Back to top](#operateurs) 

````typescript
const user = [{nom: 'toto', prenom: 'paul'},{nom: 'titi', prenom: 'luc'}];
let [o1, o2] = user;

// va donner : o1 = {nom: 'toto', prenom: 'paul'} et o2 = {nom: 'titi', prenom: 'luc'}
````

**Exemple**

````typescript
maFunction({from: 1, to: 100});

function maFunction(data: any) {

	const { from, to } = data;
	
	// va créér les variables :
	// from = data.from
	// to = data.to
}
````

**Exemple**

````typescript
const employee = {
  id: 007,
  name: 'James',
  dept: 'Spy'
}

const id = employee.id;
const name = employee.name;

// Peut être écrit avec destructuration : 
const { id, name } = employee;


const employee = {
  id: 007,
  name: 'James',
  dept: {
    id: 'D001',
    name: 'Spy',
    address: {
      street: '30 Wellington Square',
      city: 'Chelsea'  
    }
  }  
}

const address = employee.dept.address;

/*=> address: {
      street: '30 Wellington Square',
      city: 'Chelsea'  
    }*/
	
const street = employee.dept.address.street;
````

### Destructuration paramètres de fonction
[Back to top](#operateurs) 

````typescript
maFunct = ({param1, param2}) {

}

maFunct({param2: 5, param1: 1});
````
> Important : permet de s'affranchir de l'ordre des paramètres et de gérer plus facilement les 
paramètres optionnels
[Back to top](#operateurs)
