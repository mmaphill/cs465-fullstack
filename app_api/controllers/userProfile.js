const UserProfile = require('../models/userProfile');
const { handleError, handleSuccess } = require('../services/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

// Get the users profile
const getUserProfile = asyncHandler(async (req, res) => {
	const profile = await UserProfile.findOne({ userId: req.auth._id });

	if (!profile) return handleError(res, 404, 'User profile not found');

	return handleSuccess(res, 200, profile);
});

// update the users profile
const updateUserProfile = asyncHandler(async (req, res) => {
	const profile = await UserProfile.findOneAndUpdate(
		{ userId: req.auth._id },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!profile) return handleError(res, 404, 'User profile not found');

	return handleSuccess(res, 200, profile);
});

// Create user profile (on registration)
const createUserProfile = asyncHandler(async (req, res) => {
	const profile = new UserProfile({ userId: req.auth._id });
	await profile.save();
	return handleSuccess(res, 201, profile);
});

module.exports = { getUserProfile, updateUserProfile, createUserProfile };