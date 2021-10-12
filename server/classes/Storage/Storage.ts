export default abstract class Storage<K, T> {
	private data: Map<K, T>;

	constructor() {
		this.data = new Map<K, T>();
	}

	get(key: K): T {
		return this.data.get(key)
	}

	set(key: K, value: T): T {
		this.data.set(key, value);
		return value;
	}

	containsValue(value: T): boolean {
		return this.toArray().findIndex(e => e === value) !== -1;
	}

	containsKey(key: K): boolean {
		return this.data.has(key);
	}

	all(): Map<K, T> {
		return this.data;
	}

	toArray(): Array<T> {
		return Array.from(this.data.values());
	}

	isEmpty(): boolean {
		return this.data.size === 0;
	}

	delete(key: K): void {
		this.data.delete(key);
	}
}
