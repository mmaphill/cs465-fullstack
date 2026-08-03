const { body, validationResult } = require('express-validator');

const validateTrip = [
	body('code').notEmpty().isString().trim().isLength({ min: 1, max: 12 }),
	body('name').notEmpty().isString().trim().isLength({ min: 1, max: 100 }),
	body('length').notEmpty().isString().trim(),
	body('start').notEmpty().isISO8601().custom(val => new Date(val) > new Date()),
	body('resort').notEmpty().isString().trim(),
	body('perPerson').notEmpty().isNumeric().custom(val => val > 0),
	body('image').notEmpty().isURL(),
	body('description').notEmpty().isString().trim().isLength({ min: 10, max: 10000 }),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	}
];

router.post('/trips', validateTrip,tripsAddTrip);

module.exports = validateTrip;