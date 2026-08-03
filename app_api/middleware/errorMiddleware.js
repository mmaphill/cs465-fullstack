const { handleError } = require('../services/errorHandler');

/** 
* Centralized error handling middleware for Express.js applications.
* Catches errors thrown in route handlers and sends a structured JSON response.
*/
const errorMiddleware = (err, req, res, next) => {
	console.error('Error:', err);

	// Handle Mongoose validation errors
	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors).map(val => val.message);
		return handleError(res, 400, 'Validation failed: ' + messages.join('; '), err);
	}

	// Handle duplicate key errors (e.g., unique constraints)
	if (err.code === 11000) {
		const field = Object.keys(err.keyPattern)[0];
		return handleError(res, 400, `Duplicate: ${field} already exists`, err);
	}

	// Handle CastError (invalid MongoDB ID)
	if (err.name === 'CastError') {
		return handleError(res, 401, 'Invalid authentication token', err);
	}

	// Handle any other error
	return handleError(res, err.statusCode || 500, err.message || 'Internal Server Error', err);
};

module.exports = errorMiddleware;