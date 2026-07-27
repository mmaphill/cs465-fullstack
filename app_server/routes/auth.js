var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout
router.get('logout', authController.logout);

module.exports = router;