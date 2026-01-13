/**
 * Type-safe localStorage wrapper with JSON serialization/deserialization.
 */

/**
 * Gets a value from localStorage with type safety.
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored value or default value
 * @example
 * const user = getItem<User>('user', { name: 'Guest' });
 */
export function getItem<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue ?? null;
  }
}

/**
 * Sets a value in localStorage with JSON serialization.
 * @param key - The storage key
 * @param value - The value to store
 * @returns True if successful, false otherwise
 * @example
 * setItem('user', { name: 'John', age: 30 });
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Removes a value from localStorage.
 * @param key - The storage key to remove
 * @returns True if successful, false otherwise
 * @example
 * removeItem('user');
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Clears all items from localStorage.
 * @returns True if successful, false otherwise
 * @example
 * clear();
 */
export function clear(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
}

/**
 * Checks if a key exists in localStorage.
 * @param key - The storage key to check
 * @returns True if key exists, false otherwise
 * @example
 * if (hasItem('user')) {
 *   // User data exists
 * }
 */
export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

/**
 * Gets all keys from localStorage.
 * @returns Array of all storage keys
 * @example
 * const keys = getAllKeys();
 */
export function getAllKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Creates a namespaced storage instance with a prefix.
 * @param namespace - The namespace prefix for keys
 * @returns Object with namespaced storage methods
 * @example
 * const userStorage = createNamespacedStorage('user');
 * userStorage.setItem('profile', { name: 'John' }); // Stores as 'user:profile'
 */
export function createNamespacedStorage(namespace: string) {
  const prefixKey = (key: string) => `${namespace}:${key}`;

  return {
    getItem: <T>(key: string, defaultValue?: T) => getItem<T>(prefixKey(key), defaultValue),
    setItem: <T>(key: string, value: T) => setItem(prefixKey(key), value),
    removeItem: (key: string) => removeItem(prefixKey(key)),
    hasItem: (key: string) => hasItem(prefixKey(key)),
    clear: () => {
      const keys = getAllKeys().filter((k) => k.startsWith(`${namespace}:`));
      keys.forEach((k) => removeItem(k));
      return true;
    },
  };
}
