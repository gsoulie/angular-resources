[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Nouveautés

* [ng-conf 2023](#ng--conf-2023)     
* [v16](#v16)    
* [v15](#v15)     
* [v14](#v14)
* [AnalogJS](#analogjs)
* [Dépréciations](#dépréciations)

# v16

## Résumé des principales nouveautés

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

`07/04/2023`

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

### Comment migrer vers la nouvelle API ?

Si nous avons un composant qui utilise le service **ActivatedRoute**, nous pouvons le migrer vers la nouvelle API en effectuant les étapes suivantes :

- Supprimer le service **ActivatedRoute** du constructeur du composant.
- Ajouter le décorateur **@Input()** aux propriétés que nous voulons lier aux informations de route.
- Activer la fonctionnalité **bindToComponentInputs** dans le **RouterModule** ou la fonction **provideRouter**.

En résumé, avec la nouvelle fonctionnalité d'Angular v16, la récupération des informations de la route dans un composant sera beaucoup plus simple. Nous pourrons passer directement les informations de la route aux inputs du composant, ce qui évitera d'avoir à manipuler des observables et à injecter le service ActivatedRoute.

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

# v15

`13/03/2023`

## Suppression des fichiers environment.ts

Avec l'arrivée d'Angular 15 et son lot de nouveautés qui ont fait le buzz, **une fonctionnalité a été retirée** car jugée *non éssentielle*.

Passée jusque là sous les radars, cela a finalement alimenté de nombreux débats qui ont amenés l'équipe d'Angular à faire marche arrière et à réintroduire la-dite fonctionnalité (de manière optionnelle) dans la version **v15.1**

Il s'agit de **l'utilisation de fichiers d'environnement** par défaut (*environment.ts* et *environment.prod.ts*). Ces fichiers étaient notamment utilisés pour modifier l'état du flag **enableProdMode** dans le fichier *main.ts* à la compilation.

L'équipe Angular a donc simplifié la gestion de ce flag et en a profité pour **supprimer la gestion des environnement** via les fichiers *environment.ts*, argumentant que la plus part des développeurs configuraient leurs environnements de différentes autres manières (pipelines CI/CD, dockers etc...) et que beaucoup utilisaient une configuration basée sur le runtime (plus évolutive, plus flexible) plutôt que sur la compilation.

> **A retenir** : Désomais, lors de la création d'un projet Angular 15, les fichiers *environment.ts* ne sont plus créés par défaut. Il reste néanmoins possible de les générer avec la commande `ng generate environments` depuis angular **v15.1** ou bien de recréer la structure manuellement [voir la documentation](https://angular.io/guide/build#configure-environment-specific-defaults)

[Article complémentaire](https://dev.to/this-is-angular/angular-15-what-happened-to-environmentts-koh)

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

### Refactorisation des Composants Material Design

Une refactorisation complète des composants basés sur Material Design a été opérée dans le but d'adopter Material 3 et ainsi mettre à jour les styles et structure DOM des composants.

![](https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO) Après migration vers la v15, il est possible que certains styles de votre application doivent être ajustés, en particulier si votre CSS surcharge les styles des éléments internes de l'un des composants migrés.

Se référer au guide de migration pour plus de détails : [https://github.com/angular/components/blob/main/guides/v15-mdc-migration.md#how-to-migrate](https://github.com/angular/components/blob/main/guides/v15-mdc-migration.md#how-to-migrate)

### Migration vers la v15

![](https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO) le passage à la v15 implique une potentielle **mise à jour de NodeJS** vers l'une des versions suivantes : 14.20.x, 16.13.x and 18.10.x

[Back to top](#nouveautés)    

# ng-conf 2023

## Quelques annonces faites lors de la ng-conf 2023

Les 14 et 15 juin 2023 avaient lieu la **ng-conf 2023**, l'occasion de présenter les nouveautés apportées par Angular 16, mais aussi de parler du futur. 

A cette occasion quelques infos intéressantes ont été annoncées, en voici quelques unes

> **Disclaimer** : Ces "nouveautés" ne sont pour l'heure par en version finale, il convient donc de rester prudent sur leur adoption pour le moment. Vous pouvez consulter les RFC ici [RFC Control flow](https://github.com/angular/angular/discussions/50719) et [RFC defer loading](https://github.com/angular/angular/discussions/50716)

### Nouvelle API pour le control flow (*ngIf, *ngFor, ngSwitch)

La façon de gérer le contrôle de l’affichage des parties d’un template va changer ! Comparons tout cela.

#### Syntaxe actuelle

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

#### Nouvelle syntaxe

````html
{#if someCondition}
 someCondition is true
{:else}
  someCondition is false
{/if}
````
````html
{#for product of products; track product.id}
  <div>{{ product.name }}</div>
{:empty}
  <p>No products available.</p>
{/for}
````

> On note l'apparition de ````{:empty}```` qui est très intéressante pour les boucles for
````html
{#switch role}
  {:case 'director'}
    <p>You are a director</p>
  {:case 'teacher'}
    <p>You are a teacher</p>
  {:case 'student'}
    <p>You are a student</p>
  {:default}
    <p>You are a student</p>
{/switch}
````

Nous passons donc à un **Control Flow par bloc**, tout cela a été mis en place **pour plusieurs raisons** :

* Se rapprocher davantage d’une syntaxe JS classique
* Réduire la complexité avec les <ng-template />
* Permettre une adoption des applications *zoneless* plus simple

Pour le dernier point cité, pour **rappel** : Aujourd’hui les applications Angular reposent sur **zone.js** pour gérer leurs détection de changement, dans un avenir très proche cette librairie externe **ne sera plus nécessaire grâce à Signal**.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO">

* **A terme, les directives actuelles vont être dépréciées** !
* La fonction *trackBy* de ````{:for}```` va devenir **obligatoire**

### defer

Autre grande nouveauté annoncée, l'apparition d'un mot clé **````defer````**

L’idée est d’apporter une façon **agréable** et **facile** de **gérer le chargement** des différentes parties de nos pages. Actuellement le lazy loading nous permet de retarder le chargement du code JS d’une route via ````loadComponent()```` ou ````loadChildren()```` directement dans nos fichiers de routing.

L'arrivée de **````defer````** va permettre **de différer le chargement de parties distinctes des pages** (typiquement les composants utilisés dans nos pages).

**Il s’agit donc d’optimisation de performance.**

*Exemple*
````html
<p>some content</p>

<my-list />

{#defer when someCondition}
  <some-component />
{/defer}
````

Tout ce qui sera se trouvera à l’intérieur du bloc ````{#defer}...{/defer}```` sera lazy loadé de manière asynchrone, c’est à dire après que tout le reste soit chargé.

Afin de rendre ce chargement conditionnel, plusieurs mots clés associés à defer sont disponibles 

* le mot-clé **````when````** qui permet une gestion impérative du bloc. Il suffit simplement de renseigner une expression qui retourne un booléen.
  
* le mot-clé **````on````** qui permet une gestion plus déclarative. Il suffit de spécifier un évènement dont voici quelques exemples :

````html
  // Si le user passe sa souris par dessus le bloc
{#defer on hover}
  <some-component />
{/defer}

// Si le user clique sur le composant ou lors d'évènements claviers notamment
{#defer on interaction}
  <some-component />
{/defer}

// après n millisecondes 
{#defer on timer(500)}
  <some-component />
{/defer}

// lorsque le bloc entre dans le viewport 
{#defer on viewport}
  <some-component />
{/defer}
````

**Par défaut, les blocs defer n’affichent rien** lorsqu’ils ne sont pas déclenchés. Mais il est possible de spécifier un contenu qui s’affiche avant que les blocs ne soient eux-mêmes chargés :

````html
{#defer on viewport}
  <some-component />
{:loading}
  <div class="loading">Loading the component...</div>
{/defer}

<!-- autre exemple -->

{#defer on viewport}
  <some-component />
{:placeholder minimum 500ms}
  <img src="placeholder.png" />
{/defer}
````

Il est aussi possible de faire une gestion des erreurs :

````html
{#defer when someCondition}
  <some-component />
{:error}
  <p> Failed to load</p>
  <p><strong>Error:</strong> {{$error.message}}</p>
{/defer}
````
