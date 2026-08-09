const mongoose = require('mongoose');
const { handleError, handleSuccess } = require('../services/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const Model = require('../models/travlr');

/**
* Controller for handling trip-related operations.
* Each function corresponds to a specific API endpoint and handles
* the request and response logic for that endpoint.
* @async
* @function tripsList
* @param {Object} req - Express request Object
* @param {Object} res - Express response Object
* @returns {Object} JSON response with trips array or error message
* @throw {Error} Database connection errors
* @example
* GET /api/trips
* Response: { success: true, data: [...] }
*/
const tripsList = asyncHandler(async(req, res) => {
	const q = await Model.find({}).lean().exec();

	if (!q || q.length === 0) {
		return handleError(res, 404, 'No trips found');
	}

	return handleSuccess(res, 200, q);
});

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = asyncHandler(async(req, res) => {
	const trip = await Model.findOne({ code: req.params.tripCode }).lean().exec();

	if (!trip) {
		return handleError(res, 404, `Trip with code ${req.params.tripCode} not found`);
	}
	
	return handleSuccess(res, 200, trip);
});

// POST: /trips - adds a new trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = asyncHandler(async(req, res) => {
	const newTrip = new Model({
		code: req.body.code,
		name: req.body.name,
		length: req.body.length,
		start: req.body.start,
		resort: req.body.resort,
		perPerson: req.body.perPerson,
		image: req.body.image,
		description: req.body.description
	});

	const savedTrip = await newTrip.save();
	return handleSuccess(res, 201, savedTrip);
});

// PUT: /trips/:tripCode - updates an existing trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client 
const tripsUpdateTrip = asyncHandler(async(req, res) => {
	const updatedTrip = await Model
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
			},
			{ new: true, runValidators: true }
		).exec();

		if(!updatedTrip) { 
			return handleError(res, 404, `Trip with code ${req.params.tripCode} not found`);
		}

		return handleSuccess(res, 200, updatedTrip);
});

const tripsDeleteTrip = asyncHandler(async (req, res) => {
	const deletedTrip = await Model.findOneAndDelete({ code: req.params.tripCode }).exec();

	if (!deletedTrip) {
		return handleError(res, 404, `Trip with code ${req.params.tripCode} not found`);
	}

	return handleSuccess(res, 200, { message: `Trip ${deletedTrip.tripCode} successfully deleted` });
});

module.exports = {
	tripsList,
	tripsFindByCode,
	tripsAddTrip,
	tripsUpdateTrip,
	tripsDeleteTrip
};