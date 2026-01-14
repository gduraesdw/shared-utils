/**
 * Utilitários de criptografia e hashing
 * Nota: Para produção, considere usar bibliotecas especializadas como crypto-js ou bcrypt
 */

/**
 * Gera um hash simples de uma string (não use para senhas em produção)
 * @param str - String a ser hasheada
 * @returns Hash da string
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Gera uma string aleatória
 * @param length - Comprimento da string
 * @param charset - Conjunto de caracteres (padrão: alfanumérico)
 * @returns String aleatória
 */
export function generateRandomString(
  length: number,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  const charsetLength = charset.length;

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charsetLength];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charsetLength)];
    }
  }

  return result;
}

/**
 * Gera um UUID v4
 * @returns UUID
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gera um token aleatório
 * @param length - Comprimento do token
 * @returns Token
 */
export function generateToken(length = 32): string {
  return generateRandomString(length);
}

/**
 * Codifica string para Base64
 * @param str - String a ser codificada
 * @returns String em Base64
 */
export function encodeBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  // Node.js environment
  return Buffer.from(str, 'utf-8').toString('base64');
}

/**
 * Decodifica string Base64
 * @param str - String Base64
 * @returns String decodificada
 */
export function decodeBase64(str: string): string {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(str)));
  }
  // Node.js environment
  return Buffer.from(str, 'base64').toString('utf-8');
}

/**
 * Implementação simples de hash SHA-256 usando Web Crypto API
 * @param message - Mensagem a ser hasheada
 * @returns Promise com hash hexadecimal
 */
export async function sha256(message: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  throw new Error('SHA-256 não disponível neste ambiente');
}

/**
 * Cifra simples de Caesar (apenas para demonstração, não use em produção)
 * @param text - Texto a ser cifrado
 * @param shift - Número de posições para deslocar
 * @returns Texto cifrado
 */
export function caesarCipher(text: string, shift: number): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }

      return char;
    })
    .join('');
}

/**
 * Decifra cifra de Caesar
 * @param text - Texto cifrado
 * @param shift - Número de posições usado na cifragem
 * @returns Texto decifrado
 */
export function caesarDecipher(text: string, shift: number): string {
  return caesarCipher(text, 26 - shift);
}

/**
 * Gera um salt aleatório para uso em hashing de senhas
 * @param length - Comprimento do salt
 * @returns Salt
 */
export function generateSalt(length = 16): string {
  return generateRandomString(length);
}

/**
 * Compara dois valores de forma segura contra timing attacks
 * @param a - Primeiro valor
 * @param b - Segundo valor
 * @returns true se os valores forem iguais
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
