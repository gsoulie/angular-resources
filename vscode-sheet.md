[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

# VSCode

* [Extensions](https://github.com/gsoulie/angular-resources/blob/master/vscode-extension.md)     
* [Tasks](https://github.com/gsoulie/ionic-angular-snippets/blob/master/vscode-tasks.json)   
* [ESLint](https://github.com/gsoulie/angular-resources/blob/master/vscode-eslint.md)   
* [Debug](https://github.com/gsoulie/angular-resources/blob/master/vscode-debug.md)     


## Cursive font

Add the following code into *settings.json*

*settings.json*

````json
"editor.fontFamily": "Fira Code iScript, Consolas, 'Courier New', monospace",
"editor.fontLigatures": true,

"editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "name": "italic font",
        "scope": [
          "comment",
          "keyword",
          "storage",
          "keyword.control",
          "keyword.control.from",
          "keyword.control.flow",
          "keyword.operator.new",
          "keyword.control.import",
          "keyword.control.export",
          "keyword.control.default",
          "keyword.control.trycatch",
          "keyword.control.conditional",
          "storage.type",
          "storage.type.class",
          "storage.modifier.tsx",
          "storage.type.function",
          "storage.modifier.async",
          "variable.language",
          "variable.language.this",
          "variable.language.super",
          "meta.class",
          "meta.var.expr",
          "constant.language.null",
          "support.type.primitive",
          "entity.name.method.js",
          "entity.other.attribute-name",
          "punctuation.definition.comment",
          "text.html.basic entity.other.attribute-name",
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
          "source.js constant.other.object.key.js string.unquoted.label.js",
        ],
        "settings": {
          "fontStyle": "italic",
        }
      },
    ]
  },
 
Copy code
````
