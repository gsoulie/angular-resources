
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
import { HttpClient } from ‘@angular/common/http’;
constructor(private http: HttpClient) { }

onSendData(postData: { title: string, content: string }) {
	this.http.post(‘http://…’, postData)
	.subscribe(responseData => {
		console.log(responseData); // display firebase automatic id
  });
}

onFetchData() {
	this.http.get(‘http://…’)
  .subscribe(data => {

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

## Error handling
[Back to top](#http)   

## Headers Params responseType
[Back to top](#http)   

## Interceptors
[Back to top](#http)   

## POST vs PUT
[Back to top](#http)   

