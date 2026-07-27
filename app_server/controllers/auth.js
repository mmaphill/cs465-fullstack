const User = require('../../app_api/models/users');
const UserProfile = require('../../app_api/models/userProfile');
const crypto = require('crypto');

// User Registration
const register = async (req, res, next) => {
	console.log('Registering User');

	try {
		const {username, email, password, passwordConfirm } = req.body;
		console.log('Fields extracted:');
		console.log(' - username:', username);
		console.log(' - email:', email);
		// Validation
		// all fields required
		if (!username || !email || !password || !passwordConfirm) {
			return res.status(400).render('register', { message: 'All fields are required' });
			console.log('Validation failed: missing required fields');
		}
		// passwords must match
		if (password !== passwordConfirm) {
			console.log('Validation failed: passwords do not match');
			return res.status(400).render('register', { message: 'Passwords do not match' }); 
		}
		// user email must be unique
		const userExists = await User.findOne({ email });
		if (userExists) {
			console.log('User already exists');
			return res.status(400).render('register', { message: 'Email is already in use' });
		}

		// create new User
		console.log('Creating new user');
		const user = new User({
			username,
			email,
			password
		});

		const savedUser = await user.save();
		console.log('User saved');

		// Create profile for new User
		console.log('Creating profile');
		const profile = new UserProfile({ userId: savedUser._id });
		await profile.save();
		console.log('Profile saved');

		console.log('User registered:', email);
		return res.status(201).render('register', { message: 'User registered successfully! Please log in.' });
	} catch (error) {
		console.error('Registration error:', error);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);
		return res.status(500).render('register', { message: 'An error occured during registration' });
	}
};

// User login
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) return res.status(400).render('login', { message: 'Email and password are required' });
		
		// find the user
		const user = await User.findOne({ email }).select('+password +salt');
		if (!user) return res.status(401).render('login', { message: 'Incorrect email or password' });

		// verify the password
		if (!user.validPassword(password)) return res.status(401).render('login', { message: 'Incorrect email or password' });

		// store the session
		req.session.userId = user._id;
		req.session.email = user.email;
		req.session.username = user.username;

		console.log('User logged in:', email);
		return res.redirect('/profile');
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).render('login', { message: 'An error occured during login' });
	}
};

// Logout
const logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Coud not log out');
		}
		res.redirect('/');
	});
};

module.exports = { register, login, logout };