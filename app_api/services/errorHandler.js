const handleError = (res, statusCode, message, error = null) => {
	const errorResponse = {
		success: false,
		message: message,
		timestamp: new Date().toISOString()
	};
	if (process.env.NODE_ENV === 'development' && error) {
		errorResponse.error = error.message;
	}
	return res.status(statusCode).json(errorResponse);
};

const handleSuccess = (res, statusCode, data) => {
	return res.status(statusCode).json({
		success: true,
		data: data,
		timestamp: new Date().toISOString()
	});
};

module.exports = { handleError, handleSuccess };