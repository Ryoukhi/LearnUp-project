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
            return res.status(400).json({ message: "Tous les champs (nom, prénom, email, téléphone) sont obligatoires." });
        }

        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            return res.status(404).json({ message: "Formateur introuvable." });
        }

        // Check if the new email is already in use by another user
        if (email !== formateur.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
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


        res.render("admin/gestion_formateurs", { user: req.user, formateurs });
        
        //return res.status(200).json({ message: "Formateur modifié avec succès !", formateur });
        
    } catch (error) {
        console.error("Erreur lors de la modification du formateur :", error);
        return res.status(500).json({ message: "Une erreur est survenue." });
    }
}

// Delete a formateur
async function supprimerFormateur(req, res) {
    try {
        

        const { id } = req.params;
        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            return res.status(404).send("Formateur introuvable.");
        }

        await formateur.destroy();

        // Fetch updated list of formateurs
        const formateurs = await User.findAll({ where: { role: "formateur" } });

        // Render the updated list in the admin view
        res.render("admin/gestion_formateurs", { user: req.user, formateurs });
    } catch (error) {
        console.error("Erreur lors de la suppression du formateur :", error);
        res.status(500).send("Une erreur est survenue.");
    }
}

// Get a specific formateur
async function getFormateur(req, res) {
    try {
        const { id } = req.params;
        const formateur = await User.findByPk(id);
        if (!formateur || formateur.role !== "formateur") {
            return res.status(404).send("Formateur introuvable.");
        }
        res.send(formateur);
    } catch (error) {
        console.error("Erreur lors de la récupération du formateur :", error);
        res.status(500).send("Une erreur est survenue.");
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