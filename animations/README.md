# Exemples d'animations

## Basic

Présente les bases minimales pour l'animation d'une div

## Item-list

Animation basique sur l'ajout / suppression d'un item dans une liste

### Utilisation des keyframes

En complément de l'exemple, on peut obtenir un contrôle plus fin des étapes de transition de l'animation en utilisant les **keyframes**. Ce contrôle s'opère sur la durée **totale** de l'animation (ici la durée totale est d'1 seconde ````animate(1000,...)````).

Par défaut, chaque étape du keyframe a la même durée (durée totale animation / nb frames), mais il est possible de jouer sur ce ratio en utilisant la propriété **offset**

````typescript

      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateX(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(-50px)',
            opacity: 0.5,
            offset: 0.5
          }),
          style({
            transform: 'translateX(-20px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(0px)',
            opacity: 1,
            offset: 1
          }),
        ]))
      ]),
````

## Important

* L'ordre des animations à son importance ! En effet les animations sont jouées suivant dans l'ordre dans lequel elles sont implémentées.     
* De plus une animation attendra toujours la fin de l'animation précédente avant de se déclencher     

````typescript
transition('* => void', [
  animate(300, style({
    color: 'red'
  })),
  animate(300, style({
    opacity: 0,
    transform: 'translateX(100px)'
  })),

]),

// NE DONNERA PAS LE MEME RESULTAT QUE 

transition('* => void', [
  animate(300, style({
    opacity: 0,
    transform: 'translateX(100px)'
  })),
  animate(300, style({
    color: 'red'
  })),
]),
````
