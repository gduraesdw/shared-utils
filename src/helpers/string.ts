/**
 * String utility functions.
 */

/**
 * Capitalizes the first letter of a string.
 * @param str - The input string
 * @returns Capitalized string
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a string to camelCase.
 * @param str - The input string
 * @returns camelCase string
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('hello-world') // 'helloWorld'
 */
export function camelCase(str: string): string {
  return str
    .replace(/[\s-_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Converts a string to kebab-case.
 * @param str - The input string
 * @returns kebab-case string
 * @example
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('Hello World') // 'hello-world'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake_case.
 * @param str - The input string
 * @returns snake_case string
 * @example
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('Hello World') // 'hello_world'
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Converts a string to PascalCase.
 * @param str - The input string
 * @returns PascalCase string
 * @example
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('hello-world') // 'HelloWorld'
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[\s-_]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Truncates a string to a specified length.
 * @param str - The input string
 * @param length - Maximum length
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated string
 * @example
 * truncate('Hello World', 8) // 'Hello...'
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Reverses a string.
 * @param str - The input string
 * @returns Reversed string
 * @example
 * reverse('hello') // 'olleh'
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Checks if a string is a palindrome.
 * @param str - The input string
 * @returns True if string is a palindrome
 * @example
 * isPalindrome('racecar') // true
 * isPalindrome('hello') // false
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

/**
 * Removes whitespace from both ends of a string.
 * @param str - The input string
 * @returns Trimmed string
 * @example
 * trim('  hello  ') // 'hello'
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Converts a string to title case.
 * @param str - The input string
 * @returns Title case string
 * @example
 * titleCase('hello world') // 'Hello World'
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Replaces all occurrences of a substring.
 * @param str - The input string
 * @param search - String to search for
 * @param replace - Replacement string
 * @returns String with replacements
 * @example
 * replaceAll('hello world', 'l', 'L') // 'heLLo worLd'
 */
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace);
}

/**
 * Counts the occurrences of a substring.
 * @param str - The input string
 * @param search - String to search for
 * @returns Number of occurrences
 * @example
 * countOccurrences('hello world', 'l') // 3
 */
export function countOccurrences(str: string, search: string): number {
  return (str.match(new RegExp(search, 'g')) || []).length;
}

/**
 * Removes HTML tags from a string.
 * @param str - The input string
 * @returns String without HTML tags
 * @example
 * stripHtml('<p>Hello</p>') // 'Hello'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Escapes HTML special characters.
 * @param str - The input string
 * @returns Escaped string
 * @example
 * escapeHtml('<div>') // '&lt;div&gt;'
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Generates a random string of specified length.
 * @param length - Length of the string
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 * @example
 * randomString(10) // 'aB3xK9mP2q'
 */
export function randomString(
  length: number,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
