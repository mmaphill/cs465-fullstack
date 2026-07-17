const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		async (email, password, done) => {
			try {
				console.log('Passport: Authenticating user:', email);
				const user = await User.findOne({ email: email })
					.select('+password +salt')
					.exec();

				console.log('Passport: User found:', !!user);

				if (!user) return done(null, false, { message: '"Incorrect email or password' });

				console.log('Passport: Checking password');
				if (!user.validPassword(password)) {
					console.log('Passport: Password incorrect');
					return done(null, false, { message: 'Incorrect password' });
				}
				
				console.log('Passport: Authentication successful');
				return done(null, user);
			} catch (error) {
				console.error('Passport error:', error);
				return done(error);
			}
		}
	)
);