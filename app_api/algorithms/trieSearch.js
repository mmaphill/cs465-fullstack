/**
* Trie Data Structure Implementation
*
* 0(m) prefix-based searching for trip names, resorts, codes
* 
* Time Complexity
* - Insert: O(m) where m = string length
* - Search: O(m) where m = prefix length
*
* Space Complexity: 0(ALPHABET_SIZE * N * M)
* - ALPHABET-SIZE = 26 (lowercase letters)
* - N = number of trips
* - M = average string length
*
* Comparison:
* - Linear Search: O(N*M) - has to check every trip
* - Trie Search: O(m) - only check prefix depth
* 
* Reference: https://www.geeksforgeeks.org/dsa/trie-insert-and-search/
*/

class TrieNode{
	constructor() {
		this.children = {};			// Character -> TrieNode mapping
		this.trips = [];			// Trips matching this prefix
		this.isEndOfWord = false;	// Marks end of a complete word
	}
}

class TrieSearch{
	constructor() {
		this.root = new TrieNode();
	}

	/**
	* Insert a string into the trie
	* Time Complexity: O(m) where m = string length
	* @param {Object} trip - Trip object from database
	* @param {string} searchField - Field to index ('name', 'resort', 'code')
	*/
	insert(trip, searchField = 'name') {
		const searchString = trip[searchField].toLowerCase();
		let node = this.root;

		for (const char of searchString) {
			if (!node.children[char]) {
				node.children[char] = new TrieNode();
			}
			node = node.children[char];
			node.trips.push(trip); // stor trip at every node
		}

		node.isEndOfWord = true;
	}

	/**
	* Build Trie from array of Trips
	* Time Complexity: O(N*M)
	* @param {Array} trips - Array of trip objects
	* @param {string} searchField - Field to index
	*/
	buildFromTrips(trips, searchField = 'name') {
		for (const trip of trips) {
			this.insert(trip, searchField);
		}
	}

	/**
	* Search for trips matching prefix
	* Time Complexity: O(m)
	*
	* This is the key advantage of Trie:
	* Search time depends on prefix length, NOT number of trips
	*
	* @param {string} prefix - Search prefix (not case sensitive)
	* @returns {Array} Array of matching trips
	*/
	search(prefix) {
		if (!prefix || prefix.length === 0) {
			return [];
		}

		let node = this.root;
		const searchPrefix = prefix.toLowerCase();

		// Traverse to end of prefix
		for (const char of searchPrefix) {
			if (!node.children[char]) {
				return [];
			}
			node = node.children[char];
		}

		// Same trip stored at multiple prefix lengths
		const uniqueTrips = new Map();
		for (const trip of node.trips) {
			uniqueTrips.set(trip._id.toString(), trip);
		}

		return Array.from(uniqueTrips.values());
	}

	/**
	* Search with ranking (exact matches first)
	* @param {string} prefix - search prefix
	* @returns {Array} ranked results
	*/
	searchWithRanking(prefix) {
		const results = this.search(prefix);

		return results.sort((a, b) => {
			const aMatch = a.name.toLowerCase();
			const bMatch = b.name.toLowerCase();
			const searchLower = prefix.toLowerCase();

			// exact matches ranked highest
			const aExact = aMatch === searchLower ? 0 : 1;
			const bExact = bMatch === searchLower ? 0 : 1;

			if (aExact !== bExact) return aExact - bExact;

			return aMatch.length - bMatch.length;
		});
	}

	/**
	* Clear the Trie
	*/
	clear() {
		this.root = new TrieNode();
	}

	/**
	* Get Trie statistics for analysis
	* @returns {Object} Stats including node count and depth
	*/
	getStats() {
		let nodeCount = 0;
		let maxDepth = 0;

		const traverse = (node, depth = 0) => {
			nodeCount++;
			maxDepth = Math.max(maxDepth, depth);
			for (const child of Object.values(node.children)) {
				traverse(child, depth + 1);
			}
		};

		traverse(this.root);
		return { nodeCount, maxDepth };
	}
}

module.exports = TrieSearch;