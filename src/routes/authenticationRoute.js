const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddel = require('../middelware/authMiddel');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authMiddel.checkaccessToken, authController.logout);
router.get('/getuserswithdashbaord',authMiddel.checkaccessToken, authController.getOverAllDashboardList);

module.exports = router;