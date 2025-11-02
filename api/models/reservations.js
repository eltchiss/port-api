const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayNumber: { //numéro lié a un catway
    type: Number,
    required: true,
    ref: 'Catway', // référence logique vers le catway concerné
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
        return value >= new Date();
      },
      message: 'La date de début doit être dans le futur.',
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

// Option : index pour accélérer la recherche par catwayNumber
reservationSchema.index({ catwayNumber: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
