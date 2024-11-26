const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors"); // Importer le middleware CORS
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

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
      if (rows.length == 1) {
        const token = jwt.sign({ sub: utilisateur.email }, "azerty");
        res.send({ jwt: token });
      } else {
        res.status(403).send({ error: "Identifiants inconnus" });
      }
    }
  );
});

app.get("/categories", (req, res) => {
  const token = req.headers["authorization"];

  jwt.verify(token, "azerty", (erreur, donnees) => {
    if (erreur) return res.sendStatus(403);

    const email = donnees.sub;

    connection.query(
      "SELECT c.id, c.titre FROM categorie c JOIN utilisateur u ON u.id = c.id_utilisateur WHERE u.email = ?",
      [email],
      function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
      }
    );
  });

  // const categoriesParDefaut = [
  //   { titre: "S", images: [] },
  //   { titre: "A", images: [] },
  //   { titre: "B", images: [] },
  //   { titre: "C", images: [] }
  // ];

  // res.json(categoriesParDefaut);
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(
    `Serveur en cours d'exécution sur http://localhost:${port} !!!!!!!!`
  );
});
