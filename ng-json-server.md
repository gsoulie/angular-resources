[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# JSON server

Il est possible de simuler un serveur et une bdd locale basée sur un fichier json.

Par exemple créer un répertoire **data** à la racine du projet, contenant un fichier *db.json*

````json
{
  "blogs": [
    {
      "title": "My first blog",
      "body": "Some content of the blog : lorem ipsum dolor met",
      "author": "mario",
      "id": 1
    },
    {
      "title": "Luigi's first blog",
      "body": "Some content of the blog : lorem ipsum dolor met",
      "author": "luigi",
      "id": 2
    },
  ]
}
````

On utilise ensuite un **json-server** local pour simuler une API

On exécute le serveur avec la commande :

````npx json-server --watch data/db.json --port 8000````

L'accès aux api se fait ensuite avec les urls suivantes :

````
http://localhost:8000/blogs  
http://localhost:8000/blogs/id
````
