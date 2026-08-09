const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

const readLine = require('readline');

// Build the connection string and set the connection timeout.
// timeout is in milliseconds.
const connect = () => {
	setTimeout(() => mongoose.connect(dbURI, {
	}), 1000);
}

// Monitor connection events
mongoose.connection.on('connected', async () => {
	console.log(`Mongoose connected to ${dbURI}`);
	
	// initialize trip search service when database is connected
	try {
		const Trip = require('./travlr');
		await Trip.syncIndexes();
		const tripSearchService = require('../services/tripSearchService');

		const trips = await Trip.find({}).exec();
		console.log(`Building trip search service with ${trips.length} trips`);
		tripSearchService.buildTriesFromTrips(trips);
		console.log('Trip search built');
	} catch (error) {
		console.error('Failed to build trip search indices:', error);
	}
});

mongoose.connection.on('error', err => {
	console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

// Windows specific listener
if(process.platform === 'win32'){
	const r1 = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
		});
	r1.on('SIGINT', () => {
	process.emit("SIGINT");
	});
}

// Configure for Graceful Shutdown
const gracefulShutdown = (msg) => {
	mongoose.connection.close(() => {
	console.log(`Mongoose disconnected through ${msg}`);
	});
};

// Event Listeners to process graceful shutdowns
// Shutdown invoked by nodemon signal
process.once('SIGUSR2', () => {
	gracefulShutdown('nodemon restart');
	process.kill(process.pid, 'SIGUSR2');
});

// Shutdown invoked by app termination
process.on('SIGINT', () => {
	gracefulShutdown('app termination');
	process.exit(0);
});

// Shutdown invoked by container termination
process.on('SIGTERM', () => {
	gracefulShutdown('app shutdown');
	process.exit(0);
});

// Make initial connection to DB
connect();

// Import Mongoose schema
require('./travlr');
require('./users');
require('./userProfile');
module.exports = mongoose;