import {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidCreditCard,
} from '../validation';

describe('Validation utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@invalid.com')).toBe(false);
      expect(isValidEmail('invalid@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('11144477735')).toBe(true); // Valid CPF
      expect(isValidCPF('111.444.777-35')).toBe(true); // Same CPF formatted
    });

    it('should reject invalid CPF', () => {
      expect(isValidCPF('12345678901')).toBe(false); // Invalid check digits
      expect(isValidCPF('11111111111')).toBe(false); // All same digits
      expect(isValidCPF('00000000000')).toBe(false); // All zeros
      expect(isValidCPF('123')).toBe(false); // Too short
      expect(isValidCPF('')).toBe(false);
    });

    it('should handle formatted CPF', () => {
      expect(isValidCPF('111.444.777-35')).toBe(true);
    });
  });

  describe('isValidCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(isValidCNPJ('11222333000181')).toBe(true); // Valid CNPJ
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true); // Same CNPJ formatted
    });

    it('should reject invalid CNPJ', () => {
      expect(isValidCNPJ('12345678000190')).toBe(false); // Invalid check digits
      expect(isValidCNPJ('11111111111111')).toBe(false); // All same digits
      expect(isValidCNPJ('00000000000000')).toBe(false); // All zeros
      expect(isValidCNPJ('123')).toBe(false); // Too short
      expect(isValidCNPJ('')).toBe(false);
    });

    it('should handle formatted CNPJ', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
    });
  });

  describe('isValidPhone', () => {
    it('should validate 11-digit mobile phone', () => {
      expect(isValidPhone('11987654321')).toBe(true);
      expect(isValidPhone('(11) 98765-4321')).toBe(true);
    });

    it('should validate 10-digit landline phone', () => {
      expect(isValidPhone('1133334444')).toBe(true);
      expect(isValidPhone('(11) 3333-4444')).toBe(true);
    });

    it('should reject invalid phone', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('123456789012')).toBe(false); // Too long
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('isValidCreditCard', () => {
    it('should validate correct credit card using Luhn algorithm', () => {
      expect(isValidCreditCard('4532015112830366')).toBe(true); // Valid Visa
      expect(isValidCreditCard('6011111111111117')).toBe(true); // Valid Discover
      expect(isValidCreditCard('5425233430109903')).toBe(true); // Valid Mastercard
    });

    it('should reject invalid credit card', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false); // Invalid Luhn
      expect(isValidCreditCard('123')).toBe(false); // Too short
      expect(isValidCreditCard('12345678901234567890')).toBe(false); // Too long
      expect(isValidCreditCard('')).toBe(false);
    });

    it('should handle formatted credit card', () => {
      expect(isValidCreditCard('4532-0151-1283-0366')).toBe(true);
      expect(isValidCreditCard('4532 0151 1283 0366')).toBe(true);
    });

    it('should validate different card lengths', () => {
      expect(isValidCreditCard('378282246310005')).toBe(true); // 15 digits (Amex)
      expect(isValidCreditCard('4532015112830366')).toBe(true); // 16 digits
    });
  });
});
