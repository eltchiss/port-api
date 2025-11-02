const Catway = require('../models/catways');

// Obtenir tous les catways
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un catway par ID
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway non trouvé' });
    res.json(catway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un catway
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

// Modifier uniquement l’état d’un catway
exports.updateState = async (req, res) => {
  try {
    const { catwayState } = req.body;

    const updated = await Catway.findByIdAndUpdate(
      req.params.id,
      { catwayState },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Catway non trouvé' });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un catway
exports.delete = async (req, res) => {
  try {
    const deleted = await Catway.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Catway non trouvé' });

    res.json({ message: 'Catway supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
