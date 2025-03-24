[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Tests unitaires

* [Tester le bundle généré dans le répertoire dist](#tester-le-bundle-généré-dans-le-répertoire-dist)         
* [Tests unitaires et e2e tests](#tests-unitaires-et-e2e-tests)     
* [Tests unitaires](#tests-unitaires)     
* [e2e avec Cypress](#e2e-avec-cypress)     
* [Karma (déprécié depuis Angular 16)]()
* [Tests unitaires avec Jest](#tests-unitaires-avec-jest)
* [Playwright](#playwright)     

## Tester le bundle généré dans le répertoire dist

### solution 1 : 

````
npm i -g serve

// compiler le projet
ng build --prod

cd dist/<project_name>
serve -s
````

Il suffit ensuite de se rendre à l'url proposée pour voir l'application

### solution 2 :

````
npm install -g http-server

// compiler le projet
ng build --prod

cd dist/<project_name>
http-server
````

Ou jouer la commande ````http-server .\dist````

Il suffit ensuite d'ouvrir l'url *http://127.0.0.1:8080*

[Back to top](#tests-unitaires)

## Tests unitaires et e2e tests

Tout d'abord il faut bien différencier les **Tests unitaires** des **End-to-end tests**. Ils n'ont pas les mêmes objectifs et sont complémentaires

### Tests unitaires

Les tests unitaires ont pour objectif de garantir que les les fonctionnalités individuelles de vos composants, services et autres entités
fonctionnent correctement.

Pour réaliser les TU, Angular s'appuie sur le framework **Jasmine** qui permet d'écrire les tests, et sur **Karma** qui est le *task runner*.
Ce dernier utilise un fichier de configuration permettant de définir le framework de test utilisé (ici : Jasmine), le fichier de démarrage, le navigateur etc...

Pour lancer les tests il suffit d'exécuter la commande ````ng test````

**TestBed** : Outil de test unitaire fourni par Angular

### End-to-end tests 

Les e2e tests sont différents des TU dans le sens ou leur but est de simuler l'interaction d'un utilisateur avec l'application. Angular 
compile et exécute l'application en utilisant cypress / protractor pour jouer les tests.
Les tests e2e s'appuient sur cela en s'assurant que l'interaction de l'utilisateur avec ces composants et services se comporte comme il se doit.

Initialement, Angular utilise **protractor**, mais ce dernier sera déprécié courant 2022, c'est pourquoi il est préférable d'utiliser un autre framework comme
par exemple **cypress** qui est déjà supporté par Angular / Ionic. 

[protractor deprecation roadmap](https://github.com/angular/protractor/issues/5502)       


## Tests unitaires

[Documentation officielle](https://angular.io/guide/testing)     

### Configuration

Activer la visualisation du *codeCoverage* permet d'avoir accès à une synthèse de la couverture du code par les tests générée dans le répertoire *coverage/ngv/index.html*
lors de l'exécution des tests avec ````ng test````

*angular.json*

````typescript
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
		// Some default options here
	],
	"codeCoverage": true	// <- à ajouter pour avoir plus d'infos dans la console
  },
````

### Création des tests

[exemples de tests de services et d'un composant](https://github.com/gsoulie/ionic-angular-snippets/tree/master/unit-testing)      

<img src="https://img.shields.io/badge/Attention-DD0031.svg?logo=LOGO">

Injecter les services réels ne fonctionne pas tout le temps bien car la plupart des services dépendants sont difficiles à créer et contrôler. Il est donc **préférable** de simuler les dépendances et d'utiliser des données de test **ou** créer un **spy** sur la/les méthode(s) à tester.
**Les spies sont la meilleure solution pour simuler les services**

[Back to top](#tests-unitaires)


### Injection service

````typescript
// Injection globale
beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTestComponent ],
      providers: [
        {
          provide: UnitTestService  // injecter le service utilisé dans le composant
        }
      ]
    })
    .compileComponents();

    unitTestService = TestBed.inject(UnitTestService);
	
    fixture = TestBed.createComponent(UnitTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('inject service', () => {
	// Injection locale
	let myService = TestBed.inject(MyDataService);
	fixture.detectChanges();	// important
	
	expect(myService.username).toEqual(component.username);
}
````
[Back to top](#tests-unitaires)

### fixture

L'objet fixture sert principalement au test des éléments en rapports avec le DOM.

````typescript
it('testing html element', () => {
    const data = fixture.nativeElement;
    expect(data.querySelector('.someClass').textContent).toContain('Hello')
})
````

### Service avec observable et async

*data.service.ts*
````typescript
fetchPosts(): Observable<IPost[]> {
return this.http.get<IPost[]>('https://jsonplaceholder.typicode.com/posts')
  .pipe(
	shareReplay(),	// transformer de Cold vers Hot pour ne pas faire plusieurs appels
	tap(res => this.posts$.next(res))
  );
}
````

*home.component.spec.ts*
````typescript
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [HomeComponent],
      providers: [{
        provide: DataService
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    fixture.detectChanges();
  });


  it('should load 100 posts', waitForAsync(() => {	// waitForAsync remplace async
    dataService.fetchPosts()
      .subscribe(res => {
        expect(res).toHaveSize(100);
      });
  }))
});
````
[Back to top](#tests-unitaires)

### Tester un pipe

````typescript
describe('ReversePipe', () => {
  let pipe: ReversePipe;

  beforeAll(async () => { pipe = new ReversePipe(); });

  it('create an instance', () => { expect(pipe).toBeTruthy(); });

  it('should revert string', () => {
    expect(pipe.transform('guillaume')).toEqual('emualliug');
  })
});
````

## e2e avec Cypress

<details>
	<summary>Tests fonctionnels</summary>

````
ng add @briebug/cypress-schematic
npm install --legacy-peer-deps
npm run e2e
````

s'assurer que dans le fichier *cypress.json*, la *baseUrl* soit la même que celle sur laquelle l'application ionic / angular est lancée

### Structure des tests

Les tests cypress sont définis dans le répertoire **integration**. Il est possible de créer sa propre arborescence à l'intérieur.

### Exemple de test

````typescript
import { menuRoutes } from './../../src/app/shared/config/routes.config';

describe('Default', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('default route is welcome', () => {
    cy.url().should('includes', 'welcome'); // s'assurer que la route par défaut passe par '/welcome'
  });

  it('has title in mat-toolbar', () => {
    cy.get('mat-toolbar span');
    cy.contains('ng-sandbox');
  });

  it('has mat-nav-list with one item for each configurated route', () => {
    const menuCount = menuRoutes.length;
    cy.get('mat-nav-list').find('mat-list-item').should('have.length', menuCount);
    // cy.get('button').click();
    // cy.get('mat-menu');
  });
})
````

*login.spec.ts*

````typescript
describe('Default', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.url().should('include', 'login');
  });
  
  it('test invalid login form - password missing', () => {
  	cy.get('[formControlName="username"]').type('lksdfjslkfdjs');
	cy.get('button').click();
	cy.url().should('not.include', 'dashboard');
  });
  
  it('test valid login form', () => {
  	cy.get('[formControlName="username"]').type('admin');
	cy.get('[formControlName="password"]').type('rootPassword');
	cy.get('button').click();
	cy.url().should('include', 'dashboard');
  });
})
````

### Commandes personnalisées

Lorsqu'un schéma de test se répète souvent (ex : tester la navigation de plusieurs menus), ou que l'on souhaite définir des fonctions plus complexes, il est possible d'écrire ses propres commandes.
Ces commandes sont définires dans le fichier **support/commands.ts**

````typescript
import { menuRoutes } from './../../src/app/shared/config/routes.config';

/* Exemple de contenu du fichier routes.config
export const menuRoutes = [
    { route: 'welcome', title: 'home' },
    { route: 'data-list', title: 'mat-table' },
    { route: 'huge-table', title: 'huge mat-table sorting' },
*/

// Important, décommanter le bout de code suivant
// et déclarer chaque commande custom sinon elle ne seront pas accessibles dans les tests
declare namespace Cypress {
    interface Chainable<Subject = any> {
        //customCommand(param: any): typeof customCommand;
        checkSpecificRoute(route: string): typeof checkSpecificRoute;
        navigateTo(route: string): Chainable<Element>;
        navigateAll(): Chainable<Element>;
    }
}

function checkSpecificRoute(route, setTimeout = true) {
    cy.wait(1000);
    cy.get('.mat-nav-list');
    cy.get(`[ng-reflect-router-link="/${route}"]`).click().visit('/' + route, setTimeout ? { timeout: 1000 } : {});
}
function checkAllRoutes() {
    menuRoutes.forEach(route => {
        checkSpecificRoute(route.route, true);
    });
}

// Commande permettant de tester la navigation des menus
Cypress.Commands.add('navigateTo', (route) => {
    checkSpecificRoute(route);
});

Cypress.Commands.add('navigateAll', checkAllRoutes);
````

> Important : décommenter la ligne ````typescript import './commands';```` dans le fichier *support/index.ts*

[Back to top](#tests-unitaires)

### Autre exemple de commande personnalisée

*commands.ts*
````typescript
declare namespace Cypress {
	interface Chainable<Subject = any> {
		login(username: string, password: string): typeof login;
	}
}

function login(username: string, password: string) {
	cy.visit('/');
	cy.url().should('includes', 'login');
	cy.get('[formControlName="username"]').type(username);
	cy.get('[formControlName="password"]').type(password);
	cy.get('button').click();
	cy.url().should('include', 'dashboard');
}

Cypress.Commands.add('login', login);
````

*login.spec.ts*
````typescript
describe('Default', () => {
  
  it('test valid login form', () => {
  	cy.login('admin', 'rootPassword');
  });
})
````

### Exemples

````typescript
describe('menu-navigation', () => {
    it('navigate on users', () => {
        cy.visit('/users');
    });

    it('make http call to placeholder api', () => {

        cy.request('GET', 'https://jsonplaceholder.typicode.com/users')
            .then((response) => {
                expect(response.status).to.eq(200);
            })

        /*cy.request('GET', 'https://jsonplaceholder.typicode.com/users').as('users');
        cy.get('@users').should((response) => {
            expect(response.body).to.have.length(500)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
        })*/
    });

    it('should contains mat-table', () => {
        cy.get('mat-table');
    });

    // Clic sur bouton qui redirige vers l'écran liste des posts
    it('redirect to posts', () => {
        cy.get('.mat-toolbar > .mat-focus-indicator').click();
        cy.location('pathname').should('eq', '/posts'); // tester la valeur de la route actuelle
        cy.wait(2000);
    });

    // Depuis écran liste des posts, clic sur bouton retour
    it('redirect back to users', () => {
        cy.get('.mat-toolbar > .mat-focus-indicator').click();
        cy.location('pathname').should('eq', '/users');
    });

})
````
 
</details>


[Back to top](#tests-unitaires)

## Tests unitaires avec Jest

**karma étant déprécié depuis Angular 16**, Angular s'attaque à intégrer Jest (expérimental pour le moment).

- karma = test runner conçu pour fonctionner avec le frmk de test jasmine. Va être remplacé par web-test-runner de ModernWeb
- jasmine frmk de test JS historiquement intégré à Angular
- Jest frmk de test JS (dev par facebook), c'est un fork de jasmine initialement développé pour fonctionner avec React
- Jest moins de fonctionnalités que Jasmine (ne peut pas jouer un son, stocker dans du local storage...)
- jasmine plus lent que jest. jest intègre une mise en cache des tests, parralélisation des tests, watch mode (ne rééxécute que les tests affectés par les changements de code)
- jasmine plus anciens, plus grande communeauté, plus de documentation...
- Jest a des erreur d'import, il doit effectuer la compilation lui-même et n'a pas connaissance de toutes les métadonnées du projet, contrairement au projet angular qui compile via le compilateur typescript jest-angular-preset ne règle pas toutes les erreurs

> [Jest cheatsheet](https://devhints.io/jest)

<details>
	<summary></summary>

### Installation / configuration

<details>
	<summary>Implémentation</summary>
	
**Retirer les dépendances à Karma / Jasmine**
````
npm remove @types/jasmine jasmine-core karma-jasmine karma karma-chrome-launcher karma-coverage karma-jasmine-html-reporter
````

**Installer Jest**

````
//npm i --save-dev @types/jest jest-preset-angular
npm i --save-dev jest jest-preset-angular @types/jest jest-environment-jsdom -D
````

*package.json*
````json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
````

* Supprimer le noeud "test" dans angular.json

* Créer un fichier jest.config.js à la racine du projet

````typescript
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup.jest.ts"],
};
````

* Remplacer ````jasmine```` par ````jest```` dans le fichier *tsconfig.spec.json* et *tsconfig.json*
* Ajouter ````"types": ["node", "jest"]```` dans le *tsconfig.json*
* Rajouter la rubrique files dans le fichier *tsconfig.spec.json*
````json
 "files": [
    "src/setup.jest.ts"
  ],
````
* Créer le fichier src/setup.jest.ts 
````typescript
import 'jest-preset-angular/setup-jest';
````

**Lancer les tests**

````
npm run test
npm run test -- <my_specific_file>.spec.ts  // tester uniquement le fichier spécifié
````
 
</details>

### Structure des tests
<details>
	<summary>Implémentation</summary>

> A savoir : il est possible d'imbriquer plusieurs blocs "describe". Cela permet de structurer le fichier de test afin de regrouper les fonctions 
par domaine fonctionnel par exemple

````typescript
describe('UserService', () => {
	describe('user infos', () => {
		it('add user info', () => {
		
		})
		it('remove user info', () => {
		
		})
	})
	
	describe('user product', () => {
		it('add user product', () => {
		
		})
		it('remove user product', () => {
		
		})
	})
})
````

</details>

### Tester un service

<details>
	<summary>Implémentation</summary>

Test d'un service. La première chose à faire avant de tester les fonctions d'un service, est de l'injecter dans testBed 
et de s'assurer qu'il a bien été injecté (toBeTruthy) pour pouvoir ensuite en tester toutes les fonctions

````typescript
describe('UserService', () => {
	let userService: UserService;
	
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UserService]
		});
		
		userService = testBed.inject(UserService)
	});
	
	it('creates userService', () => {
		expect(userService).toBeTruthy();
	})
})

````

Dans le code ci-dessus, toute la partie beforeEach est jouée avant chaque test unitaire. Ici, on injecte donc le service avant toute chose.

beforeAll est joué une fois avant tout le reste
 
</details>


### Tester HttpClient

<details>
	<summary>Pour tester les appels Http, on importera le module HttpClientTestingModule afin de pouvoir créer des mocks, car on ne souhaite jamais tester les appels réels, mais juste
le traitement des réponses.</summary>

Voici la déclaration standard d'un service avec http

````typescript
describe('ConfigService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ ConfigService ]
    });
    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente
  });

  it('config service should be created', () => {
    expect(configService).toBeTruthy();
  });
}
```` 
</details>

<details>
	<summary>Test d'une fonction get</summary>

*Fonction du service à tester*
````typescript
loadConfig() {
    const configFilePath = `../config/${this.environment}/config.env.json`;
    return this.http.get<any>(configFilePath)
      .pipe(
        tap((config: Config) => this._config = config)
      );
  }
````

````typescript
it('should load config', () => {
    const httpMockConfig = {
      production: true,
      baseUrl: 'https://my-mock-url',
      title: 'http client mock data'
    }
	
	let response: Config | undefined;

    configService.loadConfig().subscribe((config: Config) => {
      //expect(config).toEqual(httpMockConfig);
	  response = config
    })

    const req = httpTestingController.expectOne('../config/test/config.env.json');	// Important : doit être appelé APRES le subscribe (ci-dessus)
    expect(req.request.method).toEqual('GET');
    req.flush(httpMockConfig);  // objet qui sera injecté dans le retour de la requête http
	
	expect(response).toEqual(httpMockConfig);

    httpTestingController.verify();
  })
````
</details>

<details>
	<summary>Test d'une fonction POST</summary>

````typescript
it('should add user', () => {
	
	let userId: number | undefined;

    configService.addUser({name: 'Paul', age: 35}).subscribe((response) => {
      userId = response.id
    })

    const req = httpTestingController.expectOne('https://localhost:8000/user');
	
    expect(req.request.method).toEqual('POST');	// tester la méthode http utilisée : peut être sorti dans un autre test 
	expect(req.request.body).toEqual({name: 'Paul', age: 35});	// tester le body de la requête : peut être sorti dans un autre test 
	
    req.flush({id: 25550});  // objet qui sera injecté dans le retour de la requête http
	
	expect(userId).toEqual(25550);

    httpTestingController.verify();
  })
````
</details>

### Test des erreurs Http

<details>
	<summary>Implémentation</summary>

````typescript
it('throws an error if request fails', () => {
    let actualError: HttpErrorResponse | undefined;

    configService.loadConfig().subscribe({
      next: () => {
        fail('Success should not be called');
      },
      error: (err) => {
        actualError = err;
      }
    })

    const req = httpTestingController.expectOne('../config/test/config.env.json');

    req.flush('Server error', {
      status: 422,
      statusText: 'Unprocessible entiry'
    })

    expect(actualError?.status).toEqual(422)
    expect(actualError?.statusText).toEqual('Unprocessible entiry')
  })
````
 
</details>

### Tester un observable

<details>
	<summary>Implémentation</summary>

*user.service.ts*
````typescript
users$ = new BehaviourSubject<User[]>([]);

addUser(user: User) {
	this.users$.next([...this.users$.getValue(), user);
}

removeUser(userId: number) {
	const updatedUsers = this.users$.getValue().filter(u => u.id !== userId);
	this.users$.next(updatedUsers);
}
````

*user.service.spec.ts*
````typescript
it('should add a user', () => {
	const user: User = { id: 3, name: 'Paul' }
	
	userService.addUser(user);
	expect(userService.usesr$.getValue()).toEqual([{id: 3, name: 'Paul'}])	
})

it('should add a user', () => {
	userService.users$.next([{ id: 3, name: 'Paul' }]);
	
	userService.removeUser(3);
	expect(userService.usesr$.getValue()).toEqual([])
	
})
````
 
</details>

### Mock and Spy

Lorsqu'un service utilise d'autres dépendances (par exemple HttpClient) il faut créer un mock des dépendances pour éviter d'avoir des erreurs de type "NullInjector for xxxxx"

La méthode "simple" pour supprimer l'erreur consiste à rajouter les dépendances dans le providers TestBed

````typescript
describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
		ConfigService, 
		HttpClient	// <-- ajout de la dépendance 
	  ]
    });
    configService = TestBed.inject(ConfigService);
  });
})
```` 

On pourrait en rester là, cependant, si l'on souhaite rester très "stricte" dans les tests et garantir que chaque service est testé de manière totalement "isolée", et 
que ses dépendances n'impactent pas ces tests, alors il faut créer un mock pour chaque dépendances.

Dans le cas ci-dessus, injecter *HttpCLient* de la sorte va exécuter des requêtes Http, ce que nous ne voulons pas car cela alourdirai les tests. On préfèrera créer un mock dans ce cas.

<details>
	<summary>Mock</summary>

Un mock est un objet plein ou un ensemble de données préparées qui n'ont aucun lien avec la dépendance qui ont pour but de "simuler" la réponse de la dépendance

````typescript
describe('ConfigService', () => {
  let configService: ConfigService;
  
  const userServiceMock = {	// définition du mock
    getUser: jest.fn(id => {name: '', age: 35}),
	setUser: jest.fn()
  }
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ConfigService,
        {
          provide: UserService, useValue: userServiceMock
        }
      ]
    });
	// ...
}
````
</details>

<details>
	<summary>Spy</summary>

Le *spy* est différent du mock dans le sens ou on ne créé pas un faux service, mais on observe le service réel

````typescript
describe('ConfigService', () => {
  let configService: ConfigService;
  let userService: UserService;
  
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ConfigService,
        UserService
      ]
    });
	
	configService = TestBed.inject(ConfigService);
	userService = TestBed.inject(UserService);
	
	
	it('soulhd get username', () => {
		jest.spyOn(userService, 'getUserName');
		
		expect(userService.getUserName).toHaveBeenCalledWith('25');	// passage de l'id 25 en paramètre à la fonction
		
	})
}
````
</details>

### Tester une fonction private

*service.ts*
````typescript
  private buildUrl(baseUrl: string = '', suffix: string = ''): string {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanSuffix = suffix.replace(/^\/+/, '');

    // Concaténer l'URL de base et le suffixe avec un "/" entre eux
    return cleanBaseUrl + '/' + cleanSuffix;
  }
````

*service.spec.ts*
````typescript
it('should build url', () => {
    const baseUrl = 'http://localhost';
    const suffix = 'api';
    const expectedUrl = 'http://localhost/api';

    const url = service['buildUrl'](baseUrl, suffix);
    expect(url).toEqual(expectedUrl);
})
````

### Remarques 

toBe() vs toEqual()

toBe() réalise un test ````===````

var arr = [1, 2, 3];
expect(arr).toEqual([1, 2, 3]);  // success; equivalent
expect(arr).toBe([1, 2, 3]);     // failure; not the same array

</details>


## Playwright

<details>
	<summary>e2e test avec Playwright</summary>

# Présentation

Playwright est un outil de test automatisé développé par Microsoft qui permet d’interagir avec des navigateurs web pour tester des applications. Il prend en charge Chromium, Firefox et WebKit et permet d’exécuter des tests sur différentes plateformes (Windows, Mac, Linux) ainsi que sur des navigateurs en mode headless (sans interface graphique).

> [Best practices](https://playwright.dev/docs/best-practices)    

## Fonctionnalités Clés :

* Automatisation Multi-Navigateurs : Playwright permet de tester des applications web sur plusieurs navigateurs (Chromium, Firefox, WebKit) avec une seule API, ce qui simplifie le processus de test et assure une couverture plus large.
* Tests End-to-End (E2E) : Il simule les interactions utilisateur, ce qui permet de tester le comportement de l'application du point de vue de l'utilisateur final.
* Support Multi-Langages : Playwright supporte plusieurs langages de programmation, y compris TypeScript, JavaScript, Python, .NET, et Java, ce qui le rend facilement intégrable dans différents environnements de développement.
* Fixtures Réutilisables : Les fixtures permettent de configurer et de nettoyer l'environnement de test automatiquement, ce qui évite les interférences entre les tests.
* Intégration Continue (CI) : Playwright s'intègre bien avec les pipelines CI/CD, facilitant ainsi l'automatisation des tests dans le processus de déploiement.
* Tests multi-plateformes : Fonctionne sur Windows, Linux et macOS.
* Exécution en mode headless : Permet d’automatiser les tests sans affichage du navigateur.
* Interaction avancée avec les pages : Gestion du DOM, des événements clavier et souris, du réseau, etc.
* Tests parallélisés : Accélère les tests en exécutant plusieurs scénarios en parallèle.
* Capture de screenshots et vidéos : Utile pour le debugging des tests.
* Mocks et interception réseau : Permet de tester des cas spécifiques en simulant des réponses API.

Playwright permet aussi d'enregitrer des scenarios de tests automatiquement en naviguant sur l'application via **Codegen**. Cette fonctionnalité permet de générer rapidement des scénarios sans écrire de code.


## Avantages dans un Projet

* Robustesse et Fiabilité : En automatisant les tests E2E, Playwright aide à identifier les bugs et les problèmes de compatibilité entre navigateurs avant qu'ils n'affectent les utilisateurs finaux.
* Gain de Temps : L'automatisation des tests réduit le temps nécessaire pour effectuer des tests manuels, permettant aux développeurs de se concentrer sur d'autres aspects du développement
* Couverture de Test Étendue : En testant sur plusieurs navigateurs, Playwright assure que l'application fonctionne correctement pour une large base d'utilisateurs.


## Ressources

https://www.youtube.com/watch?v=kD1jjfwer5Y&ab_channel=HudsonYuen


## Installation et Configuration

````npm init playwright@latest````

### Configuration

Lors de l'installation, le fichier *playwright.config.ts* est créé à la racine de votre projet. Ce fichier contiendra les paramètres de configuration pour Playwright, comme les navigateurs à utiliser et les options de lancement.


````typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [
    ['list'], // Affiche les résultats des tests dans la console
    ['html', { outputFolder: 'test-results' }], // Génère un rapport HTML dans le dossier test-results
  ],
  //timeout: 30000, // 30s par défaut
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000/dev',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // headless: true, // Exécution en mode headless (sans UI)
    // screenshot: 'on', // Capture d'écran automatique en cas d'échec
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1500, height: 889 },// 1920*1080
        trace: "on" // génère un fichier dans le répertoire test-results/trace/index.html
        // video: "on", // ajoute une vidéo du test dans le rapport
        // screenshot: "on" // ajout des screenshot dans le rapport
       },
    },

   /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    env: {
      "NODE_TLS_REJECT_UNAUTHORIZED": "0",
      "WITH_PATHPREFIX": "1"
    },
    //command: 'npm run start',
    url: 'http://localhost:3000/dev',
    reuseExistingServer: !process.env.CI,
  },
});

````


## Écriture des Tests

Placez vos tests E2E dans un répertoire dédié, par exemple tests/e2e. Utilisez les fixtures et les fonctions fournies par Playwright pour écrire vos tests6.
````typescript
import { test, expect } from '@playwright/test';

test('should navigate to the homepage', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('My Next.js App');
});
````

**Autre exemple :**

Dans un dossier *tests/*, crée un fichier *home.spec.ts* et écris un test simple :
````typescript
import { test, expect } from '@playwright/test';

test('La page d’accueil affiche le bon titre', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mon Application/);
});
````

### Ajouter des restrictions
````
test.skip(process.env.AUTH === '1')

// skip if mobile
test.skip(({isMobile}) => isMobile)
````


## Enregistrer des scénarios avec Codegen

````npx playwright codegen https://ton-site.com````

ou

1 : démarrer le serveur local dans un terminal

2 : lancer codegen dans un second terminal 
````npx playwright codegen localhost:3000 --save-storage=auth.json````

* ````--save-storage=<your-file-name>.json```` : enregistre l'état de connexion (cookies et localStorage) une fois la session terminée

Exemples de commandes :
````
npx playwright codegen localhost:3000/dev -o ./tests/mkp-dev-codegen.spec.ts
npx playwright codegen https://gecet.groupeisia.dev/int/marketplace/auth -o ./tests/mkp-int-codegen.spec.ts --channel=chrome
````


* ````-o <test-filename.spec.ts>```` : permet de copier la sortie dans un fichier
* ````--channel=chrome```` : forcer l'exécution sur un browser précis


Cela va :
✅ Ouvrir un navigateur Playwright
✅ Enregistrer toutes tes interactions (clics, saisies, navigation, etc.)
✅ Générer automatiquement un script de test en TypeScript, JavaScript, Python ou Java

### Gérer l'authentification

De base, la navigation enregistre l'intégralité des saisies. Ce qui signifie que lors de l'authentification, le scénario va enregistrer en clair
le contenu des champs login et mot de passe. Ceci n'étant pas sécurisé, Playwright permet d'enregistrer les informations du contexte d'authentification (cookies et localStorage)
de manière cryptée dans un fichier json.
Ceci permet pour l'exécution des tests, d'utiliser ce contexte pour se connecter à l'application, sans avoir accès en clair aux informations
de connexion dans le fichier de test.

Voici les étapes à suivre pour mettre en place cette fonctionnalité :

1 - créer un répertoire *playwright/.auth* à la racine du projet
2 - créer un fichier json dans ce répertoire qui contiendra les informations de connexion (par ex: 'auth.json')
3 - Dans un terminal, lancer l'application (npm run dev)
4 - dans un second terminal, lancer la génération de test via la commande : 
````npx playwright codegen http://localhost:3000/dev -o ./tests/mkp-localhost-codegen.spec.ts --save-storage=./playwright/.auth/auth.json````
5 - s'authentifier manuellement dans l'application et fermer Codegen. Ceci va implémenter le fichier auth.json avec les informations de connexion
6 - Créer un fichier */tests/auth.setup.ts*
7 - Ajouter la propriété *storageState* dans le projet correspondant dans  le fichier *playwright.config.ts*

Notez que vous devez supprimer l'état stocké à son expiration. Si vous n'avez pas besoin de conserver l'état entre les tests, écrivez l'état du navigateur dans testProject.outputDir, qui est automatiquement nettoyé avant chaque test.

### Personnalisation et modification

Une fois enregistré, on peut modifier ce script pour :

✔ Ajouter des assertions supplémentaires (ex. vérifier la présence d’un élément spécifique)     
✔ Paramétrer les tests avec des variables dynamiques     
✔ Exécuter les tests sur plusieurs navigateurs ou appareils     

### Rejouer les tests enregistrés

````npx playwright test nom_du_fichier.spec.ts````

ex : 

````npx playwright test ./tests/mkp-dev-codegen.spec.ts --headed````

* ````--headed```` : permet de visualiser le déroulement du test dans un browser. Sans cette option, le test sera jouée dans le terminal

## Exécution des Tests

### methode 1 
````npx playwright test````, ou pour visualiser les tests en action avec une UI :
* ````npx playwright test --ui```` : ouvre une interface de test avec visualisation, timeline etc...
* ````npx playwright test --headed```` : ouvre un navigateur et simule le test

### methode 2 

Ajoutez un script dans votre *package.json* pour exécuter les tests Playwright.
````
"scripts": {
  "test:e2e": "playwright test"
}
````
Lancez les tests avec la commande suivante :

````npm run test:e2e````


## Intégration CI/CD
 
</details>



