require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT || 5002;
const mongoose = require("mongoose");

// connect to DB
mongoose.set("strictQuery", true);
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(express.json());
app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => console.log(`Auth-Service at ${PORT}`));
