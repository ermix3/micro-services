const Commande = require("../models/Commande");
const axios = require("axios");

const ajouter = async (req, res, next) => {
    const {ids, email_utilisateur} = req.body;

    httpRequest(ids).then((total) => {
        const newCommande = new Commande({
            produits: ids,
            email_utilisateur,
            prix_total: total
        });

        newCommande
            .save()
            .then((commande) => res.status(201).json(commande))
            .catch((error) => res.status(400).json({error}));
    });
}

const allCommandes = async (req, res, next) => {
    Commande.find()
        .then((commandes) => res.status(200).json(commandes))
        .catch((error) => res.status(400).json({error}));
}

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
            {ids},
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

module.exports = {
    ajouter, allCommandes
};