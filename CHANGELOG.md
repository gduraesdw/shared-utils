# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-14

### Adicionado

#### Manipulação de Dados
- `deepClone`: Clonagem profunda de objetos
- `deepMerge`: Mesclagem profunda de objetos
- `flattenObject` / `unflattenObject`: Achatamento e desachatamento de objetos
- `mapValues`: Mapeamento de valores de objetos
- `omit` / `pick`: Seleção de propriedades
- `unique`: Remoção de duplicatas
- `groupBy`: Agrupamento de arrays
- `partition`: Particionamento de arrays
- `fuzzySearch`: Busca fuzzy em arrays
- `sortBy`: Ordenação por múltiplas propriedades
- Normalização de dados (camelCase, snake_case)

#### Manipulação de Strings
- Formatação de CPF, CNPJ, telefone, CEP
- Formatação de moeda
- Validação de email, URL, CPF, CNPJ
- Máscaras para documentos e dados sensíveis
- Conversões de case (camelCase, PascalCase, snake_case, kebab-case)
- Geração de slugs
- Validação de força de senha

#### Data e Tempo
- Adição e subtração de dias, meses, anos, horas, minutos
- Cálculo de diferenças entre datas
- Formatação de datas (ISO, brasileiro, relativo)
- Verificações (hoje, passado, futuro, fim de semana)
- Cálculo de idade
- Manipulação de timestamps Unix

#### Segurança
- Geração de UUID, tokens, salts
- Hash SHA-256
- Encoding/decoding Base64
- Escape de HTML
- Sanitização de strings, SQL, URLs
- Mascaramento de dados sensíveis
- Prevenção de XSS e path traversal

#### Performance
- Debounce e throttle
- Memoização
- Lazy loading
- Batch processing
- Pool de recursos
- Retry com backoff exponencial
- Fila de tarefas (TaskQueue)
- Mutex e Semaphore
- Timeout para promises

#### Rede e API
- Cliente HTTP com retry e timeout
- Interceptors de requisição e resposta
- Sistema de cache (Memory, Storage, LRU)
- Construção e parsing de query params

#### Ambiente
- Detecção de dispositivo (mobile, tablet, desktop)
- Detecção de SO e navegador
- Verificação de suporte a features
- Feature flags com rollout percentual
- Detecção de orientação e modo escuro
- Informações de rede

### Características Técnicas
- Suporte completo a TypeScript
- Zero dependências externas
- Tree shaking
- Testes com cobertura > 90%
- Documentação abrangente
