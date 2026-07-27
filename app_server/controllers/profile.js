const UserProfile = require('../../app_api/models/userProfile');
const User = require('../../app_api/models/users');

// Get user profile
const getProfile = async (req, res, next) => {
	try {
		const userId = req.session.userId;

		// Get user profile
		const profile = await UserProfile.findOne({ userId }).populate('userId');

		if (!profile) return res.status(404).render('profile', { message: 'Profile not found' });

		// Get user data
		const user = await User.findById(userId);

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
		res.render('profile', {
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