/**
* Calculate a composite score for a trip based on multiple factors
* Complexity: O(1) - constant time per trip (fixed number of calculations)
* @param {Object} trip - Trip document from database
* @param {Object} userPrefs - User preferences for filtering
* @returns {number} Score for ranking (higher = better)
*/
const calculateTripScore = (trip, userPrefs = {}) => {
	let score = 0;

	// Price Ranking
	const avgPrice = 1500;
	const priceScore = Math.max(0, (avgPrice - trip.perPerson) / avgPrice) * 100;

	score += priceScore * 0.40; // 40% weight

	// Recency Ranking
	const daysUntilTrip = Math.floor((new Date(trip.start) - new Date()) / (1000 * 60 * 60 * 24));
	const recencyScore = Math.max(0, 365 - daysUntilTrip) / 365 * 100;
	
	score += recencyScore * 0.30; // 30% weight

	// Preference Ranking
	if (userPrefs.preferredResort === trip.resort) score += 10;

	return score;
};

/**
* Rank all trips by calculated score
* Complexity: O(n) to score + O(n log n) to sort = O(n log n)
* @param {Array} trips - All trips database
* @param {Object} userPrefs - User preferences
* @returns {Array} Trips sorted by score (highest first)
*/
const rankTrips = (trips, userPrefs = {}) => {
	return trips
		.map(trip => ({ ...trip, score: calculateTripScore(trip, userPrefs)}))
		.sort((a, b) => b.score - a.score); // O(n log n)
};

/** 
* MinHeap for efficient top-K selection
* Insert: O(log k), Pop: O(log k)
* Reference: https://www.geeksforgeeks.org/javascript/min-heap-in-javascript/
*/
class MinHeap{
	constructor(compareFn) { 
		this.heap = []; 
		this.compareFn = compareFn; 
	}

	insert(item) {
		this.heap.push(item);
		let i = this.heap.length - 1;
		while (i > 0) {
			const parentIdx = Math.floor((i - 1) / 2);
			if (this.compareFn(this.heap[i], this.heap[parentIdx]) < 0) {
				[this.heap[i], this.heap[parentIdx]] = [this.heap[parentIdx],this.heap[i]];
				i = parentIdx;
			} else break;
		}
	}
	pop() {
		if (this.heap.length === 0) return null;
		const min = this.heap[0];
		const last = this.heap.pop();
		if (this.heap.length > 0) {
			this.heap[0] = last;
			let i = 0;
			while (true) {
				let smallest = i;
				const left = 2 * i + 1, right = 2 * i + 2;
				if (left < this.heap.length && this.compareFn(this.heap[left], this.heap[smallest]) < 0) smallest = left;
				if (right < this.heap.length && this.compareFn(this.heap[right], this.heap[smallest]) < 0) smallest = right;
				if (smallest !== i) {
					[this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
					i = smallest;
				} else break;
			}
		}
		return min;
	}
	
	peek() { return this.heap[0]; }
	size() { return this.heap.length; }
}

/**
* Find top-k trips efficiently using min-heap
* Complexity: O(n log k)
* 
* @param {Array} trips - All Trips
* @param {number} k - desired amount
* @param {Function} scoreFn - Scoring Function
* @returns {Array} Top k trips sorted by score
*/
const findTopKTrips = (trips, k, scoreFn) => {
	if (trips.length === 0 || k <= 0) return [];

	const minHeap = new MinHeap((a, b) => a.score - b.score);

	for (let i = 0; i < trips.length; i++) {
		const scoredTrip = {...trips[i], score: scoreFn(trips[i]) };

		if (minHeap.size() < k) {
			minHeap.insert(scoredTrip);
		} else if (scoredTrip.score > minHeap.peek().score) {
			minHeap.pop();
			minHeap.insert(scoredTrip);
		}
	}

	const result = [];
	while (minHeap.size() > 0) result.push(minHeap.pop());
	return result.reverse();
};