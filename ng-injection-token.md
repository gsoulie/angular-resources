[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Injection token et Factory

https://www.youtube.com/watch?v=GvA7xnBmEto&ab_channel=MonsterlessonsAcademy      

Utilisation des injection token et factory.

Un provider prend en paramètre un *token* dans son paramètre ````provide```` et une valeur qui peut être un objet (*useValue*) ou le résultat d'une fonction (*useFactory*).
Lors de son utilisation, le token sera remplacé par la valeur ou la fonction paramétré.

Le token **APP_INITIALIZER** est un token particulier qui permet d'exécuter du code **AVANT** que l'application ne soit **démarrée**. Dans le cas ou ce comportement ne convient pas à l'effet recherché, il est alors possible de créer ses propres token. On les déclare donc avec ````new InjectionToken()````

**note** : toutes les dépendances utilisées par une factory doivent être déclarées dans le paramètres ````deps: []```` du provider.

## Injection Token avec useValue

*app.module.ts*

````typescript
export const APP_DESCRIPTION = new InjectionToken<{ title: string, description: string } | null>(null);

@NgModule({
  declarations: [ AppComponent ],
  imports: [...],
  providers: [
    { provide: APP_DESCRIPTION, useValue: { title: 'title from provider', description: 'this os a description from provider' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*app.component.ts*

````typescript
import { APP_DESCRIPTION } from './app.module';

export class AppComponent implements OnInit {

  constructor(@Inject(APP_DESCRIPTION) private config: { title: string, description: string } | null) {
    console.log(`%cLoad APP_DESCRIPTION from provider : ${JSON.stringify(config)}`, 'color:green');
  }
````


## Injection Token avec useFactory et APP_INITIALIZER

> ATTENTION : APP_INITIALIZER est **déprécié depuis Angular 19**
> 
[Dépréciation du token **APP_INITIALIZER** - conversion](https://www.techiediaries.com/app_initializer-deprecated-angular-19-provideappinitializer/). Très utilisé pour l'injection de configuration lors de l'initialisation de l'application, ce token est remplacé par la syntaxe suivante :

**Ancienne syntaxe (< Angular 20)**

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: APP_INITIALIZER,
      useFactory: (configFilePath: string) => initAuthAzureConfig(configFilePath),
      deps: ['APP_AZURE_AUTH_CONFIG_FILE'],
      multi: true
    },
    { provide: 'APP_AZURE_AUTH_CONFIG_FILE', useValue: '../assets/env/auth-azure-config.json' },


````

**Nouvelle syntaxe (> Angular 20)**

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    
    provideAppInitializer(() => {
      const azureConfigService = inject(AuthAzureConfigService);
      return azureConfigService.loadConfig('../assets/env/auth-azure-config.json')
    }),

````

*FactoryService.ts*

````typescript
export function configLoaderFactory(testService: TestConfigService) {
  return () => {
    const config: Config = {
      name: 'test config',
      guid: self.crypto.randomUUID()
    }

    testService.setConfig(config);

    return config;
  }
}
````

*TestConfigService.ts*

````typescript
import { Injectable } from "@angular/core";

export type Config = {
  name: string,
  guid: string
}

@Injectable({ providedIn: 'root' })
export class TestConfigService {

  private config: Config;

  constructor() { }

  getConfig() { return this.config; }

  setConfig(config: Config) { this.config = config; }

  getUUID(): string { return self.crypto.randomUUID(); }
}
````

*app.module.ts*

````typescript
@NgModule({
  declarations: [ AppComponent ],
  imports: [...],
  providers: [
    { provide: APP_INITIALIZER, useFactory: configLoaderFactory, deps: [TestConfigService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*app.component.ts*

````typescript
import { APP_DESCRIPTION } from './app.module';

export class AppComponent implements OnInit {

  constructor(private configService: TestConfigService) {
    console.log(`%c### Load configuration from provider : ${JSON.stringify(this.configService.getConfig())}`, 'color:green');
  }
````

## useFactory

*app.module.ts*

````typescript
import { AppConfig } from './shared/services/testConfig';
import { configLoaderFactory2 } from './shared/services/testFactory.service';
import { TestConfigService } from './shared/services/testService.service';

@NgModule({
  declarations: [ AppComponent ],
  imports: [...],
  providers: [
    { provide: AppConfig, useFactory: configLoaderFactory2, deps: [TestConfigService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*testFactory.service.ts*

````typescript
export function configLoaderFactory2(testService: TestConfigService) {

  const config: Config = {
    name: 'initial config',
    guid: testService.getUUID()
  }

  return config;
}
````

*testService.service.ts*

````typescript
import { Injectable } from "@angular/core";

export type Config = {
  name: string,
  guid: string
}

@Injectable({ providedIn: 'root' })

export class TestConfigService {

  private config: Config;

  constructor() { }

  getConfig() { return this.config; }

  setConfig(config: Config) { this.config = config; }

  getUUID(): string { return self.crypto.randomUUID(); }
}
````

*app.component.ts*

````typescript
import { APP_DESCRIPTION } from './app.module';

export class AppComponent implements OnInit {

  constructor(private appConfig: AppConfig) {
    console.log(`%c### Load configuration from provider : ${this.appConfig}`, 'color:green');
	console.log(`%c### Load configuration from provider : ${JSON.stringify(appConfig)}`, 'color:green');	// retirer le this
  }
````

## Injection token et useFactory

*app.module.ts*

````typescript
import { AppConfig } from './shared/services/testConfig';
import { configLoaderFactory2 } from './shared/services/testFactory.service';
import { TestConfigService } from './shared/services/testService.service';

export const MY_INJECTION_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG');

@NgModule({
  declarations: [ AppComponent ],
  imports: [...],
  providers: [
    { provide: MY_INJECTION_TOKEN, useFactory: configLoaderFactory3, deps: [TestConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

*testFactory.service.ts*

````typescript
export function configLoaderFactory3(testService: TestConfigService): AppConfig {
  const config = new AppConfig()
  config.name = 'initial config',
    config.guid = testService.getUUID()

  return config;
}
````

*app.component.ts*

````typescript
import { APP_DESCRIPTION } from './app.module';

export class AppComponent implements OnInit {

  constructor(@Inject(MY_INJECTION_TOKEN) MyToken) {
    console.log(`%c### Load AppConfig from provider : ${JSON.stringify(MyToken)}`, 'color:green');
  }
````
