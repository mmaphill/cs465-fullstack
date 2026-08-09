const { handleError, handleSuccess } = require('../services/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const tripSearchService = require('../services/tripSearchService');
const recommendations = require('../algorithms/recommendations');
const UserProfile = require('../models/userProfile');

/**
* Search for trips user Trie algorithm
* @route GET /api/trips/search?q=query
*/
const searchTrips = asyncHandler(async (req, res) => {
	const query = req.query.q || '';

	if (!query || query.length < 1) return handleError(res, 400, 'Query parameter is required and must be at least 1 character long');

	if (query.length > 100) return handleError(res, 400, 'Query parameter must be less than 100 characters long');

	console.log(`Trie search: "${query}"`);

	const results = tripSearchService.searchAll(query);

	return handleSuccess(res, 200, results);
});

/**
* Get Personalized recommendations
* @route GET /api/trips/recommendations
*/
const getRecommendations = asyncHandler(async (req, res) => {
	// check for the user
	if (!req.session.userId) return handleError(res, 401, 'User not logged in');
	
	// get UserProfile data
	const userProfile = await UserProfile.findOne({ userId: req.session.userId });
	if (!userProfile) return handleError(res, 404, 'User profile not found.');

	const Trip = require('../models/travlr');
	const allTrips = await Trip.find({}).lean().exec();

	if (!allTrips || allTrips.length === 0) return handleError(res, 404, 'No trips found in the database');

	const recs = recommendations.getRecommendations(
		{ ...userProfile.toObject(), userId: req.session.userId },
		allTrips,
		5
	);

	return handleSuccess(res, 200, recs);
});

/**
* Get trips similar to one liked
* @route GET /api/trips/:tripCode/similar
*/
const getSimilarTrips = asyncHandler(async (req, res) => {
	const Trip = require('../models/travlr');

	const likedTrip = await Trip.findOne({ code: req.params.tripCode }).lean().exec();
	if (!likedTrip) return handleError(res, 404, 'Trip not found');

	const allTrips = await Trip.find({}).lean().exec();
	const similarTrips = recommendations.getSimilarTrips(likedTrip, allTrips, 5);

	return handleSuccess(res, 200, similarTrips);
});

/**
* Get search stats
* @route GET /api/trips/search/stats
*/
const getSearchStats = asyncHandler(async (req, res) => {
	const stats = tripSearchService.getCacheStats();

	return handleSuccess(res, 200, stats);
});

module.exports = { 	searchTrips, getRecommendations, getSimilarTrips, getSearchStats };