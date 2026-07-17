const { handleError, handleSuccess } = require('../services/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/users');
const passport = require('passport');

// User Registration
// Complexity: 0(n)
const register = asyncHandler(async (req, res) => {
	const { username, email, password, passwordConfirm } = req.body;
	// validate message to insure that all parameters are present
	if (!username || !email || !password|| !passwordConfirm) return handleError(res, 400, 'All fields are required: username, email, password, passwordConfirm');

	if (password !== passwordConfirm) return handleError(res, 400, 'Passwords do not match');

	const userExists = await User.findOne({ email }).exec();
	if (userExists) return handleError(res, 400, 'User with this email already exists');

	const user = new User({
			username,
			email,
			password
	});

	const savedUser = await user.save(); 

	return handleSuccess(res, 201, {
		message: 'User registered successfully',
		user: {
			id: savedUser._id,
			username: savedUser.username,
			email: savedUser.email
		}
	});
});


/** 
* User login
* Complexity: 0(1) 
*/
const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	console.log('Login: Request received for email:', email);

	// validate input
	if (!email || !password) return handleError(res, 400, 'Email and password are required');

	// delegate to passport module
	passport.authenticate('local', (err, user, info) => {
		console.log('Login: Passport callback received');
		console.log(' - err:', err);
		console.log(' - user:', user ? user.email : 'null');
		console.log(' - info:', info);

		if (err) {
			console.log('Login: Authentication error');
			return handleError(res, 500, 'Authentication process error', err);
		}

		if (user) { // auth succeeded - generate JWT and return to caller
			console.log('Login: User authenticated, generating token');
			try {
				const token = user.generateJWT();
				return handleSuccess(res, 200, {
					message: 'Login successful',
					token: token,
					user: {
						id: user._id,
						username: user.username,
						email: user.email
					}
				});
			} catch (tokenError) {
				console.error('Login: Token generation failed', tokenError);
				return handleError(res, 500, 'Failed to generate authentication token');
			}
		} else {
			console.log('Login: Authentication Failed');
			const message = info?.message || 'Invalid email or password';
			return handleError(res, 401, message, info);
		}
	})(req, res);
});

module.exports = {
	register,
	login
};