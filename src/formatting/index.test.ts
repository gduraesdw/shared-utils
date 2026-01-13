import {
  formatDate,
  formatCurrency,
  formatPhone,
  formatCPF,
  formatCNPJ,
} from '../formatting';

describe('Formatting utilities', () => {
  describe('formatDate', () => {
    it('should format date with DD/MM/YYYY pattern', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    });

    it('should format date with YYYY-MM-DD pattern', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    });

    it('should format date with time', () => {
      const date = new Date('2024-01-15T10:30:45');
      expect(formatDate(date, 'DD/MM/YYYY HH:mm:ss')).toBe('15/01/2024 10:30:45');
    });

    it('should handle ISO string input', () => {
      expect(formatDate('2024-01-15', 'DD/MM/YYYY')).toBe('15/01/2024');
    });

    it('should handle timestamp input', () => {
      const timestamp = new Date('2024-01-15').getTime();
      expect(formatDate(timestamp, 'DD/MM/YYYY')).toBe('15/01/2024');
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid', 'DD/MM/YYYY')).toThrow('Invalid date');
    });

    it('should use default format when not specified', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with symbol', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('should format currency without symbol', () => {
      expect(formatCurrency(1234.56, { showSymbol: false })).toBe('1.234,56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1234567.89)).toBe('R$ 1.234.567,89');
    });

    it('should respect custom decimals', () => {
      expect(formatCurrency(1234.5678, { decimals: 3 })).toBe('R$ 1.234,568');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('R$ -1.234,56');
    });
  });

  describe('formatPhone', () => {
    it('should format 11-digit mobile phone', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('should format 10-digit landline phone', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('should handle already formatted phone', () => {
      expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
    });

    it('should return original for invalid length', () => {
      expect(formatPhone('123')).toBe('123');
    });

    it('should remove non-digit characters before formatting', () => {
      expect(formatPhone('11-98765-4321')).toBe('(11) 98765-4321');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('should handle already formatted CPF', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should return original for invalid length', () => {
      expect(formatCPF('123')).toBe('123');
    });

    it('should remove non-digit characters before formatting', () => {
      expect(formatCPF('123-456-789-01')).toBe('123.456.789-01');
    });
  });

  describe('formatCNPJ', () => {
    it('should format CNPJ', () => {
      expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('should handle already formatted CNPJ', () => {
      expect(formatCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95');
    });

    it('should return original for invalid length', () => {
      expect(formatCNPJ('123')).toBe('123');
    });

    it('should remove non-digit characters before formatting', () => {
      expect(formatCNPJ('12-345-678-0001-95')).toBe('12.345.678/0001-95');
    });
  });
});
