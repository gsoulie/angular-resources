[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Api Swagger

## ng-openapi

Dans le cas d'un couplage avec des APIs hébergées sur un swagger, il est pratique d'utiliser **ng-openapi**. Il permet, à partir du fichier json de description de l'api swagger de générer automatiquement les apis (les enums, models, services...) directement dans le projet Angular.

> Remarque : La génération des api écrase tout le contenu du répertoire contenant les apis.

documentation : https://www.npmjs.com/package/ng-openapi-gen

*installation*
````
npm install -g ng-openapi-gen
````

Il existe 2 commandes pour réaliser l'import, la première prend en paramètre l'url du fichier json de swagger et la seconde qui nécessite de copier le json à la racine du workspace angular et de passer le chemin en paramètre à la commande.

Si l'environnement du swagger n'est pas sécurisé par un certificat (ex environnement de developpement), il n'est pas possible d'utiliser *ng-openapi* en lui passant simplement l'url du json. Il faut donc récupérer le json de l'api et le copier à la racine du répertoire du workspace (swagger-api.json) qui servira de point d'entrée à la génération.

**IMPORTANT** : cela implique qu'à chaque changement des apis côté swagger il faudra re-récupérer le json et relancer une génération.

*génération des éléments*
````
// commande a exécuter depuis le répertoire workspace/frontend
ng-openapi-gen --input swagger-api.json --output projects\src\lib\api
````

### Configuration

Une fois les api générées, il faut configurer l'url de base du serveur dans le fichier *src/lib/api/api-configuration.ts*. Soit en renseignant le endpoint en dur ou en allant chercher l'url dans un fichier de configuration "externe" (depuis les assets)

````typescript
export class ApiConfiguration {
  rootUrl: string = ''; // solution 1 : entrer le endpoint api en dur ici 

  // Solution 2 : récupérer le endpoint depuis un fichier de config depuis les assets
  setApiRoot(apiRoot: string = ''): void {
    this.rootUrl = apiRoot;
  }
}
````

*app.component.ts*

````typescript
ngOnInit(): void {
    this.appSettings = this.appConfigService.config;  // récupérer les endpoints dans les assets
    this.apiConfiguration.setApiRoot(this.appSettings.settings.api);  // renseigner l'url des api
}
````

### Génération des api depuis fichier de config avec URL

Créer le fichier de config à la racine du projet

````typescript
{
  "$schema": "./node_modules/ng-openapi-gen/ng-openapi-gen-schema.json",
  "input": "http://server:8093/swagger/v1/swagger.json",
  "output": "./src/app/shared/api",
  "removeStaleFiles": false
}
````

Puis générer les api avec la commande ````ng-openapi-gen --config openapi-config.json````

[Back to top](#api-swagger)     
