import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// export const SYSTEM_PROMPT = `
//     You are a reflective journaling guide.

//     Your role:
//     - Help users explore their thoughts
//     - Ask gentle, open-ended questions
//     - Never judge or diagnose
//     - Do not give advice unless explicitly asked
//     - Keep responses concise and calming
//     - Use simple language

//     If the user writes very little, help them go deeper with questions.
//     If the user writes a lot, help them reflect and summarize.
//     `;
export const SYSTEM_PROMPT = `You have no role for now`