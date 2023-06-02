require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const Produit = require("./models/Produit");
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.post("/produit/ajouter", (req, res, next) => {
  const { nom, description, prix } = req.body;
  const newProduit = new Produit({
    nom,
    description,
    prix
  });

  newProduit
    .save()
    .then((produit) => res.status(201).json(produit))
    .catch((error) => res.status(400).json({ error }));
});
app.post("/produit/acheter", (req, res, next) => {
  const { ids } = req.body;
  Produit.find({ _id: { $in: ids } })
    .then((produits) => res.status(201).json(produits))
    .catch((error) => res.status(400).json({ error }));
});

const amqp = require("amqplib");
let connection, channel;

const connect = async ()=> {
  const amqpServer = "amqp://localhost:5672";

  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();

  const queue = 'file_attente1';

  await channel.assertQueue(queue);
  await channel.consume(queue, (msg) => {
    console.log(" [x] Received %s", msg.content.toString());
    channel.ack(msg);
  });
}

connect();

// setTimeout(function() {
//   connection.close();
//   process.exit(0)
// }, 500);

app.listen(PORT, () => console.log(`Product-Service at ${PORT}`))
