// Vitest test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'super_secret_test_jwt_key_at_least_32_chars_long!';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
process.env.CASHFREE_ENV = 'TEST';
process.env.CASHFREE_APP_ID = 'test_app_id';
process.env.CASHFREE_SECRET_KEY = 'test_secret_key';
