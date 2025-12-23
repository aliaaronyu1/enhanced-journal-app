// services/journalService.ts
import { pool } from "../db";

export const getAllJournalsForUser = async (userId: string) => {
  const result = await pool.query(
    `SELECT id, title, body, created_at 
     FROM journal_entries 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getEntryById = async (userId: string, entryId: string) => {
  const result = await pool.query(
    `SELECT * FROM journal_entries 
    WHERE user_id = $1 AND id = $2`,
    [userId, entryId]
  );
  return result.rows[0];
};

export const createEntry = async (user_id: string, title: string, body: string) => {
  const result = await pool.query(
    `INSERT INTO journal_entries (user_id, title, body)
     VALUES ($1, $2, $3)
     RETURNING *;`, 
     [user_id, title, body]
  )
  
  return result.rows[0];
}
export const updateEntryById = async (userId: string, entryId: string, title: string, body: string) => {
  const result = await pool.query(
    `UPDATE journal_entries
    SET title = $1, body = $2, updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING *`, [title, body, entryId, userId]
  )

  return result.rows[0];
}

export const deleteEntryById = async (userId: string, entryId: string) => {
  const result = await pool.query(
    `DELETE FROM journal_entries 
    WHERE user_id = $1 AND id = $2
    RETURNING *`,
    [userId, entryId]
  );
  return result.rows[0];
};