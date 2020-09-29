[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# CSS    

* [global scss variables.scss](#global-scss-variables)      
* [Dynamic styling](#dynamic-styling)     
* [Css class](#css-class)    
* [Styling input when error occurs](#styling-input-when-error-occurs)    



## GLobal scss variables
[Back to top](#css)   

In order to regroup all your sass variables, you can create *src/variables.scss* file

*variables.scss*

````
:root
{
  --darkgrey: #23272D;
  --mediumgrey: #3F464B;
  --mediumgrey2: #5B6164;
  --lightgrey: #ECEDED;
  --labelgrey: #D9D9D9;
  --yellow: #FFD400;
  --lightblue: #75C4D5;
  --mediumblue: #009CBE;
  --green: #70B62C;
}
````

Then you just need to inject it into your *angular.json* 

````
...
"styles": [
              {"input":"src/variables.scss"}
            ],
````

*Usage in component.scss file*

````
.container {
  background-color: var(--mediumgrey);
}
````

## Dynamic styling
[Back to top](#css)   

### ngStlye

```
<p [ngStyle]="backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
```

### ngClass

```
<label [ngClass]="{'myCssCustomClass': i > 5 ? true : false }">my content</label>
```

## Css class
[Back to top](#css)   

### Error class

```
<div class="alert alert-danger">
    <p>{{ errorMessage }}</p>
</div>
```

## Styling input when error occurs
[Back to top](#css)   

```
input.ng-invalid.ng-touched {
    border: 1px solid red;
}
```
