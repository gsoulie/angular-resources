[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Tests unitaires

* [Tester le bundle généré dans le répertoire dist](#)         

## Tester le bundle généré dans le répertoire dist

### solution 1 : 

````
npm i -g serve

// compiler le projet
ng build --prod

cd dist/<project_name>
serve -s
````

Il suffit ensuite de se rendre à l'url proposée pour voir l'application

### solution 2 :

````
npm install -g http-server

// compiler le projet
ng build --prod

cd dist/<project_name>
http-server
````

Ou jouer la commande ````http-server .\dist````

Il suffit ensuite d'ouvrir l'url *http://127.0.0.1:8080*

[Back to top](#tests-unitaires)
