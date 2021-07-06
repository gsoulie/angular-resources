[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Tests unitaires

* [Tester le bundle généré dans le répertoire dist](#)         
* [e2e avec Cypress](#e2e-avec-cypress)     

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
describe('Default', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has title', () => {
    cy.contains('ng-sandbox features');
  });

  // contient une mat-list
  it('has mat-list', () => {
    cy.get('mat-list');
  });

  // contient un mat-menu lorsqu'on clique sur le bouton contenu dans la div .btn-div
  it('has mat-menu', () => {
    cy.get('.btn-div')
    cy.get('button').click();
    cy.get('mat-menu');
  });
})
````

### Commandes personnalisées

Lorsqu'un schéma de test se répète souvent (ex : tester la navigation de plusieurs menus), ou que l'on souhaite définir des fonctions plus complexes, il est possible d'écrire ses propres commandes.
Ces commandes sont définires dans le fichier **support/commands.ts**

````typescript
// Important, décommanter le bout de code suivant
// et déclarer chaque commande custom sinon elle ne seront pas accessibles dans les tests
declare namespace Cypress {
    interface Chainable<Subject = any> {
        //customCommand(param: any): typeof customCommand;
        checkSpecificRoute(route: string): typeof checkSpecificRoute;
        navigateTo(route: string): Chainable<Element>;
    }
}

function checkSpecificRoute(route, setTimeout = true) {
    cy.wait(1000);
    cy.get('#menuBtn').click({ force: true });
    cy.get('mat-menu');
    cy.get('mat-menu');
    cy.get(`[routerlink="${route}"]`).click().visit('/' + route, setTimeout ? { timeout: 1000 } : {});
}

// Commande permettant de tester la navigation des menus
Cypress.Commands.add('navigateTo', (route) => {
    checkSpecificRoute(route);
});
````

> Important : décommenter la ligne ````typescript import './commands';```` dans le fichier *support/index.ts*

[Back to top](#tests-unitaires)

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
