[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Directives

* [Snippets](#snippets)    
* [Généralités](#généralités)    
* [Manipulation des styles](#manipulation-des-styles)     
* [Synthèse](#synthèse)     
* [ngclass](#ngclass)     
* [ngstyle](#ngstyle)      
* [hostbinding](#hostbinding)     
* [composition directive v15](#composition-directive)     

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

## Synthèse

Voici une synthèse rapide et simple sur l'utilisation des directives avec *HostLIstener*, *HostBinding* et passage de paramètres

Soit une directive ayant pour but de modifier le background-color d'un paragraphe *<p>* à son survol
````html
<p highlight>First paragraph</p>
<p>second paragraph without directive</p>
<p highlight>Last paragraph</p>
````

````typescript
@Directive({
	selector: 'p[highlight]'	// La directive sera attachée à tous les éléments <p> ayant l'attrribut highlight
})

export class HighlightDirective {

	constructor(private elementRef: ElementRef<HTMLElement>) {}
	
	@HostListener('mouseenter', ['$event'])	// <-- ['$event'] facultatif, uniquement si on a besoin de récupérer les params
	onMouseEnter(event: MouseEvent) {
		console.log(event.clientX);
		this.elementRef.nativeElement.style.backgroundColor = 'yellow';
	}
	
	// Autre écriture simplifiée en utilisant directement l'élément déclencheur
	@HostListener('mouseenter', ['$event.target'])
	onMouseEnter(element: HTMLElement) {
		element.style.backgroundColor = 'yellow';
	}
	
	@HostListener('mouseout')
	onMouseOut() {
		this.elementRef.nativeElement.style.backgroundColor = 'transparent';
	}
}
````

### HostBinding
Pour aller plus loin, on peut binder la propriété ````style.backgroundColor```` directement sur une variable pour simplifier encore le code

````typescript
@Directive({selector: 'p[highlight]'})

export class HighlightDirective {
	@HostBinding('style.backgroundColor') color = 'transparent';
	
	@HostListener('mouseenter')
	onMouseEnter() { this.color = 'yellow'; }
	
	@HostListener('mouseout')
	onMouseOut() { this.color = 'transparent'; }
}
````

### Paramètres Input

Ajoutons encore un peu plus de paramétrage en permettant le passage de la couleur via un paramètre

````html
<p highlight background-color="blue">First paragraph</p>
<p>second paragraph without directive</p>
<p highlight background-color="yellow">Last paragraph</p>
````

En javascript pur on écrirai :

````typescript
@Directive({selector: 'p[highlight]'})

export class HighlightDirective {
	@HostBinding('style.backgroundColor') color = 'transparent';
	
	backgroundColor = 'yellow';
	
	constructor(elementRef: ElementRef<HTMLElement>) {
		this.backgroundColor = elementRef.nativeElement.getAttribute('background-color') || 'yellow';
	}
	
	@HostListener('mouseenter')
	onMouseEnter() { this.color = this.backgroundColor; }
	
	@HostListener('mouseout')
	onMouseOut() { this.color = 'transparent'; }
}
````

Que l'on peut l'écrire plus simplement avec 

````typescript
@Directive({selector: 'p[highlight]'})

export class HighlightDirective {
	@HostBinding('style.backgroundColor') color = 'transparent';
	
	@Input('background-color') backgroundColor = 'yellow';	// avec une valeur par défaut si aucune couleur n'est donnée
		
	@HostListener('mouseenter')
	onMouseEnter() { this.color = this.backgroundColor; }
	
	@HostListener('mouseout')
	onMouseOut() { this.color = 'transparent'; }
}
````

[Back to top](#directives)    

## ngStyle

````html
<p [ngStyle]="{backgroundColor: getColor()}"></p>

<label [ngStyle]="{'background-color':myVar < 5 ? 'blue' : 'green'}">my content</label>
````

[Back to top](#directives)

## Composition Directive

Depuis **Angular v15**, un nouveau mot clé **hostDirectives** permet de créer des directives composées.

## Rappel sur l'utilisation des directives
Avant de voir de quoi il retourne, voici un exemple classique d'uitlisation des directives :

Soit une directive *appColor* qui prend en paramètre une couleur permet d'appliquer une couleur à l'élément cible.

*color.directive.ts*

````typescript
@Directive({
  selector: '[appColor]',
  standalone: true,
})
export class ColorDirective implements OnInit {
  @Input() color!: string = 'red';
  
  constructor(private element: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.renderer.setStyle(this.element.nativeElement, 'color', this.color);
  }
}
````

Ensuite une directive *appBold* qui prend en paramètre un type à appliquer à la font de l'élément

*font-weight.directive.ts*

````typescript
@Directive({
  selector: '[appBold]',
  standalone: true,
})
export class FontWtDirective implements OnInit {
  @Input() weight!: string = 'bold';
  
  constructor(private element: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.renderer.setStyle(
		this.element.nativeElement,
		'font-weight',
		this.weight
	  );
  }
}
````

Nous pouvons ensuite utiliser ces directives de la manière suivante dans le composant *app-child*

*child.component.ts*

````typescript
@Component({
  selector: 'app-child',
  template: `
	<p appStyle appColor color="blue" appBold>
	  child works!
	</p>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ColorDirective, FontWtDirective],
})
export class ChildComponent {}
````

Voyons maintenant comment utiliser une **combinaison** de ces 2 directives

## Utilisation de la Composition Directive

Imaginons que nous devions appliquer la combinaison des directives *appColor* et *appBold* à plusieurs endroits dans le code.

Pour faciliter cette tâche, nous allons créer une troisième directive (non obligatoire mais plus pratique) qui sera composée des 2 premières. Pour parvenir à faire celà nous allons utiliser le mot clé **hostDirectives** introduit par la v15.

*style.directive.ts*

````typescript
@Directive({
  selector: '[appStyle]',
  standalone: true,
  hostDirectives: [
    { directive: ColorDirective, inputs: ['color: mycolor'] },	// <-- déclaration des paramètres si besoin
    { directive: FontWtDirective, inputs: ['weight: myweight'] },
    { directive: ClickEmitDirective, outputs: ['appEmit: clickEmit'] },	// <-- on peut en ajouter autant de directives que l'on souhaite
  ],
})
export class StyleDirective {}
````

Cette directive composée peut maintenant être utilisée de la manière suivante dans notre composant:

*child.component.ts*

````typescript
@Component({
  selector: 'app-child',
  template: `
	<p appStyle [mycolor]="blue" [myweight]="bold" (clickEmit)="showAlert()">
	  child works!
	</p>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ColorDirective, FontWtDirective],
})
export class ChildComponent {}
````

[Back to top](#directives)

## Directive listener sur resize

<details>
	<summary>Code directive</summary>

````typescript
@HostListener('resize', ['$event'])
onResize([{ contentRect }]: ResizeObserverEntry[]) {
	this.width = contentRect.width;
	this.height = contentRect.height;
}
````
 
</details>
