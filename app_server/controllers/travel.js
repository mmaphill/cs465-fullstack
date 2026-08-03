const tripsEndpoint = "http://localhost:3000/api/trips";
const options = {
	method: 'GET',
	headers: {
		Accept: 'application/json',
	},
};

/* GET travel view */
const travel = async function (req, res, next) {
	try {
		const response = await fetch(tripsEndpoint, options);
		const json = await response.json();

		console.log('Travel Controller: API Response:', json);

		const trips = json.data || [];

		console.log('Travel Controller: Trips extracted:', trips.length, 'trips');

		let message = null;
		if (!Array.isArray(trips)) {
			console.error('Travel Controller: Invalid data format');
			message = "API lookup error";
		} else if (!trips.length) {  // ← FIXED: was !json.length
			console.log('Travel Controller: No trips found');
			message = "No trips exist in our database!";
		}

		console.log('Travel Controller: Rendering travel page with', trips.length, 'trips');

		res.render('travel', { 
			title: 'Travlr Getaways', 
			trips: trips, 
			message: message, 
			currentPage: 'travel',
		});
	} catch (err) {
		console.error('Travel Controller: Error fetching trips:', err.message);
		res.status(500).send(err.message);
	}
};  // ← FIXED: Proper closing bracket

/* GET travel detail */
const travelDetail = async function (req, res, next) {
	const tripCode = req.params.tripCode;
	const endpoint = `${tripsEndpoint}/${tripCode}`;  // ← FIXED: was 'endpoit'

	console.log('Travel Detail Controller: Fetching trip:', tripCode);

	try {
		const response = await fetch(endpoint, options);  // ← Now uses correct 'endpoint'
		const json = await response.json();

		// ← FIXED: Extract trip from response
		const trip = json.data || null;

		console.log('Travel Detail Controller: Trip extracted:', trip?.name || 'Not Found');
		
		let message = null;
		let trips = [];
		
		if (!trip) {
			console.error('Travel Detail Controller: Trip not found');
			message = "Trip not found!";
		} else {
			trips = [trip];
		}

		res.render('travelDetail', { 
			title: 'Trip Details', 
			trips: trips, 
			message: message, 
			currentPage: 'travel',
		});
	} catch (err) {
		console.error('Travel Detail Controller: Error fetching trips:', err.message);
		res.status(500).send(err.message);
	}
};

module.exports = {
	travel,
	travelDetail
};