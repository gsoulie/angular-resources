[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Change Detection

* [Fonctionnement de la Change Detection](#fonctionnement-de-la-change-detection)     
* [Comparaison Angular et React](#comparaison-angular-et-react)
* [Le future de Change Detection avec Signal](https://medium.com/ngconf/future-of-change-detection-in-angular-with-signals-fb367b66a232#:~:text=Signals%20Change%20Detection,or%20other%20type%20of%20data.)     

## Fonctionnement de la Change Detection
[Explication rapide et simple](https://www.youtube.com/watch?v=eNuMUslF8Bw&ab_channel=SimplifiedCourses)      
https://guide-angular.wishtack.io/angular/change-detection/fonctionnement-de-la-change-detection

Angular adopte une approche déclarative afin de maintenir en synchronisation le modèle et la vue.

### Change Detector

**Chaque composant dispose d'un "change detector"** qui comme son nom l'indique se charge de détecter les changements de modèle concernant la vue et de mettre à jour la vue en conséquence.
Le "Change Detector" est fortement couplé à la vue du composant associé. Cela lui permet d'**analyser la liste des expressions utilisées dans la vue** en les comparant à la dernière valeur retournée par chacune d'elles.
**Si la valeur retournée par l'expression change, la vue est mise à jour en conséquence.**

### Déclenchement de la "Change Detection"

Pour détecter les changements, Angular utilise la librairie *Zone.js* dont le rôle est d'encapsuler et d'intercepter tous les appels asynchrones (e.g. setTimeout, event listeners etc...).
Avant le chargement d'Angular, *Zone.js* procède au *Monkey patching* des fonctions natives permettant d'inscrire des "callbacks" associées à des traitements asynchrones (e.g. setTimeout) afin de pouvoir détecter chaque "tick" et notifier Angular.
Zone.js est également utilisé pour reconstruire des "callstacks" d'appels asynchrones.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO">change detection onPush : est déclenché naturellement lorsqu'une valeur change de référence

````tsx
this.someValue = {...this.someValue, someProperty: 'new value'} // déclenche le onPush

this.someValue.someProperty = 'new value'; // ne déclenche PAS le onPush

<cpo (someEvent)="doSomething()"> // déclenche le onPush

<cpo [someInput]="someStream$ | async"> // déclenche le onPush

````

### Fonctionnement de la Change Detection

**1. Déclenchement de la "change detection"**     
A la fin de chaque "tick" (détecté grâce à Zone.JS), Angular déclenche la "Change Detection" du "Root Component".

**2. "Change Detection" de chaque composant**      
Le "Change Detector" du composant compare les anciennes et les nouvelles valeurs de chaque expression utilisée dans les bindings ( ou ).

**3. Mise à jour de la vue si nécessaire**     
En cas de changement, l'élément concerné est mis à jour dans la vue.

**4. Vérification récursive**      
Le "Change Detector" de chaque "child component" est ensuite déclenché et l'étape 2 est reproduite pour chaque composant de façon récursive.

**5. Double check**     
[**Uniquement en mode développement**] Angular relance l'intégralité de la "Change Detection" pour s'assurer que les valeurs retournées par les expressions ne changent pas.
Cela permet de détecter les problèmes de conception ou d'implémentation tels que le changement du modèle par effet de bord ou les expressions dont le résultat est aléatoire.

> **A noter** : chaque composant enfant hérite de la stratégie de change detection de son parent

````typescript
@Component({
  
  changeDetection: ChangeDetectionStrategy.OnPush
})
````

[Back to top](#change-detection) 

## Comparaison Angular et React

Angular utilise une approche appelée *"détection de changement"* (**change detection**) pour rafraîchir le DOM. Cela signifie que Angular surveille en permanence les données et les propriétés de l'application pour détecter les changements. Lorsqu'un changement est détecté, Angular **rafraîchit uniquement les parties du DOM qui ont besoin d'être mises à jour**. Cette approche peut être très efficace, mais elle peut également être gourmande en ressources, car elle **nécessite une surveillance constante des données et des propriétés de l'application**.

ReactJS utilise une approche appelée *"réconciliation"* (**reconciliation**) pour rafraîchir le DOM. Plutôt que de surveiller en permanence les données et les propriétés de l'application, ReactJS **crée une représentation virtuelle du DOM** (Virtual DOM), qui est une **version légère du DOM**. Lorsqu'un changement est détecté, ReactJS **compare la version virtuelle du DOM avec la version réelle du DOM** pour déterminer les différences. Ensuite, il ne **met à jour que les parties du DOM qui ont besoin d'être mises à jour**. Cette approche peut être plus efficace en termes de performances car elle ne nécessite pas de surveillance constante des données et des propriétés de l'application.

[Back to top](#change-detection) 
