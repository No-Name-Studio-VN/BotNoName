/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A fixed-size cache implementation using Map with WeakRef support
 * @template K, V
 */
export default class FixedSizeMap {
  /** @type {Map<K, WeakRef<V>>} */
  #map
  /** @type {K[]} */
  #keys
  #currentIndex
  #maxSize
  /** @type {FinalizationRegistry} */
  #registry

  /**
   * Creates a new fixed-size cache.
   * @throws {Error} If maxSize is not a positive integer
   */
  constructor(maxSize: number) {
    this.#validateSize(maxSize)
    this.#map = new Map()
    this.#keys = Array(maxSize).fill(null)
    this.#currentIndex = 0
    this.#maxSize = maxSize
    this.#registry = new FinalizationRegistry((key) => {
      this.#map.delete(key)
    })
  }

  /**
   * @private
   * @throws {Error} If size is invalid
   */
  #validateSize(size: number) {
    if (!Number.isInteger(size) || size < 1) {
      throw new Error('Cache size must be a positive integer')
    }
  }

  set(key: unknown, value: WeakKey) {
    if (key == null) {
      throw new Error('Key cannot be null or undefined')
    }

    const ref = new WeakRef(value)
    this.#registry.register(value, key)

    if (this.#map.has(key)) {
      this.#map.set(key, ref)
      return
    }

    this.#map.delete(this.#keys[this.#currentIndex])
    this.#keys[this.#currentIndex] = key
    this.#currentIndex = (this.#currentIndex + 1) % this.#maxSize
    this.#map.set(key, ref)
  }

  /**
   * Checks if a key exists in the cache.
   * @param {K} key - The key to check
   */
  has(key: any) {
    return this.#map.has(key) && this.#map.get(key)?.deref() !== undefined
  }

  /**
   * Retrieves a value from the cache.
   * @param {K} key - The key to retrieve
   */
  get(key: any) {
    return this.#map.get(key)?.deref()
  }

  /**
   * Removes an entry from the cache.
   * @param {K} key - The key to remove
   */
  delete(key: any) {
    return this.#map.delete(key)
  }

  /**
   * Removes all entries from the cache.
   */
  clear() {
    this.#map.clear()
    this.#keys = Array(this.#maxSize).fill(null)
    this.#currentIndex = 0
  }

  /**
   * Gets the current number of entries in the cache.
   * @returns {number}
   */
  get size() {
    return this.#map.size
  }

  /**
   * Gets the maximum capacity of the cache.
   * @returns {number}
   */
  get capacity() {
    return this.#maxSize
  }
}
