const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // register the model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
	const q = await Model
		.find({}) // no filter, return all records
		.exec();

		// Uncomment the following line to show result of querey
		// on the console
		// console.log(q);

	if(!q)
	{ // Data base returned no Data
		return res.status(404).json(err);
	} else { // return resulting trip lists
		return res.status(200).json(q);
	}
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
	const q = await Model
		.findOne({'code' : req.params.tripCode}) // return a single record
		.exec();

		// Uncomment the following line to show result of querey
		// on the console
		// console.log(q);

	if(!q)
	{ // Data base returned no Data
		return res.status(404).json(err);
	} else { // return resulting trip lists
		return res.status(200).json(q);
	}
};

module.exports = {
	tripsList,
	tripsFindByCode
};