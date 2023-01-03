[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# requêtes Http

* [Bonnes pratiques](https://levelup.gitconnected.com/the-correct-way-to-make-api-requests-in-an-angular-application-22a079fe8413)     
* [Catch](#catch)     
* [Http interceptor](#http-interceptor)     
* [Gérer un loading spinner](#gérer-le-déclenchement-dun-spinner-de-chargement-à-chaque-requête-http)     
* [Multipart Form Data](#multipart-form-data)      
* [Mise en cache requête](#mise-en-cache-requête)     
* [Chargement de données via JSON](#chargement-de-données-via-json)      
* [CORS](#cors)     

## Documentation

https://medium.com/angular-in-depth/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6      

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
	tap({
		next: (event: HttpEvent<any>) => {
	    		if (event instanceof HttpResponse) {
	      			this.spinnerService.hideSpinner();
	    		}
	  	},
		error: (e) => this.spinnerService.hideSpinner();
	})
	/** Ancienne syntaxe
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hideSpinner();
          }
        }, (error) => {
          this.spinnerService.hideSpinner();
        })*/
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

### Autre exemple de multipart

Solution complète avec backend node JS : https://malcoded.com/posts/angular-file-upload-component-with-express/    

````typescript
public upload(files: Set<File>):
    { [key: string]: { progress: Observable<number> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
````

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

## Chargement de données via JSON


créer un fichier json positionné dans le répertoire *assets*

*data.json*
````json
[
  {
    "id": 1,
    "name": "Tom"
  },{
    "id": 2,
    "name": "Marie"
  },{
    "id": 3,
    "name": "Jen"
  }
]

````

Ajouter la configuration suivante dans le fichier **tsconfig.json** permettant le chargement des données provenant d'un json

*tsconfig.json*
````json
"resolveJsonModule": true,
"esModuleInterop": true
````

*data.service.ts*
````typescript
export class UserDataService {

  private usersSubject$ = new BehaviorSubject<any[]>([]);
  users$: Observable<any[]> = this.usersSubject$.asObservable();

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data.json')
      .pipe(
        tap(res => console.log(res)
        )
      );
  }
}
````
[Back to top](#requêtes-http)     

## Cors

CORS (Cross-Origin Resource Sharing) est un mécanisme basé sur HTTP qui permet au browser d'accéder à des ressources en dehors du domaine. En d'autres termes, des ressources peuvent être demandée depuis une URL vers une autre.

De base, les browsers implémente une Police de type "Same-Origin", qui signifie qu'il est autorisé de demander des ressources provenant de la même origine (même domaine) mais n'autorise pas la demande de ressources provenant d'une autre origine (lève une erreur).

Ce mécanisme est implémenté pour des raisons de sécurité. Cependant, utiliser le mécanisme CORS ajoute de la flexibilité à la Police "Same-Origin". Un exemple typique est de pouvoir faire appel à une API d'un autre domaine.

**Comment fonctionne CORS ?**

Quand un navigateur produit une requête cross-origin, il ajoute un en-tête "Origin" qui indique le schéma (protocole), le domaine et le numéro de port.

Ensuite, le serveur répond et ajoute un en-tête "Access-Control-Allow-Origin" dans la réponse.

Si l'origine de cet en-tête est la même que l'origine envoyée dans la requête, l'accès à la ressource sera autorisé.

C'est la base d'une requête CORS. Cependant, certaines méthodes HTTP (méthodes autres que GET, POST ou HEAD) nécessitent une demande de contrôle en amont avant que la demande réelle ne soit effectuée.

**Comment fonctionne les requêtes Preflight ?**

Les demandes de contrôle en amont commencent par envoyer une demande HTTP OPTIONS au serveur. Le serveur répond avec un en-tête "Access-Control-Allow-Methods" qui indique les méthodes HTTP autorisées à être utilisées par l'origine.

La réponse peut également inclure un en-tête "Access-Control-Max-Age" spécifiant la durée pendant laquelle la réponse doit être mise en cache.

Avec cela, le client n'aura pas besoin de la demande de contrôle en amont chaque fois qu'il voudra accéder à la ressource CORS.

La demande CORS réelle peut maintenant être effectuée comme d'habitude.

[Back to top](#requêtes-http)     
