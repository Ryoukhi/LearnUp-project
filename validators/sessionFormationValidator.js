const { body } = require("express-validator");

exports.validateAjouterSession = [
  body("titre")
    .notEmpty()
    .withMessage("Le titre est requis.")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères."),
  body("description")
    .notEmpty()
    .withMessage("La description est requise.")
    .isString()
    .withMessage("La description doit être une chaîne de caractères."),
  body("dateDebut")
    .notEmpty()
    .withMessage("La date de début est requise.")
    .isISO8601()
    .withMessage("La date de début doit être une date valide."),
  body("dateFin")
    .notEmpty()
    .withMessage("La date de fin est requise.")
    .isISO8601()
    .withMessage("La date de fin doit être une date valide.")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dateDebut)) {
        throw new Error("La date de fin doit être postérieure à la date de début.");
      }
      return true;
    }),
  
  body("montant")
    .notEmpty()
    .withMessage("Le montant est requis.")
    .isFloat({ gt: 0 })
    .withMessage("Le montant doit être un nombre supérieur à 0."),
];