import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  truncate,
  reverse,
  isPalindrome,
  trim,
  titleCase,
  replaceAll,
  countOccurrences,
  stripHtml,
  escapeHtml,
  randomString,
} from './string';

describe('String utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('Hello World')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('truncate', () => {
    it('should truncate string', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
      expect(truncate('Hello World', 8, '…')).toBe('Hello W…');
    });

    it('should not truncate if shorter than length', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });
  });

  describe('reverse', () => {
    it('should reverse string', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('12345')).toBe('54321');
    });
  });

  describe('isPalindrome', () => {
    it('should detect palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
    });

    it('should detect non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
    });
  });

  describe('trim', () => {
    it('should trim whitespace', () => {
      expect(trim('  hello  ')).toBe('hello');
      expect(trim('\n\thello\t\n')).toBe('hello');
    });
  });

  describe('titleCase', () => {
    it('should convert to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('replaceAll', () => {
    it('should replace all occurrences', () => {
      expect(replaceAll('hello world', 'l', 'L')).toBe('heLLo worLd');
      expect(replaceAll('aaa', 'a', 'b')).toBe('bbb');
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences', () => {
      expect(countOccurrences('hello world', 'l')).toBe(3);
      expect(countOccurrences('hello world', 'o')).toBe(2);
      expect(countOccurrences('hello world', 'x')).toBe(0);
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<div><span>Test</span></div>')).toBe('Test');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
      expect(escapeHtml('"quote"')).toBe('&quot;quote&quot;');
      expect(escapeHtml("'single'")).toBe('&#39;single&#39;');
    });
  });

  describe('randomString', () => {
    it('should generate random string of specified length', () => {
      const result = randomString(10);
      expect(result).toHaveLength(10);
    });

    it('should use custom charset', () => {
      const result = randomString(10, '01');
      expect(result).toHaveLength(10);
      expect(/^[01]+$/.test(result)).toBe(true);
    });

    it('should generate different strings', () => {
      const str1 = randomString(20);
      const str2 = randomString(20);
      expect(str1).not.toBe(str2);
    });
  });
});
