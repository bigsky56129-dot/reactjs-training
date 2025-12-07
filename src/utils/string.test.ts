import { truncate, toTitleCase, isEmpty } from './string';

describe('String Utilities', () => {
  describe('truncate', () => {
    it('should truncate long strings with default max', () => {
      const longString = 'a'.repeat(200);
      const result = truncate(longString);
      expect(result.length).toBeLessThan(longString.length);
      expect(result).toContain('…');
    });

    it('should truncate long strings with custom max', () => {
      expect(truncate('This is a long string', 10)).toBe('This is a…');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should handle exact length', () => {
      expect(truncate('Exact', 5)).toBe('Exact');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle already title cased strings', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });

    it('should handle all caps', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for whitespace only', () => {
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isEmpty()).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  hello  ')).toBe(false);
    });
  });
});
