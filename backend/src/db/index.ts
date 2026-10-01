import { relations } from './schema';
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config/index";

const db = drizzle({connection: config.database.url, relations});

export default db