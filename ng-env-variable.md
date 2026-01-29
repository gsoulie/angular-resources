[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Variables environnement

* [Gestion des variables d’environnement avec vault](#gestion-des-variables-d--environnement-avec-vault)     
* [Utilisation au runtime](#utilisation-au-runtime)     
* [Solution avec assets http](#solution-avec-assets-http)     
* [APP_INITIALIZER](#app_initializer)       
* [Solution avec factory](#solution-avec-factory)     




# Gestion des variables d’environnement avec vault

<details>
	<summary>Ce document explique comment gérer de manière sécurisée les variables d’environnement dans un projet Angular, pour le développement local et la production via un vault (GitHub, Azure, …).</summary>

## 1. Principe général

Le process repose sur trois éléments clés :

**1. Développement local** : utiliser un fichier ````environment.ts```` avec les clés et URL nécessaires uniquement pour le dev.

**2. CI/CD / Production** : utiliser un fichier template ````environment.template.ts```` contenant des placeholders ````${VAR_NAME}````, remplacés par des valeurs sécurisées provenant d’un vault.

**3. Pipeline CI/CD** : injecter les valeurs du vault dans le fichier template et compiler Angular avec ce fichier généré.

## 2. Structure projet

````
src/
  app/
    environments/
      environment.ts          # Dev local, non versionné
      environment.template.ts # Versionné, pour CI/CD
````

### 2.1 Dev local

* ````environment.ts```` contient vos credentials en clair pour le dev local.
* À ajouter dans ````.gitignore```` pour ne jamais versionner vos secrets.

````typescript
// environment.ts
export const environment = {
  production: false,
  authConfig: {
    issuer: "https://dev-issuer.com",
    appId: "DEV_APP_ID",
    ...
  }
};
````

### 2.2 Template pour CI/CD

* ````environment.template.ts```` contient des placeholders ````${VAR_NAME}````.
* Versionné dans Git.

*Exemple :*
````typescript
// environment.template.ts
export const environment = {
  production: true,
  authConfig: {
    issuer: "${NG_AUTH_ISSUER}",
    appId: "${NG_APP_ID}",
    ...
  }
};
````

## 3. Utilisation dans le code Angular

Le service peut rester indépendant de l’environnement :

````typescript
import { environment } from "../environments/environment";

@Injectable({ providedIn: "root" })
export class ConfigService {
  constructor() {
    this.app = initializeApp(environment.authConfig);
  }
}
````

* Angular compilera le fichier ````environment.ts```` existant au moment du build (local ou généré par CI/CD).

## 4. Gestion des secrets dans un vault

* Ajouter toutes les variables d’environnement (Firebase, API Keys, URLs, etc.) dans votre vault :
	* GitHub Secrets
	* Azure Key Vault
* Nommez-les clairement, en respectant le même nom que les placeholders du template, par exemple :

````
NG_AUTH_ISSUER
NG_APP_ID
NG_APP_FIREBASE_API_KEY
...
````

## 5. Pipeline CI/CD

Exemple d’une pipeline GitHub Actions pour Angular

````yml
name: Build and Deploy to Netlify

on:
  push:
    branches: [main, master, develop, secure-env-variable]
  pull_request:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    env:
      NG_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
      NG_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
      NG_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      NG_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
      NG_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
      NG_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      NG_APP_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ⭐ Injection des variables dans environment.prod.ts
      - name: Inject environment variables
        run: |
          envsubst < src/app/environments/environment.template.ts > src/app/environments/environment.ts
      #    mv src/environments/environment.ts src/environments/environment.prod.ts

      # POUR DEBUG UNIQUEMENT
      # - name: Debug environment content
      #   run: |
      #     echo "===== environment.ts ====="
      #     cat src/app/environments/environment.ts

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      # POUR DEBUG UNIQUEMENT
      #- name: Verify Angular environment file used
      #  run: |
      #    grep -R "NG_APP_" src/environments || true
      # attendu : (no output)

      - name: Build Angular app
        run: npm run build -- --configuration=production

      # POUR DEBUG UNIQUEMENT
      #- name: Inspect dist output
      #  run: |
      #    grep -R "NG_APP_" dist || true
      # attendu : (no output)

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: angular-build
          path: dist/ia-stock-portfolio/browser
     
````

### Notes pratiques

* Les étapes de debug (````cat environment.ts````, ````grep NG_APP_````) sont optionnelles et peuvent être activées pour vérifier que toutes les variables ont bien été remplacées.
* Ne jamais versionner vos secrets dans Git.

</details>

# Utilisation au runtime

<details>
	<summary>Changer de fichier environnement au runtime</summary>


* 1 - créer un répertoire *config* sous *src*

* 2 - créer autant de fichiers *config.env.json* nécessaire que de configurations voulues :
````
src
 ├── config
 │    ├── development
 │    │       └── config.env.json 
 │    └── production
 │            └── config.env.json
 ├── assets
...
````

example de structure des fichier *config.env.json* 
````json
{
  "production": true,
  "baseUrl": "https://www.my-site/api",
  "title": "PROD MODE",
  "baseHref": "/int/mySite/"
}
````

* 3 - Rendre accessible le répertoire config comme un asset

ajouter *"src/config"* dans les *"assets"* du *angular.json*

````json
 "assets": [
              "src/favicon.ico",
              "src/assets",
              "src/config"
            ],
````

* 4 - création d'un service *ConfigService*

<details>
  <summary>Code</summary>

*config.service.ts*
````typescript
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

export type Config = {
  production: boolean,
  baseUrl: string,
  title: string
}
declare global {
  interface Window {
    MY_APP_ENV: string;
  }
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config: Config | undefined = undefined;
  private http = inject(HttpClient);
  private environment: string;

  constructor() {
    // Accéder à l'environnement à partir de process.env ou window selon le contexte d'exécution
    // this.environment = (typeof process !== 'undefined' && process.env && process.env['NODE_ENV']) ?
    //   process.env['NODE_ENV'] : (typeof window !== 'undefined' && window['MY_APP_ENV']) ? window['MY_APP_ENV'] : 'development';

    this.environment = process.env['NODE_ENV'] ?? 'development';
  }

  get config(): Config | undefined { return this._config; }
  set config(value: Config) { this._config = value; }

  loadConfig() {
    const configFilePath = `../config/${this.environment}/config.env.json`;
    return this.http.get<any>(configFilePath)
      .pipe(
        tap((config: Config) => this._config = config)
      );
  }
}

// Factory qui sera utilisée dans le app.config.ts
export const initConfig = (configService = inject(ConfigService)) => {
  return () => configService.loadConfig()
}
````
  
</details>

* 5 - Injecter le ConfigService avec le token APP_INITIALIZER dans le *app.config.ts*

*app.config.ts*
````typescript
 providers: [
    // ...
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
````

* 6 - Lecture de la configuration chargée

Lire la configuration chargée et l'utiliser de la manière suivante 

*app.component.ts*
````typescript
config: Config | undefined;
  private configService = inject(ConfigService);

  constructor() {
    this.config = this.configService.config;
  }
````

* 7 - Installation du types node

````npm i --save-dev @types/node````

* 8 - ajouter le type node dans *tsconfig.app.json*
````json
{
  ...
  "compilerOptions": {
    ...
    "types": ["node"]
  },
 ...
}
````
			
* 9 - compilation

compiler maintenant en spécifiant l'environnement souhaité : 
````
ng build --configuration=development 
ng build --configuration=production
````

DOC : 
https://nx.dev/recipes/angular/use-environment-variables-in-angular
 
</details>

# Solution avec assets http

<details>
	<summary>Implémentation</summary>

Ensuite la lecture peut se faire au lancement de l'application via un httpClient

> ATTENTION : version non optimisée, en effet il est préférable d'injecter le service qui lit les données dans une factory appellée dans le APP_INITIALIZER ([voir solution 2](#app_initializer))

*app.component.ts*

````typescript
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  settingsObservable: Subscription;

  constructor(private dataService: DataService) {
    // read settings
    this.settingsObservable = this.dataService.getAppSettings()
    .subscribe(res => {
      console.log(res);
    })
  }

  ngOnDestroy() {
    this.settingsObservable.unsubscribe();
  }
}

````

*data-service.ts*

````typescript
export class DataService {
  private _appSettingsUrl = 'assets/env/settings.json';

  constructor(private http: HttpClient) { }
  
  //lire les settings json
  getAppSettings(): Observable<any> {
    return this.http.get(this._appSettingsUrl);
  }
}
````
 
</details>

# APP_INITIALIZER 

<details>
	<summary>Solution avec APP_INITIALIZER</summary>

APP_INITIALIZER est un type multi-provider qui permet de spécifier une factory qui retourne une promise. Quand la promise est *complete* l'application continue son exécution. Ainsi, lorsqu'on arrive à l'endroit du code code où nous avons besoin des informations de configuration, on est certain qu'elles ont été chargées.

*app.module.ts*
````typescript
import { APP_INITIALIZER } from '@angular/core'
@NgModule({
    ....
    providers: [
        ...
        {
            provide: APP_INITIALIZER,
            useFactory: load,
            multi: true
        }
    ]
)
````

*load* est une fonction qui retourne une fonction qui retourne une **Promise**. La fonction Promise charge les informations de configuration et les enregistre dans l'application. Une fois que les infos de configuration ont été chargées, il faut resolve la promise **resolve(true)**.

Dernier point vraiment **important**, sans ça le code n'attendra pas d'avoir terminé avant de continuer, *useFactory* **DOIT** pointer vers une fonction qui pointe sur une **Promise**

*multi* : true est appliqué car APP_INITIALIZER autorise plusieurs instances de ce provider. Toutes les instances sont exécutées simultanément mais le code ne continuera pas tant que toutes les instances (Promises) ne sont pas terminées.
 
</details>


## Solution avec factory
[Back to top](#variables-environnement)

<details>
	<summary>Cette solution utilise une factory dans le APP_INITIALIZER</summary>

https://www.prestonlamb.com/blog/loading-app-config-in-app-initializer

### exemple perso

Définir des interfaces :

*interfaces.ts*
````typescript
export interface IEnvironmentVariable {
    AppSettings: IAppSettings
}
export interface IAppSettings {
    site: string,
    url: string,
    tracelog: boolean,
    api: string
}
````

*app.module.ts*

````typescript
import { AppconfigService } from './shared/services/appconfig.service';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
...

export function initConfig(appConfigService: AppconfigService) {
  return () => appConfigService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ...
  ],
  providers: [{
		provide: APP_INITIALIZER,
		useFactory: initConfig,
		deps: [ AppconfigService ],
		multi: true
	}],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*AppConfigService.ts*
````typescript
import { IEnvironmentVariable } from './../models/config.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {
  private _config: IEnvironmentVariable;
  configSubject$;

  public get config(): IEnvironmentVariable { return this._config; }
  public set config(value: IEnvironmentVariable) { this._config = value; }
  
  constructor(private _http: HttpClient) {}

  public loadConfig() {
      
      return this._http.get('assets/env/settings.json')
          .toPromise()
          .then((config: IEnvironmentVariable) => {
              this.config = config;
              return this.config;
              //this.configSubject$.next(this.config);	// error  
          })
          .catch((err: any) => {
              console.error(err);
          });
  }
}
````

*app.component.ts*
````typescript
  env: IEnvironmentVariable;
  settings: IAppSettings;

  constructor(private appconfigService: AppconfigService) { }
  
  ngOnInit() {
    this.env = this.appconfigService.config;
    this.settings = this.env.AppSettings;
  }
````

</details>

<details>
	<summary>Exemple complexe</summary>


*exemple*

````typescript
import { Config } from 'projects/Apps/Example/src/configs/config';
import { ApisConfig, ApisConfigurationProvider, ApisServicesModule } from 'apis-helpers';
import { UncatchedErrorHandler } from 'angular-helpers';

/**
 * Use to update config of library after loaded in APP_INITIALIZER
 */
@Injectable({ providedIn: 'root' })
export class ConfigFromApp extends ApisConfigurationProvider {
  constructor(private configStore: Config) {
    super();
    console.log('Load application configuration');
  }

  get params(): ApisConfig {
    return this.configStore.params;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApisServicesModule.forRoot({
      config: {
        provide: ApisConfigurationProvider,
        useClass: ConfigFromApp
      }
    })
  ],
  declarations: [
    AppComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
      provide: LoggerConfig,
      useFactory: resolveNgxLoggerConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: Config) => () => configService.loadConfig(),
      deps: [Config], multi: true
    },
    { provide: ErrorHandler, useClass: UncatchedErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function resolveNgxLoggerConfig(): LoggerConfig {
  const suffix = Config.getApiSuffix(Config.params.logsApi);
  const config = {
    serverLoggingUrl: (Config.params ? Config.params.logsApi + suffix + '/logs' : undefined),
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.INFO
  };
  return config;
}
````

*config.ts*
````typescript
import { Injectable } from '@angular/core';
import configForTest from './config.json';
import configEnvForTest from './config.test.json';
import { ConfigService } from 'angular-helpers';
import { ApisConfigurationInterface } from 'apis-helpers';

@Injectable({ providedIn: 'root' })
export class Config extends ConfigService {

  static params: ApisConfigurationInterface;
  public params: ApisConfigurationInterface;
  public paramsPromise: Promise<ApisConfigurationInterface>;

  configUrl = 'configs/config.json';
  configEnvUrl = 'configs/config.env.json';

  static loadConfigForTest() {
    ConfigService.params = Object.assign({}, configForTest, configEnvForTest);
  }

  static apiUseGateway(api: string): boolean {
    return api.startsWith(this.params.gatewayApi);
  }

  static getApiSuffix(api: string): string {
    return this.apiUseGateway(api) ? '' : '/api';
  }

  static getHubSuffix(api: string): string {
    return this.apiUseGateway(api) ? 'Hub' : '';
  }

  static loadConfig(callback: (config: ApisConfigurationInterface) => void) {
    super.loadConfig(callback);
  }

  public loadConfig(): Promise<ApisConfigurationInterface> {
    return <Promise<ApisConfigurationInterface>> super.loadConfig();
  }
}
```` 
</details>

### Conclusion

Peut importe la méthode, il est maintenant possible de modifier le fichier json de configuration présent dans le répertoire *assets* après compilation (répertoire dist) et faire un ctrl-f5 pour voir la mise à jour des variables.

[Back to top](#variables-environnement)
