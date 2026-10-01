import * as z from "zod";

const ConfigSchema = z.object({
  port: z.string().default("3000"),
  database: z.object({
    url: z.url(),
  }),
  saltRounds: z.string(),
  jwt: z.object({
    expiresIn: z.string(),
    secretKey: z.string(),
  }),
  nodeEnv: z.string(),
  frontendUrl: z.url()
});

export default ConfigSchema;
