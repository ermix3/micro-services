require("dotenv").config();
const express = require("express");
const isAuth = require("./middleware/isAuth");
const app = express();
const PORT = process.env.PORT || 5001;
const mongoose = require("mongoose");
const Commande = require("./models/Commande");
const axios = require("axios");
//Connexion à la base de données
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {
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

const amqp = require("amqplib");
let connection, channel;

const connect = async () => {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);

  channel = await connection.createChannel();

  const queue = 'file_attente1',
        msg = 'Bonjour le monde' ;

  await channel.assertQueue(queue);
  await channel.sendToQueue(queue, Buffer.from(msg));
  console.log( " [x] Envoyé %s" , msg);
}

connect();

// setTimeout(function() {
//   connection.close();
//   process.exit(0)
// }, 500);

app.listen(PORT, () => {
  console.log(`Commande-Service at ${PORT}`);
});

