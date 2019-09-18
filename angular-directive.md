
[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Directives    

* [Generalities](#generalities)       
* [ngIf - else](#ngif-else)    
* [ngStyle](#ngstyle)    
* [ngClass](#ngclass)    

## Generalities
[Back to top](#directives)   

```ng g d my-directive```


## ngIf - else
[Back to top](#directives)   

**Manage *ngIf-else***

*View file*

```
<p *ngIf="myBooleanIsTrue; else noTrue">my sample text</p>
<ng-template #noTrue>
	<p>my sample text in else case</p>
</ng-template>
```


## ngStyle
[Back to top](#directives)   

To use dynamic styling, you can use : 

```<p [ngStyle]="{backgroundColor: getColor()}"></p>```

or

```<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>```

## ngClass
[Back to top](#directives)   

```<label [ngClass]="{'myCssClass': i > 5 ? true : false}">my content</label>```
