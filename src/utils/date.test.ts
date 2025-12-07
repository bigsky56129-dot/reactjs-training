import { formatISODate, nowISO } from './date';

describe('Date Utilities', () => {
  describe('formatISODate', () => {
    it('should format ISO date string correctly', () => {
      const formatted = formatISODate('2024-01-15T10:30:00Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle null', () => {
      const formatted = formatISODate(null);
      expect(formatted).toBe('');
    });

    it('should handle undefined', () => {
      const formatted = formatISODate();
      expect(formatted).toBe('');
    });

    it('should handle invalid date string', () => {
      const invalid = 'not-a-date';
      const formatted = formatISODate(invalid);
      // new Date('not-a-date') creates an Invalid Date, which toLocaleDateString() converts to 'Invalid Date'
      expect(formatted).toBe('Invalid Date');
    });

    it('should handle empty string', () => {
      const formatted = formatISODate('');
      expect(formatted).toBe('');
    });
  });

  describe('nowISO', () => {
    it('should return ISO format string', () => {
      const result = nowISO();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return valid date', () => {
      const result = nowISO();
      const date = new Date(result);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should return current time', () => {
      const before = Date.now();
      const result = nowISO();
      const after = Date.now();
      const resultTime = new Date(result).getTime();
      
      expect(resultTime).toBeGreaterThanOrEqual(before);
      expect(resultTime).toBeLessThanOrEqual(after);
    });
  });
});
