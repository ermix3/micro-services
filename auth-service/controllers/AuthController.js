require('dotenv').config()
const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {config} = require("dotenv");

const register = async (req, res) => {
    let {nom, email, mot_passe} = req.body;

    const userExists = await Utilisateur.findOne({
        email
    });

    if (userExists) {
        return res.json({message: "Cet utilisateur existe déjà"});
    } else {
        bcrypt.hash(mot_passe, 10, (err, hash) => {
            console.log(hash);
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const newUtilisateur = new Utilisateur({
                    nom,
                    email,
                    mot_passe: hash
                });
                newUtilisateur
                    .save()
                    .then((user) => res.status(201).json(user))
                    .catch((error) => res.status(400).json({error}));
            }
        });
    }
}

const login = async (req, res) => {
    const {email, mot_passe} = req.body;
    const utilisateur = await Utilisateur.findOne({
        email
    });

    if (!utilisateur) {
        return res.json({message: "Utilisateur introuvable"});
    } else {
        bcrypt.compare(mot_passe, utilisateur.mot_passe).then((resultat) => {
            if (!resultat) {
                return res.json({message: "Mot de passe incorrect"});
            } else {
                const payload = {
                    email,
                    nom: utilisateur.nom
                };
                jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
                    if (err) console.log(err);
                    else return res.json({token: token});
                });
            }
        });
    }
}

const verifyToken = (req, res) => {
    try {
        //   console.log(req.body.headers.Authorization);
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY);
        res.json({isAuth: true});
    } catch (error) {
        res.status(401).json({isAuth: false});
    }
}

module.exports = {
    register, login, verifyToken
}