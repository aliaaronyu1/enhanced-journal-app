import { Router } from "express";
import { CreateJournalEntry, deleteJournalEntryById, getAllJournalEntriesForUser, getJournalEntryById, updateJournalEntryById } from "../controllers/journalController";

const router = Router({ mergeParams: true });

router.get("/", getAllJournalEntriesForUser);
router.get("/journal-entry/:entry_id", getJournalEntryById);
router.post("/", CreateJournalEntry);
router.put("/journal-entry/:entry_id", updateJournalEntryById);
router.delete("/journal-entry/:entry_id", deleteJournalEntryById);
export default router;