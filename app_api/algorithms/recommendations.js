/**
* Content-Based Recommendations
*
* Time Complexity: O(N*M) where N = trips, M = attributes
* Space Complexity: O(N) for scoring + O(k) for cache
*/

const { calculateTripScore, findTopKTrips } = require('./tripRanking');
const LRUCache = require('./lruCache');

class Recommendation {
	constructor(cacheCapacity = 100) {
		this.recommendationCache = new LRUCache(cacheCapacity);
		this.similarTripsCache = new LRUCache(cacheCapacity);
	}

	/**
	* Calculate preference scores
	*
	* @param {Object} trip - Trip object
	* @param {Object} userProfile - User preferences
	* @returns {number} Adjusted score
	*/
	calculatePreferenceScore(trip, userProfile) {
		let score = calculateTripScore(trip, { preferredResort: userProfile.preferredTravelStyle });

		const bonus = this.calculatePreferenceBonus(trip, userProfile);
		score += bonus.total;

		return score;
	}

	/**
	* Calculate individual preference bonuses
	* Separated for testing and clarity
	*/
	calculatePreferenceBonus(trip, userProfile) {
		let total = 0;
		const breakdown = {};

		if (userProfile.preferredTravelStyle === trip.travelStyle) {
			breakdown.travelStyle = 30;
			total += 30;
		}

		if (userProfile.favoriteDestinations && userProfile.favoriteDestinations.length > 0) {
			const tripLoc = (trip.resort || '').toLowerCase();
			const matches = userProfile.favoriteDestinations.filter(dest => tripLoc.includes(dest.toLowerCase()));
			const destinationBonus = matches.length * 20;
			breakdown.destinations = destinationBonus;
			total += destinationBonus;
		}

		const preferredLength = this.getPreferredLength(userProfile.perferredTravelStyle);
		if (trip.length === preferredLength) {
			breakdown.length = 15;
			total += 15;
		}

		return { total, breakdown };
	}

	/**
	* Get personalized recommendations for a User
	* Uses LRUCache for O(1) repeated requests
	* Uses findTopKTrips with MinHeap for O(n log k) efficiency
	* 
	* Time O(1) if cached, O(n log k)
	* @param {Object} userProfile - User preferences
	* @param {Array} allTrips - All available trips
	* @param {number} k - Number of Recommendations
	* @returns {Array} Top k recommended trips with scores
	*/
	getRecommendations(userProfile, allTrips, k = 5) {
		if (!allTrips || allTrips.length === 0) return [];

		const cacheKey = `user_${userProfile.userId}_${k}`;
		const cached = this.recommendationCache.get(cacheKey);
		if (cached) {
			console.log(`Cache hit: ${cacheKey}`);
			return cached;
		}

		console.log(`Computing recommendations for ${cacheKey}`);

		const scoreFn = (trip) => this.calculatePreferenceScore(trip, userProfile);

		const topTrips = findTopKTrips(allTrips, k, scoreFn);

		const recommendations = topTrips.map(trip => ({ 
			trip: {
				_id: trip._id,
				code: trip.code,
				name: trip.name,
				resort: trip.resort,
				perPerson: trip.perPerson,
				length: trip.length,
				image: trip.image
			},
			score: trip.score,
			confidenceLevel: this.getConfidenceLevel(trip.score),
			matchReasons: this.getMatchReasons(trip, userProfile)
		}));

		this.recommendationCache.put(cacheKey, recommendations);

		return recommendations;
	}

	/**
	* Get trips similar to one the user prefers
	*
	* @param {Object} likedTrip - trip user liked
	* @param {Array} allTrips - All available trips
	* @param {number} k - number of similar trips
	* @returns {Array} Similar trips
	*/
	getSimilarTrips(likedTrip, allTrips, k = 5) {
		if (!allTrips || allTrips.length === 0) return [];

		const cacheKey = `similar_${likedTrip._id}_${k}`;
		const cached = this.similarTripsCache.get(cacheKey);
		if (cached) {
			console.log(`Cache hit: ${cacheKey}`);
			return cached;
		}

		console.log(`Finding similar to ${likedTrip.code}`);

		const scoreFn = (trip) => {
			if (trip._id.toString() === likedTrip._id.toString()) return -Infinity;
			return this.calculateTripSimilarity(likedTrip, trip);
		};

		const similarTrips = findTopKTrips(allTrips.filter(t => t._id.toString() !== likedTrip._id.toString()), k, scoreFn);
		
		this.similarTripsCache.put(cacheKey, similarTrips);
		return similarTrips;
	}

	calculateTripSimilarity(trip1, trip2) {
		let score = 0;
		if (trip1.travelStyle === trip2.travelStyle) score += 30;
		if (Math.abs(trip1.perPerson - trip2.perPerson) < 200) score += 20;
		if (trip1.length === trip2.length) score += 15;
		if (trip1.resort === trip2.resort) score += 25;
		return score;
	}

	getMatchReasons(trip, userProfile) {
		const reasons = [];

		if (userProfile.preferredTravelStyle === trip.travelStyle) {
			reasons.push(`Matches your ${userProfile.preferredTravelStyle} style`);
		}

		if (userProfile.favoriteDestinations) {
			const tripLocation = trip.resort ? trip.resort.toLowerCase() : '';
			const matches = [];
			for (const dest of userProfile.favoriteDestinations) {
				if (tripLocation.toLowerCase().includes(dest.toLowerCase())) matches.push(dest);
			}

			if (matches.length > 0) {
				reasons.push(`Visit ${matches.join(', ')}`);
			}
		}

		const preferredLength = this.getPreferredLength(userProfile.preferredTravelStyle);
		if (trip.length === preferredLength) {
			reasons.push(`Perfect ${trip.length}-day trip`);
		}

		if (reasons.length === 0) {
			reasons.push('Trending destination');
		}

		return reasons;
	}

	getConfidenceLevel(score) {
		if (score >= 200) return 'very_high';
		if (score >= 150) return 'high';
		if (score >= 100) return 'medium';
		return 'low';
	}

	getPreferredLength(travelStyle) {
		const preferences = {
			'budget': 5,
			'adventure': 7,
			'luxury': 5,
			'relaxation': 7
		};
		
		return preferences[travelStyle] || 5;
	}

	clearCache() {
		this.recommendationCache.clear();
		this.similarTripsCache.clear();
		console.log('Cache cleared');
	}

	getCacheStats() {
		return {
			recommendationCacheSize: this.recommendationCache.size(),
			similarTripsCacheSize: this.similarTripsCache.size()
		};
	}
}

module.exports = new Recommendation();