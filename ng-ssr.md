[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Server-Side Rendering

* [Présentation et rappel](#présentation-et-rappel)
* [CSR vs SSR](#csr-vs-ssr)
* [Historique](#historique)     
* [Angular 17 SSR](#angular-17-ssr)    

## Présentation et rappel
Angular 16 apporte une avancée majeure avec la nouvelle hydratation non-destructive pour le rendu côté serveur (SSR)

Avant de plonger dans les détails de l'hydratation non-destructive, il est important de comprendre la différence entre le rendu côté client (CSR) et le rendu côté serveur (SSR). Dans une application monopage (SPA) utilisant le rendu côté client, l'application génère le HTML dans le navigateur à l'aide de JavaScript. Lorsque l'application envoie une requête initiale, le serveur web renvoie un fichier HTML minimal qui sert de conteneur pour l'application. Le navigateur procède ensuite au téléchargement et à l'exécution des fichiers JavaScript référencés dans le fichier HTML pour démarrer l'application.

> Article source : [Server-side rendering in Angular 16](https://blog.logrocket.com/server-side-rendering-angular-16/)
> 
## CSR vs SSR
Le rendu côté client (CSR) présente quelques inconvénients, notamment :

* **Une page vierge pendant le temps de chargement initial** : Il y a un délai avant que le bundle JavaScript ne soit téléchargé et que l'application ne soit complètement démarrée. Pendant ce laps de temps, les utilisateurs peuvent voir une page vierge, ce qui impacte leur expérience utilisateur.
* **Non adapté au référencement (SEO)** : Les pages basées sur le rendu côté client contiennent principalement un HTML minimal avec des liens vers le bundle JavaScript, ce qui peut rendre difficile l'indexation du contenu de la page par les moteurs de recherche, réduisant ainsi leur visibilité dans les résultats de recherche.
  
Le rendu côté serveur (SSR) résout ces problèmes. 

Avec le **SSR**, le HTML est généré côté serveur, ce qui permet d'obtenir des pages complètement formées et adaptées au référencement. De plus, le temps de chargement initial est plus rapide, car le HTML est renvoyé au navigateur et affiché avant le téléchargement des bundles JavaScript. Ainsi, lorsque le référencement et le temps de chargement initial sont prioritaires, le SSR est l'option recommandée.

## Historique
Angular prend en charge le SSR grâce à **Angular Universal**, son package de rendu côté serveur qui permet de générer le rendu à la fois côté client et côté serveur. Angular Universal offre des fonctionnalités de rendu côté serveur dynamique et de prérendu statique. Cependant, cette forme de SSR avait quelques limitations en raison de sa nature **"destructive"**.

Pour comprendre comment fonctionne Angular Universal, intéressons-nous au concept d'**hydratation**. L'hydratation Angular consiste à ajouter de l'interactivité à une page HTML rendue côté serveur en ajoutant des écouteurs d'événements et des états. Une hydratation efficace est essentielle pour une expérience utilisateur fluide, mais sa mise en œuvre peut être complexe en raison des nombreux éléments à gérer.

**Avant Angular 16**, le processus d'hydratation dans Angular Universal était **destructif**. Lorsque l'application pré-Angular 16 démarrait, les événements suivants se produisaient :

1. Le navigateur envoie une requête à un serveur web.
2. Le serveur web renvoie immédiatement la structure du DOM de la page web.
3. Le navigateur affiche la version initiale du marquage de la page, mais celle-ci n'est pas encore interactive, car le JavaScript n'a pas été chargé.
4. Les bundles JavaScript sont téléchargés dans le navigateur.
5. L'application cliente Angular prend le relais, charge le bundle et se lance.
6. La page entière est rechargée.
7. Ce processus est appelé hydratation destructive car l'application cliente rejette le HTML pré-rendu et recharge toute la page.

Il est intéressant de noter qu'à l'étape 3, la page affiche un contenu appelé "First Meaningful Paint" (FMP), qui correspond au premier rendu significatif. Un FMP plus rapide est l'un des principaux avantages du SSR, en particulier pour les applications qui requièrent de bonnes performances.

**Le problème de l'hydratation destructive est le scintillement de la page**, qui se produit lorsque le contenu rendu côté serveur est remplacé par le contenu rendu côté client. Plusieurs problèmes ont été ouverts dans le référentiel Angular GitHub pour résoudre ce problème, qui est considéré comme l'une des principales limitations d'Angular Universal.

## Angular 16 introduit l'hydratation non-destructive
Angular 16 résout ce problème grâce à l'introduction de l'hydratation non-destructive. Avec l'hydratation non-destructive, **le marquage du DOM rendu côté serveur existant est réutilisé**. Cela signifie que le marquage du **DOM rendu côté serveur n'est pas détruit**, au lieu de cela, Angular parcourt la structure du DOM, ajoute les écouteurs d'événements et relie les données pour terminer le rendu.

> Une autre amélioration importante est l'**actualisation de HttpClient** pour permettre la **mise en cache des requêtes côté serveur**. Cette amélioration évite la récupération redondante de données côté client en mettant en cache les données précédemment récupérées, ce qui améliore les performances de l'application.


## Angular SSR vs. React SSR : Quelles différences ?

**l'hydratation non-destructive d'Angular fonctionne de manière similaire au SSR de React**. React propose une API côté serveur pour rendre les composants React en HTML sur le serveur. L'application cliente React recevra ces fichiers HTML et rendra l'application interactive en attachant les gestionnaires d'événements et les états. Ce processus est appelé hydratation React.

La mise en œuvre du SSR avec React pur est un processus très manuel. Vous devez implémenter une application côté serveur, apporter des modifications aux composants côté client et gérer des modifications de configuration étendues.

En revanche, Angular Universal offre des outils beaucoup plus rationalisés pour prendre en charge le SSR. Cependant, étant donné qu'**Angular Universal ne fait pas formellement partie du framework Angular**, il est probablement plus juste de le comparer à une application **Next.js** et React, plutôt qu'à React pur.

L'utilisation de Next.js facilite grandement la prise en charge du SSR avec React. Voici un résumé de ses fonctionnalités SSR comparées à celles d'Angular Universal :

|Fonctionnalité|Angular + Angular Universal|React + Next.js|
|-|-|-|
|Stratégie de rendu|Prend en charge le CSR, le SSR et le SSG (ou le pré-rendu)|Prend en charge le CSR, le SSR et le SSG (ou le pré-rendu)|
|Pré-rendu|Prend en charge le SSG pour tout ou partie d'un site, ainsi que la génération de pages avec des routes dynamiques|Prend en charge le SSG pour tout ou partie d'un site, ainsi que la génération de pages avec des routes dynamiques|
|Régénération statique incrémentale (ISR)|Aucune prise en charge native, mais propose une bibliothèque tierce appelée ngx-isr|Prend en charge l'ISR nativement|
|Combinaison du SSR et du SSG|Vous devez écrire du code personnalisé dans server.ts pour gérer les routes|Vous permet de choisir le SSR ou le SSG pour chaque page individuellement|

En résumé, Angular 16 Universal offre un niveau de SSR similaire à Next.js + React, mais Next.js dispose d'un support plus abouti dans certaines fonctionnalités telles que l'ISR et la combinaison de différentes stratégies de rendu.

## Angular 17 SSR

* https://www.youtube.com/watch?v=oRg065Ebb7U&ab_channel=Ga%C3%ABtanRouzi%C3%A8s
* https://www.youtube.com/watch?v=U1MP4uCuUVI&ab_channel=AngularUniversity
* https://javascript.plainenglish.io/server-side-rendering-explained-in-brief-words-angular-17-76d23a30ae24

### Installation

````
ng add @angular/ssr
````

### Activer la mise en cache des requêtes http

Lorsque SSR est activé, les réponses HttpClient sont mises en cache lors de leur exécution sur le serveur. Après cela, ces informations sont sérialisées et transférées vers un navigateur dans le cadre du HTML initial envoyé depuis le serveur. 
Dans un navigateur, HttpClient vérifie s'il a des données dans le cache et si c'est le cas, les réutilise au lieu de faire une nouvelle requête HTTP lors du rendu initial de l'application. 
HttpClient cesse d'utiliser le cache une fois qu'une application devient stable lors de son exécution dans un navigateur.

La mise en cache est effectuée par défaut pour toutes les requêtes HEAD et GET. 

Vous pouvez configurer ce cache en utilisant withHttpTransferCacheOptions lors de l'hydratation.

*app.config.ts*

````typescript
providers: [provideHttpClient(withFetch())]

providers: [provideClientHydration(withHttpTransferCacheOptions({
    includePostRequests: true
}))]
````
C'est ce qui va activer la mise en cache des requêtes

### Code conditionnel browser / server

permet de filtrer certaines fonctionnalités en fonction de la plateforme. Ex : le localstorage n'est pas accessible côté serveur

````typescript
platformId = inject(PLATFORM_ID);

if (isPlatformServer(this.platformId)) {	
	
}

if (isPlatformBrowser(this.platformId)) {
	// accéder au localStorage par exemple
}
````

Peut aussi être remplacé par 

````typescript
afterRender(()=>{
    // runs on client / browser
    console.log("prints only in browser not in server");
})
````

### lifecycle

````typescript
export class AppComponent implements OnInit {  
  i=0;
  ngOnInit(): void {
    console.log("prints in both server and browser");
  }
  constructor(){
    console.log("prints in both server and browser");
	
	afterRender(()=>{
		// runs on client / browser
		console.log("prints only in browser not in server");
    })
  }
  buttonClick(){
    console.log("prints only in browser not in server");
    this.i++;
  }
}
````

### Compilation et Run

le fichier package.json est mis à jour avec les commandes spécifiques au lancement en mode SSR, par exemple : 

````json
"dev:ssr": "ng run angular-ssr:serve-ssr",
"serve:ssr": "node dist/angular-ssr/server/main.js"
````

=> npm run dev:ssr
=> npm run build:ssr

Après compilation, le bundle genéré contient 2 répertoires (client et server). Le répertoire server contient le code du server express qui se charge de rendre les pages et de les fournir au client. 

> Note : il est intéressant d'étudier le code du server.js pour comprendre
