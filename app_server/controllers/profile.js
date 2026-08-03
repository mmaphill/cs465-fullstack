const UserProfile = require('../../app_api/models/userProfile');
const User = require('../../app_api/models/users');

// Get user profile
const getProfile = async (req, res, next) => {
	try {
		const userId = req.session.userId;
		console.log('Fetching profile for user:', userId);

		if (!userId) {
			console.log('No userId in session, redirecting to login');
			return res.redirect('/auth/login');
		}

		// Get user profile
		let profile = await UserProfile.findOne({ userId }).populate('userId');
		console.log('Profile fetched:', profile);

		if (!profile) {
			console.log('No profile found in database for userId:', userId);
			profile = new UserProfile({ userId });
			await profile.save();
			console.log('Profile created for user:', userId);
		}

		// Get user data
		const user = await User.findOne({ _id: userId });
		console.log('User found:', user.email);

		res.render('profile', {
			title: 'My Profile',
			profile,
			user,
			currentPage: 'profile'
		});
	} catch (error) {
		console.error('Get profile error:', error);
		res.status(500).render('profile', { message: 'An error occured' });
	}
};

// Update user profile
const updateProfile = async (req, res, next) => {
	try {
		const userId = req.session.userId;
		const { firstName, lastName, bio, theme, notifications, favoriteDestinations, preferredTravelStyle } = req.body;

		// Update Profile
		const profile = await UserProfile.findOneAndUpdate({ userId },
		{
			firstName,
			lastName,
			bio,
			preferences: {
				theme,
				notifications: notifications === 'on',
			},
			favoriteDestinations,
			preferredTravelStyle
		},
		{ new: true, runValidators: true }
		);

		console.log('Profile updated for user:', req.session.email);
		return res.render('profile', {
			profile,
			message: 'Profile updated successfully',
			currentPage: 'profile'
		});
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).render('profile', { message: 'An error occurred while updating profile' });
	}
};

module.exports = { getProfile, updateProfile };