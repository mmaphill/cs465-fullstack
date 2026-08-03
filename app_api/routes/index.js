const jwt = require('jsonwebtoken'); // JWT for authentication
const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will router
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const userProfileController = require('../controllers/userProfile');
const tripSearchController = require('../controllers/tripSearch');

// import error handler and async handler
const { handleError } = require('../services/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

// method to authenticate our JWT
function authenticateJWT(req, res, next) {
	// console.log('In Middleware');

	const authHeader = req.headers['authorization'];
	// console.log('Auth Header: ' + authHeader);

	if(!authHeader) {
		return handleError(res, 401, 'Authorization header required');
	}

	let headers = authHeader.split(' ');
	if (headers.length < 1)
	{
		console.log('Not enough tokensin Auth Header: ' + headers.length);
		return res.sendStatus(501); // Internal Server Error
	}

	const token = authHeader.split(' ')[1];
	// console.log('Token: ' + token);

	if (!token) {
		return handleError(res, 401, 'Bearer token is empty');
	}

	//console.log(process.env.JWT_SECRET);
	//console.log(jwt.decode(token));
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.auth = verified; // Attach decoded user to request
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return handleError(res, 401, 'Token has expired');
		} else if (error.name ==='JsonWebTokenError') {
			return handleError(res, 401, 'Invalid token');
		} else {
			return handleError(res, 401, 'Token verification failed', error);
		}
	}
};

// authentication routes
router.route("/auth/register").post(authController.register);
router.route("/auth/login").post(authController.login);

// protected routes - requires authentication
router.get('/profile', authenticateJWT, userProfileController.getUserProfile);
router.put('/profile', authenticateJWT, userProfileController.updateUserProfile);
router.post('/profile', authenticateJWT, userProfileController.createUserProfile);

// defin route for our trips endpoint
/**
* GET /api/trips - lists all trips
* POST /api/trips - adds a new trip (requires JWT authentication)
*
* Complexity: GET is 0(n), POST is 0(1)
*/
router
	.route('/trips')
	.get(tripsController.tripsList) // GET method routes tripList
	.post(authenticateJWT, tripsController.tripsAddTrip);

// SEARCH ROUTES FIRST (specific)
router.get('/trips/search/stats', tripSearchController.getSearchStats);
router.get('/trips/search', tripSearchController.searchTrips);

// RECOMMENDATION ROUTES
router.get('/trips/recommendations', tripSearchController.getRecommendations);
router.get('/trips/:tripCode/similar', tripSearchController.getSimilarTrips);

/**
* GET /api/trips/:tripCode - Get a specific trip by code
* PUT /api/trips/:tripCode - Update a specific trip by code (requires JWT authentication)
* DELETE /api/trips/:tripCode - Delete a trip (requires JWT authentication)
*/
router
	.route('/trips/:tripCode')
	.get(tripsController.tripsFindByCode)
	.put(authenticateJWT, tripsController.tripsUpdateTrip)
	.delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;