[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Injection service V15

[Explication Josh Morony](https://www.youtube.com/watch?v=_quyWq4NnRM&ab_channel=JoshuaMorony)     

## Injection classique vs méthode inject()

### Restriction de la méthode classique

Soit le code suivant déclarant le code d'une classe de Base :

````typescript
export class BaseComponent {
  history = this.location.getState();
  
  constructor(public location: Location) {}
}
````

Ensuite le code suivant d'un composant qui étende la classe de base

````typescript
export class AppComponent extends BaseComponent {
  constructor(location: Location) {
    super(location);
  }
}
````

Tout composant qui étend la classe de base **DOIT** appeler la méthode ````super(...)```` en lui fournissant les services requis par la classe de base. Ceci constitue la première **restriction** car en cas de modification de la classe de base (ajout de nouveaux services), il faudra alors modifier **TOUS** les composants qui étendent la classe de base pour ajouter les nouveaux services dans la méthode ````super()````

Avec la méthode **inject()** nous n'avons plus cette limitation et il n'est plus nécessaire d'appeler ````super(...)````.

````typescript
export class BaseComponent {
  location = inject(Location);
  userService = inject(UserService);
  
  history = this.location.getState();
  username = this.userService.user.name;
}
````

````typescript
export class AppComponent extends BaseComponent {}  // pas de soucis en cas d'ajout de nouvelles injections dans la classe de base
````

### Restrictions méthode inject

La méthode ````inject()```` nécessite d'être utilisé durant la phase de "construction"

````typescript
export class AppComponent implements OnInit {
  userService = inject(UserService);  // OK car fait pendant la phase de construction
  
  ngOnInit() {
    inject(TestService).somValue // Ne fonctionnera PAS car exécuté APRES la phase de construction
  }
  
  somMethod() {
    inject(TestService).somValue // Ne fonctionnera PAS car exécuté APRES la phase de construction
  }
}
````

## Optimisation injection service

* Si service provided in root alors au moment du tree-shaking, si le service n'est pas injecté, il ne sera pas empaqueté dans le bundle

* En revanche si on injecte le service dans un composant avec ````service = inject(MyService)```` alors ce dernier sera empaqueté au niveau du composant

* Si on injecte notre service dans plusieurs composants, alors un 3ème fichiers "common.js" sera généré dans les chunk files.
Le premier composant appelé téléchargera ce fichier contenant notre service.

Conclusion : Toujours utiliser providedIn: root pour tous les services "singleton" (une seule instance pour toute l'appli) c'est plus facile à maintenir
et le compilateur Angular optimise mieux le tree shaking

##

Fournir un service dans les providers d'un composant :

````typescript
@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [],
  providers: [MyService], // provide a service
  template: `bar`,
})
export class BarComponent {
  service = inject(MyService)
}
````

Revient à lier ce service au cycle de vie du composant. On créé alors un service multi-instance, il y aura autant d'instance que d'appel à ce composant. 
A chaque destruction du composant, l'instance du service sera elle aussi détruite.

Par opposition un service injecté avec providedIn root aura une seule instance pour toute l'application

Important : injecter ````inject(...)```` ne veut pas dire créer une instance. Une instance est créée par la déclaration du service dans les "providers" ou via l'import dans le constructeur d'une classe

**Exemple : soit le composant parent suivant ayant un enfant**

````typescript
@Injectable()
export class MyService {
  title = 'No Title';

  setTitle = (title: string) => (this.title = title);
}

@Component({
  selector: 'child',
  standalone: true,
  template: `<div>{{ myService.title }}</div>`,
})
export class ChildComponent {
  myService = inject(MyService);	// <-- utilise l'instance du service créée par son parent
}

@Component({
  selector: 'parent',
  standalone: true,
  imports: [ChildComponent],
  providers: [MyService],	// <-- créé une instance du service
  template: `<child></child>`,
})
export class ParentComponent {
  myService = inject(MyService).setTitle('Parent Title');
}
````

Le titre afficher sera "Parent title" car l'instance du service est créée par le composant parent. Ce qui signifie que TOUS les enfants du 
parent utiliseront la MÊME instance du service.

**Autre exemple**

````typescript
@Injectable()
export class MyService {
  title = 'No Title';

  setTitle = (title: string) => (this.title = title);
}

@Component({
  selector: 'child',
  standalone: true,
  providers: [MyService], // <-- créé sa propre instance du service
  template: `<div>{{ myService.title }}</div>`,
})
export class ChildComponent {
  myService = inject(MyService);
}

@Component({
  selector: 'parent',
  standalone: true,
  imports: [ChildComponent],
  providers: [MyService], // <-- créé sa propre instance du service
  template: `<child></child>`,
})
export class ParentComponent {
  myService = inject(MyService).setTitle('Parent Title');
}
````

Le code suivant affichera le titre "No Title" car en effet l'enfant créé aussi sa propre instance du service et comme il ne modifie pas 
la valeur du "title", il affichera la valeur par défaut "No Title" bien que sont parent ait lui même défini la valeur du titre mais dans une autre instance.
