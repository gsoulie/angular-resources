[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Commandes

* [Commandes basiques](#commandes-basiques)         
* [Mettre à jour Angular](#mettre-a-jour-angular)     
* [Mettre à jour npm](#mettre-a-jour-npm)        

````
ng g c components/home --module app
ng g s shared/services/myService --skipTests
````

## Mettre à jour angular
[Back to top](#angular) 

To update Angular CLI to a new version, you must update both the global package and your project's local package.

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

### Solution 2
The Angular team recommends updating the CLI and Core first:

````$ ng update @angular/cli @angular/core````
Afterward, update the rest of the Angular packages if there are no errors.

Another resource to check out is the Angular update guide: https://update.angular.io. Select the version your app is currently on, then the version you’re updating to. The guide will show you what to do before, during, and after the update. In my experience, updating is painless since there’s very little manual work to do. 

## Mettre a jour npm
[Back to top](#commandes)

````
npm install npm@latest -g
npm install npm@6.14.9 -g // version spécifique
````
