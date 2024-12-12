[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Opérateurs

* [?? vs ||](#??-vs-||)     
* [Opérateur !!](#opérateur-!!)    
* [Tableaux](#tableaux)     
* [Spread et Rest](#spread-et-rest)         
* [Destructuration d'objet](#destructuration-objet)       
* [Casser une référence](#casser-une-référence)     
* [Shallow copy vs Deep copy](#shallow-copy-vs-deep-copy)      
* [Utilisation du type générique](#utilisation-du-type-générique)     
* [Valeurs en doublon et opérateur Set](#valeurs-en-doublon-et-opérateur-set)      
* [Types génériques](#types-génériques)
* [Comparaison de 2 objets avec copie des propriétés manquantes](#comparaison-de-2-objets-avec-copie-des-propriétés-manquantes)
* [Astuce construction de chaînes avec join](#astuce-construction-de-chaîne-avec-join)     

## Typescript expert : https://angularexperts.io/blog/advanced-typescript      

## ?? vs ||

**L'opérateur ?? (coalescence nulle) :**

* Fonction : Il retourne la valeur de droite seulement si la valeur de gauche est null ou undefined.
* Utilisation : Il est utilisé pour fournir une valeur par défaut si la première valeur est spécifiquement null ou undefined.

**L'opérateur || (ou logique) :**

* Fonction : Il retourne la valeur de droite si la valeur de gauche est falsy (c'est-à-dire false, 0, '', null, undefined, ou NaN).
* Utilisation : Il est souvent utilisé pour fournir une valeur de secours en cas de valeurs falsy.  

## Opérateur !!

L'opérateur ````!!```` permet de convertir n'importe quelle valeur en booleén

````
try {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(CustomKeys.token);
  return !!tokenCookie;  // Direct return of boolean value
} catch (e) {
  return false;
}
````

## Tableaux

````typescript
[1, 2, 3, 4].at(1)	// 2
[1, 2, 3, 4].pop()	// [1, 2, 3]
[1, 2, 3, 4].push(5)	// [1, 2, 3, 4, 5]
[1, 2, 3, 4].fill(1)	// [1, 1, 1, 1]
[1, 2, 3, 4].join('-')	// '1-2-3-4'
[1, 2, 3, 4].shift()	// [2, 3, 4]
[1, 2, 3, 4].unshift(1)	// [1, 1, 2, 3, 4]
[1, 2, 3, 4].includes(2) // true
[1, 2, 3, 4].map(num => nim * 2) // [2, 4, 6, 8]
[1, 2, 3, 4].some(num => num > 3) // true
[1, 2, 3, 4].find(num => num > 2) // 3
[1, 2, 3, 4].every(num => num > 3) // false
[1, 2, 3, 4].filter(num => num > 2) // [3, 4]
[1, 2, 3, 4].findIndex(num => num > 2) // 2
[1, 2, 3, 4].reduce((acc, num) => acc + num) // 10
````

### Opérateur every

Dans cet exemple nous voulons retourner ````true```` si le tableau est trié de manière croissante :

````typescript
const list = [1, 1, 2, 5, 7, 7, 9, 13];

return list.every((num, i) => num <= list[i + 1] || i === list.length - 1)
````

### Opérateur flat

````typescript
const arr = [1, 2, [3, [4, [5, 6], 7]], 8, [9]];

arr.flat(Infinity);
// output : [1, 2, 3, 4, 5, 6, 7, 8 , 9];
````

### Opérateur reduce

*Coût total d'un caddie*
````typescript
const cart = [
	{ banana: 1, price: 24.99 },
	{ tomato: 5, price: 13.75 },
	{ apple: 1, price: 3.80 }
];

const total = cart.reduce((acc, curr) => {
	acc += curr.price
	return acc; // à ne pas oublier
}, 0);

// output
// 42.54
````

> Par défaut on fixe la valeur initiale de l'accumulateur à 0

*Faire une somme par groupe de valeur*
````typescript
const cart = [
  { customer: 'paul', item: 'banana', qte: 2},
  { customer: 'marie', item: 'apple', qte: 7},
  { customer: 'john', item: 'kiwi', qte: 3},
  { customer: 'alex', item: 'apple', qte: 1},
];

console.log('cart cost = ' + JSON.stringify(cart.reduce((acc: any, curr: {customer: string, item :string, qte: number}) => {
  if (Object.keys(acc).includes(curr.item)) {
	acc[curr.item] += curr.qte;
  } else {
	acc[curr.item] = curr.qte;
  }
  return acc;
  }, {}))
);

// output
// {"banana":2, "apple":8, "kiwi":3}
````

> Par défaut on fixe la valeur de l'accumulateur à ````{}```` car le résultat doit être un objet

*Transformer un tableau d'objet en objet json utilisant un id comme clé des sous-objets*
````typescript
const musicians = [
  { id: 1464, name: 'paul', instrument: 'saxo' },
  { id: 849944, name: 'john', instrument: 'guitar' },
  { id: 54664, name: 'mike', instrument: 'drums' },
];

const musicianObj = musicians.reduce((acc, curr) => {
	const {id, ...otherProps } = curr;	// destructuration avec séparation de l'id du reste des propriétés
	
	acc[curr.id] = otherProps;
	return acc;
});

// output
// { '1464': {name: 'paul', instrument: 'saxo'}, '849944': {name: 'john', instrument: 'guitar'}, '54664': {name: 'mike', instrument: 'drums'} }
````

*Compter l'occurrence de chaque lettre*
````typescript
 const st = '((([{{[[]]}})'.split('');

    const res = st.reduce((acc, curr) => {
      if (Object.keys(acc).includes(curr)) {
        acc[curr] += 1
      } else {
        acc[curr] = 1
      }
      return acc
    }, {});	// => important fixer la valeur par défaut à {} car le résultat doit être un objet

    console.log(`comptage pour la chaîne ${st.join('')} : ${JSON.stringify(res)}`);
````

*Calculer une somme par rapport à une propriété d'objet*

````typescript
const items = [
	{ name: 'coffee', price: 12 },
	{ name: 'apple', price: 13.3 },
	{ name: 'pasta', price: 25 },
];

const sumFunc = (total, { price }) => total + price;
const total = items.reduce(sum, 0);
````

[Back to top](#opérateurs) 

## Spread et Rest

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
[Back to top](#opérateurs) 

## Destructuration objet

````typescript
const user = [{nom: 'toto', prenom: 'paul'},{nom: 'titi', prenom: 'luc'}];
let [o1, o2] = user;

// va donner : o1 = {nom: 'toto', prenom: 'paul'} et o2 = {nom: 'titi', prenom: 'luc'}


const musician = { id: 54664, name: 'mike', instrument: 'drums' };

const {id, ...otherProps } = musician;
// id = 54664
// otherProps = {name: 'mike', instrument: 'drums' }
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
[Back to top](#opérateurs) 

### Destructuration paramètres de fonction

````typescript
maFunct = ({param1, param2}) {

}

maFunct({param2: 5, param1: 1});
````
> Important : permet de s'affranchir de l'ordre des paramètres et de gérer plus facilement les 
paramètres optionnels

[Back to top](#opérateurs) 

### Destructuration avec renommage

````typescript
const result = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1000');

/* format du retour :
result => { 
	config: {...}, 
	headers: {...}, 
	request: {...}, 
	status: 200, 
	statusText: '', 
	data: { 
		count: 1000, 
		next: '', 
		previous: null, 
		results: [{...}]}
	}
}
*/

const { results: AllPokemon } = result.data;	// destructuration de l'objet data pour en récupérer "results" que l'on renomme en "AllPokemon"

console.log(AllPokemon); // => [{...}, {...}]
````

[Back to top](#opérateurs) 

## Casser une référence

Pour "casser" la référence à un objet, il existe plusieurs solutions

### spread

````typescript
const initialData = ['banana', 'apple', 'kiwi'];

const newRef = [...initialData];
const otherRef = initialData.slice();
````

### Object assign

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

### structureClone()

https://www.builder.io/blog/structured-clone

[Back to top](#opérateurs)

## Shallow copy vs Deep copy

<details>
	<summary>Comparaison des différents modes de copie d'objet à savoir le shallow copy et le deep copy</summary>

 
> [DevTheory : Shallow copy vs Deep copy](https://www.youtube.com/watch?v=Wv3UaiTxlUs&ab_channel=DevTheory)     


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

<details>
	<summary>Copie superficielle</summary>
	
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
[Back to top](#opérateurs) 

</details>

### Deep copy

<details>
	<summary>Copie profonde</summary>
	
Il existe plusieurs façon de réaliser une copie *profonde*, et elles ne se valent pas toutes.

#### Méthode JSON.parse

````typescript
const taskDeepCopy = JSON.parse(JSON.stringify(task));

taskDeepCopy.metadata.workspace = 'production';
console.log(`workspace : ${task.metadata.workspace} - ${taskDeepCopy.metadata.workspace}`); // => 'dev' - 'production'
````

**Explication** : ````JSON.stringify```` va *aplatîr* l'objet en type *chaîne* et par conséquent détruire la notion de propriétés imbriquées au sein de l'objet. Ensuite il suffit de re-transformer la chaîne en objet

**Limitations** : la format du JSON ne **supporte pas les fonctions**. Par conséquent il ne gère pas les cas dans lesquels l'objet de base contiendrait des méthodes. Idem si l'objet avait des propriétés contenant des ````Date(), Regex(), map()````, propriétés circulaires...

#### méthode structuredClone : à partir de typescript 4.7 ou à partir de node 17 

````typescript
  base = {
    name: 'object base',
    age: 34,
    address: {
      country: 'USA'
    }
  }
  
  const clone = structuredClone(this.base);
  clone.name = 'clone';
  clone.address.country = 'Canada';
  
  console.log('base', this.base);
  console.log('clone', clone);
````

</details>

[Back to top](#opérateurs)

</details>

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

[Back to top](#opérateurs)

## Valeurs en doublon et opérateur set

Voici comment savoir rapidement si un tableau contient des soublons, grâce à l'objet **Set** javascript

Un ````Set```` javascript est une collection contenant des éléments uniques, elle **ne peut pas contenir de doublon**. De fait en créant un ````new Set```` avec le contenu d'un tableau, le Set va de lui même écarter les éventuels doublons. Il nous reste alors qu'à comparer la taille du tableau initial avec la taille su Set généré.

````typescript
const hasDuplicates = arr => new Set(arr).size < arr.length

hasDuplicates([1, 2, 3]);	// false
hasDuplicates([4, 5, 4]);	// true
hasDuplicates(['str', 'obj', 'str']);	// true

````

[Back to top](#opérateurs)

## Types génériques

<details>
	<summary>Utilisation du type T</summary>
	
Soit le code suivant que l'on souhaite rendre plus robuste :

````typescript
type Student = {
  name: string;
  age: number;
  hasScar: boolean;
};

const students: Student[] = [
  { name: "Harry", age: 17, hasScar: true },
  { name: "Ron", age: 17, hasScar: false },
  { name: "Hermione", age: 16, hasScar: false }
];

function getBy(model, prop, value) {
    return model.filter(item => item[prop] === value)[0]
}
````

Dans un premier temps on peut rajouter un typage des paramètres de la fonction, ainsi qu'un type générique pour l'objet retourné par la fonction.

Ce qui donne :

````typescript
function getBy<T>(model: T[], prop: string, value): T | null {
    return model.filter(item => item[prop] === value)[0]
}

const result = getBy<Student>(students, "name", "Hermione") // result: Student 
````

On peut encore aller plus loin pour sécuriser les paramètres en cas d'erreur de frappe sur ces derniers, exemple passer "naem" au lieu de "name" pour le paramètre *props*,
ce qui aurait pour effet de crasher l'application sans que nous sachions vraiment pourquoi.

````typescript
function getBy<T, P extends keyof T>(model: T[], prop: P, value): T | null {
    return model.filter(item => item[prop] === value)[0] || null
}

const result = getBy(students, "naem", "Hermione")
// Error: Argument of type '"naem"' is not assignable to parameter of type '"name" | "age" | "hasScar"'.

```` 

Pour finaliser, il reste à sécuriser le dernier paramètre pour lequel on ne connaît pas à l'avance son type 

````typescript
function getBy<T, P extends keyof T>(model: T[], prop: P, value: T[P]): T | null {
    return model.filter(item => item[prop] === value)[0] || null
}
````

[Back to top](#opérateurs)     

</details>

## Comparaison de 2 objets avec copie des propriétés manquantes

<details>
	<summary>Voici une fonction permettant de comparer 2 objets et d'ajouter les clés manquantes (ainsi que leurs valeurs) dans l'objet cible.</summary>

Soit les 2 objets suivants, le but est d'ajouter dans l'objet *target* toutes les clés manquantes, qui sont présentes dans *obj1*

```typescript
obj1 = {
  name: 'object 1',
  data: {
    address: {
      street: '10 rue des genêts',
      postalCode: '34000',
      country: 'montpellier'
    },
    telephone: '0605040302',
    email: 'test@gmail.com'
  },
  coordinates: {
    lat: 3.056798798797,
    lng: -7.5464879
  }
};

target = {
  name: 'object target',
  data: {
    address: {
      street: '6 avenue du pont juvenal'
    },
    phone: '0988776655'
  },
  moreStuff: {
    items: [1, 2, 3]
  }
}

```

Fonction utilisée

```typescript
/**
   * Comparer 2 objets et ajouter les propriétés manquantes (avec leur valeur) dans le second objet
   * @param from
   * @param to
   */
fillObject(from: any, to: any) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(from[key]) === '[object Object]') {
        if (!to.hasOwnProperty(key)) {
          to[key] = {};
        }
        this.fillObject(from[key], to[key]);
      }
      else if (!to.hasOwnProperty(key)) {
        to[key] = from[key];
      }
    }
  }
}

this.fillObject(this.obj1, this.obj2);
console.log('------------------------')
console.log('obj1', JSON.stringify(this.obj1));
console.log('target', JSON.stringify(this.target));

```

Contenu de l'objet *target* après comparaison

```typescript
{
	"name": "object target",
	"data": {
		"address": {
			"street": "6 avenue du pont juvenal",
			"postalCode": "34000",
			"country": "montpellier"
		},
		"phone": "0988776655",
		"telephone": "0605040302",
		"email": "test@gmail.com"
	},
	"object2Special": {
		"items": [1, 2, 3]
	},
	"coordinates": {
		"lat": 3.056798798797,
		"lng": -7.5464879
	}
}

```

On constate que l'objet *target* a gardé **toutes** ses propriétés initiales ainsi que leurs valeurs, et il possède maintenant en plus toutes les propriétés manquantes présentent dans *obj1*
 
</details>

### Astuce construction de chaîne avec join

L'utilisation de ````filter(Boolean)```` sur un tableau de valeur aura pour effet de supprimer toutes les valeurs *falsy* (chaîne vide, null, undefined, false, 0)

````typescript
['A', '', 'B'].filter(Boolean); // Retourne ['A', 'B']

['A', '', 'B'].filter(Boolean).join('.'); // Retourne 'A.C'

// cas concret
const { code = '', version = '', orderNumber = '' } = props
const title = [code, version, orderNumber].filter(Boolean).join('.'); // xxx.xxx.xxx
````

[Back to top](#opérateurs)     
