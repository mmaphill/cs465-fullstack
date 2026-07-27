const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
	// Reference to User
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true
	},

	// Profile Information
	firstName: String,
	lastName: String,
	// avatar ability to be added later
	bio: String,

	// User Preferences
	preferences: {
		theme: { type: String, enum: ['light', 'dark'], default: 'light' },
		notifications: { type: Boolean, default: true },
		// language preference may be added later
		emailUpdates: { type: Boolean, default: false }
	},

	// Trip Preferences (for recommendations)
	favoriteDestinations: [String],
	preferredTravelStyle: String, // 'luxury', 'budget', 'adventure'
	preferredGroupSize: Number,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

userProfileSchema.pre(/^find/, function() {
	this.populate('userId');
});

module.exports = mongoose.model('UserProfile', userProfileSchema);