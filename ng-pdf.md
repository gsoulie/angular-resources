

## Génération de PDF simples avec JsPDF
[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

PDF

* [Générer des PDF avec JsPDF](#générer-des-pdf-avec-jspdf)
* [Lecture et affichage de pdf](#lecture-et-affichage-de-pdf)     

## Générer des PDF avec JsPDF

<details>
  <summary>Présentation</summary>

Installation :
````
ng generate service pdf
````

Exemple de service
````typesscript
import { Injectable } from "@angular/core";
import jsPDF from "jspdf";

@Injectable({ providedIn: 'root' })

export class PdfService {

  generatePdf(filename: string) {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Custom PDF Document', 10, 10);

    doc.setFontSize(16);
    doc.text('This is a sample PDF generated using jsPDF in Angular.', 10, 30);

    // Add more content as needed
    doc.text('Add your content here...', 10, 50);

    doc.save(filename);

  }
}
````

> **Documentation** [https://raw.githack.com/MrRio/jsPDF/master/docs/index.html](https://raw.githack.com/MrRio/jsPDF/master/docs/index.html)
</details>

## Lecture et affichage de pdf

<details>
  <summary>ng2-pdf-viewer et ngx-pinch-zoom</summary>

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

#### Intégration avec iframe

````html
<iframe class="pdfCanvas" src="../../../assets/PDF.pdf"></iframe>
````

### FileOpener

#### Installation et configuration

````
npm install cordova-plugin-file-opener2 
npm install @awesome-cordova-plugins/file-opener 
npm i --save @awesome-cordova-plugins/core 	// Si erreur à la compilation
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

https://www.npmjs.com/package/cordova-plugin-preview-any-file     
https://www.npmjs.com/package/@ionic-native/preview-any-file    

#### Installation et configuration

````
npm i @ionic-native/core
npm i cordova-plugin-preview-any-file
npm i @ionic-native/preview-any-file
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
</details>
