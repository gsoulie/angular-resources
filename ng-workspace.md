[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

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


[Back to top](#workspace)
