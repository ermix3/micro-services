const mongoose = require("mongoose");
const CommandeSchema = mongoose.Schema({
  produits: {
    type: [String]
  },
  email_utilisateur: String,
  prix_total: Number,
 
},{
    timestamps: true
});
module.exports = Commande = mongoose.model("commande", CommandeSchema);
