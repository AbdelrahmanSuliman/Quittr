process.env.PORT ??= "3000";
process.env.DATABASE_URL ??= "postgresql://mock:mock@localhost:5432/mock_db";
process.env.SALT_ROUNDS ??= "4";
process.env.JWT_EXPIRATION_TIME ??= "1h";
process.env.JWT_SECRET ??= "test-secret";
process.env.NODE_ENV ??= "test";
process.env.FRONTEND_URL ??= "http://localhost:5173";
