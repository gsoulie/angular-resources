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

Une fois les api générées, il faut configurer l'url de base du serveur dans le fichier *src/lib/api/api-configuration.ts*. Deux méthodes sont possibles

#### configuration app.module.ts

*app.module.ts*
````typescript
imports: [
  ...
  ApiModule.forRoot({ rootUrl: 'https://www.example.com/api' }),
  // ApiModule.forRoot({rootUrl: environment.WebServiceUrl})  // récupération depuis environment
]
````

#### récupération endpoint depuis un asset pour une configuration plus dynamique

*app.component.ts*

````typescript
import { ApiConfiguration } from './shared/api/api-configuration';

constructor(private configurationService: ConfigurationService,
    private apiConfiguration: ApiConfiguration) {
    this.appSettings = this.configurationService.config;  // récupérer la configuration depsuis les assets
    this.apiConfiguration.rootUrl = this.appSettings.api.endpoint;  // renseigner l'url endpoint
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

Puis générer les api avec la commande suivante (depuis la racine) ````ng-openapi-gen --config openapi-config.json````

[Back to top](#api-swagger)     
