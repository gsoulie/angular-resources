[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Bonnes pratiques et NR

* [Généralités](#généralités)      
* [Input ou Service ?](#input-ou-service-?)      
* [Workflow complet](#workflow-complet)      
* [Model Adapter Pattern](#model-adapter-pattern)     
* [Blocs conditionnels](#blocs-conditionnels)        
* [Pipe](#pipe)      
* [Numérique Responsable](https://github.com/gsoulie/angular-resources/blob/master/ng-nr.md)      
* [Unsubscriber](#unsubscriber)     
* [Optimisations](https://github.com/gsoulie/angular-resources/blob/master/ng-optimization.md)
* [Check list](#check-list)     


## Généralités 

### limiter l'utilisation de ````else````      

**utilisation du early return**       
````typescript
if (condition) {
	return xxxx
}
// reste du code
````
	
**utilisation de l'initialisation en amont**           
````typescript
let variable = '/home';
if (condition) {
	variable = '/error';
}
return variable;
````

### utilisation du principe de fail fast       
* tester en priorité les cas d'erreur avec return        

### single responsability

### typage fort

## Input ou Service ?

Passer des données à un composant peut se faire de plusieurs manières. Les plus courantes sont le passage via *@Input / @Ouput* ou via un service.

Pour connaître la meilleur solution à adopter, il est recommandé de préférer l'utilisation d'un service dans le cas d'un composant "parent" c'est à dire un composant qui contient des "enfants". Et utiliser les *@Input() / @Output()* dans le cas d'un composant "enfant".

De cette façon on évite d'avoir des chaînes interminables de *@Input() / @Output()* qui transportent des paramètres d'un bout à l'autre de la chaîne.

## Workflow complet

Workflow complet TDD, Dev, PR, Ci/CD

https://eliteionic.com/tutorials/simple-project-management-workflow-for-ionic-developers/        
https://www.youtube.com/watch?v=CdsJrIpGWSg&ab_channel=JoshuaMorony


## Model Adapter Pattern

Utiliser au maximum la technique du [adapter pattern](https://github.com/gsoulie/angular-resources/blob/master/ng-adapter-pattern.md) pour gagner en maintenabilité

## Blocs conditionnels

Il est bien d'encadrer les blocs conditionnels *ngIf* avec des **ng-content**

````
<ng-container *ngIf="requestLoading">
     <app-loading></app-loading>
</ng-container>

<ng-container *ngIf="!requestLoading">
     <button type="submit" *ngIf="!isEdit" [disabled]="!formTicket.valid" (click)="create()">Créer</button>
     <button type="submit" *ngIf="isEdit" [disabled]="!formTicket.valid" (click)="edit()">Editer</button>
</ng-container>
````

## Pipe
[Back to top](#bonnes-pratiques-et-nr)     

Tout traitement qui modifie la vue doit préférablement utiliser les pipes plutôt qu'une méthode. Les pipes sont très optimisés et offrent un gain de performance énorme.

## Unsubscriber

<img src="https://img.shields.io/badge/New-Angular16-DD0031.svg?logo=LOGO"> Il est recommandé depuis Angular 16, de réaliser la souscription manuelle via la classe ````DestroyRef```` comme ceci :

````typescript
 constructor() {
    inject(DestroyRef).onDestroy(() => {
      // observable unsubscriptions etc...
    })
  }
````

Il est néanmoins toujours possible d'tiliser un service "Unsubscriber" permettant de gérer les désabonnements aux observables via un service générique qui sera étendu par tous les composants 

*unsubscriber.service.ts*

````typescript
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Unsubscriber implements OnDestroy {

  private subscription$: Subscription = new Subscription();
  constructor() {}

  set anotherSubscription(sub: Subscription) {
    this.subscription$.add(sub);
  }

  ngOnDestroy(): void {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

  addSubscription(sub: Subscription): void {
    this.subscription$.add(sub);
  }

  protected resetSubscriptions() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }
}
````

Appel depuis un composant :

````typescript
export class ControlsPage extends Unsubscriber implements OnInit {

 liste1: number[];
 liste2: string[];
  
 ngOnInit() {
    this.anotherSubscription = of([1, 2, 3]).subscribe(res => this.liste1 = res);
    this.addSubscription(of(['toto', 'tata', 'titi']).subscribe(res => this.liste2 = res));
  }
  
}
````

**I M P O R T A N T** : Il ne faut surtout pas implémenter la fonction *ngOnDestroy()* dans le composant, sinon celle-ci prendra l'ascendant sur celle du service *unsubscriber* qui ne sera pas joué

[Back to top](#bonnes-pratiques-et-nr)

## Check list

<details>
	<summary>Liste de bonnes pratiques</summary>


`25/05/2023`

## Quelques bonnes pratiques générales

- Utiliser / migrer la dernière version d'Angular (actuellement Passer en v17 et utiliser les nouvelles fonctionnalités (nouvelle syntaxe control flow, standalone component, defer ...)
- Utiliser autant que possible le concept **Signal** pour les variables qui sont utilisées côté template, les inputs de composants...
- Depuis Angular 16, utiliser les composants en mode **standalone**
- Maintenir à jour son CLI / RxJS
- Respecter le principe de **responsabilité unique** pour chaque fonction, service, composant
- Développer des fonctions / composants les plus unitaires possibles (pas de code de 200 lignes).
- Utilisation d'un **interceptor http** pour gérer les entête de requête (ajout de bearer token) / codes erreurs / retry...
- Depuis Angular 13, vérifier que le répertoire **.angular/cache** est bien ajouté au fichier *.gitignore* `/.angular/cache`
- Auditer chaque page de l'application via **lighthouse** depuis la console chrome. **Attention !** l'audit de *performance* ne sera cohérent que s'il est réalisé sur le projet compilé et hosté en local ou sur un serveur. L'audit d'accessibilité, lui, peut-être directement réalisé en mode *serve* classique
- Lazy load des composants dans le fichier routing : `loadComponent: () => import('./tabs/tabs.component').then(m => m.TabsPageComponent)` et ne pas importer les modules lazy-loadé dans les fichiers *app.module.ts* car ils **seraient alors chargés 2 fois !**
- Utiliser les blocs ````@defer()```` afin de lazy-loader les composants
- Utilisation du package **a11y** pour gérer l'accessibilité
- Supprimer les effets d'animation de transition des pages inutiles
- Utilisation de fonts standard et privilégier le format de font **WOFF2**
- Faire la chasse au fonts non utilisées
- Utiliser l'attribut `font-display: swap` dans les `@font-face` permet l'affichage d'un élément avec une font de substitution si la font initialement demandée n'est pas encore chargée
- Rendu à la demande avec Angular Universal => Devenu SSR depuis Angular v17
- Utilisation du Virtual scroll
- Utiliser en priorité les **pipes** dans la vue lorsqu'il s'agit de mettre en forme du contenu plutôt que de passer par des fonctions
- **Sé désabonner systématiquement** de chaque souscription manuelle à un observable ou à minima implémenter sa fonction **complete()** qui termine les abonnements
- Gestion du `onDestroy` pour libérer les souscriptions des observables via l'injection de **DestroyRef** (Depuis Angular 16):

```typescript
constructor(private dataService: DataService) {
    this.data$ = this.dataService.fetchData();
    this.sub = this.data$.subscribe((res: any) => this.data = res);

    inject(DestroyRef).onDestroy(() => {
      this.sub.unsubscribe();
    })
  }

```
- Renforcement de la sécurité CSP (voir news angular 19) : activation en mode preview
*angular.json*
````
{
  "security": {
    "autoCSP": true
  }
}
````
- Activation de la suppression automatique des imports inutilisés :
*angular.json*
````
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
- Utiliser au maximum les pipe `async` pour gérer automatiquement la souscription/désabonnement des observables depuis le template
- Utiliser le `pipe(take(1))` sur les Observables ou les convertir en promise lorsqu'un observable n'est pas nécessaire (ex: réponse unique attendue, pas de gestion de flux...)
- Utiliser des images JPEG (compressées avec TinyPNG par ex...) et SVG
- Utiliser la propriété `loading="lazy"` dans les balises images ou la directive **NgOptimizedImage** depuis Angular **v15**
- Configurer les app Angular comme des PWA : `ng add @angular/pwa && ng build — prod`. Et configurer le service worker pour mettre certaines ressources en cache (assets/fonts)
- Limiter le nombre de module tiers utilisés. Utiliser autant que possible ce qui est faisable directement en JS ou Angular, idem pour les composants graphiques, ce qui peut être fait en css pur est à privilégier.
- Supprimer tous les `console.log` avant de mettre en prod =&gt; peut causer des memory leak =&gt; ajouter le code suivant dans le fichier **main.ts** pour faire simple :

```typescript
if (environment.production) {
 window.console.log = () => {};
}

```

### Bonne pratique refactoring behaviourSubject -> Signal

[![](https://github.com/gsoulie/angular-resources/blob/master/image-1724688936040.png)

### Bonnes pratiques Typescript

- Typer toutes les variables, retours de fonction, paramètres etc...
- **Proscrire** le type ````any````. Si le type est inconnu, préférer le type ````unknown````
- Utiliser le principe de **early return**: consiste à retourner les cas de retour négatifs le plus rapidement possible pour sortir de la fonction le plus rapidement :

```typescript
function lessConfusingFonction(String name, int value, AuthenticationInfo perms) {
    if (!globalCondition) {
        return BAD_COND;
    }
    if (name == null || name.equals("")) {
        return BAD_NAME;
    }
    if (value == 0) {
        return BAD_VALUE;
    }
    if (!perms.allow(name)) {
        return DENY;
    }
    
    return SUCCESS;
}

```

- Utiliser des verbes pour les noms de fonctions getUser, setNotification, sendMessage...
- Éviter l'utilisation des ````enum````. en TS, les enums sont moins intéressants que dans d'autres langages. Ils n'apportent pas grand chose et alourdissent le code dans le bundle. D'autre part, on ne peut
pas itérer dessus. Il est donc **recommandé d'utiliser les types et union de types**
- Simplifier les chemins d'importation :

````typescript
import { Function } from '../../../../../shared/functions.service'
````

en configurant les paths dans le fichier *tsconfig.json*

````typescript
...
"paths": {
	"@shared/*": ["shared/*"]
}
````

Va permettre d'importer de la manière suivante

````typescript
import { Function } from '@shared/functions.service'
````

## Appels asynchrones

Voici une des meilleures façon de coder les appels asynchrones 

````typescript
getAllData = async () => {
	try {
		const res = await fetch(url);
		const reponse = await res.json();
		
		// some stuff 

		
	} catch(err) {
        console.error(err)
        
        throw new Error(<object-or-string>)

        // log serveur...

        // toast message...        
	}
}
````
 
</details>

