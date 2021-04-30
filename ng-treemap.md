[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Arborescence projet

````
src
|
+ app
|  |
|  + components
|  |     |
|  |     + user
|  |     |  |
|  |     |  + user-list
|  |     |  |    |
|  |     |  |    + user-list.component.ts
|  |     |  |    + user-list.component.html
|  |     |  |    + user-list.component.scss
|  |     |  |    + user-list.component.spec.ts
|  |     |  |    
|  |     |  + user-detail
|  |     |  + ...
|  |     |  |
|  |     |  + shared
|  |     |  |   |
|  |     |  |   + user.service.ts
|  |     |  |   + user.service.spec.ts
|  |     |  |   + user.model.ts
|  |     |  |   + user.guard.ts
|  |     |  |   + ...
|  |     |  |
|  |     |  + user.module.ts
|  |     |  + user-routing.module.ts
|  |     |  
|  |     + ... 
|  |     
|  + shared     
|  |   |
|  |   + models
|  |   + pipes
|  |   + enum
|  |   + services
|  |   + guards
|  |   + interfaces
|  |
|  + app.module.ts
|  + app.component.ts
|  + app.component.html
|  + app.component.scss 
|  + app.component.spec.ts 
|  + material.module.ts
|  + app-routing.module.ts
|
+ maint.ts
+ index.html
+ style.scss
+ assets
|   |
|   + imgs
|   |  |
|   |  + icons
|   |  + ...
|   |  
|   + fonts
|
+ ...
 ````
[Back to top](#arborescence-projet)
