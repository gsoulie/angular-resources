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

*basic eslint.json*
````typescript
{
    "root": true,
    "ignorePatterns": [
      "projects/**/*"
    ],
    "overrides": [
      {
        "files": [
          "*.ts"
        ],
        "parserOptions": {
          "project": [
            "tsconfig.json",
            "e2e/tsconfig.json"
          ],
          "createDefaultProgram": true
        },
        "extends": [
            "plugin:@angular-eslint/recommended",
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "plugin:@angular-eslint/template/process-inline-templates"
        ],
        "rules": {
          "@angular-eslint/component-selector": [
            "error",
            {
              "type": "element",
              "prefix": "app",
              "style": "kebab-case"
            }
          ],
          "@angular-eslint/directive-selector": [
            "error",
            {
              "type": "attribute",
              "prefix": "app",
              "style": "camelCase"
            }
          ]
        }
      },
      {
        "files": [
          "*.html"
        ],
        "extends": [
          "plugin:@angular-eslint/template/recommended"
        ],
        "rules": {}
      }
    ]
  }
````

### Exclude files from linting

*package.json*

````json
"eslintIgnore": ["*.spec.ts", "toto.ts"],
````
