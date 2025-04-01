const express = require("express");
const passport = require("passport");
const { User } = require("../models");
const {ensureAuthenticated} = require("../middlewares/ensureAuthenticated"); // Assurez-vous que ce chemin est correct
const router = express.Router();

// Page d'inscription
router.get("/register", (req, res) => res.render("register"));

// Inscription
router.post("/register", async (req, res) => {
  const { nom, prenom, email, telephone, motDePasse } = req.body;
  
  if (!nom || !prenom || !email || !telephone || !motDePasse) {
    return res.send("Tous les champs sont requis !");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).send("Un utilisateur avec cet email existe déjà.");
    }

  try {
    await User.create({ nom, prenom, email, telephone, motDePasse });
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.send("Erreur lors de l'inscription !");
  }
});


// Page de connexion

router.get("/login", (req, res) =>{
  res.render("login");
});
router.get("/register", (req, res) =>{
  res.render("register")
});
// Connexion
// Connexion
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect to login page on failure
    failureFlash: true, // Enable flash messages for errors
  }),
  (req, res) => {
    // Redirect based on user role
    if (req.user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else if (req.user.role === "formateur") {
      res.redirect("/formateur/dashboard");
    } else if (req.user.role === "apprenant") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/"); // Default redirect if role is undefined
    }
  }
);

 // Admin Dashboard
router.get("/admin/dashboard",ensureAuthenticated , (req, res) => {
  
  res.render("admin/dashboard", { user: req.user });
});

// Formateur Dashboard
router.get("/formateur/dashboard",ensureAuthenticated , (req, res) => {
  
  res.render("formateur/dashboard", { user: req.user });
});

// Student Dashboard
router.get("/dashboard",ensureAuthenticated, (req, res) => {
  
  res.render("student/dashboard", { user: req.user });
});



// Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

module.exports = router;
