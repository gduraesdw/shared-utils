/**
 * Sistema de feature flags
 */

/**
 * Configuração de feature flag
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  environments?: string[];
  percentage?: number;
}

/**
 * Gerenciador de feature flags
 */
export class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private currentEnvironment: string;

  constructor(environment = 'development') {
    this.currentEnvironment = environment;
  }

  /**
   * Registra uma feature flag
   * @param flag - Configuração da flag
   */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
  }

  /**
   * Registra múltiplas flags
   * @param flags - Array de flags
   */
  registerMany(flags: FeatureFlag[]): void {
    flags.forEach((flag) => this.register(flag));
  }

  /**
   * Verifica se uma feature está habilitada
   * @param name - Nome da feature
   * @param userId - ID do usuário (para percentage rollout)
   * @returns true se a feature estiver habilitada
   */
  isEnabled(name: string, userId?: string): boolean {
    const flag = this.flags.get(name);

    if (!flag) {
      return false;
    }

    // Check if disabled globally
    if (!flag.enabled) {
      return false;
    }

    // Check environment restrictions
    if (flag.environments && !flag.environments.includes(this.currentEnvironment)) {
      return false;
    }

    // Check percentage rollout
    if (flag.percentage !== undefined && userId) {
      const hash = this.hashCode(userId + name);
      const userPercentage = Math.abs(hash % 100);
      return userPercentage < flag.percentage;
    }

    return true;
  }

  /**
   * Habilita uma feature
   * @param name - Nome da feature
   */
  enable(name: string): void {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = true;
    }
  }

  /**
   * Desabilita uma feature
   * @param name - Nome da feature
   */
  disable(name: string): void {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = false;
    }
  }

  /**
   * Remove uma feature flag
   * @param name - Nome da feature
   */
  remove(name: string): void {
    this.flags.delete(name);
  }

  /**
   * Lista todas as flags
   * @returns Array de flags
   */
  list(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Define o ambiente atual
   * @param environment - Nome do ambiente
   */
  setEnvironment(environment: string): void {
    this.currentEnvironment = environment;
  }

  /**
   * Retorna o ambiente atual
   */
  getEnvironment(): string {
    return this.currentEnvironment;
  }

  /**
   * Hash simples para percentage rollout
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Exporta configurações
   * @returns Objeto com configurações
   */
  export(): Record<string, FeatureFlag> {
    const result: Record<string, FeatureFlag> = {};
    this.flags.forEach((flag, name) => {
      result[name] = flag;
    });
    return result;
  }

  /**
   * Importa configurações
   * @param config - Objeto com configurações
   */
  import(config: Record<string, FeatureFlag>): void {
    Object.entries(config).forEach(([name, flag]) => {
      this.flags.set(name, { ...flag, name });
    });
  }
}

/**
 * Gerenciador global de feature flags
 */
let globalFeatureFlagManager: FeatureFlagManager | null = null;

/**
 * Obtém o gerenciador global de feature flags
 * @returns Gerenciador de feature flags
 */
export function getFeatureFlagManager(): FeatureFlagManager {
  if (!globalFeatureFlagManager) {
    globalFeatureFlagManager = new FeatureFlagManager();
  }
  return globalFeatureFlagManager;
}

/**
 * Verifica se uma feature está habilitada (helper global)
 * @param name - Nome da feature
 * @param userId - ID do usuário
 * @returns true se habilitada
 */
export function isFeatureEnabled(name: string, userId?: string): boolean {
  return getFeatureFlagManager().isEnabled(name, userId);
}

/**
 * Registra uma feature flag (helper global)
 * @param flag - Configuração da flag
 */
export function registerFeature(flag: FeatureFlag): void {
  getFeatureFlagManager().register(flag);
}

/**
 * Decorator para métodos condicionados a feature flags
 * @param featureName - Nome da feature
 * @param fallback - Valor de retorno se a feature estiver desabilitada
 */
export function requireFeature(featureName: string, fallback?: unknown): MethodDecorator {
  return function (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      if (isFeatureEnabled(featureName)) {
        return originalMethod.apply(this, args);
      }
      return fallback;
    };

    return descriptor;
  };
}
