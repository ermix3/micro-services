require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.SERVER_PORT || 5001;


//Connexion à la base de données
mongoose.set("strictQuery", true);
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Middleware
app.use(express.json());

//Routes
app.get("/", (res, req)=>res.status(200).json({message: "Hello and welcome"}));
app.use("/commandes", require("./routes/commandeRoutes"));

// const amqp = require("amqplib");
// let connection, channel;
//
// const connect = async () => {
//   const amqpServer = "amqp://localhost:5672";
//   connection = await amqp.connect(amqpServer);
//
//   channel = await connection.createChannel();
//
//   const queue = 'file_attente1',
//         msg = 'Bonjour le monde' ;
//
//   await channel.assertQueue(queue);
//   await channel.sendToQueue(queue, Buffer.from(msg));
//   console.log( " [x] Envoyé %s" , msg);
// }
//
// connect();

app.listen(PORT, () => console.log(`Commande-Service at ${PORT}`));

