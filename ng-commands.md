[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Commandes

* [Démarrage](#démarrage)    
* [Commandes basiques](#commandes-basiques)         
* [Mettre à jour Angular](#mettre-à-jour-angular)     
* [Mettre à jour npm](#mettre-à-jour-npm)        

## Démarrage

````
npm install -g @angular/cli
ng new <YOUR-APP-NAME>
cd <YOUR-APP-NAME>
ng serve
````
  
## Commandes basiques
````
ng g c components/home --module app
ng g s shared/services/myService --skipTests
ng build --configuration=production
````

## Mettre à jour angular
[Back to top](#angular) 

Consulter le site : https://update.angular.io

Pour mettre à jour angular, il faut mettre à jour à la fois le package global et le package local d'un projet

note : lancer l'invité de commande en mode administrateur

````
Global package:

npm uninstall -g @angular/cli
npm cache verify
# if npm version is < 5 then use `npm cache clean` 
npm install -g @angular/cli@latest
Local project package:

rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell 
npm install --save-dev @angular/cli@latest
npm install
````

### Mise à jour globale

#### Méthode simple

````
npm install -g @angular/cli@latest  // dernière version stable
npm install -g @angular/cli@12 @angular/core@12 // version spécifique
````

#### Méthode complète

1 - désinstaller globalement Angular
````
npm uninstall -g @angular/cli
````

2 - Il faut ensuite mettre à jour le cache de NPM. La commande dépend alors de la version installée. Si vous utilisez une version inférieure à la version 5, il faut utiliser la commande suivante :
````
npm cache clean
A partir de la version 5, la commande à utiliser a été modifiée.
npm cache verify
````

Pour finir, il ne reste plus qu'à installer la dernière version d'Angular CLI.
````
npm install -g @angular/cli@latest
````

### Solution 2

L'équipe Angular préconise de mettre à jour en premier le CLI et le Core :

````$ ng update @angular/cli @angular/core````
Après quoi, mettre à jour le reste des packages Angular.

## Mettre a jour npm
[Back to top](#commandes)

````
npm install npm@latest -g
npm install npm@6.14.9 -g // version spécifique
````
