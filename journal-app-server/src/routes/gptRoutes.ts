import { Router } from "express";
import { callGPT } from "../controllers/gptController";

const router = Router();

router.post("/test-call", callGPT);

export default router;