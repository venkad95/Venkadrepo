const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddel = require('../middelware/authMiddel');
const { authorize } = require('../middelware/authorizeMiddel');

router.get('/get-payment-details', authMiddel.checkaccessToken, authorize(['owner', 'client']), paymentController.getPaymentDetails);
router.put('/update-advance-payment/:uuid', authMiddel.checkaccessToken, authorize(['client']), paymentController.updateAdvancePayment);
router.put('/update-partial-payment/:uuid', authMiddel.checkaccessToken, authorize(['client']), paymentController.saveFinalPayment);
router.put('/update-full-payment/:uuid', authMiddel.checkaccessToken, authorize(['client']), paymentController.saveFinalPayment);

module.exports = router;