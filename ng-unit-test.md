[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Tests unitaires

* [Tester le bundle généré dans le répertoire dist](#tester-le-bundle-généré-dans-le-répertoire-dist)         
* [Tests unitaires et e2e tests](#tests-unitaires-et-e2e-tests)     
* [Tests unitaires](#tests-unitaires)     
* [e2e avec Cypress](#e2e-avec-cypress)     
* [Karma](#karma)      

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



[Back to top](#tests-unitaires)      
