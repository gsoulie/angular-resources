[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Directives
    
Les directives permettent de modifier les éléments du DOM. **Leur responsabilité est relative à la vue**

Dans l'idéal :
- Si on **modifie l'aspect** d'un élément on utilise une **directive**. 
- SI on **créé un élément** alors on utilise un **component**

*Appel d'une directive (ici : appHighlight)*
````
<div appHighlight (click)="maFonction()">TEXT</div>

<!-- Une directive peut aussi envoyer un EventEmitter -->
<div appHighlight (eventDirective)="gererEmitterDeLaDirective()">TEXT</div>
````

*Directive qui applique un fond rouge sur un click de la div*
````
@Directive({
	selector: '[appHighlight]'
})

export class HighlightDirective {
	constuctor(private _element: ElementRef) { }

	// Ecouter événement click. Sur un click il applique la fonction onClick()
	@HostListener('click') 
	onClick(){
		this._element.nativeElement.style.backgroundColor = 
		this._element.nativeElement.style.backgroundColor ? null : 'red';
	}
}
````

### Ajouter des propriétés à une directive
[Back to top](#directives) 

````
<div [appHighlight]="'red'" [isMaj]="true"">TEXT</div>
````

*Directive qui applique un fond rouge sur un click de la div*
````
@Directive({
	selector: '[appHighlight]'
})

export class HighlightDirective {
	@Input('appHighlight') actualColorText: string;
	@Input() isMaj: boolean;

	constuctor(private _element: ElementRef) { }

	onClick(){
		const colorToApply = this.actualColorText || 'green';
		this._element.nativeElement.style.backgroundColor = 
		colorToApply;
	
		if(this.isMaj) {
			this._element.nativeElement.style.textTransform = 'uppercase';
		}
	}
}
````

### ngClass
[Back to top](#directives)    

Selon le contexte, si un traitement conditionnel est utilisé plusieurs fois dans l'appli et/ou avec de l'algo à faire, utiliser une directive.

Si c'est un cas très ponctuel, utiliser ````[ngClass]````

````<label [ngClass]="{'myCssClass': i > 5 ? true : false}">my content</label>````

### ngStyle

````
<p [ngStyle]="{backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
````

[Back to top](#directives)
