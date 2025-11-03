const Reservation = require('../models/reservations');

// Lister toutes les réservations d’un catway
exports.getAllByCatway = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const reservations = await Reservation.find({ catwayNumber }).sort({ startDate: 1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Détails d’une réservation spécifique
exports.getById = async (req, res) => {
  try {
    const { id: catwayNumber, reservationId } = req.params;
    const reservation = await Reservation.findOne({ _id: reservationId, catwayNumber });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une réservation
exports.add = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const { clientName, boatName, startDate, endDate } = req.body;

    const newReservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate,
    });

    const saved = await newReservation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Modifier une réservation
exports.update = async (req, res) => {
  try {
    const { id: catwayNumber, reservationId } = req.params;
    const data = req.body;

    const updated = await Reservation.findOneAndUpdate(
      { _id: reservationId, catwayNumber },
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réservation
exports.delete = async (req, res) => {
  try {
    const { id: catwayNumber, reservationId } = req.params;

    const deleted = await Reservation.findOneAndDelete({ _id: reservationId, catwayNumber });

    if (!deleted) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
