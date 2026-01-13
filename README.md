# @seu-org/shared-utils

A comprehensive TypeScript utility library providing formatting, validation, HTTP, storage, helper, and async utilities.

## Features

- 🎨 **Formatting**: Date, currency, phone, CPF, CNPJ
- ✅ **Validation**: Email, CPF, CNPJ, phone, credit card
- 🌐 **HTTP**: Axios wrapper with interceptors
- 💾 **Storage**: Type-safe localStorage wrapper
- 🛠️ **Helpers**: Array, object, and string utilities
- ⏱️ **Async**: Retry, debounce, throttle, and more
- 🌲 **Tree-shakeable**: Import only what you need
- 📝 **TypeScript**: Full type safety with comprehensive JSDoc
- ✨ **Pure Functions**: No side effects, easy to test
- 🧪 **Well Tested**: >90% code coverage

## Installation

```bash
npm install @seu-org/shared-utils
```

## Usage

### Formatting

```typescript
import { formatDate, formatCurrency, formatPhone, formatCPF, formatCNPJ } from '@seu-org/shared-utils';

// Date formatting
formatDate(new Date(), 'DD/MM/YYYY'); // '15/01/2024'
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'); // '2024-01-15 10:30:45'

// Currency formatting (Brazilian Real)
formatCurrency(1234.56); // 'R$ 1.234,56'
formatCurrency(1000, { showSymbol: false }); // '1.000,00'

// Phone formatting
formatPhone('11987654321'); // '(11) 98765-4321'
formatPhone('1133334444'); // '(11) 3333-4444'

// CPF formatting
formatCPF('12345678901'); // '123.456.789-01'

// CNPJ formatting
formatCNPJ('12345678000195'); // '12.345.678/0001-95'
```

### Validation

```typescript
import {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidCreditCard,
} from '@seu-org/shared-utils';

// Email validation
isValidEmail('user@example.com'); // true
isValidEmail('invalid.email'); // false

// CPF validation (Brazilian tax ID)
isValidCPF('11144477735'); // true
isValidCPF('12345678901'); // false

// CNPJ validation (Brazilian company ID)
isValidCNPJ('11222333000181'); // true

// Phone validation
isValidPhone('11987654321'); // true

// Credit card validation (Luhn algorithm)
isValidCreditCard('4532015112830366'); // true
```

### HTTP

```typescript
import { createHttpClient, get, post, put, patch, del } from '@seu-org/shared-utils';

// Create a custom HTTP client
const client = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  onRequest: (config) => {
    // Add auth token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  onResponseError: async (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  },
});

// Use helper functions
const users = await get<User[]>('/users');
const newUser = await post<User>('/users', { name: 'John' });
const updatedUser = await put<User>('/users/1', { name: 'Jane' });
await del('/users/1');
```

### Storage

```typescript
import {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
  createNamespacedStorage,
} from '@seu-org/shared-utils';

// Type-safe localStorage
interface User {
  name: string;
  age: number;
}

setItem('user', { name: 'John', age: 30 });
const user = getItem<User>('user'); // Fully typed!

// Namespaced storage
const userStorage = createNamespacedStorage('user');
userStorage.setItem('profile', { name: 'John' }); // Stores as 'user:profile'
userStorage.getItem('profile'); // { name: 'John' }
userStorage.clear(); // Clears only 'user:*' keys
```

### Array Helpers

```typescript
import {
  unique,
  chunk,
  flatten,
  groupBy,
  compact,
  difference,
  intersection,
  shuffle,
  sample,
  uniqueBy,
} from '@seu-org/shared-utils';

// Unique values
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]

// Chunk array
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Flatten nested arrays
flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]

// Group by key
const items = [{ age: 20 }, { age: 30 }, { age: 20 }];
groupBy(items, (item) => item.age); // { '20': [...], '30': [...] }

// Remove falsy values
compact([0, 1, false, 2, '', 3]); // [1, 2, 3]

// Array operations
difference([1, 2, 3], [2, 3, 4]); // [1]
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
```

### Object Helpers

```typescript
import {
  pick,
  omit,
  deepMerge,
  deepClone,
  getProperty,
  setProperty,
  isEmpty,
  invert,
} from '@seu-org/shared-utils';

// Pick properties
pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }

// Omit properties
omit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }

// Deep merge
deepMerge({ a: { b: 1 } }, { a: { c: 2 } }); // { a: { b: 1, c: 2 } }

// Deep clone
const cloned = deepClone({ a: { b: 1 } });

// Get/set nested properties
getProperty({ a: { b: { c: 1 } } }, 'a.b.c'); // 1
setProperty({}, 'a.b.c', 1); // { a: { b: { c: 1 } } }
```

### String Helpers

```typescript
import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  truncate,
  escapeHtml,
  randomString,
} from '@seu-org/shared-utils';

// Case transformations
capitalize('hello'); // 'Hello'
camelCase('hello world'); // 'helloWorld'
kebabCase('helloWorld'); // 'hello-world'
snakeCase('helloWorld'); // 'hello_world'
pascalCase('hello world'); // 'HelloWorld'

// Truncate
truncate('Hello World', 8); // 'Hello...'

// HTML safety
escapeHtml('<div>'); // '&lt;div&gt;'

// Random string
randomString(10); // 'aB3xK9mP2q'
```

### Async Utilities

```typescript
import {
  retry,
  debounce,
  throttle,
  sleep,
  withTimeout,
  batchProcess,
  sequential,
  memoize,
} from '@seu-org/shared-utils';

// Retry with exponential backoff
const data = await retry(() => fetchData(), {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
});

// Debounce
const debouncedSearch = debounce((query) => search(query), 300);

// Throttle
const throttledScroll = throttle(() => handleScroll(), 100);

// Sleep
await sleep(1000); // Wait 1 second

// Timeout
const data = await withTimeout(() => fetchData(), 5000);

// Batch processing
const results = await batchProcess(ids, 5, (id) => fetchUser(id));

// Sequential execution
const results = await sequential([() => task1(), () => task2()]);

// Memoization
const memoizedFetch = memoize(fetchUser);
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Lint
npm run lint

# Format code
npm run format
```

## Build Output

The library is built with Rollup and outputs:
- CommonJS: `dist/index.js`
- ES Modules: `dist/index.esm.js`
- TypeScript Declarations: `dist/index.d.ts`

All builds are tree-shakeable, so bundlers like Webpack and Rollup will only include the functions you actually use.

## License

MIT