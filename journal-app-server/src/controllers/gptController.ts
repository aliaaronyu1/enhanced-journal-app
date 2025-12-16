import { Request, Response } from "express";
import { openai, SYSTEM_PROMPT } from "../lib/openai"

export const callGPT = async (req: Request, res: Response) => {
    const { entry, mood } = await req.body;

    const response = await openai.responses.create({
        model: "gpt-5-mini",
        input: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: `
                Mood (optional): ${mood ?? "not provided"}

                Journal entry:
                ${entry}
                `
            }
        ]
    });
    res.status(200).json({
        guidance: response.output_text
    })

}