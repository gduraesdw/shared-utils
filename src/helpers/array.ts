/**
 * Array utility functions.
 */

/**
 * Returns unique values from an array.
 * @param array - The input array
 * @returns Array with unique values
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Chunks an array into smaller arrays of specified size.
 * @param array - The input array
 * @param size - The chunk size
 * @returns Array of chunks
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens a nested array to a single level.
 * @param array - The nested array
 * @returns Flattened array
 * @example
 * flatten([1, [2, [3, 4]]]) // [1, 2, 3, 4]
 */
export function flatten<T>(array: unknown[]): T[] {
  return array.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten<T>(val) : (val as T));
  }, []);
}

/**
 * Groups array elements by a key function.
 * @param array - The input array
 * @param keyFn - Function that returns the grouping key
 * @returns Object with grouped values
 * @example
 * groupBy([{age: 20}, {age: 30}, {age: 20}], item => item.age)
 * // { '20': [{age: 20}, {age: 20}], '30': [{age: 30}] }
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = String(keyFn(item));
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Removes falsy values from an array.
 * @param array - The input array
 * @returns Array without falsy values
 * @example
 * compact([0, 1, false, 2, '', 3]) // [1, 2, 3]
 */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

/**
 * Returns the difference between two arrays.
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Elements in array1 that are not in array2
 * @example
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => !set2.has(item));
}

/**
 * Returns the intersection of two arrays.
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Elements that exist in both arrays
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}

/**
 * Shuffles an array randomly.
 * @param array - The input array
 * @returns New shuffled array
 * @example
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4] (random order)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns a random element from an array.
 * @param array - The input array
 * @returns Random element from the array
 * @example
 * sample([1, 2, 3, 4, 5]) // 3 (random)
 */
export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Removes duplicate objects from array based on a key.
 * @param array - Array of objects
 * @param keyFn - Function that returns the unique key
 * @returns Array with unique objects
 * @example
 * uniqueBy([{id: 1}, {id: 2}, {id: 1}], item => item.id) // [{id: 1}, {id: 2}]
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
