const Produit = require("../models/Produit");


const ajouter = async (req, res, next) => {
    const {nom, description, prix} = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });

    newProduit
        .save()
        .then((produit) => res.status(201).json(produit))
        .catch((error) => res.status(400).json({error}));
}

const acheter = async (req, res, next) => {
    const {ids} = req.body;
    Produit.find({_id: {$in: ids}})
        .then((produits) => res.status(201).json(produits))
        .catch((error) => res.status(400).json({error}));
}

module.exports = {
    ajouter, acheter
}