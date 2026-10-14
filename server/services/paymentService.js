/**
 * Payment Service
 * Encapsulates Cashfree API interactions, signature verification, and payload creation
 */
import crypto from 'crypto';

export class PaymentService {
  /**
   * Verify Cashfree webhook signature using crypto.timingSafeEqual
   */
  static verifyCashfreeWebhookSignature(rawBody, timestamp, signature, secretKey) {
    if (!rawBody || !timestamp || !signature || !secretKey) {
      return false;
    }

    const payload = `${timestamp}${rawBody.toString('utf8')}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('base64');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }

  /**
   * Check if a timestamp is within the allowable replay window (e.g., 5 minutes)
   */
  static isTimestampValid(timestamp, maxAgeMinutes = 5) {
    if (!timestamp) return false;
    const reqTime = parseInt(timestamp, 10);
    if (isNaN(reqTime)) return false;

    const currentTimeSeconds = Math.floor(Date.now() / 1000);
    const timeDiffSeconds = Math.abs(currentTimeSeconds - reqTime);

    return timeDiffSeconds <= maxAgeMinutes * 60;
  }
}

export default PaymentService;
