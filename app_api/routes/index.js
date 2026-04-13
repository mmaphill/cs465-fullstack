const jwt = require('jsonwebtoken'); // JWT for authentication
const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will router
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// method to authenticate our JWT
function authenticateJWT(req, res, next) {
	// console.log('In Middleware');

	const authHeader = req.headers['authorization'];
	// console.log('Auth Header: ' + authHeader);

	if(authHeader == null)
	{
		console.log('Auth Header Required but NOT PRESENT!');
		return res.sendStatus(401); // Unauthorized
	}

	let headers = authHeader.split(' ');
	if (headers.length < 1)
	{
		console.log('Not enough tokensin Auth Header: ' + headers.length);
		return res.sendStatus(501); // Internal Server Error
	}

	const token = authHeader.split(' ')[1];
	// console.log('Token: ' + token);

	if (token == null)
	{
		console.log('Null Bearer Token');
		return res.sendStatus(401); // Unauthorized
	}

	//console.log(process.env.JWT_SECRET);
	//console.log(jwt.decode(token));
	const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
		if (err)
		{
			return res.sendStatus(401).json('Token Validation Error!');
		}
		req.auth = verified; // set the auth param to the decoded object
		next();
	});
}

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

// defin route for our trips endpoint
router
	.route('/trips')
	.get(tripsController.tripsList) // GET method routes tripList
	.post(authenticateJWT, tripsController.tripsAddTrip);

// GET Method routes tripsFindByCode - requries parameter
router
	.route('/trips/:tripCode')
	.get(tripsController.tripsFindByCode)
	.put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;