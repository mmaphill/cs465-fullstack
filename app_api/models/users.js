const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		minlength: [3, 'Username must be at least 3 characters long'],
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Password must be at least 6 characters long'],
		select: false // do not return password field by default
	},
	salt: {
		type: String,
		select: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Pre-save: Hash password before saving to database
userSchema.pre('save', async function() {
	const user = this;

	// only hash if password is new or modified
	if (!user.isModified('password')) return;
	
	try {
		// Generate salt and hash password
		const salt = crypto.randomBytes(16).toString('hex');
		const hash = crypto.pbkdf2Sync(user.password, salt, 100000, 64, 'sha512').toString('hex');

		user.salt = salt;
		user.password = hash;
	} catch (error) {
		throw error;
	}
});

// Method to validate password
userSchema.methods.validPassword = function(password) {
	// If you're using crypto or similar
	// This compares plaintext password against hashed password
	try {
		const hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');

		return crypto.timingSafeEqual(
			Buffer.from(this.password),
			Buffer.from(hash)
		);
	} catch (error) {
		return false;
	}
};

/**
* Generate JWT token
* called after a successful login
* Complexity 0(1)
*/
userSchema.methods.generateJWT = function() {
	const token = jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email
		},
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);
	return token;
};

const User = mongoose.model('users',userSchema);
module.exports = User;   