const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayNumber: { //numéro lié a un catway
    type: Number,
    required: true,
    ref: 'Catway', // référence logique vers le catway concerné
  },
  
  // NOUVEAU CHAMP : Lien vers l'utilisateur connecté
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Référence au modèle User (qui détient l'ID MongoDB)
  },

  clientName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  boatName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return true; 
      },
      message: 'La date de début doit être valide.',
    },
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Vérifie que la fin est après le début
        return this.startDate ? value > this.startDate : true;
      },
      message: 'La date de fin doit être postérieure à la date de début.',
    },
  },
}, { timestamps: true });

// Option : index pour accélérer la recherche par catwayNumber et userId
reservationSchema.index({ catwayNumber: 1 });
reservationSchema.index({ userId: 1 }); // Index pour la recherche rapide du dashboard

module.exports = mongoose.model('Reservation', reservationSchema);