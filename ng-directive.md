[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Directives

* [ngclass](#ngclass)     
* [ngstyle](#ngstyle)      
* [hostbinding](#hostbinding)     

https://www.learn-angular.fr/les-directives/         
https://www.digitalocean.com/community/tutorials/angular-using-renderer2    
    
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

**TRES IMPORTANT** : Les paramètres passés à une directive ne sont **PAS** accessibles depuis le constructeur. Ils ne sont accessibles uniquement depuis les listeners. On ne peut donc pas utiliser un paramètre comme valeur par défaut.

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

## ngClass
[Back to top](#directives)    

Selon le contexte, si un traitement conditionnel est utilisé plusieurs fois dans l'appli et/ou avec de l'algo à faire, utiliser une directive.

Si c'est un cas très ponctuel, utiliser ````[ngClass]````

````<label [ngClass]="{'myCssClass': i > 5 ? true : false}">my content</label>````

### Exemple 1

*directive.ts*

````
import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {

  @Input('appColor') highlightColor: string;

  private _defaultColor = 'blue';

  // Directive permettant de changer la couleur d'un élément
  constructor(private el: ElementRef, private renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'color', this._defaultColor);
  }

  // mouseenter listener
  @HostListener('mouseenter', ['$event']) onMouseEnter(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'color', this.highlightColor);
  }

  // mouseleave listener
  @HostListener('mouseleave', ['$event']) onMouseLeave(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'color', this._defaultColor);
  }

}

````

*app.component.html*

````
<div mat-subheader [appColor]="'red'">Directives typescript</div>
````

### Exemple 2 

````
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cardContent]'
})
export class CardContentDirective {

  constructor(
    readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
  ) {}
  toggleClass(addClass: boolean) {
      if (addClass) {
          this.renderer.addClass(
              this.elementRef.nativeElement, 'content-active'
          );
      } else {
          this.renderer.removeClass(
              this.elementRef.nativeElement, 'content-active'
          );
      }
  }
}

````

## ngStyle
[Back to top](#directives)

````
<p [ngStyle]="{backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
````

## HostBinding
[Back to top](#directives)

````
@Directive({
	selector: '[appHighlight]'
})
export class HightlightDirective {

	@HostBinding('style.backgroundColor') bg = 'red';
	
	constructor() {	}
	
	@HostListener('mouseenter') mouseenter() {
		this.bg = 'blue';
	}
	
	@HostListener('mouseleave') mouseleave() {
		this.bg = 'red';
	}
}
````
