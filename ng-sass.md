[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Sass

* [Comprendre ::ng-deep](#comptendre-ng-deep)      
* [Utiliser un fichier variables.scss](#utiliser-un-fichier-variables-scss)     
* [unités % vs vh](#unites-%-vs-vh)     
* [Supprimer les effets de focus](#supprimer-les-effets-de-focus)     
* [Syntaxe simplifiée rgba](#syntaxe-simplifiee-rgba)     
* [Rendre le responsive plus smooth avec la fonction clamp](#fonction-clamp)     


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

## Supprimer les effets de focus

````css
.btn {
  &:active {
    border: none;
    outline: none;
  }
}

// suppression des outlines sur les éléments avec focus
button:focus { outline:0 !important; }
select:focus { outline:0 !important; }
````
[Back to top](#sass)

## Syntaxe simplifiée rgba

````css
background: rgba(red, .5);
background: rgba($color: red, $alpha: .5);
````

[Back to top](#sass)

## Fonction clamp

Fonction css *clamp* une autre manière de gérer le responsive https://www.swebdev.fr/blog/la-fonction-css-clamp. Contrairement aux media queries, la fonction *clapm* se base sur les dimensions dynamiques du viewport. Là ou les media quesries définissent des breakpoints spécifiques causant une "saccade" lors du redimenssionnement.

La fonction clamp prend 3 paramètres :
1 - la taille minimale
2 - la taille préférée : taille qui sera utilisée de préférence, sans jamais dépasser la taille mini et la taille maxi
3 - la taille maximale

La taille préférée doit se baser sur une valeur en *vw* ou *vh* afin d'avoir un aspect dynamique. On peut lui ajouter une valeur fixe en pixel.

Voici un exemple d'implémentation sur un titre et une div

````css
.title-vh {
  font-size: clamp(20px, 16px + 5vw, 54px);
  color: black;
}
.square {
  background-color: rgba($color: red, $alpha: 0.8);
  width: clamp(80px, 80px + 5vw, 200px);
  height: clamp(80px, 80px + 5vw, 200px);
}
````
