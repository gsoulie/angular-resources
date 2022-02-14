[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Gestion des erreurs

documentation : https://angular.io/api/core/ErrorHandler

### Service personnalisé

La gestion personnalisée des erreurs consiste à créer un service implémentant **ErrorHandler**. Cela permet ainsi de créer un traitement spécifique pour les erreurs comme l'envoi de log
par exemple.

*custom-error-service.ts*

````typescript
class MyErrorHandler extends ErrorHandler {
  constructor(private errorService: ErrorService) { 
    super(false);
  }
  handleError(error) {
    // do something with the exception
    errorService.sendReport(error);
    super.handleError(error);
  }
}
````

*app.module.ts*

````typescript
@NgModule({
        declarations: [ AppComponent ],
        imports: [ BrowserModule ],
        bootstrap: [ AppComponent ],
        providers: [
            {provide: ErrorHandler, useClass: AppErrorHandler}
        ]
    })
````
