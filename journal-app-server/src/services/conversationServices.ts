// services/conversationServices.ts
import { pool } from "../db";
import { JournalConversation, JournalMessage } from "../types/types"

export const getOrCreateConversationService = async (entry_id: string): Promise<JournalConversation> => {
    // This query attempts to insert, but if the entry_id already exists, 
    // it simply does nothing and returns the existing row.
    const query = `
        INSERT INTO journal_ai_conversations (journal_entry_id)
        VALUES ($1)
        ON CONFLICT (journal_entry_id) 
        DO UPDATE SET journal_entry_id = EXCLUDED.journal_entry_id
        RETURNING *;
    `;
    
    const result = await pool.query(query, [entry_id]);
    return result.rows[0];
};

export const createMessageService = async (role: string, content: string, conversation_id: string): Promise<JournalMessage> => {
    const result = await pool.query(
        `
        INSERT INTO journal_ai_messages (conversation_id, role, content)
        VALUES($1, $2, $3)
        RETURNING *;
        `,
        [conversation_id, role, content]
    )
    return result.rows[0];
}