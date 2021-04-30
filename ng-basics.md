[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Notions de base   

## Les 3 fichiers principaux pour créer une appli angular

main.ts permet de définir le type d'application (mobile, web, ...). Ensuite il appelle le module racine (AppModule)
app.module.ts
app.component.ts

## Cycle de vie d'un composant

| Order   |
|----------|
|constructor|
|nbOnChanges|
|ngOnInit|
|ngDoCheck|
|ngAfterContentInit|
|ngAfterContentChecked|
|ngAfterViewInit|
|ngAfterViewChecked|

## ngModel
[Back to top](#notions-de-base)   

| Name | Description |
| --- | --- |
| ngModel | Bind element to formControl | 
| [ngModel] | Simple-way binding (i.e. property binding) | 
| [(ngModel)] | Two-way binding | 

[Back to top](#notions-de-base)
