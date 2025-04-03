const express = require("express");
const { listerFormations, afficherFormation, supprimerFormation,afficherFormulaireAjoutSession, ajouterSession } = require("../controllers/sessionFormationController");
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated");
const { checkRole } = require("../middlewares/roleMiddleware");


const router = express.Router();


router.get("/admin/sessions", ensureAuthenticated, checkRole(["admin"]), listerFormations);


router.get("/admin/sessions/:id", ensureAuthenticated, checkRole(["admin"]), afficherFormation);


router.post("/admin/sessions/supprimer-formation/:id", ensureAuthenticated, checkRole(["admin"]), supprimerFormation);


router.get("/admin/ajouter-session", ensureAuthenticated, checkRole(["admin"]), afficherFormulaireAjoutSession);


router.post("/admin/sessions/save-session", ensureAuthenticated, checkRole(["admin"]), ajouterSession);

module.exports = router;
