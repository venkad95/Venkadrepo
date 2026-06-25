const express = require('express');
const router = express.Router();
const productDetailsController = require('../controllers/productController');
const authMiddel = require('../middelware/authMiddel');
const { authorize } = require('../middelware/authorizeMiddel');

router.get('/client-summary', authMiddel.checkaccessToken, authorize(['owner', 'client']), productDetailsController.getProductDetails);
router.post('/createproductentry', authMiddel.checkaccessToken, authorize('client'), productDetailsController.createProductEntry);
router.get('/client-history/:month', authMiddel.checkaccessToken,authorize(['owner', 'client']), productDetailsController.getMonthHistory);
router.post('/product-configure-to-user', authMiddel.checkaccessToken, authorize('owner'), productDetailsController.productRateConfigureToUser);
router.put('/update-productqty/:uuid', authMiddel.checkaccessToken, authorize('client'), productDetailsController.updateProductQuantities);
module.exports = router;