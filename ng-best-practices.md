[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Bonnes pratiques et NR

* [Clean code](#clean-code)    
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

## Clean code

<details>
	<summary>Le Clean Code est une approche de développement logiciel qui vise à rendre le code plus lisible, maintenable et évolutif. En adoptant les principes du Clean Code, nous pouvons améliorer la qualité de nos livrables, réduire les bugs et faciliter l'intégration de nouvelles ressources dans le projet. Ce document présente de manière synthétique et concrète les principes SOLID, KISS et DRY, accompagnés d'exemples et d'images pour faciliter leur mémorisation.</summary>


### Objectifs du Clean Code

- **Réduire la complexité** : Un code simple est plus facile à comprendre et à maintenir.
- **Augmenter la qualité** : Un code propre est moins sujet aux bugs et aux erreurs.
- **Faciliter l'évolution** : Un code bien structuré est plus facile à modifier et à étendre.
- **Améliorer la maintenance** : Un code lisible permet de corriger rapidement les problèmes.
- **Intégrer de nouvelles ressources** : Un code clair facilite l'intégration de nouveaux développeurs.

### Soyez acteur de la qualité

Il est crucial de ne pas hésiter à corriger et refactoriser le code, même si ce n'est pas nous qui l'avons écrit initialement. Chaque membre de l'équipe doit contribuer à maintenir un haut niveau de qualité.

---

## Principes SOLID

Les principes **SOLID** sont des concepts fondamentaux en développement logiciel qui visent à améliorer la qualité et la maintenabilité du code.

> [Principes SOLID implémentés dans Angular](https://dev.to/syncfusion/solid-principles-in-angular-1i)     

### 1. Single Responsibility Principle (SRP)

**Concept** : Une classe / composant / fonction, doit avoir une, et une seule, raison de changer, une seule responsabilité.

**Exemple concret** :
Imaginez une classe `Voiture` qui gère à la fois la conduite et la gestion des passagers. Si vous devez modifier la manière dont les passagers sont gérés, vous risquez de casser la logique de conduite.

**Image** :

*Un couteau suisse avec une seule lame. Chaque outil (lame) a une seule fonction.*

**Exemple détaillé**
Dans cet exemple, la classe ````UserManager```` gère à la fois l'authentification et l'envoi de notifications, ce qui viole le principe SRP. Nous allons séparer ces responsabilités en deux classes distinctes.

<details>
  <summary>Code de l'exemple</summary>

````typescript
class UserManager {
    authenticate(username: string, password: string): boolean {
        // Logique d'authentification
        return true;
    }

    sendEmail(user: string, message: string): void {
        // Logique d'envoi d'email
        console.log(`Sending email to ${user}: ${message}`);
    }
}

>>>>> Refactorisé de la manière suivante :

class AuthenticationManager {
    authenticate(username: string, password: string): boolean {
        // Logique d'authentification
        return true;
    }
}

class NotificationManager {
    sendEmail(user: string, message: string): void {
        // Logique d'envoi d'email
        console.log(`Sending email to ${user}: ${message}`);
    }
}


````  
</details>



**Conclusion** : En séparant les responsabilités, vous rendez le code plus modulaire et facile à maintenir.

### 2. Open/Closed Principle (OCP)

**Concept** : Les entités logicielles doivent être ouvertes pour extension, mais fermées pour modification.

**Exemple concret** :
Si vous avez une classe `Calculatrice` qui effectue des opérations mathématiques de base, vous devriez pouvoir ajouter de nouvelles opérations (comme la racine carrée) sans modifier le code existant.

**Image** :
*Un livre où vous pouvez ajouter des pages (extensions) sans réécrire les pages existantes.*

**Exemple détaillé**

Dans cet exemple, la classe ````ReportGenerator```` doit être modifiée chaque fois qu'un nouveau format de rapport est ajouté. Nous allons utiliser une interface pour permettre l'ajout de nouveaux formats sans modifier la classe existante.

<details>
  <summary>Code de l'exemple</summary>

````typescript
class ReportGenerator {
    generatePDF(data: any): void {
        // Logique de génération de PDF
        console.log("Generating PDF report");
    }

    // Si vous devez ajouter un nouveau format, vous devez modifier cette classe
    generateExcel(data: any): void {
        // Logique de génération d'Excel
        console.log("Generating Excel report");
    }
}

>>>> Refactorisé de la manière suivante

interface ReportFormat {
    generate(data: any): void;
}

class PDFReport implements ReportFormat {
    generate(data: any): void {
        // Logique de génération de PDF
        console.log("Generating PDF report");
    }
}

class ExcelReport implements ReportFormat {
    generate(data: any): void {
        // Logique de génération d'Excel
        console.log("Generating Excel report");
    }
}

class ReportGenerator {
    constructor(private reportFormat: ReportFormat) {}

    generateReport(data: any): void {
        this.reportFormat.generate(data);
    }
}
````
  
</details>

**Conclusion** : Ce principe permet d'ajouter de nouvelles fonctionnalités sans risquer de casser le code existant.

### 3. Liskov Substitution Principle (LSP)

**Concept** : Les objets d'une classe dérivée doivent pouvoir remplacer les objets de la classe de base sans altérer le fonctionnement du programme.

**Exemple concret** :
Si vous avez une classe `Oiseau` et une classe dérivée `Pingouin`, vous ne devriez pas supposer que tous les oiseaux peuvent voler, car un pingouin ne peut pas voler.

**Image** :
*Un puzzle où chaque pièce (classe dérivée) s'emboîte parfaitement dans l'emplacement prévu (classe de base).*

**Exemple détaillé**

Dans cet exemple, la classe ````Penguin```` hérite de ````Bird```` mais ne peut pas voler, ce qui viole le principe LSP. Nous allons utiliser une interface ````Flyable```` pour les oiseaux qui peuvent voler.

<details>
  <summary>Code de l'exemple</summary>

````typescript
class Bird {
    fly(): void {
        console.log("Bird is flying");
    }
}

class Penguin extends Bird {
    fly(): void {
        throw new Error("Penguins can't fly!");
    }
}

>>>> Refactorisé de la manière suivante 

interface Flyable {
    fly(): void;
}

class Bird {}

class Sparrow extends Bird implements Flyable {
    fly(): void {
        console.log("Sparrow is flying");
    }
}

class Penguin extends Bird {}

````
  
</details>

**Conclusion** : Respecter ce principe garantit que les classes dérivées peuvent être utilisées de manière interchangeable avec leurs classes de base.

### 4. Interface Segregation Principle (ISP)

**Concept** : Il vaut mieux avoir plusieurs interfaces spécifiques que de forcer les clients à implémenter une interface générale.

**Exemple concret** :
Au lieu d'avoir une interface `Animal` avec des méthodes `voler()`, `nager()`, et `courir()`, vous devriez avoir des interfaces séparées comme `Volant`, `Nageant`, et `Courant`.

**Image** :
*Un menu de restaurant où chaque section (interfaces) est clairement définie (entrées, plats principaux, desserts).*

**Exemple détaillé**

Dans cet exemple, l'interface ````Worker```` force toutes les classes à implémenter des méthodes qu'elles n'utilisent pas nécessairement. Nous allons séparer les interfaces en ````Workable, Eatable````, et ````Sleepable````

<details>
  <summary>Code de l'exemple</summary>

````typescript
interface Worker {
    work(): void;
    eat(): void;
    sleep(): void;
}

class Human implements Worker {
    work(): void {
        console.log("Human is working");
    }

    eat(): void {
        console.log("Human is eating");
    }

    sleep(): void {
        console.log("Human is sleeping");
    }
}

class Robot implements Worker {
    work(): void {
        console.log("Robot is working");
    }

    eat(): void {
        throw new Error("Robots can't eat!");
    }

    sleep(): void {
        throw new Error("Robots can't sleep!");
    }
}

>>>> Refactorisé de la manière suivante

interface Workable {
    work(): void;
}

interface Eatable {
    eat(): void;
}

interface Sleepable {
    sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
    work(): void {
        console.log("Human is working");
    }

    eat(): void {
        console.log("Human is eating");
    }

    sleep(): void {
        console.log("Human is sleeping");
    }
}

class Robot implements Workable {
    work(): void {
        console.log("Robot is working");
    }
}

````
  
</details>

**Conclusion** : Ce principe permet de créer des interfaces plus spécifiques et donc plus faciles à implémenter.

### 5. Dependency Inversion Principle (DIP)

**Concept** : Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau, mais des abstractions.

**Exemple concret** :
Au lieu de faire dépendre une classe ````PaymentProcessor```` directement d'une classe ````PayPalService````, elle devrait dépendre d'une interface ````IPaymentService````.

**Image** :
*Une prise électrique où vous pouvez brancher différents appareils (abstractions) sans vous soucier de leur fonctionnement interne (modules de bas niveau).*

**Exemple détaillé**

Dans cet exemple, la classe ````OrderProcessor```` dépend directement de ````EmailService````, ce qui rend difficile le changement du service d'envoi d'emails. Nous allons utiliser une interface ````NotificationService```` pour inverser la dépendance.

<details>
  <summary>Code de l 'exemple</summary>

````typescript
class EmailService {
    send(to: string, message: string): void {
        console.log(`Sending email to ${to}: ${message}`);
    }
}

class OrderProcessor {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    processOrder(orderId: string): void {
        // Logique pour traiter la commande
        this.emailService.send("customer@example.com", "Your order has been processed.");
    }
}

>>>> Refactorisé de la manière suivante

interface NotificationService {
    send(to: string, message: string): void;
}

class EmailService implements NotificationService {
    send(to: string, message: string): void {
        console.log(`Sending email to ${to}: ${message}`);
    }
}

class SMSNotificationService implements NotificationService {
    send(to: string, message: string): void {
        console.log(`Sending SMS to ${to}: ${message}`);
    }
}

class OrderProcessor {
    constructor(private notificationService: NotificationService) {}

    processOrder(orderId: string): void {
        // Logique pour traiter la commande
        this.notificationService.send("customer@example.com", "Your order has been processed.");
    }
}

// Utilisation avec EmailService
const emailService = new EmailService();
const orderProcessorWithEmail = new OrderProcessor(emailService);
orderProcessorWithEmail.processOrder("12345");

// Utilisation avec SMSNotificationService
const smsService = new SMSNotificationService();
const orderProcessorWithSMS = new OrderProcessor(smsService);
orderProcessorWithSMS.processOrder("12345");
````
  
</details>

**Conclusion** : Ce principe réduit les dépendances entre les modules, facilitant ainsi les modifications et les extensions.

---

## Principe KISS : Keep It Simple, Stupid

**Concept** : Les systèmes fonctionnent mieux lorsqu'ils sont simples plutôt que complexes. La simplicité doit être un objectif clé du design.

**Exemple concret** :
Imaginez que vous devez créer une fonction pour additionner deux nombres. Une approche complexe pourrait impliquer des vérifications inutiles et des optimisations prématurées. Une approche simple serait de simplement écrire `return a + b;`.

**Image** :
*Un crayon à papier. Il est simple, efficace et fait exactement ce pour quoi il est conçu.*

**Exemple détaillé**

<details>
  <summary>Code de l'exemple</summary>

````typescript
function isValidEmail(email: string): boolean {
    if (!email) return false;
    const atIndex = email.indexOf('@');
    if (atIndex < 1) return false;
    const dotIndex = email.indexOf('.', atIndex);
    if (dotIndex < atIndex + 2) return false;
    if (dotIndex === email.length - 1) return false;
    return true;
}

>>>> Refactorisé de la manière suivante

function isValidEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return pattern.test(email);
}

````

</details>

**Conseils pour appliquer KISS** :
- Évitez les optimisations prématurées.
- Écrivez du code lisible et compréhensible.
- Réduisez la complexité en divisant les problèmes en sous-problèmes plus simples.

---

## Principe DRY (Don't Repeat Yourself)

**Concept** : Chaque morceau de code doit avoir une seule représentation, unitaire, autoritaire et définitive dans le système.

**Exemple concret** :
Si vous avez une fonction qui calcule la TVA dans plusieurs endroits de votre code, vous devriez extraire cette logique dans une fonction unique et l'appeler partout où c'est nécessaire.

**Image** :
*Un livre de recettes où chaque recette est écrite une seule fois. Si vous avez besoin de la recette, vous allez à la page correspondante au lieu de la réécrire.*

**Conseils pour appliquer DRY** :
- Utilisez des fonctions et des méthodes pour encapsuler la logique répétitive.
- Utilisez des constantes pour les valeurs répétées.
- Refactorisez le code pour éliminer les duplications.

## Pour aller plus loin

[Pour approfondir le sujet, voici une vidéo d'une heure sur les principes du clean code](https://www.youtube.com/watch?v=VioMQpZMtnA&ab_channel=JulienLucas)

 
</details>

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

