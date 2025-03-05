[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# requêtes Http

* [Bonnes pratiques](https://levelup.gitconnected.com/the-correct-way-to-make-api-requests-in-an-angular-application-22a079fe8413)     
* [Import HttpClientModule standalone component](#import-httpClientModule-standalone-component)      
* [Catch](#catch)     
* [Http interceptor](#http-interceptor)     
* [Interceptor configurable](#interceptor-configurable)      
* [Gérer un loading spinner](#gérer-le-déclenchement-dun-spinner-de-chargement-à-chaque-requête-http)     
* [Multipart Form Data](#multipart-form-data)      
* [Mise en cache requête](#mise-en-cache-requête)     
* [Chargement de données via JSON](#chargement-de-données-via-json)      
* [CORS](#cors)
* [Validation de schéma avec Zod](#validation-de-schéma-avec-zod)      
* [Angular 19 HttpResource](#angular-19-httpresource)     

## Documentation

https://medium.com/angular-in-depth/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6      

## Import HttpClientModule standalone component

Depuis Angular 16, pour pouvoir importer le module *HttpClientModule* afin que la classe HttpClient soit accessible dans les services, il faut ajouter l'import dans le fichier *app.config.ts* de la manière suivante :

````typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  // withComponentInputBinding : activé pour pouvoir récupérer les paramètres de route via les @Input()
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),	// <--
    //importProvidersFrom(HttpClientModule)	// <--- Ancienne méthode
  ]
};
````

## Catch

<details>
	<summary>Capturer les erreurs http unitairement dans l'observable</summary>

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
 
</details>

## HTTP Interceptor

<details>
	<summary>Exemple interceptor depuis Angular 17</summary>

*http.interceptor.ts*
````typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
 
  return next(req)
    .pipe(
      retry(1),
      catchError((err: any) => {
      	if (err instanceof HttpErrorResponse) {
	        // Handle HTTP errors
	        if (err.status === 401) {
	          // Specific handling for unauthorized errors         
	          console.error('Unauthorized request:', err);
	          // You might trigger a re-authentication flow or redirect the user here
	        } else {
	          // Handle other HTTP error codes
	          console.error('HTTP error:', err);
	        }
        } else {
		// Handle non-HTTP errors
		console.error('An error occurred:', err);
        }

      	// Re-throw the error to propagate it further
      	return throwError(() => err); 
      })      
    );
};
````

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [    
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      httpInterceptor
    ])),
}
````
 
</details>

### Gestion des erreurs Http avec HTTP_INTERCEPTORS

https://www.youtube.com/watch?v=OHbWHO1Iq5o&ab_channel=ng-conf      

<details>
	<summary>Avant Angular 17</summary>

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
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
````   
[Back to top](#requêtes-http)  
 
</details>   

### Gestion du Bearer depuis Angular 17

````typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = 'YOUR_AUTH_TOKEN_HERE';

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
````

*app.config.ts*
````typescript
export const appConfig: ApplicationConfig = {
  providers: [    
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      httpInterceptor
    ])),
}
````

### Gestion du Bearer token avec Interceptor

<details>
	<summary>Déclaration Avant Angular 17</summary>

Ajouter automatiquement le Bearer token à toutes les requêtes http

*httpInterceptorService*

````typescript
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
/*
@Injectable({
  providedIn: 'root'
})*/

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
 
</details>


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

## Interceptor configurable

https://itnext.io/create-configurable-angular-interceptors-%EF%B8%8F-985bbde8f99b     

*interceptor*

````typescript
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { retry, RetryConfig } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  // private retryConfig: RetryConfig = { count: 3, delay: 1000 };
  private retryConfig = inject(RETRY_INTERCEPTOR_CONFIG);
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(retry(this.retryConfig));
  }
}
````

*app.module.ts*

````typescript
import { Provider } from '@angular/core';
import { InjectionToken } from '@angular/core';

export const RETRY_INTERCEPTOR_CONFIG = new InjectionToken<RetryConfig>(
  'retryConfig',
  {
    providedIn: 'root',
    factory: () => {
      return { count: 3, delay: 1000 } as RetryConfig;
    },
  }
);

@NgModule({
 // … other properties
 imports: [
   // … other modules
   HttpClientModule,
 ],
 providers: [
   RetryInterceptorProvider,
   {
     provide: RETRY_INTERCEPTOR_CONFIG,
     useValue: { count: 5, delay: 2000 },
   },
 ],
})
export class AppModule {}
````

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

## Validation de schéma avec Zod

[Documentation Zod](https://zod.dev/)    

*Zod* est une bibliothèque qui permet de faire de la validation de données. Elle permet de s'assurer que le format d'un objet reçu par un appel http (par exemple) 
est bien structuré et correspond à ce qu'on attend.
*Zod* permet donc de **définir des schémas** de validation, de valider automatiquement les données en fonction de ce schéma et de retourner les données ou un message d'erreur le cas échéant.

Cette validation permet de s'assurer que l'application ne plantera pas lors de la manipulation de l'objet ainsi récupéré


**Installation**

````
npm install zod
````

## Définition du schéma

*users.dto.ts*

<details>
	<summary>Définition du schéma validateur et des dto</summary>


````typescript
import { z } from 'zod';

/**
 * Définir le schéma voulu avec Zod (définition des champs que l'on souhaite garder par rapport au dataset brut)
 * Zod s'attend à trouver tous les champs définis dans le dataset brut. S'il ne les trouve pas lors du parsing, alors une erreur sera levée
 */
const usersSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      age: z.number().optional(),
      gender: z.string(),
      address: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
      }),
      company: z.object({
        address: z.object({
          address: z.string(),
          city: z.string().optional(),
          state: z.string(),
        }),
        name: z.string(),
      }),
    })
  ),
});


/**
 * Création du type basé sur le schéma zod
 */
export type UsersDto = z.infer<typeof usersSchema>;


/**
 * Création d'un type "nettoyé" qui sera exploité par le front (facultatif)
 */
export type UserDto = {
  id: number;
  fullName: string;
  age?: number;
  gender: string;
  company: {
    name: string;
    address: string;
  };
  address: string;
}


/**
 * Parser le dataset brut avec le schéma zod défini.
 * @param source
 * @returns
 */
export function parseDTO(source: unknown) {
  // la méthode safeParse retournera soit l'objet parsé avec succès, ou bien une instance de ZodError si le parsing s'est mal passé
  return usersSchema.safeParse(source);
}


/**
 * Mapper l'objet Zod avec le type "nettoyé" que l'on souhaite exploiter (facultatif)
 * @param dto : objet mappé avec le schéma zod
 * @returns 
 */
export function fromDTO(dto: UsersDto): UserDto[] {
  return dto.users.map((user) => {
    const companyAddress = user.company.address;
    const userAddress = user.address;
    const fullName = `${user.firstName} ${user.lastName}`;
    return {
      id: user.id,
      fullName,
      age: user.age,
      gender: user.gender,
      company: {
        name: user.company.name,
        address:
          [companyAddress.address, companyAddress.city, companyAddress.state].join(', ')
      },
      address: [userAddress.address, userAddress.city, userAddress.state].join(', ')
    };
  });
}
````

</details>



## Utilisation

<details>
	<summary>Exemple de service utilisant la validation de schéma</summary>

````typescript
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { fromDTO, parseDTO, UserDto } from "./models/users.dto";

@Injectable({ providedIn: 'root' })

export class DataService {
  httpClient = inject(HttpClient);

  fetchUsers(): Observable<UserDto[]> {
    const url = 'https://dummyjson.com/users';
    return this.httpClient.get(url).pipe(
      map((response) => {
        const dto = parseDTO(response);
        
        if (dto.success) {
          return fromDTO(dto.data);
        } else {
        
          const zodError = {
            title: dto.error.name,
            code: dto.error.issues[0].code,
          }
          console.error(zodError);        
          return [];
        }
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
````
	
</details>

## Angular 19 HttpResource

<details>
	<summary>Appels http avec HttpResource </summary>

**Guide des appels HTTP dans Angular avec httpResource()**

Angular v19.2 a introduit une fonction dédiée (et expérimentale) pour créer des ressources utilisant des requêtes HTTP : ````httpResource()```` dans le package @angular/common/http.

Cette fonction utilise ````HttpClient```` en interne, permettant d'utiliser les intercepteurs, utilitaires de test, etc. habituels.

### Utilisation de base
L'utilisation la plus simple consiste à appeler cette fonction avec l'URL depuis laquelle vous souhaitez récupérer des données :

````typescript
readonly usersResource = httpResource<Array<UserModel>>('/users');
````

````httpResource()```` renvoie un ````HttpResourceRef```` avec les mêmes propriétés que ````ResourceRef````, le type renvoyé par ````resource()````, puisqu'il est construit par-dessus :

|paramètre|description|
|-|-|
|value|un signal contenant le corps de la réponse JSON désérialisée.|
|status|un signal contenant le statut de la ressource (inactif, chargement, erreur, résolu, etc.).|
|error|un signal contenant l'erreur si la requête échoue.|
|isLoading|un signal indiquant si la ressource est en cours de chargement.|
|reload()|une méthode permettant de recharger la ressource.|
|update() et set()|des méthodes permettant de changer la valeur de la ressource.|
|asReadonly()|une méthode permettant d'obtenir une version en lecture seule de la ressource.|
|hasValue()|une méthode permettant de savoir si la ressource a une valeur.|
|destroy()|une méthode permettant d'arrêter la ressource.|

Elle contient également quelques propriétés spécifiques aux ressources HTTP :

|statusCode|un signal contenant le code de statut de la réponse sous forme de number.|
|headers|un signal contenant les en-têtes de la réponse sous forme de HttpHeaders.|
|progress|un signal contenant la progression du téléchargement de la réponse sous forme de HttpProgressEvent.|
 
### Ressources réactives
Il est également possible de définir une ressource réactive en utilisant une fonction qui retourne la requête en tant que paramètre. Si la fonction utilise un signal, la ressource se rechargera automatiquement lorsque le signal change :

````typescript
readonly sortOrder = signal<'asc' | 'desc'>('asc');
readonly sortedUsersResource = httpResource<Array<UserModel>>(() => `/users?sort=${this.sortOrder()}`);
````

Lors de l'utilisation d'une requête réactive, la ressource se rechargera automatiquement lorsqu'un signal utilisé dans la requête change. Si vous souhaitez ignorer le rechargement, vous pouvez retourner ````undefined```` depuis la fonction de requête (comme pour resource()).

### Contrôle avancé des requêtes
Pour un contrôle plus précis de la requête, vous pouvez également passer un objet HttpResourceRequest à la fonction ````httpResource()````, ou une fonction qui retourne un objet ````HttpResourceRequest```` si vous souhaitez rendre la requête réactive.

Cet objet doit avoir une propriété url et peut avoir d'autres options comme method (GET par défaut), params, headers, reportProgress, etc. Si vous souhaitez rendre la requête réactive, vous pouvez utiliser des signaux dans les propriétés url, params ou headers.

*Exemple :*

````typescript
readonly sortedUsersResource = httpResource<Array<UserModel>>(() => ({
  url: `/users`,
  params: { sort: this.sortOrder() },
  headers: new HttpHeaders({ 'X-Custom-Header': this.customHeader() })
}));
````

Vous pouvez également envoyer un corps avec la requête, par exemple pour une requête POST/PUT, en utilisant la propriété body de l'objet de requête.

### Autres options
Dans ces options, vous pouvez également définir :

* ````defaultValue```` : une valeur par défaut de la ressource, à utiliser lorsqu'elle est inactive, en cours de chargement ou en erreur.
* une fonction equal qui définit l'égalité de deux valeurs.
* une fonction map qui permet de transformer la réponse avant de la définir dans la ressource.

Il est également possible de demander autre chose que du JSON, en utilisant les fonctions httpResource.text(), httpResource.blob() ou httpResource.arrayBuffer().
 
</details>

[Back to top](#requêtes-http)     
