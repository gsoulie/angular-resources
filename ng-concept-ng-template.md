[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# ng-template


## ng-template
https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/

*ng-template* défini un template qui n'affiche rien tant qu'il n'est pas utilisé

````html
<div class="lessons-list" *ngIf="lessons else loading">
  ... 
</div>

<!-- Ne sera affiché uniquement dans le cas else -->
<ng-template #loading>
    <div>Loading...</div>
</ng-template>
````

## ng-container

Il n'est pas possible d'appliquer plusieurs directives à un même élément, par exemple un *ngIf* et *ngFor* sur un même conteneur.
Pour palier ce problème, on peut créer une div pour le *ngIf* et une div pour le *ngFor*. Cela fonctionne mais oblige à créer une nouvelle div.

Il est donc possible d'utiliser un *ng-container*

Le ng-container permet en outre l'injection dynamique d'un template dans une page, un placeholder en quelques sortes

````html
<ng-container *ngTemplateOutlet="loading"></ng-container>

<ng-template #loading>
    <div>Loading...</div>
</ng-template>
````

Il est possible de passer un template à un composant enfant :

*parent*
````html
    <ng-template #testTemplate let-clientVar="client">
        <div class="customTemplate">
            <h1>Hello {{ clientVar }} !</h1>
            <p>This is my custom template</p>
        </div>
    </ng-template>
    
    <app-generic-collapsible-list [itemTemplate]="testTemplate"></app-generic-collapsible-list>
````

*enfant app-generic-collapsible-list*
````html
<ng-template #defaultTabButtons>
    <div class="default-tab-buttons">
        ...
    </div>
</ng-template>

<ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate: defaultTabButtons">
</ng-container>
````

*enfant controller*
````typescript
@Input() itemTemplate: TemplateRef<any>;
````

### Variable contexte

#### Exemple 1

Les ng-template peuvent prendre des paramètres. Ici le paramètre *when* contient une valeur comme "morning", "afternoon" ou "evening" :

````html
<ng-template #hello let-when="whenValue">
  Good {{ when }} !
</ng-template>
````
*let-xxx* permet de définir des variables utilisables dans le ng-template (ici when) à partir de la propriété (ici whenValue) d'un objet passé en "context" du *ngTemplateOutlet*. Ces variables ne sont pas accessible depuis l'extérieur directement. Pour accéder à ces variables depuis le ng-container, il faut créer un contexte (objet json par exemple) qui a un attribut
ayant le nom de la variable à toucher :

````html
<ng-container *ngTemplateOutlet="itemTemplate;context:{whenValue: 'morning'}">
</ng-container>
````

#### Exemple 2
````html
<ng-template #testTemplate let-clientVar="client">
    <div class="customTemplate">
        <h1>Hello {{ clientVar }} !</h1>
        <p>This is my custom template</p>
    </div>
</ng-template>

<ng-container *ngTemplateOutlet="testTemplate;context:ctx"></ng-container>
````

*controller*
````typescript
client = "gsoulie";
ctx = {client: this.client};
````

### Accéder au contexte depuis un composant enfant 

*View*

````html
<div *ngFor="let num of [1,2,3,4,5,6,7]">
    <ng-container *ngTemplateOutlet="itemTemplate;context:{client:num}">
    </ng-container>
</div>
````

*Controller*
````typescript
@Input() itemTemplate: TemplateRef<{client:any}>;
````

### boucles génériques de composant extand/collapse

ATTENTION : ne fonctionne pas avec un jeu de données qui vient d'un observable

https://makina-corpus.com/blog/metier/2019/des-boucles-generiques-de-composants-avec-angular
      
[Back to top](#ng-template)
