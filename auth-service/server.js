require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5002;
const mongoose = require("mongoose");

// connect to DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(express.json());
app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => console.log(`Auth-Service at ${PORT}`));
