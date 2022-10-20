[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Sass

* [Comprendre ::ng-deep](#comptendre-ng-deep)      
* [Utiliser un fichier variables.scss](#utiliser-un-fichier-variables-scss)     
* [unités % vs vh](#unites-%-vs-vh)     


## Comprendre ng-deep

La surcharge de composant Angular Material requiert souvent l'utilisation du combinator **::ng-deep**.

L'application de la pseudo-classe **::ng-deep** à n'importe quelle règle CSS **désactive complètement l'encapsulation** de la vue pour cette règle. Tout style avec *::ng-deep* appliqué **devient un style global** !

Afin d'étendre le style spécifié au composant actuel et à tous ses descendants, assurez-vous d'inclure le sélecteur d'hôte **:host** avant *::ng-deep*. Sans ça, le style surchargé avec *::ng-deep* sera appliqué partout dans le projet.

## Utiliser un fichier variables.scss

Créer un fichier variables.scss

*variables.scss*
````css
:root {
  --color-primary: #0070f3;
  --color-primary-hover: #097cff;
  --box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%)
}
````

Importer le fichier dans le global.scss

*global.scss*
````css
@import './variables.scss';
	
.btn {
	background-color: var(--color-primary);	
}
````

[Back to top](#sass)

## unités % vs vh

l'utilisation de l'unité **%** permet à un élément d'avoir une dimension en pourcentage par rapport à son parent.

L'utilisation de l'unité **vh** (viewport height) ou **vw** (viewport width) permet à un élément d'avoir une dimension en pourcentage par rapport au **viewport** et par conséquent permet de s'adapter en cas d'un zoom de l'affichage contrairement à l'utilisation des **%** pour lesquels le pourventage sera toujours le même lors d'un zoom / dézoom
