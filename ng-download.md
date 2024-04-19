[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Sauvegarde et Téléchargement de fichier

## Code de base

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

## Autre exemple de téléchargement d'un flux texte récupéré via une api

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

## Autre exemple

https://dev.to/tabernerojerry/angular-drag-and-drop-files-upload-made-simple-jb6
