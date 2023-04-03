[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# PouchDB

https://pouchdb.com/getting-started.html

## Installation

```
npm install pouchdb --save

// Server installation
npm i couchdb
npm i -g pouchdb-server

// Running server
pouchdb-server -p <PORT_NUMBER>
```

## Activation CORS

````
npm install -g add-cors-to-couchdb

// ===> outdated ?
add-cors-to-couchdb

// Or if your database is not at 127.0.0.1:5984:
add-cors-to-couchdb http://me.example.com -u myusername -p mypassword
````

On peut vérifier si les règles CORS sont bien activée en allant sur (like http://127.0.0.1:<PORT>/\_utils), et on devrait voir les configurations suivantes dans **configuration/Main config**

| section | option      | value                                                                                   |
| ------- | ----------- | --------------------------------------------------------------------------------------- |
| cors    | credentials | true                                                                                    |
|         | headers     | accept, accept-language, content-language, content-type, Authorization, Origin, Referer |
|         | methods     | GET, HEAD, POST, PUT, DELETE, COPY                                                      |
|         | origins     | \*                                                                                      |


  ## Exécuter l'application

```
// Run the app
ng serve -o --port <PORT>

// Run pouchdb-server
pouchdb-server -p <PORT>

// Accessing Server dashboard
http://localhost:<PORT>/_utils
```
