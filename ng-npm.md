[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

Voici quelques règles de sécurité qui **peuvent s'appliquer à tous les projets à base npm** (Angular, NextJS, React, Vue, NestJS etc...) et qui peuvent éviter des failles de sécurité dans la supply chain npm

### Avant tout, se questionner

La dépendance la plus sûre, c'est celle qu'on n'installe pas ! Avant d'embarquer des dépendances dans son projet, il est toujours bon de se poser quelques questions : 

1. **"Ais-je réellement besoin de cette dépendance ?"**. Ne peut-on pas faire la même chose nativement ?
2. **"De quand date la dernière mise à jour ?"**. Une librairie abandonnée est potentiellement une passoire en terme de sécurité. De la même manière, une version trop récente (inférieure à 7 jours) peut être dangereuse.
3. **"Popularité vs Qualité"**. Est-ce une bibliothèque reconnue ou un projet obscur avec deux contributeurs ?


### Pas de secret ou variables d'environnement en clair

C'est une règle fondamentale, **ne jamais exposer en clair des secrets, clés d'api ou variables d'environnement** dans le code, les logs ou les pipelines

### Sécuriser la configuration npm

**Pré-requis** : npm CLI **v11.10** minimum

#### Ignorer les paquets publiés trop récemment

Idéalement, on va configurer npm pour qu'il n'installe pas les paquets qui ont moins de 7 jours. Pour cela, créer un fichier **.npmrc** à la racine du projet et y ajouter le paramètre suivant :

````
min-release-age=7
````

Vérifier ensuite que le paramètre a bien été pris en compte via la commande ````npm config list````

Ceci devrait afficher un retour contenant quelque chose comme ceci qui indique la date du jour - le nombre de jour qui a été configuré
````
...
before = "2026-03-26T14:50:09.666Z
...
````

### npm ci vs npm install

#### Différence fondamentale

**npm ci** (clean install) est conçu pour les environnements reproductibles (**CI/CD, builds de prod**), tandis que **npm install** est conçu pour le **développement local**.

#### Comparatif
||||
|-|-|-|
||npm install|npm ci|
|Source de vérité|package.json|package-lock.json|
|Modifie package-lock.json|✅ Oui|❌ Jamais|
|Modifie package.json|✅ Oui (avec --save)|❌ Jamais|
|Supprime node_modules avant|❌ Non|✅ Toujours|
|Si lock désynchronisé|Résout et met à jour|🚫 Erreur fatale|
|Installe une dépendance seule|✅ npm install lodash|❌ Impossible|
|Vitesse|Plus lent|Plus rapide|
Exécute les scripts|✅ Oui|✅ Oui|

#### Le point clé sur la sécurité supply chain

**npm ci est plus sûr par nature :**

* **Il installe exactement ce qui est dans package-lock.json**, version fixée au hash près *
* **Aucune résolution de version à la volée** → aucune surprise
* Si quelqu'un a compromis une version et que le lock de la personne pointe sur une version antérieure, on est protégé

**npm install avec un ^ dans package.json peut potentiellement résoudre vers une version plus récente** que celle du lock dans certaines circonstances.

> **PRECONISATION**: utiliser **npm ci** plutôt que *npm install* dans **tous les fichiers pipeline**. On réserve l'usage de npm install à une utilisation locale à la machine

### Scripts post-install

Une autre mesure de sécurité vise à interdire les scripts npm post installation qui sont une source importante d'attaque.

Il est possible de désactiver l'exécution de ces scripts en ajoutant l'option suivante dans le fichier *.npmrc*

````
ignore-scripts=true
````

Cette commande désactive l'exécution automatique des scripts npm définis dans package.json des dépendances, notamment :
````
preinstall
postinstall
prepare
prepack / postpack
````

#### Attention !!!
Cette commande est de type tout  ou rien. Elle peut donc être **problématique pour certaines applications comme es applications Angular**. 
En effet, des dépendances comme @angular/cli, esbuild, sass, prisma... ont besoin de s'exécuter post-installation. 

> **Il faut donc bien se renseigner avant d'activer l'option !!**

**ALTERNATIVE**

Une autre alternative est d'utiliser *pnpm* à la place de npm. Ce dernier possède plus de souplesse sur l'activation/désactivation des scripts post-installation
