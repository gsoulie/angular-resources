[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Erreurs connues

* Partage d'un dataset commun entre plusieurs composants enfants      

## Partage d'un dataset commun entre plusieurs composants enfants

Lors de l'utilisation d'un dataset commun partagé par plusieurs composants enfants dynamiques (ex une liste d'item fixes à cocher dans chaque compo enfant), si l'on passe cette liste
de valeur aux compos enfants via un *@Input* c'est en réalité une référence à cette liste qui est passée aux enfants. 
Dans le cas où chaque enfant affiche cette liste et permette de cocher / décocher un item de la liste, alors cette modification va se répercuter sur tous les composants frères !

Pour corriger ce problème, il faut soit récupérer la liste directement dans le *ngOnInit* de chaque enfant plutôt que de recevoir le dataset via un *@Input* du parent. Mais cette méthode n'est pas optimisée si la liste en question provient d'un appel http.

Soi il faut "casser" cette référence en convertissant la valeur passée par le parent, via ```` JSON.parse(JSON.stringify(<dataset>))````

### Solution 1

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

 checkItem(itemIndex): void {
    this.convertedItems[itemIndex].checked = !this.convertedItems[itemIndex].checked;
  }
````

*child.component.html*

````html

  <div class="tool-div">
    <button *ngFor="let i of convertedItems; let itemIndex = index"
    (click)="checkItem(itemIndex)"
    mat-button
    [ngClass]="i?.checked ? 'btn-dark-blue' : 'btn-light-grey-stroked'">{{ i.label }}</button>
  </div>
````

### Solution 2 - Spread operator

````typescript
 todos = [{ id: 1, text: 'todo 1'}, { id: 2, text: 'todo 2'}, { id: 3, text: 'todo 3'}];
 
changeValueAfterChildInit() {
    //this.todos[0].text = 'Changed todo';  // Ne fonctionne pas si la stratégie changeDetection est en onPush car l'objet reste inchangé pour angular

    // Il faut donc "casser" la référence de l'objet pour en créée une nouvelle et ainsi forcer Angular à faire un changeDetection

    // Solution 1 : créer à la main un nouvel objet
    /*let newElt = {
      id: 1,
      text: 'changed todo',
      isComplete: true
    };
    this.todos[0] = newElt;*/

    // Solution 2 : opérateur spread pour créer un nouvel élément
    this.todos[0] = {...this.todos[0], text: 'Changed todo'};
  }
````
