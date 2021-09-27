[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Téléchargement de fichiers

## Exemple de téléchargement d'un flux texte récupéré via une api

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
