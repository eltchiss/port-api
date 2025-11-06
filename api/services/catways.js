const Catway = require('../models/catways');

// Obtenir tous les catways
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un catway par son numéro (catwayNumber)
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }
    res.status(200).json(catway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau catway
exports.add = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    // Vérifier si le numéro existe déjà
    const existing = await Catway.findOne({ catwayNumber });
    if (existing) {
      return res.status(400).json({ message: 'Ce numéro de catway existe déjà.' });
    }

    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    const saved = await newCatway.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Modifier un catway (état et/ou type)
exports.updateState = async (req, res) => {
  try {
    const { catwayState, catwayType } = req.body;

    // Vérifie qu’au moins un champ est fourni
    if (!catwayState && !catwayType) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
    }

    // Crée dynamiquement l’objet de mise à jour
    const updateFields = {};
    if (catwayState) updateFields.catwayState = catwayState;
    if (catwayType) updateFields.catwayType = catwayType;

    const updated = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      updateFields,
      { new: true } // retourne le document modifié
    );

    if (!updated) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }

    res.status(200).json({
      message: 'Catway mis à jour avec succès.',
      catway: updated
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du catway :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Supprimer un catway
exports.delete = async (req, res) => {
  try {
    const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.id });

    if (!deleted) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }

    res.status(200).json({ message: 'Catway supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
