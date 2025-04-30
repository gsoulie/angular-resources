[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

 # Configuration ESLint, Prettier

Ce document traite de l'installation et de la configuration des règles de linting ESLint, Prettier, Typescript au sein d'un projet NextJS.

Cette configuration peut être facilement étendue aux projet Angular si nécessaire

## Installation

### Extensions VSCode
La première étape consiste à installer les extensions VSCode suivante : 
* **ESLint**
* **Prettier**
* **SonarQube for IDE**

Une fois les extensions installées, il faut redémarrer le serveur typescript en faisant **CTRL+P** puis dans la toolbar qui s'ouvre, saisir :

````> TypeScript: Restart TS Server````

Si jamais la commande est introuvable ou ne fonctionne pas, recharger la fenêtre avec la commande

````> Reload Window````

### Packages npm

Installer ensuite le paquet **eslint-config-prettier**

````
npm i --save-dev eslint-config-prettier
````

## Configuration

### Règles ESLint
Créer un fichier **eslint.config.mjs** à la racine du projet

*eslint.config.mjs* : exemple de contenu avec quelques règles

````typescript
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript', 'prettier'],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "no-duplicate-imports": "error", // interdire les imports multiple d'un même fichier
      "@typescript-eslint/explicit-function-return-type": "warn", // Expliciter les types de retour des fonctions
       @typescript-eslint/no-floating-promises": "error", // interdire d'ignorer les promises (ex: oublier await ou .catch)
      //"@typescript-eslint/no-misused-promises": "error", // Empêche d'utiliser les promesses de manière incorrecte (ex : dans un if)
      "eqeqeq": ["warn", "always"], // Imposera l’usage de ===/!== plutôt que ==/!=
      "no-eval": "error", // Interdira l’utilisation d’`eval`, dangereux pour la sécurité
      "no-alert": "warn", // Avertira lorsqu’un `alert()` est utilisé (mauvaise UX)
      semi: ['error'],
      //quotes: ['error', 'single'] // à activer dès le début du projet
      "prefer-arrow-callback": ["error"], // affiche une erreur si une fonction est déclarée dynamiquement au lieu d'utiliser les arrow functions
      "prefer-template": ["warn"],  // inciter à l'utilisation des template literals
      "max-statements-per-line": ["warn", { "max": 1 }], // Limiter à une instruction par ligne
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "warn", // Eviter les ternaires inutiles qui peuvent être écrites plus simplement
      "one-var-declaration-per-line": ["warn", "always"], // Ne pas autoriser la déclaration de plusieurs variables sur la même ligne
      "operator-linebreak": ["warn", "none"],
      "complexity": ["warn", { "max": 15 }], // émet un warning si une fonction à une complexité cyclomatique supérieure à 15
      "max-lines": ["warn", 100], // émet un warning si une fonction dépasse 100 lignes
      "no-else-return": "warn", // émet un warning si un else est utilisé après un return
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-useless-constructor": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "max-depth": ["warn", 1],	// émet un warning si une fonction a une profondeur de plus de 1 niveau
      "max-lines-per-function": [
        "warn",
        { "max": 10, "skipBlankLines": true, "skipComments": true }	// émet un warning si une fonction contient plus de 10 lignes de code (hors commentaires)
      ],
      "max-nested-callbacks": ["warn", 1],	// émet un warning si une fonction à plus d'un seul niveau de callback
      "max-params": ["warn", 2],	// émet un warning si une fonction contient plus de 2 paramètres  
      "no-magic-numbers": [// émet une alerte lorsqu'un nombre est utilisé dans le code sans que leur signification ne soit claire (ex: pas déclaré comme constante ou variable)
        "warn",
        {
          "detectObjects": false,
          "enforceConst": true,
          "ignore": [-1, 0, 1, 2, 10, 100],
          "ignoreArrayIndexes": true
        }
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          "selector": "default",
          "format": ["camelCase"],
          "leadingUnderscore": "forbid"
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        },
        {
          "selector": "typeParameter",
          "format": ["PascalCase"],
          "prefix": ["T", "K"]
        },
        {
          "selector": "enumMember",
          "format": ["UPPER_CASE"]
        },
        {
          "selector": ["memberLike", "variableLike"],
          "types": ["boolean"],
          "format": ["PascalCase"],
          "prefix": ["can", "did", "has", "is", "must", "needs", "should", "will"]
        }
      ],
    },
  }),
];

export default eslintConfig;
````

### Prise en compte du formattage à la sauvegarde

Créer un fichier *.vscode/settings.json* à la racine du projet et y insérer le code suivant :

````json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
}
````

### Formattage automatique Prettier

Pour laisser Prettier gérer lui-même le formattage des règles, créer un fichier *prettierrc.json* et définir les règles souhaitées.

Exemple de *prettierrc.json*

````json
{
    "semi": true, // Ajoute un ';' à chaque fin de ligne
    "tabWidth": 2, // Tabulations de 2
    "useTabs": false,// Utilise des espaces plutôt que des tabulations.
    "trailingComma": "all", //  Ajoute les virgules finales dans les objets (pas dans les fonctions)
    "printWidth": 90, // Longueur maximale d’une ligne avant de faire un retour à la ligne automatique.
    "bracketSpacing": true, // Ajoute un espace entre les accolades : { foo: bar } vs {foo: bar}
    "bracketSameLine": false, // Dans les éléments JSX (et HTML-like), place la fermeture de l'accolade sur une nouvelle ligne.
    "arrowParens": "always", // Ajoute toujours des parenthèses autour des paramètres des fonctions fléchées, même pour un seul paramètre.
    "singleAttributePerLine": false // Permet plusieurs attributs sur la même ligne dans le HTML/JSX
}
````

> **Important** : les règles définies dans le prettierrc.json ne doivent pas être en conflits avec les règles définies dans eslint.config.mjs (ex: ne pas définir un tabWidth de 2 dans prettier et un tabWidth de 4 dans ESLint)

A ce stade, si lors de l'enregistrement d'un fichier, ce dernier contient des erreurs et que ces dernières ne sont pas corrigées automatiquement, il faut vérifier qu'il n'y a pas une erreur de linter remontée par VSCode (une croix doit appraître entre {} dans la barre des tâches de VSCode, voir capture ci-dessous)

[![](https://github.com/gsoulie/angular-resources/blob/master/eslint-1.png)](https://github.com/gsoulie/angular-resources/blob/master/eslint-1.png)

Si l'erreur **Formatting - There are multiple formatters for "Typescript JSX" files** est présente, cliquer sur le bouton **Configure** et choisir **Prettier - Code formatter** dans la modale qui s'ouvre

[![](https://github.com/gsoulie/angular-resources/blob/master/eslint-2.png)](https://github.com/gsoulie/angular-resources/blob/master/eslint-2.png)
