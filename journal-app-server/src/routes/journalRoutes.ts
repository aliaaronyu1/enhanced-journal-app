import { Router } from "express";
import { deleteJournalEntryById, getAllJournalEntriesForUser, getJournalEntryById, updateJournalEntryById } from "../controllers/journalController";

const router = Router({ mergeParams: true });

router.get("/", getAllJournalEntriesForUser);
router.get("/journal-entry/:entry_id", getJournalEntryById)
router.put("/journal-entry/:entry_id", updateJournalEntryById)
router.delete("/journal-entry/:entry_id", deleteJournalEntryById)
export default router;