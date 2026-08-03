const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// GET routes to render pages
router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
	res.render('register', { title: 'Register' });
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;