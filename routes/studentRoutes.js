const express = require('express');
const router = express.Router();
const {
  getFormationsEnAttente,
  afficherDetailsSessionCatalogue,
  completeVideoconferenceStudent,
  displayMesSessions,
  afficherPaiementFormation, afficherDetailsSessionAchetees
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

// List all sessions for current student
router.get('/mes-sessions',
  ensureAuthenticated,
  checkRole(['apprenant']),
  displayMesSessions
);

// Get details of a specific purchased session
router.get('/mes-sessions/details/:id',
  ensureAuthenticated,
  checkRole(['apprenant']),
  afficherDetailsSessionAchetees
);

// Mark videoconference as completed (accessible to both formateurs and students)
router.post('/conference/:id/complete',
  ensureAuthenticated,
  checkRole(['apprenant']),
  completeVideoconferenceStudent
);
module.exports = router;
