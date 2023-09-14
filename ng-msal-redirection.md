[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# MSAL Redirection vers App mobile

## Présentation

L'utilisation d'une authentification Azue via la librairie MSAL nécessite une configuration particulière lorsqu'elle est utilisée dans une application mobile. En effet, de base, la redirection post-authentification
ne fonctionne pas lorsqu'on s'identifie depuis une application mobile car l'url de retour est différente. Il faut donc créer un sevice permettant de créer une nouvelle instance de browser permettant de gérer le remplacement de l'url de retour

## Installation

Installer les modules

````
npm i @awesome-cordova-plugins/core --save
npm install @awesome-cordova-plugins/in-app-browser
````

*app.module.ts*
````typescript
import { PlatformModule } from '@angular/cdk/platform';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    PlatformModule,  
  ],
  providers: [
    InAppBrowser
  ]
})
````

## Service customNavigation

<details>
  <summary>Création d'un service permettant d'ouvrir l'url sortante dans une nouvelle instance de InAppBrowser</summary>

````typescript
import { NavigationClient } from '@azure/msal-browser';
import { Injectable, inject } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@angular/cdk/platform';

import { Capacitor } from '@capacitor/core';  // Variante application avec Capacitor

@Injectable({
  providedIn: 'root'
})

export class CustomNavigationClient extends NavigationClient {

  platform = inject(Platform);

  constructor(private iab: InAppBrowser) {
    super();
  }
  //: Promise<boolean>
  async navigateExternal(url: string, options: any) {

    // if (Capacitor.isNativePlatform()) {  // Variante application avec Capacitor
    if (this.platform.IOS || this.platform.ANDROID) {
      const browser = this.iab.create(url, '_blank', {
        location: 'yes',
        clearcache: 'yes',
        clearsessioncache: 'yes',
        hidenavigationbuttons: 'yes',
        hideurlbar: 'yes',
        fullscreen: 'yes',
        cleardata: 'no'

      });
      browser.on('loadstart').subscribe(event => {
        console.log(event);
        if (event.url.includes('#code') || event.url.includes('#state')) {
          browser.close();

          const domain = event.url.split('#')[0];
          const urlToRedirect = event.url.replace(domain, 'http://localhost/');
          console.log('will redirect to:', urlToRedirect);

          window.location.href = event.url;
          // window.location.assign(url);
        }
        if (event.url.endsWith('/log-out') || event.url.endsWith('/logoutsession')) {
          browser.close();

          window.location.href = 'http://localhost/login';
          // window.location.assign(url);
        }
      });
    } else {
      if (options.noHistory) {
        window.location.replace(url);
      } else {
        window.location.assign(url);
      }
    }
    return true;
  }
}
````

[Back to top](#msal-redirection-vers-app-mobile)    

</details>

## Utilisation

<details>
  <summary>Ajouter le code suivant dans le principal</summary>

````typescript
import { MsalService } from '@azure/msal-angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CustomNavigationClient } from 'angular-helpers/auth-azure/services/customNavigationClient.service';

export class HomeComponent {
    constructor(
      private authService: AuthentificationService,
      private msalAuthService: MsalService,
      private iab: InAppBrowser,
    ) {
      this.msalAuthService.instance.setNavigationClient(new CustomNavigationClient(this.iab));
      this.isLoggedIn$ = this.authService.isAuthenticated$;
    }
}
````

</details>

[Back to top](#msal-redirection-vers-app-mobile)    
