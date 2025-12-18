import { Request, Response } from "express";
import { getAllJournalsForUser, getEntryById, updateEntryById, deleteEntryById, createEntry } from "../services/journalServices";

export const getAllJournalEntriesForUser = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const userIdNum = parseInt(user_id, 10);
    if (isNaN(userIdNum)) return res.status(400).json({ msg: "Invalid user id" });

    if (!user_id) return res.status(400).json({ msg: "Missing user id" });

    try {
        const journals = await getAllJournalsForUser(user_id);

        res.status(200).json(journals); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while retrieving journals entries for user" });
    }
}

export const getJournalEntryById = async (req: Request, res: Response) => {
    const { user_id, entry_id } = req.params;
    if (!user_id || !entry_id) return res.status(400).json({ msg: "Missing user id or entry id" });

    try {
        const entry = await getEntryById(user_id, entry_id);

        res.status(200).json(entry); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while retrieving journal entry for user" });
    }
}

export const CreateJournalEntry = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { title, body } = req.body;
    if (!user_id) return res.status(400).json({ msg: "missing user id" });
    if (!title && !body) return res.status(400).json({ msg: "Missing title and body" });

    try {
        const createdEntry = await createEntry(user_id, title, body);

        res.status(200).json(createdEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while creating journal entry for user" });
    }
}

export const updateJournalEntryById = async (req: Request, res: Response) => {
    const { user_id, entry_id } = req.params;
    const { title, body } = req.body;
    if (!user_id || !entry_id) return res.status(400).json({ msg: "missing user or entry id" });
    if (!title && !body) return res.status(400).json({ msg: "Missing title and body" });
    
    try {
        const entry = await updateEntryById(user_id, entry_id, title, body);

        res.status(200).json(entry); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while updating journal entry for user" });
    }
}

export const deleteJournalEntryById = async (req: Request, res: Response) => {
    const { user_id, entry_id } = req.params;
    if (!user_id || !entry_id) return res.status(400).json({ msg: "Missing user id or entry id" });

    try {
        const deleteEntry = await deleteEntryById(user_id, entry_id);

        res.status(200).json(deleteEntry); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while deleting journals entries for user" });
    }
}