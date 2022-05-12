[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# requêtes Http

* [Bonnes pratiques](https://levelup.gitconnected.com/the-correct-way-to-make-api-requests-in-an-angular-application-22a079fe8413)     
* [Catch](#catch)     
* [Http interceptor](#http-interceptor)     
* [Multipart Form Data](#multipart-form-data)      
* [Mise en cache requête](#mise-en-cache-requête)     

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

https://www.youtube.com/watch?v=OHbWHO1Iq5o&ab_channel=ng-conf      

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

@Injectable()	// <--- IMPORTANT on n'injecte pas l'interceptor au niveau 'root', il doit être injecté au MÊME endroit que le module HttpClient

export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(private tools: ToolsService,
              @Inject(DOCUMENT) private document: Document,) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
): Observable<HttpEvent<any>> {

    // Intercepter et loguer la REQUËTE
    this.logRequest(request);

    // Intercepter et traiter la REPONSE
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
[Back to top](#requêtes-http)     

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
[Back to top](#requêtes-http)     


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
[Back to top](#requêtes-http)     


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

[Back to top](#requêtes-http)     

### Gérer le déclenchement d'un spinner de chargement à chaque requête http

**1 - Service avec behaviourSubject sur l'état du spinner**

*spinner.service.ts*

````typescript
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly loading$ = this.loading.asObservable();

  constructor() { }
  showSpinner() { this.loading.next(true); }
  hideSpinner() { this.loading.next(false); }
}

````

**2 - Déclaration de l'interceptor**

*app.module.ts*

````typescript
...
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpSpinnerInterceptorService,
    multi: true
  }
````

**3 - Service interceptor**

*httpSpinnerInterceptor.service.ts*

````typescript
import { tap, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpSpinnerInterceptorService {

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.hideSpinner();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinnerService.showSpinner();

    return next
      .handle(req)
      .pipe(
        delay(1500),
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hideSpinner();
          }
        }, (error) => {
          this.spinnerService.hideSpinner();
        })
      );
  }
}
````

**4 - Utilisation**

*home.component.ts*

````typescript
@Component({
  selector: 'app-behaviour-with-refresh2',
  template: `
	<mat-spinner *ngIf="loading$ | async"></mat-spinner>
	<mat-list>
		<mat-list-item *ngFor="let p of posts$ | async">
			{{ p.id }} - {{ p.title }}
		</mat-list-item>
	</mat-list>
  `,
  styleUrls: ['./behaviour-with-refresh2.component.scss']
})
export class BehaviourWithRefresh2Component {

  posts$: Observable<IPost[]>;
  loading$: Observable<boolean>;

  constructor(private behaviourService: BehaviourService,
    private spinnerService: SpinnerService) {
    this.fetchData();
  }

  fetchData() {
    this.loading$ = this.spinnerService.loading$;
    this.posts$ = this.behaviourService.fetchPosts();
  }
}
````
[Back to top](#requêtes-http)     

## Multipart Form Data

Envoi de fichiers (images / pdf) via mutlipart/form-data

*synchro.service.ts*

````typescript
import { Directory, Filesystem } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';

interface IFormDataFile {
  uid: string;
  name: string;
}
interface IFormData {
  name: string;
  fileList: IFormDataFile[];
}
export interface LocalFile {
  name: string;
  path: string;
  data: string;
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SynchronizationService {

  constructor(private http: HttpClient,
    private toolService: ToolService,
    private configurationService: ConfigurationService) { }

  /**
   * Synchronisation des données via multipart/formdata
   * @param imagesToSend : liste des fichiers à envoyer
   * @returns
   */
  async sendMultipart(imagesToSend: LocalFile[]): Promise<any> {
    const formData = new FormData();
    const newFormDataContent: IFormData = {
      name: 'json',
      fileList: []
    };

    if (imagesToSend.length > 0) {

      for (const f of imagesToSend) {
        const filePath = `${f.path}`;

        const readFile = await Filesystem.readFile({
          path: filePath,	// fichier provenant de la camera
          directory: Directory.Data
        });

        // Conversion du fichier base64 en Blob
        const blob = new Blob([readFile.data], {
          type: `image/${filePath.split('.').pop()}`
        });

        console.log('----------- BLOB');
        console.log(blob.type);
        console.log(blob.size);
        const guid = this.toolService.generateGUID(); // GUID unique pour l'élément

        newFormDataContent.fileList.push({
          uid: guid,
          name: f.name
        });

        formData.append('MissionFiles', blob, guid);
      }

      formData.append('json', JSON.stringify(newFormDataContent));
    }

    this.traceMultipartContent(formData, 'json');

    return this.http.post(this.configurationService.config.api.synchro, formData)
    .pipe(
      map((res: any) => res)
    )
    .toPromise();
  }

  private traceMultipartContent(formData: FormData, key: string): void {

    if (formData && key !== '') {
      console.log('----------- FORMDATA');
      for (const pair of formData.getAll(key)) {
        console.log(pair);
      }
    }
  }
}
````

*appel*

````typescript
sendMultipart(): void {
    this.synchroService.sendMultipart(this.imagesToSend)
    .then(res => {
      console.log('----------- RESPONSE');
      console.log(res);
    });
  }
````

[Back to top](#requêtes-http)     

## Mise en cache requête

````typescript
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!isCachable(req)) { return next.handle(req); }

    const cachedResponse = this.cache.get(req);
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}
````
[Back to top](#requêtes-http)     
