[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Local Storage

* [Généralités](#généralités)     
* [Index DB](#index-db)    
* [Localforage](#localforage)    

## Généralités

Les session storage, local storage et les cookies sont tous trois des **méthodes de stockage de données côté client** qui permettent aux sites Web de stocker des données dans le navigateur de l'utilisateur. Cependant, ils ont des différences importantes en termes de durée de vie et de portée :

Le **session storage** est une API qui permet de stocker des données qui ne sont **disponibles que pour une seule session de navigation**. Les données stockées dans le session storage sont perdues lorsque l'utilisateur ferme le navigateur ou quitte le site Web. Le session storage est *utile pour stocker des données temporaires qui ne doivent pas être conservées entre les sessions de navigation*.

Le **local storage** est similaire au session storage, mais les données stockées dans le local storage sont **conservées même lorsque l'utilisateur ferme le navigateur ou quitte le site Web**. Le local storage est *utile pour stocker des données qui doivent être conservées à long terme*, comme les préférences de l'utilisateur ou les informations de connexion.

Les **cookies** sont de *petits fichiers de données* qui sont stockés dans le navigateur de l'utilisateur lorsqu'un site Web est visité. Les cookies peuvent être utilisés pour *stocker des informations comme les préférences de l'utilisateur ou les informations de connexion*, mais ils ont une **durée de vie limitée** et peuvent être configurés pour expirer à une date spécifique ou lorsque l'utilisateur ferme le navigateur. Les cookies sont souvent utilisés pour suivre les activités de l'utilisateur sur un site Web ou pour cibler de la publicité.

En résumé, le session storage et le local storage sont des options de stockage de données plus récentes et plus flexibles que les cookies, mais ils ne sont disponibles que dans les navigateurs modernes et ne sont pas compatibles avec les navigateurs plus anciens. Les cookies, quant à eux, sont supportés par la plupart des navigateurs et ont une durée de vie plus longue, mais ils sont moins flexibles et peuvent être utilisés pour suivre les activités de l'utilisateur sur Internet.

## Index DB
https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API/Using_IndexedDB

## Localforage
https://ichi.pro/fr/utilisez-localforage-avec-angular-pwa-41410327718702
