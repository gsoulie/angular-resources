[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)     

# Claude Code

Claude code est un outil de programmation agentique. Il peut être utilisé directement via son CLI ou être intégré dans un IDE.

# Tools with Claude Code

| Name           | Purpose                                      |
|----------------|----------------------------------------------|
| Agent          | Launch a subagent to handle a task           |
| Bash           | Run a shell command                          |
| Edit           | Edit a file                                  |
| Glob           | Find files based upon a pattern              |
| Grep           | Search the contents of a file                |
| LS             | List files and directories                   |
| MultiEdit      | Make several edits at the same time          |
| NotebookEdit   | Write to a cell in a Jupyter notebook        |
| NotebookRead   | Read a cell                                  |
| Read          | Read a file                                  |
| TodoRead      | Read one of the created to-do's              |
| TodoWrite     | Update the list of to-do's                   |
| WebFetch      | Fetch from a URL                             |
| WebSearch     | Search the web                               |
| Write         | Write to a file                              |

# CLAUDE.md

Le fichier ````CLAUDE.md```` est **inclut par la suite dans toutes les requêtes faites à claude**. Ce fichier inclut le **contexte projet**, soit un résumé du projet, 
liste les commandes importantes, l'architecture du projet et les règles de codage etc... On peut modifier ce fichier à souhait.

Ce fichier est commité, donc partagé à tous les membres du projet. 

On peut créer ce fichier à la main, ou bien utiliser la commande :
````/init```` => initialise le fichier CLAUDE.md

Il est aussi possible de créer un fichier ````CLAUDE.local.md```` qui ne sera pas commit et permet d'ajouter des instructions et personnalidations privées

Enfin un fichier ````~/.claude/CLAUDE.md```` peut être créé pour être utilisé dans **tous** les projets présents sur la machine. Il contient des instructions que l'on souhaite appliquer à l'ensemble des projets

**En résumé**
|Fichier|Description|
|-|-|
|````project/.claude/CLAUDE.md````|Fichier de contexte d'un projet, partagé à l'équipe. Contient les instructions / bonnes pratiques à appliquer au projet|
|````CLAUDE.local.md````|Fichier de contexte local non partagé|
|````~/.claude/CLAUDE.md````|Fichier de contexte global à la machine. Contient les instructions à appliquer à l'ensemble des projets sur la machine|


# Modes de raisonnement

## plan mode

dans le cas d'exécution de tâche complexe, il est recommandé de basculer en *plan mode*. Cette fonctionnalité permet à Claude d'epxlorer le projet en profondeur avant d'y apporter des modifications.

Ceci aura pour effet de : 
* Consulter d'autres fichiers dans le projet 
* Créer un plan de mise en œuvre détaillé 
* Montrer précisément ce que le plan vise à faire 
* Attend votre approbation avant de poursuivre

## thinking mode

Claude propose différent niveau de raisonnement "thinking". Ces niveaux permette à claude de passer plus ou moins de temps de raisonnement en fonction de la complexité de la tâche avant de fourninr une solutions.

Bien entendu, plus le niveau de thinking est grand et plus il est consommateur de tokens

* "Think" - Basic reasoning
* "Think more" - Extended reasoning
* "Think a lot" - Comprehensive reasoning
* "Think longer" - Extended time reasoning
* "Ultrathink" - Maximum reasoning capability

Le mode **plan** est recommandé pour :

* Tâches nécessitant une compréhension approfondie de votre base de code
* Implémentation en plusieurs étapes
* Changements qui affectent plusieurs fichiers ou composants 

Le mode **thinking** est conseillé pour :

* Résolution de problèmes complexes
* Debugger des cas complexes
* Algorithmes complexes


# Hooks

Les *Hooks* permettent d'exécuter une commande **avant** (preToolUse) ou **après** (postToolUse) que Claude face quelque chose.

* Exécuter un *code formatter* après que Claude est édité un fichier
* Exécuter des tests automatiquement après qu'un fichier ait été modifié
* Bloquer l'éutilisation d'une fonction dépréciée
* Vérifier les commentaires TODO ajoutés dans le code par Claude et les ajouter dans un fichier de log
* Empêcher Claude de lire ou éditer un fichier particulier

On peut créer un hook manuellement ou utiliser la commande ````/hooks````

Les hooks sont définis dans :
|||
|-|-|
|**Global**|````~/.claude/settings.json````|
|**Project**|````.claude/settings.json````|
|**Project (not committed)**|````.claude/settings.local.json````|

Un hook prend la forme suivante :

````json
{
	"hooks": {
		"PreToolUse": [
			"matcher": "Read",	// tool name
			"hooks": [
				{"type": "command", "command": "node /home/hooks/read_hook.ts"}
			]
		],
		"PostToolUse": [...]
	}
}
````

*Explication* : Dans cet exemple, le hook va exécuter la commande définie **Avant** que Claude n'utilise le tool **Read**

Liste des hooks existants :

|Hook|Description|
|-|-|
|PreToolUse||
|PostToolUse||
|Notification|Exécuté lorsque Claude envoi une notification|
|Stop|Exécuté lorsque Claude a terminé de répondre|
|SubagentStop|Exécuté lorsqu'un subagent a terminé son travail|
|PreCompact|Exécuté avant qu'une opération de compactage intervienne|
|UserPromptSubmit|Exécuté lorsque l'utilisateur soumet son prompt|
|SessionStart||
|SessionEnd||

# Skills

[**Voire aussi la documentation complète ici**](https://code.claude.com/docs/en/skills) 

Tout comme le fichier CLAUDE.md, les skills peuvent être définis au niveau de la machine ou du projet.

Pour définir les skills au niveau du projet, il suffit de créer un répertoire ````project/.claude/skills/<skill-name>/SKILL.md```` et y créer les fichiers skills que l'on souhaite (ex: custom-guidelines.md, pr-review.md, security-review.md ...)

**Skill Priority**    

Que ce passe t'il si un projet cloné possède un skill qui a le même nom qu'un skill personnel ?

Voici l'ordre de priorité pour la prise en compte des skills :

**1. Enterprise** — managed settings, priorité la plus haute (managed-settings.json)      
**2. Personal** — répertoire home (````~/.claude/skills````)      
**3. Project** — répertoire ````project/.claude/skills````      
**4. Plugins** — plugins installés, priorité la plus basse (````project/.claude-plugins/skills````)        

*Exemple de fichier skill Angular moderne*

<details>
	<summary>Fichier skill</summary>

````
---
name: angular-modern
description: >
  Bonnes pratiques Angular modernes (v17+, compatible v21+). Utilise ce skill
  pour toute tâche Angular : création de composants, services, routing, gestion
  d'état, formulaires, optimisation de performance, tests. Déclenche ce skill
  dès qu'un fichier .ts/.html Angular est impliqué, ou quand l'utilisateur
  mentionne Angular, signals, standalone components, SSR avec Angular Universal,
  ou demande de l'aide sur une architecture Angular.
---

# Angular Modern Best Practices (v17–v21+)

## Principes fondamentaux

- **Standalone par défaut** — plus de `NgModule` sauf cas legacy. Tout composant, directive, pipe est `standalone: true`.
- **Signals-first** — `signal()`, `computed()`, `effect()` pour tout état local et dérivé. Évite `BehaviorSubject` pour le state UI.
- **OnPush partout** — `changeDetection: ChangeDetectionStrategy.OnPush` sur chaque composant, sans exception.
- **Inject function** — utilise `inject()` plutôt que l'injection par constructeur.
- **Functional guards/resolvers** — finis les classes `CanActivate`. Utilise des fonctions pures.

---

## Structure de projet recommandée

```
src/
├── app/
│   ├── core/               # Services singleton, interceptors, guards globaux
│   │   ├── auth/
│   │   └── http/
│   ├── shared/             # Composants/pipes/directives réutilisables
│   │   ├── ui/             # Composants UI génériques (boutons, modals…)
│   │   └── utils/
│   ├── features/           # Feature modules (lazy-loaded)
│   │   └── dashboard/
│   │       ├── data-access/    # Services, stores, API calls
│   │       ├── ui/             # Composants présentationnels
│   │       └── dashboard.routes.ts
│   └── app.routes.ts
```

---

## Composants

### Template

```typescript
// ✅ Moderne
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h2>{{ user().name }}</h2>
      @if (isAdmin()) {
        <span class="badge">Admin</span>
      }
      @for (role of user().roles; track role.id) {
        <span>{{ role.label }}</span>
      }
    </div>
  `,
})
export class UserCardComponent {
  user = input.required<User>();
  isAdmin = computed(() => this.user().roles.includes('admin'));
}
```

### Inputs / Outputs (v17.1+)

```typescript
// Utilise les nouvelles API signal-based
name = input<string>('');               // optionnel avec défaut
userId = input.required<number>();      // requis
theme = input<'light' | 'dark'>('light');

clicked = output<void>();
selected = output<User>();
```

---

## Signals — patterns essentiels

```typescript
@Injectable({ providedIn: 'root' })
export class CartStore {
  // State privé
  private _items = signal<CartItem[]>([]);

  // Lecture publique (readonly)
  items = this._items.asReadonly();

  // Dérivé avec computed
  total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  count = computed(() => this._items().length);

  // Mutations
  addItem(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }

  removeItem(id: string): void {
    this._items.update(items => items.filter(i => i.id !== id));
  }
}
```

### effect() — règles d'usage

```typescript
// ✅ Bon usage : synchronisation avec une API externe (localStorage, analytics)
effect(() => {
  localStorage.setItem('theme', this.theme());
});

// ⚠️ Évite effect() pour modifier d'autres signals → préfère computed()
// ❌ Mauvais
effect(() => {
  this.derivedValue.set(this.source() * 2); // bug potentiel, boucle
});
// ✅ Correct
derivedValue = computed(() => this.source() * 2);
```

---

## Services et injection

```typescript
// ✅ inject() function — plus flexible, compatible avec les fonctions utilitaires
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}

// inject() hors classe — fonctionne dans les guards, resolvers, etc.
export function authGuard(): CanActivateFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);
    return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
  };
}
```

---

## Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    resolve: { data: dashboardResolver },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canMatch: [roleGuard('admin')],
  },
];

// Guard fonctionnel avec paramètre
function roleGuard(role: string): CanMatchFn {
  return () => inject(AuthStore).hasRole(role);
}

// Resolver fonctionnel
const dashboardResolver: ResolveFn<DashboardData> = (route) => {
  return inject(DashboardService).loadData(route.params['id']);
};
```

---

## HTTP et RxJS

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Resource API (v19+) — pour les reads simples
  // userResource = resource({ request: () => this.userId(), loader: ... });

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    );
  }
}

// Dans un composant — utilise toSignal pour éviter async pipe
@Component({ ... })
export class UsersComponent {
  private usersService = inject(UsersService);

  users = toSignal(this.usersService.getUsers(), { initialValue: [] });
}
```

---

## Performance

### Defer blocks (v17+)

```typescript
// Chargement lazy natif dans le template
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="skeleton h-64"></div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Erreur lors du chargement.</p>
}
```

### trackBy obligatoire dans @for

```typescript
// ✅ Toujours fournir track
@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```

### Image optimization

```typescript
// Utilise NgOptimizedImage
import { NgOptimizedImage } from '@angular/common';

// Template
<img ngSrc="hero.jpg" width="800" height="400" priority />
```

---

## SSR / SSG (Angular Universal intégré v17+)

```typescript
// server.ts — généré par ng add @angular/ssr
// Utilise les Transfer State pour éviter les double-fetches

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);

  getData(): Observable<Data[]> {
    const KEY = makeStateKey<Data[]>('app-data');
    const cached = this.transferState.get(KEY, null);

    if (cached) return of(cached);

    return this.http.get<Data[]>('/api/data').pipe(
      tap(data => this.transferState.set(KEY, data))
    );
  }
}
```

---

## Tests

### Unit — composant avec signals

```typescript
describe('UserCardComponent', () => {
  it('should display admin badge', async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', { name: 'Alice', roles: ['admin'] });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.badge')).toBeTruthy();
  });
});
```

### Service avec inject

```typescript
describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
  });

  it('should compute total', () => {
    store.addItem({ id: '1', price: 10, qty: 2 });
    expect(store.total()).toBe(20);
  });
});
```

---

## Ce qu'il faut éviter

| ❌ Déprécié / anti-pattern | ✅ Alternative moderne |
|---|---|
| `NgModule` (nouveau code) | Standalone components |
| `BehaviorSubject` pour UI state | `signal()` |
| `async` pipe | `toSignal()` |
| `*ngIf`, `*ngFor` | `@if`, `@for` |
| Injection par constructeur | `inject()` |
| Classes `CanActivate` | Functional guards |
| `ViewChild` pour tout | `viewChild()` signal-based (v17.2+) |
| `ngOnDestroy` + `takeUntil` | `takeUntilDestroyed(destroyRef)` |

---

## Références rapides

- [Angular Signals guide](https://angular.dev/guide/signals)
- [NgRx Signal Store](https://ngrx.io/guide/signals/signal-store)
- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Angular SSR](https://angular.dev/guide/ssr)
````

	
</details>
