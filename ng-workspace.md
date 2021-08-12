[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)   

* [Création d'un workspace](#workspace)      
* [Configuration](#configuration)       
* [Partage des assets](#partage-des-assets)       

# Workspace
Un workspace Angular est ensemble d'application et de librairies. Toutes les applications d'un même workspace partageront les mêmes dépendances (angular.json / package.json)

générer un workspace : ````ng new <mon-workspace> --create-application=false````      
générer une librairie : ````ng g library <ma-lib>````       
générer une application : ````ng g application <mon-application>````       
générer un composant dans un projet/lib du workspace (spécifier le projet/lib) : ````ng g c composant/mon-compo --project=<ma-lib>````

Si on ne spécifie pas dans quel projet / lib on souhaite générer un composant, ce dernier sera généré dans la cible par défaut spécifiée dans le angular.json sous la clé "defaultProject"

la création d'une application dans un workspace diffère de la création d'un projet classique dans le sens ou cette dernière n'a pas de package.json. Elle va utiliser le package.json du workspace. Ainsi en crééant plusieurs applications dans un même workspace, elles partageront toutes le même workspace.

Une librairie est en fait un projet angular dans lequel on peut déclarer des classes / services / composants que l'on va ensuite partager dans un **MEME** workspace. 
C'est utile si plusieurs projet doivent partager des composants / classes / services / helpers etc...

Si l'on souhaite utiliser une librairie dans des projets externes au workspace, il faut publier la librairie sur NPM privée ou publique (payant)


````
ng new <mon-workspace> --create-application=false

ensuite dans le workspace :

ng g library <nom_lib>

-> créé la lib et cette dernière contient un fichier src/public.api.ts


A la création de la lib, vérifier que son path est ajouté dans la rubrique path du tsconfig.json

-> build la lib la première fois avant de l'utiliser dans un projet
````

### Exposer un composant aux autres libs / projets

Comme pour un projet angular classique, lors de la création d'un composant, service etc... dans la lib, vérifier que sa dépendance est ajoutée dans le noeud *exports* du fichier module.ts associé. 
Ensuite il faut ajouter sa dépendance dans le fichier *public.api.ts*       

````
//export * from './lib/composant/mon-composant';
ex : export * from './lib/componants/demo-composant/demo-composant.component';
````

Ensuite il faut faire un build de la lib : ````ng build lib-demo````

Les composants / services etc... de la lib sont maintenant accessibles à toutes les applications du workspace à condition de penser à ajouter l'import du module de la lib concernée dans le *app.module.ts* de chaque application.

### Etendre un composant / classe

Si un projet du workspace souhaite rajouter des features à un composant / service / classe du workspace, il faut alors créer un nouveau composant / classe / service et le faire "extend" du composant / classe / service initial

**Liaison entre les applications et les librairies**

> Remarque : la modification d'un élément d'une lib n'est pas répercuté à chaud dans les applications en cours d'exécution. Il faut obligatoirement recompiler la lib puis relancer les applications pour voir apparaître les modifications.

Afin de ne pas avoir à redéployer les librairies à chaque modification et permettre la mise à jour du code à chaud il faut configurer le fichier *tsconfig.json* du projet en définissant des redirections vers les chemins physique des fichiers. 

Par défaut ces redirections se font vers le répertoire "dist" du workspace.     

## Configuration
[Back to top](#workspace)

### tsconfig.json

Pour faciliter le partage des librairies avec les autres projets du workspace, des ````paths```` sont créés automatiquement dans le fichier *tsconfig.json*

````json
...
"compilerOptions": {
    ...
    "paths": {
      "my-lib-one": [
        "dist/my-lib-one/my-lib-one",
        "dist/my-lib-one"
      ],
      "my-lib-two": [
        "dist/my-lib-two/my-lib-two",
        "dist/my-lib-two"
      ]
    },
````

Ces paths permettent d'utiliser un nom court lors de l'import (plutôt que d'importer depuis le chemin complet de la lib) et indiquent la cible de l'import lors de son utilisation : ````import { ItemData } from 'my-lib-one';````

Par défaut, les imports vont chercher le code dans le répertoire **dist**, c'est pour cela qu'il faut compiler au moins une fois les libs pour avoir quelque chose. 
Ceci a pour conséquence que les modifications "à chaud" d'un élément d'une lib, ne soient pas reportées en direct dans le projet qui l'utilise et qui est en cours d'exécution avec un "ng serve". 
Il faut donc **à chaque modification d'une lib**, la recompiler pour ensuite avoir les modifications répercutées dans le projet appelant.

Pour gagner en confort et effcicatié lors de la phase de développement, il est possible de modifier ces paths pour qu'ils pointent directement sur les répertoires des librairies :

*tsconfig.json* **modifié**

````json
...
"compilerOptions": {
    ...
    "paths": {
      "my-lib-one": [
        //"dist/my-lib-one/my-lib-one", // en mode production
        //"dist/my-lib-one" // en mode production
        "projects/Libs/my-lib-one/src/lib"  // en mode dev pour avoir les mises à jour à chaud lors d'un serve
      ],
      "my-lib-two": [
        //"dist/my-lib-two/my-lib-two", // en mode production
        //"dist/my-lib-two" // en mode production
        "projects/Libs/my-lib-two/src/lib"  // en mode dev pour avoir les mises à jour à chaud lors d'un serve
      ]
    },
````

De cette manière, une modification à chaud d'une librairie sera instantanément pris en compte dans l'exécution du projet appelant.

> **ATTENTION** : il faut penser à refaire pointer les pahts sur le chemin **dist** lors de la compiltaion de production avant déploiement en production.

### Configurer les Libs

Pour rendre accessibles les éléments d'une lib vers les projets / libs du workspace, un fichier **public-api.ts** est automatiquement créé et doit contenir les exports de chaque éléments à exposer.

Cependant si les paths sont paramétrés pour pointer sur des chemins de type ````projects/Libs/my-lib/src/lib````, alors le compilateur s'attends à trouver un fichier index lui indiquant les chemins de tous les éléments à importer.
Hors comme le chemin pointe sur le répertoire **/lib** se dernier ne contient pas de fichier **public-api.ts** puisque ce dernier se trouve à la racine **/src**. On peut donc créer un fichier **index.ts** dans le répertoire lib qui contiendra les exports : 

exemple *index.ts*

````typescript
// Components
export * from './lib/components/test-compo/test-compo.module';
export * from './components/test-compo/test-compo.component';

export * from './lib/components/select-option/select-option.module';
export * from './components/select-option/select-option.component';

// Models
export * from './models/api-messasge.model';
export * from './models/test.model';

// Services
export * from './services/api-helper.service';
export * from './services/auth.service';
````

Il faudra alors modifier le fichier *public-api.ts* en conséquence :

*public-api.ts*

````typescript
export * from './lib/index';
````

### @Injectable()

**Attention** à ce que les éléments des librairies (projet de type lib) ne contiennent pas de ````@Injectable()````, sinon cela pourrait générer une erreur du type ````An unhandled exception occurred: Internal error: unknown identifier []```` lors de la compilation


## Partage des assets

https://medium.com/@nit3watch/angular-shared-assets-with-multiple-apps-nrwl-nx-b4801c05c771

### arborescence
[Back to top](#workspace)

Si l'on souhaite regrouper les assets communs (images, pictos, fonts...) dans une lib pour pouvoir les partager à plusieurs projets, il suffit de créer un répertoire ````projects/Libs/my-lib/src/assets```` dans lequel on va y déposer les éléments.

Ensuite il faloir partager ce répertoire en ajoutant son chemin dans la propriété **assets** de chaque projet / lib dans le fichier **angular.json**. Voir chapitre suivant.

### configuration projet
[Back to top](#workspace)

*angular.json* initial

````json
...
  "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/my-project",
            "index": "projects/my-project/src/index.html",
            "main": "projects/my-project/src/main.ts",
            "polyfills": "projects/my-project/src/polyfills.ts",
            "tsConfig": "projects/my-project/tsconfig.app.json",
            "aot": true,
            "assets": [
              "projects/my-project/src/favicon.ico",
              "projects/my-project/src/assets"
            ],
````

*angular.json* modifié

````json
...
  "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/my-project",
            "index": "projects/my-project/src/index.html",
            "main": "projects/my-project/src/main.ts",
            "polyfills": "projects/my-project/src/polyfills.ts",
            "tsConfig": "projects/my-project/tsconfig.app.json",
            "aot": true,
            "assets": [
              "projects/my-project/src/favicon.ico",
              "projects/my-project/src/assets",
              {
                "glob": "**/*",
                "input": "projects/Libs/my-shared-lib/src/assets",
                "output": "./assets"
              }
            ],
````

Utilisation des assets dans un projet 

````html
<img src="../assets/icons/icon_activite_18_bleu.svg">
````

[Back to top](#workspace)
