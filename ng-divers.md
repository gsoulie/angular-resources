[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Divers

* [Accès client lourd depuis frontend](https://www.synolia.com/synolab/back-office/lancer-client-lourd-lien-uri-scheme/)          
* [Détection activité utilisateur](détection-activité-utilisateur)      
* [Lecture et affichage de PDF](#lecture-et-affichage-de-pdf)      

## Détection activité utilisateur

https://stackblitz.com/edit/angular-h9wcuw?file=src%2Fapp%2Fapp.component.ts

permet de détecter si un utilisateur manipule ou non l'application. Peut-être utile pour mettre en place une mécanique de rafraichissement de token d'authentification lorsqu'on détecte que l'utilisateur est actif

*app.component.ts*

````typescript
import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  userActivity;

  userInactive: Subject<any> = new Subject();
  constructor() {
    this.setTimeout();
    this.userInactive.subscribe(() => console.log('user has been inactive for 3s'));
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
````
[Back to top](#divers)     

## Lecture et affichage de pdf

### ng2-pdf-viewer et ngx-pinch-zoom

https://www.npmjs.com/package/ng2-pdf-viewer    
https://www.npmjs.com/package/ngx-pinch-zoom      

### Installation et configuration

````
npm i ng2-pdf-viewer
npm i ngx-pinch-zoom
````

*home.module.ts*

````typescript
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    PinchZoomModule,
    PdfViewerModule,

    CommonModule,
    FormsModule,
    IonicModule,
    PdfModalePageRoutingModule
  ],
  declarations: [PdfModalePage]
})
export class PdfModalePageModule {}
````

### Utilisation

*home.component.html*

````html
<ion-content class="ion-padding">
  <pinch-zoom>
    <pdf-viewer 
	[src]="pdfSource"
	[render-text]="false"
    [original-size]="false"
    style="display: block;"></pdf-viewer>
  </pinch-zoom>
</ion-content>

````

*home.component.ts*

````typescript
export class PdfModalePage implements OnInit {

  pdf1 = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSource = this.pdf1;

  constructor() { }
  ngOnInit() {}
}
````

*home.component.scss*

````css
pdf-viewer {
  width: 100%;
  height: 100vh;
}
````
[Back to top](#divers)     
