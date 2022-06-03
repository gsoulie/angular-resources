[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Stratégies de routage Angular

source : https://www.tektutorialshub.com/angular/angular-location-strategies/

les applications Angular étant de type *single page* (tous les composants sont affichés dans la même page unique), elle n'ont pas besoin d'envoyer l'url au serveur pour recharger la page. A chaque fois que l'utilisateur demande une page,
les URL sont strictement locales.
Le routeur Angular navigue vers le nouveau composant et fait un rendu du template puis met à jour l'historique des URL. Tout cela se passe localement dans le navigateur.

Angular parvient à accomplir celà de deux manière appellées stratégies de localisation qui définissent à quoi ressemble la route :

* HashLocationStrategy     
=> Rend des url de la forme http://localhost:4200/#/welcome

* PathLocationStrategy      
=> Rend des url de la forme http://localhost:4200/welcome

Dans le cas d'une application/site multipages, à chaque fois que l'on a besoin d'afficher une page (en entrant l'adresse dans la barre de recherche, via un lien href, bouton etc...) on 
fait un appel au serveur web.

Avec Angular, tous les composants sont affichés dans la même page unique. Quand l'utilisateur intéragit avec l'application, seule une partie de la page est mise à jour dynamiquement dans le ````<app-root>````.

Le mécanisme de routing *client-side* permet de mimer le routage côté serveur mais localement dans le browser afin de "simuler" et permettre de changer de composant en utilisant une route différente dans la
barre de navigation.
Il met donc à jour la barre d'url et l'historique de navigation mais en réalité on reste toujours sur la même page. Le tout sans faire de requête serveur.

Le client-side routing fonctionne selon 2 principes :

* hash style routing     
* html5 routing      

### Hash style

Cette technique utilise le principe des ancres. En demandant la route http://mysite.com/index.html#contact, le browser défile jusqu'à l'ancre correspondant à la balise contact us

Le router va donc créer les URL sur ce modèle

http://www.example.com      
http://www.example.com/#/about      
http://www.example.com/#/contact      

Seule l'url http://www.example.com sera envoyée au serveur (contrairement à un site multi-page)

### Routing HTML5

L'introduction de HTML5 permet désormais aux navigateurs de modifier par programmation l'historique du navigateur via l'objet d'historique.
En utilisant la méthode history.pushState(), nous pouvons maintenant ajouter par programme les entrées de l'historique du navigateur et modifier l'emplacement sans déclencher une demande de page serveur.

En utilisant la méthode history.pushState, le navigateur crée de nouvelles entrées d'historique qui modifient l'URL affichée sans avoir besoin d'une nouvelle demande.

inconvénients :
* tous les browsers ne supportent pas html5      
* la prise en charge côté serveur est requise pour le routing html5       

Pourquoi le support côté serveur est nécessaire ?

Que se passerait-il lorsque vous tapez l'URL http://www.example.com/ProductList et appuyez sur le bouton refresh ?

Le navigateur enverra la demande au serveur Web. Puisque la page ProductList n'existe pas, elle renverra l'erreur 404 (page introuvable).

Ce problème pourrait être résolu, si nous sommes en mesure de rediriger toutes les requêtes vers le fichier index.html

Cela signifie que lorsque vous demandez depuis http://www.example.com/ProductList, le serveur Web doit le rediriger vers index.html et renvoyer la demande. Ensuite, dans le Front-end, Angular lira l'URL et chargera dynamiquement le ProductListComponent.

Pour que le routage HTML5 fonctionne, vous devez envoyer l'instruction au serveur Web pour servir /index.html pour toute demande entrante, quel que soit le chemin.

### Conclusion

Le *PathLocationStrategy* est la stratégie par défaut d'une application Angular. Elle est portée par la balise ````<base href="/">```` du *index.html* (partie **statique de l'url**). Le browser se base sur cet élément
pour construire les URLs relatives pour les ressources statiques (images, css, scripts)
