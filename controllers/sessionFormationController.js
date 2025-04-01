const { SessionFormation, User } = require("../models");

exports.ajouterSession = async (req, res) => {
  try {
  
    console.log(req.body); // Afficher le contenu de req.body dans la console
    const { titre, description, dateDebut, dateFin, montant } = req.body;

    // Vérifier si tous les champs sont remplis
    if(!titre || !description || !dateDebut || !dateFin || !montant) {
      req.flash("error", "Veuillez remplir tous les champs obligatoires.");
      return res.redirect("/formateur/creer-session", {user:req.user}); // Rediriger vers la page de création de session
    }


    const session = await SessionFormation.create({
      titre,
      description,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      montant,
      idFormateur: req.user.id, // Utiliser l'ID de l'utilisateur connecté
      etat: "fermee",

    });

    req.flash("success", "Session de formation créée avec succès !");

    const sessions = await SessionFormation.findAll({
      where: { idFormateur: req.user.id }, // Filter sessions by the formateur's ID
      include: [
      {
        model: User,
        as: "formateur",
        attributes: ["id", "nom", "prenom"], // Include the name and surname of the formateur
      },
      ],
    });
    
    res.render("formateur/formations", { user: req.user, sessions });
    
        
  } catch (error) {
    console.error("Erreur lors de la création de la session :", error);
    req.flash("error", "Une erreur est survenue lors de la création de la session.");
        res.redirect("/formateur/creer-session"); // Rediriger vers la page de création de session
  }
};

exports.listerSessions = async (req, res) => {
  try {
  

    const sessions = await SessionFormation.findAll({
      where: { idFormateur: req.user.id }, // Filter sessions by the formateur's ID
      include: [
      {
        model: User,
        as: "formateur",
        attributes: ["id", "nom", "prenom"], // Include the name and surname of the formateur
      },
      ],
    });
    res.render("formateur/formations", { user: req.user, sessions }); // Render the EJS template with the sessions data

    //return res.status(200).json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

exports.modifierSession = async (req, res) => {
  try {
    

    const { id } = req.params; // Obtenir l'ID de la session depuis les paramètres de l'URL
    const { titre, description, dateDebut, dateFin, idFormateur, montant, etat } = req.body;

    // Trouver la session par son ID
    const session = await SessionFormation.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    // Valider le formateur s'il est fourni
    if (idFormateur) {
      const formateur = await User.findByPk(idFormateur);
      if (!formateur || formateur.role !== "formateur") {
        return res.status(400).json({ message: "Formateur invalide." });
      }
    }

    // Mettre à jour la session
    await session.update({
      titre: titre || session.titre,
      description: description || session.description,
      dateDebut: dateDebut ? new Date(dateDebut) : session.dateDebut,
      dateFin: dateFin ? new Date(dateFin) : session.dateFin,
      idFormateur: idFormateur || session.idFormateur,
      montant: montant || session.montant,
      etat: etat || session.etat,
    });

    
    const sessions = await SessionFormation.findAll({
      where: { idFormateur: req.user.id }, // Filtrer les sessions par l'id du formateur

      include: [
      {
        model: User,
        as: "formateur",
        attributes: ["id", "nom", "prenom"], // Include the name and surname of the formateur
      },
      ],
    });
    res.render("formateur/formations", { user: req.user, sessions });

    
  } catch (error) {
    console.error("Erreur lors de la modification de la session :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
};

exports.supprimerSession = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un admin
    

    const { id } = req.params; // Obtenir l'ID de la session depuis les paramètres de l'URL

    // Trouver la session par son ID
    const session = await SessionFormation.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: "Session introuvable." });
    }

    // Supprimer la session
    await session.destroy();

    const sessions = await SessionFormation.findAll({
      where: { idFormateur: req.user.id }, // Filter sessions by the formateur's ID
      include: [
      {
        model: User,
        as: "formateur",
        attributes: ["id", "nom", "prenom"], // Include the name and surname of the formateur
      },
      ],
    });
    res.render("formateur/formations", { user: req.user, sessions }); // Render the EJS template with the sessions data

  } catch (error) {
    console.error("Erreur lors de la suppression de la session :", error);
    return res.status(500).json({ message: "Une erreur est survenue." });
  }
}

//Afficher une session de formation
exports.afficherFormation = async (req, res) => {
  try {
    const { id } = req.params;

    const formation = await SessionFormation.findByPk(id, {
      include: [{ model: User, as: "formateur" }],
    });

    if (!formation) {
      return res.status(404).send("Formation introuvable.");
    }

    res.render("formateur/voirplus", { user:req.user, formation });
    
  } catch (error) {
    console.error("Erreur lors de l'affichage de la formation :", error);
    res.status(500).send("Une erreur est survenue.");
  }
};

