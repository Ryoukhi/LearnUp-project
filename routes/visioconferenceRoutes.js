const express = require("express");
const {
  creerVideoconference,
  afficherVideoconference,
  modifierVideoconference,
  supprimerVideoconference,
} = require("../controllers/visioconferenceController");

const router = express.Router();

// Route to create a new videoconference
router.post("/creer-videoconference", creerVideoconference);

// Route to get a specific videoconference by ID
router.get("/afficher-videoconference/:id", afficherVideoconference);

// Route to update a videoconference
router.put("/modifier-videoconference/:id", modifierVideoconference);

// Route to delete a videoconference
router.delete("/supprimer-videoconference/:id", supprimerVideoconference);

module.exports = router;