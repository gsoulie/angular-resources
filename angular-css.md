[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# CSS    

* [Dynamic styling](#dynamic-styling)     
* [Css class](#css-class)    
* [Styling input when error occurs](#styling-input-when-error-occurs)    



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
