const PORT = process.env.PORT || 3000;
const tripsEndpoint = "http://localhost:3000/api/trips";
const searchEndpoint = "http://localhost:3000/api/trips/search";
const recommendationsEndpoint = "http://localhost:3000/api/trips/recommendations";

const options = {
	method: 'GET',
	headers: {
		Accept: 'application/json',
	},
};

/* GET travel view */
const travel = async function (req, res, next) {
	try {
		const searchQuery = req.query.search || '';
		let trips = [];
		let message = null;
		let recommendations = [];

		if (searchQuery) {
			console.log('Travel Controller: Searching for:', searchQuery);
			const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(searchQuery)}`, options);
			const json = await response.json();
			console.log('Travel Controller: Search API Response:', json);
			
			// searchAll returns { names, resorts, codes }, not { results }
			const searchData = json.data || {};
			const combined = [
				...(searchData.names || []),
				...(searchData.resorts || []),
				...(searchData.codes || [])
			];
			// dedeupe by trip code, in case a trip matches more than one field
			const seen = new Set();
			trips = combined.filter(trip => {
				if (!trip || seen.has(trip.code)) return false;
				seen.add(trip.code);
				return true;
			});

			if (trips.length === 0) message = `No trips found for "${searchQuery}"`;
		} else {
			const response = await fetch(tripsEndpoint, options);
			const json = await response.json();
			console.log('Travel Controller: API Response:', json);
			trips = json.data || [];

			if (!Array.isArray(trips)) {
				console.error('Travel Controller: Invalid data format');
				message = "API lookup error";
			} else if (!trips.length) {
				console.log('Travel Controller: No trips found');
				message = "No trips exist in our database!";
			}
		}

		// Recommendations - only for when a user is logged-in
		if (req.session.userId && !searchQuery) {
			console.log('[Recommendations] Attempting fetch for userId:', req.session.userId);
			try { 
				const recResponse = await fetch(recommendationsEndpoint, {
					...options,
					headers: {
						...options.headers,
						Cookie: req.headers.cookie || ''
					}
				});
				const recJson = await recResponse.json();
				console.log('[Recommendations] Response:', recJson);
				recommendations = recJson.data.recommendations || recJson.data || [];
			} catch (recErr) {
				console.error('[Recommendations] Fetch error:', recErr.message);
				recommendations = [];
			}
		} else {
			console.log('[Recommendations] Skipped - userId:', req.session.userId, 'searchQuery:', searchQuery);
		}

		console.log('Travel Controller: Rendering travel page with', trips.length, 'trips');

		res.render('travel', {
			title: 'Travelr Getaways',
			trips: trips,
			message: message,
			currentPage: 'travel',
			searchQuery: searchQuery,
			recommendations: recommendations,
			userId: req.session.userId,
			username: req.session.username
		});
	} catch (err) {
		console.error('Travel Controller: Error fetching trips:', err.message);
		res.status(500).send(err.message);
	}
};

/* GET travel detail */
const travelDetail = async function (req, res, next) {
	const tripCode = req.params.tripCode;
	const endpoint = `${tripsEndpoint}/${tripCode}`;  // ← FIXED: was 'endpoit'
	const similarEndpoint = `${tripsEndpoint}/${tripCode}/similar`;

	console.log('Travel Detail Controller: Fetching trip:', tripCode);

	try {
		const response = await fetch(endpoint, options);  // ← Now uses correct 'endpoint'
		const json = await response.json();
		const trip = json.data || null;

		console.log('Travel Detail Controller: Trip extracted:', trip.name || 'Not Found');
		
		let message = null;
		let trips = [];
		let similarTrips = [];
		
		if (!trip) {
			console.error('Travel Detail Controller: Trip not found');
			message = "Trip not found!";
		} else {
			trips = [trip];

			try {
				const simResponse = await fetch(similarEndpoint, options);
				const simJson = await simResponse.json();
				similarTrips = simJson.data.simlarTrips || simJson.data || [];
			} catch (simErr) {
				console.error('Simlar trips fetch error:', simErr.message);
				similarTrips = [];
			}
		}

		res.render('travelDetail', { 
			title: 'Trip Details', 
			trips: trips, 
			message: message, 
			currentPage: 'travel',
			similarTrips: similarTrips,
			userId: req.session.userId,
			username: req.session.username
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