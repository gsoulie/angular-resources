[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Nouveautés

* [v21](#angular-v21)   
* [v20.2](#angular-v20-.-2)     
* [v20](#angular-v20)    
* [v19.2](#angular-v19-.-2)    
* [v19](#angular-v19)    
* [v18](#angular-v18)    
* [v17.3](#angular-v17-.-3)     
* [v17.2](#angular-v17-.-2)     
* [v17.1](#angular-v17-.-1)     
* [Keynote du 06/11/2023](##keynote-du-06--11--2023)     
* [ng-conf 2023](#ng--conf-2023)     
* [v16](#v16)    
* [v15](#v15)     
* [v14](#v14)
* [AnalogJS](#analogjs)
* [Dépréciations](#dépréciations)


# Angular v21

<details>
	<summary>Nouveautés de la version 21</summary>

````17/10/2025````



# NgConf 2025

La NgConf 2025 a été l'occasion de présenter la **v21 d'Angular**. Voici les principales nouveautés et amélioration présentées :

* (stable) effect
* (stable) linkedSignal()
* (stable) hydratation incrémentielle
* (stable) mode zoneless
* (new) Signal Forms
* (new) Angular Aria
* (new) Rendu hybride en SSR
* (new) createComponent() 
* (new) event.target type narrowing
* (new) alias **as** dans ````@else if````
* (new) aria-bindings sans ````attr````
* (new) animate.enter / animate.leave
* (new) Google AiStudio génère maintenant des application en Angular
* (improvment) devtools (visualisation des Signals, @defer et des routes)
* (improvment) nouveau paneau (performance) dans devtool

##  (experimental) Signal Forms

Sans doute l'une des nouveautés la plus attendue, mais qui restera en mode **experimental** dans la v21.

*Exemple de déclaration de formulaire*
````typescript
<!-- View -->
<form>
	<input id="userName" type="text" [formField]="loginForm.name" />
	<input id="userPassword" type="text" [formField]="loginForm.password" />
</form>

export class App {
	// Définir un form model
	protected readonly userLogin = signal<UserProfile>({
		name: 'johndoe',
		password: 'secure-password'
	})
	
	// Créer le formulaire basé sur le model qui est un signal
	loginForm = form(this.userLogin); 
}
````

La nouvelle propriété *[field]* (**[formField]** depuis 21.0.7) permet de binder les champs du formulaire.

> Voir article sur Signal Forms pour plus de détails

## Angular Aria

En complément de la nouveauté apportée par Angular 20.2 (voir article 20.2), Angular aria pousse d'un cran la personnalisation des composants :

*Exemple simple de liste déroulante.* 

````typescript
<div ngListbox>
	@for(fruit of fruits: track fruit) {
		<div [value]="fruit" ngOption>{{ fruit }}</div>
	}
</div>
````

Les propriétés **ngListbox** et **ngOption** permettent à Angular de considérer le container comme un objet liste. Ceci permet de personnaliser ce type de composant **exactement** comme on le souhaite !

*Liste des composants déjà compatibles :*
* accordion
* combobox
* listbox
* radio-group
* tabs
* toolbar
* d'autres composants à venir

## mode Zoneless

Le mode zoneless est enfin en version stable. Il apporte les évolutions suivantes :
* Amélioration des performances
* Amélioration des Core Web Vitals
* Meilleure expérience de débuggage
* Meilleure compatibilité de l'écosystème

**Activer le mode zoneless**

*app.config.ts*
````typescript
bootstrapApplication(MyApp, { providers: [
	provideZonelessChangeDetection()
] }
````

*Utilisation*

````typescript
@Component({
	selector: 'my-app',
	changeDetection: ChangeDetectionStrategy.OnPush // non obligatoire mais BONNE PRATIQUE
})
````

> On peut ensuite supprimer la dépendance à zone.js

## Rendu hybride en SSR

````typescript
export const serverRoutes: ServerRoute[] = [
{ 
	path: '', // la route / sera rendue côté client (CSR)
	renderMode: RenderMode.Client
},{
	path: 'about', // Cette page est statique donc on utilise le rendu SSG
	renderMode: RenderMode.Prerender
}, {
	path: 'profile', // nécessite des données spécifiques à l'utilisateur, donc on utilise le rendu SSR
	renderMode: RenderMode.Server
}]
````

## alias as dans @else if

Il est désormais possible de déclarer un alias dans les ````@else if````, ce qui n'était pas le cas auparavant.

*Avant*
````typescript
@if (flag; as flagResult) {
...
} @else if (secondFlag) {

}
````

*Maintenant*
````typescript
@if (flag; as flagResult) {
...
} @else if (secondFlag; as secondFlagresult) {

}
````

## animate.enter / animate.leave

Comme annoncé lors de la v20.2 (voir l'article sur 20.2), la gestion des animations a été simplifiée avec la disparition du package angular-animation.

Il est désormais facile en css pur de créer des animations complexes, angular facilite donc cette utilisation via deux nouvelles propriétés ````in```` et ````out````

````typescript
<cmp in="pretty-animation-class" />
<other-cmp in="animateFn()" />

<cmp out="fancy-animation-class" />
<other-cmp out="animateFn()" />
````
	
</details>

# Angular v20.2

<details>
	<summary>Nouveautés de la version 20.2</summary>

````21/08/2025````

> [Article Ninja squad](https://blog.ninja-squad.com/2025/08/20/what-is-new-angular-20.2/)

# Mode Zoneless stable

Introduit en developer preview dans la version 20, le mode Zoneless est désormais stable. Il est donc désormais possible d'utiliser la configuration ````provideZonelessChangeDetection()```` en toute sécurité. 
Les nouvelles application ne sont pas encore en mode zoneless par défaut mais cela sera bientôt le cas dans la future version majeure

# Nouveau support d'animation

Cette nouvelle version marque la dépréciation de ````@angular/animations```` qui est remplacé par une nouvelle api plus simple.
En effet le package animations n'a jamais reçu de mise à jour majeure depuis sa publication par son auteur et n'a jamais été maintenu activement et avec le temps, la pluspart des animations ont pu s'écrire directement en css.
Le css pur ne permettant pas de tout couvrir, Angular 20.2 apporte une nouvelle api stable pour gérer cela.

Angular 20.2 introduit la nouvelle syntaxe ````animate.enter```` et ````animate.leave```` permettant d'ajouter une classe css à un élément lors de ces évènements

````typescript
@if (display()) {
  <div animate.enter="fade-in" animate.leave="fade-out">Content</div>
}
````

````css
.fade-in {
  /* initial state */
  @starting-style {
    opacity: 0;
  }
  transition: opacity 300ms;
  opacity: 1;
}

.fade-out {
  transition: opacity 300ms;
  opacity: 0;
}
````

Il est également possible de binder la valeur d'un signal (ex: qui retournerai un tableau de classes css)

````typescript
@if (display()) {
  <div [animate.enter]="enterClasses()">Content</div>
}
````

Ou encore utiliser des animations provenant d'autres librairies comme GSAP par exemple 

````typescript
@if (display()) {
  <div (animate.leave)="rotate($event)">Content</div>
}
````

````typescript
protected rotate(event: AnimationCallbackEvent) {
  gsap.to(event.target, {
    rotation: 360,
    duration: 0.3,
    onComplete() {
      event.animationComplete();
    }
  });
}
````

# Templates

## ARIA bindings

Angular 20.2 rend plus intuitif l'utilisation des attribut ARIA. Auparavent, il fallait utiliser un préfixe ````attr.```` pour binder chaque attribut ARIA comme ceci : 
````html
<div role="progressbar" [attr.aria-valuenow]="value()"></div>
````

Désormais, il est possible de binder l'attribut directement :

````html
<div role="progressbar" [aria-valuenow]="value()"></div>

<!-- Et même -->

<div role="progressbar" [ariaValueNow]="value()"></div>
````

## Alias dans les blocs @else if

Depuis Angular 20.2 il est possible de définir un alias dans les blocs ````@else if```` en plus des blocs ````@if````

````typescript
@if (admin(); as a) {
  Welcome Admin {{ a.name }}!
} @else if (user(); as u) {
  Welcome {{ u.name }}!
}
````

## Diagnostic étendu

Une nouvelle fonction de diagnostic étendue ````uninvokedFunctionInTextInterpolation```` a été ajoutée pour vous avertir lorsque vous oubliez d'appeler une méthode dans une interpolation.

Par exemple, si vous avez une méthode ````getUserName()```` qui renvoie le nom de l’utilisateur et que vous l’utilisez dans un modèle comme celui-ci

````html
<p>{{ getUserName }}</p>
````

Va lever une erreur ````[ERROR] NG8117: Function in text interpolation should be invoked: getUserName().````

# Router

La fonction ````Router.getCurrentNavigation```` est désormais dépréciée et remplacée par le Signal ````currentNavigation````. L'objet retourné est identique.

# Performance

L'algorithme interne de gestion des signaux a été modifié pour utiliser des *listes chaînées* à la place de tableaux, comme l'ont fait Preact, Vue et autres librairies. Ceci a pour effet d'améliorer les performances.

# Service Worker

Le package Service Worker a reçu des améliorations, notamment une meilleure gestion des erreurs et expérience développeur.

Le service worker a également bénéficié d'une gestion améliorée du stockage avec une meilleure détection des scénarios de stockage saturé lors de la mise en cache des données. Cela évite les échecs silencieux et fournit un retour plus clair lorsque 95 % du quota de stockage du navigateur est atteint pendant les opérations de mise en cache des données.

Une nouvelle option updateViaCache est désormais prise en charge dans provideServiceWorker(), offrant aux développeurs plus de contrôle sur la façon dont le service worker se met à jour.
Cette option vous permet de spécifier si le script du service worker doit contourner le cache du navigateur lors de la recherche de mises à jour, qui peut être défini sur ````all````, ````none```` ou ````imports````.

Enfin, le service worker informe désormais les clients des échecs de version avec des informations d'erreur plus détaillées. Lorsqu’une mise à jour d’un service worker échoue, les clients reçoivent désormais des événements VERSION_FAILED qui incluent des détails d’erreur spécifiques, ce qui facilite le débogage des problèmes de déploiement et la compréhension des raisons pour lesquelles une mise à jour d’un service worker n’a pas réussi.

# Support Typescript 5.9

# AI

Une grande partie des nouvelles fonctionnalités du CLI concernent le domaine de l'IA. Une nouvelle commande vous permet de générer des fichiers de configuration pour les outils IA :

````
ng g ai-config --tool=<your-favorite-ai-tool>
````

Les outils supportés actuellement sont : gemini, claude, copilot, windsurf, jetbrains et cursor.

Par exemple ````--tool=claude```` génère un fichier *.claude/CLAUDE.md* dans le répertoire et contient les meilleurs pratiques Angular.
````ng new```` demandera aussi quel outil IA utiliser lors de la génération d'un nouveau projet

La commande ````mcp```` accepte désormais également les options suivantes :

* ````--local-only```` indique d’utiliser uniquement les outils locaux (pas d’accès réseau, donc la recherche de documentation n’est pas disponible)
* ````--read-only```` indique d’utiliser uniquement les outils en lecture seule (pas d’accès en écriture, mais pour l’instant, tous les outils sont en lecture seule)
* ````--experimental-tool <tool>```` indique d’utiliser un outil expérimental
* 
Deux nouveaux outils expérimentaux ont été ajoutés et peuvent être activés avec ````--experimental-tool```` :

* un outil ````modernize````, qui aide à générer du code ou à mettre à jour des fichiers pour utiliser les meilleures pratiques et fonctionnalités les plus récentes. Lorsqu’il est utilisé, il informe le LLM des migrations disponibles, et le LLM peut déterminer celles qui sont utiles, puis proposer de les exécuter. Les migrations actuellement disponibles sont : ````control-flow````, ````self-closing-tags````, ````inject````, ````standalone````, ainsi que les migrations de signaux (input, output, queries).

* un outil ````find_examples````, qui aide le LLM à générer du code en s’appuyant sur un ensemble d’exemples. Un seul exemple simple est disponible pour l’instant (un simple @if), mais la fonctionnalité permet d’enregistrer tes propres exemples dans un répertoire, puis d’utiliser la variable d’environnement NG_MCP_EXAMPLES_DIR pour indiquer à MCP l’emplacement des exemples.


 
</details>

# Angular v20

<details>
	<summary>Nouveautés de la version 20</summary>

````02/06/2025````

> [Angular 20 - Medium](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301)

> [Angular 20 in short](https://www.youtube.com/watch?v=Nl-siWZ7ckQ&ab_channel=Angular)  

# En résumé

* Stabilisation des APIs ````effect````, ````linkedSignal````, ````toSignal````, hydratation incrémentielle, configuration du mode de rendu au niveau route et aperçu du mode zoneless en developer preview
* Amélioration du debuggage sous Chrome avec Angular DevTools
* Amélioration de l'expérience développeur avec des mises à jour du guide de style, la vérification des types et la prise en charge du service de langage pour les liaisons hôtes, la prise en charge des expressions littérales dans les templates, le remplacement de module à chaud par défaut dans les templates
* **Dépréciation des directives** *ngIf*, *ngFor* et *ngSwitch* prévue dans Angular 22
* Création dynamique de composants avec ````inputBinding()```` et ````outputBinding()````
* mode **zoneless** en **developer preview** (lors de la création d'une application ANgular, il vous sera proposé de la créer en mode zoneless. Attention ce mode est en developer preview)

# Apis Experimentales

l'api ````httpResource```` permettant de faire des requêtes Http avec un API reactive basée sur Signal, ainsi que l'api *resource streaming* sont disponibles dans Angular 20 comme apis  expérimentales.

> l'API ````resource```` permet d'initier une action **asynchrone** lorsqu'un signal change et expose le résultat de cette action en tant que signal :

````typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({request, abortSignal}): Promise<User> => {
  
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${request.id}`, {signal: abortSignal});
  },
});
````

Dans le code ci-dessus, l'action ira faire un fetch vers '/users' en lui passant un identifiant utilisateur, à chaque fois que le Signal ````userId```` changera.

Maintenant, supposons que nous récupèrons les données via un websocket, pour ce faire nous pouvons utiliser un *streaming resource* :

````typescript
@Component({
  template: `{{ dataStream.value() }}`
})
export class App {
  // WebSocket initialization logic will live here...
  // ...
  // Initialization of the streaming resource
  dataStream = resource({
    stream: () => {
      return new Promise<Signal<ResourceStreamItem<string[]>>>((resolve) => {
        const resourceResult = signal<{ value: string[] }>({
          value: [],
        });

        this.socket.onmessage = event => {
          resourceResult.update(current => ({
             value: [...current.value, event.data]
          });
        };

        resolve(resourceResult);
      });
    },
  });
}
````
Dans cet exemple, nous declarons un *streaming resource* qui retourne la promise d'un Signal. Ce Signal est de type ````ResourceStreamItem<string[]>````, ce qui signifie qu'il peut retourner une valeur ````{value: string[]}```` ou une erreur ````{error: ...}````.

Nous émettons les valeurs que nous recevons via le WebSocket via le signal ````resourceResult````


L'API ````httpResource```` est également disponible en mode experimental : 

````typescript
@Component({
  template: `{{ userResource.value() | json }}`
})
class UserProfile {
  userId = signal(1);
  userResource = httpResource<User>(() => 
    `https://example.com/v1/users/${this.userId()}`
  });
}
````

Le code ci-dessus enverra une requête Http Get à l'url spécifiée, **à chaque fois** que la valeur du Signal ````userId```` change.
````httpResource```` retourne une ````HttpResourceRef```` qui possède une propriété ````value```` de type Signal qui est utilisable directement dans le template.
La variable ````userResource```` possède aussi d'autres valeur comme ````isLoading````, ````headers```` etc...

Sous le capot, ````httpResource```` utilise ````HttpClient````, il est donc possible de spécifier des interceptors dans le provider de ````HttpClient```` :

````typescript
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
````

# Stabilisation des Apis

Les APIs ````effect````, ````linkedSignal````, ````toSignal````, hydratation incrémentielle, configuration du mode de rendu au niveau route sont désormais stables.

## Hydratation partielle

Pour utiliser l'hydratation partielle, il suffit d'ajouter la configuration suivante  :

*app.config.ts*
````typescript
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

// ...
provideClientHydration(withIncrementalHydration());
````

Ensuite il suffit d'utiliser les *defferable views* dans les templates

````typescript
@defer (hydrate on viewport) {
  <shopping-cart />
}
````

De cette manière, Angular ne téléchargera le composant ````<shopping-cart>```` ainsi que toutes ces dépendances qu'une fois que ce dernier entrera dans le viewport.

## Rendu route-level

En complément, il est désormais possible d'utilisert le mode de rendu au niveau route :

> Pré-requis : il faut avoir créé l'application en mode ssr ou bien installer le package ````@angular/ssr````, ce qui devrait créer un fichier *app.routes.server.ts*

*app.routes.server.ts*

````typescript
export const routeConfig: ServerRoute = [
  { path: '/login', mode: RenderMode.Server },    // Rendu serveur
  { path: '/dashboard', mode: RenderMode.Client },     // Rendu client
  {
    path: '/product/:id',
    mode: RenderMode.Prerender,    // Pré-rendu
    async getPrerenderParams() {
      const dataService = inject(ProductService);
      const ids = await dataService.getIds(); // ["1", "2", "3"]
      // `id` is used in place of `:id` in the route path.
      return ids.map(id => ({ id }));
    }
  }
];
````

Dans l'exemple ci-dessus, on note que la page ````/product```` requiert un paramètre ````id````. Afin de résoudre les identifiants de chaque produit, on peut utiliser une fonction asycnhrone ````getPrerenderParams()````. 
Cette fonction retourne un objet dont les clés correspondent aux paramètres du routeur. Dans le cas de la page /product/:id, nous renvoyons un objet avec une propriété id

# Nouvelle syntaxe d'expressions dans les templates

Deux nouveaux opérateurs font leur apparaition côté template : ````**```` (puissance ^) et ````in````

````typescript
<!-- n on power two : n^2-->
{{ n ** 2 }}

<!-- checks if the person object contains the name property -->
{{ name in person }}
````

Dans la version 20, il est également possible d'utiliser des littéraux non balisés directement dans les expressions.

````typescript
<div [class]="`layout col-${colWidth}`"></div>
````

# Mise à jour des conventions de nommage

Désormais, le CLI ne génèrera plus de suffixes par défaut pour les composants, directives, services et pipes dans le but d'encourager un nommage plus intentionnel des abstractions et réduire le code.

Il reste possible d'activer la génération de suffixe avec les règles suivantes :

*angular.json*

````json
{
  "projects": {
    "app": {
      ...
      "schematics": {
        "@schematics/angular:component": { "type": "component" },
        "@schematics/angular:directive": { "type": "directive" },
        "@schematics/angular:service": { "type": "service" },
        "@schematics/angular:guard": { "typeSeparator": "." },
        "@schematics/angular:interceptor": { "typeSeparator": "." },
        "@schematics/angular:module": { "typeSeparator": "." },
        "@schematics/angular:pipe": { "typeSeparator": "." },
        "@schematics/angular:resolver": { "typeSeparator": "." }
      },
  ...
}
````

Voici donc les nouvelles bonnes pratiques de nommage de fichier et de classe :

````typescript
// Ancienne syntaxe 
product.component.ts
product.component.html
product.component.css

export class ProductComponent {...}

// Nouvelle syntaxe recommandée
product.ts
product.html
product.css

export class Product {...}
````

# Support experimental de Vitest

Avec la dépréciation de Karma, Angular travaille sur une solution de framework de test alternative. Vitest est donc utilisable en mode expérimental

# Dépréciations

* Disparition du support des syntaxes suivantes au niveau control flow : **NgIf, NgFor et NgSwitch**
* Dépréciation du token **APP_INITIALIZER** [article sur sa conversion](https://www.techiediaries.com/app_initializer-deprecated-angular-19-provideappinitializer/). Très utilisé pour l'injection de configuration lors de l'initialisation de l'application, ce token est remplacé par la syntaxe suivante :

**Ancienne syntaxe (< Angular 20)**

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: APP_INITIALIZER,
      useFactory: (configFilePath: string) => initAuthAzureConfig(configFilePath),
      deps: ['APP_AZURE_AUTH_CONFIG_FILE'],
      multi: true
    },
    { provide: 'APP_AZURE_AUTH_CONFIG_FILE', useValue: '../assets/env/auth-azure-config.json' },


````

**Nouvelle syntaxe (> Angular 20)**

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    
    provideAppInitializer(() => {
      const azureConfigService = inject(AuthAzureConfigService);
      return azureConfigService.loadConfig('../assets/env/auth-azure-config.json')
    }),

````
 
</details>


# Angular v19.2

<details>
	<summary>Nouveautés principales</summary>

````27/02/2025````

> [Angular 19.2](https://blog.ninja-squad.com/2025/02/26/what-is-new-angular-19.2/)   

# Quoi de neuf dans Angular 19.2 ?
Angular 19.2.0 est une mise à jour mineure qui apporte plusieurs nouvelles fonctionnalités intéressantes. Voici un aperçu détaillé des principales améliorations :

## Support de TypeScript 5.8
Angular 19.2 supporte désormais TypeScript 5.8, actuellement en version RC. Cela permet aux développeurs d'utiliser les dernières fonctionnalités de TypeScript dans leurs applications Angular.

## Modifications des API resource() et rxResource()
Les API ````resource```` et ````rxResource````, introduites pour gérer les ressources asynchrones, ont été améliorées :

* ````defaultValue```` : Il est maintenant possible de définir une valeur par défaut pour les ressources, utilisée lorsque la ressource est inactive, en cours de chargement ou en erreur.

````typescript
list(): ResourceRef<Array<UserModel>> {
  return resource({
    defaultValue: [],
    loader: async () => {
      const response = await fetch('/users');
      return (await response.json()) as Array<UserModel>;
    }
  });
}
````
* **Streaming** : Les ressources peuvent désormais être créées avec des données de réponse en streaming, permettant des mises à jour continues des valeurs.

````typescript
list(): ResourceRef<Array<UserModel> | undefined> {
  return resource({
    stream: async ({ abortSignal }) => await firebaseCollection('users', abortSignal)
  });
}
````

## Nouvelle API httpResource()
Cette version introduit l'API ````httpResource()````, qui facilite la création de ressources qui récupèrent des données depuis un endpoint HTTP.

[Plus de détail ici](https://github.com/gsoulie/angular-resources/blob/master/ng-http-resource.md)    

## Chaînes de caractères de modèle dans les templates
Le compilateur Angular supporte désormais les chaînes de caractères de modèle dans les templates, permettant une interpolation plus flexible et l'utilisation de pipes dans les parties dynamiques.

````typescript
<p>{{ `Hello, ${name()}!` }}</p>
<button [class]="`btn-${theme()}`">Toggle</button>
<p>{{ `Hello, ${name() | uppercase}!` }}</p>
````

## Migration vers les balises auto-fermantes
Une migration a été ajoutée pour convertir les éléments vides en balises auto-fermantes, améliorant la lisibilité du code.
````
ng generate @angular/core:self-closing-tag
````

## Validateurs de formulaires
Les validateurs ````Validators.required````, ````Validators.minLength````, et ````Validators.maxLength```` fonctionnent désormais avec les ensembles (Set) en plus des tableaux (Array) et des chaînes de caractères (string).

````typescript
const atLeastTwoElementsValidator = Validators.minLength(2);

// minLength error before v19.2
atLeastTwoElementsValidator(new FormControl("a")); // string
atLeastTwoElementsValidator(new FormControl(["a"])); // Array

// 👇 NEW in v19.2! minLength error as well with a Set
atLeastTwoElementsValidator(new FormControl(new Set(["a"]))); // Set
````

## Dépréciation du package d'animations
Le package ````@angular/animations```` est **progressivement retiré** en raison de son manque de maintenance. Il n'est plus inclus dans le squelette de projet généré par le CLI.

## Angular CLI
* **Support AoT pour Karma, Jest et WTR** : Il est maintenant possible d'exécuter les tests avec la compilation AoT (Ahead-of-Time), ce qui permet de détecter des problèmes dans les composants de test.
* **Karma builder** : Le builder d'application Karma a été déplacé vers le package @angular/build.
* **SSR** : La configuration des routes côté serveur a été simplifiée et améliorée.
 
</details>

# Angular v19

<details>
	<summary>Nouveautés Angular 19</summary>

*20/11/2024*

La version 19 d'Angular met l'accent sur le rendu côté serveur Angular avec une hydratation incrémentielle, une nouvelle configuration de route de serveur, une relecture d'événements activée par défaut, et bien plus encore.

[Meet Angular v19](https://blog.angular.dev/meet-angular-v19-7b29dfd05b84)   

## En résumé

**Hydratation incrémentielle (developer preview)**     :
* Permet de charger et d’hydrater des parties spécifiques d’une application de manière progressive en utilisant la syntaxe (@defer).
* Optimise les performances pour les cas sensibles, en différant le téléchargement de JavaScript jusqu'à ce qu'il soit nécessaire (par exemple, lorsqu'un utilisateur interagit avec une section).
* Utilise une fonction de "relecture d'événements" **Event Replay** pour garantir une expérience fluide, même avec des composants chargés de manière asynchrone.
  
**Configuration avancée des routes côté serveur** :
* Contrôle précis sur le rendu des routes (côté client, serveur ou lors de la construction).
* Possibilité de résoudre les paramètres de route durant le pré-rendu.

**Améliorations des outils (Schematics)** :
* Mise à jour automatisée avec les meilleures pratiques (ex. : injection de dépendances, nouvelles méthodes de construction).
* Simplification de tâches courantes comme la gestion des entrées/sorties et des requêtes dans les composants.

**Primitives réactives stabilisées** :
* Introduction de nouvelles primitives comme ````linkedSignal```` et ````resource```` pour gérer la réactivité.

**Améliorations diverses basées sur la communauté** :
* Ajout d’un sélecteur de temps (time picker Material 3), suppression automatique des imports inutilisés, rafraîchissement de styles en mode HMR, et plus.


## Hydratation incrémentielle
  
L'hydratation incrémentielle permet d'annoter des parties du template, en utilisant la syntaxe ````@defer````, en demandant à Angular de les charger et de les hydrater sur des déclencheurs spécifiques de manière *lazy*.

*Activer l'hydratation incrémentielle*

````typescript
import {provideClientHydratation, withIncrementalHydratation} from '@angular/platform-browser'

bootstrapApplication(App, {
	providers: [provideClientHydratation(withIncrementalHydratation())]
})
````

Pour appliquer une hydratation progressive à une partie de du modèle :

````typescript
@defer (hydrate on viewport) {
  <shopping-cart/>
}
````

Lorsque l'application se charge, Angular ne téléchargera et n'hydratera pas le composant du panier d'achat jusqu'à ce qu'il entre dans l'écran. 

**Les avantages de l'hydratation incrémentielle** :
* un bundle plus léger
* un bootstraping plus rapide
* plus de nécessité d'utiliser un bloc de placeholder  


## Event Replay activé par défaut
  
Un problème courant dans les applications rendues côté serveur est le décalage entre un événement utilisateur (ex. : un clic) et le moment où le code JavaScript nécessaire pour le gérer est téléchargé et exécuté.
Pour résoudre cela, Angular utilise la bibliothèque Event Dispatch, déjà éprouvée par Google Search sur des milliards d’utilisateurs. Cette fonctionnalité capture les événements pendant le chargement initial de la page et les rejoue dès que le code requis est prêt.

Pour activer l'event replay dans une application Angular, il suffit de configurer le provider d’hydratation comme suit :

````typescript
bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
````

**Fonctionnement** :
* Lorsque l’application est initialement rendue, aucun JavaScript n’est encore téléchargé. Les composants apparaissent en gris pour indiquer cet état.
* Un utilisateur peut interagir avec l’application (ex. : cliquer sur "Ajouter au panier").
* En arrière-plan, la bibliothèque Event Dispatch capture ces clics.
* Une fois le JavaScript chargé, les clics sont rejoués, mettant à jour l’interface utilisateur (comme le nombre d’articles dans le panier).
  
Cette approche garantit une expérience utilisateur fluide, même avec un chargement progressif des scripts.

> En version 19, l'Event Replay est stabilisé et est activé par défaut pour toutes les applications qui utilisent le rendu serveur


## Mode de rendu au niveau des Routes

Angular v19 introduit une nouvelle interface, ````ServerRoute````, pour configurer le mode de rendu de chaque route :
* Rendu côté serveur (Server).
* Pré-rendu (Prerender).
* Rendu côté client (Client).

Exemple de configuration :
````typescript
export const serverRouteConfig: ServerRoute[] = [
  { path: '/login', mode: RenderMode.Server },  // rendue côté serveur
  { path: '/dashboard', mode: RenderMode.Client }, // rendue côté client
  { path: '/**', mode: RenderMode.Prerender }, // pré-rendue
];
````
Cela permet une gestion fine des routes sans duplication, même avec des chemins paramétrés.

### Résolution des paramètres de routes au moment du pré-rendu (developer preview)
Auparavant, il n'existait aucun moyen ergonomique de résoudre les paramètres de route au moment du pré-rendu. Avec la configuration de route du serveur, c'est désormais plus simple :

````typescript
export const routeConfig: ServerRoute = [{
 path: '/product/:id',
 mode: 'prerender',
 async getPrerenderPaths() {
   const dataService = inject(ProductService);
   const ids = await dataService.getIds(); // ["1", "2", "3"]
   return ids.map(id => ({ id })); // `id` is used in place of `:id` in the route path.
  },
}];
````  

## Rendu côté serveur sans zone.js (zoneless)

Angular continue à réduire sa dépendance à *zone.js*, introduisant des primitives pour gérer les requêtes en attente ou la navigation avant de rendre la page.

Exemple avec ````HttpClient```` et ````Router```` :

Un opérateur RxJS, ````pendingUntilEvent````, permet de notifier que le rendu n’est pas encore terminé :

````typescript
subscription
  .asObservable()
  .pipe(
    pendingUntilEvent(injector),
    catchError(() => EMPTY),
  )
  .subscribe();
````

Quand une nouvelle valeur est émise, Angular considère l’application prête et envoie le rendu au client.  

## linkedSignal (experimental)

````linkedSignal```` permet de créer un signal lié à un autre signal. Il peut se réinitialiser en cas de modification du signal source.

Cela le rend particulièrement utile dans les situations où l'état local doit rester synchronisé avec les données dynamiques. 


````typescript
const options = signal(['apple', 'banana', 'fig']);

// Choice defaults to the first option, but can be changed.
const choice = linkedSignal(() => options()[0]);
console.log(choice()); // apple

choice.set('fig');
console.log(choice()); // fig

// When options change, choice resets to the new default value.
options.set(['peach', 'kiwi']);
console.log(choice()); // peach
````

## api resource (intégration des signaux avec des opérations asynchrones)

Jusqu'à présent, les signaux dans Angular se concentraient sur les **données synchrones** : stockage de l'état dans les signaux, ````computed()````, ````input()````, ````output()````, ````viewChild()````, ````viewChildren()````, etc. 

Angular v19 fait ses premiers pas vers l'intégration des signaux avec des **opérations asynchrones** en introduisant une nouvelle API **expérimentale** ````resource()````. 

**Une ressource est une dépendance asynchrone** qui participe au graphique de signal. On peut considérer une ressource comme ayant trois parties :

1.	**Request** : Décrit une requête (ex : dépend des paramètres de la route).
2.	**Loader** : Exécute une opération asynchrone en réponse aux changements de la requête.
3.	**Instance Resource** : Fournit des signaux pour suivre l’état (loading, resolved, errored).

**Exemple** :
````typescript
@Component(...)
export class UserProfile {
  userId = input<number>();

  userService = inject(UserService);

  user = resource({
    request: user,
    loader: async ({request: id}) => await userService.getUser(id),
  });
}
````

Étant donné que de nombreuses applications Angular utilisent aujourd’hui RxJS pour la récupération de données, un équivalent ````rxResource```` a été ajouté via ````@angular/core/rxjs-interop```` qui crée une ressource à partir d’un chargeur basé sur Observable

````typescript
// resource()
products = resource({
  loader: () => fetch(url).then(res => res.json())
})

// rxResource()
products = rxResource({
  loader: () => this.http.get(url))
})

````

## Améliorations Angular Material et CDK

Le support de Material 3 rend plus facile la customisation des thèmes grace à la nouvelle api ````mat.theme````

Voici quelques exemples d'utilisation :

````css
@use '@angular/material' as mat;

@include mat.core();

$light-theme: mat.define-theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light
    ),
    typography: Roboto,
    density: 0
  ));

html {
  // Apply the light theme by default
  @include mat.core-theme($light-theme);
  @include mat.button-theme($light-theme);
  @include mat.card-theme($light-theme); 
  ...
}
````

*Version avec déclaration d'un seul mixin*

````css
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light
    ),
    typography: Roboto,
    density: 0
  ));
}
````

*override de couleur*
````
@use '@angular/material' as mat;

@include mat.theme-overrides(( primary: red ));
````

*override component*

````
@use '@angular/material' as mat;

@include mat.button-overrides(( label-text-color: red ));

@include mat.sidenav-overrides(
  (
    'content-background-color': purple,
    'container-divider-color': orange,
  )
);
````


## Amélioration de l'expérience développeur

### Mode standalone par défaut

Angular 19 rend désormais tous les composants, pipes, directives etc... **standalone** par défaut. Cela signifie qu'il n'est plus nécessaire
de spécifier manuellement le mode standalone

````typescript
@Component({
	selector: 'app-user',
	standalone: true // <--- plus nécessaire
})
````

D'autre part, la commande ````ng update```` supprime automatiquement la propriété standalone des composants autonomes et définit ````standalone: false```` pour les abstractions non autonomes.

Enfin, un nouveau flag de compilation, ````strictStandalone````, déclenche une erreur si un composant, une directive ou un pipe n'est pas autonome. 

Configuration dans *angular.json* :

````json
{
  "angularCompilerOptions": {
    "strictStandalone": true
  }
}
````

### Remplacement à chaud des modules (HMR)

Angular v19 prend en charge le remplacement de module à chaud (HMR) pour les styles et permet une prise en charge expérimentale du HMR pour les templates ! 
  
Avant cette amélioration, chaque fois que vous modifiez le style ou le template d'un composant et enregistrez le fichier, Angular CLI reconstruisait votre application et envoyait une notification au navigateur qui l'actualisait. 
  
  Le nouveau HMR compile le style ou le template qui a été modifié, envoie le résultat au navigateur et met à jour l'application sans actualisation de page ni perte d'état. 

* Le HMR **pour les styles** est donc **activé par défaut**
* Pour le tester avec les templates, il faut utiliser la commande ````NG_HMR_TEMPLATES=1 ng serve````

Pour **désactiver le hmr**, il faut soit positionner le flag ````"hmr": false```` dans le fichier *angular.json* ou bien utiliser la commande ````ng serve --no-hmr````


### Outils de test

* Support pour Karma avec le nouveau builder basé sur esbuild : Permet des temps de construction plus rapides pour les tests unitaires et une intégration fluide des fonctionnalités du builder d'application.
* **Dépréciation de Karma** : **Prévue pour début 2025**. Angular continue d’évaluer d’autres frameworks (comme Jest ou Web Test Runner) pour définir une recommandation officielle.
  

### Renforcement de la sécurité : Politique de sécurité du contenu stricte (CSP)


* Génération automatique de CSP à base de hachage :
  * Ajoute un hachage unique pour chaque script inline dans index.html.
  * Empêche l'exécution de scripts malveillants sans le hachage correspondant dans la CSP.
* Activation (developer preview) : Configuration dans *angular.json* :

````json
{
  "security": {
    "autoCSP": true
  }
}
````  


### Stabilisation des API inputs, outputs, view queries
  
Les nouvelles API ````input()````, ````output()````, ````viewChild()````, ````viewChildren()```` sont désormais stables. Pour simplifier l’adoption de ces nouvelles API, de nouvelles commandes permettent la conversion automatique vers la nouvelle syntaxe :

````
ng generate @angular/core:signal-input-migration
ng generate @angular/core:signal-queries-migration
ng generate @angular/core:output-migration
````
Alias pour tout exécuter à la fois :
````
ng generate @angular/core:signals
````

> Note : Les inputs basés sur des signaux sont en lecture seule, ce qui peut nécessiter des ajustements manuels dans certaines parties du code.
  
### Suppression automatique des imports inutilisés

Une nouvelle option permet désormais de signaler à l'IDE de supprimer automatiquement tout import non utilisé via le paramétrage suivant 

*tsconfig.json*

````typescript
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "unusedStandaloneImports": "suppress"
      }
    }
  }
}
````

### Déclaration de variable d'environnement à la volée

Il est désormais possible de fournir une variable d'environnement pendant la compilation avec la commande suivante utilisant le flag ````--define````:

````
ng build --define "apiKey='$API_KEY'"
````

````
declare global {
  var apiKey: string;
}

await fetch(`/api/data?apiKey=${globalThis.apiKey}`);
````

### Variables locales dans les templates

Avec la nouvelle syntaxe de bloc pour le control-flow et les defferable views, il est maintenant possible de déclarer des variables locales dans les templates. 

````html
<!-- Use with a template variable referencing an element -->
<input #name>

@let greeting = 'Hello ' + name.value;

<!-- Use with an async pipe -->
@let user = user$ | async;
````
 
</details>

# Angular v18

<details>
	<summary>Nouveautés Angular 18</summary>

````11/04/2024````

> [Angular v18 Blog](https://blog.angular.dev/angular-v18-is-now-available-e79d5ac0affe)

Après avoir livré 3 grosses versions (15, 16 et 17) apportant de nombreuses nouveautés et amélioration, la version 18 se concentre sur la stabilisation de nombreuses features jusque là identifiées comme "expérimentales".

Angular 18 est une version majeure qui inclut un certain nombre de nouvelles fonctionnalités et améliorations qui rendront les applications Angular plus rapides, plus puissantes et plus faciles à développer.

## (expérimental) Première API disponible en mode zoneless

Angular 18 fait un premier pas concret vers la migration *zoneless* avec la directive ````provideExperimentalZonelessChangeDetection````

````typescript
bootstrapApplication(App, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});
````

Après l'activation de cette API, Angular va retirer *zone.js* des polyfills dans le fichier *angular.json*

A terme, passer en mode *zoneless*  offrira les avantages suivants : 

* Amélioration de la composabilité pour les micro-frontends et meilleure interopérabilité avec les autres frameworks
* Runtime et rendu initial plus rapides
* Bundle plus léger et chargement des pages plus rapide
* Stack traces plus lisibles
* Débuggage simplifié

> Pour rappel, la meilleure solution de fonctionner en mode zoneless est d'utiliser **Signal**

À partir de la version 18, Angular utilise le même planificateur pour les applications *zoneless* et les applications utilisant *zone.js* avec la fusion activée. Pour réduire le nombre de cycles de détection de modifications dans les nouvelles applications *zone.js*, la fusion de zones est activée par défaut.

> Note : la fusion de zones est activée par défaut uniquement pour les nouvelles applications

Le support du mode *zoneless* a aussi été activé pour *Angular CDK* et *Angular Material*

## Angular.dev

[https://angular.dev/](https://angular.dev/) est officiellement le nouveau site de la documentation d'Angular

## Angular Material 3

Le support d'Angular Material 3 est maintenant stable, et son site en a profité pour faire peau neuve [https://material.angular.io/](https://material.angular.io/)

## HttpClientModule -> Déprécié

Avec la migration vers les composants standalone, nous commençons à observer la dépréciation des premiers modules. A partir de la v18, les modules ````HttpClientModule````, ````HttpClientTestingModule````, ````HttpClientXsrfModule````, et ````HttpClientJsonpModule```` sont dépréciés.

Désormais il faut utiliser ````provideHttpClient()````et ````provideHttpClientTesting()```` dans le fichier de configuration.

## Internationalisation

Les fonctions utilitaires proposées par ````@angular/common```` pour travailler avec les données locales ont été dépréciées au profit de l'API **Intl**.

Il n'est donc **plus recommandé** d'utiliser ````getLocaleCurrencyCode(), getLocaleDateFormat(), getLocaleFirstDayOfWeek()````, etc... Mais préférable d'**utiliser Intl** (se référrer à la [Documentation Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)).

*Exemple*
 ````Intl.DateTimeFormat```` pour travailler avec les dates locales

 ## Contenu par défaut pour ng-content

Il est désormais possible de spécifier un contenu par défaut à ````ng-content````

````typescript
@Component({
  selector: 'app-profile',
  template: `
    <ng-content select=".greeting">Hello </ng-content>

    <ng-content>Unknown user</ng-content>
  `,
})
export class Profile {}
````

Now we can use the component:
````typescript
<app-profile>
  <span class="greeting">Good morning </span>
</app-profile>
````

Résultat : 
````typescript
<span class="greeting">Good morning </span>
Unknown user
````


## Amélioration des performance du compilateur Ivy

Angular 18 améliorera les performances des applications Angular en apportant des optimisations au compilateur Ivy. Ces optimisations se traduisent par :

* Temps de démarrage plus rapide
* Réduction de la taille des bundles
* Meilleures performances globales

## Nouvelle api ng-template

Angular 18 introduira une nouvelle API ````ng-template```` qui facilitera la création et l'utilisation de modèles. La nouvelle API fournira :

* Plus de flexibilité et de puissance
* La possibilité de créer des modèles réutilisables et maintenables

## Nouveaux événements pour les formulaires

Angular 18 améliore l'API des formulaires en offrant plus de contrôle sur le processus de validation des formulaires. 

Liste des nouveaux événements disponibles :

* ````PristineChangeEvent````
* ````ValueChangeEvent````
* ````StatusChangeEvent````
* ````TouchedChangeEvent````
* ````FormSubmittedEvent````
* ````FormResetEvent````

<details>
  <summary>Exemple d'implémentation sur un champ</summary>

````html
<input id="title" [formControl]="title">
````

````typescript
title = new FormControl('my app');

title.events.subscribe((event) => {

	if (event instanceof TouchedChangeEvent) {
		console.log('Touched', event.touched)
	}
	if (event instanceof PristineChangeEvent) {
		console.log('Pristine', event.pristine)
	}
	if (event instanceof ValueChangeEvent) {
		console.log('ValueChange', event.value)
	}
	if (event instanceof StatusChangeEvent) {
		console.log('Status change', event.status)	// VALID, INVALID, PENDING, DISABLED
	}
})

````  
</details>

<details>
  <summary>Exemple d'implémentation sur un Form</summary>

````html
<form [formGroup]="myForm">
	<label for="title">Title</label>
	<input id="title" formControlName="title">
	
	<label for="version">Version</label>
	<input id="version" formControlName="version">
	
	<button type="submit">Save</button>
	<button type="reset">Reset</button>
</form>
````


````typescript
myForm = new FormGroup({
	title: new FormControl('my app'),
	version: new FormControl('1.1'),
})


this.myForm.events.subscribe((event) => {

	if (event instanceof TouchedChangeEvent) {
		console.log('Touched', event.touched)
	}
	if (event instanceof PristineChangeEvent) {
		console.log('Pristine', event.pristine)
	}
	if (event instanceof ValueChangeEvent) {
		console.log('ValueChange', event.value.title)
		console.log('ValueChange', event.value.version)
	}
	if (event instanceof StatusChangeEvent) {
		console.log('Status change', event.status)	// VALID, INVALID, PENDING, DISABLED
	}
	
	if (event instanceof FormSubmittedEvent) {
		console.log('Form submitted')
	}
	if (event instanceof FormResetEvent) {
		console.log('Form Reset')
	}
})
````

Ne pas oublier d'importer les events

````typescript
import { TouchedChangeEvent, PristineChangeEvent, ValueChangeEvent, StatusChangeEvent, FormSubmittedEvent, FormResetEvent } from '@angular/forms'
````
  
</details>

> [Vidéo explicative](https://www.youtube.com/watch?v=v7r-7PHaEtY&ab_channel=IgorSedov)

## Route redirectTo

Pour apporter plus de flexibilité avec la redirection de route, Angular 18 permet maintenant d'utiliser une fonction qui retourne une chaîne dans l'attribut ````redirectTo````.
Ceci permet de gérer la route de anière dynamique

*app.routes.ts*
````typescript
const routes: Routes = [
  { path: "first-component", component: FirstComponent },
  {
    path: "old-user-page",
    redirectTo: ({ queryParams }) => {
      const errorHandler = inject(ErrorHandler);
      const userIdParam = queryParams['userId'];
      if (userIdParam !== undefined) {
        return `/user/${userIdParam}`;
      } else {
        errorHandler.handleError(new Error('Attempted navigation to user page without user ID.'));
        return `/not-found`;
      }
    },
  },
  { path: "user/:userId", component: OtherComponent },
];
````

## Amélioration des outils de debuggage

Angular 18 comprendra plusieurs améliorations des outils de débogage qui faciliteront le débogage des applications Angular et fourniront plus d'informations sur l'état de l'application :

* Débogage avec des source maps
* Visualisation de l'arbre des composants et des liaisons de données
* Profils de performance

## Améliorations et autres fonctionnalités

En plus des fonctionnalités énumérées ci-dessus, Angular 18 comprendra également :

* Prise en charge des composants Web
* Amélioration de la prise en charge de l'internationalisation
* Une nouvelle API de routage
* stabilisation control-flow, defferable views, APIs Signal
 
</details>

# Angular 17.3

<details>
	<summary>Nouveautés Angular 17.3</summary>


### Support Typescript 5.4

### Nouveau compilateur de template

Ce compilateur est basé sur une représentation intermédiaire des opérations de modèle, un concept commun dans les compilateurs, par exemple dans LLVM. Cette représentation intermédiaire encode sémantiquement ce qui doit se produire au moment de l'exécution pour rendre et détecter les modifications du modèle. L'utilisation d'une représentation intermédiaire permet de traiter indépendamment les différentes préoccupations de la compilation du modèle, ce qui n'était pas le cas avec l'implémentation précédente. Ce nouveau compilateur est plus facile à entretenir et à étendre, ce qui en fait une excellente base pour les améliorations futures dans le framework.

### Fonction output() 

à l'image de la fonction input() apparue dans la version 17.2, c'est au tour des output() de faire leur apparition.

````typescript
// Syntaxe traditionnelle des Output
@Ouput() selectedUserOldSyntax = new EventEmitter<User>()

// Nouvelle syntaxe
selectedUser = output<User>();

sendUser(user: User) {
	this.selectedUser.emit(user)
}
````

> **Important** : Contrairement à la fonction ````input()````, la fonction ````ouput()```` **ne retourne pas un Signal** mais un objet ````OutputEmitterRef````. ````ouput()```` **n'est pas** basé sur Signal, il s'agit juste d'une nouvelle syntaxe alternative à ````@Output()```` permettant de rester cohérent avec l'utilisation de ````input()```` et alléger ainsi le code

> **A noter** : La syntaxe ````@Output()```` est toujours valide

La fonction ````output()```` retourne un objet ````OutputEmitterRef<T>```` qui peut être utilisé pour émettre une valeur. Cet objet
est très similaire à un objet ````EventEmitter```` simplifié et s'utilise de la même manière.

La fonction ````output()```` est paramétrable. Pour l'instant, seul le paramètre ````alias```` est disponible.

````typescript
selectedUser = output<User>({
	alias: 'newUser'
});
````

Deux nouvelles fonctions ont été ajoutées afin de convertir un output() en observable et inversément :

* ````outputFromObservable()````
* ````outputToObservable()````

````typescript
@Ouput() oldSyntax = new EventEmitter<Todo>()

todoAdded = output<Todo>();

counter$ = from([1, 2, 3, 4, 5])

counter = outputFromObservable(this.counter$);

todo$ = outputToObservable(this.todoAdded)
````

### Dépréciation de RouterTestingModule

Il est recommandé d'utiliser ````provideRouter()```` dans la configuration de TestBed

### Nouveaux types pour le router

On peut désormais simplifier la signature des guards

````typescript
export type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
````

par

````typescript
export type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => MaybeAsync<GuardResult>;
````

* ````GuardResult```` est un nouveau type égal à ````boolean | UrlTree````
* ````MaybeAsync<T>```` est un nouveau type générique égal à ````T | Observable<T> | Promise<T>````
 
</details>

# Angular 17.2

<details>
	<summary>Nouveautés Angular 17.2</summary>

> Angular **v17.2** : [Angular blog](https://blog.angular.io/angular-v17-2-is-now-available-596cbe96242d)     

Angular **v17.2** continue d'améliorer la prise en charge de Signal, en introduisant entre autre les notions **model input**, **signal queries** : *viewChild, viewChildren, contentChild, contentChildren*. Mais aussi la prise en charge expérimentale de *Material 3*, image loader Netlify et de la prise en charge du débogage d'hydratation dans Angular DevTools.

## model inputs

L'écriture traditionnelle pour utiliser le 2-way binding ````[(ngModel)]```` **ne fonctionne pas avec Signal**. Pour se faire, nous avons besoin d'avoir accès à un *writable signal*. C'est pourquoi Angular **v17.2** introduit la notion de **model input**

> le **model** défini un couple d'*input/output* qui peut être utilisé en 2-way binding.


*parent*
````typescript
<signal-counter [(count)]="parentCounter" />

export class ParentComponent {
  parentCounter = 0;
}
````

*enfant*
````typescript
@Component({
	selector: 'signal-counter',
	template: `
		<div class="counter">
			Counter value : {{ count() }}
			
			<button (click)="onIncrement()">Increment</button>
		</div>
	`
})

export class CounterComponent {
	
	count = model(0);	// est de type ModelSignal<number>, autorise le 2-way binding
	
	onIncrement() {
		this.count.update(val => val + 1);
	}
}
````

<details>
  <summary>Exemple avec 2 signaux connectés qui ont toujours la même valeur</summary>

*counter.component.ts*
````typescript
@Component{
  selector: 'app-counter',
  template: `<button (click)="increase()">Counter : {{ value() }}</button>`
}
export class CounterComponent {
  value = model.required<number>();

  increase() {
    this.value.update(count => count + 1);
  }
````

*wrapper.component.ts*
````typescript
@Component{
  selector: 'app-wrapper',
  imports: [CounterComponent],
  template: `
  <app-counter [(value)]="count" />
  <button (click)="increase()">Wrapper Counter : {{ count() }}</button>`
}
export class WrapperComponent {
  count = signal(0);

  increase() {
    this.count.update(count => count + 1);
  }
````
  
</details>

> [**Voir article détaillé ici**](https://netbasal.com/angulars-model-function-explored-a-comprehensive-overview-4481d023c822)    

## Signal queries

Angular permet d'accéder à la référence des éléments du DOM via les directives ````@ViewChild()```` et ````@ViewChildren()````. Cependant, ces directives ne fonctionnent pas avec Signal, c'est pourquoi les nouvelles directives ````viewChild()```` et ````viewChildren()```` ont été introduites.

### viewChild

<details>
  <summary>(Pour rappel) Accéder à une référence Sans Signal</summary>

````typescript
@Component({
	imports: [CounterComponent],
	template: `
	
		<p>Parent counter: {{ parentCounter }}</p>
		<signal-counter [(count)]="parentCounter" />
	`
})
export class SignalDemoComponent implements AfterViewInit {
	parentCounter = 0;
	
	@ViewChild(CounterComponent) counter: CounterComponent;	// est une référence de CounterComponent
	
	ngAfterViewInit() {
		console.log('counter component', this.counter)
	}
}
````
  
</details>


Accéder à une référence **Avec** Signal
````typescript
@Component({
	imports: [CounterComponent],
	template: `
	
		<p>Parent counter: {{ parentCounter }}</p>
		<signal-counter [(count)]="parentCounter" />
	`
})
export class SignalDemoComponent {
	parentCounter = 0;
	
	counter = viewChild(CounterComponent);	// est une référence de CounterComponent de type Signal<CounterComponent>
	
	constructor() {
		effect(() => console.log('counter component', this.counter()));
	}
	
}
````

*Obtenir une référence sur un élément précis avec un id*
````typescript
<signal-counter #myCounter [(count)]="parentCounter" />

counter = viewChild('myCounter');

// Si l'on souhaite forcer le required
counter = viewChild.required('myCounter');
````

### viewChildren

De la même manière que *viewChild*, on peut désormais utiliser *viewChildren* dans le cas où il y a plusieurs composant du même type

````typescript
@Component({
	imports: [CounterComponent],
	template: `
	
		<p>Parent counter: {{ parentCounter }}</p>
		<signal-counter [(count)]="parentCounter" />
		<signal-counter [(count)]="parentCounter" />
		<signal-counter [(count)]="parentCounter" />
	`
})
export class SignalDemoComponent {
	parentCounter = 0;
	
	counters = viewChildren(CounterComponent);	// est une référence de CounterComponent de type Signal<CounterComponent>
	
	constructor() {
		effect(() => console.log('array of counter components', this.counters()));
	}
	
}
````

### contentChild, contentChildren

Fonctionnement similaire à *viewChild()* et *viewChildren()*

> [Présentation vidéo de la chaîne Angular University](https://www.youtube.com/watch?v=abUBuWVwK14&ab_channel=AngularUniversity)
 
</details>

# Angular 17.1

<details>
	<summary>Voici les principales nouveautés de la version 17.1</summary>

> [source complète](https://blog.ninja-squad.com/2024/01/17/what-is-new-angular-17.1/)     

## Support Typescript 5.3

Voir les nouveautés typescript 5.3 ici : [https://devblogs.microsoft.com/typescript/announcing-typescript-5-3/](https://devblogs.microsoft.com/typescript/announcing-typescript-5-3/)

## Inputs as Signal

La feature la plus attendue de cette version est la possibilité d'utiliser les inputs comme Signaux via la création d'une fonction ````input()```` qui retourne un Signal.

Un article détaillé présente les nouveautés apportées par cette nouvelle feature [@Input / @Output](https://wiki-collab.groupe-isia.com/books/angular/page/at-input-at-output) 

## Zoneless change detection

Une nouvelle Api "private" appelée **ɵprovideZonelessChangeDetection** a été ajoutée à *@angular/core* permettant au framework de ne plus utiliser **zone.js** pour la détection des changements.

Il est **important** de noter que cette api est **encore au stade expérimental** comme le suggère son aspect "private", mais cela montre que l'équipe s'oriente clairement vers une détection de changement sans *zone.js* pour l'avenir

## Router info

Le routeur dispose désormais d'une option ````info```` dans les *NavigationExtras* qui peut être utilisée pour stocker des informations sur la navigation. Contrairement à l’option ````state````, ces informations ne sont pas conservées dans l’historique de la session.

````
<a [routerLink]="['/user', user.id]" [info]="{ userName: user.name }"></a>
````

## Angular CLI

### Vite v5

Angular 17.1 utilise maitenant Vite v5

### Application builder

Nouvelle commande pour migrer vers le nouveau Application Builder

````
ng update @angular/cli --name=use-application-builder
````

Pour rappel sur Angular Builder : 

> [Angular builder](https://robert-isaac.medium.com/angular-v17-the-application-builder-2482979648bf)    

L'équipe Angular travaille sur un nouveau builder appelé "application" (le builder actuel est appelé "browser"). 
Il est actuellement disponible en tant que version developer preview dans Angular 16.2 et deviendra le **choix par défaut pour les nouvelles applications générées avec Angular 17**.

Tout d'abord, qu'est-ce qu'un builder dans Angular ?

Le builder Angular (appelé "executer" dans les dépôts nx) est essentiellement le compilateur qui convertit les fichiers Angular TS, HTML Angular et SCSS de votre application en fichiers HTML, JS et CSS simples compréhensibles par le navigateur.

Actuellement, plusieurs builder sont disponibles, tels que 
* ````@angular-devkit/build-angular:browser```` pour le build en production, 
* ````@angular-devkit/build-angular:dev-server```` pour le service (par exemple, ng serve), qui utilise toujours ````@angular-devkit/build-angular:browser```` en interne, 
mais sans beaucoup d'optimisation et en exposant certaines parties du compilateur Angular pendant l'exécution. 
* ````@angular-devkit/build-angular:server```` pour le build production en SSR, 
* ````@nguniversal/builders:ssr-dev-server```` pour le service SSR, 
* ````@nguniversal/builders:prerender```` pour le prérendu.

Tous ces builder reposent actuellement sur webpack. Cependant, un nouveau builder, ````@angular-devkit/build-angular:browser-esbuild````, utilise esbuild, et il est disponible en developer preview

Où s'inscrit le nouveau builder ?

Il utilisera ````@angular-devkit/build-angular:browser-esbuild```` en interne, mais il l'étendra pour remplacer également ````@angular-devkit/build-angular:server```` et ````@nguniversal/builders:prerender````.

Et maintenant qu'il peut effectuer à la fois la construction du navigateur et du SSR, il permettra à ````@angular-devkit/build-angular:dev-server```` de remplacer ````@nguniversal/builders:ssr-dev-server````.

Dans le futur, nous aurons seulement 2 builder au lieu des 5 actuels. Cela simplifiera la configuration dans angular.json (ou project.json dans le cas de nx) et accélérera le processus de construction, car les étapes communes entre la construction du navigateur, le prérendu et le SSR ne seront exécutées qu'une seule fois au lieu de trois. 
De plus, cela permettra l'utilisation de modules ES (ESM) dans le SSR, ce qui fonctionne maintenant pour les projets sans SSR.



### loader option

L'application builder dispose d'une nouvelle option ````loader````. Elle permet de définir le type de fichier à utiliser pour une extension de fichier spécifiée. 
Le fichier correspondant à l'extension peut ensuite être utilisé dans le code de l'application via une instruction d'importation.

Les types disponibles sont les suivants :

* "text" qui traite le contenu comme une chaîne de caractères.
* "binary" qui traite le contenu comme un Uint8Array.
* "file" qui émet le fichier et fournit l'emplacement d'exécution du fichier.
* "empty" qui considère le contenu comme vide et ne l'inclura pas dans les paquets.

Par exemple, pour intégrer le contenu des fichiers SVG dans l'application, vous pouvez utiliser la configuration suivante dans le fichier angular.json : 

*angular.json*
````json
loader: {
    ".svg": "text"
}
````

Le fichier SVG peut ensuite être importé de la manière suivante 

````typescript
import content from './logo.svg';
````

TypeScript doit connaître le type de module pour l'importation afin d'éviter les erreurs de vérification de type lors de la construction. Vous devrez donc ajouter une définition de type pour le fichier SVG.

````typescript
declare module "*.svg" {
  const content: string;
  export default content;
}
````
 
</details>

# Keynote du 06/11/2023

<details>
	<summary>Présentation du nouveau branding et de la v17 à l'occasion de la keynote</summary>

 Le 6 novembre 2023, une **importante keynote Angular** a eu lieu. Durant cet événement, largement teasé sur les réseaux sociaux, l'équipe Angular a tout d'abord dévoilé un tout nouveau branding pour son framework.

Nous avons ainsi découvert un nouveau logo, accompagné d'une nouvelle charte graphique, marquant ainsi une réelle rupture avec l'ancien branding défini par AngularJS.

Ce coup de frais esthétique vient surtout appuyer une forte volonté de l'équipe de montrer que le framework Angular est plus que jamais d'actualité et toujours dans la course que se livrent les frameworks front-end JS. 

En effet, depuis la version 15, de nombreuses améliorations et refontes importantes ont fait leur arrivée, rendant la technologie Angular plus accessible et performante pour rivaliser avec les leaders du marché, tels que React et NextJS.

Qui dit refonte graphique, dit aussi **nouveau site web** ! 

> [Nouveau site angular.dev](https://angular.dev/)

En y regardant de plus près, on remarque que ce nouveau site ressemble beaucoup à ses concurrents NextJS ou VueJS, il respecte donc les codes actuels, ce qui est tout à son avantage.

* Angular nous propose ainsi un **site plus clair**, plus UX friendly, avec une **documentation plus accessible et à jour** !
* Une documentation open-source
* On y trouve aussi des **playgrounds intégrés basés sur différents templates** (Signal, Control Flow, Minigame, Hello world) permettant de tester les dernières nouveautés Angular, en ligne
* Une **section tutorial** permettant d'apprendre angular directement depuis le site, en réalisant des exercices via des playgrounds.
* Une **section Reference** permettant d'avoir un **accès rapide** sur les API, commandes CLI, codes erreur, release et versioning, configuration de projet etc... (très pratique)

> [Retrouvez la présentation sur angular.blog.io](https://blog.angular.io/announcing-angular-dev-1e1205fa3039?source=collection_home---4------0-----------------------)
> 

Mais ce n'est pas tout, la keynote a bien évidemment été l'occasion de présenter la **nouvelle version v17 (date de sortie 8/11/2023)** (voir ce que nous avions déjà rédigé sur [Angular 17](https://wiki-collab.groupe-isia.com/books/angular/page/angular-17)). 

#### Voici un résumé des points qui ont été abordés durant la keynote :

# Angular v17

> [présentation de la v17 - blog officiel Angular](https://blog.angular.io/introducing-angular-v17-4d7033312e4b)

<details>
	<summary>Présentation</summary>

 
## Progressive hydration et SSR

Un **nouveau paquet ````@angular/ssr```` package** vient remplacer Angular Universal (il s'agit d'une migration).

Désormais, pour ajouter le rendu hybride dans  un projet il suffit d'exécuter la commande suivante :
````
ng add @angular/ssr
````
Cette commande générera le point d'entrée du serveur, ajoutera des fonctionnalités de SSR et SSG et activera l'hydratation par défaut. ````@angular/ssr```` fournit des fonctionnalités équivalentes à ````@nguniversal/express-engine```` celles qui sont actuellement en mode maintenance. Si vous utilisez le moteur express, Angular CLI mettra automatiquement à jour votre code en ````@angular/ssr````.

> [https://angular.dev/guide/ssr](https://angular.dev/guide/ssr)     
> [https://angular.dev/guide/hydration](https://angular.dev/guide/hydration)

### Nouveaux lifecycle hook

Afin d'améliorer les performances du SSR et SSG et d'éviter de trop manipuler le DOM directement, deux nouveaux lifecycle hook font leur apparition :

* ````afterRender```` : Enregistrer une fonction callback à chaque fois que l'application a terminé le rendu
* ````afterNextRender```` : Enregistrer une fonction callback à appeler la prochaine fois que l'application termine le rendu.

Ces hooks seront invoqués uniquement par le navigateur, ce qui permet de connecter une logique DOM personnalisée directement dans les composants.

Par exemple, instancier un graphe après que la page ait été rendue 

````typescript
@Component({
  selector: 'my-chart-cmp',
  template: `<div #chart>{{ ... }}</div>`,
})
export class MyChartCmp {
  @ViewChild('chart') chartRef: ElementRef;
  chart: MyChart|null;

  constructor() {
    afterNextRender(() => {
      this.chart = new MyChart(this.chartRef.nativeElement);
    }, {phase: AfterRenderPhase.Write});
  }
}
````

## New control flow syntax

Nouvelle syntaxe dans les templates **@if @else @for @switch** :

- Nouveau builtin qui permet de s'affranchir des imports de NgIf, NgFor du CommonModule etc... Il en résulte ainsi une **amélioration des performances**
- écriture **plus simple à lire et à écrire**
- nouvelle **fonctionnalité if-else**

````html
<section>
	@if (use.isLoggedIn) {
		<app-dashboard/>
	} @else if (use.role === 'admin') {
		<app-admin-controls />
	} @else {
		<app-login />
	}
</section>
````
  
- fonction **track obligatoire** dans les boucles for pour **optimiser les performances**. L'ancienne syntaxe fonction "trackBy" est désormais simplement remplacée par le paramètre track, suivi de la propriété à tracer
- section de fallback **@empty** dans les boucles @for

````html
<section>
	@for (user of userList; track user) {
		<app-card [data]="user" />
	} @empty {
		<p>No users in the list</p>
	}
</section>
````

- nouvelle syntaxe **@switch**

````html
<section>
	@switch (membershipStatus) {
		@case ('gold') {
			<p>Your discount is 20%</p>
		}
		@case ('silver') {
			<p>Your discount is 10%</p>
		}
		@case ('bronze') {
			<p>Your discount is 5%</p>
		}
		@default {
			<p>Keep earning rewards</p>
		}
	}
</section>
````
  
> **Important** : pour le moment la nouvelle syntaxe est expérimentale et non obligatoire. Il n'est donc pas nécessaire de migrer tout de suite la syntaxe des projets migrés en 17



## Lazy-loading avec @defer

### Présentation

> en dev preview v17

Nouvelle façon de déclencher le chargement d'un contenu (en lazy-loading) côté template en fonction d'un déclencheur. Cette nouvelle feature apporte un gain significatif en terme de performance, il est donc recommandé de l'utiliser.

> A noter : **@defer n'est pas bloquant !**

Comment cela fonctionne sous le capot ? 
- Lorsque @defer est utilisé dans un template, le compilateur collecte toutes les dépendances nécessaires et établi une liste d'imports dynamiques. Après ça, lors du runtime, ces imports dynamiques sont invoqués lors du déclenchement

Liste des triggers natifs :

|Trigger|Action|
|-|-|
|on viewport|déclenche lorsque l'élément spécifique demandé arrive dans le viewport|
|on idle|déclenche dès que le navigateur signale qu'il est en état d'inactivité| 
|on interaction|déclenche lorsqu'un élément est cliqué, prend le focus, ou autres comportements similaires|
|on hover|déclenche lorsque la souris passe en survol d'une zone|
|on timer|déclenche après un timeout spécfique|
|when|déclencheur personnalisé|
|on immediate||

````html
<section #trigger>
	@defer (on viewport(trigger)) {
		<large-content />
	}
	<huge-content />
	<enormous-content />
</section>
````

Mais il est aussi **possible de créer son propre déclencheur** avec ````when````

````html
<button (click)="load = true">
	Load component
</button>

@defer (when load == true)) {
	<large-content />
}
</section>
````

On peut encore **aller plus loin en combinant plusieurs déclencheurs**

````html
<button #trigger (click)="load = true">
	Load component
</button>

@defer (on viewport(trigger); when load == true)) {
	<large-content />
}
````

### prefetch

Il est également possible de spécifier une condition de pré-chargement

````html
<section #trigger>
	@defer (prefetch on immediate; prefetch when val === true) {
		<large-content />
	}
</section>
````

### placeholder 

Pour plus de finesse, il est aussi possible de gérer différents blocs de placeholder : **@placeholder, @loading, @error**

````html
<button #trigger (click)="load = true">
	Load component
</button>

@defer (on interaction(trigger)) {
	<large-content />
} @placeholder {
	<img src="placeholder-image.png" />
} @loading (minimum 500ms){
    // ne sera affiché que si le temps de chargement est supérieur à 500ms,
    // utile pour les chargement très rapide afin d'éviter un affichage inutile
	<spinner />
} @error {
	<p>Oops, something went wrong !</p>
}
````

## Standalone Components

Le mode standalone sera désormais **activé par défaut** lors de la création d'un projet ````ng new my-app```` et lors de la création d'un composant via CLI ````ng g c my-component````

## Compilation avec ESBuild / Vite

Afin d'optimiser les temps de compilation, **la compilation avec ESBuild et Vite est désormais activée par défaut** (en remplacement de webpack) dans toute nouvelle application. 

Webpack ne disparaît pas pour l'instant est peut toujours être
utilisé. Il est cependant recommandé de commencer à migrer vers le nouveau mode de compilation pour adopter les optimisations futures.

Dans une prochaine release, des commandes permettrons de migrer les anciennes applications vers le rendu hybride (rendu côté client avec SSG ou SSR)

## Custom @Input transforms

Petite amélioration qui facilite la vie dans la gestion des champs, la possibilité de transformer automatiquement des valeurs d'Input :

````typescript
@Component({...})

export class TextInput {
	// Transforms string inputs to boolean automatically
	@Input({ transform: booleanAttribute }) disabled: boolean = false;
	
}
````

````html
<!-- Before --> 
<text-input [disabled]="true" />

<!-- After -->
<text-input disabled />
````

Il existe d'autres méthodes de transformation comme ````numberAttribute````

> [Un article dev.to sur le sujet](https://dev.to/this-is-angular/angular-transform-your-inputs-at-will-and-simply-12oo)     

## Inline style 

Il est désormais possible de déclarer les styles dans une chaîne seule et non plus obligatoirement dans un tableau de chaîne. Une nouvelle propriété ````styleUrl```` fait également sont apparition

````typescript
@Component({
	// Before
	styles: `[
		.username: { color: red; }
	]`
	
	// After 
	styles: `
		.username: { color: red; }
	`
	
	// Nouvelle propriété
	styleUrl: './user.component.scss'
})
````

## Material 3

La prise en charge de Material 3 arrivera dans une version future
</details>

</details>

# ng-conf 2023

<details>
	<summary>Quelques annonces faites lors de la ng-conf 2023</summary>

Les 14 et 15 juin 2023 avaient lieu la **ng-conf 2023**, l'occasion de présenter les nouveautés apportées par Angular 16, mais aussi de parler du futur. 

A cette occasion quelques infos intéressantes ont été annoncées, en voici quelques unes

> **Disclaimer** : Ces "nouveautés" ne sont pour l'heure par en version finale, il convient donc de rester prudent sur leur adoption pour le moment. Vous pouvez consulter les RFC ici [RFC Control flow](https://github.com/angular/angular/discussions/50719) et [RFC defer loading](https://github.com/angular/angular/discussions/50716)

## Nouvelle API pour le control flow (*ngIf, *ngFor, ngSwitch)

La façon de gérer le contrôle de l’affichage des parties d’un template va changer ! Comparons tout cela.

### Syntaxe actuelle

***ngIf**
````html
<div *ngIf="someCondition;else other">
  someCondition is true
</div>

<ng-template #other>
  someCondition is false
</ng-template>
````
***ngFor**
````html
<ng-container *ngIf="products.length > 0; else noProducts">
  <div *ngFor="let product of products; trackBy: trackByProductId">
    {{product.name}}
  </div>
</ng-container>

<ng-template #noProducts>
  <p>No products available.</p>
</ng-template>
````
**[ngSwitch]**
````html
<div [ngSwitch]="role">
  <p *ngSwitchCase="'director'">You are a director</p>
  <p *ngSwitchCase="'teacher'">You are a teacher</p>
  <p *ngSwitchCase="'student'">You are a student</p>
  <p *ngSwitchDefault>You are a student</p>
</div>
````

### Nouvelle syntaxe


````html
@if (someCondition) {
 someCondition is true
} @else{
  someCondition is false
}
````
````html
@for (product of products; track product.id) {
  <div>{{ product.name }}</div>
} @empty {
  <p>No products available.</p>
}
````

> On note l'apparition de ````@empty```` qui est très intéressante pour les boucles for
````html
@switch (membershipStatus) {
    @case ('gold') {
        <p>Your discount is 20%</p>
    }
    @case ('silver') {
        <p>Your discount is 10%</p>
    }
    @case ('bronze') {
        <p>Your discount is 5%</p>
    }
    @default {
        <p>Keep earning rewards</p>
    }
}
````

Nous passons donc à un **Control Flow par bloc**, tout cela a été mis en place **pour plusieurs raisons** :

* Se rapprocher davantage d’une syntaxe JS classique
* Réduire la complexité avec les <ng-template />
* Permettre une adoption des applications *zoneless* plus simple

Pour le dernier point cité, pour **rappel** : Aujourd’hui les applications Angular reposent sur **zone.js** pour gérer leurs détection de changement, dans un avenir très proche cette librairie externe **ne sera plus nécessaire grâce à Signal**.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO">

* **A terme, les directives actuelles vont être dépréciées** !
* La fonction *trackBy* de ````{:for}```` va devenir **obligatoire**

## defer

Autre grande nouveauté annoncée, l'apparition d'un mot clé **````defer````**

L’idée est d’apporter une façon **agréable** et **facile** de **gérer le chargement** des différentes parties de nos pages. Actuellement le lazy loading nous permet de retarder le chargement du code JS d’une route via ````loadComponent()```` ou ````loadChildren()```` directement dans nos fichiers de routing.

L'arrivée de **````defer````** va permettre **de différer le chargement de parties distinctes des pages** (typiquement les composants utilisés dans nos pages).

**Il s’agit donc d’optimisation de performance.**
 
</details>


[Back to top](#nouveautés)    

# v16

<details>
	<summary>Résumé des principales nouveautés</summary>

> [Article complet Blog Angular 16 officiel](https://blog.angular.io/angular-v16-is-here-4d7a28ec680d)

### Réactivité

Angular 16 voit l'arrivée de la version **preview** de **Signals** (*voir les articles précédents pour plus de détails*) un nouveau modèle de réactivité complètement rétro-compatible et interopérable avec RxJS dont les bénéfices sont les suivants :

- optimisation du temps d'exécution par la réduction du nombre de calculs pendant la phase de détection de changements
- nouvelle manière simplifiée d'aborder la réactivité, plus accessibles aux novices sur Angular
- granularité plus fine qui permettra dans les prochaines releases de pouvoir détecter les changements uniquement sur les composants affectés
- rendre zone.js optionnel dans les futures releases en utilisant **signals** pour notifier le framework lors des changements survenus dans le model
- introduction des *computed properties* (concept que l'on retrouve aussi dans VueJS)
- fournir une meilleure interopérabilité avec RxJS

> La totalité des fonctionnalités de Signals sera intégrée dans le courant de l'année

> [Documentation officielle sur signal](https://angular.io/guide/signals)

### Hydratation et SSR

Afin d'optimiser toujours plus les performances en matière de rendu, l'heure est au rendu côté serveur (SSR). Des efforts ont donc été faits sur *l'hydratation non destructive*.Angular ne recalcule plus le rendu de l'application de zéro mais va maintenant chercher les noeuds existants du DOM tout en créant des structures de données internes et y attache des listeners.

Quelques avantages que l'on peut y voir sont :

- Suppression des scintillements des pages
- Meilleurs résultats Web Core Vitals
- Intégration aisée dans les applications existantes (quelques lignes de code)
- Adoption incrémentale de l'hydratation avec l'attribut `ngSkipHydratation`

> Voir tutorial : [Angular 16 Server-side rendering](https://github.com/gsoulie/angular-resources/blob/master/ng-ssr.md)

[Back to top](#nouveautés)    

### Outils

- **mode standalone** : La commande `ng new --standalone` permet de créer une solution directement en mode standalone complet sans aucun fichier *NgModule*
- **Compilation - Vite et esbuild** : Afin d'améliorer les performances de compilation, la developer preview d'angular v16 se base sur **Vite** comme serveur de **développement** (uniquement) et **esbuild** pour la compilation en mode développement et production. Ceci apporterai un **gain d'environ 72%** sur les temps de compilation selon les premiers tests
- **Amélioration des tests unitaires avec Jest et Web test runner** : Support expérimental de Jest. Dans une future version, les projets Karma existants seront migrés vers Web Test Runner pour continuer à prendre en charge les tests unitaires basés sur un navigateur.
- **Support typescript 5.0**
- **Suppression surcharge ngcc**

### Amélioration de l'expérience développeur

- **Required inputs** : Il est maintenant possible de définir les *@Input()* comme requis : `@Input({ required: true }) title: string = '';`
- **Données de routage en tant qu' @Input de composant** (*voir article précédent sur les nouvelles fonctionnalités du Router*)
- **ngOnDestroy injectable avec destroyRef** : permet de se passer de l'implémentation de *OnDestroy* et *ngOnDestroy*. On pourra désormais déclarer le code à détruire directement depuis le constructeur de la classe (voir exemple ci-dessous)

```typescript
import { Injectable , DestroyRef } de  '@angular/core' ; 
class ExampleComponent {
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      // do something when the component is destroyed
    })
  }
}

```

- **self-closing tags** : Simplification de l'écriture des balises du template avec la syntaxe de self-closing tag

[Back to top](#nouveautés)    

## Nouvelle fonctionnalité du Router

> [source : Enea Jahollari membre actif de la communeauté](https://itnext.io/bind-route-info-to-component-inputs-new-router-feature-1d747e559dc4)

Angular 16 va introduire une nouvelle façon de récupérer les paramètres et données d'une route.

Nous utilisons généralement le Router pour rendre différentes pages pour différentes URL, et en fonction de l'URL, nous chargeons également les données en fonction de ses paramètres de chemin ou de requête.

Dans la dernière version d'Angular v16, nous aurons une nouvelle fonctionnalité qui simplifiera le processus de récupération des informations de route dans le composant.

**Fonctionnement actuel** :

Disons que nous avons un tableau de routes comme celui-ci :

```typescript
const routes: Routes = [
	{
		path: "search",
		component: SearchComponent,
	},
];

```

Et à l'intérieur du composant, nous devons lire les paramètres de requête afin de remplir un formulaire de recherche.

Avec une URL comme celle-ci : http://localhost:4200/search?q=Angular;

```typescript
@Component({})
export class SearchComponent implements OnInit {
// ici nous injectons la classe ActivatedRoute qui contient des informations sur notre route actuelle
private route = inject(ActivatedRoute);

	query$ = this.route.queryParams.pipe(map((queryParams) => queryParams['q']));

	ngOnInit() {
		this.query$.subscribe(query => { // faire quelque chose avec la requête });
	}
}

```

Comme vous pouvez le voir, nous devons injecter le service **ActivatedRoute**, puis nous pouvons accéder aux paramètres de la requête à partir de celui-ci.

Mais nous pouvons également accéder aux paramètres de route, aux données, ou même aux données résolues, comme on peut le voir dans l'exemple suivant :

```typescript
const routes: Routes = [
	{
		path: "search/:id",
		component: SearchComponent,
		data: { title: "Search" },
		resolve: { searchData: SearchDataResolver }
	},
];

@Component({})
export class SearchComponent implements OnInit {
	private route = inject(ActivatedRoute);

	query$ = this.route.queryParams.pipe(map((queryParams) => queryParams['q']));
	id$ = this.route.params.pipe(map((params) => params['id']));
	title$ = this.route.data.pipe(map((data) => data['title']));
	searchData$ = this.route.data.pipe(map((data) => data['searchData']));

	ngOnInit() {
		this.query$.subscribe(query => { // faire quelque chose avec la requête });
		this.id$.subscribe(id => { // faire quelque chose avec l'id });
		this.title$.subscribe(title => { // faire quelque chose avec le titre });
		this.searchData$.subscribe(searchData => { // faire quelque chose avec les données de recherche });
	}
}

```

**Comment cela fonctionnera-t-il dans Angular v16 ?**

Dans Angular v16, nous pourrons passer les informations de la route **directement dans les @Input()** du composant, donc nous n'aurons **plus besoin d'injecter le service ActivatedRoute**.

```typescript
const routes: Routes = [
	{
		path: "search",
		component: SearchComponent,
	},
];

@Component({})
export class SearchComponent implements OnInit {
	/*
		Nous pouvons utiliser le même nom que le paramètre de requête, par exemple "query"
		Exemple d'URL : http://localhost:4200/search?query=Angular
	*/
	@Input() query?: string; // nous pouvons utiliser le même nom que le paramètre de requête
	
  /*
  	Ou bien renommer le paramètre, ici en "q"
  */
	@Input('q') queryParam?: string;
}

```

Avec la version 16 d'Angular, nous pourrons donc passer directement les informations de la route aux inputs du composant, ce qui facilitera grandement la récupération des paramètres de la route.

Prenons l'exemple suivant :

```typescript
const routes: Routes = [
	{
		path: "search/:id",
		component: SearchComponent,
		data: { title: "Recherche" },
		resolve: { searchData: SearchDataResolver }
	},
];

@Component({})
export class SearchComponent implements OnInit {
	@Input() query?: string; // Ce paramètre viendra des query params
	@Input() id?: string; // Ce paramètre viendra des path params
	@Input() title?: string; // Ce paramètre viendra des data
	@Input() searchData?: any; // Ce paramètre viendra des resolved data

	ngOnInit() {
		
	}
}

```

Il est bien sûr possible de renommer tous les paramètres

```typescript
@Input() query?: string; 
@Input('id') pathId?: string; 
@Input('title') dataTitle?: string;
@Input('searchData') resolvedData?: any; 

```

Comme on peut le voir, nous avons simplement défini les **@Input()** du composant pour les paramètres de la route que nous souhaitons récupérer.

### Comment utiliser cette nouvelle feature ?

Afin d'utiliser cette nouvelle fonctionnalité, nous devons l'activer dans le **RouterModule** :

```typescript
@NgModule({
	imports: [
		RouterModule.forRoot([], {
			// ... autres fonctionnalités
			bindToComponentInputs: true // <-- activer cette fonctionnalité
		})
	],
})
export class AppModule {}

```

Ou si nous sommes dans une application **standalone**, nous pouvons l'activer de cette manière :

```typescript
bootstrapApplication(App, {
	providers: [
		provideRouter(routes,
			// ... autres fonctionnalités
			withComponentInputBinding() // <-- activer cette fonctionnalité
		)
	],
});

```
[Back to top](#nouveautés)    

### Comment migrer vers la nouvelle API ?

Si nous avons un composant qui utilise le service **ActivatedRoute**, nous pouvons le migrer vers la nouvelle API en effectuant les étapes suivantes :

- Supprimer le service **ActivatedRoute** du constructeur du composant.
- Ajouter le décorateur **@Input()** aux propriétés que nous voulons lier aux informations de route.
- Activer la fonctionnalité **bindToComponentInputs** dans le **RouterModule** ou la fonction **provideRouter**.

En résumé, avec la nouvelle fonctionnalité d'Angular v16, la récupération des informations de la route dans un composant sera beaucoup plus simple. Nous pourrons passer directement les informations de la route aux inputs du composant, ce qui évitera d'avoir à manipuler des observables et à injecter le service ActivatedRoute.

[Back to top](#nouveautés)    

## Signals, vers la fin d'RxJS et de zone.js ?

`02/03/2023`

La sphère Angular est en ébulition depuis quelques semaines, en effet, **une nouveauté de taille est en approche !** Une nouvelle façon de gérer la réactivité, de manière plus simple et plus performante.

Cette petite révolution apportée par le framework *SolidJS* s'appelle **Signals** !

**Signals** va très probablement introduire un future dans lequel nous n'aurions **plus besoin de zone.js** ce qui pourrait êrte un gros changement ! D'autre part, l'arrivée de **Signals** devrait grandement faciliter l'apprentissage de la programmation réactive aux débutants sur Angular.

En effet, **Signals** permet le contrôle des changements de manière **plus fine et performante** que **zone.js**. Contrairement à zone.js, **Signals ne re-contrôle pas la totalité de l'abre de composants** pour effectuer les changements. Et ce mécanisme pourrait bien améliorer considérablement le mécanisme de change detection d'Angular.

En effet, avec **Signal** c'est nous qui disons à Angular qu'il y a eu un changement, ensuite Angular va mettre à jour uniquement la partie du DOM contenant le **Signal**

Pour illustration, voici actuellement à quel niveau sont effectué les contrôles de changements sur les frameworks Angular, React et Solid :

- Angular : niveau arborescence de l'application
- React : niveau arborescence composant
- Solid : niveau individuel

*Comparaison fonctionnement zone.js et Signals*

Par analogie avec RxJS, **Signals se comporte comme un BehaviourSubject en RxJS**, à la différence qu'il n'a **pas besoin de souscription** pour être notifié des changements de valeur.

Avec **Signals**, les souscriptions sont créées et détruites automatiquement, on n'a pas besoin de s'en pré-occuper. C'est plus ou moins ce qui se passe avec les pipes async d'ailleurs. A la différence, **Signals** n'a pas besoin d'une souscription pour être utilisé en dehors de la vue

> **A noter** : Pour l'instant, Signals n'est disponible que dans la version **v16.0.0-next.0** d'Angular.

Dans les faits, cela va se traduire par une simplification de la syntaxe du code de gestion de la réactivité, et petit à petit, probablement un remplacement de l'utilisation de RxJS par **Signals** (l'avenir nous le dira).

A moyen terme en tout cas, **Signals** ne va pas remplacer RxJS, les 2 peuvent cohabiter. Il est d'ailleurs possible de convertir un Signals en Observable avec le builtin (en béta pour l'instant) `fromSignal()` et inversément convertir un observable en Signal avec `fromObservable()` pour donner la possibilité d'avoir accès à la valeur directement dans le template sans avoir à utiliser de pipe async.

**A noter** que Signal est *synchrone* alors que RxJS peut être *synchrone* ou *asynchrone*.

Pour illustrer rapidement à quoi ça ressemble, voici un exemple :

*Syntaxe RxJS*

```typescript
@Component({
	selector: 'my-app',
	standalone: true,
	template: `
		<div>Count: {{ count$ | async }}</div>
		<div>Double: {{ double$ | async }}</div>
		<button (click)="changeCount()"></button>
	`
})
export class AppComponent {
	count$ = new BehaviourSubject(0);
	double$ = this.count$.pipe(
		map(count => count * 2)
	)
	
	changeCount() { this.count$.next(5); }
}

```

*Syntaxe Signals*

```typescript
@Component({
	selector: 'my-app',
	standalone: true,
	template: `
		<div>Count: {{ count() }}</div>
		<div>Double: {{ double() }}</div>
		<button (click)="changeCount()"></button>
	`
})
export class AppComponent {
	count = signal(0);
	double = computed(() => this.count() * 2);
	
	changeCount() { this.count.set(5); }
}

```

Ce n'est bien sûr qu'un exemple très basique. Vous trouverez plus d'infos et d'exemples ici :

[Back to top](#nouveautés)    

**Articles**

- [https://itnext.io/angular-signals-the-future-of-angular-395a69e60062](https://itnext.io/angular-signals-the-future-of-angular-395a69e60062)

**Série de vidéos courtes Josh MORONY**

- [Angular is about to get its most IMPORTANT change in a long time...](https://www.youtube.com/watch?v=4FkFmn0LmLI&ab_channel=JoshuaMorony)
- [Why didn't the Angular team just use RxJS instead of Signals?](https://www.youtube.com/watch?v=iA6iyoantuo&ab_channel=JoshuaMorony)
- [The end of Angular's "service with a subject" approach?](https://www.youtube.com/watch?v=SVPyr6u3sqU&ab_channel=JoshuaMorony)
- [Exemple de code](https://github.com/joshuamorony/quicklist-signals/blob/main/src/app/home/home.component.ts)

[Angular Signals everything you need to know](https://medium.com/@PurpleGreenLemon/angular-and-signals-everything-you-need-to-know-2ff349b6363a)  
[Angular Signals push-pull](https://angularexperts.io/blog/angular-signals-push-pull)  
[Signals In Angular - Is RxJS doomed ?](https://levelup.gitconnected.com/signals-in-angular-is-rxjs-doomed-5b5dac574306)  
[https://www.angulararchitects.io/en/aktuelles/angular-signals/](https://www.angulararchitects.io/en/aktuelles/angular-signals/)

[Back to top](#nouveautés)    
 
</details>

# v15

<details>
	<summary>13/03/2023</summary>

## Suppression des fichiers environment.ts

Avec l'arrivée d'Angular 15 et son lot de nouveautés qui ont fait le buzz, **une fonctionnalité a été retirée** car jugée *non éssentielle*.

Passée jusque là sous les radars, cela a finalement alimenté de nombreux débats qui ont amenés l'équipe d'Angular à faire marche arrière et à réintroduire la-dite fonctionnalité (de manière optionnelle) dans la version **v15.1**

Il s'agit de **l'utilisation de fichiers d'environnement** par défaut (*environment.ts* et *environment.prod.ts*). Ces fichiers étaient notamment utilisés pour modifier l'état du flag **enableProdMode** dans le fichier *main.ts* à la compilation.

L'équipe Angular a donc simplifié la gestion de ce flag et en a profité pour **supprimer la gestion des environnement** via les fichiers *environment.ts*, argumentant que la plus part des développeurs configuraient leurs environnements de différentes autres manières (pipelines CI/CD, dockers etc...) et que beaucoup utilisaient une configuration basée sur le runtime (plus évolutive, plus flexible) plutôt que sur la compilation.

> **A retenir** : Désomais, lors de la création d'un projet Angular 15, les fichiers *environment.ts* ne sont plus créés par défaut. Il reste néanmoins possible de les générer avec la commande `ng generate environments` depuis angular **v15.1** ou bien de recréer la structure manuellement [voir la documentation](https://angular.io/guide/build#configure-environment-specific-defaults)

[Article complémentaire](https://dev.to/this-is-angular/angular-15-what-happened-to-environmentts-koh)

[Back to top](#nouveautés)    

## Angular 15 est là !

La version 15 d'Angular vient d'être déployée !

> Article officiel complet ici : [https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)

Pour un petit résumé des principales nouveautés, c'est ici :

### le mode standalone apparu en v14 est désormais stable

Pour rappel le concept d'api **standalone** est apparut dans la v14, permettant de créer des composants, directives, pipes,... sans utiliser *NgModules*.

Ceci rendant les composants encore plus indépendants. Le mode *standalone* est maintenant **stable** et peut-être utilisé sans crainte. Il va d'ailleurs être considéré comme une **bonne pratique**

### Les API Router et HttpClient sont accessibles en standalone et sont tree-shakables

L'API Router est maintenant disponible en mode **standalone**, on peut donc définir ses routes sans utiliser de NgModule (voir exemple dans l'article)

### API Directive composition

Cette nouvelle directive accessible via le nouveau sélecteur **hostDirectives** permet de faciliter encore la réutilisabilité du code en crééant des directives composées.

Un tuto a donc été réalisé pour l'occasion : [Composition Directive](https://github.com/gsoulie/angular-resources/blob/master/ng-composition-directive.md)     

### Version stable de la directive NgOptimizedImage

La directive *NgOptimizedImage* est maintenant stable. Elle permet un gain significatif dans le chargement des images.

### Guards fonctionnels

L'arrivée des guards fonctionnels permet de réduire considérablement le code des guards, facilitant ainsi leur utilisation.

Ainsi le code suivant qui déclare un guard simple faisant appel au service *LoginService* pour déterminer si l'utilisateur est authentifié et qui par conséquent à accès à la route

```typescript
@Injectable({ providedIn: 'root' })
export class MyGuardWithDependency implements CanActivate {
  constructor(private loginService: LoginService) {}

  canActivate() {
    return this.loginService.isLoggedIn();
  }
}

const route = {
  path: 'somePath',
  canActivate: [MyGuardWithDependency]
};

```

Peut être simplifié de la manière suivante grace aux guards fonctionnels

```typescript
const route = {
  path: 'admin',
  canActivate: [() => inject(LoginService).isLoggedIn()]
};

```

[Back to top](#nouveautés)    

### V15.1 Dépréciation : Router Guards

Actuellement, la déclaration et l'utilisation classique d'un guard est réalisée de la manière suivante :

```typescript
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private user = getUser();

  isAdmin(isAdmin: boolean) {
    return isAdmin ? user.isAdmin : false;
  }
}

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {
  private permission = inject(PermissionsService);

  canActivate(route: ActivatedRouteSnapshot) {
      const isAdmin: boolean = route.data?.['isAdmin'] ?? false;
      return this.permission.isAdmin(isAdmin);
  }
}

export const APP_ROUTES: [{
  path: 'dashboard',
  canActivate: [IsAdminGuard],
  data: {
    isAdmin: true,
  },
  loadComponent: () => import('./dashboard/admin.component'),
}]

```

![](https://img.shields.io/badge/IMPORTANT-DD0031.svg?logo=LOGO) Cependant, **à partir d'angular v15.2, l'implémentation des guards en tant que services injectables sera dépréciée ! Et complètement retirée en v17**

La raison principale de ce changement est que : Les gardes basées sur les classes injectables et les Injection Token sont moins configurables et réutilisables. De plus, ils ne peuvent pas être intégrés, ce qui les rend moins puissants et plus lourds.

Si vous avez la possibilité de basculer dès à présent en Angular v15, la nouvelle **syntaxe conseillée** est la suivante :

```typescript
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  isAdmin(isAdmin: boolean) {
    return isAdmin;
  }
}

export const canActivate = (isAdmin: boolean, permissionService = inject(PermissionsService)) => permissionService.isAdmin(isAdmin);

export const APP_ROUTES: [{
  path: 'dashboard',
  canActivate: [() => canActivate(true)],
  loadComponent: () => import('./dashboard/admin.component'),
 }]

```

Si vous ne pouvez pas envisager de migration, alors vous pouvez conserver une certaine compatibilité en utilisant la syntaxe suivante qui implique de créer une fonction pour injecter votre service :

```typescript
function mapToActivate(providers: Array<Type<{canActivate: CanActivateFn}>>): CanActivateFn[] {
  return providers.map(provider => (...params) => inject(provider).canActivate(...params));
}
const route = {
  path: 'admin',
  canActivate: mapToActivate([IsAdminGuard]),
};

```

![](https://img.shields.io/badge/IMPORTANT-DD0031.svg?logo=LOGO) Pour rappel, le guard **CanLoad** sera remplacé par **CanMatch** en **v15.1**

[Back to top](#nouveautés)    

### Simplification de l'import des composants dans le router

Afin de simplifier l'écriture des imports des composants en mode lazy-loading, le router utilise maintenant un système d'auto-unwrap lui permettant de chercher un élément `export default` dans le fichier spécifié et de l'utiliser le cas échéant.

Ce qui permet de simplifier la déclaration de l'import d'un composant standalone

```typescript
{
  path: 'lazy',
  loadComponent: () => import('./lazy-file').then(m => m.LazyComponent),
}

```

En

```typescript
{
  path: 'lazy',
  loadComponent: () => import('./lazy-file'),
}

```

Le router va en fait chercher dans le fichier *./lazy-file* l'élément `export default class LazyComponent` et l'utiliser pour réaliser l'import. **Attention** il faut que le composant soit exporté en mode *default*

### Amélioration des stack traces

En collaboration avec Chrome DevTools, les stacks traces ont été améliorées pour gagner en clareté et en précision. Ainsi les erreurs de type

```
ERROR Error: Uncaught (in promise): Error
Error
    at app.component.ts:18:11
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (asyncToGenerator.js:3:1)
    at _next (asyncToGenerator.js:25:1)
    at _ZoneDelegate.invoke (zone.js:372:26)
    at Object.onInvoke (core.mjs:26378:33)
    at _ZoneDelegate.invoke (zone.js:371:52)
    at Zone.run (zone.js:134:43)
    at zone.js:1275:36
    at _ZoneDelegate.invokeTask (zone.js:406:31)
    at resolvePromise (zone.js:1211:31)
    at zone.js:1118:17
    at zone.js:1134:33

```

Ont été épurées pour ne garder que l'essentiel et aussi mieux référencer la présence exacte de l'erreur

```
ERROR Error: Uncaught (in promise): Error
Error
    at app.component.ts:18:11
    at fetch (async)  
    at (anonymous) (app.component.ts:4)
    at request (app.component.ts:4)
    at (anonymous) (app.component.ts:17)
    at submit (app.component.ts:15)
    at AppComponent_click_3_listener (app.component.html:4)

```

[Back to top](#nouveautés)    

### Refactorisation des Composants Material Design

Une refactorisation complète des composants basés sur Material Design a été opérée dans le but d'adopter Material 3 et ainsi mettre à jour les styles et structure DOM des composants.

![](https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO) Après migration vers la v15, il est possible que certains styles de votre application doivent être ajustés, en particulier si votre CSS surcharge les styles des éléments internes de l'un des composants migrés.

Se référer au guide de migration pour plus de détails : [https://github.com/angular/components/blob/main/guides/v15-mdc-migration.md#how-to-migrate](https://github.com/angular/components/blob/main/guides/v15-mdc-migration.md#how-to-migrate)

### Migration vers la v15

![](https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO) le passage à la v15 implique une potentielle **mise à jour de NodeJS** vers l'une des versions suivantes : 14.20.x, 16.13.x and 18.10.x

[Back to top](#nouveautés)    
 
</details>

# v14

> [Blog officiel Angular - Angular 14 is now available !](https://blog.angular.io/angular-v14-is-now-available-391a6db736af)

<details>
	<summary>Nouveautés notables</summary>

 
- Les standalone components : Une nouvelle propriété `standalone` a fait son apparition dans les composants (dans le decorator) et leur permet de ce fait, de ne plus avoir besoin d'être importés dans un module via `NgModule()`. CLI `ng g c myCompo --standalone`
- Formulaires strictement typés pour plus de contrôle
- Nouvel attribut `title` dans le fichier de routing, permettant enfin pouvoir donner des titres aux pages
- CLI avec auto-complétion
- Nouvelle façon d'injecter un service : [lien](https://www.youtube.com/watch?v=nXjK7tWZ8sQ&ab_channel=DecodedFrontend)

### Migration Angular 13 - A savoir !

Petite info **non négligeable** mais passée inaperçue, **Angular 13** a introduit un **"cache"** pour rendre la compilation plus rapide. Ceci se traduit, vous le verrez lorsque vous créerez votre premier projet en Angular 13 par la création automatique d'un nouveau répertoire `.angular/cache` à la racine du projet.

Ce répertoire **peut contenir des 100 aines de fichiers** (cas d'une migration d'une appli en version &lt; 12 par exemple).

Le **point de vigilance à avoir** par rapport à ça est, que par défaut ce répertoire n'est pas ajouté au `.gitignore` et que par conséquent lors du premier push vous risquez de balancer son contenu dans le git.

Ce qui aura le même effet que pousser le répertoire node\_modules.

Donc **N'OUBLIEZ PAS** de vérifier votre .gitignore et y ajouter la ligne suivante si besoin

*.gitignore*

```
/.angular/cache

```

[Back to top](#nouveautés)  

</details>
    
# AnalogJS

<details>
	<summary>Le nouveau meta-framework</summary>

Maintenant que le marché des framework JS commence à saturer, la guerre se joue à présent sur les Meta-Framework ! Et dans le domaine, Angular était le dernier à ne pas en avoir un ! Et bien c'est maintenant chose faite avec **AnalogJS.**

Pour faire simple, **AnalogJS** est à Angular ce que *NextJS* est à React et ce que *NuxtJS* est à Vue. Il s'agit donc d'un **meta-framework fullstack** proposant les features suivantes :

- propulsé par ViteJS (concurrent de webpack beaucoup plus rapide, ça c'est cool !)
- routing basé sur l'arborescence fichier (à chacun de se faire un avis mais perso je trouve ça horrible !)
- support contenu markdown pour les routes et fichiers de contenu
- support API / routes serveur
- support SSR/SSG hybride (c'est la norme maintenant)
- support CLI/Nx
- support Angular components avec Astro (très prometteur en terme de perf)

\*\*Côté requirements : \*\*

- Node v16+
- Angular 15+

La doc par ici : [https://analogjs.org/docs](https://analogjs.org/docs)

Extrait Vite Conf 2022 (17min) [https://www.youtube.com/watch?v=IlUssKC3Mt4&amp;ab\_channel=ViteConf](https://www.youtube.com/watch?v=IlUssKC3Mt4&ab_channel=ViteConf)

[Back to top](#nouveautés)   
 
</details>


# Dépréciations

## @angular/flex-layout

La librairie **@angular/flex-layout** qui a toujours été en version béta depuis Angular V5, va être dépréciée car détrônée par les directive **css flex-layout et flex-grid**. Cette lib aura donc ça dernière release dans Angular v15 et après ça il faudra lui dire au revoir
