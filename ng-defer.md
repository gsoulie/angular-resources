[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# @defer block

## Présentation

Nouvelle façon de déclencher le chargement d'un contenu (en lazy-loading) côté template en fonction d'un déclencheur. Cette nouvelle feature apporte un gain significatif en terme de performance, il est donc **recommandé de l'utiliser**.

> A noter : **@defer n'est pas bloquant !**

Comment cela fonctionne sous le capot ? 
- Lorsque @defer est utilisé dans un template, le compilateur collecte toutes les dépendances nécessaires et établi une liste d'imports dynamiques. Après ça, lors du runtime, ces imports dynamiques sont invoqués lors du déclenchement

Liste des triggers natifs :

|Trigger|Action|
|-|-|
|on viewport|déclenche lorsque l'élément spécifique demandé arrive dans le viewport|
|on idle|déclenche dès que le navigateur signale qu'il est en état d'inactivité (pas de tâche lourde en cours)| 
|on interaction|déclenche lorsqu'un élément est cliqué, prend le focus, ou autres comportements similaires|
|on hover|déclenche lorsque la souris passe en survol d'une zone|
|on timer|déclenche après un timeout spécfique|
|when|déclencheur personnalisé|
|on immediate||

````html
<section #trigger>
	@defer (on viewport(trigger)) {
		<large-content />
	}
	<huge-content />
	<enormous-content />
</section>
````

Mais il est aussi **possible de créer son propre déclencheur** avec ````when````

````html
<button (click)="load = true">
	Load component
</button>

@defer (when load == true)) {
	<large-content />
}
</section>
````

On peut encore **aller plus loin en combinant plusieurs déclencheurs**

````html
<button #trigger (click)="load = true">
	Load component
</button>

@defer (on viewport(trigger); when load == true)) {
	<large-content />
}
````

## prefetch

Il est également possible de spécifier une condition de pré-chargement

````html
<section #trigger>
	@defer (prefetch on immediate; prefetch when val === true) {
		<large-content />
	}
</section>
````

## placeholder 

Pour plus de finesse, il est aussi possible de gérer différents blocs de placeholder : **@placeholder, @loading, @error**

````html
<button #trigger (click)="load = true">
	Load component
</button>

@defer (on interaction(trigger)) {
	<large-content />
} @placeholder {
	<img src="placeholder-image.png" />
} @loading (minimum 500ms){
    // ne sera affiché que si le temps de chargement est supérieur à 500ms,
    // utile pour les chargement très rapide afin d'éviter un affichage inutile
	<spinner />
} @error {
	<p>Oops, something went wrong !</p>
}
````

## Exemples

````html
@defer (hydrate on interaction) {
	<!-- header is not used as much, so we can hydrate it when the user interacts with it -->
	<app-header />
}

@defer (hydrate on immediate) {
	<!-- sidebar is very important as it contains navigation links used often, so we hydrate it immediatly -->
	<app-sidebar />
}

@defer (hyrdrate on viewport) {
	<!-- the main content can be presented as soon as it becomes visible to the user -->
	<app-main />
}

@defer (hydrate never) {
	<!-- footer contains static content with no real logic and interactions, we are good not hydrating it at all-->
	<app-footer />
}
````

````typescript
<div>
  @for(post of $posts | async; track postId) {
    @defer(on viewport; prefetch on idle) {
      <Post [post]="post" />
    } @loading {
      <Loading />
    } @placeholder {
      <PostPlaceholder />
    }
  }
</div>
````

````typescript
<div #commentsSection class="w-full">
    <input (click)="showComments = !showComments"/>
    <label (click)="showComments = !showComments" class="=w-full flex">
      Show comments
    </label>
    <div>
      @defer (on viewport(commentsSection); when post.comments.length > 0) {
        <demos-post-comments></demos-post-comments>
      } @placeholder {
        <div>Comments Placeholder</div>
      } @loading (after 100ms; minimum 500ms) {
        <div>Loading...</div>
      } @error {
        <div>Error</div>
      }
    </div>
</div>
````

> [How to use Angular defer block](https://angular.love/en/2024/04/08/how-to-use-angulars-defer-block-to-improve-performance/?utm_source=twitter&utm_medium=newsfeed&utm_campaign=artykul-defer-blok&utm_term=en)
