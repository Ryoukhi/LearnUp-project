const express = require('express');
const router = express.Router();
const {
  getFormationsEnAttente,
  afficherDetailsSessionCatalogue,
  getActiveStudentFormations,
  displayMesSessions,
  afficherPaiementFormation
} = require('../controllers/sessionFormationController');
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const {checkRole} = require("../middlewares/roleMiddleware");

// Get catalog of pending courses
router.get('/catalogue', 
  ensureAuthenticated, 
  checkRole(['apprenant']), 
  getFormationsEnAttente
);

// Route to get the details of a specific course
router.get('/catalogue/:id',
  ensureAuthenticated,
  checkRole(['apprenant']),
  afficherDetailsSessionCatalogue
);

// Route for payment page
router.get('/inscription-session/:id',
  ensureAuthenticated,
  checkRole(['apprenant']),
  afficherPaiementFormation
);

// Get active formations for a student
router.get('/mes-sessions/:idUser',
  ensureAuthenticated,
  checkRole(['apprenant']),
  getActiveStudentFormations
);

router.get('/mes-sessions',
  ensureAuthenticated,
  checkRole(['apprenant']),
  displayMesSessions
);

module.exports = router;
