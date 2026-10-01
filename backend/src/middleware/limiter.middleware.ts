import { rateLimit } from "express-rate-limit";
import config from "../config";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  skip: () => config.nodeEnv === "test",
});

export default limiter;
