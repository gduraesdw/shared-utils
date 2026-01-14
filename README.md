# @shared/utils

Uma biblioteca abrangente de utilitários e funções auxiliares que proporcionam soluções eficientes, seguras e performáticas para problemas comuns no desenvolvimento de software.

## Características

- **TypeScript**: Totalmente tipado com suporte completo ao TypeScript
- **Tree Shaking**: Suporte a tree shaking para pacotes otimizados
- **Zero Dependências**: Sem dependências externas
- **Testes Abrangentes**: Cobertura de testes superior a 90%
- **Performance**: Otimizado para máxima eficiência
- **Segurança**: Implementações seguras com foco em prevenção de vulnerabilidades

## Instalação

```bash
npm install @shared/utils
```

```bash
yarn add @shared/utils
```

```bash
pnpm add @shared/utils
```

## Categorias de Utilitários

### 1. Manipulação de Dados

Utilitários para transformação, filtragem e normalização de dados.

```typescript
import { deepClone, flattenObject, unique, groupBy } from '@shared/utils';

// Deep clone
const cloned = deepClone({ a: 1, b: { c: 2 } });

// Flatten object
const flattened = flattenObject({ a: { b: { c: 1 } } });
// { 'a.b.c': 1 }

// Remove duplicatas
const uniqueArray = unique([1, 2, 2, 3, 3, 4]);
// [1, 2, 3, 4]

// Agrupar por propriedade
const grouped = groupBy(users, (user) => user.role);
```

### 2. Manipulação de Strings

Formatação, validação e máscaras para strings.

```typescript
import {
  formatCPF,
  formatCurrency,
  validateEmail,
  slugify,
  maskSensitiveData,
} from '@shared/utils';

// Formatação
const cpf = formatCPF('12345678909');
// '123.456.789-09'

const currency = formatCurrency(1234.56);
// 'R$ 1.234,56'

// Validação
const isValid = validateEmail('user@example.com');
// true

// Slugify
const slug = slugify('Título com Acentuação!');
// 'titulo-com-acentuacao'

// Mascarar dados sensíveis
const masked = maskSensitiveData('1234567890', 2, 2);
// '12******90'
```

### 3. Data e Tempo

Manipulação, formatação e cálculos com datas.

```typescript
import {
  addDays,
  diffInDays,
  formatRelative,
  calculateAge,
  isWeekend,
} from '@shared/utils';

// Adicionar dias
const futureDate = addDays(new Date(), 7);

// Diferença em dias
const diff = diffInDays(date1, date2);

// Formato relativo
const relative = formatRelative(new Date());
// 'há 2 horas'

// Calcular idade
const age = calculateAge(new Date('1990-01-01'));

// Verificar fim de semana
const weekend = isWeekend(new Date());
```

### 4. Segurança

Criptografia, sanitização e utilitários de segurança.

```typescript
import {
  generateUUID,
  generateToken,
  escapeHTML,
  sanitizeURL,
  sha256,
} from '@shared/utils';

// Gerar UUID
const uuid = generateUUID();

// Gerar token
const token = generateToken(32);

// Escapar HTML
const safe = escapeHTML('<script>alert("xss")</script>');

// Sanitizar URL
const safeUrl = sanitizeURL('javascript:alert(1)');
// null

// SHA-256
const hash = await sha256('mensagem');
```

### 5. Performance

Otimizações, debounce, throttle e memoização.

```typescript
import {
  debounce,
  throttle,
  memoize,
  once,
  retry,
  TaskQueue,
} from '@shared/utils';

// Debounce
const debouncedSearch = debounce(search, 300);

// Throttle
const throttledScroll = throttle(handleScroll, 100);

// Memoize
const memoizedCalc = memoize(expensiveCalculation);

// Once
const initialize = once(initApp);

// Retry com backoff
const result = await retryWithBackoff(fetchData, 3, 1000);

// Fila de tarefas
const queue = new TaskQueue(5);
await queue.add(async () => fetchData());
```

### 6. Rede e API

Cliente HTTP, cache e utilitários de rede.

```typescript
import {
  HttpClient,
  buildQueryParams,
  MemoryCache,
  LRUCache,
} from '@shared/utils';

// Cliente HTTP
const client = new HttpClient('https://api.example.com');
client.setAuthToken('token123');

const data = await client.get('/users');
const user = await client.post('/users', { name: 'John' });

// Query params
const params = buildQueryParams({ page: 1, limit: 10 });
// 'page=1&limit=10'

// Cache
const cache = new MemoryCache();
cache.set('key', 'value', 60000); // TTL de 60s
const value = cache.get('key');

// LRU Cache
const lru = new LRUCache(100);
lru.set('key', 'value');
```

### 7. Ambiente

Detecção de ambiente, dispositivo e feature flags.

```typescript
import {
  isMobile,
  getOS,
  getBrowser,
  supportsFeature,
  FeatureFlagManager,
} from '@shared/utils';

// Detecção de dispositivo
const mobile = isMobile();
const os = getOS();
const browser = getBrowser();

// Verificar suporte
const hasLocalStorage = supportsFeature('localStorage');

// Feature flags
const flags = new FeatureFlagManager('production');
flags.register({
  name: 'newFeature',
  enabled: true,
  environments: ['production'],
});

if (flags.isEnabled('newFeature')) {
  // Usar nova feature
}
```

## Estrutura do Projeto

```
shared-utils/
├── src/
│   ├── data/          # Utilitários de dados
│   ├── string/        # Utilitários de strings
│   ├── date/          # Utilitários de data/tempo
│   ├── security/      # Utilitários de segurança
│   ├── network/       # Utilitários de rede
│   ├── performance/   # Utilitários de performance
│   └── environment/   # Utilitários de ambiente
├── tests/             # Testes
└── docs/              # Documentação
```

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Testes

Este projeto mantém alta cobertura de testes. Execute os testes com:

```bash
npm test
```

## Licença

MIT

## Suporte

Para reportar bugs ou sugerir melhorias, por favor abra uma issue no [GitHub](https://github.com/gduraesdw/shared-utils/issues).
