const express = require("express");
const { ajouterSession, listerSessions, modifierSession, supprimerSession, afficherFormation, listerSessionsFermees, listerSessionsOuvertes, modifierEtatSession, afficherSessionFermee, afficherSessionOuverte, listerCatalogue, afficherContenuFormation } = require("../controllers/sessionFormationController");
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const { checkRole } = require("../middlewares/roleMiddleware");

const router = express.Router();


// Route pour gérer la soumission du formulaire
router.post(
  "/formateur/creer-session",
  ensureAuthenticated, // S'assurer que l'utilisateur est authentifié
  checkRole(["formateur"]), // S'assurer que l'utilisateur est un formateur
  ajouterSession // Fonction contrôleur
);

//Route pour avoir accès à la liste des formations
router.get("/formateurs/formations",
  ensureAuthenticated, 
  checkRole(["formateur"]), 
  listerSessions
);


// Route pour afficher l'interface de modification de session
router.get("/formateur/formations/session/:id", ensureAuthenticated, checkRole(["formateur"]), afficherFormation); 
  
// Route pour gérer la soumission du formulaire après la mise à jour
router.post("/formateur/modifier-session/:id",ensureAuthenticated,checkRole(["formateur"]), modifierSession);



  

// Route pour supprimer une session
router.post("/formateur/formations/session/supprimer-session/:id", ensureAuthenticated, checkRole(["formateur", "admin"]), supprimerSession);

// Route pour afficher le formulaire de création de session
router.get("/formateur/creer-session", ensureAuthenticated, checkRole(["formateur"]), (req, res) => {

    res.render("formateur/addformation", {user:req.user}); 
  } 
);

// Route pour afficher la liste des formations fermées
router.get("/admin/sessions/sessions-fermees", ensureAuthenticated, checkRole(["admin"]), listerSessionsFermees);


//Route pour afficher la liste des formations ouvertes
router.get("/admin/sessions", ensureAuthenticated, checkRole(["admin"]), listerSessionsOuvertes);


// Route pour modifier l'etat d'une session
router.post("/admin/sessions/sessions-fermees/etatsession/:id",ensureAuthenticated,checkRole(["admin"]), modifierEtatSession);
module.exports = router;


//route pour afficher les details de la session en attente de traitement
router.get("/admin/sessions/sessions-fermees/etatsession/:id", ensureAuthenticated, checkRole(["admin"]), afficherSessionFermee);

//route pour afficher les details de la session en attente de traitement
router.get("/admin/sessions/etatsession/:id", ensureAuthenticated, checkRole(["admin"]), afficherSessionOuverte);


//Route pour avoir accès à la liste des formations
router.get("/catalogue", ensureAuthenticated, checkRole(["apprenant"]), listerCatalogue);

//Route pour avoir accès au contenu de la formation
router.get("/catalogue/:id", ensureAuthenticated, checkRole(["apprenant"]), afficherContenuFormation);