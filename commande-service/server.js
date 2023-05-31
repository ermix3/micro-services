require("dotenv").config();
const express = require("express");
const isAuth = require("./middleware/isAuth");
const app = express();
const PORT = process.env.PORT_ONE || 5001;
const mongoose = require("mongoose");
const Commande = require("./models/Commande");
const axios = require("axios");
//Connexion à la base de données
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/commande-service-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(express.json());

function prixTotal(produits) {
  let total = 0;
  for (let t = 0; t < produits.length; ++t) {
    total += produits[t].prix;
  }
  console.log("prix total :" + total);
  return total;
}

async function httpRequest(ids) {
  try {
    const URL = "http://localhost:4000/produit/acheter";
    const response = await axios.post(
      URL,
      { ids },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);
    return prixTotal(response.data);
  } catch (error) {
    console.error(error);
  }
}

app.post(
  "/commande/ajouter",
  isAuth,
  async (req, res, next) => {
    const { ids, email_utilisateur } = req.body;

    httpRequest(ids).then((total) => {
      const newCommande = new Commande({
        produits: ids,
        email_utilisateur,
        prix_total: total
      });

      newCommande
        .save()
        .then((commande) => res.status(201).json(commande))
        .catch((error) => res.status(400).json({ error }));
    });
    
  }
);

app.get("/commandes", (req, res, next) => {
  Commande.find()
    .then((commandes) => res.status(200).json(commandes))
    .catch((error) => res.status(400).json({ error }));
});

app.listen(PORT, () => {
  console.log(`Commande-Service at ${PORT}`);
});
