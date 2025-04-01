const express = require("express");
const { creerFormateur, listerFormateurs, modifierFormateur, supprimerFormateur,getFormateur } = require("../controllers/FormateurController");
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const {checkRole} = require("../middlewares/roleMiddleware");

const router = express.Router();

// Route to create a new formateur
router.post("/admin/creer-formateur",ensureAuthenticated,checkRole(["admin"]), creerFormateur);



// Route to list all formateurs
router.get("/admin/formateurs",ensureAuthenticated,checkRole(["admin"]), listerFormateurs);

// Route to modify a formateur
router.post("/admin/modifier-formateur/:id",ensureAuthenticated,checkRole(["admin"]), modifierFormateur);

router.post("/admin/supprimer-formateur/:id",ensureAuthenticated,checkRole(["admin"]), supprimerFormateur);

router.get("/formateur/:id",ensureAuthenticated,checkRole(["admin"]), getFormateur);



module.exports = router;