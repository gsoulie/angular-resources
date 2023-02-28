[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Nouveautés

* [v15](#v15)    


## v15

### Les API Router et HttpClient sont accessibles en standalone et sont tree-shakables

L'API Router est maintenant disponible en mode **standalone**, on peut donc définir ses routes sans utiliser de NgModule (voir exemple dans l'article)

### API Directive composition

Cette nouvelle directive accessible via le nouveau sélecteur **hostDirectives** permet de faciliter encore la réutilisabilité du code en crééant des directives composées. 

Un tuto a donc été réalisé pour l'occasion : [Composition Directive](/angular/tutos/composition-directive)

### Version stable de la directive NgOptimizedImage 

La directive *NgOptimizedImage* présentée il y a peu dans [notre tutoriel](/angular/tutos/ngoptimizedimage) est maintenant stable. Elle permet un gain significatif dans le chargement des images.

### Guards fonctionnels

L'arrivée des guards fonctionnels permet de réduire considérablement le code des guards, facilitant ainsi leur utilisation.

Ainsi le code suivant qui déclare un guard simple faisant appel au service *LoginService* pour déterminer si l'utilisateur est authentifié et qui par conséquent à accès à la route

````typescript
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
````

Peut être simplifié de la manière suivante grace aux guards fonctionnels 

````typescript
const route = {
  path: 'admin',
  canActivate: [() => inject(LoginService).isLoggedIn()]
};
````

### V15.1 Dépréciation : Router Guards

https://github.com/gsoulie/angular-resources/blob/master/ng-navigation.md#d%C3%A9pr%C3%A9ciation-v15

### Simplification de l'import des composants dans le router

Afin de simplifier l'écriture des imports des composants en mode lazy-loading, le router utilise maintenant un système d'auto-unwrap lui permettant de chercher un élément ````export default```` dans le fichier spécifié et de l'utiliser le cas échéant.

Ce qui permet de simplifier la déclaration de l'import d'un composant standalone

````typescript
{
  path: 'lazy',
  loadComponent: () => import('./lazy-file').then(m => m.LazyComponent),
}
````
En
````typescript
{
  path: 'lazy',
  loadComponent: () => import('./lazy-file'),
}
````

Le router va en fait chercher dans le fichier *./lazy-file* l'élément ````export default class LazyComponent```` et l'utiliser pour réaliser l'import

### Refactorisation des Composants Material Design

Une refactorisation complète des composants basés sur Material Design a été opérée dans le but d'adopter Material 3 et ainsi mettre à jour les styles et structure DOM des composants.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Après migration vers la v15, il est possible que certains styles de votre application doivent être ajustés, 
en particulier si votre CSS surcharge les styles des éléments internes de l'un des composants migrés.

Se référer au guide de migration pour plus de détails : https://github.com/angular/components/blob/main/guides/v15-mdc-migration.md#how-to-migrate


### Migration vers la v15

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> le passage à la v15 implique une potentielle **mise à jour de NodeJS** vers l'une des versions suivantes :
14.20.x, 16.13.x and 18.10.x

[Back to top](#nouveautés)    

### inject

Nouvelle façon d'injecter les services 

````typescript
const getCities = () => {
  const httpService = inject(HttpClient);
  const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
  return httpService.get<City[]>(endpoint).pipe(shareReplay(1));
}

export class MyCompo {
  cities$ = getCities();
}
````
[Back to top](#nouveautés)    
