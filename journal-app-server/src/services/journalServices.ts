// services/journalService.ts
import { pool } from "../db";

export const getJournalsByUserId = async (userId: string) => {
  const result = await pool.query(
    "SELECT * FROM journal_entries WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};
