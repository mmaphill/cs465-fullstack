/** 
* LRU (Least Recently Used) Cache using linked list + HashMap
* Get: O(1), PUt: O(1), Eviction: O(1)
* Use case: Cache top 10 frequently accessed trips
* Resource: https://dev.to/abdullahyasir/understanding-lru-cache-efficient-data-storage-and-retrieval-2jnc
*/
class LRUCache {
	constructor(capacity = 10) {
		this.capacity = capacity;
		this.cache = new Map();
		this.head = { prev: null, next: null };
		this.tail = { prev: this.head, next: null };
		this.head.next = this.tail;
	}

	get(key) {
		if (!this.cache.has(key)) return null;
		const node = this.cache.get(key);
		this.moveToHead(node); // mark as recently Used
		return node.value;
	}

	put(key, value) {
		if (this.cache.has(key)) {
			const node = this.cache.get(key);
			node.value = value;
			this.moveToHead(node);
		} else {
			const node = { key, value, prev: this.head, next: this.head.next };
			this.head.next.prev = node;
			this.head.next = node;
			this.cache.set(key, node);

			if (this.cache.size > this.capacity) {
				const lru = this.tail.prev;
				this.tail.prev = lru.prev;
				lru.prev.next = this.tail;
				this.cache.delete(lru.key);
			}
		}
	}
	
	moveToHead(node) {
		node.prev.next = node.next;
		node.next.prev = node.prev;
		node.prev = this.head;
		node.next = this.head.next;
		this.head.next.prev = node;
		this.head.next = node;
	}

	// Get cache size
	size() { return this.cache.size; }

	// Clear cache
	clear() { 
		this.cache.clear();
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}
}

module.exports = LRUCache;