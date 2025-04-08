const express = require('express');
const router = express.Router();
const { afficherFormulaireSession, creerSession, listerSessions, afficherDetailsSession, afficherFormulaireVisio, ajouterVisio, modifierSession, modifierVisio, supprimerVisio } = require('../controllers/sessionFormationController');
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const {checkRole} = require("../middlewares/roleMiddleware");
const { creerFormateur, listerFormateurs, modifierFormateur, supprimerFormateur,getFormateur } = require("../controllers/FormateurController");

// Admin Dashboard
router.get('/dashboard', ensureAuthenticated, checkRole(['admin']), (req, res) => {
  res.render('admin/dashboard', { user: req.user });
});





// Gestion Formateurs                  Gestion Formateurs 
// Route to list all formateurs
router.get('/gestion-formateurs', ensureAuthenticated, checkRole(['admin']), listerFormateurs);

// Route to create a new formateur
router.post('/creer-formateur', ensureAuthenticated, checkRole(['admin']), creerFormateur);

// Route to modify a formateur
router.post('/modifier-formateur/:id', ensureAuthenticated, checkRole(['admin']), modifierFormateur);

// Route to delete a formateur
router.post('/supprimer-formateur/:id', ensureAuthenticated, checkRole(['admin']), supprimerFormateur);

// Route to get a specific formateur
router.get('/gestion-formateur/:id', ensureAuthenticated, checkRole(['admin']), getFormateur);





//Gestion des sessions de formation                           Gestion des sessions de formation
//Route pour créer une nouvelle session de formation
router.get('/creer-session', ensureAuthenticated, checkRole(['admin']), afficherFormulaireSession);

//Route pour enregistrer une nouvelle session de formation
router.post('/save-session', ensureAuthenticated, checkRole(['admin']), creerSession);


// Route pour lister toues les sessions de formation
router.get('/gestion-formation', ensureAuthenticated, checkRole(['admin']), listerSessions);

// Route to display the details of a specific session
router.get('/gestion-formation/:id', ensureAuthenticated, checkRole(['admin']), afficherDetailsSession);


// Route to open the form for adding a videoconference
router.get('/videoconferences/ajouter/:id', ensureAuthenticated, checkRole(['admin']), afficherFormulaireVisio);


// Route to save a new videoconference
router.post('/videoconferences/save/:id',ensureAuthenticated, checkRole(['admin']), ajouterVisio);


// Route to modify a session
router.post('/gestion-formation/modifier/:id', ensureAuthenticated, checkRole(['admin']), modifierSession);


//Route pour modifier une vidéoconférence
router.post('/videoconferences/modifier/:id',ensureAuthenticated, checkRole(['admin']), modifierVisio);



//Route pour supprimer une vidéoconférence
router.post('/videoconferences/supprimer/:id',ensureAuthenticated, checkRole(['admin']), supprimerVisio);
module.exports = router;