const express = require("express");
const { ajouterSession, listerSessions, modifierSession, supprimerSession, afficherFormation } = require("../controllers/sessionFormationController");
//const { validateAjouterSession } = require("../validators/sessionFormationValidator");
//const { handleValidationErrors } = require("../middlewares/validationMiddleware");
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const { checkRole } = require("../middlewares/roleMiddleware");

const router = express.Router();


// Route to handle the form submission
router.post(
  "/formateur/creer-session",
  ensureAuthenticated, // Ensure the user is authenticated
  checkRole(["formateur"]), // Ensure the user is a formateur
  ajouterSession // Controller function
);

//Route pour avoir accès à la liste des formations
router.get("/formateurs/formations",
  ensureAuthenticated, // Ensure the user is authenticated
  checkRole(["formateur"]), // Ensure the user is a formateur
  listerSessions
);


// Route to render the modification interface
router.get("/formateur/formations/session/:id", ensureAuthenticated, checkRole(["formateur"]), afficherFormation); 
  
// Route to handle the form submission after update
router.post("/formateur/modifier-session/:id",ensureAuthenticated,checkRole(["formateur"]), modifierSession);



  

// Route to delete a session
router.post("/formateur/formations/session/supprimer-session/:id",ensureAuthenticated,checkRole(["formateur"]), supprimerSession);

// Route to display the session creation form
router.get("/formateur/creer-session", ensureAuthenticated, checkRole(["formateur"]), (req, res) => {

    res.render("formateur/addformation", {user:req.user}); // Render the EJS template for session creation
  } 
);
module.exports = router;
