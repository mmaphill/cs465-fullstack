const { body, validationResult } = require('express-validator');

const validateTrip = [
	body('code').notEmpty().isString().trim().isLength({ min: 1, max: 10 }),
	body('name').notEmpty().isString().trim().isLength({ min: 1, max: 100 }),
	body('length').notEmpty().isString().trim(),
	body('start').notEmpty().isISO8601(),
	body('resort').notEmpty().isString().trim(),
	body('perPerson').notEmpty().isNumeric(),
	body('image').notEmpty().isURL(),
	body('description').notEmpty().isString().trim(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	}
];

module.exports = validateTrip;