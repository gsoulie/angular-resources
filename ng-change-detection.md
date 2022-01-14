[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Change Detection

## Fonctionnement de la Change Detection

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
[Uniquement en mode développement] Angular relance l'intégralité de la "Change Detection" pour s'assurer que les valeurs retournées par les expressions ne changent pas.
Cela permet de détecter les problèmes de conception ou d'implémentation tels que le changement du modèle par effet de bord ou les expressions dont le résultat est aléatoire.

[Back to top](#change-detection) 
