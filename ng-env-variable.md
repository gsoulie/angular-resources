[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Variables environnement

* [Solution avec assets http](#solution-avec-assets-http)     
* [APP_INITIALIZER](#app_initializer)       
* [Solution avec factory](#solution-avec-factory)     

Dans certains cas il est nécessaire de pouvoir changer certaines variables d'environnement après compilation (ex : déploiement multi-sites, multi-environnements etc...)

Angular met à disposition un répertoire *environnements* contenant les fichiers *environment.prod.ts* et *environment.ts*. Ces fichier sont pratiques dans le cas du déploiement d'une application simple, sur un environnement unique. Mais pose quelques problèmes dans le cas d'un déploiement plus complexe. 
En effet les fichiers du répertoire *environments* sont compilés lors du build et ne sont alors plus accessibles ce qui pose problème si l'on souhaite pouvoir modifier certaines variables après compilation.

Pour pallier ce problème, il existe plusieurs solutions. Dans tous les cas, la première étape consiste à créer un fichier json qui contiendra les variables d'environnement et qui sera placé dans le répertoire *assets* ou dans un autre répertoire au même niveau. 

> En effet, les fichiers présents dans le répertoire *assets* restent accessibles et modifiables après compilation.

Par exemple :

*assets/env/settings.json*
````
{
    "AppSettings": {
		"Environment": "Develop"
        "url": "url-de-prod",
        "api": "https://api-prod"
    }, 
	"Logging": {
		"LogLevel": {
			"Default": "Warning"
		}
	},
	"AllowedHosts": "*"
}
````

## Solution avec assets http

Ensuite la lecture peut se faire au lancement de l'application via un httpClient

> ATTENTION : version non optimisée, en effet il est préférable d'injecter le service qui lit les données dans une factory appellée dans le APP_INITIALIZER (voir solution 2)

*app.component.ts*

````
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

````
export class DataService {
  private _appSettingsUrl = 'assets/env/settings.json';

  constructor(private http: HttpClient) { }
  
  //lire les settings json
  getAppSettings(): Observable<any> {
    return this.http.get(this._appSettingsUrl);
  }
}
````

## APP_INITIALIZER 

APP_INITIALIZE est un type multi-provider qui permet de spécifier une factory qui retourne une promise. Quand la promise est *complete* l'application continue son exécution. Ainsi, lorsqu'on arrive à l'endroit du code code où nous avons besoin des informations de configuration, on est certain qu'elles ont été chargées.

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
*load* est une fonction qui retourne une fonction qui retourne une **Promise**. La fonction Promise charge les informations de configuration et les enregistre dans l'application. Une fois que les infos de configuration ont été chargées, il faut resolve la promise **resolve(true)**.

Dernier point vraiment **important**, sans ça le code n'attendra pas d'avoir terminé avant de continuer, *useFactory* **DOIT** pointer vers une fonction qui pointe sur une **Promise**

*multi* : true est appliqué car APP_INITIALIZER autorise plusieurs instances de ce provider. Toutes les instances sont exécutées simultanément mais le code ne continuera pas tant que toutes les instances (Promises) ne sont pas terminées.

## Solution avec factory
[Back to top](#variables-environnement)

Cette solution utilise une factory dans le APP_INITIALIZER app.module.ts

https://www.prestonlamb.com/blog/loading-app-config-in-app-initializer

### exemple perso

*interfaces*
````
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

````
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
````
import { IEnvironmentVariable } from './../models/config.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {
  private _config: IEnvironmentVariable;
  configSubject$;

  public get config(): IEnvironmentVariable {
    return this._config;
  }
  public set config(value: IEnvironmentVariable) {
    this._config = value;
  }
  
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
````
  env: IEnvironmentVariable;
  settings: IAppSettings;

  constructor(private appconfigService: AppconfigService) { }
  
  ngOnInit() {
    this.env = this.appconfigService.config;
    this.settings = this.env.AppSettings;
  }
````


### Exemple complexe
[Back to top](#variables-environnement)    

*exemple*

````
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
````
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

[Back to top](#variables-environnement)
