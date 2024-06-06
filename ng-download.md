[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Sauvegarde, Téléchargement et Upload de fichier

## Sauvegarde et téléchargement

<details>
    <summary>Code de base</summary>

Le principe est le suivant : créer un fichier "blob" contenant du text ou du contenu récupéré depuis un appel API par exemple, puis créer un lien de type ````<a href>```` invisible ayant pour url le fichier blob. On simule un clic sur ce lien qui va lancer le téléchargement du fichier


````typescript
filecontent = '';

saveFile() {
    const fileName = 'mon-fichier.txt';
    const file = new Blob([this.filecontent], { type: "text/plain" });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  }
````
</details>

<details>
    <summary>Autre exemple de téléchargement d'un flux texte récupéré via une api</summary>

````typescript
this.apiService.getFile()
  .subscribe(res => {
    const json = res;
    const blob = new Blob([json], {type: 'application/text'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export-${this.currentDate.format('MM-YYYY')}.txt`;
    link.click();
  })
````    
</details>


### Autre exemple
https://dev.to/tabernerojerry/angular-drag-and-drop-files-upload-made-simple-jb6

## Upload de fichier

<details>
    <summary>Exemple</summary>

*upload.component.html*
````html
<div>
  <h1>Drag and Drop Files Upload</h1>

  <div class="dnd-wrapper">
    <!-- Start Drop Zone -->
    <div class="upload-wrapper">
      <input
        #fileInput
        type="file"
        (change)="handleChange($event)"
        [accept]="allowedFileTypes"
      />
      <p>
        Drag and drop <br />
        file here to upload. <br />
        (PNG, JPG, SVG)
      </p>

      <button type="button" (click)="fileInput.click()">Browse File</button>
    </div>
    <!-- End Drop Zone -->

    <!-- Start Preview Image -->
    <div
      *ngIf="fileUrl && uploadFile"
      [ngStyle]="{ 'background-image': 'url(' + fileUrl + ')' }"
      class="uploaded-wrapper"
    >
      <div class="button-wrapper">
        <p>{{ uploadFile.name }}</p>

        <div>
          <button
            type="button"
            [disabled]="isUploading"
            (click)="handleUploadFile()"
          >
            {{ !isUploading ? "UPLOAD" : "UPLOADING..." }}
          </button>
          <button
            type="button"
            [disabled]="isUploading"
            (click)="handleRemovesFile()"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
    <!-- End Preview Image -->
  </div>
</div>

````

*upload.component.ts*
````typescript
import { CommonModule } from '@angular/common';
import { Component, ElementRef, viewChild } from '@angular/core';
import { serialize } from 'object-to-formdata';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export default class UploadComponent {
  fileInput = viewChild<ElementRef<HTMLDivElement>>('fileInput')

  allowedFileTypes = ALLOWED_FILE_TYPES;

  isUploading = false;
  fileUrl!: string | null;
  uploadFile!: File | null;

  handleChange(event: any) {
    const file = event.target.files[0] as File;

    if (this.allowedFileTypes.indexOf(file?.type) === -1) {
      alert('File type is not allowed.');
      this.handleRemovesFile();
      return;
    }

    this.fileUrl = URL.createObjectURL(file);
    this.uploadFile = file;
  }

  handleRemovesFile() {
    if (this.fileInput && this.fileInput()?.nativeElement) {
      //this.fileInput()?.nativeElement.value = null;
      this.fileInput()?.nativeElement.remove();
    }

    this.uploadFile = null;
    this.fileUrl = null;
  }

  handleUploadFile() {
    this.isUploading = true;

    const formData = serialize({
      document: this.uploadFile
    });
  }
}

````

</details>
