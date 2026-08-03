console.log('Loading TrieSearch...');
const TrieSearch = require('../algorithms/trieSearch');
console.log('TrieSearch loaded:', typeof TrieSearch);

class TripSearchService {
	constructor() {
		this.nameTrie = new TrieSearch();
		this.resortTrie = new TrieSearch();
		this.codeTrie = new TrieSearch();
		this.lastBuilt = null;
	}

	buildTriesFromTrips(trips) {
		console.log('Building tries from trips...');

		this.nameTrie.clear();
		this.resortTrie.clear();
		this.codeTrie.clear();

		const startTime = Date.now();

		this.nameTrie.buildFromTrips(trips, 'name');
		this.resortTrie.buildFromTrips(trips, 'resort');
		this.codeTrie.buildFromTrips(trips, 'code');

		this.lastBuilt = new Date();
		const buildTime = Date.now() - startTime;
		console.log(`Tries built in ${buildTime} ms. Last built at: ${this.lastBuilt}`);
		console.log('Name Trie:', this.nameTrie.getStats());
		console.log('Resort Trie:', this.resortTrie.getStats());
		console.log('Code Trie:', this.codeTrie.getStats());
	}

	searchAll(query) {
		if (!query || query.length === 0) return { nameResults: [], resortResults: [], codeResults: [] };

		return { 
			names: this.nameTrie.searchWithRanking(query),
			resorts: this.resortTrie.searchWithRanking(query),
			codes: this.codeTrie.searchWithRanking(query)
		};
	}

	searchByName(query) { return this.nameTrie.searchWithRanking(query); }

	searchByResort(query) { return this.resortTrie.searchWithRanking(query); }

	searchByCode(query) { return this.codeTrie.searchWithRanking(query); }

	getLastBuiltTime() { return this.lastBuilt; }

	getCacheStats() {
		return {
			built: this.lastBuilt,
			name: this.nameTrie.getStats(),
			resort: this.resortTrie.getStats(),
			code: this.codeTrie.getStats()
		};
	}
}

module.exports = new TripSearchService();