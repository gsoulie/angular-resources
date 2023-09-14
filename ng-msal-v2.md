[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Authentification msal-angular v2 + API NodeJS

## Installation et configuration de l'authentification avec gestion des rôles et sécurisation API NodeJS

- L'installation du paquet est ici : [https://www.npmjs.com/package/@azure/msal-angular](https://www.npmjs.com/package/@azure/msal-angular)
- Il faut également installer ce paquet : [https://www.npmjs.com/package/@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser)
- Tutoriel de référence : [https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles/SPA](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/tree/main/5-AccessControl/1-call-api-roles/SPA)
- Tutoriel pour la gestion des tokens : [https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-angular-spa-app](https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-angular-spa-app)

## Aperçu

Ce tuto explique pas à pas comment utiliser la bibliothèque msal-angular version 2 sur une application angular. 
Le but est d’authentifier un utilisateur, déterminer son rôle et de générer un jeton utilisable par l’api pour vérifier sa portée.

Nous utiliserons les inscriptions d’applications d’Azure AD à tenant unique.

## Note

Ce tuto est utilisable même si vous ne gérez pas l’api. Il y a un exemple pour insérer le Bearer token manuellement via un interceptor. 

<details>
  <summary>Enregistrement des applications (Azure AD)</summary>
  
Pour permettre à votre application de se connecter avec Azure AD et d'appeler une API web, vous devez enregistrer deux applications dans votre locataire Azure AD :

L' inscription d'application monopage (Angular) permet à votre application de se connecter avec Azure AD. Lors de l'enregistrement de l'application, vous spécifiez l' URI de redirection . L'URI de redirection est le point de terminaison vers lequel l'utilisateur est redirigé après s'être authentifié auprès d'Azure AD. Le processus d'enregistrement de l'application génère un ID d'application , également appelé ID client , qui identifie de manière unique votre application.

L' inscription à l'API Web permet à votre application d'appeler une API Web protégée. L'enregistrement expose les autorisations de l'API Web (étendues). Le processus d'enregistrement de l'application génère un ID d'application qui identifie de manière unique votre API Web. Accordez à votre application Angular des autorisations sur les champs d'application de l'API Web.

### 1.1 Enregistrement de l'API

#### 1.1.1 Onglet Exposer une API

A partir de l'accueil : Inscriptions d'applications -> rechercher l'application.

a. Onglet Exposer une API -> Ajouter (Laisser le nom de base api://{guid})
b. Ajouter une étendue -> app.read (Remplir les autres champs obligatoire)
c. Ajouter une étendue -> app.write

#### 1.1.2 Onglet Rôle d'application

a. Onglet Rôles d'application -> Créer un rôle d'application
  1. Pour le type de membres autorisés, choisir ```APPLICATIONS```. Cela configure le token en fonction et permet sa vérification.

#### 1.1.3 Onglet Manifeste

Modifiez la valeur de ```"accessTokenAcceptedVersion": null``` par ```"accessTokenAcceptedVersion": 2```

### 1.2 Enregistrement de l'application Angular

#### 1.2.1 Onglet Authentification

Cochez les cases ```Jetons d'accès``` et ```jetons d'ID``` dans l'encart Octroi implicite et flux hybrides.

`app.module.ts :`

#### 1.2.2 Onglet API autorisées

a. Ajouter une autorisation -> 

Pour microsoft Graph : ```Offline-access``` & ```openid``` à ajouter

Pour l'api : 

Sélectionnez le nom de l'api précédemment créé et sélectionné les étendues précédemment créé.

Résultat : 

#### 1.2.3 Onglet Manifeste

Modifiez la valeur de ```"accessTokenAcceptedVersion": null``` par ```"accessTokenAcceptedVersion": 2```

#### 1.2.4 Onglet Vue d'ensemble

Copier la valeur du client ID

### 1.3 Autorisation de l'application cliente

Retourner sur Inscriptions d'applications -> API

Allez dans l'onglet ```Exposer une API``` et cliquez sur ```Ajouter une application cliente```.

Collez l'ID Client précédemment copié et cochez les étendues puis ```Ajouter une application```.

</details>

<details>
  <summary>Paramétrage Angular MSAL</summary>


```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, ProtectedResourceScopes } from '@azure/msal-angular';
import { FailedComponent } from './components/auth/failed/failed.component';
import { msalConfig, protectedResources } from './config/auth-config';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor } from './services/auth.interceptor';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

  protectedResourceMap.set(protectedResources.toDoListAPI.endpoint, [
      {
          httpMethod: 'GET',
          scopes: [...protectedResources.toDoListAPI.scopes.read]
      },
      {
          httpMethod: 'POST',
          scopes: [...protectedResources.toDoListAPI.scopes.write]
      },
      {
          httpMethod: 'PUT',
          scopes: [...protectedResources.toDoListAPI.scopes.write]
      },
      {
          httpMethod: 'DELETE',
          scopes: [...protectedResources.toDoListAPI.scopes.write]
      }
  ]);

  return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: []
    },
    loginFailedRoute: '/login-failed'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    FailedComponent,
    LoginComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MsalModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    // Dans le cas où l'on veut ajouter le token manuellement.
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }

```

`config/auth-config.ts :`

```typescript
import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { config } from 'src/env/env';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export const msalConfig: Configuration = {
    auth: {
        clientId: config.clientId,
        authority: 'https://login.microsoftonline.com/' + config.tenant,
        redirectUri: config.redirect,
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE,
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel: LogLevel, message: string) {
                 console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false
        }
    }
}

export const protectedResources = {
    toDoListAPI: {
        endpoint: 'http://localhost:4070/',
        scopes: {
            read: ['api://<guid>/tasks.read'],
            write: ['api://<guid>/tasks.write'],
        },
    },
};

```

`app-routing.module.ts :`

A noter que les routes suivantes sont obligatoires : *auth*, *login* et *login-failed*

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthguardService } from './services/authguard.service';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { FailedComponent } from './components/auth/failed/failed.component';
import { LoginComponent } from './components/auth/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard, AuthguardService], data: { expectedRole: 'Dev' } },
  { path: 'auth', component: MsalRedirectComponent },
  { path: 'login', component: LoginComponent, canActivate: [MsalGuard] },
  { path: 'login-failed', component: FailedComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        scrollPositionRestoration: 'enabled',
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

`authguard.service.ts :`

```typescript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthguardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        switchMap(() => {

          const expectedRole1 = route.data.expectedRole;
          const expectedRole2 = route.data.expectedRole2;

          if (this.msalService.instance.getAllAccounts().length > 0) {

            let accounts = this.msalService.instance.getAllAccounts();

            let role = accounts[0].idTokenClaims['roles'][0];

            if (role == 'role') {

              return of(true);
            } else {
              window.alert('Accès non autorisé.');
              return of(false);
            }
          }
          this.authService.redirectUrl = state.url;
          this.router.navigate(['/login']);
          return of(false);
        })
      );
  }
}

```

`index.html :`

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>APP</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.png">
</head>
<body>
  <app-root></app-root>
  <app-redirect></app-redirect>
</body>
</html>

```

`login.component.ts`

```typescript
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, BrowserUtils, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const currentPath = this.location.path();
    // Dont perform nav if in iframe or popup, other than for front-channel logout
    this.isIframe = BrowserUtils.isInIframe() && !window.opener && currentPath.indexOf("logout") < 0; // Remove this line to use Angular Universal
    this.setLoginDisplay();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {

        this.setLoginDisplay();
        this.checkAndSetActiveAccount();

        if(this.loginDisplay){
          if(this.authService.redirectUrl.length > 0){
            this.router.navigate(['/' + this.authService.redirectUrl]);
          }else{
            this.router.navigate(['/']);
          }
        }
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}


```

`auth.interceptor.ts`

Dans le cas où l'on veut ajouter le token manuellement.

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, from, retry, throwError } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { config } from './../../../src/env/env';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private msalService: MsalService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handleAccess(request, next))
            .pipe(
                retry(2),
                catchError((error) => {
                    const errorMsg = `Error: ${error.error.message}`;
                    return throwError(() => error instanceof Error ? errorMsg : new Error(errorMsg));
                })
            )
    }

    private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts found.');
        }

        const token = await this.getAccessToken();

        const headers = this.buildHeaders(token);

        const authReq = request.clone({ headers });
        return firstValueFrom(next.handle(authReq));
    }

    private async getAccessToken(): Promise<string> {
        try {
            const res = await this.msalService.instance.acquireTokenSilent({
                
                scopes: ['user.read', 'openid', 'profile', "api://tasks-api/tasks.read"],
                authority: `https://login.microsoftonline.com/${config.tenant}`,
                account: this.msalService.instance.getAllAccounts()[0],
            });

            const { accessToken } = res;
            localStorage.setItem('_access_token', accessToken);
            return accessToken;
        } catch (error) {
            console.log('Error acquiring access token:', error);
            throw new Error('Failed to acquire access token.');
        }
    }

    private buildHeaders(bearerToken: any): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`
        });
    }
}

```

</details>

<details>
  <summary>Paramétrage de l'API NodeJS</summary>

### Installation des paquets 

Il faut installer les paquets `passport`et `passport-azure-ad`

```cmd
npm install passport
npm install passport-azure-ad
```

Ajoutez un fichier de configuration (le mien est nommé azure.config.json et il se trouve à la racine du répertoire du projet Node) qui contient toutes les constantes nécessaires pour autoriser les requêtes côté serveur.

```json
{
  "credentials": {
    "tenantID": "TENANT-ID",
    "clientID": "CLIENT-ID",
    "audience": "CLIENT-ID"
  },
    "resource": {
        "scope": [
            "tasks.read",
            "tasks.write"
        ]
    },
  "metadata": {
    "authority": "login.microsoftonline.com",
    "discovery": ".well-known/openid-configuration",
    "version": "v2.0"
  },
  "settings": {
    "validateIssuer": false,
    "passReqToCallback": false,
    "loggingLevel": "info"
  }
}
```

index.js ou app.js 

```javascript
const express = require('express');
const app = express();
const port = 8000;

/**
 * Authentication dependencies
 */
const passport = require('passport');
const azureConfig = require('./azure.config.json');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

/**
 * Unprotected resources
 */

app.get('/unprotected-resource', (req, res) => {
    res.send('Hello! This resource is unprotected.')
});

/**
 * Protected resources
 */

const options = {
    // https://login.microsoftonline.com/<your_tenant_guid>/.well-known/openid-configuration
    identityMetadata: `https://${azureConfig.metadata.authority}/${azureConfig.credentials.tenantID}/${azureConfig.metadata.version}/${azureConfig.metadata.discovery}`,

    /**
     * Required if you are using common endpoint and setting `validateIssuer` to true.
     * For tenant-specific endpoint, this field is optional, we will use the issuer from the metadata by default.
     * issuer: `https://${azureConfig.metadata.authority}/${azureConfig.credentials.tenantID}/${azureConfig.metadata.version}`,
     */
    // @ts-ignore
    issuer: `https://${azureConfig.metadata.authority}/${azureConfig.credentials.tenantID}/${azureConfig.metadata.version}`,

    validateIssuer: azureConfig.settings.validateIssuer,

    clientID: azureConfig.credentials.clientID,

    audience: azureConfig.credentials.audience,

    passReqToCallback: azureConfig.settings.passReqToCallback,

    loggingLevel: azureConfig.settings.loggingLevel,

    scope: azureConfig.resource.scope,

    // If this is set to true, no personal information such as tokens and claims will be logged. The default value is true.
    loggingNoPII: true,

    /**
     * This value is the clock skew (in seconds) allowed in token validation. It must be a positive integer.
     * The default value is 300 seconds.
     */
    clockSkew: 320
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Verifying the user
        /**
          *  You can use a function here that will lookup the users and add additional information to the user
          *  object.
         **/
        const user = {};
        // Send user info using the second argument
        // console.log('token', token);
        return done(null, user, token);
    }
);

app.use(passport.initialize());

passport.use(bearerStrategy);

// API endpoint exposed
app.use(passport.authenticate('oauth-bearer', {session: false}),
    (req, res, next) => {

        // console.log('req.authInfo', req.authInfo);

        // Information will be available for request life cycle on server side, e.g. req.authInfo['name'] for requestor name
        res.locals.authInfo = req.authInfo;

        return next();
    }
);

app.get('/protected-resource', (req, res) => {
    res.send('Hello! This resource is protected.')
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
```
  
</details>
