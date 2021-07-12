[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Veille

* [technos](#technos)       
* [Application fullstack NX, NestJS, Prisma, Angular]

### e2e
Protractor va être déprecié, il est conseillé de basculer sur **cypress** pour réaliser les tests e2e

### Reactjs
=> **lib js** : peut être appliqué à un bout de l'application ou à l'entièreté de l'application. Prise en main pas très évidente JSX

### vuejs 3.0
=> framework js : peut être appliqué à une partie de l'application ou à l'entièreté de l'application

### svelte
=> framework js très proche de React et Vue mais améliore les performances car il effectue le plus gros du travail lors de la compilation. paquets moins volumineux. En contrepartie, certaines notions utilisent une syntaxe spécifique,
svelte **ne gère pas tout seul** la mise à jour des références et mutations de tableaux, il faut donc s'en charger manuellement pour être sûr que la vue se mette à jour

### Prisma 
=> Couche de mapping object relationnel entre nodejs et typescript

### NestJS 
=> framework NodeJS, compatible TS qui permet de faire du backend avec la même architecture / syntaxe qu'un front angular. Cela facilite la maintenance et l'organisation d'un projet NodeJS. Il vient en complément de Express. 
	- Il y a même un paquet pour gérer swagger
	- gère le mode monorepos

### NX
Nx est une suite d'outils permettant la gestion des solutions monorepos. Il permet dont de créer une application fullstack angular / nodejs (prisma + nestJS). Nx est un framework de construction intelligent et extensible qui vous aide à développer, 
tester, créer et mettre à l'échelle des applications Angular avec une prise en charge entièrement intégrée d'outils modernes tels que Jest, Cypress, Storybook, ESLint, NgRx, etc
NX est donc une extension d'angular CLI. Il suffit de lui coupler NEST (ou simplement NodeJS) (+ Prisma en bonus) pour créer un projet fullstack mono-repo

### snowpack
### deno 
concurrent nodejs pour le backend

### déploiement serverless avec netlify

### stencil 
=> permet la création de composants avec syntaxe react mais dont le résultat est un web component natif utilisable dans n'importe quel projet / application js (angular, ionic, react, vue...). C'est avec Stencil que sont faits les composants
de Ionic

## Application fulllstack NX, NestJS, Prisma, Angular
[Back to top](#veille)     

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

### Création des ENDPOINTS

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
  
