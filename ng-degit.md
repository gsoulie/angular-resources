[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Comment créer son propre template de base Angular

Il est possible lors de la création d'un projet Angular, de se baser sur un template personnalisé. 

**Pour quoi faire ?**

Utiliser un template comme modèle permet de ne pas systématiquement créer un projet vierge, mais de pouvoir créer un projet qui contienne déjà un ensemble d'éléments que l'on utilise régulièrement, voir systématiquement dans tous nos projets. Cela permet aussi d'avoir toujours la même structure de base pour tous nos projets.

L'idée est de créer un projet template dans lequel on initie une structure de base pouvant contenir :

* une charte graphique 
* un ensemble de services / models / guards / directives / pipes indispensables
* un ensemble de composants
* un ensemble de dépendances
* etc... Bref tout ce qu'on peut retrouver dans un projet classique

**En quoi consiste le template concrètement ?** 

Le template n'est ni plus ni moins qu'**un projet angular classique** que l'on va héberger sur un gestionnaire de source *github, gitlab, bitbucket, sourceHut* et qui servira en quelque sorte de "clone" aux futurs projets.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Le template ne peux pas être directement utilisé via la commande angular ````ng new````, il faut passer par le project scaffolder **degit** (il n'est pas indispensable d'installer le CLI degit pour pouvoir l'utiliser)

documentation officielle : https://github.com/Rich-Harris/degit

## Utilisation

Après avoir créé un projet Angular de base (le template donc), il suffit de l'héberger sur l'un des gestionnaires de source supporté par degit (github, gitlab, bitbucket, sourceHut).


<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : A ce jour, le template doit être hébergé en mode **public** et le gestionnaire de source ne doit pas être redirigé sous une autre url que celle par défaut. Par exemple le gestionnaire utilisé ne doit pas avoir une url de redirection qui ne serait pas de type ````gitlab.com```` par exemple, sinon *degit* ne reconnaîttrait pas ce gestionnaire de source alors qu'il s'agit bien d'un *gitlab* derrière.

Pour créer le projet angular basé sur le template, il suffit d'utiliser la commande suivante :

````
npx degit <github_user>/<github_template_url> my-new-app
cd my-new-app
npm i
````

Plusieurs syntaxes sont possibles pour spécifier l'url du dépôt template :

````code
// Dépôt github
npx degit git@github.com:user/repo my-new-app
npx degit https://github.com/user/repo my-new-app

// Dépôt gitlab
npx degit gitlab:user/repo my-new-app
npx degit git@gitlab.com:user/repo my-new-app
npx degit https://gitlab.com/user/repo my-new-app
````

Le nouveau projet est ainsi créé sur la base du projet template. Par la suite il suffit de maintenir à jour le template à jour pour que chaque nouveau projet créé avec soit le plus à jour possible

## Pour aller plus loin

Pour comprendre plus en détail comment fonctionne *degit* nous vous invitons à consulter la documentation officielle. En substance, *degit* créé des copies de dépôts git et lorsqu'on exécute la commande ````degit```` ce dernier va chercher le dernier commit lié au dépôt et télécharge l'archive *tar*. 

C'est en quelque sorte un *clone* mais en plus rapide car il ne télécharge pas l'historique entier du dépôt.
