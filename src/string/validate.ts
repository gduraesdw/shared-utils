/**
 * Utilitários de validação de strings
 */

/**
 * Valida um email
 * @param email - Email a ser validado
 * @returns true se o email for válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida uma URL
 * @param url - URL a ser validada
 * @returns true se a URL for válida
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida um CPF
 * @param cpf - CPF a ser validado
 * @returns true se o CPF for válido
 */
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;

  return true;
}

/**
 * Valida um CNPJ
 * @param cnpj - CNPJ a ser validado
 * @returns true se o CNPJ for válido
 */
export function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Valida primeiro dígito verificador
  let length = numbers.length - 2;
  let nums = numbers.substring(0, length);
  const digits = numbers.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(nums.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Valida segundo dígito verificador
  length = length + 1;
  nums = numbers.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(nums.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida um telefone brasileiro
 * @param phone - Telefone a ser validado
 * @returns true se o telefone for válido
 */
export function validatePhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Valida um CEP
 * @param cep - CEP a ser validado
 * @returns true se o CEP for válido
 */
export function validateCEP(cep: string): boolean {
  const numbers = cep.replace(/\D/g, '');
  return numbers.length === 8;
}

/**
 * Valida se uma string contém apenas números
 * @param str - String a ser validada
 * @returns true se contiver apenas números
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Valida se uma string contém apenas letras
 * @param str - String a ser validada
 * @returns true se contiver apenas letras
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Valida se uma string contém apenas letras e números
 * @param str - String a ser validada
 * @returns true se contiver apenas letras e números
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Valida se uma string é um JSON válido
 * @param str - String a ser validada
 * @returns true se for um JSON válido
 */
export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida se uma string é um hexadecimal válido
 * @param str - String a ser validada
 * @returns true se for um hexadecimal válido
 */
export function isHexadecimal(str: string): boolean {
  return /^[0-9A-Fa-f]+$/.test(str);
}

/**
 * Valida força de senha
 * @param password - Senha a ser validada
 * @param options - Opções de validação
 * @returns Objeto com resultado e mensagem
 */
export function validatePasswordStrength(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; message: string; strength: 'weak' | 'medium' | 'strong' } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  if (password.length < minLength) {
    errors.push(`Senha deve ter no mínimo ${minLength} caracteres`);
  } else {
    score++;
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  } else if (/[A-Z]/.test(password)) {
    score++;
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  } else if (/[a-z]/.test(password)) {
    score++;
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  } else if (/\d/.test(password)) {
    score++;
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  }

  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    message: errors.length > 0 ? errors.join('. ') : 'Senha válida',
    strength,
  };
}
