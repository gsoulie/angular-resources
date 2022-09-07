[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Veille

* [e2e](#e2e)    
* [Qwik](#qwik)     
* [React JS](#reactjs)    
* [NextJS](#nextjs)    
* [VueJS 3.0](#vuejs-3-.-0)    
* [NuxtJS](#nuxtjs)     
* [Svelte](#svelte)    
* [Prisma](#prisma)     
* [NestJS](#nestjs)      
* [Nx](#nx)      
* [snowpack](#snowpack)     
* [deno](#deno)     
* [Netlify](#déploiement-serverless-avec-netlify)     
* [Flutter](#flutter)     
* [Remix](#remix)     
* [technos](#technos)       
* [Application fullstack NX, NestJS, Prisma, Angular](#application-fulllstack-nx-,-nestjs-,-prisma-,-angular)     
* [Angular 14](#angular-14)      
* [Supabase](#supabase)     

[<img src="https://img.shields.io/badge/TECH-MESSAGE-COLOR.svg?logo=LOGO">](testBadge)
[<img src="https://img.shields.io/badge/INFO-MESSAGE-BLUE.svg?logo=LOGO">](testBadge)
[<img src="https://img.shields.io/badge/INFO-MESSAGE-ORANGE.svg?logo=LOGO">](testBadge)

## Angular

Le plus populaire des frameworks js, surtout en europe. Aux US react est plus populaire.

Angular est le framework le plus complet (compilation, test, détection des changements etc...), c'est ce qu'il fait aussi que c'est le plus lourd et qu'il est un peu moins performant que React / Vue

Angular : Feature-rich, everything built-in, CLI, PWA...

React : minimaliste, focalisé sur la construction d'UI, plutôt une librairie qu'un framework

Vue : entre angular et react, framework focalisé sur le code, CLI...

|feature|angular|react|vue|
|-|-|-|-|
|UI/DOM manipulation|V|V|V|
|State management|V|-|V|
|Routing|V|X|V|
|Form validating...|V|X|X|
|Http Client|V|X|X|

## e2e
Protractor va être déprecié, il est conseillé de basculer sur **cypress** pour réaliser les tests e2e

## Qwik

**Qwik** est un nouveau framework javascript dont l'objectif principal est de s'attaquer à la problématique de **"time to interacteractive"** des applis web. Limiter les temps de récupération des ressources après server-side rendering et accélérer au maximum le chargement du site.

**Comment y parvenir :**

- Faire du **HTML first** comme le fait aussi **svelte**. Qwik va embarquer un grand nombre d'information dans le html pour limiter les opérations de récupération et faire du lazy-loading plus fort qu'habituellement en ne chargeant les ressources qu'au moment de leur affichage dans le viewport.      
- Embarquer l'état (le state) de la page dans le DOM (fait par le SSR). A tout moment on fait un snapshot de la page html      
- Retarder la création de listener le plus possible     
- Un seul listener global plutôt que plusieurs petits listeners     

## Reactjs
=> **lib js** : peut être appliqué à un bout de l'application ou à l'entièreté de l'application. Prise en main pas très évidente JSX
https://www.youtube.com/watch?v=no82oluCZag&ab_channel=LiorCHAMLA       
https://www.youtube.com/user/ucisko/videos        
https://www.youtube.com/watch?v=K3D2rjAUQ3o&ab_channel=FromScratch-D%C3%A9veloppementWeb        
librairie js (!== framework) 
code en JSX, surcouche JS introduite par REACT => nécessite la librairie Babel pour compiler le JSX react ne surveille pas les changements de variables. Il faut lui indiquer une sorte de detectChanges() si l'on souhaite mettre à jour la vue lorsque les variables sont modifiées

### Avantages / Inconvénients par rapport à Angular 

**Avantages**
* Performant
* Responsive
* React est centré sur JavaScript en encapsulant le HTML dans JS. Angular est plus centré sur HTML, qui est moins robuste
* Réduction du nombre d’opérations sur le DOM (Document Object Model), optimisation et accélération du processus de mises à jour (très utile pour les grosses bases de données)

**Inconvénients**
* Pas de moteur d'injection de dépendances
* Peu documenté
* Connaissance approfondie des bases du web

## NextJS

Next JS est un framework (backend) basé sur *ReactJS*, orienté Server-Side-Rendering. Son point fort est la génération d’applications statiques pour accélérer les temps d'accès et le référencement.

Concurrent de **NuxtJS** pour *Vue*

Framework 

## Vuejs 3.0
=> framework js : peut être appliqué à une partie de l'application ou à l'entièreté de l'application
https://www.learmoreseekmore.com/2021/01/ionic-vue-sample-using-vuex-statemanagement.html       
1:41 https://www.youtube.com/watch?v=mQ4zmFy4d7Y&ab_channel=Academind       
https://www.youtube.com/watch?v=5sNXjRE1C-U&ab_channel=LaTechavecBertrand (Option API)         
https://www.youtube.com/watch?v=L5_KLnHjt1M&ab_channel=LaTechavecBertrand (Vue cli, Vue router, Vue X)    
https://www.youtube.com/watch?v=Ts-2sA2az4s&ab_channel=Jojotique      

Plus proche d'angular dans sa syntaxe mais reste un mix entre react et angular. Utiliser Vue CLI pour créer une structure de projet, Vue Router pour le routing, Vue X (gestion d'état de la vue) pour partager des données entre plusieurs composants.

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

### Avantages / Inconvénients par rapport à Angular 

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

## Nuxt JS

Est un framework **Vuejs** : auto-import des composants, SEO simplifié, store intégré, Server-side rendering etc... permet d'organiser les projets Vue avec une structure par répertoire (comme pour angular).

Concurrent de **NExtJS** pour *ReactJS*

## Svelte
=> framework-**compilateur** js très proche de React et Vue mais améliore les performances car il effectue le plus gros du travail lors de la compilation ce qui implique des paquets moins volumineux. 
C'est donc plutôt un hybride, à la fois **framework** et **compilateur**. **Aucune librairie** à embarquer, **pas de DOM virtuel** contrairement à React / Vue / Angular / Ionic... 
Il propose un cadre de travail, avec ses méthodes et ses fonctionnalités, mais en plus il va compiler votre code en temps réel en JavaScript natif.

En contrepartie, certaines notions utilisent une syntaxe spécifique, svelte **ne gère pas tout seul** la mise à jour des références et mutations de tableaux, il faut donc s'en charger manuellement pour être sûr que la vue se mette à jour.

> codebase : html, css, js

## Prisma 
=> Est un ORM (Object Relational Mapper), soit un ensemble de classes permettant de manipuler les tables d’une base de données relationnelle comme s’il s’agissait d’objets.

Un ORM est une couche d’abstraction d’accès à la base de données qui donne l’illusion de ne plus travailler avec des requêtes mais de manipuler des objets.

> En bref : Couche de mapping object relationnel entre nodejs et typescript

## NestJS 
Framework Server Side pour NodeJS, compatible TS qui permet de faire du backend avec la même architecture / syntaxe qu'un front angular. Cela facilite la maintenance et l'organisation d'un projet NodeJS. Il vient en complément de Express. 
	- Il y a même un paquet pour gérer swagger
	- gère le mode monorepos

## NX
Nx est une suite d'outils permettant la gestion des solutions monorepos. 
Il permet dont de créer une application fullstack angular / nodejs (prisma + nestJS). 
Nx est un framework de construction intelligent et extensible qui vous aide à développer, tester, créer et mettre à l'échelle des applications Angular avec une prise en charge entièrement intégrée d'outils modernes tels que Jest, Cypress, Storybook, ESLint, NgRx, etc
NX est donc une extension d'angular CLI. Il suffit de lui coupler NEST (ou simplement NodeJS) (+ Prisma en bonus) pour créer un projet fullstack mono-repo

## snowpack

## deno 
concurrent nodejs pour le backend

## déploiement serverless avec netlify

## stencil 
avec Stencil, vous pouvez créer des composants avec la même syntaxe que React, mais dont le résultat final sera des Web Components natifs : c’est-à-dire que vous pourrez les réutiliser dans n’importe quel projet, qu’il s’agisse d’un site web ou d’une application créée avec n’importe quel framework JavaScript (Angular, React ou Vue).

Bien qu’il s’agisse d’un outil récent, il est déjà éprouvé : c’est avec Stencil que sont faits les composants d’Ionic, un framework de référence pour la création d’applications mobiles.

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

### Complément

Framework Google utilisant le langage DART permettant de développer des application web, mobile (hybride), desktop. Il est crossplatform, donc une seule codebase pour Android + ios

Flutter n'utilise pas les éléments d'interface utilisateur natifs, comme vous le trouverez dans React Native, et n'utilise pas non plus de composants Web comme Ionic. Au lieu de cela, Flutter propose sa propre bibliothèque de widgets d'interface utilisateur.

basé sur le moteur skia.

Dart fonctionne selon 2 modes : AOT (Ahead of time : le code est optimisé pour l'architecture sur laquelle il fonctionnera)
et JIT (just in time : hot reload). il intègre aussi un garbage collector.

Google a aussi choisi de réécrire tous les composants graphiques en Flutter. On est donc certain d'utiliser les rendus natifs des composants.
Ceci a une contrepartie, il faut incorporer tout le code des composants dans l'apk/ipa ce qui augmente la taille des bundles. Flutter embarque tout son propre 
ecosystème, là ou Ionic s'appuie sur les standards du web

Le langage Dart se veut être le successeur de JS et il s'exécute lui aussi dans les navigatgeurs, mais aussi sur seveur. Exécuté dans un navigateur,
lelangage Dart est transompilé avec *Dart2js*

Le principe de base de Flutter est que tout est un Widget et l'architecture est une imbrication de widgets.

Flutter vs Ionic

Avantages Flutter 
* hot-reload

Inconvénients (2021)
* framework jeune = petite communeauté, moins de bibliothèques
* problèmes de rendu
* compatibilité des plateformes (andtoid tv, android auto, car play)


Inconvénients Ionic
* Utilisation d'une webview = moins performant
* dépendant des plugins JS. Pour utiliser un plugin non JS, il faut le créer sois-même

## Remix
[Back to top](#veille)     

Remix est un jeune framework **fullstack javascript** (2021) gratuit basé sur **React** et qui utilise **nodeJS** pour faire du server-side rendering (SSR). 

[Back to top](#veille)     

## Angular 14

### Inject()

````typescript
import { WINDOW } from './window.token';

export class AppComponent {
	window = inject(WINDOW);	// Angular 14 notation
	
	constructor(@Inject(WINDOW) private window: Window) {
		console.log('window', this.window);
	}
}
````

La nouvelle syntaxe présente les avantages suivants :
* plus consise
* capable de déduire le type du jeton d'injection (plus besoin de le spécifier comme avec l'ancienne syntaxe)
* alléger le code dans le cas de l'héritage et s'affranchir de refactoring dans le cas d'une inversion d'ordre de déclaration,
ajout d'un nouveau service etc...

````typescript
export abstract class WidgetBase {
	constructor(
	protected dataService: DataService,
	protected settings: Settings) { }
}
````

**// ----> Angular 14**
````typescript
export abstract class WidgetBase {
	
	protected dataService: inject(DataService);
	protected settings: inject(Settings);
	
	constructor() {}
}
````

*appel*

````typescript
export class Home extends WidgetBase {
	data$;
	config;
	
	constructor(
	dataService: DataService,
	settings: Settings ) {
		super(dataService, settings);	// obligation d'injecter les services attendus dans l'ordre attendu.
		// si d'autres paramètres venaient à être ajoutés, il faudrait alors modifier le code pour les ajouter
	}
	
	getData() {
		this.data$ = this.dataService.loadData();
	}
}
````

**// ----> Angular 14**
````typescript
export class Home extends WidgetBase {
	data$;
	config;
	
	constructor() {
		super();	// plus besoin d'injecter les services dans le constructeur
	}
	
	getData() {
		this.data$ = this.dataService.loadData();
	}
}
````

## Supabase

https://supabase.com/alternatives/supabase-vs-firebase      

Supabase est un concurrent de Firebase avec quelques différences tout de même. La différence majeure est que Supabase s'appuie sur postgreSQL au lieu d'une base de données orienté document (key-value) pour Firebase.

Avantages :
* postgreSQL     
* requêtage SQL      
* jusqu'à 4x plus performant que Firebase (key-value)      
* Authentifications tiers (google, facebook, twitter...)      
* Storage comme Firebase     
