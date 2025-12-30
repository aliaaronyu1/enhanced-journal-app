import { Router } from "express";
import { callGPT, createMessage } from "../controllers/gptController";

const router = Router();

router.post("/test-call", callGPT);

//User sends a message to AI: Either submitting an entry or just asking AI something
router.post("/:entry_id", createMessage)
export default router;