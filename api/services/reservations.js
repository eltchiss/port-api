const Reservation = require('../models/reservations');

//Créer une réservation
async function createReservation(catwayNumber, data) {
  const reservation = new Reservation({
    catwayNumber,
    ...data,
  });
  return await reservation.save();
}

//Lister toutes les réservations d’un catway
async function getReservationsByCatway(catwayNumber) {
  return await Reservation.find({ catwayNumber }).sort({ startDate: 1 });
}

//Détails d’une réservation spécifique
async function getReservationById(catwayNumber, reservationId) {
  return await Reservation.findOne({ _id: reservationId, catwayNumber });
}

//Modifier une réservation
async function updateReservation(catwayNumber, reservationId, data) {
  return await Reservation.findOneAndUpdate(
    { _id: reservationId, catwayNumber },
    data,
    { new: true, runValidators: true }
  );
}

//supprimer une réservation
async function deleteReservation(catwayNumber, reservationId) {
  return await Reservation.findOneAndDelete({ _id: reservationId, catwayNumber });
}

module.exports = {
  getAllByCatway: getReservationsByCatway,
  getById: getReservationById,
  add: createReservation,
  update: updateReservation,
  delete: deleteReservation,
};
