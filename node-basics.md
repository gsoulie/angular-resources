[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# NodeJS - API REST

## Resources

https://github.com/gsoulie/ionic2-resources/blob/master/ionic-nodejs-backend.md       

## Initialisation

1 - Créer un nouveau répertoire     
2 - Créer un fichier vide *server.js*     
3 - initialiser le projet avec ````npm init````

> Astuce : installer nodemon pour éviter de devoir stopper et re-démarrer le server après chaque modification de code

extension vscode **thunder client** pour faciliter les tests d'api

### installation des plugins 

Dans le répertoire du server ````npm i --save express mongoose body-parser morgan cors````

## Exemple de serveur simple (architecture mono fichier)

*server.js*

<details>
	<summary>Code du serveur</summary>

````typescript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(logger('dev')); // use logger middleware (allow to log operations)
app.use(cors()); // use cors middleware

// Configuration du port 
const PORT = process.env.PORT || 3000;	// 8080
app.set('port', PORT);

// Cors issues (si client ne s'éxécute pas sur le même port / url que le serveur)
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Récupération du body des requête (obligatoire sinon erreur sur les POSTS)
const jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsonParser);

// Connexion à la db
mongoose.connect('mongodb://localhost/books', {
	useNewUrlParser: true,
	uneUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
});

// Définir le Schéma Book
const BookSchema = new mongoose.Schema({
	title: String,
	author: String,
	description: String
});

// Création du Book model
const Book = mongoose.model('Book', BookSchema);

// Définir les routes API ------------------

// Get
app.get('api/books', function(req, res) {
	Book.find(function(err, books) {
		if (err) { res.send(err); }
		res.json(books);
	}
});

// Post
app.post('api/book', function(req, res) {
	Book.create(req.body, function(err, book) {
		if (err) { res.send(err); }
		res.json(book);
	}
});

// Get by Id
app.get('api/books/:id', function(req, res) {
	Book.findById(req.params.id, req.body, function(err, book) {
		if (err) { res.send(err); }
		res.json(book);
	}
});

// Put
app.put('api/books/:id', function(req, res) {
	Book.findByIdAndUpdate(req.params.id, req.body, function(err, book) {
		if (err) { res.send(err); }
		res.json(book);
	}
});

// Delete
app.delete('api/books/:id', function(req, res) {
	Book.findByIdAndRemove(req.params.id, function(err, book) {
		if (err) { res.send(err); }
		res.json(book);
	}
});

// Démarrer le serveur
app.listen(app.get('port'), () => {
	console.log('Server listening on port 3000');
});

// Exports (si besoin d'utiliser dans un autre fichier)
module.exports = app;
````
 
</details>

## Architecture Multi-fichiers

````typescript
// Import du model Book depuis le répertoire models
const Book = require('./models/books');

// Import du controller books depuis le répertoire controllers
const books = require('./controllers/books');

app.use('/api/books', require('./controllers/books'));
````

## Retourner des codes erreurs HTTP spécifiques

````typescript
app.post('/checkname', function(req, res){
    if(req.body.name.toLowerCase() === 'homer'){
        // If username = 'homer' generate error 401 status (not recommanded !)
        res.status(401).send({message: 'Sorry, no Homer\'s!'});
 
    } else {
        // If ok, send response to client
        res.send({
            passed: true,
            message: 'Welcome, friend!'
        });
 
    }
});
````

## Run

mongoose : Démarrer mongoose dans un terminal

express : Exécuter la commande ````npm start```` 
