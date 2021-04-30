[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Promise

* [](#)         

````
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

[Back to top](#promise)
