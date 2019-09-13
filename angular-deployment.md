[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-sheet.md)    

# Deployment    

* [Preparation](#preparation)      
* [Firebase hosting](#firebase-hosting)    
* [Server routing and Browser routing](#server-routing-and-browser-routing)    



## Preparation
[Back to top](#deployment)  

* Test app with lighthouse
* Check index.html and other config files for checkin app name, description etc...
* Check your app icon
* Check your environment file
* Check different API keys (firebase, google map etc...) for production environment



## Firebase hosting
[Back to top](#deployment)  

First build your application with production mode

```ng build --prod```

Next run firebase init 

? What do you want to use as public directory ? (public) : **dist/ng-complete-guide-update**
? Configure as a single-page app (rewrite all urls to /index.html) ? (y/N) : **y**
? File dist/ng-complete-guide-update/index.html already exists. Overwrite ? (y/N) : **N**

Then run ```firebase deploy```

## Server routing and Browser routing
[Back to top](#deployment)  

When deploying your Angular app, it's really important to make sure that your server (like S3) is configured to always serve the index.html file.

Here's why: https://academind.com/learn/angular/angular-q-a/#how-to-fix-broken-routes-after-deployment
