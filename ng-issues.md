[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Erreurs connues

* [Partage d'un dataset commun entre plusieurs composants enfants]       

## Partage d'un dataset commun entre plusieurs composants enfants

Lors de l'utilisation d'un dataset commun partagé par plusieurs composants enfants dynamiques (ex une liste d'item fixes à cocher dans chaque compo enfant), si l'on passe cette liste
de valeur aux compos enfants via un *@Input* c'est en réalité une référence à cette liste qui est passée aux enfants. 
Dans le cas où chaque enfant affiche cette liste et permette de cocher / décocher un item de la liste, alors cette modification va se répercuter sur tous les composants frères !

Pour corriger ce problème, il faut soit récupérer la liste directement dans le *ngOnInit* de chaque enfant plutôt que de recevoir le dataset via un *@Input* du parent. Mais cette méthode
n'est pas optimisée si la liste en question provient d'un appel http.
Soi il faut "casser" cette référence en convertissant la valeur passée par le parent, via ```` JSON.parse(JSON.stringify(<dataset>))````

*parent.component.ts*
````typescript
items: Item[] = []
children: [1, 2, 3, 4, 5];

ngOnInit() {
  this.helperService.fetchData()
  .subscribe(res => this.items = res);
}
````

*parent.component.html*
````html
<app-child-compo *ngFor="let i of children" [items]="items">
</app-child-compo>
````

*service.ts*

````typescript
fetchData(): Observable<Item[]> {
  return this.api.fetchItems();
}
````


*child.component.ts*

````typescript
@Input() items = [];
convertedItems = [];

ngOnInit() {
    this.convertedItems = JSON.parse(JSON.stringify(this.items));
}
````

*child.component.html*

````html

  <div class="tool-div">
    <button *ngFor="let i of convertedItems; let itemIndex = index"
    (click)="checkItem(itemIndex)"
    mat-button
    [ngClass]="t?.checked ? 'btn-dark-blue' : 'btn-light-grey-stroked'">{{ i.label }}</button>
  </div>
````
