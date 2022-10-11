[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

# VSCode

* [Themes](#themes)     
* [Extensions](https://github.com/gsoulie/angular-resources/blob/master/vscode-extension.md)     
* [Tasks](#tasks)   
* [ESLint](https://github.com/gsoulie/angular-resources/blob/master/vscode-eslint.md)   
* [Debug](https://github.com/gsoulie/angular-resources/blob/master/vscode-debug.md)     
* [Cursive fonts](#cursive-fonts)      
* [Snippet typescript](https://github.com/gsoulie/angular-resources/blob/master/vscode-snippet-typescript.json)       
* [Snippet html](https://github.com/gsoulie/angular-resources/blob/master/vscode-snippet-html.json)       
* [Backup vscode setting.json](#backup-settings)      

## Themes

Best themes :

* [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)     
* [Dracula](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula)      
* [SynthWave](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode)     
* [Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night)     
* [Tokyo Hack](https://vscodethemes.com/e/ajshortt.tokyo-hack/tokyo-hack?language=javascript)     
* [Shade of purple](https://marketplace.visualstudio.com/items?itemName=ahmadawais.shades-of-purple#:~:text=Launch%20Quick%20Open%20using%20Cmd,%E2%80%94%20or%20%E2%80%94%20Ctrl%2BP.&text=shades%2Dof%2Dpurple-,Click%20Install%20to%20install%20it.,Theme%20%EF%BC%9E%20Shades%20of%20Purple.)    


Full vscode customization : https://code.visualstudio.com/api/references/theme-color     

## Tasks

[Tasks examples](https://github.com/gsoulie/ionic-angular-snippets/blob/master/vscode-tasks.json)

> Tips : if you want to group tasks by role, set a same prefix to the task name for all tasks you want to group by

*tasks.json*
````typescript
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "00_frontend-serve Angular app",
            "type": "shell",
            "command": "ng",
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "args": [ "serve", "--open" ]
        },
        {
            "label": "00_frontend-build Angular app",
            "type": "shell",
            "command": "ng",
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "args": [ "build", "--configuration=production" ]
        },
        {
            "label": "01_backend-1_serve api",
            "type": "shell",
            "command": "npm",
            "options": { "cwd": "${workspaceFolder}" },
            "args": [ "run", "nx", "serve", "api" ]
        },
        {
          "label": "01_backend-2_run prisma studio",
          "type": "shell",
          "command": "npx",
          "options": { "cwd": "${workspaceFolder}" },
          "args": [ "prisma", "studio" ]
        }
      ]
}
````

## Cursive fonts

Download a cursive font like :
* [FiraCode iScript](https://github.com/kencrocken/FiraCodeiScript)    
* [DankMono]()       
* [Monoid](https://larsenwork.com/monoid/)       

[customization](https://stackoverflow.com/questions/51110201/italicize-javascripts-reserved-keywords-in-vs-code)    

Add the following code into vscode *settings.json* for a minimal configuration. Other options are commented in the json below.

> To edit settings.json manually, go to command palette and choose "Preferences: Open User Settings (JSON)"

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
          "constant.language",
          //"storage",
          "storage.modifier",   // public, private, protected...
          "entity.other.attribute-name",    // for html attribute
          /*"keyword.control",    // import, from, export, default, return, if, for, break, continue, try, catch, finally, throw, default, yield, await
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
          "constant.language", // true, false, null
          "support.type.primitive",
          "entity.name.method.js",
          "entity.other.attribute-name",
          "punctuation.definition.comment",
          "text.html.basic entity.other.attribute-name",
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
          "source.js constant.other.object.key.js string.unquoted.label.js",*/
        ],
        "settings": {
          "fontStyle": "italic",
        }
      },
    ]
  },
 
Copy code
````

You can also specify differents scopes to manage italic for specific item, bold for other etc...

````json
"editor.tokenColorCustomizations": {
        "textMateRules": [
          {
            "scope": [
              //following will be in italic (=FlottFlott)
              "comment",
              //"entity.name.type.class", //class names
              "keyword", //import, export, return…
              "constant", //String, Number, Boolean…, this, super
              "storage.modifier", //static keyword
              "storage.type.class.js", //class keyword
            ],
            "settings": {
              "fontStyle": "italic"
            }
          },
          {
            "scope": [
              //following will be excluded from italics (VSCode has some defaults for italics)
              "invalid",
              "keyword.operator",
              "constant.numeric.css",
              "keyword.other.unit.px.css",
              "constant.numeric.decimal.js",
              "constant.numeric.json"
            ],
            "settings": {
              "fontStyle": "bold"
            }
          }
        ]
      }
````

## Backup settings

*settings.json*
````json
{
    "workbench.iconTheme": "material-icon-theme",
    "eslint.alwaysShowStatus": true,
    "eslint.format.enable": true,
    "javascript.implicitProjectConfig.experimentalDecorators": true,
    "angular.experimental-ivy": true,
    "git.suggestSmartCommit": false,
    "[typescript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "workbench.startupEditor": "newUntitledFile",
    "peacock.affectAccentBorders": true,
    "peacock.affectTabActiveBorder": true,
    "peacock.favoriteColors": [
        {"name": "Angular Red","value": "#dd0531"},
        {"name": "Azure Blue","value": "#007fff"},
        {"name": "JavaScript Yellow","value": "#f9e64f"},
        {"name": "Mandalorian Blue","value": "#1857a4"},
        {"name": "Node Green","value": "#215732"},
        {"name": "React Blue","value": "#61dafb"},
        {"name": "Something Different","value": "#832561"},
        {"name": "Svelte Orange","value": "#ff3d00"},
        {"name": "Vue Green","value": "#42b883"},
        {"name": "Dark Gray","value": "#3D3D3D"},
        {"name": "Ionic Blue","value": "#5291FF"},
        {"name": "FRAndroid Dark","value": "#1E2334"}
    ],
    "peacock.elementAdjustments": {
        "activityBar": "none",
        "statusBar": "darken",
        "titleBar": "darken"
    },
    "diffEditor.ignoreTrimWhitespace": false,
    "team.showWelcomeMessage": false,
    "javascript.updateImportsOnFileMove.enabled": "always",
    "editor.fontFamily": "Fira Code iScript, Monoid, 'Courier New', monospace",
    "editor.fontLigatures": true,
    "editor.lineHeight": 22,
    "editor.cursorBlinking": "smooth",
    "editor.formatOnType": true,
    "editor.formatOnPaste": true,
    "editor.tokenColorCustomizations": {
      "comments": "#39bf87",//"#39bf87",//3ac4a1
      "textMateRules": [
        {
          "name": "italic font",
          "scope": [
            "comment",
            "keyword",            
            "constant.language",
            "storage.modifier",
            "storage.type.function",
            "entity.other.attribute-name"
          ],
          "settings": {
            "fontStyle": "italic"
          }
        },
      ]
    },
    "[json]": {
      "editor.defaultFormatter": "vscode.json-language-features"
    },
    "editor.guides.bracketPairs": true,
    "bracketPairColorizer.depreciation-notice": false,
    "vetur.experimental.templateInterpolationService": true,
    "editor.fontWeight": "normal",
    
    "workbench.colorTheme": "Tokyo Hack",
    "workbench.colorCustomizations": {
        "activityBar.activeBorder": "#39bf87",//#ffaa00
        "activityBarBadge.background": "#39bf87",        
        "activityBarBadge.foreground": "#000000",
        //"activityBar.background": "#00AA00"   // background de la barre latérale,
        "window.inactiveBorder": "#ea00ff",
        "window.activeBorder": "#ffaa00",
        "toolbar.hoverBackground": "#39bf87",
        "badge.background": "#ffaa00",
        "titleBar.activeBackground": "#f7df1e",
        "titleBar.activeForeground": "#000000",
        "titleBar.inactiveBackground": "#00D7FF",
        "titleBar.inactiveForeground": "#000000",
        "badge.foreground": "#000000",
        "scrollbarSlider.background": "#603c73",
    },
    "window.titleBarStyle": "custom",
    "[vue]": {
        "editor.defaultFormatter": "qiang014.vetur-e"
    },
    "editor.tabSize": 2
}
````
