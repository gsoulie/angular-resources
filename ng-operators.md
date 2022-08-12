[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Operateurs

* [Tableaux](#tableaux)     
* [Spread et Rest](#spread-et-rest)         
* [Destructuration d'objet](#destructuration-objet)       
* [Object assign](#object-assign)     
* [Shallow copy vs Deep copy](#shallow-copy-vs-deep-copy)      
* [Utilisation du type générique](#utilisation-du-type-générique)     

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

### Destructuration paramètres event

````typescript
closePopover(ev): void {
    const { data } = ev.detail;
}
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

## Object assign
[Back to top](#operateurs)

La réassignagtion d'objet permet de **casser** la référence d'un objet et ainsi pouvoir forcer le déclenchement de sa mise à jour côté vue lorsqu'on utilise un *pipeTransform* pour la mise en forme des données (par exemple). 

En effet, les *pipeTransform* **ne se déclenchent qu'à la modification des types simples** : string, number, boolean, symbol. 

Dans le cas de types *complexes* comme les objets et les tableaux, l'ajout/modification/suppression d'une propriété **n'entraine pas** un changement de référence de l'objet et par conséquent cette modification n'est pas détectée par le pipe. 
Il faut donc forcer la création d'une nouvelle référence à l'objet pour déclencher le *pipeTransform*

**ATTENTION cette méthode ne réalise pas une copie profonde ! Les propriétés imbriquées ne sont pas copiées, seule leur référence est copiée. La modification d'une propriété imbriquée impactera aussi celle de l'objet source**

````typescript
refreshData() {
	// cas d'un objet
	const newObject = Object.assign({}, this.initialObject);
	newObject.name = 'john doe';
	this.initialObject = newObject

	// cas d'un tableau
	const newData: monType[] = Object.assign([], this.data);
	data.push(<nouvel_item>);
	this.data = newData;
}
````
[Back to top](#operateurs)

## Shallow copy vs Deep copy

> [DevTheory : Shallow copy vs Deep copy](https://www.youtube.com/watch?v=Wv3UaiTxlUs&ab_channel=DevTheory)     

Comparaison des différents modes de copie d'objet à savoir le *shallow copy* et le *deep copy*

Soit l'objet initial suivant :
````typescript
const task = {
  id: 12,
  name: 'Initial task',
  completed: false,
  metadata: {
    author: 'Paul',
    workspace: 'dev'
  }
}
````

### Shallow copy

Le Shallow copy réalise une copie *superficielle* d'un objet. C'est à dire que les propriétés de l'objet sont copiées, mais **pas** les propriétés **imbriquées**.
Lorsqu'une propriété imbriquée est rencontrée, c'est sa **référence** qui est copiée. Par conséquent, toute modification d'une propriété imbriquée depuis l'objet copié, entrainera aussi la modification de la propriété dans l'objet initial

````typescript
const taskCopy = { ... task };
console.log(task === taskCopy); // => false

// Modification d'une propriété non imbriquée
taskCopy.name = 'Task copy';
console.log(`name : ${task.name} - ${taskCopy.name}`);  // => Initial task - Task copy

// Modification d'une propriété imbriquée
taskCopy.metadata.workspace = 'production';
console.log(`workspace : ${task.metadata.workspace} - ${taskCopy.metadata.workspace}`); // => 'production' - 'production'
````

### Deep copy

Il existe plusieurs façon de réaliser une copie *profonde*, et elles ne se valent pas toutes.

#### Méthode JSON.parse

````typescript
const taskDeepCopy = JSON.parse(JSON.stringify(task));

taskDeepCopy.metadata.workspace = 'production';
console.log(`workspace : ${task.metadata.workspace} - ${taskDeepCopy.metadata.workspace}`); // => 'dev' - 'production'
````

**Explication** : ````JSON.stringify```` va *aplatîr* l'objet en type *chaîne* et par conséquent détruire la notion de propriétés imbriquées au sein de l'objet. Ensuite il suffit de re-transformer la chaîne en objet

**Limitations** : la format du JSON ne **supporte pas les fonctions**. Par conséquent il ne gère pas les cas dans lesquels l'objet de base contiendrait des méthodes. Idem si l'objet avait des propriétés contenant des ````Date(), Regex(), map()````, propriétés circulaires...

#### méthode structuredClone : UNIQUEMENT à partir de node 17

````typescript
const deepClone = structuredClone(task);

deepClone.metadata.workspace = 'production';
console.log(`workspace : ${task.metadata.workspace} - ${deepClone.metadata.workspace}`); // => 'dev' - 'production'
````
[Back to top](#operateurs)

## Utilisation du type générique

*service-helper.ts*

````typescript
getData<T>(): Observable<T[]> {
	return this.http.get('...');
}
````

*data-service.ts*

````typescript
fetchUsers() {
	this.users$ = this.helper.getData<User>();
}
````

[Back to top](#operateurs)
