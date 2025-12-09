import { Pool } from "pg";

export const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "journal_app",
  password: "your_db_password",
  port: 5432,
});