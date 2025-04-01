const { Devoir, User, SessionFormation } = require("../models");

// Create a new assignment
exports.creerDevoir = async (req, res) => {
  try {
    const { idUser, idSession, titre, description, fichier, dateSoumission } = req.body;

    // Check if the user exists
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    // Check if the session exists
    const session = await SessionFormation.findByPk(idSession);
    if (!session) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    // Create the assignment
    const devoir = await Devoir.create({
      idUser,
      idSession,
      titre,
      description,
      fichier,
      dateSoumission,
    });

    return res.status(201).json({ message: "Devoir créé avec succès !", devoir });
  } catch (error) {
    console.error("Erreur lors de la création du devoir :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Get all assignments
exports.listerDevoirs = async (req, res) => {
  try {
    const devoirs = await Devoir.findAll({
      include: [
        { model: User, as: "apprenant" },
        { model: SessionFormation, as: "session" },
      ],
    });

    return res.status(200).json(devoirs);
  } catch (error) {
    console.error("Erreur lors de la récupération des devoirs :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Get a specific assignment by ID
exports.afficherDevoir = async (req, res) => {
  try {
    const { id } = req.params;

    const devoir = await Devoir.findByPk(id, {
      include: [
        { model: User, as: "apprenant" },
        { model: SessionFormation, as: "session" },
      ],
    });

    if (!devoir) {
      return res.status(404).json({ message: "Devoir introuvable." });
    }

    return res.status(200).json(devoir);
  } catch (error) {
    console.error("Erreur lors de la récupération du devoir :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Update an assignment
exports.modifierDevoir = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, fichier, dateSoumission, note } = req.body;

    const devoir = await Devoir.findByPk(id);
    if (!devoir) {
      return res.status(404).json({ message: "Devoir introuvable." });
    }

    // Update the assignment
    await devoir.update({
      titre: titre || devoir.titre,
      description: description || devoir.description,
      fichier: fichier || devoir.fichier,
      dateSoumission: dateSoumission || devoir.dateSoumission,
      note: note || devoir.note,
    });

    return res.status(200).json({ message: "Devoir modifié avec succès !", devoir });
  } catch (error) {
    console.error("Erreur lors de la modification du devoir :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Delete an assignment
exports.supprimerDevoir = async (req, res) => {
  try {
    const { id } = req.params;

    const devoir = await Devoir.findByPk(id);
    if (!devoir) {
      return res.status(404).json({ message: "Devoir introuvable." });
    }

    // Delete the assignment
    await devoir.destroy();

    return res.status(200).json({ message: "Devoir supprimé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la suppression du devoir :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};