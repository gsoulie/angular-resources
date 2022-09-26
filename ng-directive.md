[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Directives

* [Snippets](#snippets)    
* [Généralités](#généralités)    
* [Manipulation des styles](#manipulation-des-styles)     
* [ngclass](#ngclass)     
* [ngstyle](#ngstyle)      
* [hostbinding](#hostbinding)     

## Snippets

https://github.com/gsoulie/ionic-angular-snippets#directives-usage


## Généralités

https://www.learn-angular.fr/les-directives/
https://www.digitalocean.com/community/tutorials/angular-using-renderer2

Les directives permettent de modifier les éléments du DOM. Leur responsabilité est relative à la vue

Dans l'idéal :

* Si on modifie l'aspect d'un élément on utilise une directive      
* SI on créé un élément alors on utilise un component    

## Manipulation des styles  

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Il n'est pas conseillé dans une directive, d'accéder directement aux propriétés de style d'un élément de la manière suivante :

````typescript
this.elementRef.nativeElement.style.backgroundColor = '#ffaa22';
this.elementRef.nativeElement.style.padding = '10px';
this.elementRef.nativeElement.style.borderRadius = '10px';
````

Ceci parce qu'Angular est en mesure de restituer les éléments hors du DOM et par conséquent les propriétés de style peuvent ne pas être disponible à ce moment précis.

Il est donc **conseillé** d'utiliser le service **Renderer**

````typescript
@Directive({
  selector: '[appBasicHighlight]'
})
export class BasicHighlightDirective implements OnInit {
	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	ngOnInit() {
		// BAD --->
		// this.elementRef.nativeElement.style.backgroundColor = '#ffaa22';
		// this.elementRef.nativeElement.style.padding = '10px';
		// this.elementRef.nativeElement.style.borderRadius = '10px';

		// GOOD --->
		this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#ffaa22');
		this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '10px');
		this.renderer.setStyle(this.elementRef.nativeElement, 'border-radius', '10px');

		this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', (e) => {
			this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
		});
		this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', (e) => {
			this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#ffaa22');
		});
	}
	
	// ALTERNATIVE à renderer.listen
	@HostListener('mouseenter') mouseover() {
		this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
	}

	@HostListener('mouseleave') mouseleave() {
		this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#ffaa22');
	}
}
````

> A savoir : renderer fonctionne aussi avec les services workers


### Binder une propriété

Pour simplifier l'accès à une propriété, il est possible de la binder. En reprenant l'exemple précédent, voici comment simplifier l'accès à la propriété *backgroundColor* lors d'un survol de l'élément

````typescript
@HostBinding('style.backgroundColor') backgroundColor: string = 'red';

@HostListener('mouseenter') mouseover() {
    //this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
    this.backgroundColor = 'pink';
}

@HostListener('mouseleave') mouseleave() {
    //this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#ffaa22');
	this.backgroundColor = '#ffaa22';
}
````

### Passage de paramètres

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Les paramètres passés à une directive ne sont PAS accessibles depuis le constructeur. Ils ne sont accessibles uniquement depuis les listeners. On ne peut donc pas utiliser un paramètre comme valeur par défaut.

On souhaite maintenant passer 2 paramètres à la directives, la couleur par défaut de l'élément et sa couleur lors du survol :

````typescript
@Directive({
  selector: '[appBasicHighlight]'
})

export class BasicHighlightDirective implements OnInit {
  @Input() defaultColor = 'transparent';
  @Input() highLightColor = 'transparent';

  @HostBinding('style.backgroundColor') backgroundColor: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.backgroundColor = this.defaultColor;
  }

  @HostListener('mouseenter') mouseover() { this.backgroundColor = this.highLightColor; }

  @HostListener('mouseleave') mouseleave() { this.backgroundColor = this.defaultColor; }
}
````

*Appel*

````html
<h3 appBasicHighlight [defaultColor]="'yellow'" [highLightColor]="'pink'">Test directive</h3>
````

### Utiliser les alias

L'utilisation d'alias n'est pas obligatoire mais c'est à connaître. Un alias doit avoir le même nom que la directive. Il permet ensuite lors de l'appel, de binder la directive dans le html et lui passer
directement la valeur du paramètre.

````typescript
@Directive({
  selector: '[appBasicHighlight]'
})

export class BasicHighlightDirective implements OnInit {
  @Input(appBasicHighlight) defaultColor = 'transparent';	// <-- on a placé un alias sur la couleur par défaut.
  @Input() highLightColor = 'transparent';

  ...
}
````

On peut donc retirer le paramètre *defaultColor* qui a été remplacé par un alias du même nom que la directive

*Appel*

````html
<h3 [appBasicHighlight]="'yellow'" [highLightColor]="'pink'">Test directive</h3>
````

### Envoyer un EventEmitter

````typescript
@Directive({
  selector: '[appBasicHighlight]'
})

export class BasicHighlightDirective implements OnInit {
  @Output() clickEvent = new EventEmitter()
  
  @HostListener('click') clickOnItem() { this.clickEvent.emit(this.elementRef.nativeElement); }

  ...
}
````

### Directive structurelle

Reproduire la directive ````*ngIf````

````typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[appConditionalIf]'
})
export class ConditionalIfDirective {
  @Input() set appConditionalIf(condition: boolean) {	// <--- IMPORTANT reprendre le nom de la directive
  
    if (condition) {
      // display element
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // hide element
      this.viewContainer.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }
}
````

*Utilisation*

A noter qu'il faut ajouter une (*) devant le nom de la directive

````typescript
<button (click)="isVisible = !isVisible">Show / Hide</button>

<h2 *appConditionalIf="isVisible">COnditionnal ? {{ isVisible }}</h2>
````

### Exemple 2 

````typescript
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
[Back to top](#directives)    

## ngClass

Selon le contexte, si un traitement conditionnel est utilisé plusieurs fois dans l'appli et/ou avec de l'algo à faire, utiliser une directive.

Si c'est un cas très ponctuel, utiliser ````[ngClass]````

````<label [ngClass]="{'myCssClass': i > 5 ? true : false}">my content</label>````

[Back to top](#directives)    

## ngStyle

````html
<p [ngStyle]="{backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
````

[Back to top](#directives)
