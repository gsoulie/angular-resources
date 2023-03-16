[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Veille

* [Frameworks frontend](#frameworks-frontend)        
	* [Angular](#angular)    
	* [Ionic](#ionic)    
	* [ReactJS](#reactjs)    
	* [Vue3](#vue3)    
	* [Nativescript](#nativescript)    
	* [Svelte](#svelte)    
	* [Flutter](#flutter)    
	* [Qwik](#qwik)     
	* [Solid](#solid)    
	* [Astro](#astro)   
	* [COMPARATIF frameworks crossplatform](#comparatif-frameworks-crossplatform)      
	* [Tauri](#tauri)      
	* [Electron](#electron)    
	* [Expo](#expo)    
* [Backends](#Backends)     
	* [NuxtJS](#nuxtjs)  
	* [NextJS](#nextjs)  	  
	* [Prisma](#prisma)     
	* [NestJS](#nestjs)     
	* [Deno](#deno)    
	* [Supabase](#supabase)    
	* [Netlify](#netlify)     
	* [GraphQL](#graphql)     
	* [PouchDB / couchDB](#pouchDB)     
* [Autres](#Autres)     
	* [e2e](#e2e)     
	* [Stencil](#stencil)      
	* [NX - fullstack](#nx)    
	* [Fullstack NX, NestJS, Prisma, Angular](#fullstack-nx-nestjd-prisma-angular)      
	* [Remix - fullstack](#remix)     
	* [ViteJS](#vite)     
	* [esbuild](#esbuild)      
	
## Frameworks frontend

### Angular

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

[Back to top](#veille)     

### Version 14

#### Inject()

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

[Back to top](#veille)     

### Ionic

Ionic est un framework javascript, basé sur Angular et Typescript. Il permet de créer des applications mobiles hybrides basées sur les technologies web (html, css, js) via des webview. En outre ionic n'utilise pas les composants natifs mais propose une bibliothèque de composant web natif-like qui reproduisent le look-and-feel natif.
Couplé à Capacitor, il permet un accès complet à toutes les fonctionnalités d'API native Android / iOS en les embarquant dans une webview.

l'UI de ionic est exécuté dans une WebView qui est un navigateur sans en-tête. En mode web, le code est directement exécuté dans le 
navigateur.

Les composants UI utilisés par ionic utilisent les standards Web Components, de fait ils peuvent être exécutés dans n'importe quel 
navigateur et sont compatibles avec tous les frameworks JS / React / Vue et Angular.

[Back to top](#veille)     

### ReactJS

=> Orienté **librairie js** : qui permet de créer des composant et qui peut être appliqué à un bout de l'application ou à l'entièreté de l'application. Prise en main pas très évidente JSX
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

### React Native

(Voir documentation (https://github.com/gsoulie/react-resources/blob/main/react-presentation.md))

Concernant le développement d'application mobile cross-paltform, React Native est plus compliqué à prendre en main qu'une application Ionic/Angular couplée à Capacitor.

En effet React Native nécessite l'installation de nombreux packages pour pouvoir développer avec TS, Sass, faire du routing etc... De plus il existe plusieurs CLI etc...

[Back to top](#veille)   

### Vuejs 3.0
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


[Back to top](#veille)     

### Nativescript

Nativescript est un framework permettant de créer de vraies application mobiles natives avec Angular / Vue et Typescript. Il communique directement avec les api natives. **Contrairement** à Capacitor, nativescript n'utilise pas une technique basée sur les webview.

Les applications créees avec Nativescript peuvent s'exécuter directement sur un device. Il n'est pas nécessaire d'utiliser de la cross-compilation ou d'intéraction avec un navigateur.

Nativescript est plus rapide qu'Ionic car il est directement connecté aux apis natives. Il injecte directement les apis iOS et Android dans la machine virtuelle JS. 

Nativescript utilise *JavascriptCore* pour iOS et exécute Android via *V8 virtual machine*.

Au niveau UI, NativeScript permet d'écrire les UI sur chaque plate-forme indépendamment. L'UI est stockée dans des fichiers XML avec du style CSS, tandis que la logique métier se trouve dans des fichiers Javascript et TypeScript.

> A noter : Le poids des bundle est plus important qu'avec Ionic / React et il n'y a pas de support du HTML et du DOM

[Back to top](#veille)     

### Flutter

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

#### Flutter vs Ionic

Ionic et Flutter partagent la même philosophie à savoir proposer une codebase unique pour développer des application mobile et web

La différence fondamentale est que Ionic est entièrement basé sur les technologies et standards web, quand Flutter utilise son propre écosystème, son propre moteur de rendu...

[Back to top](#veille)     

#### Complément

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

[Back to top](#veille)     

### Qwik

**Qwik** Qwik est un framework de développement web open-source qui a été créé pour faciliter la création de **sites web statiques** rapides est de s'attaquer à la problématique de **"time to interacteractive"**. Il utilise des concepts de compilateurs de template pour générer des pages HTML à partir de données de modèle et de composants réutilisables. Qwik se concentre principalement sur les sites web statiques, c'est-à-dire des sites web qui ne nécessitent pas de mise à jour en temps réel des données côté serveur. Il peut donc être utilisé pour créer des sites web commerciaux, des blogs, des portfolios, des landing pages, etc.

Il est important de noter que Qwik **n'est pas conçu pour créer des applications web dynamiques qui nécessitent une communication en temps réel avec un serveur ou des fonctionnalités de navigation et de routage avancées.**

**Comment y parvenir :**

- Faire du **HTML first** comme le fait aussi **svelte**. Qwik va embarquer un grand nombre d'information dans le html pour limiter les opérations de récupération et faire du lazy-loading plus fort qu'habituellement en ne chargeant les ressources qu'au moment de leur affichage dans le viewport.      
- Embarquer l'état (le state) de la page dans le DOM (fait par le SSR). A tout moment on fait un snapshot de la page html      
- Retarder la création de listener le plus possible     
- Un seul listener global plutôt que plusieurs petits listeners     

En résumé, Qwik et Svelte se concentrent sur la performance en utilisant des techniques d'optimisation du code JavaScript, tandis que Solid se concentre sur la création d'applications web décentralisées en utilisant des protocoles de type WebID.

[Back to top](#veille)     

### Solid

Solid est un framework JavaScript pour la création d'applications web décentralisées (dApps). Il utilise une architecture basée sur des agents pour permettre la communication entre les différentes parties de l'application, et utilise des protocoles de type WebID pour gérer l'accès aux données. Solid vise à faciliter la création d'applications décentralisées basées sur les principes de la Web sémantique et du Web décentralisé.

[Back to top](#veille)     

### Astro

https://www.youtube.com/watch?v=mNmqG4lH4sg&ab_channel=DevTheory

Permet le développement de fronts statiques (multi-pages) générés avec un rendu serveur. Aucun javascript ou presque n'est présent côté client. C'est le serveur qui exécute le javascript, recalcule le rendu et renvoi la page au client. L'objectif est de concevoir des sites avec un time to interact le plus faible possible.

Astro regroupe quasi tous les framework JS (react, vue, angular, svelte, alpine...). On peut en effet intégrer très facilement dans astro des composants react, vue, angular etc... et indiquer pour chacun s'ils ont besoin de réactivité (exécution code JS côté client) ou non via une directive de type ````client:load````, ````client:visible```` etc....

*Petit exemple d'intégration d'un composant Vue*

*index.astro*
````jsx
---
import Layout from '../layouts/Layout.astro';
import Counter from '../components/Counter.vue'; // <-- import d'un composant Vue
---

<Layout title="Welcome to Astro">
	<main>
		<h1>Integration composant Vue</h1>
		<Counter client:load />
	</main>
</Layout>
````

[Back to top](#veille)     

### COMPARATIF frameworks crossplatform

Quand utiliser **Capacitor**

* si l'on souhaite avoir 1 seule code base pour le web, android, ios
* gain de temps sur le developpement
* porter une app web (angular, react, vue, svelte, etc...) en natif
* correction de bug simplifiée car 1 seule codebase

Quand utiliser **React Native**

* si les équipes ont déjà des connaissances en React
* on possède déjà un projet React à migrer en natif (attention seul le code métier est récupérable ! la vue et le css seront différents)
* on souhaite cibler uniquement les plateformes mobiles

Quand utiliser **Flutter**

* si l'on souhaite produire une application mobile avec l'expérience la plus proche du natif (performance, rendu, transitions etc...)
* pas de prise de tête sur le choix du framework UI
* tout est inclus (routing etc...) pas de dépendances à installer
* installation facile et rapide (pas de nodejs)
* être certain de toujours avoir des packages à jour (pas de dépendances tiers non maintenues etc...)
* la meilleure alternative cross-platform avant de dev directement en natif

[Back to top](#veille)     

### Tauri

Tauri est un framework open-source qui permet de créer des applications de bureau multiplateformes (Windows, Mac, Linux) à partir de code web (JavaScript, HTML, CSS). Il utilise le navigateur Chromium en arrière-plan pour rendre l'application, tout en offrant une API pour accéder aux fonctionnalités natives de l'OS (comme les fichiers, les dossiers, les notifications, etc.).

Le positionnement de Tauri est d'offrir une alternative aux frameworks traditionnels pour la création d'applications de bureau, en utilisant le code web déjà existant. Il permet de créer des applications de bureau performantes et fiables, tout en utilisant les compétences de développement web existantes.

Les avantages de Tauri sont:

* Utilisation du code web existant pour créer des applications de bureau
* Multiplateforme (Windows, Mac, Linux)
* Accès aux fonctionnalités natives de l'OS
* Performance similaire aux applications de bureau traditionnelles

Les inconvénients de Tauri sont:

* La nécessité d'apprendre une nouvelle API pour accéder aux fonctionnalités natives de l'OS
* La nécessité de configurer un environnement de développement pour chaque plateforme cible
* Le rendu de l'application peut être légèrement différent de celui d'un navigateur web

En résumé Tauri est un framework open-source qui permet de créer des applications de bureau multiplateformes à partir de code web existant, offrant un accès aux fonctionnalités natives de l'OS, avec des performances similaires aux applications de bureau traditionnelles, mais nécessitant une nouvelle API pour accéder aux fonctionnalités natives de l'OS, une configuration d'environnement pour chaque plateforme cible et un léger différent de rendu par rapport aux navigateurs web.

**Comparaison avec Capacitor**

Tauri et Capacitor sont tous les deux des frameworks qui permettent de créer des applications de bureau à partir de code web, mais ils ont quelques différences clés :

Technologie de base: Tauri utilise le navigateur Chromium pour rendre l'application, tandis que Capacitor utilise des WebViews natifs pour chaque plateforme cible.
API: Tauri offre une API pour accéder aux fonctionnalités natives de l'OS (comme les fichiers, les dossiers, les notifications, etc.), tandis que Capacitor se concentre sur l'accès aux fonctionnalités de l'appareil (comme la caméra, le microphone, l'accéléromètre, etc.).
Configuration: Tauri nécessite une configuration spécifique pour chaque plateforme cible, tandis que Capacitor utilise des plugins pour accéder aux fonctionnalités natives de l'appareil, ce qui facilite la configuration pour les différentes plateformes.
En résumé, Tauri et Capacitor sont tous les deux des frameworks qui permettent de créer des applications de bureau à partir de code web, mais Tauri se concentre sur les fonctionnalités natives de l'OS tout en utilisant le navigateur Chromium pour rendre l'application, tandis que Capacitor se concentre sur les fonctionnalités de l'appareil en utilisant des WebViews natifs pour chaque plateforme cible. Tauri nécessite une configuration spécifique pour chaque plateforme cible alors que Capacitor utilise des plugins pour accéder aux fonctionnalités natives de l'appareil, ce qui facilite la configuration pour les différentes plateformes.

[Back to top](#veille)     

### Electron

Electron est un framework open-source qui permet de créer des applications de bureau multiplateformes (Windows, Mac, Linux) à partir de code web (JavaScript, HTML, CSS). Il utilise Chromium pour rendre l'interface utilisateur et Node.js pour l'accès aux fonctionnalités natives de l'OS (comme les fichiers, les dossiers, les notifications, etc.).

Le positionnement d'Electron est de fournir une solution simple pour créer des applications de bureau à partir de code web existant. Il permet aux développeurs de créer des applications de bureau performantes et fiables en utilisant les compétences de développement web existantes.

Les avantages d'Electron sont :

* Utilisation du code web existant pour créer des applications de bureau
* Multiplateforme (Windows, Mac, Linux)
* Accès aux fonctionnalités natives de l'OS
* Grande communauté et un grand nombre de packages disponibles

Les inconvénients d'Electron sont :

* Taille de l'application peut être volumineuse
* Performances peuvent être inférieures à celles des applications de bureau traditionnelles
* Consommation de ressources plus élevée

Electron est un framework prometteur car il permet aux développeurs de créer des applications de bureau performantes et fiables en utilisant le code web existant, il est multiplateforme, et offre un accès aux fonctionnalités natives de l'OS. Il y a une grande communauté et un grand nombre de packages disponibles pour faciliter le développement. Cependant, il est important de noter que les performances peuvent être inférieures à celles des applications de bureau traditionnelles et la consommation de ressources plus élevée.

[Back to top](#veille)     

### Expo

Expo est un framework open-source qui permet de développer des applications mobiles multiplateformes (iOS, Android) à partir de code JavaScript. Il utilise React Native pour rendre l'interface utilisateur, et offre une série de fonctionnalités prêtes à l'emploi pour l'accès aux fonctionnalités de l'appareil (comme la caméra, le microphone, l'accéléromètre, etc.).

Le positionnement d'Expo est de fournir une solution simple pour créer des applications mobiles à partir de code web existant. Il permet aux développeurs de créer des applications mobiles performantes et fiables en utilisant les compétences de développement web existantes.

Les avantages d'Expo sont :

* Utilisation du code web existant pour créer des applications mobiles
* Multiplateforme (iOS, Android)
* Accès aux fonctionnalités de l'appareil par une API prête à l'emploi
* Grande communauté et un grand nombre de packages disponibles

Les inconvénients d'Expo sont :

* Il n'offre pas un accès complet aux fonctionnalités natives des plateformes (il est possible de sortir d'Expo, mais cela nécessite des compétences supplémentaires)
* Il est limité à certaines fonctionnalités natives
* Il y a des restrictions pour la soumission d'application à l'Apple Store et Google Play Store

En résumé, Expo est un framework open-source qui permet de développer des applications mobiles multiplateformes à partir de code JavaScript, en utilisant React Native pour rendre l'interface utilisateur et une série de fonctionnalités prêtes à l'emploi pour l'accès aux fonctionnalités de l'appareil. Il permet aux développeurs de créer des applications mobiles performantes et fiables en utilisant les compétences de développement web existantes. Cependant, il n'offre pas un accès complet aux fonctionnalités natives des plateformes, il est limité à certaines fonctionnalités et il y a des restrictions pour la soumission d'application à l'Apple Store et Google Play Store.

## Backends

[Back to top](#veille)     

### NuxtJS

Est un framework **Vuejs** : auto-import des composants, SEO simplifié, store intégré, Server-side rendering etc... permet d'organiser les projets Vue avec une structure par répertoire (comme pour angular).

Concurrent de **NExtJS** pour *ReactJS*

[Back to top](#veille)     

## Svelte
=> framework-**compilateur** js très proche de React et Vue mais améliore les performances car il effectue le plus gros du travail lors de la compilation ce qui implique des paquets moins volumineux. 
C'est donc plutôt un hybride, à la fois **framework** et **compilateur**. **Aucune librairie** à embarquer, **pas de DOM virtuel** contrairement à React / Vue / Angular / Ionic... 
Il propose un cadre de travail, avec ses méthodes et ses fonctionnalités, mais en plus il va compiler votre code en temps réel en JavaScript natif.

En contrepartie, certaines notions utilisent une syntaxe spécifique, svelte **ne gère pas tout seul** la mise à jour des références et mutations de tableaux, il faut donc s'en charger manuellement pour être sûr que la vue se mette à jour.

> codebase : html, css, js

[Back to top](#veille)     

### NextJS

Postulat de départ : Seul, reactJS manque d'éléments pour pouvoir créer un site complet et optimisé (router, rendu SSR, gestion assets, gestion serveur web etc...). 

C'est là qu'intervient Next JS. C'est un framework (backend) basé sur *ReactJS*, orienté Server-Side-Rendering. Son point fort est la génération d’applications statiques pour accélérer les temps d'accès et le référencement.

* rendu statique
* rendu SSR
* rendu hybride : rend du contenu statique avec une tâche de fond qui va mettre à jour le rendu si des modifications sont detectées (un peu à la manière de Astro)

* Amélioration des performances : Les pages sont pré-rendues côté serveur, ce qui permet de réduire le temps de chargement et d'améliorer l'expérience utilisateur pour les utilisateurs ayant une connexion internet lente ou pour les moteurs de recherche.

* Routage automatique : Le routage est intégré à NextJS, ce qui permet de gérer facilement les différentes pages de l'application sans avoir besoin d'utiliser un package externe.

* Déploiement facile : NextJS offre un outil de déploiement intégré qui permet de déployer facilement l'application sur un serveur.

* Dynamic Importation : NextJs supporte la dynamic importation, qui permet de charger uniquement les composants nécessaires à l'affichage d'une page, améliorant ainsi les performances de l'application.

Concurrent de **NuxtJS** pour *Vue*

[Back to top](#veille)     

### Prisma 
=> Est un ORM (Object Relational Mapper), soit un ensemble de classes permettant de manipuler les tables d’une base de données relationnelle comme s’il s’agissait d’objets.

Un ORM est une couche d’abstraction d’accès à la base de données qui donne l’illusion de ne plus travailler avec des requêtes mais de manipuler des objets.

> En bref : Couche de mapping object relationnel entre nodejs et typescript


Prisma => définition du modèle de données => génération fichier TS 

````
npx prisma init
````

En Angular, les Injection Tokens sont utilisés pour fournir des instances de dépendances spécifiques lors de l'injection de dépendances dans des composants ou des services. Les Injection Tokens sont des objets qui agissent comme des clés uniques pour identifier une dépendance lorsqu'elle est injectée dans un constructeur de classe.

Voici quelques cas d'utilisation courants des Injection Tokens en Angular :

Remplacement de dépendances par défaut : Les Injection Tokens peuvent être utilisés pour remplacer les dépendances par défaut fournies par Angular avec des implémentations personnalisées. Par exemple, vous pouvez fournir une implémentation personnalisée d'un service en utilisant un Injection Token et en l'injectant dans un composant ou un service.

Fournir des configurations : Les Injection Tokens peuvent également être utilisés pour fournir des configurations à un service. Vous pouvez définir un Injection Token qui représente une configuration spécifique et l'injecter dans le constructeur du service qui utilise cette configuration.

Injection de dépendances conditionnelle : Les Injection Tokens peuvent également être utilisés pour injecter différentes dépendances en fonction des conditions. Par exemple, vous pouvez définir deux Injection Tokens différents pour deux implémentations de service différentes et choisir laquelle injecter en fonction d'une condition.

Les Injection Token permettent de définir des constantes

````typescript
export interface UsersServiceConfigInterface {
	api: string
}

providers: [
	{ provide: 'USER_SERVICE', useClass: UsersServices },
	{ provide: 'USERS_SERVICE_CONFIG',
	useValue: { api: 'https://my-url'}}
]
````

Le nom devant être obligatoirement unique, on utilise des injection token pour définir des identifiants uniques

````typescript
export const USERS_SERVICE_TOKEN = new InjectionToken<UsersService>('');
export const USERS_SERVICE_CONFIG_TOKEN = new InjectionToken<UsersServiceConfigInterface>('');

export interface UsersServiceConfigInterface {
	api: string
}

providers: [
	{ provide: USER_SERVICE_TOKEN, useClass: UsersServices },
	{ provide: USERS_SERVICE_CONFIG_TOKEN,
	useValue: { api: 'https://my-url'}}
]
````

Utilisation dans le code

````typescript
export class AppComponent {
	constructor(@Inject(USER_SERVICE_TOKEN) private usersService: UsersService) {
		console.log('usersService', usersService);
	}
}
````

[Back to top](#veille)     

### NestJS 
Framework Server Side pour NodeJS, compatible TS qui permet de faire du backend avec la même architecture / syntaxe qu'un front angular. Cela facilite la maintenance et l'organisation d'un projet NodeJS. Il vient en complément de Express. 
	- Il y a même un paquet pour gérer swagger
	- gère le mode monorepos

[Back to top](#veille)     

### Deno 

concurrent nodejs pour le backend

[Back to top](#veille)     

### Supabase

https://supabase.com/alternatives/supabase-vs-firebase      

Supabase est un concurrent de Firebase avec quelques différences tout de même. La différence majeure est que Supabase s'appuie sur postgreSQL au lieu d'une base de données orienté document (key-value) pour Firebase.

Avantages :
* postgreSQL     
* requêtage SQL      
* jusqu'à 4x plus performant que Firebase (key-value)      
* Authentifications tiers (google, facebook, twitter...)      
* Storage comme Firebase    

[Back to top](#veille)     

### Netlify

Netlify permet de faire du déploiement serverless

[Back to top](#veille)   

### GraphQL

GraphQL est un langage de requêtes de données pour API. C'est une spécification pour implémenter les API

> QL => Query Language

GraphQL permet de demander "précisément" la structure de données que l'on souhtaite obtenir côté front. Cela permet d'éviter un nombre important d'appel API et surtout d'obtenir exactement ce dont on a besoin 
et ainsi éviter de recevoir des données qui ne nous servent pas.

Exemple appel classique pour obtenir des pokémons avec leurs capacités 

````
GET /pokemon/25
GET /ability/8
GET /ability/13
GET /pokemon/15
GET /ability/1
GET /ability/7
````

Avec GraphQL on décrit la structure de l'objet que l'on souhaite recevoir (une requête GraphQL donc):

````
POST /graphql
pokemons {
	name,
	abilities {
		name
	}
}
````

#### Exemple

**Appel**

````json
{
    pokemons {
        name,
        abilities {
          name,
          damage,
          accuracy,
          mana,
          type
        }
    }
}
````

**Réponse**

````json
{
    "data": {
        "pokemons": [
            {
                "name": "pikachu",
                "abilities": [
                    {
                        "name": "Thunder punch",
                        "damage": 75,
                        "accuracy": 70,
                        "mana": 15,
                        "type": "physical"
                    },
                    {
                        "name": "Thunderbolt",
                        "damage": 90,
                        "accuracy": 80,
                        "mana": 15,
                        "type": "electric"
                    }
                ]
            },
            {
                "name": "mewtwo",
                "abilities": [
                     {
                        "name": "Earthquake",
                        "damage": 130,
                        "accuracy": 100,
                        "mana": 20,
                        "type": "ground"
                    },
                    {
                        "name": "Brutal swing",
                        "damage": 180,
                        "accuracy": 90,
                        "mana": 25,
                        "type": "physical"
                    }
                ]
            }
        ]
    }
}
````

La différence avec REST c'est que ce dernier retourne des objets définis par le backend. Avec GraphQL on défini **dynamiquement** l'objet que l'on souhaite recevoir côté client

GraphQL étant une *spécification* elle est applicable dans de très nombreux langages et donc pas nécessairement du JS.

Un des **objectifs** de GraphQL est de répondre aux problématiques d'*over fetching* et *under fetching* posées par les APIs, en permettant justement de définir dynamiquement le format de la réponse.

- l'*over fetching* est le fait d'obtenir un surplus d'informations délivrées par la requête par rapport au besoin duclient
- l'*under fetching* est le fait de devoir faire plusieurs appels pour compléter la réponse

#### Conclusion

* Besoins à l’état de l’art

	* Optimisation des données réseaux
		- récupération des informations en un seul appel
		- idéal pour des consommateurs avec un réseau faible

	* Optimisation des requêtes
		- le pouvoir est donné au client
		- résolution des problématiques d’over fetching / under fetching

* Autres apports de GraphQL

	* Fortement typé
	
	* Apprentissage et construction d’une expertise plus simple
		- spécification
		- tutoriels officiels et aide de la communauté

	* Communication API / consommateur
		- introspection du schéma / auto-documentation
		- facilité d’envelopper l’existant

* Aspects à considérer

	* Cache
		- plus complexe
		- plutôt applicatif

	* Nouvelles pratiques de développement
	
	* Fonctionnement des mutations en RPC
		- une mutation par action
		- pas de standard de nommage (compensé par l’introspection du schéma)

[Back to top](#veille)     

### PouchDB

PouchDB et CouchDB sont deux bases de données NoSQL open source développées par Apache Software Foundation. Bien qu'elles partagent de nombreuses similitudes, elles ont des différences importantes dans leur conception et leur utilisation.

CouchDB est une base de données NoSQL orientée documents qui stocke des données au format JSON. Elle utilise un modèle de stockage clé-valeur pour stocker des documents qui peuvent être facilement indexés, consultés et filtrés. CouchDB a été conçu pour offrir une haute disponibilité, une tolérance aux pannes et une réplication facile des données entre différents nœuds. Les données dans CouchDB sont stockées sur disque et peuvent être consultées via une interface HTTP RESTful. CouchDB est également compatible avec les protocoles de synchronisation tel que CouchReplication et CouchDB Sync, qui permettent la synchronisation des données avec d'autres bases de données CouchDB.

PouchDB, quant à elle, est une base de données NoSQL orientée objet qui utilise la structure de données du navigateur pour stocker les données localement. Contrairement à CouchDB, PouchDB est une base de données JavaScript qui fonctionne dans le navigateur et permet de stocker les données sur l'appareil de l'utilisateur. Elle est conçue pour offrir une expérience de développement plus facile et plus fluide pour les développeurs d'applications web et mobiles. Les données stockées dans PouchDB peuvent être facilement synchronisées avec une base de données CouchDB, ce qui permet la synchronisation des données entre différentes applications et appareils.

En résumé, CouchDB est une base de données NoSQL orientée documents destinée à une utilisation sur des serveurs, tandis que PouchDB est une base de données NoSQL orientée objet destinée à une utilisation sur des navigateurs web et des applications mobiles. Les deux bases de données sont open source et offrent une haute disponibilité, une tolérance aux pannes et une réplication facile des données.

## Autres

[Back to top](#veille)     

### e2e

Protractor va être déprecié, il est conseillé de basculer sur **cypress** pour réaliser les tests e2e

[Back to top](#veille)     

### Stencil 

Stencil permet de créer des composants avec la même syntaxe que React, mais dont le résultat final sera des Web Components natifs : c’est-à-dire que vous pourrez les réutiliser dans n’importe quel projet, qu’il s’agisse d’un site web ou d’une application créée avec n’importe quel framework JavaScript (Angular, React ou Vue).

Bien qu’il s’agisse d’un outil récent, il est déjà éprouvé : c’est avec Stencil que sont faits les composants d’Ionic, un framework de référence pour la création d’applications mobiles.

[Back to top](#veille)       
	
### NX

Nx est une suite d'outils permettant la gestion des solutions monorepos. Il permet de créer une application fullstack angular / nodejs (prisma + nestJS). 
Nx est un framework de construction intelligent et extensible qui vous aide à développer, tester, créer et mettre à l'échelle des applications Angular avec une prise en charge entièrement intégrée d'outils modernes tels que Jest, Cypress, Storybook, ESLint, NgRx, etc...

NX est donc une **extension d'angular CLI**. Il suffit de lui coupler NEST (ou simplement NodeJS) (+ Prisma en bonus) pour créer un projet fullstack mono-repo

[Back to top](#veille)     

### Application fulllstack NX, NestJS, Prisma, Angular

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

#### Création des ENDPOINTS

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

### Remix

Remix est un jeune framework **fullstack javascript** (2021) gratuit basé sur **React** et qui utilise **nodeJS** pour faire du server-side rendering (SSR). 

[Back to top](#veille)     

### Vite

ViteJS est un outil de développement (meta-framework) rapide pour les projets JavaScript (principalement conçu pour fonctionner avec React et Vue). Il a été conçu pour améliorer le développement de projets en utilisant les dernières technologies de navigateur, notamment les fonctionnalités de ES modules. C'est un concurrent de webpack, et se concentre sur la **rapidité** et la **simplicité d'utilisation**, en utilisant un serveur de développement intégré pour éviter les étapes de configuration fastidieuses. Il permet également d'utiliser des plugins pour ajouter des fonctionnalités supplémentaires telles que la prise en charge de TypeScript et les outils de linting. Il est également très léger et facile à utiliser.

* compilation TS, scss, hot module reloading...

[Back to top](#veille)   

### esbuild

esbuild est un **compilateur JavaScript ultra-rapide basé sur Go**. Il est conçu pour gérer des projets JavaScript de grande envergure et peut être utilisé pour compiler des applications web, des bibliothèques et des modules Node.js. Il peut également être utilisé pour optimiser les performances en réduisant la taille des fichiers et en réduisant les temps de chargement. Il peut également gérer les dépendances et les imports, et générer des fichiers source maps pour le débogage. Il est particulièrement utile pour les projets de grande envergure ou les applications à haute performance.

[Back to top](#veille)   
