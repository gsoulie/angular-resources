[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Composition directive

Depuis **Angular v15**, un nouveau mot clé **hostDirectives** permet de créer des directives composées.

## Rappel sur l'utilisation des directives

Avant de voir de quoi il retourne, voici un exemple classique d'uitlisation des directives :

Soit une directive *appColor* qui prend en paramètre une couleur permet d'appliquer une couleur à l'élément cible.

*color.directive.ts*

```typescript
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

```

Ensuite une directive *appBold* qui prend en paramètre un type à appliquer à la font de l'élément

*font-weight.directive.ts*

```typescript
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

```

Nous pouvons ensuite utiliser ces directives de la manière suivante dans le composant *app-child*

*child.component.ts*

```typescript
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

```

Voyons maintenant comment utiliser une **combinaison** de ces 2 directives

## Utilisation de la Composition Directive

Imaginons que nous devions appliquer la combinaison des directives *appColor* et *appBold* à plusieurs endroits dans le code.

Pour faciliter cette tâche, nous allons créer une troisième directive (non obligatoire mais plus pratique) qui sera composée des 2 premières. Pour parvenir à faire celà nous allons utiliser le mot clé **hostDirectives** introduit par la v15.

*style.directive.ts*

```typescript
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

```

Cette directive composée peut maintenant être utilisée de la manière suivante dans notre composant:

*child.component.ts*

```typescript
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

```
