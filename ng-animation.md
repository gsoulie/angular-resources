
[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Animations

* [animate.css](#animate-.-css)    
* [animation controller](#animation-controller)     

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
