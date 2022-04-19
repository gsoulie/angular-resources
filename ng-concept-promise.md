[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Promise

* [Promise.All](#promise-.-all)         
* [Pyramide de promise](#pyramide-de-promise)      

## Promise.All

La méthode Promise.all() renvoie une promesse (Promise) qui est résolue lorsque l'ensemble des promesses contenues dans l'itérable passé en argument ont été résolues ou qui échoue avec la raison de la première promesse qui échoue au sein de l'itérable.

````typescript
const promiseArray = getPromises(); // return promises

return Promise.all(promiseArray)
.then((res) => {
	...
});
````

##
````typescript
let promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('résultat promise');
	}, 2000);
});

promise.then((data) => {
	console.log(data);
})
.catch((error) => {console.error(error);});
````

## Pyramide de promise

Eviter l'imbrication de promise : https://javascript.plainenglish.io/nested-promise-an-anti-pattern-alternative-to-it-a5069923a2ec      

[Back to top](#promise)
