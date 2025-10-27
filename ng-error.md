[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Gestion des erreurs

* [Try-catch](#try--catch)    
* [Gestion globale erreur http avec retry](#gestion-globale-erreur-http-avec-retry)     
* [Erreur côté client](#erreur-côté-client)
* [Gérer les erreurs uncatched](#gérer-les-erreurs-uncatched)     

documentation : https://angular.io/api/core/ErrorHandler

https://www.youtube.com/watch?v=e03EHZIVJtM&ab_channel=DecodedFrontend     


## Try-catch

La technique *try-catch* doti être utilisée pour des traitements asynchrones et pour des traitements d'erreur spécifiques. Ils ne sont pas très adapté à
la gestion globale d'erreur

## Surcharger le ErrorHandler d'Angular

Angular gère lui-même une sorte de *try-catch* général le *ErrorHandler*. Il est possible de surcharger ce handler pour le customiser.

Par exemple on souhaite de manière globale afficher un message toast angular material lorsqu'on reçoit une erreur :

*customErrorHandler.service.ts*

````typescript
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()	//  <-- sera provide dans le app.module.ts via un provider

export class CustomErrorHandlerService implements ErrorHandler{

  constructor(private snackbar: MatSnackBar, private zone: NgZone) { }

  handleError(error: any): void {
  
  // Envoyer un rapport par exemple
  errorService.sendReport(error);
    
	// Utilisation du zone.run pour exécuter le traitement dans Angular. Par défaut zone utilise ngZone.runOutsideAngular() pour gérer les erreurs
	this.zone.run(() => {
		// affichage snackbar angular material
		this.snackbar.open('Error was detected !', 'Close',  { duration: 3000 });
	});
    
	
    //throw new Error('Method not implemented.');
  }
}
````

*app.module.ts*

````typescript
...
providers: [{
	provide: ErrorHandler,
	useClass: CustomErrorHandler
}]
````

### Observable error handling

*data.service.ts*

````typescript
fetchPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>('https://jsonplaceholder.typicode.com/postsA')
      .pipe(
        shareReplay(),	// transformer de Cold vers Hot pour ne pas faire plusieurs appels
        tap(res => this.posts$.next(res)),
        catchError(e => throwError(() => new Error(`Http error : ${e.message}`))),
      );
  }
````

*home.component.ts*

````typescript

error = null;

ngOnInit() {
	this.posts$ = this.data.fetchPosts()
    .pipe(
		tap({ error: (error) => this.error = error.message }),
        catchError(err => of([])) // remplace le flux par un flux vide. Permet de gérer l'affichage d'un message spécifique si aucune donnée trouvée
     );
}
````

*home.component.html*

````html
<div *ngIf="error" class="alert alert-danger">
	{{ error }}
</div>
<div *ngIf="posts$ | async as posts">
  
	<div *ngIf="posts.length <= 0" class="alert alert-info">
		No data found !
	</div>

	<div *ngFor="let p of posts">...</div>
</div>
````

## Gestion globale erreur http avec retry

=> Utilisation d'un intercepteur Http

````ng g interceptor global-http-error-handler````


## Erreur côté client

* Bugsnag     
* Sentry     
* Rollbar

## Gérer les erreurs uncatched

A placer dans le composant principal de l'application 

````typescript
window.onerror = (message, source, lineno, colno, error) => {
  
  logUncatchedErrorToAPI({
	level: LogErrorLevel.Critical,
	fileName: source,
	lineNumber: lineno,
	message
  });

  reportError(error || { message, source, lineno, colno });
  return false;
};

window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason);	// fonction native)
});

// OnDestroy
ngOnDestroy() {
  window.onerror = null;
  window.removeEventListener("unhandledrejection", reportError);
};
````	

*Error service*	
````	

export enum LogErrorLevel {
  Trace = 0,
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  Critical = 5
}

type LogObject = {
  functionName: string,
  content: any
}

type UncatchedErrorObj = {
  level?: number,
  fileName: string | undefined,
  lineNumber?: number,
  message: string | Event | undefined
}
type LogObj = UncatchedErrorObj & { timestamp?: Date | string } 
  
export const logUncatchedErrorToAPI = (logObj: UncatchedErrorObj) => {
  
  try {
    const currentTimestamp = new Date();

    const errorObj: LogObj = {
      level: logObj.level ?? LogErrorLevel.Critical,
      fileName: `Frontend - ${logObj.fileName}`,
      lineNumber: logObj.lineNumber ?? 0,
      message: `[${currentTimestamp.toISOString()}] --> ${logObj.message}`,
      //timestamp: currentTimestamp.toISOString()
    }

    fetch(<error-api-url>), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: errorObj
      }),
    });
  } catch (e) {
    logError({ functionName: 'logUncatchedErrorToAPI', content: e})
  }
};

export const logError = (errorObj: LogObject, logLevel: LogErrorLevel = 4) => {
  const title = getLogErrorTitle(logLevel);
  console.log(`${title} ${errorObj.functionName} : ${JSON.stringify(errorObj)}`);
}

const getLogErrorTitle = (logLevel: LogErrorLevel): string => {  
  switch (logLevel) {
    case 0:
      return "[logTrace]";
    case 1:
      return "[logDebug]";
    case 2:
      return "[logInfo]";
    case 3:
      return "[logWarning]";
    default:
      return "[logError]";
  }
}
````
