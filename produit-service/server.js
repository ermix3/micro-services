require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const mongoose = require("mongoose");
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
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
