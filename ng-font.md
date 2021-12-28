[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Google Fonts

Comment intégrer des google fonts dans un projet Angular / Ionic

## Utilisation

1 - Se rendre sur le site https://fonts.google.com/
2 - Sélectionner une font 
3 - Pour chaque style voulu, cliquer sur "sélectionner le style"
4 - Une fois tous les styles choisis, afficher le volet "selected families"
5 - Sélectionner une méthode d'import : **link** ou **@import**
6 - méthode **link** : copier la balise link et la coller dans *index.html*
7 - ajouter ensuite la font dans le *variables.scss* pour ionic

````css
:root {
  --ion-font-family: 'Montserrat Alternates', sans-serif;
````
8 - la méthode **@import** est similaire à la différence qu'il suffit de copier le contenu de la balise <style> dans le *global.scss* (sans encadrer avec <style>)
et ajouter la font dans variable.scss
