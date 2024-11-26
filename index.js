const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); // Importer le middleware CORS
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Activer CORS pour toutes les requêtes
app.use(cors());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "dfs_g2_24_25",
  password: ""
});

connection.connect();

app.get("/", (req, res) => {
  res.send("Le serveur marche, mais il y a rien à voir ici");
});

app.post("/connexion", (req, res) => {
  const utilisateur = req.body;

  connection.query(
    "SELECT * FROM utilisateur WHERE email = ? AND password = ?",
    [utilisateur.email, utilisateur.password],
    function (err, rows, fields) {
      if (err) throw err;
      console.log(rows.length);
    }
  );

  res.json({ jwt: "le futur jwt" });
});

app.get("/categories", (req, res) => {
  const categoriesParDefaut = [
    { titre: "S", images: [] },
    { titre: "A", images: [] },
    { titre: "B", images: [] },
    { titre: "C", images: [] }
  ];

  res.json(categoriesParDefaut);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(
    `Serveur en cours d'exécution sur http://localhost:${port} !!!!!!!!`
  );
});
