const { SessionFormation, User, Videoconference, SuivieCours, Inscription } = require("../models");

exports.afficherFormulaireSession = async (req, res) => {
  try {
    // Fetch all formateurs from the User table
    const formateurs = await User.findAll({
      where: { role: "formateur" }, // Assuming "formateur" is the role for trainers
      attributes: ["id", "nom", "prenom"], // Fetch only necessary fields
    });

    // Render the EJS template with the list of formateurs
    res.render("admin/form_session", { user: req.user, formateurs });
  } catch (error) {
    console.error("Erreur lors de la récupération des formateurs :", error);
    req.flash("error", "Une erreur est survenue lors du chargement du formulaire.");
    res.redirect("/admin/dashboard");
  }
};



exports.creerSession = async (req, res) => {
  try {
    const {
      titre,
      description,
      dateDebut,
      dateFin,
      formateur,
      montant,
      nombre_place,
      status,
      certificat_disponible,
    } = req.body;

    // Validate required fields
    if (
      !titre ||
      !description ||
      !dateDebut ||
      !dateFin ||
      !formateur ||
      !montant ||
      !nombre_place ||
      !status ||
      !certificat_disponible
    ) {
      req.flash('error', 'Veuillez remplir tous les champs obligatoires.');
      return res.redirect('/admin/dashboard');
    }

    // Validate date range
    if (new Date(dateFin) < new Date(dateDebut)) {
      req.flash('error', 'La date de fin doit être supérieure à la date de début.');
      return res.redirect('/admin/creer-session');
    }

    // Save the session to the database

    await SessionFormation.create({
      titre,
      description,
      dateDebut,
      dateFin,
      idFormateur: formateur,
      montant,
      nombre_place,
      status,
      certificat_disponible,
    });

    console.log("Session de formation créée avec succès !");
    console.log(req.body); // Log the request body for debugging
    req.flash('success', 'La session a été créée avec succès.');
    res.redirect('/admin/dashboard'); // Redirect to the dashboard or another page after success
  } catch (error) {
    console.error('Erreur lors de la création de la session :', error);
    req.flash('error', `Une erreur est survenue : ${error.message}`);
    res.redirect('/admin/creer-session');
  }
};



exports.listerSessions = async (req, res) => {
  try {
    // Fetch all sessions with their associated formateurs
    const formations = await SessionFormation.findAll({
      include: [
        {
          model: User,
          as: 'formateur', // Assuming the alias for the formateur association is 'formateur'
          attributes: ['id', 'nom', 'prenom'], // Fetch only necessary fields
        },
      ],
      order: [['dateDebut', 'ASC']], // Order sessions by start date
    });

    // Render the EJS template with the list of formations
    res.render('admin/gestion_formation', { user: req.user, formations });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions de formation :', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des sessions de formation.');
    res.redirect('/admin/dashboard');
  }
};



exports.afficherDetailsSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Fetch the session details
    const session = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom'],
        },
      ],
    });

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/admin/gestion-formation');
    }

    // Fetch videoconferences related to the session with SuivieCours status
    const videoconferences = await Videoconference.findAll({
      where: { idSession: sessionId },
      order: [['dateHeure', 'ASC']],
      
    });

    

    // Render the template
    res.render('admin/get_formations', { session, videoconferences });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la session :', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des détails de la session.');
    res.redirect('/admin/gestion-formation');
  }
};



exports.modifierSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { titre, description, dateDebut, dateFin, montant, nombre_place } = req.body;

    // Validate input
    if (!titre || !description || !dateDebut || !dateFin || !montant || !nombre_place) {
      req.flash('error', 'Tous les champs sont obligatoires.');
      return res.redirect(`/admin/gestion-formation/${sessionId}`);
    }

    // Update the session in the database
    await SessionFormation.update(
      { titre, description, dateDebut, dateFin, montant, nombre_place },
      { where: { id: sessionId } }
    );

    req.flash('success', 'La session a été modifiée avec succès.');
    res.redirect(`/admin/gestion-formation/${sessionId}`);
  } catch (error) {
    console.error('Erreur lors de la modification de la session :', error);
    req.flash('error', 'Une erreur est survenue lors de la modification de la session.');
    res.redirect(`/admin/gestion-formation/${sessionId}`);
  }
};



exports.afficherFormulaireVisio = async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Fetch the session details to display in the form
    const session = await SessionFormation.findByPk(sessionId);

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/admin/gestion-formation');
    }

    // Render the form for adding a videoconference
    res.render('admin/form_visio', { session });
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du formulaire de vidéoconférence :', error);
    req.flash('error', 'Une erreur est survenue lors de l\'ouverture du formulaire.');
    res.redirect('/admin/gestion-formation');
  }
};

exports.ajouterVisio = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { titre, description, dateHeure, lien } = req.body;

    // Validate required fields
    if (!titre || !description || !dateHeure || !lien) {
      req.flash('error', 'Tous les champs sont obligatoires.');
      return res.redirect(`/admin/videoconferences/ajouter/${sessionId}`);
    }

    // Validate date is in the future
    if (new Date(dateHeure) < new Date()) {
      req.flash('error', 'La date et heure doivent être dans le futur.');
      return res.redirect(`/admin/videoconferences/ajouter/${sessionId}`);
    }

    // Save the videoconference to the database
    await Videoconference.create({
      titre,
      description,
      dateHeure,
      lien,
      idSession: sessionId
    });

    req.flash('success', 'La vidéoconférence a été ajoutée avec succès.');
    res.redirect(`/admin/gestion-formation/${sessionId}`);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vidéoconférence :', error);
    req.flash('error', 'Une erreur est survenue lors de l\'ajout de la vidéoconférence.');
    res.redirect(`/admin/videoconferences/ajouter/${req.params.id}`);
  }
};








exports.modifierVisio = async (req, res) => {
  try {
    const visioId = req.params.id; // Get the videoconference ID
    const sessionId = req.params.sessionId; // Get the session ID (if applicable)
    const { titre, description, dateHeure, lien } = req.body;

    // Debugging logs
    console.log('visioId:', visioId);
    console.log('sessionId:', sessionId);
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!visioId || !titre || !description || !dateHeure || !lien) {
      req.flash('error', 'Tous les champs sont obligatoires.');
      return res.redirect(`/admin/gestion-formation/${sessionId || ''}`);
    }

    // Update the videoconference in the database
    await Videoconference.update(
      { titre, description, dateHeure, lien },
      { where: { id: visioId } }
    );

    req.flash('success', 'La vidéoconférence a été modifiée avec succès.');
    res.redirect(`/admin/gestion-formation/${sessionId || ''}`);
  } catch (error) {
    console.error('Erreur lors de la modification de la vidéoconférence :', error);
    req.flash('error', 'Une erreur est survenue lors de la modification de la vidéoconférence.');
    res.redirect(`/admin/gestion-formation/${req.params.sessionId || ''}`);
  }
};




exports.supprimerVisio = async (req, res) => {
  try {
    const visioId = req.params.id; // Get the videoconference ID from the route parameter
    const sessionId = req.params.sessionId; // Get the session ID (if applicable)

    // Check if the videoconference exists
    const videoconference = await Videoconference.findByPk(visioId);
    if (!videoconference) {
      req.flash('error', 'Vidéoconférence introuvable.');
      return res.redirect(`/admin/gestion-formation/${sessionId || ''}`);
    }

    // Delete the videoconference
    await Videoconference.destroy({ where: { id: visioId } });

    req.flash('success', 'La vidéoconférence a été supprimée avec succès.');
    res.redirect(`/admin/gestion-formation/${sessionId || ''}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéoconférence :', error);
    req.flash('error', 'Une erreur est survenue lors de la suppression de la vidéoconférence.');
    res.redirect(`/admin/gestion-formation/${req.params.sessionId || ''}`);
  }
};



exports.afficherFormationsEnCoursFormateur = async (req, res) => {
  try {
    // Get current formateur ID from authenticated user
    const formateurId = req.user.id;

    // Find all sessions with status "en_cours" for this formateur
    const formations = await SessionFormation.findAll({
      where: {
        idFormateur: formateurId,
        status: 'en_cours'
      },
      include: [
        {
          model: Videoconference,
          as: 'videoconferences',
          order: [['dateHeure', 'ASC']]
        }
      ],
      order: [['dateDebut', 'ASC']]
    });

    // Render the trainer-specific interface
    res.render('formateur/formations_en_cours', { 
      user: req.user,
      formations,
      currentDate: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations en cours:', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des formations en cours.');
    res.redirect('/formateur/dashboard');
  }
};


exports.afficherFormationsEnAttenteFormateur = async (req, res) => {
  try {
    // Get current formateur ID from authenticated user
    const formateurId = req.user.id;

    // Find all sessions with status "en_cours" for this formateur
    const formations = await SessionFormation.findAll({
      where: {
        idFormateur: formateurId,
        status: 'en_attente'
      },
      include: [
        {
          model: Videoconference,
          as: 'videoconferences',
          order: [['dateHeure', 'ASC']]
        }
      ],
      order: [['dateDebut', 'ASC']]
    });

    // Render the trainer-specific interface
    res.render('formateur/formations_en_attente', { 
      user: req.user,
      formations,
      currentDate: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations en cours:', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des formations en cours.');
    res.redirect('/formateur/dashboard');
  }
};


exports.afficherFormationsTermineesFormateur = async (req, res) => {
  try {
    // Get current formateur ID from authenticated user
    const formateurId = req.user.id;

    // Find all sessions with status "en_cours" for this formateur
    const formations = await SessionFormation.findAll({
      where: {
        idFormateur: formateurId,
        status: 'terminee'
      },
      include: [
        {
          model: Videoconference,
          as: 'videoconferences',
          order: [['dateHeure', 'ASC']]
        }
      ],
      order: [['dateDebut', 'ASC']]
    });

    // Render the trainer-specific interface
    res.render('formateur/formations_terminees', { 
      user: req.user,
      formations,
      currentDate: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations en cours:', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des formations en cours.');
    res.redirect('/formateur/dashboard');
  }
};


exports.afficherDetailsSessionEnCours = async (req, res) => {
  try {
    const sessionId = req.params.id;
    if (!sessionId || isNaN(sessionId)) {
      req.flash('error', 'ID de session invalide.');
      return res.redirect('/formateur/formations-en-cours');
    }

    // Fetch the session details with formateur information
    const session = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom'],
        },
      ],
    });

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/formateur/formations-en-cours');
    }

    // Fetch videoconferences with completion status for current trainer
    const videoconferences = await Videoconference.findAll({
      where: { idSession: sessionId },
      order: [['dateHeure', 'ASC']],
      include: [{
        model: SuivieCours,
        as: 'suivieCours', // Explicitly using the alias
        where: { userId: req.user.id },
        required: false
      }]
    });

    // Render the template with session and videoconferences data
    return res.render('formateur/get_formation_en_cours', { 
      session, 
      videoconferences,
      currentDate: new Date()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la session :', error);
    console.error('Stack trace:', error.stack);
    req.flash('error', `Une erreur est survenue lors du chargement des détails de la session: ${error.message}`);
    return res.redirect('/formateur/formations-en-cours');
  }
};

exports.completeVideoconference = async (req, res) => {
  try {
    const videoconferenceId = req.params.id;
    const userId = req.user.id;

    // Check if the videoconference exists
    const videoconference = await Videoconference.findByPk(videoconferenceId);
    if (!videoconference) {
      return res.status(404).json({ success: false, message: 'Vidéoconférence introuvable' });
    }

    // Check if the course is already marked as completed
    const existingRecord = await SuivieCours.findOne({
      where: {
        videoconferenceId: videoconferenceId,
        userId: userId
      }
    });

    if (existingRecord) {
      return res.status(400).json({ success: false, message: 'Ce cours a déjà été validé' });
    }

    // Create a new SuivieCours record
    await SuivieCours.create({
      videoconferenceId: videoconferenceId,
      userId: userId,
      dateValidation: new Date(),
      signedIn: true
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la validation du cours:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.afficherDetailsSessionEnAttente = async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Fetch the session details
    const session = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom'],
        },
      ],
    });

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/formateur/formations-en-attente');
    }

    // Fetch videoconferences related to the session
    const videoconferences = await Videoconference.findAll({
      where: { idSession: sessionId },
      order: [['dateHeure', 'ASC']],
    });

    // Render the template
    res.render('formateur/get_formation_en_attente', { session, videoconferences });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la session :', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des détails de la session.');
    res.redirect('/formateur/formations-en-cours');
  }
};

exports.getFormationsEnAttente = async (req, res) => {
  try {
    // Find all sessions with status "en_attente"
    const sessions = await SessionFormation.findAll({
      where: {
        status: 'en_attente'
      },
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom']
        }
      ],
      order: [['dateDebut', 'ASC']]
    });

    // Transform sessions data to match template expectations
    const formattedSessions = sessions.map(session => ({
      ...session.get({ plain: true }),
      etat: 'ouverte', // Required by template
      image: '/images/ui.jpg', // Default image
      titre: session.titre,
      description: session.description,
      dateDebut: session.dateDebut,
      dateFin: session.dateFin,
      montant: session.montant,
      id: session.id
    }));

    // Render the catalog view with pending sessions
    res.render('student/catalogue', { 
      sessions: formattedSessions,
      user: req.user 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations en attente:', error);
    req.flash('error', 'Une erreur est survenue lors du chargement du catalogue.');
    res.redirect('/dashboard');
  }
};

exports.afficherDetailsSessionCatalogue = async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Fetch the session details
    const session = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom'],
        },
      ],
    });

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/catalogue');
    }

    // Fetch videoconferences related to the session
    const videoconferences = await Videoconference.findAll({
      where: { idSession: sessionId },
      order: [['dateHeure', 'ASC']],
    });

    // Render the template
    res.render('student/formation_details', { session, videoconferences });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la session :', error);
    req.flash('error', 'Une erreur est survenue lors du chargement des détails de la session.');
    res.redirect('/formateur/formations-en-cours');
  }
};

exports.getActiveStudentFormations = async (req, res) => {
  try {
    const { idUser } = req.params;

    // Get all formations where the student has active inscriptions
    const formations = await SessionFormation.findAll({
      include: [{
        model: Inscription,
        where: { 
          idUser,
          status: 'active'
        },
        attributes: [] // Exclude inscription details
      }],
      order: [['dateDebut', 'ASC']] // Order by start date
    });

    if (!formations || formations.length === 0) {

      req.flash('error_msg', 'No active formations found for this student');

      return res.redirect('/dashboard'); // Redirect to the appropriate path

  }

    res.render('student/mes_sessions', {
      user: req.user,
      formations
    });

  } catch (error) {
    console.error('Error fetching active formations:', error);

    req.flash('error_msg', 'Failed to retrieve active formations');

    return res.redirect('/dashboard'); // Redirect to the appropriate path
  }

};

exports.validateCourse = async (req, res) => {
  try {
    const videoconferenceId = req.params.id;
    const userId = req.user.id;

    // Check if videoconference exists
    const videoconference = await Videoconference.findByPk(videoconferenceId);
    if (!videoconference) {
      return res.status(404).json({ success: false, message: 'Vidéoconférence introuvable' });
    }

    // Check if already validated
    const existing = await SuivieCours.findOne({
      where: { videoconferenceId, userId }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Cours déjà validé' });
    }

    // Create validation record
    await SuivieCours.create({
      videoconferenceId,
      userId,
      dateValidation: new Date(),
      signedIn: true
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erreur validation cours:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.displayMesSessions = async (req, res) => {
  try {
    const activeSessions = await SessionFormation.findAll({
      include: [{
        model: Inscription,
        as: 'inscriptions',
        where: {
          idUser: req.user.id,
          status: 'active'
        },
        required: true
      }],
      order: [['dateDebut', 'DESC']]
    });

    res.render('student/mes_sessions', {
      sessions: activeSessions,
      user: req.user
    });
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    req.flash('error', 'Failed to load your sessions');
    res.redirect('/dashboard');
  }
};

exports.afficherPaiementFormation = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Fetch session details
    const session = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom']
        }
      ]
    });

    if (!session) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/catalogue');
    }

    // Render payment page with session info
    res.render('student/paiement', {
      session,
      user: req.user,
      paymentMethods: [
        { name: 'Orange Money', value: 'orange' },
        { name: 'MTN Money', value: 'mtn' }, 
        { name: 'PayPal', value: 'paypal' }
      ]
    });
  } catch (error) {
    console.error('Erreur lors du chargement de la page de paiement:', error);
    req.flash('error', 'Une erreur est survenue lors du chargement de la page de paiement.');
    res.redirect('/catalogue');
  }
};

exports.afficherDetailsMesSessions = async (req, res) => {
  try {
    const sessionId = req.params.id;
    if (!sessionId || isNaN(sessionId)) {
      req.flash('error', 'ID de session invalide.');
      return res.redirect('/dashboard');
    }

    // Fetch the session details with formateur information
    const formations = await SessionFormation.findByPk(sessionId, {
      include: [
        {
          model: User,
          as: 'formateur',
          attributes: ['id', 'nom', 'prenom'],
        },
      ],
    });

    if (!formations) {
      req.flash('error', 'Session introuvable.');
      return res.redirect('/mes_sessions',{
        user: req.user, formations});
    }

    // Fetch videoconferences with completion status for current trainer
    const videoconferences = await Videoconference.findAll({
      where: { idSession: sessionId },
      order: [['dateHeure', 'ASC']],
      include: [{
        model: SuivieCours,
        as: 'suivieCours', // Explicitly using the alias
        where: { userId: req.user.id },
        required: false
      }]
    });

    // Render the template with session and videoconferences data
    return res.render('student/details_mes_sessions', { 
      formations, 
      videoconferences,
      currentDate: new Date()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la session :', error);
    console.error('Stack trace:', error.stack);
    req.flash('error', `Une erreur est survenue lors du chargement des détails de la session: ${error.message}`);
    return res.redirect('/mes_sessions');
  }
};