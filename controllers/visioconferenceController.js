const { Videoconference, SessionFormation } = require("../models");

// Create a new videoconference
exports.creerVideoconference = async (req, res) => {
  try {
    if (!formateur || formateur.role !== "formateur") {
        return res.status(404).send("Formateur introuvable.");
    }
    const { titre, description, dateHeure, lien, idSession } = req.body;

    // Check if the session exists
    const session = await SessionFormation.findByPk(idSession);
    if (!session) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    // Create the videoconference
    const videoconference = await Videoconference.create({
      titre,
      description,
      dateHeure,
      lien,
      idSession,
    });

    return res.status(201).json({ message: "Visioconférence créée avec succès !", videoconference });
  } catch (error) {
    console.error("Erreur lors de la création de la visioconférence :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Get a specific videoconference by ID
exports.afficherVideoconference = async (req, res) => {
  try {
    if (!formateur || formateur.role !== "formateur") {
        return res.status(404).send("Formateur introuvable.");
    }
    const { id } = req.params;

    // Find the videoconference by ID
    const videoconference = await Videoconference.findByPk(id, {
      include: [{ model: SessionFormation, as: "session" }],
    });

    if (!videoconference) {
      return res.status(404).json({ message: "Visioconférence introuvable." });
    }

    return res.status(200).json(videoconference);
  } catch (error) {
    console.error("Erreur lors de la récupération de la visioconférence :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Update a videoconference
exports.modifierVideoconference = async (req, res) => {
  try {
    if (!formateur || formateur.role !== "formateur") {
        return res.status(404).send("Formateur introuvable.");
    }
    const { id } = req.params;
    const { titre, description, dateHeure, lien, idSession } = req.body;

    // Find the videoconference by ID
    const videoconference = await Videoconference.findByPk(id);
    if (!videoconference) {
      return res.status(404).json({ message: "Visioconférence introuvable." });
    }

    // Check if the session exists if idSession is provided
    if (idSession) {
      const session = await SessionFormation.findByPk(idSession);
      if (!session) {
        return res.status(404).json({ message: "Session introuvable." });
      }
    }

    // Update the videoconference
    await videoconference.update({
      titre: titre || videoconference.titre,
      description: description || videoconference.description,
      dateHeure: dateHeure || videoconference.dateHeure,
      lien: lien || videoconference.lien,
      idSession: idSession || videoconference.idSession,
    });

    return res.status(200).json({ message: "Visioconférence modifiée avec succès !", videoconference });
  } catch (error) {
    console.error("Erreur lors de la modification de la visioconférence :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Delete a videoconference
exports.supprimerVideoconference = async (req, res) => {
  try {
    if (!formateur || formateur.role !== "formateur") {
        return res.status(404).send("Formateur introuvable.");
    }
    const { id } = req.params;

    // Find the videoconference by ID
    const videoconference = await Videoconference.findByPk(id);
    if (!videoconference) {
      return res.status(404).json({ message: "Visioconférence introuvable." });
    }

    // Delete the videoconference
    await videoconference.destroy();

    return res.status(200).json({ message: "Visioconférence supprimée avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la visioconférence :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};