[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Veille

* [technos](#technos)       
* [Application fullstack NX, NestJS, Prisma, Angular](#application-fulllstack-nx-,-nestjs-,-prisma-,-angular)     

### e2e
Protractor va être déprecié, il est conseillé de basculer sur **cypress** pour réaliser les tests e2e

### Reactjs
=> **lib js** : peut être appliqué à un bout de l'application ou à l'entièreté de l'application. Prise en main pas très évidente JSX
https://www.youtube.com/watch?v=no82oluCZag&ab_channel=LiorCHAMLA       
https://www.youtube.com/user/ucisko/videos        
https://www.youtube.com/watch?v=K3D2rjAUQ3o&ab_channel=FromScratch-D%C3%A9veloppementWeb        
librairie js (!== framework) 
code en JSX, surcouche JS introduite par REACT => nécessite la librairie Babel pour compiler le JSX react ne sureveille pas les changements de variables. Il faut lui indiquer une sorte de detectChanges() si l'on souhaite mettre à jour la vue lorsque les variables sont modifiées

#### Avantages / Inconvénients par rapport à Angular 

**Avantages**
* Performant
* Responsive
* React est centré sur JavaScript en encapsulant le HTML dans JS. Angular est plus centré sur HTML, qui est moins robuste
* Réduction du nombre d’opérations sur le DOM (Document Object Model), optimisation et accélération du processus de mises à jour (très utile pour les grosses bases de données)

**Inconvénients**
* Pas de moteur d'injection de dépendances
* Peu documenté
* Connaissance approfondie des bases du web


### vuejs 3.0
=> framework js : peut être appliqué à une partie de l'application ou à l'entièreté de l'application
https://www.learmoreseekmore.com/2021/01/ionic-vue-sample-using-vuex-statemanagement.html       
1:41 https://www.youtube.com/watch?v=mQ4zmFy4d7Y&ab_channel=Academind       
https://www.youtube.com/watch?v=5sNXjRE1C-U&ab_channel=LaTechavecBertrand (Option API)         
https://www.youtube.com/watch?v=L5_KLnHjt1M&ab_channel=LaTechavecBertrand (Vue cli, Vue router, Vue X)    
https://www.youtube.com/watch?v=Ts-2sA2az4s&ab_channel=Jojotique      

Plus proche d'angular dans sa syntaxe mais reste un mix entre react et angular utiliser Vue CLI pour créer une structure de projet, Vue Router pour le routing, Vue X (gestion d'état de la vue) pour partager des données entre plusieurs composants.

vuex : pour gérer le state

2 types d'implémentations : Options API (classique) et Composition API (nouvelle façon de faire)

outils : vue.js devtools (extension chrome)

Ancienne API : Option API 
Nouvelle API : CompositionAPi

````
Option API : 
new Vue({
	el: '',
	data: {},
	computed: {},
	methods: {},
	watch: {}
})

CompositionAPi :

setup() {
	watch() {},
	function xxxx () {}
	
	return {
		...
	}
}
````

#### Avantages / Inconvénients par rapport à Angular 

**Avantages**
* Plus performant
* Syntaxe plus simple pour un non-initié
* Peut être appliqué à tout ou partie d'une application => pas d'obligation de développer entièrement l'application en Vue contrairement à Angular
* Plus léger ? Embarque moins de choses, framework moins lourden poids
* Orienté app web
* Conçu pour résoudre certains problèmes d'Angular / React

**Inconvénients**
* Pas vraiment adapté pour les app mobiles (à confirmer avec le support de Vue par Ionic)
* stabilité
* manque d'évolutivité (pas encore adapté aux applications complexes)
* manque de plugins (écart qui tend à se résorber au cour du temps)

### Nuxt JS

Est un framework Vuejs : auto-import des composants, SEO simplifié, store intégré, Server-side rendering etc... permet d'organiser les projets Vue avec une structure par répertoire (comme pour angular)

### Svelte
=> framework-**compilateur** js très proche de React et Vue mais améliore les performances car il effectue le plus gros du travail lors de la compilation ce qui implique des paquets moins volumineux. 
C'est donc plutôt un hybride, à la fois **framework** et **compilateur**. **Aucune librairie** à embarquer, **pas de DOM virtuel** contrairement à React / Vue / Angular / Ionic... 
Il propose un cadre de travail, avec ses méthodes et ses fonctionnalités, mais en plus il va compiler votre code en temps réel en JavaScript natif.

En contrepartie, certaines notions utilisent une syntaxe spécifique, svelte **ne gère pas tout seul** la mise à jour des références et mutations de tableaux, il faut donc s'en charger manuellement pour être sûr que la vue se mette à jour.

> codebase : html, css, js

### Prisma 
=> Est un ORM (Object Relational Mapper), soit un ensemble de classes permettant de manipuler les tables d’une base de données relationnelle comme s’il s’agissait d’objets.

Un ORM est une couche d’abstraction d’accès à la base de données qui donne l’illusion de ne plus travailler avec des requêtes mais de manipuler des objets.

> En bref : Couche de mapping object relationnel entre nodejs et typescript

### NestJS 
=> framework NodeJS, compatible TS qui permet de faire du backend avec la même architecture / syntaxe qu'un front angular. Cela facilite la maintenance et l'organisation d'un projet NodeJS. Il vient en complément de Express. 
	- Il y a même un paquet pour gérer swagger
	- gère le mode monorepos

### NX
Nx est une suite d'outils permettant la gestion des solutions monorepos. 
Il permet dont de créer une application fullstack angular / nodejs (prisma + nestJS). 
Nx est un framework de construction intelligent et extensible qui vous aide à développer, tester, créer et mettre à l'échelle des applications Angular avec une prise en charge entièrement intégrée d'outils modernes tels que Jest, Cypress, Storybook, ESLint, NgRx, etc
NX est donc une extension d'angular CLI. Il suffit de lui coupler NEST (ou simplement NodeJS) (+ Prisma en bonus) pour créer un projet fullstack mono-repo

### snowpack

### deno 
concurrent nodejs pour le backend

### déploiement serverless avec netlify

### stencil 
=> permet la création de composants avec syntaxe react mais dont le résultat est un web component natif utilisable dans n'importe quel projet / application js (angular, ionic, react, vue...). C'est avec Stencil que sont faits les composants
de Ionic

## Application fulllstack NX, NestJS, Prisma, Angular
[Back to top](#veille)     

https://nicolasfazio.ch/programmation/angular/developper-des-applications-full-stack-avec-angular-cli-et-nx-workspace
https://www.youtube.com/watch?v=bvzXuAu7XHk&list=RDCMUCptAHlN1gdwD89tFM3ENb6w&start_radio=1&rv=bvzXuAu7XHk&t=640&ab_channel=Prisma

Créer un workspace NX Angular : 

1 - installer nx globalement sur la machine

2 - créer le workspace ````npx create-nx-workspace@latest <my-workspace>````
-> choisir le preset angular-nest pour avoir l'installation complète backend + front

3 - run api ````nx serve api //-> lancer le backend (npm run nx serve api)````

4 - installation prisma
````
npm i @prisma/client
npm i -D prisma // dev dependencies
````
5 - initialiser prisma ````npx prisma init````

6 - créer des model dans le fichier *.schema* (**attention** pour le moment il n'est pas possible de gérer les models dans des fichiers différents)

7 - créer la base : ````npx prisma db push --preview-feature````

8 - (migration pour chaque modif de table) 

9 - Lancer prisma studio (visualisateur de bdd) ````npx prisma studio````

10 - générer un mock : créer un fichier **seed.ts**

11 - configuration du seed ````npm i esbuild --save-dev````
puis ajouter la ligne suivante dans la sections "scripts" du package.json : 
````typescript
"seed":"esbuild prisma/seed.ts --outfile=node_modules/tmp-seed.cjs --bundle --format=cjs --external:prisma --external:@prisma/client && node node_modules/tmp-seed.cjs --preview-feature"
````

12 - peupler la base avec le seed ````npm run seed````

12b - IMPORTANT !!! à chaque modification du model il faut penser à faire un ````npx prisma migrate dev --name <migration_name>````

13 - générer la lib "card" avec un controler et un service ````npm run nx generate @nrwl/nest:library cards --controller --service````
**attention** il est possible que les fichiers service.ts et controler.ts ne se crééent pas automatiquement, dans ce cas il faut les créer à la main et ajouter leur import dans le fichier module.ts atenant

14 - importer l'api dans le projet apps/api/src/app/app.module.ts 
=> importer le module de l'api
puis tester l'appel ex : http://localhost:3333/api/cards

15 - générer une lib angular
````
npm run nx generate @nrwl/angular:lib ui	// génère la lib "ui"
npm run ng g component cards --project=ui --export	// créer un composant dans la lib "ui"
npm run ng g service cards --project=ui --export	// créer un service dans la lib "ui"
````

16 - Build prod pour déploiement ````ng build --prod myapp && ng build --prod````

### Création des ENDPOINTS

````typescript
@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) {}

    @Get('/')
    public async getCards(): Promise<Card[]> {
      return this.cardsService.getCards();
    }

    @Get('/:name')
    public async getCardsByName(@Param('name') name = ''): Promise<Card[]> {
      return this.cardsService.getCardsByName(name);
    }

}
````
==> Equivalent à si on ne spécifie pas de nom de controller

````typescript
@Controller()
export class CardsController {
    constructor(private cardsService: CardsService) {}

    @Get('cards')
    public async getCards(): Promise<Card[]> {
    }

    @Get('cards/:name')
    public async getCardsByName(@Param('name') name = ''): Promise<Card[]> {
    }
}
````  
[Back to top](#veille)     

## Flutter

Framework Google pour créer des application mobile android / ios. Basé sur le langage DART
particularité : il génère du code natif pour chaque plateforme

Contrairement à React Native, Google a choisi la solution la plus compliquée, à savoir recréer l’ensemble des composants graphiques en Flutter. Cette direction qui demande un travail colossal a un énorme avantage : les développeurs sont toujours certains d’avoir le rendu souhaité sur les différentes plateformes. Exit la gestion des versions sur Android, où Holo et Material n’ont cessé d’évoluer au fil du temps.

En contrepartie, cela veut dire qu’en utilisant Flutter dans son application, il est nécessaire d’incorporer ce code, qui vient alourdir l’apk/ipa finale..

Flutter met à disposition une grande variété de bibliothèques d’éléments d’IU standard pour Android et iOS.

Il reste cependant aussi adapté au développement d’applications web de bureau classiques. Les applications développées avec Flutter prennent l’aspect d’applications typiques des systèmes correspondants et se comportent également de manière similaire, sans que le programmeur, c’est-à-dire vous, n’ait besoin de prêter attention à ces caractéristiques.

Le Flutter SDK se base sur le langage de programmation Dart également développé par Google. Il se veut le successeur moderne du langage JavaScript classique et, tout comme ce dernier, il s’exécute directement sur les navigateurs, sous forme d’application web. Les programmes Dart peuvent aussi être exécutés directement sur un serveur.
Lors de la compilation, le compilateur Dart génère du code natif pour chaque plateforme.

> Important : Flutter n'utilise pas les composant UI natifs comme REACT et n'utilise pas de composant Web comme Ionic, il propose sa propre bibliothèque de composant

> Important : Flutter accède aux fonctionnalités native des devices via des plugins comme Ionic (Cordova)

> Important : Les bundle Flutter sont plus volumineux du fait qu'il embarque son propre écosystème

Dans le navigateur, ils sont employés avec le transcompilateur Dart2js dans JavaScript.

### Flutter vs Ionic

Ionic et Flutter partagent la même philosophie à savoir proposer une codebase unique pour développer des application mobile et web

La différence fondamentale est que Ionic est entièrement basé sur les technologies et standards web, quand Flutter utilise son propre écosystème, son propre moteur de rendu...

## Remix
[Back to top](#veille)     

Remix est un jeune framework **fullstack javascript** (2021) gratuit basé sur **React** et qui utilise **nodeJS** pour faire du server-side rendering (SSR). 



[Back to top](#veille)     
  
