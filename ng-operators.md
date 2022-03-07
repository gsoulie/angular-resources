[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Operateurs

* [Tableaux](#tableaux)     
* [Spread et Rest](#spread-et-rest)         
* [Destructuration d'objet](#destructuration-objet)       

## Tableaux

````typescript
[1, 2, 3, 4].at(1)	// 2
[1, 2, 3, 4].pop()	// [1, 2, 3]
[1, 2, 3, 4].push(5)	// [1, 2, 3, 4, 5]
[1, 2, 3, 4].fill(1)	// [1, 1, 1, 1].
[1, 2, 3, 4].join('-')	// '1-2-3-4'
[1, 2, 3, 4].shift()	// [2, 3, 4]
[1, 2, 3, 4].unshift(1)	// [1, 1, 2, 3, 4]
[1, 2, 3, 4].includes(2) // true
[1, 2, 3, 4].map(num => nim * 2) // [2, 4, 6, 8]
[1, 2, 3, 4].som(num => num > 3) // true
[1, 2, 3, 4].find(num => num > 2) // 3
[1, 2, 3, 4].every(num => num > 3) // false
[1, 2, 3, 4].filter(num => num > 2) // [3, 4]
[1, 2, 3, 4].findIndex(num => num > 2) // 2
[1, 2, 3, 4].reduce((acc, num) => acc + num) // 10
````

## Spread et Rest
[Back to top](#operateurs) 

L'opérateur ````...```` permet de copier toutes les propriétés d'un objet. Peut être utile si l'on souhaite retourner une copie d'un objet avec toutes ses propriétés en y ajoutant en plus des nouvelles.

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

**Sous-ensemble de propriétés**

````typescript
const data = { foo: 42, bar: 24, toRemove: 'remove' };
const { toRemove, ...rest } = data;

console.log(rest); // {foo: 42, bar: 24 }
````

**Renommage de propriétés**

````typescript
const data = { len: 164, unt: 'ft' };
const { len: length, unt: unit } = data;

console.log(length, unit); // 164, 'ft'
````

**Destructuration imbriquée**

````typescript
const data = { track: { length: 164, unit: 'ft' }};
const { track: { length, unit }} = data;

console.log(length, unit); // 164, 'ft'
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
