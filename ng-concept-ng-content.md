[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# ng-content
https://wizbii.tech/un-layout-dynamique-avec-ng-content-d00e27ab26d9      
https://github.com/gsoulie/angular-resources/blob/master/angular-summary.md#ng-content    

La balise ````<ng-content>```` permet de définir un modèle de vue fixe et de définir un emplacement pour du contenu dynamique.
Par exemple, imaginons un template dans lequel on aurait un header et du contenu :

*layout.component.html*
````html
<section class="layout">
    <h2 class="layout__header">
        {{ header }}
    </h2>
    <!-- slot de transclusion -->
    <div class="layout__content">    
        <ng-content></ng-content>
    </div>
</section>
````

*layout.component.ts*
````typescript
import { Component, Input, Output } from '@angular/core';
@Component({
  selector: 'app-layout',
  templateUrl: 'card.component.html',
})
export class LayoutComponent {
    @Input() header: string = 'this is header';   
}
````
	
Maintenant, utilisons ce layout dans un autre composant :

*articles.component.html*
````html
<h1>Notre super App !</h1>
<app-layout header="Le header de mon layout !">
    <!-- début du contenu dynamique : -->
    <article class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article>
    <!-- fin du contenu dynamique -->
<app-layout>
````
	
Le slot de transclusion ````<article class="content__article">…</article>```` remplacera le ````<ng-content></ng-content>```` dans notre layout.
Imaginons avoir besoin de plusieurs blocs de contenu dynamique… C’est possible ! ````<ng-content>```` accepte un attribut ````select````, qui nous permet de nommer un slot. Modifions notre layout pour accepter un 2nd slot.

*layout.component.html*
````html
<section class="layout">
    <!-- slot header -->
    <nav class="layout__nav">
       <ng-content select="[cardNav]"></ng-content>
    </nav>
    <!-- slot content--> 
    <div class="layout__content">       
        <ng-content select="[cardContent]"></ng-content>
    </div>
</section>
````
	
A noter que l'on utilise ````select=[cardNav] && select=[cardContent]````. Les "[]" veulent dire "à remplacer uniquement si l'élément possède l'attribut *card-…*".
Et notre composant :
	
*articles.component.html*
````html
<h1>Notre super App !</h1>
<app-layout>
    <!-- contenu dynamique : nav -->
    <a cardNav class="nav__cta">Article 1</a>
    <a cardNav class="nav__cta">Article 2</a>
    <a cardNav class="nav__cta">Article 3</a>        
    
    <!-- contenu dynamique : content -->
    <article cardContent class="content__article">
       <h2>Article 1</h2>
       <p>Mon super résumé...</p>
    </article> 
       
    <article cardContent class="content__article">
       <h2>Article 2</h2>
       <p>Mon super résumé...</p>
    </article>   
     
    <article cardContent class="content__article">
       <h2>Article 3</h2>
       <p>Mon super résumé...</p>
    </article>
<app-layout>
````

[Back to top](#ng-content)
