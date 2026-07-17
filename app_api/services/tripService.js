const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const getTrips = async () => {
	return await Trip.find({}).exec();
};

const getTripByCode = async (code) => {
	return await Trip.findOne({ 'code': code }).exec();
};

const createTrip = async (tripData) => {
	const trip =new Trip(tripData);
	return await trip.save();
};

const updateTrip = async (code, tripData) => {
	return await Trip.findOneAndUpdate({ 'code': code }, tripData, { new: true }).exec();
};

module.exports = { getTrips, getTripByCode, createTrip, updateTrip };