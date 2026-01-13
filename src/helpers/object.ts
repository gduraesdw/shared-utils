/**
 * Object utility functions.
 */

/**
 * Picks specified properties from an object.
 * @param obj - The source object
 * @param keys - Array of keys to pick
 * @returns New object with only picked properties
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omits specified properties from an object.
 * @param obj - The source object
 * @param keys - Array of keys to omit
 * @returns New object without omitted properties
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Deep merges two or more objects.
 * @param target - The target object
 * @param sources - Source objects to merge
 * @returns Deeply merged object
 * @example
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key] as object, source[key] as object);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Checks if a value is a plain object.
 * @param value - The value to check
 * @returns True if value is a plain object
 * @example
 * isObject({}) // true
 * isObject([]) // false
 */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep clones an object.
 * @param obj - The object to clone
 * @returns Deep cloned object
 * @example
 * const cloned = deepClone({ a: { b: 1 } })
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Gets a nested property value using dot notation.
 * @param obj - The source object
 * @param path - Property path (e.g., 'a.b.c')
 * @param defaultValue - Default value if path doesn't exist
 * @returns The value at the path or default value
 * @example
 * getProperty({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 * getProperty({ a: { b: 1 } }, 'a.b.c', 'default') // 'default'
 */
export function getProperty<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result !== undefined ? (result as T) : defaultValue;
}

/**
 * Sets a nested property value using dot notation.
 * @param obj - The target object
 * @param path - Property path (e.g., 'a.b.c')
 * @param value - Value to set
 * @returns The modified object
 * @example
 * setProperty({}, 'a.b.c', 1) // { a: { b: { c: 1 } } }
 */
export function setProperty<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return obj;

  let current: Record<string, unknown> = obj as Record<string, unknown>;
  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
  return obj;
}

/**
 * Checks if an object is empty.
 * @param obj - The object to check
 * @returns True if object has no own properties
 * @example
 * isEmpty({}) // true
 * isEmpty({ a: 1 }) // false
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Inverts the keys and values of an object.
 * @param obj - The source object
 * @returns Inverted object
 * @example
 * invert({ a: '1', b: '2' }) // { '1': 'a', '2': 'b' }
 */
export function invert<T extends Record<string, string | number>>(
  obj: T
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[String(obj[key])] = key;
    }
  }
  return result;
}
