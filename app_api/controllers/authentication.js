const mongoose = require('mongoose');
const User = require('../models/users');
const passport = require('passport');

const register = async (req, res) => {
	// validate message to insure that all parameters are present
	if (!req.body.name || !req.body.email || !req.body.password) {
		return res
			.status(400)
			.json({"message": "All fields requried"});
	}

	const user = new User(
		{
			name: req.body.name, // set user name
			email: req.body.email, // set e-mail address
			password: '' // start with empty password
		});
	user.setPassword(req.body.password);
	const q = await user.save();

	if(!q)
	{
		// database returned no data
		return res
			.status(500)
			.json(err);
	} else {
		// return new user token
		const token = user.generateJWT();
		return res
			.status(200)
			.json(token);
	}
};

const login = async (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res
			.status(400)
			.json({"message": "All fields requried"});
	}
	// delegate to passport module
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			// error in authentication process
			return res
				.status(404)
				.json(err);
		}

		if (user) { // auth succeeded - generate JWT and return to caller
			const token = user.generateJWT();
			return res
				.status(200)
				.json({ token: token});
		} else { // auth failed return error
			return res
				.status(401)
				.json(info);
		}
	})(req, res);
};

module.exports = {
	register,
	login
};