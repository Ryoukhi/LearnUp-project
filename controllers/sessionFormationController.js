const { SessionFormation, User } = require("../models");

exports.listerFormations = async (req, res) => {
  try {
    const formations = await SessionFormation.findAll({
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom"], // Include trainer details
        },
      ],
    });

    res.render("admin/gestion_formation", { user: req.user, formations });
  } catch (error) {
    console.error("Erreur lors de la récupération des formations :", error);
    req.flash("error", "Une erreur est survenue lors de la récupération des formations.");
    res.redirect("/admin");
  }
};

exports.afficherFormation = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the formation by ID
    const formation = await SessionFormation.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "formateur",
          attributes: ["nom", "prenom", "telephone", "email"], // Include trainer details
        },
      ],
    });

    if (!formation) {
      req.flash("error", "Formation introuvable.");
      return res.redirect("/admin/sessions");
    }

    // Render the EJS template with the formation details
    res.render("admin/voirplus", { user: req.user, formation });
  } catch (error) {
    console.error("Erreur lors de l'affichage de la formation :", error);
    req.flash("error", "Une erreur est survenue lors de l'affichage de la formation.");
    res.redirect("/admin/sessions");
  }
};

exports.supprimerFormation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the session by ID
    const formation = await SessionFormation.findByPk(id);

    if (!formation) {
      req.flash("error", "Formation introuvable.");
      return res.redirect("/admin/sessions");
    }

    // Delete the session
    await formation.destroy();

    req.flash("success", "Formation supprimée avec succès !");
    res.redirect("/admin/sessions");
  } catch (error) {
    console.error("Erreur lors de la suppression de la formation :", error);
    req.flash("error", "Une erreur est survenue lors de la suppression de la formation.");
    res.redirect("/admin/sessions");
  }
};


exports.afficherFormulaireAjoutSession = async (req, res) => {
  try {
    // Fetch all formateurs from the User table
    const formateurs = await User.findAll({
      where: { role: "formateur" }, // Assuming "formateur" is the role for trainers
      attributes: ["id", "nom", "prenom"], // Fetch only necessary fields
    });

    // Render the EJS template with the list of formateurs
    res.render("admin/ajouter_session", { user: req.user, formateurs });
  } catch (error) {
    console.error("Erreur lors de la récupération des formateurs :", error);
    req.flash("error", "Une erreur est survenue lors du chargement du formulaire.");
    res.redirect("/admin/sessions");
  }
};



exports.ajouterSession = async (req, res) => {
  try {
    const { titre, description, dateDebut, dateFin, montant, formateur } = req.body;

    // Vérification des champs obligatoires
    if (!titre || !description || !dateDebut || !dateFin || !montant || !formateur) {
      req.flash("error", "Veuillez remplir tous les champs du formulaire.");
      return res.redirect("/admin/ajouter-session");
    }

    // Vérification de la date de fin
    if (new Date(dateFin) < new Date(dateDebut)) {
      req.flash("error", "La date de fin doit être postérieure à la date de début.");
      return res.redirect("/admin/ajouter-session");
    }

    // Création de la session
    await SessionFormation.create({
      titre,
      description,
      dateDebut,
      dateFin,
      montant,
      idFormateur: formateur,
    });

    req.flash("success", "Session ajoutée avec succès.");
    res.redirect("/admin/sessions");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la session :", error);
    req.flash("error", "Une erreur est survenue lors de l'ajout de la session.");
    res.redirect("/admin/ajouter-session");
  }
};