[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Présentation

Développé par Google, Angular est un Framework open source écrit en JavaScript qui permet la création d’applications Web et plus particulièrement de ce qu’on appelle des  « Single Page Applications » : des applications web accessibles via une page web unique qui permet de fluidifier l’expérience utilisateur et d’éviter les chargements de pages à chaque nouvelle action. Le Framework est basé sur une architecture du type MVC et permet donc de séparer les données, le visuel et les actions pour une meilleure gestion des responsabilités. Un type d’architecture qui a largement fait ses preuves et qui permet une forte maintenabilité et une amélioration du travail collaboratif.

Depuis sa création en 2009, on ne peut pas dire que l’existence d’Angular a été un long fleuve tranquille. En effet, Google a créé une certaine forme de confusion chez les développeurs en 2016 puisqu’en plus de lancer Angular 2, ils en ont profité pour réécrire intégralement le Framework. Ce qui fait que la première version est devenue « obsolète » et Google a décidé de la  rebaptiser AngularJS  afin de marquer une différenciation avec l’écosystème actuel. En clair, si vous décidez un jour de vous lancer dans la grande aventure d’Angular, retenez bien qu’AngularJS et toutes les versions d’Angular depuis la 2 sont deux technologies différentes bien qu’elles reposent sur la même philosophie.

Angular est un Framework solide, complet et homogène qui a l’avantage de ne pas nécessiter l’ajout de composants extérieurs pour son fonctionnement. Il est possible de faire nativement du routing, de l’AJAX ou encore du stockage en local contrairement à vue.js ou encore React qui reste au final une librairie destinée à développer des composants.

Aussi, le framework s’appuie sur Typescript, une surcouche au JavaScript développé par Microsoft, qui est un langage typé qui permet de créer des classes, des variables et des signatures de fonction. Et s’il est parfaitement possible d’utiliser du JavaScript natif avec Angular, l’utilisation de Typescript permet de mieux gérer les erreurs, d’avoir un code plus clair et aussi d’assurer une transition plus simple pour les développeurs PHP, Java ou encore C#.

Enfin, si Angular permet de développer des applications Web, il est également possible de faire des applications bureau ou encore des Progressive Web App en utilisant le même code ! Ce qui permet donc par exemple de développer un site web et une application mobile en même temps sans avoir à gérer deux projets en parallèle.

# Ressources

https://alligator.io/angular/    
https://blog.thoughtram.io/    
https://nitayneeman.com/posts/all-talks-from-ng-conf-2018/   

# Fichiers principaux

* polyfills.js : permet de rendre l'application compatible avec les différents browsers. Parce que nous écrivons le code avec les fonctionnalités les plus récentes et que tous les navigateurs ne prennent pas en charge ces fonctionnalités.     
* scripts.js : contient les scripts qui sont déclarés dans la section "scripts" du fichier angular.json    
* runtime.js : c'est le webpack loader. Il contient les utilitaires webpack nécessaires au chargement des autres fichiers    
* main.js : contient tous le code (composants, ts, html, scss, pipes, directives, services, modules tiers...).     

[Back to top](#ressources)     

# Virtual DOM

Le Virtual DOM est une technique utilisée par les bibliothèques de rendu de composants tels que React pour optimiser les performances de mise à jour de l'interface utilisateur. Il consiste à créer une réplique en mémoire de l'arbre de rendu de l'interface utilisateur, qui est ensuite comparé à l'arbre de rendu actuel pour déterminer les différences et ne mettre à jour que les parties qui ont changé.

L'Incremental DOM est une technique similaire qui utilise également une réplique en mémoire de l'arbre de rendu, mais il compare et met à jour chaque nœud de l'arbre individuellement au lieu de traiter l'arbre en entier. Cela permet une mise à jour plus fine des modifications apportées à l'interface utilisateur.

En résumé, le Virtual DOM est une technique de mise à jour globale pour l'interface utilisateur, tandis que l'Incremental DOM est une technique de mise à jour individuelle pour chaque nœud de l'arbre.

https://blog.bitsrc.io/incremental-vs-virtual-dom-eb7157e43dca

Pros and Cons of Virtual DOM

* Algorithme de "différenciation" efficace
* Simple et aide à améliorer les performances
* Il peut être utilisé sans React.
* Léger
* Permet de créer des applications sans penser aux transitions d'état.

Pros and Cons of Incremental DOM

Comme je l'ai mentionné précédemment, Incremental DOM apporte une solution pour réduire la consommation de mémoire dans Virtual DOM en utilisant un vrai DOM pour suivre les modifications.
Cette approche a considérablement réduit la surcharge de calcul et amélioré l'utilisation de la mémoire des applications.

* Facile à intégrer à de nombreux autres frameworks. 
* Son API simple le rend puissant pour cibler les moteurs de modèles. 
* Convient aux applications basées sur les appareils mobiles.

L'incremental DOM n'est pas le plus rapide mais est le plus économe en utilisation mémoire.



pour créer une app comparable en react et angular, avec react il est nécessaire d'installer tout un tas de dépendances :
* routing
* http
* redux
* sass
* rxjs
* ...

cela rend plus compliqué la création / maintenance d'une "grosse" application et maintenir la cohérence et le fonctionnement des dépendances entre elles.

Avec Angular tout est déjà inclut, il suffit juste d'importer les features nécessaires. 

Syntaxe compliquée avec TSX :

* pas possible de déclarer des styles :hover, :focus, :active en inline-style
* obliger d'appliquer un !important pour surcharger les styles si 2 composants utilisent le même nom de classe css même si chacun utilisent un fichier css différent
* pas possible de spécifier de media-queries
* écriture de code conditionnel / boucles fastidieux dans la vue
