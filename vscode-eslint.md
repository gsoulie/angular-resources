[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development/blob/master/angular-formation.md)    

# Moving to ESLint

* [Migration](#migration)      
* [Configuration](#configuration)           

Since 2019 TSLint is deprecated, so it's time to move on ESLint

[Ionic blog](https://ionicframework.com/blog/eslint-for-ionic-angular/)       

````
git add .
git commit -m "pre eslint"
git checkout -b feat-eslint

ng add @angular-eslint/schematics

// convert current tslint to eslint file
ng g @angular-eslint/schematics:convert-tslint-to-eslint {{YOUR_PROJECT_NAME_GOES_HERE}}

// once it's done you can run eslint and remove old tslint file and dependcies
rm tslint.json
npm uninstall tslint
````
## Configuration
[Back to top](#moving-to-eslint)

See AirBnb standard

## eslint.json

*eslint.json*
````typescript
{
  "root": true,
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": [
          "tsconfig.app.json",
          "tsconfig.spec.json",
          "e2e/tsconfig.json"
        ],
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        // This is required if you use inline templates in Components
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        /**
         * Any TypeScript source code (NOT TEMPLATE) related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         */
        "@angular-eslint/directive-selector": [
          "error",
          { "type": "attribute", "prefix": "app", "style": "camelCase" }
        ],
        "@angular-eslint/component-selector": [
          "error",
          { "type": "element", "prefix": "app", "style": "kebab-case" }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {
        /**
         * Any template/HTML related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         */
      }
    }
  ]
}
````
