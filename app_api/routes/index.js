const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will router
const tripsController = require('../controllers/trips');

// defin route for our trips endpoint
router
	.route('/trips')
	.get(tripsController.tripsList) // GET method routes tripList
	.post(tripsController.tripsAddTrip);

// GET Method routes tripsFindByCode - requries parameter
router
	.route('/trips/:tripCode')
	.get(tripsController.tripsFindByCode)
	.put(tripsController.tripsUpdateTrip);

module.exports = router;