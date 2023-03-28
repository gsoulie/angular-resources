
[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Animations

* [Angular animation](https://williamjuan027.github.io/angular-animations-explorer/)     
* [animate.css](#animate-.-css)    
* [animation controller](#animation-controller)     
* [animation réutilisable](https://netbasal.com/creating-reusable-animations-in-angular-6a2350d6191a)     
* [Exemples](https://github.com/gsoulie/angular-resources/tree/master/animations)      
* [Animations partagées](#animations-partagées)      
* [Animations sur scroll](#animations-sur-scroll)     

## animate.css

[animate.style](https://animate.style/)     

### installation

````npm install animate.css --save````

**index.html**

````html
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
</head>
````

### Utilisation

**Important** ne pas oublier de toujours utiliser la classe ````animate__animated```` en premier sur un élément avant d'y ajouter les autres classes d'animation

````html
<div class="animate__animated animate__slideInUp animate__faster">
	<ion-card>
	...
	</ion-card>
</div>
````

## Animation Controller
[Back to top](#animations)     

utilisation de **@ViewChild** et du service **AnimationController** pour animer des objets du dom

### Réduire la hauteur d'une div à 0

````html
<ion-button (click)="animate()">animate</ion-button>
<div #missionFooter class="test-animate"></div>
````

````css
.test-animate {
  width: 100%;
  height: 198px;
  background-color: yellow;
}
````

````typescript
import { Animation, AnimationController } from '@ionic/angular';

export class HomeCOmponent {
	@ViewChild('missionFooter', {read: ElementRef, static: true}) missionFooter: ElementRef;
	hideAnimation: Animation;
	footerVisible = true;
	
	constructor(private animationCtrl: AnimationController) {}
	
	ionViewDidEnter(): void {
		this.hideAnimation = this.animationCtrl.create()
		.addElement(this.missionFooter.nativeElement)
		.duration(200)
		.easing('ease-out')
		.fromTo('height', this.missionFooter.nativeElement.offsetHeight + 'px', '0px');
	}
	
	animate() {
		if (this.footerVisible) {
		  this.hideAnimation.direction('alternate').play();
		} else {
		  this.hideAnimation.direction('reverse').play();
		}
		this.footerVisible = !this.footerVisible;
	}
}
````

### Masquer un ion-footer
[Back to top](#animations)     

````html
<ion-content>
	<ion-button (click)="animate()">animate</ion-button>
</ion-content>
<ion-footer #missionFooter>
  <div class="page-footer">
	<!-- custom component -->
    <app-mission-footer></app-mission-footer>
  </div>
 </ion-footer>
````

````css
.page-footer {
  background-color: var(--ion-color-primary);
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  width: 100%;
  padding: 30px 30px 20px 30px;
}
````

````typescript
export class HomeCOmponent {
	@ViewChild('missionFooter', {read: ElementRef, static: true}) missionFooter: ElementRef;
	hideAnimation: Animation;
	footerVisible = true;
	
	constructor() {}
	
	ionViewDidEnter(): void {
		this.hideAnimation = this.animationCtrl.create()
		.addElement(this.missionFooter.nativeElement)
		.duration(200)
		.easing('ease-out')
		.fromTo('height', this.missionFooter.nativeElement.offsetHeight + 'px', '0px');
	}
	
	animate() {

		if (this.footerVisible) {
		  this.hideAnimation.direction('alternate').play();
		} else {
		  this.hideAnimation.direction('reverse').play();
		}
		this.footerVisible = !this.footerVisible;
	}
}
````

[Back to top](#animations)     

## Animations partagées

Il est facilement possible de partager des animations entre plusieurs composants

Créer un fichier *animation.ts*

*animation.ts*

````typescript
import {
  animate,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const enteringFromLeft = trigger('enteringFromLeft',
  [
    state('in', style({ // ajout de l'élément dans le dom
      opacity: 1,
      transform: 'translateX(0)'
    })),

    /* void est un état particulier permettant de gérer l'état ou l'élément n'est pas encore dans le DOM.
    On veut animer de l'état "inexistant" à "existant dans le dom"*/
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(-100px)'
      }),
      animate(300)
    ]),
    transition('* => void', [
      animate(300, style({
        opacity: 0,
        transform: 'translateX(100px)'
      }),)
    ]),
  ]);
````

Il suffit ensuite d'importer cette animation dans le decorator *@Component()* du composant voulu

*home.component.ts*

````typescript
@Component({
  selector: 'app-home',
  template: `
  <div [@enteringFromLeft]="">
	<div class="card">
		My new Card
	</div>
  </div>
  
  <button [@enteringFromLeft]="">My animated button</button>
  `,
  animations: [animatedListCards, enteringFromLeft]
})
````
[Back to top](#animations)     

##  Animation sur scroll
https://www.youtube.com/watch?v=x0Dvpu2jcUo&list=PLiO4ScU0Pxp0cAxMqGCtRmvRGA5vjId7b&index=3&ab_channel=DevTheory

méthode plus performante pour déclencher des éléments lors d'un scroll (exemple dpage web bootstrap avec des animations lors du scroll qui font apparaître des éléments) SANS utiliser l'event scroll mais le IntersectionObserver qui est plus performant et très simple d'utilisation

[Back to top](#animations)     
