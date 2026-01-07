import { Router } from "express";
import { callGPT, createMessage, getMessages } from "../controllers/gptController";

const router = Router({ mergeParams: true });

router.post("/test-call", callGPT);

//User sends a message to AI: Either submitting an entry or just asking AI something
router.post("/ai-conversations/:entry_id", createMessage)

//get messages for the conversation in that entry
router.get("/ai-conversations/:entry_id", getMessages)
export default router;