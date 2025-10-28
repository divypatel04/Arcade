/**
 * Validate Riot ID format (GameName#TAG)
 */
export const validateRiotId = (riotId: string): boolean => {
  // Riot ID format: GameName#TAG
  // GameName: 3-16 characters
  // TAG: usually 3-5 characters/numbers
  const riotIdRegex = /^.{3,16}#.{3,5}$/;
  return riotIdRegex.test(riotId);
};

/**
 * Parse Riot ID into GameName and TagLine
 */
export const parseRiotId = (riotId: string): { gameName: string; tagLine: string } | null => {
  const parts = riotId.split('#');
  if (parts.length !== 2) return null;
  
  const [gameName, tagLine] = parts;
  if (gameName.length < 3 || gameName.length > 16) return null;
  if (tagLine.length < 3 || tagLine.length > 5) return null;
  
  return { gameName, tagLine };
};

/**
 * Validate PUUID format
 */
export const validatePuuid = (puuid: string): boolean => {
  // PUUID is a UUID-like string with hyphens
  const puuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return puuidRegex.test(puuid);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate number is within range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate string length
 */
export const validateStringLength = (
  str: string,
  min: number,
  max: number
): boolean => {
  return str.length >= min && str.length <= max;
};

/**
 * Validate username (alphanumeric, underscore, hyphen)
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  return usernameRegex.test(username);
};

/**
 * Validate phone number (basic US format)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate date is not in the future
 */
export const validateDateNotFuture = (date: Date | string): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate <= new Date();
};

/**
 * Validate date is within range
 */
export const validateDateRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const target = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return target >= start && target <= end;
};

/**
 * Validate JSON string
 */
export const validateJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate hex color code
 */
export const validateHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Validate required field is not empty
 */
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Validate array contains specific values
 */
export const validateArrayContains = <T>(
  array: T[],
  values: T[]
): boolean => {
  return values.every(value => array.includes(value));
};

/**
 * Validate object has required properties
 */
export const validateObjectProperties = (
  obj: Record<string, any>,
  requiredProps: string[]
): boolean => {
  return requiredProps.every(prop => prop in obj);
};
