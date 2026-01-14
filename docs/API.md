# Documentação da API

## Índice

- [Manipulação de Dados](#manipulação-de-dados)
- [Manipulação de Strings](#manipulação-de-strings)
- [Data e Tempo](#data-e-tempo)
- [Segurança](#segurança)
- [Performance](#performance)
- [Rede e API](#rede-e-api)
- [Ambiente](#ambiente)

## Manipulação de Dados

### Transform

#### `deepClone<T>(obj: T): T`

Cria uma cópia profunda de um objeto.

**Parâmetros:**
- `obj`: Objeto a ser clonado

**Retorna:** Cópia profunda do objeto

**Exemplo:**
```typescript
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // 2
```

#### `deepMerge<T>(target: T, ...sources: Partial<T>[]): T`

Mescla profundamente dois ou mais objetos.

**Parâmetros:**
- `target`: Objeto alvo
- `sources`: Objetos fonte

**Retorna:** Objeto mesclado

**Exemplo:**
```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = deepMerge(obj1, obj2);
// { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

#### `flattenObject(obj: Record<string, unknown>, prefix?: string): Record<string, unknown>`

Achata um objeto aninhado em um único nível.

**Parâmetros:**
- `obj`: Objeto a ser achatado
- `prefix`: Prefixo para as chaves (opcional)

**Retorna:** Objeto achatado

**Exemplo:**
```typescript
const nested = { a: { b: { c: 1 } } };
const flat = flattenObject(nested);
// { 'a.b.c': 1 }
```

### Filter

#### `unique<T>(array: T[]): T[]`

Remove duplicatas de um array.

**Parâmetros:**
- `array`: Array com possíveis duplicatas

**Retorna:** Array sem duplicatas

**Exemplo:**
```typescript
const arr = [1, 2, 2, 3, 3, 4];
const unique = unique(arr);
// [1, 2, 3, 4]
```

#### `groupBy<T>(array: T[], fn: (item: T) => string): Record<string, T[]>`

Agrupa elementos de um array por uma função.

**Parâmetros:**
- `array`: Array a ser agrupado
- `fn`: Função para determinar o grupo

**Retorna:** Objeto com os grupos

**Exemplo:**
```typescript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
];
const byRole = groupBy(users, user => user.role);
// { admin: [...], user: [...] }
```

## Manipulação de Strings

### Format

#### `formatCPF(cpf: string): string`

Formata um CPF.

**Parâmetros:**
- `cpf`: CPF sem formatação

**Retorna:** CPF formatado (XXX.XXX.XXX-XX)

**Throws:** Error se o CPF não tiver 11 dígitos

**Exemplo:**
```typescript
formatCPF('12345678909');
// '123.456.789-09'
```

#### `formatCurrency(value: number, options?): string`

Formata um número como moeda.

**Parâmetros:**
- `value`: Valor numérico
- `options`: Opções de formatação

**Retorna:** String formatada como moeda

**Exemplo:**
```typescript
formatCurrency(1234.56);
// 'R$ 1.234,56'

formatCurrency(1234.56, { locale: 'en-US', currency: 'USD' });
// '$1,234.56'
```

#### `slugify(str: string): string`

Gera um slug a partir de uma string.

**Parâmetros:**
- `str`: String a ser convertida

**Retorna:** Slug

**Exemplo:**
```typescript
slugify('Título com Acentuação!');
// 'titulo-com-acentuacao'
```

### Validate

#### `validateEmail(email: string): boolean`

Valida um email.

**Parâmetros:**
- `email`: Email a ser validado

**Retorna:** true se o email for válido

**Exemplo:**
```typescript
validateEmail('user@example.com'); // true
validateEmail('invalid'); // false
```

#### `validateCPF(cpf: string): boolean`

Valida um CPF.

**Parâmetros:**
- `cpf`: CPF a ser validado

**Retorna:** true se o CPF for válido

**Exemplo:**
```typescript
validateCPF('123.456.789-09'); // true
validateCPF('111.111.111-11'); // false
```

## Data e Tempo

### Manipulate

#### `addDays(date: Date, days: number): Date`

Adiciona dias a uma data.

**Parâmetros:**
- `date`: Data base
- `days`: Número de dias a adicionar

**Retorna:** Nova data

**Exemplo:**
```typescript
const today = new Date();
const nextWeek = addDays(today, 7);
```

#### `diffInDays(date1: Date, date2: Date): number`

Calcula a diferença em dias entre duas datas.

**Parâmetros:**
- `date1`: Primeira data
- `date2`: Segunda data

**Retorna:** Diferença em dias

**Exemplo:**
```typescript
const diff = diffInDays(new Date('2024-01-01'), new Date('2024-01-15'));
// 14
```

### Format

#### `formatRelative(date: Date, locale?: string): string`

Formata data de forma relativa.

**Parâmetros:**
- `date`: Data
- `locale`: Locale (padrão: pt-BR)

**Retorna:** Data formatada de forma relativa

**Exemplo:**
```typescript
formatRelative(new Date(Date.now() - 3600000));
// 'há 1 hora'
```

## Segurança

### Crypto

#### `generateUUID(): string`

Gera um UUID v4.

**Retorna:** UUID

**Exemplo:**
```typescript
const uuid = generateUUID();
// 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7g8'
```

#### `generateToken(length?: number): string`

Gera um token aleatório.

**Parâmetros:**
- `length`: Comprimento do token (padrão: 32)

**Retorna:** Token

**Exemplo:**
```typescript
const token = generateToken(64);
```

### Sanitize

#### `escapeHTML(str: string): string`

Escapa caracteres HTML para prevenir XSS.

**Parâmetros:**
- `str`: String a ser escapada

**Retorna:** String com caracteres HTML escapados

**Exemplo:**
```typescript
escapeHTML('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

## Performance

### Optimize

#### `debounce<T>(func: T, delay: number): T`

Cria uma versão debounced de uma função.

**Parâmetros:**
- `func`: Função a ser debounced
- `delay`: Delay em milissegundos

**Retorna:** Função debounced

**Exemplo:**
```typescript
const search = debounce((query) => {
  fetchResults(query);
}, 300);
```

#### `throttle<T>(func: T, limit: number): T`

Cria uma versão throttled de uma função.

**Parâmetros:**
- `func`: Função a ser throttled
- `limit`: Limite em milissegundos

**Retorna:** Função throttled

**Exemplo:**
```typescript
const handleScroll = throttle(() => {
  console.log('scrolling');
}, 100);
```

#### `memoize<T>(func: T, resolver?): T`

Memoiza uma função (cache de resultados).

**Parâmetros:**
- `func`: Função a ser memoizada
- `resolver`: Função para gerar a chave do cache

**Retorna:** Função memoizada

**Exemplo:**
```typescript
const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

## Rede e API

### HttpClient

#### `new HttpClient(baseURL?: string, defaultOptions?: RequestOptions)`

Cliente HTTP com métodos convenientes.

**Exemplo:**
```typescript
const client = new HttpClient('https://api.example.com');
client.setAuthToken('your-token');

const users = await client.get('/users');
const newUser = await client.post('/users', { name: 'John' });
```

### Cache

#### `MemoryCache`

Cache em memória com TTL.

**Exemplo:**
```typescript
const cache = new MemoryCache();
cache.set('key', 'value', 60000); // 60 segundos
const value = cache.get('key');
```

## Ambiente

### Detect

#### `isMobile(): boolean`

Detecta se é dispositivo móvel.

**Retorna:** true se for móvel

**Exemplo:**
```typescript
if (isMobile()) {
  // Renderizar versão mobile
}
```

#### `getBrowser(): { name: string; version: string }`

Detecta navegador.

**Retorna:** Informações do navegador

**Exemplo:**
```typescript
const { name, version } = getBrowser();
console.log(`${name} ${version}`);
```

### Feature Flags

#### `FeatureFlagManager`

Gerenciador de feature flags.

**Exemplo:**
```typescript
const flags = new FeatureFlagManager('production');

flags.register({
  name: 'newFeature',
  enabled: true,
  environments: ['production'],
  percentage: 50
});

if (flags.isEnabled('newFeature', userId)) {
  // Feature habilitada
}
```
