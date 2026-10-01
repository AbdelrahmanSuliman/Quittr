import ConfigSchema from "../schema/config.schema.js";

export const config = ConfigSchema.parse({
  port: process.env.PORT,
  database: {
    url: process.env.DATABASE_URL,
  },
  saltRounds: process.env.SALT_ROUNDS,
  jwt: {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    secretKey: process.env.JWT_SECRET,
  },
  nodeEnv: process.env.NODE_ENV,
});

export default config;
