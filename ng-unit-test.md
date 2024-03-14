[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Tests unitaires

* [Tester le bundle généré dans le répertoire dist](#tester-le-bundle-généré-dans-le-répertoire-dist)         
* [Tests unitaires et e2e tests](#tests-unitaires-et-e2e-tests)     
* [Tests unitaires](#tests-unitaires)     
* [e2e avec Cypress](#e2e-avec-cypress)     
* [Karma (déprécié depuis Angular 16)]
* [Tests unitaires avec Jest](#tests-unitaires-avec-jest)          

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
npm i jest jest-preset-angular @types/jest jest-environment-jsdom -D
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

* Remplacer ````jasmine```` par ````jest```` dans le fichier *tsconfig.spec.json*
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

### Remarques 

toBe() vs toEqual()

toBe() réalise un test ````===````

var arr = [1, 2, 3];
expect(arr).toEqual([1, 2, 3]);  // success; equivalent
expect(arr).toBe([1, 2, 3]);     // failure; not the same array

</details>
