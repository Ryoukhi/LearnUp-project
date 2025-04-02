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

exports.listerSessionsFermees = async (req, res) => {
  try {
    // Fetch all training sessions where etat is "fermee" with associated trainer details
    const sessions = await SessionFormation.findAll({
      where: { etat: "fermee" }, // Filter sessions by etat = "fermee"
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Include trainer details
        },
      ],
    });

    // Render the EJS template with the fetched data
    res.render("admin/traitementsession", { user: req.user, sessions });
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    res.status(500).send("Une erreur est survenue.");
  }
};

exports.listerSessionsOuvertes = async (req, res) => {
  try {
    // Fetch all training sessions where etat is "fermee" with associated trainer details
    const sessions = await SessionFormation.findAll({
      where: { etat: "ouverte" }, // Filter sessions by etat = "fermee"
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Include trainer details
        },
      ],
    });

    // Render the EJS template with the fetched data
    res.render("admin/gestion_formation", { user: req.user, sessions });
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    res.status(500).send("Une erreur est survenue.");
  }
};

exports.modifierEtatSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { etat } = req.body;

    const session = await SessionFormation.findByPk(id);

    if (!session) {
      req.flash("error", "Session introuvable.");
      return res.redirect("/admin/sessions/sessions-fermees");
    }

    // Update the session's etat
    session.etat = etat;
    await session.save();

    req.flash("success", "L'état de la session a été modifié avec succès !");
    res.redirect(`/admin/sessions/sessions-fermees`);
  } catch (error) {
    console.error("Erreur lors de la modification de l'état de la session :", error);
    req.flash("error", "Une erreur est survenue lors de la modification de l'état.");
    res.redirect(`/admin/sessions/sessions-fermees/etatsession/${id}`);
  }
};

exports.afficherSessionFermee = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la session par ID et s'assurer qu'elle est fermée (etat = 'fermee')
    const session = await SessionFormation.findOne({
      where: { id, etat: "fermee" },
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Inclure les coordonnées du formateur
        },
      ],
    });

    if (!session) {
      req.flash("error", "Session fermée introuvable.");
      return res.redirect("/admin/sessions/sessions-fermees");
    }

    // Render the EJS template with the session details
    res.render("admin/etatsession", { user: req.user, session });
  } catch (error) {
    console.error("Erreur lors de l'affichage de la session fermée :", error);
    req.flash("error", "Une erreur est survenue lors de l'affichage de la session.");
    res.redirect("/admin/sessions/sessions-fermees");
  }
};

exports.afficherSessionOuverte = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la session par ID et s'assurer qu'elle est fermée (etat = 'fermee')
    const session = await SessionFormation.findOne({
      where: { id, etat: "ouverte" },
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Inclure les coordonnées du formateur
        },
      ],
    });

    if (!session) {
      req.flash("error", "Session introuvable.");
      return res.redirect("/admin/sessions");
    }

    // Render the EJS template with the session details
    res.render("admin/etatsession", { user: req.user, session });
  } catch (error) {
    console.error("Erreur lors de l'affichage de la session fermée :", error);
    req.flash("error", "Une erreur est survenue lors de l'affichage de la session.");
    res.redirect("/admin/sessions/sessions-fermees");
  }
};

exports.listerCatalogue = async (req, res) => {
  try {
    const sessions = await SessionFormation.findAll({
      where: { etat: "ouverte" },
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom"], // Include trainer details if needed
        },
      ],
    });

    res.render("student/catalogue", { user: req.user, sessions });
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions ouvertes :", error);
    res.status(500).send("Une erreur est survenue.");
  }
};

exports.afficherContenuFormation = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the session by ID
    const session = await SessionFormation.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Include trainer details
        },
      ],
    });

    if (!session) {
      req.flash("error", "Session introuvable.");
      return res.redirect("/student/catalogue");
    }

    // Render the EJS template with the session details
    res.render("student/contenu_formation", { user: req.user, session });
  } catch (error) {
    console.error("Erreur lors de l'affichage du contenu de la formation :", error);
    req.flash("error", "Une erreur est survenue lors de l'affichage de la formation.");
    res.redirect("/student/catalogue");
  }
};