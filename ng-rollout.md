[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Déploiement

* [Méthode générale](#méthode-générale)
* [Déploiement projet type workspace](#déploiement-projet-type-workspace)         
* [Déployer une application avec url suffixée](#déployer-une-application-avec-url-suffixée)      
* [Environnements multiples](#environnements-multiples)      

## Méthode générale
Après avoir compilé en mode production ````ng build --configuration=production```` copier le contenu du répertoire dist sur le serveur web.

Suivant le serveur et la configuration utilisée, il est probable qu'il faille crééer un fichier *web.config* pour assurer la redirection des routes non autorisées :

*web.config*
````html
<?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.webServer>
        <rewrite>
          <rules>
            <rule name="AngularJS Routes" stopProcessing="true">
              <match url=".*" />
              <conditions logicalGrouping="MatchAll">
                <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />   
              </conditions>
              <action type="Rewrite" url="/" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
    </configuration>
````
Ce fichier doit se trouver à la racine avec le index.html.

## Déploiement projet type workspace

Après compilation, le répertoire dist contriendra plusieurs répertoires (1 pour chaque application et 1 pour chaque lib). Il n'est pas utile de copier les répertoires des libs sur le serveur,
en effet ces dernières sont déjà intégrées dans chacun des projets lors de la compilation.

Il suffit donc de copier le contenu de chaque appli et de le déposer sur le serveur.
[Back to top](#déploiement)     

## Déployer une application avec url suffixée

Dans le cadre d'un déploiement de plusieurs applications sous un même environnement (qui utilise 1 seul certificat), il est nécessaire de pouvoir déployer
chaque application avec une route suffixée pour séparer chaque applications.

Ex :       
https://mon-env-prod/mon-app-1/home        
https://mon-env-prod/mon-app-2/home       
https://mon-env-prod/mon-app-3/home       

Pour parvenir à ce résultat il existe plusieurs solutions. 

**Solution 1**

Compiler le projet avec la ligne de commande suivante ````ng build --configuration=production --base-href "/mon-suffixe/"````

> IMPORTANT : il faut bien ajouter un "/" avant et après le suffixe
> IMPORTANT : ne pas modifier la balise <base href> du index.html (conserver la route "/")

Ceci va permettre de faire pointer toutes les routes vers un chemin contenant le suffixe choisi.

Ensuite suivant le serveur cible (IIS, apache, nginx...) il va falloir créer un fichier de config (web.config pour IIS, .htaccess pour apache...) dans lequel
on va paramétrer la réécriture des routes. Sans ça, le serveur ne parviendra pas à trouver les fichier js et servira au client le fichier index.html

*exemple web.config*
````html
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Rewrite Angular file ressources">
          <match url="^myApp/(.+)(\.[A-z0-9]+)$" />
          <action type="Rewrite" url="/{R:1}{R:2}" />
        </rule>
        <rule name="Rewrite Angular router">
          <match url="^myApp/(.+)" />
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
````

Remarque : Selon les serveurs, le regex peut être ````^myApp\/(.+)(\.[A-z0-9]+)$````  pour échapper le "/"

**Solution 2**

On peut aussi spécifier la *base-href* dans le fichier **app.module.ts**

*app.module.ts*

````typescript
import { APP_BASE_HREF } from '@angular/common';

...
providers: [{
	provide: APP_BASE_HREF, useValue : '/myApp/' // <--- important le / au début et à la fin
}]
````

Avec cette méthode, il n'est **plus nécessaire** d'ajouter le paramètre ````--base-href```` à la commande de build. Il reste néanmoins **indispensable** de créer un fichier de configuration sur le serveur
pour réécrire les routes.

### Gérer les redirections d'authentification

Si les applications utilisent une authentification tierce type SSO (IS4, Aure AD...) il faut aussi ajouter des règles spécifiques dans le fichier de configuration serveur.
[Back to top](#déploiement)     

## Environnements multiples

Dans le répertoire *environments* se trouvent par défaut 2 fichiers. Un pour le mode debug et un pour le mode production. Il est possible d'en créer autant que l'on souhaite en conservant la syntaxe de nommage *environment.env.ts* (environment.integration.ts)

Pour ensuite pouvoir *run* ou compiler sur un des environnements cible, il faut modifier le fichier *angular.json* pour rajouter les nouveaux environnements dans 
le noeud **build** et **serve**

*angular.json*

````typescript
"architect": {
	"build": {
	"configuration": {
	    "production": ...
	    "development": ...
	    "integration": ... // <-- ajout integration
	    "recette": {	// <-- ajout recette
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.recette.ts"
                }
              ],
              "outputHashing": "all"
            },
		}
	}
}
"serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "ng-sandbox2022:build:production"
            },
            "recette": {
              "browserTarget": "ng-sandbox2022:build:recette"	// ajout recette
            },
            "development": {
              "browserTarget": "ng-sandbox2022:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
````

````
ng serve -o --configuration=recette
ng serve -o --configuration=production
ng serve -o // défaut development

ng build --configuration=production
ng build --configuration=recette
````

[Back to top](#déploiement)     
