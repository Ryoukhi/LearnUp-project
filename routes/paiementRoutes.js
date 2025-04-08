const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Initiate payment
router.post('/initier', verifyToken, paiementController.initierPaiement);

// Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), paiementController.webhookHandler);

module.exports = router;
