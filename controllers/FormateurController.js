const bcrypt = require("bcrypt");
const { User } = require("../models"); // Ensure you import your User model

// Create a new formateur
async function creerFormateur(req, res) {
    try {
        // Check if the user is an admin

        const { nom, prenom, email, telephone, motDePasse } = req.body;

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send("Un utilisateur avec cet email existe déjà.");
        }

        // Hash the password with bcrypt
        //const saltRounds = 10; // Number of salt rounds for hashing
        //const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

        // Create the formateur with the hashed password
        const formateur = await User.create({
            nom,
            prenom,
            email,
            telephone,
            motDePasse, 
            role: "formateur",
        });

        // Fetch updated list of formateurs
        const formateurs = await User.findAll({ where: { role: "formateur" } });
        res.render("admin/gestion_formateurs", { user: req.user, formateurs });
    } catch (error) {
        console.error("Erreur lors de la création du formateur :", error);
        res.status(500).send("Une erreur est survenue.");
    }
}

// List all formateurs
async function listerFormateurs(req, res) {
    try {
        
        const formateurs = await User.findAll({ where: { role: "formateur" } });
        res.render("admin/gestion_formateurs", { user: req.user, formateurs });
    } catch (error) {
        console.error("Erreur lors de la récupération des formateurs :", error);
        res.status(500).send("Une erreur est survenue.");
    }
}

// Modify a formateur
async function modifierFormateur(req, res) {
    try {
        

        const { id } = req.params;
        const { nom, prenom, email, telephone, motDePasse } = req.body;

        // Validate input data
        if (!nom || !prenom || !email || !telephone) {
            return req.flash("error", "Tous les champs sont obligatoires.");
        }

        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            return req.flash("error", "Formateur introuvable.");
        }

        // Check if the new email is already in use by another user
        if (email !== formateur.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return req.flash("error", "Un utilisateur avec cet email existe déjà.");
            }
        }

        // Update formateur details
        formateur.nom = nom;
        formateur.prenom = prenom;
        formateur.email = email;
        formateur.telephone = telephone;

        // Update password if provided
        if (motDePasse) {
            formateur.motDePasse = await bcrypt.hash(motDePasse, 10); // Hash the new password
        }

        await formateur.save();
        const formateurs = await User.findAll({ where: { role: "formateur" } });


        req.flash("success", "Formateur modifié avec succès.");
        res.redirect("/admin/gestion-formateurs");
        
        //return res.status(200).json({ message: "Formateur modifié avec succès !", formateur });
        
    } catch (error) {
        console.error("Erreur lors de la modification du formateur :", error);
        req.flash("error", "Une erreur est survenue lors de la modification du formateur.");
        res.redirect("/admin/gestion-formateurs");
    }
}

// Delete a formateur
async function supprimerFormateur(req, res) {
    try {
        const { id } = req.params;
        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            req.flash("error", "Formateur introuvable.");
            return res.redirect("/admin/gestion-formateurs");
        }

        await formateur.destroy();

        
        req.flash("success", "Formateur supprimé avec succès.");
        res.redirect("/admin/gestion-formateurs");
    } catch (error) {
        console.error("Erreur lors de la suppression du formateur :", error);
        req.flash("error", "Une erreur est survenue lors de la suppression du formateur.");
        res.redirect("/admin/gestion-formateurs");
    }
}

// Get a specific formateur
async function getFormateur(req, res) {
    try {
        const { id } = req.params;
        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            req.flash("error", "Formateur introuvable.");
        res.redirect("/admin/gestion-formateurs");
        }
        res.send(formateur);
    } catch (error) {
        req.flash("error", "Erreur lors de la récupération du formateur.");
        res.redirect("/admin/gestion-formateurs");
        
    }
}

// Export all functions
module.exports = {
    creerFormateur,
    listerFormateurs,
    modifierFormateur,
    supprimerFormateur,
    getFormateur,
};