# README

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.5.

* [Extensions VSCode](#extension-vscode-utiles)      
* [Bonnes pratiques générales](#bonnes-pratiques-générales)      
* [Architecture projet](#architecture-projet)      
* [Variables d'environnement DEV / PROD](#variables-environnement)      
* [Syntaxe appels de fonctions](#syntaxe-appels-de-fonctions)       
* [Angular Material](#angular-material)      
* [Git](#git)      
* [Commandes](#commandes)      

## Extension VSCode utiles

- Angular schematics
- Auto import
- Auto Close Tag
- Auto Rename Tag
- typescript hero => permet de créer des compos / pipe etc... en faisant un clic droit plutôt que la console
- tslint
- eslint
- Angular 10 snippets
- Angular Essentials (Version 9)

## Bonnes pratiques générales
[Sommaire](#readme)     

La règle importante à toujours garder en tête que **chaque composant / service doit avoir une responsabilité unique**. Il faut simplifier au maximum chaque composant / service pour garantir une lisibilité et une maintenanbilité efficace.

### Conventions et bonnes pratiques

Voici quelques bonnes pratiques "officielles" (https://angular.io/guide/styleguide) et d'autres accumulées au fil de l'expérience :

* Utiliser de préférence l'anglais pour les noms de variables, fonctions, classes etc... Les commentaires peuvent rester en français.
* Les noms de classes commencent par une majuscule (Upper CameCalse)
* Les noms d'interface on les préfixe avec I ex : IMonInterface
* Les noms de variables en camel case
* Typer autant que possible les variables, les paramètres de fonctions, les paramètres de retours de web services etc...
* Utilisation du mot clé "const" pour les "variables" qui ne sont pas réaffectée (normalement l'ide vous le dit)
* Ne pas utiliser le mot clé "var", on lui préfère "let" 
* Séparer au maximum les domaines fonctionnels (Chauqe 'domaine' doit avoir son composant ou groupe de composant et son / ses services associés)
* Eviter de mettre du code métier dans *app.component.ts*
* Tous les styles css partagés par plusieurs composants doivent être mis dans le fichier *style.scss* à la racine du projet
* Nommage des fichiers avec "." et "-" : ex user-list.component.ts (éviter userList.component.ts)
* Les fonctions doivent éviter de dépasser 75 lignes si possible. Si cela dépasse c'est qu'il y a peut-être un moyen de découper en sous-fonctions avec des responsabilités uniques
* Nommage des symboles et noms de fichier (utiliser le bon suffixe): faire correspondre le nom et le symbole ex : 
````
home.component.ts ==> export class HomeComponent
date.pipe.ts ==> export class DatePipe
hero-data.service.ts ==> export class HeroDataService
````
* Inclure l'interception des erreurs, la logique de plateforme dans la logique bootstrap (main.ts / app.component.ts)
* Nommage des selectors de composant : utiliser la syntaxe dashed-case / kebab-case => ````selector: 'my-selector'```` au lieu de  ````selector: 'mySelector'````
* Nommage des selectors de composant : préfixer le nom par la feature si besoin : ````selector: 'admin-users'```` car le UsersComponent est dans la feature Admin
* Nommage des pipes, ex : init-caps.pipe.ts
````
@Pipe({ name: 'initCaps' })
export class InitCapsPipe implements PipeTransform { }
````
* Ne pas inclure de logique dans les vues

#### Commentaires

Surtout n'hésitez pas !! :)

Pour vous faciliter la vie, après avoir créé une fonction, il suffit de se placer sur la ligne du dessus et de faire /** puis Entrer. L'IDE 
va vous générer le squelette type JSDoc qui va bien avec les paramètres.

## Architecture projet
[Sommaire](#readme)     

Il est recommandé de créer un répertoire par feature ou domaine fonctionnel. Pour chaque grosse feature, créer un répertoire *shared* contenant les models, services, fichiers modules, etc... associés à la feature ou au domaine.

### Exemple d'arborescence

````
src
|
+ app
|  |
|  + components
|  |     |
|  |     + user
|  |     |  |
|  |     |  + user-list
|  |     |  |    |
|  |     |  |    + user-list.component.ts
|  |     |  |    + user-list.component.html
|  |     |  |    + user-list.component.scss
|  |     |  |    + user-list.component.spec.ts
|  |     |  |    
|  |     |  + user-detail
|  |     |  + ...
|  |     |  |
|  |     |  + shared
|  |     |  |   |
|  |     |  |   + user.service.ts
|  |     |  |   + user.service.spec.ts
|  |     |  |   + user.model.ts
|  |     |  |   + user.guard.ts
|  |     |  |   + ...
|  |     |  |
|  |     |  + user.module.ts
|  |     |  + user-routing.module.ts
|  |     |  
|  |     + ... 
|  |     
|  + shared     
|  |   |
|  |   + models
|  |   + pipes
|  |   + enum
|  |   + services
|  |   + guards
|  |   + interfaces
|  |
|  + app.module.ts
|  + app.component.ts
|  + app.component.html
|  + app.component.scss 
|  + app.component.spec.ts 
|  + material.module.ts
|  + app-routing.module.ts
|
+ maint.ts
+ index.html
+ style.scss
+ assets
|   |
|   + imgs
|   |  |
|   |  + icons
|   |  + ...
|   |  
|   + fonts
|
+ ...
````


### Répertoire shared (src/app/shared)
[Sommaire](#readme)     

Ce répertoire contient les fichiers partagés de l'application et ou du composant. On peut retrouver un répertoire shared sous *app/shared* pour tout le code qui est partagé de manière globale à l'application et retrouver ce répertoire dans chaque composant *app/components/<mon-compo>* pour y mettre tout le code qui va être partagé par les sous-composants d'un même domaine fonctionnel / feature

- répertoire interfaces : contient toutes les interfaces
- répertoire models : contient toutes les classes
- répertoire services : contient tous les services
- répertoire pipes : contient tous les pipes
- répertoire guards : contient tous les guards
- répertoire enum : contient tous les fichiers d'énumération de valeurs / constantes

### Assets du projet
[Sommaire](#readme)     

Toutes les images du projet doivent être contenu dans le répertoire /src/assets/imgs. Il est possible de créer des sous-répertoire pour classer si besoin

Les fonts sont stockées dans le répertoire */src/assets/fonts*

### Styles css
[Sommaire](#readme)     

Les styles globaux à l'application doivent être déclarés dans le fichier *src/style.scss*

#### variables.scss
[Sommaire](#readme)     

Le fichier *src/variables.scss* permet de déclarer les *@font-face* et les variables de style utiles à l'application :

ex :

````
@font-face {
  font-family: "Roboto-Black";
  src: url("src/assets/fonts/Roboto-Black.ttf") format("truetype");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Roboto-Light";
  src: url("src/assets/fonts/Roboto-Light.ttf") format("truetype");
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-darkgrey: #23272D;
  --color-mediumgrey: #3F464B;
  --color-mediumgrey2: #5B6164;
  --color-mediumgrey3: #CFD1D2;
  --color-lightgrey: #ECEDED;
  --color-labelgrey: #D9D9D9;
  --color-yellow: #FFD400;
  --color-lightblue: #75C4D5;
  --color-mediumblue: #009CBE;
  --color-green: #70B62C;

  --font-default-size: 16px;
}
````

Ces variables sont ensuite utilisables directement dans toutes les feuilles de style de la manière suivante :

````
.title {
  color: var(--color-darkgrey);
  font-size: var(--font-default-size);
  font-family: "Roboto-Black";
}
````

## Variables environnement
[Sommaire](#readme)     

Le répertoire environments permet de gérer les variables liées à l'environnement d'exécution comme par exemple les url des serveurs DEV / PROD

Exemple d'utilisation dans le service data.

**Surtout !** Bien s'assurer que l'import pointe sur *environments/environment* C'est angular qui se chargera lors du build en mode prod d'aller mapper l'url de Prod.
````
import { environment, SERVER_URL } from '../../environments/environment';
````

## Syntaxe appels de fonctions
[Sommaire](#readme)     

Dans le cas d'une fonction utilisant beaucoup de paramètres dont certains sont facultatifs, préférer l'utilisation d'un paramètre unique de type objet json pour faciliter l'appel.

````
// Préférer l'écriture suivante :
maFunct({param1, param2 = 0, param3, param4, param5, param6}) {

}

//au lieu de l'écriture suivante qui IMPOSE un ordre de passage des paramètres
// qui peut poser problème si on a un paramètre manquant ou autre
maFunct(param1, param2 = 0, param3, param4, param5, param6) {

}

// l'appel se fait de la manière suivante
maFunct({param1: 'toto', param5: 12});
````

**Pour aller plus loin, il est recommandé d'ajouter le typage des paramètres de la manière suivante :**

````
maFunct({param1, param2 = 0, param3, param4, param5, param6}:
{param1?: string, param2?: number, param3?: any, param4?: string, param5?: number, param6?: number}) {

}
````

## Angular Material
[Sommaire](#readme)     

Installer Angular Material :

````
ng add @angular/material
````

Pour faciliter l'intégration des modules Angular Material, il est conseillé de créer un fichier un fichier *material.module.ts* permettant d'y déclarer tous les imports des modules Angular Material. 
Attention, certains composants Angular Material n'ont pas le même chemin d'import ````from '@angular/material'```` selon votre version d'angular. Si vous constatez une erreur d'import vérifiez donc le chemin d'import et modifiez-le au besoin. 


## Git
[Sommaire](#readme)     

### Bonnes pratiques
 
Pour récupérer le projet depuis le dépôt distant, utiliser la commande 

````
git clone <url-repos>
````

On essaye de réintégrer tous les soirs ce qui est fonctionnel.

On fait **toujours** un ````git pull```` **avant** de faire un ````git push```` pour ne pas risquer de tout casser dans le git et créer des conflits.

### Merge d'une branche

Pour merger une branche, il faut se positionner sur la branche cible et lui merger la branche source : 

Ex : on souhaite faire un merge de la branche *dev* sur la branche *master* :

````
git checkout master
git merge dev
git push
````

### Intégration nouvelle branche

Après avoir créé une nouvelle branche depuis Visual Studio Code ou par commande, il faut la connecter au dépôt distant :

````git branch --set-upstream-to=origin/master myNewBranch````

On peut ensuite la pousser sur le dépôt distant :

````git push -u origin myNewBranch````


## Commandes
[Sommaire](#readme)     

### Création d'un composant

Les composants sont à créer dans le répertoire *src/app/components*. Créer si possible un sous-répertoire par domaine fonctionnel.

````ng g c components/<ma-feature>/<mon-composant> --module app````

### Création d'un service

Les services sont à créer dans le répertoire *shared/services* global à l'application si c'est un service partagé globalement ou dans le répertoire spécifique du composant lié. 

Créer **un service par domaine fonctionnel**

````ng g s shared/services/<mon-service>````

### Création d'un pipe

Les pipes sont à créer dans le répertoire *shared/pipe* global à l'application ou dans le répertoire spécifique du composant lié.

````ng g p shared/pipes/<mon-pipe>````

### Création d'un guard

Les guards sont à créer dans le répertoire *shared/guards*  global à l'application ou dans le répertoire spécifique du composant lié.

````ng g g shared/guards/<mon-guard>````

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md)

[Sommaire](#readme)     
