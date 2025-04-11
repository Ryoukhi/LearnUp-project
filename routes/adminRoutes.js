const express = require('express');
const router = express.Router();
const { afficherFormulaireSession, creerSession,  afficherDetailsFormationEnAttente, afficherFormulaireVisio, modifierVisioEnAttente, supprimerVisio, listerSessionsEnattente,listerSessionsEnCours, listerSessionsTerminees, afficherDetailsFormationEnCours, afficherDetailsFormationTerminee, modifierSessionEnAttente, ajouterVisioEnAttente, modifierSessionEnCours, modifierVisioEnCours, ajouterVisioEnCours } = require('../controllers/sessionFormationController');

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






// Route to open the form for adding a videoconference
router.get('/videoconferences/ajouter/:id', ensureAuthenticated, checkRole(['admin']), afficherFormulaireVisio);












//Route pour supprimer une vidéoconférence
router.post('/videoconferences/supprimer/:id',ensureAuthenticated, checkRole(['admin']), supprimerVisio);


//route pour le suivi
router.get('/suivi-formation', ensureAuthenticated, checkRole(['admin']), (req, res) => {
  res.render('admin/suivi', { user: req.user });
});


//Route de suivi pour afficher les sessions en cours et terminées
router.get('/suivi-formation_en_attente', ensureAuthenticated, checkRole(['admin']), listerSessionsEnattente);


//Route de suivi pour afficher les sessions en cours
router.get('/suivi-formation_en_cours', ensureAuthenticated, checkRole(['admin']), listerSessionsEnCours);

//Route de suivi pour afficher les sessions terminées

router.get('/suivi-formation_terminee', ensureAuthenticated, checkRole(['admin']), listerSessionsTerminees);



// Route to display the details of a specific session
router.get('/suivi-formation_en_attente/:id', ensureAuthenticated, checkRole(['admin']), afficherDetailsFormationEnAttente);



// Route to display the details of a specific session
router.get('/suivi-formation_en_cours/:id', ensureAuthenticated, checkRole(['admin']), afficherDetailsFormationEnCours);





// Route to display the details of a specific session
router.get('/suivi-formation_terminee/:id', ensureAuthenticated, checkRole(['admin']), afficherDetailsFormationTerminee);






// Route to modify a session
router.post('/suivi-formation_en_attente/:id', ensureAuthenticated, checkRole(['admin']), modifierSessionEnAttente);



//Route pour modifier une vidéoconférence
router.post('/visio/modifier/:id',ensureAuthenticated, checkRole(['admin']), modifierVisioEnAttente);



// Route to save a new videoconference
router.post('/videoconferences/save/:id',ensureAuthenticated, checkRole(['admin']), ajouterVisioEnAttente);
module.exports = router;








//////////////////////////////////////////////////////


// Route to modify a session
router.post('/suivi-formation_en_cours/:id', ensureAuthenticated, checkRole(['admin']), modifierSessionEnCours);



//Route pour modifier une vidéoconférence
router.post('/visio_cours/modifier/:id',ensureAuthenticated, checkRole(['admin']), modifierVisioEnCours);



// Route to save a new videoconference
router.post('/videoconferences_cours/save/:id',ensureAuthenticated, checkRole(['admin']), ajouterVisioEnCours);
module.exports = router;


