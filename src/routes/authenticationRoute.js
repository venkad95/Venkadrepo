const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddel = require('../middelware/authMiddel');
const { authorize } = require('../middelware/authorizeMiddel');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.otpVerify);
router.post('/logout', authMiddel.checkaccessToken, authController.logout);
// router.get('/getuserswithdashbaord',authMiddel.checkaccessToken, authorize('owner'), authController.getOverAllDashboardList);

router.get('/getuserswithdashbaord', authController.getOverAllDashboardList);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


module.exports = router;