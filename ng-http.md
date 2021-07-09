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

````typescript
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthIS4Service } from 'angular-helpers';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class RclmsAuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthIS4Service) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.authService.accessToken;
        if (token != null) {
          authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        }
        return next.handle(authReq);
    }
}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: RclmsAuthInterceptor, multi: true }
];
````

[Back to top](#codes-retour-http)
