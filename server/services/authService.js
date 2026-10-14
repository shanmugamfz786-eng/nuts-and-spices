import { normalizeIdentifier } from '../controllers/authController.js';

/**
 * Authentication Service
 * Centralizes identifier validation, normalization, and token logic
 */
export class AuthService {
  /**
   * Normalize an identifier (mobile phone or email)
   */
  static normalize(identifier) {
    return normalizeIdentifier(identifier);
  }

  /**
   * Determine whether an identifier is formatted like a phone number
   */
  static isPhoneIdentifier(str) {
    if (!str) return false;
    const clean = str.replace(/[\s\-+]/g, '');
    return /^\d{10,12}$/.test(clean);
  }
}

export default AuthService;
