import { Router } from "express";
import { getAllJournalsEntriesForUser } from "../controllers/journalController";

const router = Router();

router.get("/:user_id", getAllJournalsEntriesForUser);

export default router;