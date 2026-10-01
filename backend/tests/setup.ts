process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.SALT_ROUNDS = "4";
process.env.JWT_SECRET = "unit-test-secret";
process.env.JWT_EXPIRATION_TIME = "1h";
process.env.FRONTEND_URL = "http://localhost:5173";
