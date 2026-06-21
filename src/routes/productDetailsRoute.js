const express = require('express');
const router = express.Router();
const productDetailsController = require('../controllers/productController');
const authMiddel = require('../middelware/authMiddel');

router.get('/client-summary', authMiddel.checkaccessToken, productDetailsController.getProductDetails);
router.post('/createproductentry', authMiddel.checkaccessToken, productDetailsController.createProductEntry);
router.get('/client-history/:month', authMiddel.checkaccessToken, productDetailsController.getMonthHistory);

module.exports = router;