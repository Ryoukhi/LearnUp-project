const express = require('express');
const router = express.Router();
const { afficherFormationsEnCoursFormateur, afficherFormationsEnAttenteFormateur,afficherFormationsTermineesFormateur, afficherDetailsSessionEnCours, afficherDetailsSessionEnAttente, completeVideoconference } = require('../controllers/sessionFormationController');
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const {checkRole} = require("../middlewares/roleMiddleware");
const { SuivieCours } = require('../models');


// Dashboard route
router.get('/dashboard', ensureAuthenticated, checkRole(['formateur']), (req, res) => {
  res.render('formateur/dashboard', { user: req.user });
});

// Ongoing training sessions
router.get('/formations-en-cours', ensureAuthenticated, checkRole(['formateur']), afficherFormationsEnCoursFormateur);

// Pending training sessions
router.get('/formations-en-attente', 
  ensureAuthenticated, checkRole(['formateur']), afficherFormationsEnAttenteFormateur
);

// Pending training sessions
router.get('/formations-terminees', 
    ensureAuthenticated, checkRole(['formateur']), afficherFormationsTermineesFormateur
  );



// Session en cours details
router.get('/formations-en-cours/:id', ensureAuthenticated, checkRole(['formateur']), afficherDetailsSessionEnCours);


// Session en attente details
router.get('/formations-en-attente/:id', ensureAuthenticated, checkRole(['formateur']), afficherDetailsSessionEnAttente);



// Mark videoconference as completed
router.post('/videoconference/:id/complete', 
  ensureAuthenticated, 
  checkRole(['formateur']), 
  completeVideoconference
);




module.exports = router;
