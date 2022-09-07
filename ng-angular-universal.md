[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Angular Universal

* [Angular Universal](#angular-universal)      
* [NestJS](#nestjs)      

## Angular Universal

https://angular.io/guide/universal

Initialement, les interfaces Angular sont entièrement rendues dans le browser CSR (Client Side Rendering). Angular universal permet de pre-render l'app angular côté serveur.

> Angular universal créé donc un simple serveur qui fait simplement un pré-rendu des pages angular quand on les visites.

### Ajouter angular universal dans un projet

Récupérer l'identifiant de l'application dans le fichier *angular.json*


````ng add @nguniversal/express-engine````

Plusieurs nouveaux fichiers seront générés à la suite de l'installation :

* app.server.module.ts : 
* main.server.ts : bootstrap de l'app server
* server.ts : express server web
* tsconfig.server.ts

> Vérifier que les imports soient corrects dans les fichiers *app.server.module.ts* et *server.ts*

On peut aussi constater l'ajout de nouvelles commandes npm dans le *package.json*

````json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "dev:ssr": "ng run first-app:serve-ssr",	// <--
    "serve:ssr": "node dist/first-app/server/main.js",	// <--
    "build:ssr": "ng build && ng run first-app:server",	// <--
    "prerender": "ng run first-app:prerender"
  },
````

A partir de maintenant l'application sera d'abord rendue côté serveur. Cela signifie que certaines API (disponible côté client uniquement)
peuvent ne pas être disponible côté serveur et générer des erreurs. C'est le cas par exemple de **LocalStorage**

Pour résoudre ce problème il faut injecter un nouvel identifiant là où cela est nécessaire (component, service, etc...) et encadrer le code
utilisant des APIs "client" par un contrôle.

````typescript
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

constructor(@Inject(PLATFORM_ID) private platformId) { }

ngOnInit() {
	if (isPlatformBrowser(this.platformId)) {
		// traitement utilisant des api non accessibles côté serveur : du localStorage par exemple
	}
}

````

### Déploiement

Il est important de noter que pour le déploiement, le serveur sur lequel sera déployé l'application doit être capable d'exécuter du nodeJS

npm run build:ssr
npm run serve:ssr

> Remarque : lors de l'exécution dans chrome l'affichage ne fonctionne pas en mode mobile

[Back to top](#angular-universal)     

## NestJS

NestJS est un framework Server Side pour NodeJS basé sur une architecture projet type Angular et utilise Typescript

````ng add @nestjs/ng-universal```` ou ````ng add @nestjs/ng-universal@5```` en cas d'erreur d'installation

La différence avec Angular Universale est qu'on fait du pré-rendering côté server comme Angular universale mais maintenant avec une application NestJS qui lui est rattaché

Après l'installation, un nouveau répertoire **server** est créé à la racine du projet

Tout comme Angular universal il faut injecter le PLATFORM_ID pour encadrer le code des API accessibles côté client uniquement

````typescript
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

constructor(@Inject(PLATFORM_ID) private platformId) { }

ngOnInit() {
	if (isPlatformBrowser(this.platformId)) {
		// traitement utilisant des api non accessibles côté serveur : du localStorage par exemple
	}
}

````

### Déploiement

````
ng build --configuration=production
npm run <appName>:server:production
npm run serve:ssr
````

Le contenu du répertoire *dist* contient maintenant un répertoire *server* qu'il faudra aussi copier sur le serveur

On peut ensuite visualiser le résultat via *http://localhost:4000*

[Back to top](#angular-universal)     