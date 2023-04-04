[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Serveur NodeJS

## Exemple serveur JWT

Installation des dépendances :
````
npm install express jsonwebtoken body-parser
````

````typescript
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Configuration
const PORT = 3000;
const SECRET_KEY = "your-secret-key";

// Middleware pour ajouter les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Route pour générer le token JWT
app.post("/generateToken", (req, res) => {
  // Récupérer les informations d'utilisateur depuis les paramètres de requête
  const { username, email } = req.body;

  // Vérifier que toutes les informations d'utilisateur sont fournies
  if (!username || !email) {
    return res.status(400).json({ error: "Missing user information" });
  }

  // Données de l'utilisateur
  const user = { username, email };

  // Générer le token JWT
  jwt.sign({ user }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      res.status(500).json({ error: "Failed to generate token" });
    } else {
      res.json({ token });
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

````

Lancer le serveur ````node server.js````

Exemple d'appel depuis un front React 

````typescript
fetch("http://localhost:3000/generateToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name?.toString(),
        email: email?.toString(),
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        AccountHelperService.saveToken(res.token);
        navigate("/admin");
      })
      .catch(console.log);
````
