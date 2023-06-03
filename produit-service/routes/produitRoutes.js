const express = require("express");
const {ajouter, acheter} = require("../controllers/ProduitController");
const router = express.Router();


router.post("/ajouter", ajouter);
router.post("/acheter", acheter);


module.exports = router;