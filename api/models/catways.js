const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    required: true,
    enum: ['long', 'short']
  },
  catwayState: {
    type: String,
    required: true,
    minlength: 3
  }
}, { timestamps: true });

module.exports = mongoose.model('Catway', catwaySchema);
