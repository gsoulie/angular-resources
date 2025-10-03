
# Création de thème et customisation avec Material 20


Ressource : https://www.youtube.com/watch?v=ppNEwZ8RYgk
  
## Création du projet

Installer material ````ng add @angular/material````

Va générer le code suivant dans le fichier styles.scss 

````css
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}
````
  
## Génération d'un thème custom Material

Utiliser la commande suivante ````ng generate @angular/material:theme-color```` qui va créer un thème basé sur un set de couleur custom

Renseigner ensuite les couleurs pour générer le thème : 

````
 What HEX color should be used to generate the M3 theme? It will represent your primary color
 palette. (ex. #ffffff) #345D90
✔ What HEX color should be used represent the secondary color palette? (Leave blank to use    
generated colors from Material) #00BFFF
✔ What HEX color should be used represent the tertiary color palette? (Leave blank to use     
generated colors from Material) #0095D4
✔ What HEX color should be used represent the neutral color palette? (Leave blank to use      
generated colors from Material)
✔ What HEX color should be used represent the neutral variant palette? (Leave blank to use    
generated colors from Material)
✔ What HEX color should be used represent the error palette? (Leave blank to use generated    
colors from Material) #e2001a
✔ Do you want to generate high contrast value override mixins for your themes?. Providing a   
high contrast version of your theme when a user specifies helps increase the accesibility of  
your application. Yes
? What is the directory you want to place the generated theme file in? (Enter the relative    
path such as 'src/app/styles/' or leave blank to generate at your project root)
````

Une fois le thème généré, modifier le fichier styles.scss pour utiliser le thème custom :

````css
@use '@angular/material' as mat;

@use '../src/app/styles/themestheme.css';

html {
  @include mat.theme((
    // color: (
    //   primary: mat.$azure-palette,
    //   tertiary: mat.$blue-palette,
    // ),
    typography: Roboto,
    density: 0,
  ));
}
````


## Customiser les composants material

La rubrique *Styling* des composants, de la documentation montre un exemple de surcharge

*exemple tiré de la doc*
````css
@use '@angular/material' as mat;

// Customize the entire app. Change :root to your selector if you want to scope the styles.
:root {
  @include mat.fab-overrides((
    container-color: orange,
    container-elevation-shadow: -4px -4px 5px 0px rgba(0, 0, 0, 0.5),
  ));
}
````

Chercher dans la documentation la surcharge qui nous intéresse. Par exemple si l'on souhaite surcharger 
les boutons, chercher la section *button-overrides* puis dans le filtre choisir *color* par exemple.

Ceci va nous donner tous les tokens que l'on peut modifier

Exemple de surcharge basique : 

*styles.scss (ou css)*
````css
@use '@angular/material' as mat;

@use '../src/app/styles/themestheme.css';

html {  
  @include mat.theme((
    // color: (
    //   primary: mat.$azure-palette,
    //   tertiary: mat.$blue-palette,
    // ),
    typography: Roboto,
    density: 0,
  ));
}

body {
  // Default the application to a light color theme. This can be changed to
  // `dark` to enable the dark color theme, or to `light dark` to defer to the
  // user's system settings.
  color-scheme: light;

  // Set a default background, font and text colors for the application using
  // Angular Material's system-level CSS variables. Learn more about these
  // variables at https://material.angular.dev/guide/system-variables
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  font: var(--mat-sys-body-medium);

  // Reset the user agent margin.
  margin: 0;
}
/* You can add global styles to this file, and also import other style files */

html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }

.accent {
  @include mat.button-overrides((
    filled-container-color: var(--mat-sys-tertiary),
    filled-label-text-color: var(--mat-sys-on-tertiary)
  ));
}
.primary {  
  @include mat.button-overrides((
    filled-container-color: var(--mat-sys-primary),
    filled-label-text-color: var(--mat-sys-on-primary)));
}
.secondary {
  @include mat.button-overrides((
    filled-container-color: var(--mat-sys-secondary),
    filled-label-text-color: var(--mat-sys-on-secondary)));
}
.error {
  @include mat.button-overrides((
    filled-container-color: var(--mat-sys-error),
    filled-label-text-color: var(--mat-sys-on-error)));
}
````
