
# Docker

* [General](#general)      
* [Docker file](#docker-file)       
* [dockerignore](#dockerignore)      
* [Docker compose](#docker-compose)       
* [Commandes](#commandes)      
* [Partager une image sur dockerHub](#partager-une-image-sur-dockerHub)       

## General
[Back to top](#docker)      

Une **registry** est un logiciel qui permet de partager des images à d'autres personnes.

## Docker file
[Back to top](#docker)      

Le docker file est le fichier qui permet de définir une image

|Key|description|
|-|-|
|FROM|déterminer l'image de base (utilisable une seule fois)|
|RUN|exécuter une commande dans le conteneur (plus il y a de commandes RUN plus le dockerfile sera lourd, il est conseiller de limiter le nombre de commandes RUN)|
|ADD|copier ou télécharger des fichiers dans l'image|
|WORKDIR|modifier le répertoire de travail (équivalent cd) l'ensemble des commandes suivantes seront exécutées dans le nouveau path|
|EXPOSE|permet d'indiquer le port d'écoute|
|VOLUME|indiquer un répertoire à partager avec l'host|
|CMD|indique au conteneur quelle commande par défaut il doit exécuter à son démarrage. doit **toujours** être présente et en dernière ligne|

*exemple 1*
````
FROM debian:9

RUN apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_10.x | bash \
&& apt-get install nodejs -yq \
&& apt-get clean -y

ADD . /app/
WORKDIR /app
RUN npm install

EXPOSE 2368
VOLUME /app/logs

CMD npm run start
````

*exemple 2*

````
ARG servercore=mcr.microsoft.com/windows/nanoserver:1809
FROM ${servercore} as node

WORKDIR /nodejs

ADD https://nodejs.org/dist/v14.15.1/node-v14.15.1-win-x64.zip "node.zip"

RUN tar.exe -xf node.zip
USER ContainerAdministrator
RUN del node.zip
ENV NPM_CONFIG_LOGLEVEL info
RUN setx /M PATH "%path%c:\nodejs\node-v14.15.1-win-x64;"
USER ContainerUser

RUN echo %path%
````

*exemple 3*

````
# escape=`

FROM mcr.microsoft.com/windows/servercore/iis as iisWithCore318
# Install .Net core 3.1.8

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Install ASP.NET Core Runtime
RUN $aspnetcore_version = '3.1.10'; `
    Invoke-WebRequest -OutFile aspnetcore.zip https://dotnetcli.azureedge.net/dotnet/aspnetcore/Runtime/$aspnetcore_version/aspnetcore-runtime-$aspnetcore_version-win-x64.zip; `
    $aspnetcore_sha512 = 'de7c5814e43526363a24f1fdc305936f4bcda62eac98bf6c00afa76f01ff6608a855684e2e487d8820106e8fb916f4c1aaac376e0e5178c856f7718b6ecf6bb7'; `
    if ((Get-FileHash aspnetcore.zip -Algorithm sha512).Hash -ne $aspnetcore_sha512) { `
        Write-Host 'CHECKSUM VERIFICATION FAILED!'; `
        exit 1; `
    }; `
    `
    mkdir dotnet/shared/Microsoft.AspNetCore.App; `
    tar -C dotnet -oxzf aspnetcore.zip ./shared/Microsoft.AspNetCore.App; `
    Remove-Item -Force aspnetcore.zip

RUN mkdir 'C:\Program Files\IIS\Asp.Net Core Module\V2\'
COPY ["Windows\\IISCore\\3.1.10\\AspNetCoreModuleV2", "C:\\Program Files\\IIS\\Asp.Net Core Module\\V2"]

# Install IIS CORS module
ADD http://download.microsoft.com/download/2/F/2/2F259559-FC43-4B2C-B53F-DED3E9950912/IISCORS_amd64.msi "C:/setup/IISCORS_amd64.msi"
RUN start-process -FilePath msiexec.exe -ArgumentList @('/i', 'C:\setup\IISCORS_amd64.msi', '/qn', '/l*vx', 'c:/setup/IISCORS.log', 'ADDLOCAL=ALL') -Wait 
RUN Get-Content -Path c:/setup/IISCORS.log
RUN Remove-Item -Force "C:/setup/IISCORS_amd64.msi"
RUN Remove-Item -Force "C:/setup/IISCORS.log"

````

*exmeple 4*
````
FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

#PORT TO EXPOSE : Doit correspondre au port utilisé par la variable  process.env.PORT de l’application node
EXPOSE 3000
CMD [ "npm", "start" ]

````

## dockerignore
[Back to top](#docker)      

A la racine de notre projet (soit à côté du fichier Dockerfile), créer un fichier *.dockerignore* à la manière d'un fichier *.gitignore*

````
node_modules
.git
````

## Docker compose
[Back to top](#docker)      

Docker compose permet d'orchestrer plusieurs conteneurs dans un même environnement. C'est à dire monter plusieurs images docker pour les faire fonctionner ensemble,
dans un même environnement

Un docker compose est formé d'un fichier *docker-compose.yaml* qui doit se trouver à la racine du projet

Le fichier commence toujours par l'argument **version**. Ensuite l'ensemble des conteneurs doivent être définis sous l'argument **services**.
L'argument **image** permet de spécifier l'image à utiliser. Il est possible d'utiliser l'argument **build** en spécifiant le chemin du fichier dockerfile voulu.
L'argument **restart** défini la politique de redémarrage du conteneur
L'argument **environment** permet de définir les variables d'environnement dont on peut avoir besoin
L'argument **depends_on** permet de créer une dépendance entre 2 conteneurs. Dans notre exemple, docker démarrera le service *db* avant *wordpress* puisque ce dernier dépend de *db*
L'argument **ports** permet de d'exposer un port de notre machine vers le conteneur.

### exemple : monter un environnement wordpress

2 images, une pour la bd et une pour wordpress

*docker-compose.yaml*

````
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db_data: {}
````

## Commandes
[Back to top](#docker)      

|commande|description|options|
|-|-|-|
|docker build|docker compile l'image et va créer un layer pour chaque ADD trouvé. L'ensemble de ces layers créé l'image|-t donner un nom à l'image|
|docker run <mon-image>|démarre une image si elle existe en local|(-p spécifier un port) -d // pour détacher le conteneur du processus principal de la console. Il vous permet de continuer à utiliser la console pendant que votre conteneur tourne sur un autre processus|
|docker stop <ID_CONTENEUR>|arrêter le conteneur||
|docker ps|afficher l'ensemble des conteneurs
|docker images -a|afficher l'ensemble des images présentes en local sur la machine||
|docker system prune|nettoyer le système||
|docker-compose up|démarrer une stack d'images|-d (pour l'exécuter en tâche de fond)|
|docker-compose ps|afficher l'état de la stack||
|docker-compose logs -f --tail 5|voir les logs de la stack sur les 5 dernières lignes||
|docker-compose stop|arrêter une stack (ne supprime pas les ressources, si on relance un docker-compose up -d la stack sera tout de suite opérationnelle)||
|docker-compose config|vérifier la syntaxe du fichier pour éviter les erreurs||
|docker-compose down|détruire l'ensemble des ressources d'une stack||

````
docker build -t ocr-docker-build .	// le . est le répertoire dans lequel se trouve le dockerfile
docker run -d -p 2368:2368 ocr-docker-build
````

## Partager une image sur dockerHub

https://openclassrooms.com/fr/courses/2035766-optimisez-votre-deploiement-en-creant-des-conteneurs-avec-docker/6211567-utilisez-des-images-grace-au-partage-sur-le-docker-hub      


