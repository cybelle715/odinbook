const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/logout', authController.logout);

router.post('/login', authController.login);
router.get('/logged_in', authController.isLoggedIn);

module.exports = router;
