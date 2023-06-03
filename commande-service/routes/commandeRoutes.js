const express = require("express");
const router = express.Router();


const isAuth = require("../middleware/isAuth");
const {
    ajouter,
    allCommandes
} = require("../controllers/CommandeController");


router.get("/", allCommandes);
router.post("/ajouter", isAuth, ajouter);

module.exports = router;
