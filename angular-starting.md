[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Prerequisites    

* [Starting](#starting)     
* [Configure bootstrap](#configure-bootstrap)    
* [CLI](#cli)    
* [NgModel](#ngmodel)    
* [Tips](#tips)    



## Starting
[Back to top](#prerequisites)   

```
npm install -g @angular/cli
ng new <YOUR-APP-NAME>
cd <YOUR-APP-NAME>
ng serve
```

## Configure Bootstrap
[Back to top](#prerequisites)   

To get sweet styling, it is recommended to install bootstrap with ```npm install --save bootstrap```, then add the bootstrap configuration to your **angular.json** under ```architect/build/styles``` node :

```
"styles": [
    "src/styles.css",	
    "node_modules/bootstrap/dist/css/bootstrap.min.css"
]

```

## CLI
[Back to top](#prerequisites)   

| Command | Description |
| --- | --- |
| ```ng g c <COMPONENT_NAME>``` | Generate a component | 
| ```ng g s <SERVICE_NAME>``` | Generate a service | 
| ```ng g d <DIRECTIVE_NAME>``` | Generate a directive | 
| ```ng g p <PIPE_NAME>``` | Generate a pipe | 

## ngModel
[Back to top](#prerequisites)   

| Name | Description |
| --- | --- |
| ngModel | Bind element to formControl | 
| [ngModel] | Simple-way binding (i.e. property binding) | 
| [(ngModel)] | Two-way binding | 

## Tips 
[Back to top](#prerequisites)   

### ... operator

The **...** operator allows to copy all of the existing properties of an object. This is very useful if we want to return a copy of an object with all of its properties and adding to it a new property.

```
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

```

### Using Interface
[Back to top](#prerequisites)   

It is possible to export an *Interface* as like a class

*post-interface.model.ts*

```
export interface Post {
    title: string;
    content: string;
    id?: string; // ? = optional
}
```

### ngIf else

It is possible to use *else* case in ```ngIf``` directive

```
<p *ngIf="myBooleanIsTrue; else noTrue">
    my sample text
</p>

<ng-template #noTrue>
    my sample text if not true
</ng-template>
```
