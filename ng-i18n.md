[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Internationalisation i18n

> [Documentation officielle](https://www.youtube.com/watch?v=KNTN-nsbV7M&t=761s&ab_channel=Angular)

> [Autre source plus poussée](https://lokalise.com/blog/angular-i18n/)     

## Installation et configuration


````
ng add @angular/localize
````

Modifier le fichier *angular.json* pour y ajouter le code suivant :

*angular.json*
````json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "testAngular16": {
      "projectType": "application",
      // ...
	  "i18n": {
        "sourceLocale": "fr-FR",	// langue de base
        "locales": {
          "en-US": "src/locale/messages.en.xlf"
        }
      },
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
			"localize": [
              "en-US"
            ],            
          },
        },
    }
  }
}
````

## Marquer les textes à traduire

Dans les vues, ajouter des attributs ````i18n```` sur les balises concernées.

*Exemple de table article avec gestion date et devise en automatique*

````html
<img i18n-alt alt="shipping icon" src="..."/>

<h2 i18n>Your order is on its way</h2>

<table>
<tr>
	<th i18n>Item</th>
	<th i18n>Qty</th>
	<th i18n>Date</th>
	<th i18n>Amount</th>
</tr>
<tr>
	<th>Big box item</th>
	<th>1</th>
	<th>{{ "05/01/2024" | date }}</th>
	<th>{{129 | currency}}</th>
</tr>
</table>
````

Pour les textes générés côté controller, ajouter l'attribut ````$localize````

*gérer les textes côté controller*

````typescript
title = 'Your receipt'

this.titleService.setTitle($localize `${this.title}`
````

## Extraire les textes et générer les fichiers de traduction

````
ng extract-i18n --output-path src/locale
````

-> génère un fichier *src/locale/messages.xlf*

<details>
  <summary>Exemple de contenu généré</summary>

*messages.xlf*
````html
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="fr-FR" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="8968078740644084367" datatype="html">
        <source>Ecran principal</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/components/home/home.component.ts</context>
          <context context-type="linenumber">21</context>
        </context-group>
      </trans-unit>
      <trans-unit id="3208758817132999047" datatype="html">
        <source>chagement différé</source>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/components/home/home.component.ts</context>
          <context context-type="linenumber">22</context>
        </context-group>
      </trans-unit>
	</body>
</file>
</xliff>
````
  
</details>

-> créer ensuite une copie de ce fichier, renommée en *messages.<langue>.xlf* (ex : messages.en.xlf)

-> ajouter une balise ````<target></target>```` dans le fichier de la langue pour gérer le texte traduit

<details>
  <summary>Exemple de fichier traduit</summary>

*messages.en.xlf*
````html
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="fr-FR" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="8968078740644084367" datatype="html">
        <source>Ecran principal</source>
        <target>Home</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/components/home/home.component.ts</context>
          <context context-type="linenumber">21</context>
        </context-group>
      </trans-unit>
      <trans-unit id="3208758817132999047" datatype="html">
        <source>chagement différé</source>
        <target>defered loading</target>
        <context-group purpose="location">
          <context context-type="sourcefile">src/app/components/home/home.component.ts</context>
          <context context-type="linenumber">22</context>
        </context-group>
      </trans-unit>
	</body>
</file>
</xliff>
````
  
</details>


Il est possible de modifier la configuration pour générer des fichiers json au lieu de xlf

*angular.json*
````json
"extract-i18n": {
  "builder": "@angular-devkit/build-angular:extract-i18n",
  "options": {
    "browserTarget": "i18n-angular-lokalise:build",
    "format": "xlf",  // <--- choisir le format
    "outputPath": "src/locale"
  }
}

````
  
</details>

## Compilation

````
ng build --localize  // créé un répertoire par lanque

// tester les builds 

ng serve dist/i18n-project/

// http://localhost:3000/en-US/
// http://localhost:3000/fr-FR/
````

## Aller plus loin

<details>
	<summary>Ajouter des configurations spécifiques pour tester chaque langues</summary>

*angular.json*

````json
"architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "localize": [
              "fr-FR"
            ],
            // ...
          },
          "configurations": {
            "en": {
              "localize": [
                "en-US"
              ]
            },            
            // ...
          },
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "testAngular16:build:production"
            },
            "development": {
              "buildTarget": "testAngular16:build:development"
            },
            "en": {	// serve avec une langue spécifique
              "buildTarget": "testAngular16:build:development,en"
            }
          },
          "defaultConfiguration": "development"
        },
````

````
ng serve -o --configuration=en
````
 
</details>

