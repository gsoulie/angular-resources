[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Angular material tips

Pour surcharger les composant Angular Material, il est important d'utiliser le combinator **::ng-deep** (qui remplace l'ancienne syntaxe */deep/*).
* [Comprendre ::ng-deep](#comptendre-ng-deep)     
* [Surcharge de style](#surcharge-de-style)      

## Comprendre ng-deep

La surcharge de composant Angular Material requiert souvent l'utilisation du combinator **::ng-deep**.

L'application de la pseudo-classe **::ng-deep** à n'importe quelle règle CSS **désactive complètement l'encapsulation** de la vue pour cette règle. Tout style avec *::ng-deep* appliqué **devient un style global** !

Afin d'étendre le style spécifié au composant actuel et à tous ses descendants, assurez-vous d'inclure le sélecteur d'hôte **:host** avant *::ng-deep*. Sans ça, le style surchargé avec *::ng-deep* sera appliqué partout dans le projet.

## Surcharge de style

### mat-progress-bar
[Back to top](#angular-material-tips)      

Customize progress bar colors :

````css
:host ::ng-deep .mat-progress-bar-fill::after {
    background-color: #E2001A;
}

:host ::ng-deep .mat-progress-bar-buffer {
    background: #D7D7D7;
}
````

### mat-badge
[Back to top](#angular-material-tips)      

````css
// surcharge de la couleur de fond et de la font
:host ::ng-deep .mat-badge-content {
    background: #767676 !important;
    color: red;
}
````

### mat-checkbox
[Back to top](#angular-material-tips)     
````css
:host ::ng-deep .mat-checkbox-frame {
    border: 1px solid #707070;
    border-radius: 3px;
}
````

[Back to top](#angular-material-tips)      
