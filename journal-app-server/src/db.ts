import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "local_journal_DB",
  password: "ilovepizza",
  port: 5432,
});