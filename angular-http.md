
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Http    

* [Configuration](#configuration)     
* [map operator](#map-operator)    
* [Delete](#delete)    
* [Error handling](#error-handling)    
* [Headers, Params, responseType](#headers-params-responsetype)    
* [Interceptors](#interceptors)    
* [POST vs PUT](#post-vs-put)    


## Configuration
[Back to top](#http)   

In order to use HttpClient module, you need to import it 

*app.module.ts*

```
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [..., HttpClientModule]
})
```

### Using HttpClient

```
import { HttpClient } from '@angular/common/http';
constructor(private http: HttpClient) { }

onSendData(postData: { title: string, content: string }) {
	this.http.post('http://…', postData)
	.subscribe(responseData => {
		console.log(responseData); // display firebase automatic id
  	});
}

onFetchData() {
	this.http.get('http://…')
	.subscribe(data => {
		// some stuff here
	});
}

```

## map operator
[Back to top](#http)   

In the following example, the GET request return a list of post stored in a Firebase database. Each node has a unique Firebase id as a root.
We want to loop through that list to extract each node content in order to create a new array containing the node content and it's unique id. [uniqueId, title, content]

```
import { map } from 'rxjs/operators';

onFetchData() {
	this.http.get('http://…')
	.pipe(map(reponseData => {
		const postsArray = [];
	for (const key in responseData) {
	    if (responseData.hasOwnProperty(key)) {
	    	postsArray.push({ ...responseData[key], id: key});
     	    }
    	}
    	return postsArray;
  }))
  .subscribe(data => {
    // some stuff here
  });
}
```

## DELETE
[Back to top](#http)    

If your nackend support *delete* http method (like Firebase), you can simply use *delete* http method to clean a specific node in your database.

```
onDelete() {
	return this.http.delete('http://<firebase.database.url>');
}
```

## Error handling
[Back to top](#http)   

### Classic method

```
onFetchData() {
	this.dataService.fetchData()
	.subscribe(data => {
		// some stuff here
	}, error => {
		// Error handling
		console.log(error.message + ‘ - ‘ + error.status);
	});
}
```

### catchError operator

```
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

fetchData() {
	return this.http.get('http://...')
	.pipe(
		map (...),
		catchError(errorResp => {
			// send to analytics server…
			return throwError(errorResp);
		})
	);
}
```

## Headers Params responseType
[Back to top](#http)   

```
import { HttpHeaders, HttpParams } from '@angular/common/http';

this.http.get('http://…/posts.json', 
	{
		headers: new HttpHeaders({ 'Your-custom-header' : 'value' }),
		params: new HttpParams().set('print','pretty'),
		responseType: 'json'
	}
);
```

In the console output, you will see => ```http://.../posts.json?print=pretty```

You can also create a variable to build your query params : 

```
let searchParams = new HttpParams();
searchParams = searchParams.append('print', 'pretty');
searchParams = searchParams.append('custom', 'custom-value');
```

*responseType* indicate to Angular to convert the response with the specified type


## Interceptors
[Back to top](#http)   

## POST vs PUT
[Back to top](#http)   

With Firebase, ```POST``` is used to update a specific item in the database. ```PUT```allows to overwrite a full dataset.

**Warning** : ```PUT``` request ar nont supported by all backends.

```
storeRecipes() {
	const recipes = this.recipeService.onGetRecipes();
	return this.http.put('https://angularrecipes-f4ae3.firebaseio.com/recipes.json', recipes)
		.subscribe(response => {
			console.log(response);
		});
}
```

