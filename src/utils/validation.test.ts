import { isEmail, passwordIsValid, minLength } from './validation';

describe('Validation Utilities', () => {
  describe('isEmail', () => {
    it('should accept valid email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.uk')).toBe(true);
      expect(isEmail('first+last@test.io')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('')).toBe(false);
    });
  });

  describe('passwordIsValid', () => {
    it('should accept passwords with 6+ characters', () => {
      expect(passwordIsValid('123456')).toBe(true);
      expect(passwordIsValid('password')).toBe(true);
      expect(passwordIsValid('Test@1234567')).toBe(true);
    });

    it('should reject passwords that are too short', () => {
      expect(passwordIsValid('12345')).toBe(false);
      expect(passwordIsValid('pass')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(passwordIsValid('')).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should accept strings meeting minimum length', () => {
      expect(minLength('hello', 5)).toBe(true);
      expect(minLength('test', 3)).toBe(true);
      expect(minLength('password', 8)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(minLength('hi', 5)).toBe(false);
      expect(minLength('test', 10)).toBe(false);
    });

    it('should handle whitespace trimming', () => {
      expect(minLength('  hello  ', 5)).toBe(true);
      expect(minLength('   ', 5)).toBe(false);
    });
  });
});
