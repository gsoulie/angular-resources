
[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Animations

## animate.css

[animate.style](https://animate.style/)     

### installation

````npm install animate.css --save````

**index.html**

````html
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
</head>
````

### Utilisation

**Important** ne pas oublier de toujours utiliser la classe ````animate__animated```` en premier sur un élément avant d'y ajouter les autres classes d'animation

````html
<div class="animate__animated animate__slideInUp animate__faster">
	<ion-card>
	...
	</ion-card>
</div>
````
