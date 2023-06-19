# Extension Chrome

## Création de l'extension

Dans cet exemple nous allons créer une extension chrome dont le but est de fournir une liste d'url pré-définies, de pouvoir cocher / décocher certaines d'entre-elles et d'ouvrir
un nouvel onglet chrome pour chacunes d'elles lors de la validation.

### manifest

*manifest.json*

````json
{
  "manifest_version": 3,
  "name": "Mon Extension",
  "version": "1.0.0",
  "author": "me",
  "description": "mon extension a pour but de ...",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": [
    "tabs"
  ],
  "icons": {
	  "16": "icon.png",
	  "48": "icon48.png",
	  "128": "icon128.png"
	}
}
````

Pour les icônes, prévoir de générer les icônes aux dimensions 16, 48 et 128 dans le répertoire de l'extension

### html

*popup.html*

````html
<!DOCTYPE html>
<html>
<head>
  <title>Mon extension</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
   <style>
    body {
      width: 300px;
	  font-family: 'Roboto', Arial, sans-serif;
    }
	#content {
		padding: 20px;
	}
    header {
      background-color: #003883;
      height: 40px;
      padding: 10px;
      color: white;
	  display: flex;
	  align-items: center;
	  font-size: 1.4em;
	  font-weight: 600;
  }	
	img {
		border-radius: 100%;
		margin-right: 10px;
	}
  ul {
	  list-style-type: none;
	  padding: 0;
	  display: grid;
	  grid-template-columns: repeat(2, 1fr);
	  gap: 10px;
	}
  li {
      margin-bottom: 10px;
  }
  button {
      display: block;
      margin-top: 10px;
  }
  </style>
  
</head>
<body>
  <header>
  <img src="logo.png" width="20" height="20" />
    Mon extension
  </header>
  <div id="content">
	  <label>
		<input type="checkbox" id="selectAllCheckbox"> Sélectionner tout
	  </label>
	  <ul id="urlList"></ul>
	  <button id="openTabsButton" class="mdl-button mdl-button--raised">Ouvrir</button>
  </div>  
</body>

<script src="popup.js"></script>
</html>
````

### javascript

*popup.js*

````javascript
document.addEventListener('DOMContentLoaded', function() {
  var urls = ['test.com', 'test2.com'];
  var urlPrefix = 'https://www.'
  var urlList = document.getElementById('urlList');
  var selectAllCheckbox = document.getElementById('selectAllCheckbox');  
  
  for (var i = 0; i < urls.length; i++) {	
	  var url = `${urlPrefix}${urls[i]}`;
	  createCheckboxItem(url, urls[i])
  }

  selectAllCheckbox.addEventListener('change', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  document.getElementById('openTabsButton').addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var selectedUrls = Array.from(checkboxes).map(function(checkbox) {
      return checkbox.value;
    });
	
	if (selectedUrls.length > 7) {
      var confirmation = confirm('Vous avez sélectionné plus de 7 éléments. Êtes-vous certain de vouloir ouvrir autant d\'onglets ?');
      if (!confirmation) {
        return;
      }
    }
    for (var i = 0; i < selectedUrls.length; i++) {
      chrome.tabs.create({ url: selectedUrls[i] });
    }
  });
});

function createCheckboxItem(url, label) {
	var listItem = document.createElement('li');
	var checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.value = url;
	listItem.appendChild(checkbox);
	listItem.appendChild(document.createTextNode(label));
	urlList.appendChild(listItem);
}
````

## Déployer l'extension

* Se rendre sur [chrome://extensions/](chrome://extensions/)
* Activer le mode développeur en haut à droite
* Cliquer sur Charger l'extension non empaquetée (sélectionner le dossier contenant l'extension)

Il suffit ensuite d'aller dans l'onglet extension de chrome et de tester la nouvelle extension
