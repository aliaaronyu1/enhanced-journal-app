export interface JournalConversation {
    id: string;
    journal_entry_id: string;
    created_at: Date;
    updated_at: Date;
    summary: string;
}

export interface JournalMessage {
    id: string;
    conversation_id: string;
    role: 'user' | 'ai';
    content: string;
    created_at: Date;
}
