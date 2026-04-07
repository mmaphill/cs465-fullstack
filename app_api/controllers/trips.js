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

// POST: /trips - adds a new trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
	const newTrip = new Trip({
		code: req.body.code,
		name: req.body.name,
		length: req.body.length,
		start: req.body.start,
		resort: req.body.resort,
		perPerson: req.body.perPerson,
		image: req.body.image,
		description: req.body.description
	});

	const q = await newTrip.save();

	if (!q)
	{ // Database returned no Data
		return res.status(400).json(err);
	} else {
		return res.status(201).json(q);
	}

	// Uncomment the following line to show result of operation
	// on the console
	// console.log(q);
};

// PUT: /trips/:tripCode - updates an existing trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client 
const tripsUpdateTrip = async(req, res) => {
	console.log(req.params);
	console.log(req.body);

	const q = await Model
		.findOneAndUpdate(
			{ 'code' : req.params.tripCode}, // find record to update
			{
				code: req.body.code,
				name: req.body.name,
				length: req.body.length,
				start: req.body.start,
				resort: req.body.resort,
				perPerson: req.body.perPerson,
				image: req.body.image,
				description: req.body.description
			}
		)
		.exec();

		if(!q)
		{ // database returned no Data
			return res.status(400).json(err);
		} else { // return resulting updated trip
			return res.status(200).json(q);
		}

		// Uncomment the following line to show result of operation
		// on the console
		// console.log(q);
};
	

module.exports = {
	tripsList,
	tripsFindByCode,
	tripsAddTrip,
	tripsUpdateTrip
};