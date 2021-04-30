[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Operateurs

* [Spread et Rest](#spread-et-rest)         
* [Destructuration d'objet](#destructuration-objet)       

## Spread et Rest
[Back to top](#operateurs) 

````
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

````
const user = [{nom: 'toto', prenom: 'paul'},{nom: 'titi', prenom: 'luc'}];
let [o1, o2] = user;
````

### Destructuration paramètres de fonction
[Back to top](#operateurs) 

````
maFunct = ({param1, param2}) {

}

maFunct({param2: 5, param1: 1});
````
> Important : permet de s'affranchir de l'ordre des paramètres et de gérer plus facilement les 
paramètres optionnels
[Back to top](#operateurs)
