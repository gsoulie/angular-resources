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

let mockData = [
  {
    id: 1,
    username: "Mike",
    email: "mike@test.com",
    isAdmin: true,
  },
  {
    id: 2,
    username: "Tom",
    email: "tom@test.com",
    isAdmin: false,
  },
];

// Middleware pour ajouter les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Fonction pour contrôler l'authentification via un token Bearer présent dans le header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
};

// APPLIQUER LE CONTRÔLE SUR LE BEARER SUR TOUTES LES APIS
//app.use(verifyToken);

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

// Route privée avec contrôle du token
app.get("/users", verifyToken, (req, res) => {
  res.send(mockData);
});

// Route privée avec contrôle du token
app.get("/user/:id", verifyToken, (req, res) => {
  const { id } = req.query;
  const filteredData = mockData.filter((u) => u.id === id);
  res.send(filteredData);
});

// Route privée avec contrôle du token
app.post("user/add", verifyToken, (req, res) => {
  const { username, email, isAdmin } = req.body;

  // Vérifier que toutes les informations d'utilisateur sont fournies
  if (!username || !email || !isAdmin) {
    return res.status(400).json({ error: "Missing user information" });
  }

  // Données de l'utilisateur
  const newUser = { username, email, isAdmin };

  newUser = { ...PORT, id: Date.now() };

  mockData.push(newUser);

  res.json({ newUser });
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
