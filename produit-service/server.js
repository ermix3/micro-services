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

// Routes
app.use("/produits", require("./routes/produitRoutes"));

// const amqp = require("amqplib");
// let connection, channel;
//
// const connect = async ()=> {
//   const amqpServer = "amqp://localhost:5672";
//
//   connection = await amqp.connect(amqpServer);
//   channel = await connection.createChannel();
//
//   const queue = 'file_attente1';
//
//   await channel.assertQueue(queue);
//   await channel.consume(queue, (msg) => {
//     console.log(" [x] Received %s", msg.content.toString());
//     channel.ack(msg);
//   });
// }
//
// connect();

app.listen(PORT, () => console.log(`Product-Service at ${PORT}`))
