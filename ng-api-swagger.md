[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Api Swagger

## ng-openapi

Dans le cas d'un couplage avec des APIs hébergées sur un swagger, il est recommandé d'utiliser **ng-openapi**. Il permet, à partir du fichier json de description de l'api swagger de générer automatiquement les apis (les enums, models, services...) directement dans le projet Angular.

> Remarque : La génération des api écrase tout le contenu du répertoire contenant les apis.

documentation : [https://www.npmjs.com/package/ng-openapi-gen](https://www.npmjs.com/package/ng-openapi-gen)

*installation*
````
npm install -g ng-openapi-gen
````

**L'import des api dans le front peut se faire de deux manière** : 
* la première prend en paramètre **l'url du fichier json** de swagger
* la seconde qui nécessite de **copier le json à la racine du workspace (ou projet) angular** et de passer le chemin en paramètre à la commande de génération.

> **Si l'environnement du swagger n'est pas sécurisé par un certificat** (ex environnement de developpement), il n'est pas possible d'utiliser *ng-openapi* en lui passant simplement l'url du json.
Il faut alors récupérer le json de l'api et le copier à la racine du répertoire du workspace (swagger-api.json) qui servira de point d'entrée à la génération.

**IMPORTANT** : cela implique qu'à chaque changement des apis côté swagger il faudra re-récupérer le json et relancer une génération.

### Génération depuis copie du fichier json du swagger

*génération des éléments*
````
// commande a exécuter depuis le répertoire workspace/frontend
ng-openapi-gen --input swagger-api.json --output projects\src\lib\api
````


### Génération des api depuis fichier de config avec URL du swagger

Créer un fichier de config à la racine du projet afin de renseigner le schéma à utiliser, l'url où est hébergé le json du swagger, ainsi que le répertoire dans lequel on souhaite générer les apis / dto etc...

*openapi-config.json*
````typescript
{
  "$schema": "./node_modules/ng-openapi-gen/ng-openapi-gen-schema.json",
  "input": "https://server:8093/swagger/v1/swagger.json",
  "output": "./src/app/shared/api",
  "removeStaleFiles": true  // si false, ne supprimera pas les anciens fichiers s'il y a eu des suppressions
}
````

Puis générer les api avec la commande suivante (depuis la racine du projet) 
````
ng-openapi-gen --config openapi-config.json
````

### Configuration

Une fois les api générées, un fichier **api-configuration.ts** est créé dans le répertoire api. Il prend la forme suivante

*api-configuration.ts*
````typescript
import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string = '';
}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
````
Pour pouvoir se connecter aux api, il va falloir configurer l'url de base du serveur ````rootUrl````. 

> On ne peut pas directement configurer l'url de base ````rootUrl```` dans ce fichier car ce dernier est regénéré à chaque génération des API

La configuration peut alors se faire de deux façons :

#### configuration via app.config.ts

*app.module.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ApiModule.forRoot({ rootUrl: 'https://www.my-swagger.com/api' }),
      // ApiModule.forRoot({rootUrl: environment.WebServiceUrl})  // récupération depuis environment
    )
  ]
}
````

#### récupération endpoint depuis un asset pour une configuration plus dynamique

*app.component.ts*

````typescript
import { ApiConfiguration } from './shared/api/api-configuration';

constructor(
    private configurationService: ConfigurationService,
    private apiConfiguration: ApiConfiguration) {

    this.appSettings = this.configurationService.config;  // récupérer la configuration depuis les assets
    this.apiConfiguration.rootUrl = this.appSettings.api.endpoint;  // renseigner l'url endpoint
  }
````
