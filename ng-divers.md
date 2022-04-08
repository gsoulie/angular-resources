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

### FileOpener

#### Installation et configuration

````
npm install cordova-plugin-file-opener2 
npm install @awesome-cordova-plugins/file-opener 
npx cap sync
````

*app.module.ts*

````typescript
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@NgModule({
  declarations: [],
  entryComponents: [],
  imports: [],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener // <-----------
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
````
#### Utilisation

*component.ts*

````typescript
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

  async openFile(entry) {
    if (isPlatform('hybrid')) {
      // Récupérer l'uri du fichier
      const fileUri = await Filesystem.getUri({
        directory: Directory.data,
        path: this.currentFolder + '/' + entry.name
      });

      const mime = this.getMimeTypeByFilename(entry.name);

      this.fileOpener.open(fileUri.uri, mime)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Erreur lors de l\'ouverture du fichier'));
    }
  }
  
  private getMimeTypeByFilename(filename: string): string {

    filename = filename.toLocaleLowerCase();
    if (filename.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (filename.indexOf('png') >= 0) {
      return 'image/png';
    } else if (filename.indexOf('jpg') >= 0 || filename.indexOf('jpeg')) {
      return 'image/jpg';
    }
  }
````
[Back to top](#divers)     

### PreviewAnyFile

#### Installation et configuration

````
npm i ng2-pdf-viewer
npm i ngx-pinch-zoom
````
*app.module.ts*

````typescript
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [],
  entryComponents: [],
  imports: [],
  providers: [
    PreviewAnyFile	// <-------
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
````

#### Utilisation

*component.ts*

````typescript
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';

async previewBase64(entry) {
    if (isPlatform('hybrid')) {

    const readFile = await Filesystem.readFile({
      directory: Directory.data,
      path: this.currentFolder + '/' + entry.name
    });

    (<any>window).PreviewAnyFile.previewBase64(
      win => console.log("open status",win),
      error => console.error("open failed", error),
      readFile.data
    );
    // !!! la syntaxe ci-dessous pose problème une fois déployé sur mobile
      // this.previewAnyFile.previewBase64(file_uri.uri)
      // .then((res: any) => console.log(res))
      // .catch((error: any) => console.error(error));
    } else {
      const file_uri = await Filesystem.getUri({
        directory: APP_DIRECTORY,
        path: this.currentFolder + '/' + entry.name
      });
      window.open(file_uri.uri, '_blank');
    }
  }
  
  
  async previewPath(entry) {
    if (isPlatform('hybrid')) {
      // Get the URI and use our Cordova plugin for preview
      const readFile = await Filesystem.getUri({
        directory: APP_DIRECTORY,
        path: this.currentFolder + '/' + entry.name
      });

      (<any>window).PreviewAnyFile.previewPath(
        win => console.log("open status",win),
        error => console.error("open failed", error),
        readFile.uri
    );
    } else {
      const file_uri = await Filesystem.getUri({
        directory: APP_DIRECTORY,
        path: this.currentFolder + '/' + entry.name
      });
      window.open(file_uri.uri, '_blank');
    }
  }
````

[Back to top](#divers)     
