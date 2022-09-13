[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Gestion des erreurs

documentation : https://angular.io/api/core/ErrorHandler


## Gestion des erreurs

https://www.youtube.com/watch?v=e03EHZIVJtM&ab_channel=DecodedFrontend     


### Try-catch

La technique *try-catch* doti être utilisée pour des traitements asynchrones et pour des traitements d'erreur spécifiques. Ils ne sont pas très adapté à
la gestion globale d'erreur

### Surcharger le ErrorHandler d'Angular

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

### Gestion globale erreur http avec retry

=> Utilisation d'un intercepteur Http

````ng g interceptor global-http-error-handler````

