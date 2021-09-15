[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Codes retour http

* [Catch](#catch)     
* [Http interceptor](#http-interceptor)     

## Catch

Capturer les erreurs http unitairement dans l'observable

````typescript
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

fetchData() {
	return this.http.get('http://...')
	.pipe(
		map (...),
		catchError(errorResp => {
			// send to analytics server…
			return throwError(errorResp);
		})
	);
}
````

## HTTP Interceptor

### Gestion des erreurs Http avec HTTP_INTERCEPTORS

**A TERMINER**

*app.module.ts*

````typescript
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [],
  entryComponents: [],
  exports: [AppComponent],
  imports: [AppRoutingModule, HttpClientModule, CoreModule.forRoot()],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
````

*HttpErrorInterceptorService*

````typescript
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(private tools: ToolsService,
              @Inject(DOCUMENT) private document: Document,) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `>>>Error: ${error.error.message}`;
                  } else {
                    // server-side error
                    errorMessage = `>>>Error Status: ${error.status}\nMessage: ${error.message}`;
                }
                console.log(errorMessage);
                switch (error.status) {
                  case 0 :  
                    // Traitement ici
                    break;
                  case 500 :
                  // Traitement ici
                    break;
                  case 401 :
                    // Traitement ici
                    break;
                  case 400 :
                  // Traitement ici
                    break;
                  case 404 :
                  // Traitement ici
                    break;
                  case 403 :
                  // Traitement ici
                    break;
                  default:
                    break;
                }
                return throwError(errorMessage);
            })
        );
    }
}
````   

### Gestion du Bearer token avec Interceptor

Ajouter automatiquement le Bearer token à toutes les requêtes http

*httpInterceptorService*

````typescript
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    // Ne pas activer l'ajout du token sur l'api d'authentification
    if (req.urlWithParams.indexOf('/api/User/Login') <= 0) {

      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
    }
    return next.handle(authReq);
  }
}
````

*auth.service.ts*

````typescript
import { ApiHelperService } from './api-helper.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { UserService } from '../api/services';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient, private apiHelper: ApiHelperService, private userService: UserService) {
    //this.loadToken();
  }

  async loadToken() {
    const token = await localStorage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(credentials: {login; password}): Observable<any> {
      return this.userService.apiUserLoginPost$Plain({
        body: credentials
      })
      .pipe(
        map((data: any) => JSON.parse(data)),
        map((data: any) => {
          localStorage.setItem(TOKEN_KEY,data.token)
          return data
        }),
        tap(_ => {
          this.isAuthenticated.next(true);
      }));
  }

  logout(): void {
    this.isAuthenticated.next(false);
    return localStorage.removeItem(TOKEN_KEY);
  }
}
````

*app.module.ts*

````typescript
import { HttpInterceptorService } from 'my-services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [ComponentsModule,],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: HttpInterceptorServiceService,
      multi   : true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````

[Back to top](#codes-retour-http)
