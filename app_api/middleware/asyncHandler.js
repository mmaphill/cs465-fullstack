/**
* Wraps async controller functions with automatic error handling
* Eliminates repetitive try-catch blocks across all controllers
*
* Usage: instead of try-catch in every function, just wrap the async logic
*/
const asyncHandler = (fn) => {
	return (req, res, next) => {
		return Promise.resolve(fn(req, res, next)).catch(next);
	};
};

module.exports = asyncHandler;