/**
 * Validate required environment variables at server startup.
 * Called only when running the server directly (index.js entrypoint).
 */
export function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];

  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  } else if (isProduction && process.env.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters in production.');
  }

  // Database credentials (required in production)
  if (isProduction) {
    const requiredInProd = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    for (const key of requiredInProd) {
      if (!process.env[key]) missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
  }
}
