import { Request, Response } from "express";
import { getJournalsByUserId } from "../services/journalServices";

export const getAllJournalsEntriesForUser = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const userIdNum = parseInt(user_id, 10);
    if (isNaN(userIdNum)) return res.status(400).json({ msg: "Invalid user id" });

    if (!user_id) return res.status(400).json({ msg: "Missing user id" });

    try {
        const journals = await getJournalsByUserId(user_id);

        res.status(200).json(journals); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error while retrieving journals entries for user" });
    }
}