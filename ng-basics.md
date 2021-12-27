[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Notions de base   

## Les 3 fichiers principaux pour créer une appli angular

main.ts permet de définir le type d'application (mobile, web, ...). Ensuite il appelle le module racine (AppModule)
app.module.ts
app.component.ts

## Cycle de vie du projet

1 - main.ts
2 - app.module.ts => déclare tous les composants/directive/pipe/services de l'appli
3 - app.component.ts => c'est le bootstrap component

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

## ViewEncapsulation et Shadow DOM

https://medium.com/@simonb90/comprendre-la-viewencapsulation-dans-un-component-angular-83decae8f092      

*Vous pouvez considérer le Shadow DOM comme un “DOM dans un DOM”. C'est son propre arbre DOM isolé avec ses propres éléments et styles, complètement isolé du DOM original*
