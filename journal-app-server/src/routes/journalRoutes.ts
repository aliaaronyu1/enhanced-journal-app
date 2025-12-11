import { Router } from "express";
import { getAllJournalEntriesForUser, getJournalEntryById, updateJournalEntryById } from "../controllers/journalController";

const router = Router({ mergeParams: true });

router.get("/", getAllJournalEntriesForUser);
router.get("/journal-entry/:entry_id", getJournalEntryById)
router.put("/journal-entry/:entry_id", updateJournalEntryById)
export default router;