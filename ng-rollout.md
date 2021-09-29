[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Déploiement

Après avoir compilé en mode production ````ng build --configuration=production```` copier le contenu du répertoire dist sur le serveur web.

Suivant le serveur et la configuration utilisée, il est probable qu'il faille crééer un fichier *web.config* pour assurer la redirection des routes non autorisées :

*web.config*
````html
<?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.webServer>
        <rewrite>
          <rules>
            <rule name="AngularJS Routes" stopProcessing="true">
              <match url=".*" />
              <conditions logicalGrouping="MatchAll">
                <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />   
              </conditions>
              <action type="Rewrite" url="/" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
    </configuration>
````
Ce fichier doit se trouver à la racine avec le index.html.

## Déploiement projet type workspace

Après compilation, le répertoire dist contriendra plusieurs répertoires (1 pour chaque application et 1 pour chaque lib). Il n'est pas utile de copier les répertoires des libs sur le serveur,
en effet ces dernières sont déjà intégrées dans chacun des projets lors de la compilation.

Il suffit donc de copier le contenu de chaque appli et de le déposer sur le serveur.
