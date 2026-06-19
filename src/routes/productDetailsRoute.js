const express = require('express');
const router = express.Router();
const productDetailsController = require('../controllers/productController');
const authMiddel = require('../middelware/authMiddel');

router.get('/getproductlist', authMiddel.checkaccessToken, productDetailsController.getProductDetails);
router.post('/createproductentry', authMiddel.checkaccessToken, productDetailsController.createProductEntry);

module.exports = router;