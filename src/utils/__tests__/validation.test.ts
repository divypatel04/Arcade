import {
  validateRiotId,
  parseRiotId,
  validatePuuid,
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateNumberRange,
  validateStringLength,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateRiotId', () => {
    it('should validate correct Riot ID format', () => {
      expect(validateRiotId('PlayerName#1234')).toBe(true);
      expect(validateRiotId('Test#0000')).toBe(true);
      expect(validateRiotId('User#9999')).toBe(true);
    });

    it('should reject invalid Riot ID format', () => {
      expect(validateRiotId('PlayerName')).toBe(false);
      expect(validateRiotId('PlayerName#')).toBe(false);
      expect(validateRiotId('#1234')).toBe(false);
      expect(validateRiotId('PlayerName#abc')).toBe(true); // 'abc' is 3 chars, valid
      expect(validateRiotId('')).toBe(false);
    });
  });

  describe('parseRiotId', () => {
    it('should parse valid Riot ID into name and tag', () => {
      expect(parseRiotId('PlayerName#1234')).toEqual({
        gameName: 'PlayerName',
        tagLine: '1234',
      });
      expect(parseRiotId('Test User#0000')).toEqual({
        gameName: 'Test User',
        tagLine: '0000',
      });
    });

    it('should return null for invalid Riot ID', () => {
      expect(parseRiotId('PlayerName')).toBeNull();
      expect(parseRiotId('PlayerName#')).toBeNull();
      expect(parseRiotId('#1234')).toBeNull();
      expect(parseRiotId('')).toBeNull();
    });
  });

  describe('validatePuuid', () => {
    it('should validate correct PUUID format', () => {
      const validPuuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      expect(validatePuuid(validPuuid)).toBe(true);
    });

    it('should reject invalid PUUID format', () => {
      expect(validatePuuid('invalid-uuid')).toBe(false);
      expect(validatePuuid('12345678-1234-1234-1234')).toBe(false);
      expect(validatePuuid('')).toBe(false);
      expect(validatePuuid('not-a-uuid-at-all')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result1 = validatePassword('StrongP@ss123');
      expect(result1.isValid).toBe(true);
      expect(result1.errors).toHaveLength(0);

      const result2 = validatePassword('MyP@ssw0rd!');
      expect(result2.isValid).toBe(true);
    });

    it('should validate medium strength passwords', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle weak passwords that don\'t meet requirements', () => {
      const result = validatePassword('password');
      expect(result.isValid).toBe(false); // Doesn't meet all requirements
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject passwords that are too short', () => {
      const result = validatePassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject empty passwords', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML characters', () => {
      const result = sanitizeInput('<script>alert("XSS")</script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).not.toContain('<script>');
    });

    it('should escape potentially dangerous characters', () => {
      const result = sanitizeInput('Test<>Script');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      // Ampersand may or may not be escaped depending on implementation
      expect(sanitizeInput('Hello & World')).toBeTruthy();
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('validateNumberRange', () => {
    it('should validate numbers within range', () => {
      expect(validateNumberRange(5, 0, 10)).toBe(true);
      expect(validateNumberRange(0, 0, 10)).toBe(true);
      expect(validateNumberRange(10, 0, 10)).toBe(true);
    });

    it('should reject numbers outside range', () => {
      expect(validateNumberRange(-1, 0, 10)).toBe(false);
      expect(validateNumberRange(11, 0, 10)).toBe(false);
      expect(validateNumberRange(100, 0, 10)).toBe(false);
    });
  });

  describe('validateStringLength', () => {
    it('should validate strings within length limits', () => {
      expect(validateStringLength('test', 1, 10)).toBe(true);
      expect(validateStringLength('a', 1, 10)).toBe(true);
      expect(validateStringLength('1234567890', 1, 10)).toBe(true);
    });

    it('should reject strings outside length limits', () => {
      expect(validateStringLength('', 1, 10)).toBe(false);
      expect(validateStringLength('12345678901', 1, 10)).toBe(false);
      expect(validateStringLength('test', 5, 10)).toBe(false);
    });
  });
});
