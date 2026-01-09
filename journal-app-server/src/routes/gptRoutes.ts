import { Router } from "express";
import { callGPT, createMessage, getMessages, submitEntry } from "../controllers/gptController";

const router = Router({ mergeParams: true });

router.post("/test-call", callGPT);

//User sends a message to AI
router.post("/ai-conversations/:entry_id/message", createMessage)

//User submits entry to AI
router.post("/ai-conversations/:entry_id/submit-entry", submitEntry)

//get messages for the conversation in that entry
router.get("/ai-conversations/:entry_id", getMessages)
export default router;