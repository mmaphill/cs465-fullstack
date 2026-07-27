const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
	if(!req.session.userId) return res.redirect('/login');
	next();
};

// Protected routes 
router.get('/', isLoggedIn, profileController.getProfile);
router.post('/update', isLoggedIn, profileController.updateProfile);

module.exports = router;