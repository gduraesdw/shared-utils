/**
 * Utilitários de controle de concorrência
 */

/**
 * Limita o número de execuções concorrentes
 * @param tasks - Array de funções assíncronas
 * @param limit - Limite de concorrência
 * @returns Promise com array de resultados
 */
export async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Executa tarefas em paralelo com limite de concorrência
 * @param items - Array de items
 * @param fn - Função a ser executada para cada item
 * @param concurrency - Limite de concorrência
 * @returns Promise com array de resultados
 */
export async function parallelMap<T, U>(
  items: T[],
  fn: (item: T, index: number) => Promise<U>,
  concurrency = 5
): Promise<U[]> {
  const results: U[] = new Array(items.length);
  let index = 0;

  async function processNext(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex], currentIndex);
    }
  }

  const workers = Array(Math.min(concurrency, items.length))
    .fill(null)
    .map(() => processNext());

  await Promise.all(workers);
  return results;
}

/**
 * Cria uma fila de tarefas
 */
export class TaskQueue<T> {
  private queue: (() => Promise<T>)[] = [];
  private running = 0;
  private concurrency: number;

  constructor(concurrency = 1) {
    this.concurrency = concurrency;
  }

  /**
   * Adiciona uma tarefa à fila
   * @param task - Tarefa a ser adicionada
   * @returns Promise com o resultado
   */
  async add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      this.running++;

      task()
        .catch(() => {
          // Error already handled in add()
        })
        .finally(() => {
          this.running--;
          this.processQueue();
        });
    }
  }

  /**
   * Retorna o tamanho da fila
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Retorna o número de tarefas em execução
   */
  get pending(): number {
    return this.running;
  }
}

/**
 * Mutex para controle de acesso exclusivo
 */
export class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  /**
   * Adquire o lock
   * @returns Promise que resolve quando o lock é adquirido
   */
  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve(() => this.release());
      } else {
        this.queue.push(() => {
          this.locked = true;
          resolve(() => this.release());
        });
      }
    });
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }

  /**
   * Executa uma função com lock exclusivo
   * @param fn - Função a ser executada
   * @returns Promise com o resultado
   */
  async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

/**
 * Semaphore para controle de acesso com limite
 */
export class Semaphore {
  private permits: number;
  private queue: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  /**
   * Adquire uma permissão
   * @returns Promise que resolve quando uma permissão é adquirida
   */
  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve(() => this.release());
      } else {
        this.queue.push(() => {
          this.permits--;
          resolve(() => this.release());
        });
      }
    });
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.permits++;
    }
  }

  /**
   * Executa uma função com permissão
   * @param fn - Função a ser executada
   * @returns Promise com o resultado
   */
  async runWithPermit<T>(fn: () => Promise<T> | T): Promise<T> {
    const release = await this.acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }

  /**
   * Retorna o número de permissões disponíveis
   */
  get available(): number {
    return this.permits;
  }
}

/**
 * Promise com timeout
 * @param promise - Promise a ser executada
 * @param ms - Timeout em milissegundos
 * @param message - Mensagem de erro
 * @returns Promise com timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = 'Operation timed out'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}
