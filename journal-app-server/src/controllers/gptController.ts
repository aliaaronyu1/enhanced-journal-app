import { Request, Response } from "express";
import { openai, SYSTEM_PROMPT } from "../lib/openai"
import { createMessageService, getMessageHistoryService, getOrCreateConversationService, getLatestEntrySnapshotService, createEntrySnapshotService } from "../services/conversationServices";

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

export const createMessage = async (req: Request, res: Response) => {
    const { entry_id } = req.params;
    const { content } = req.body;
    try {
        //call our service that will either create a conversation or return the existing one depending on if it was created or not
        const conversation = await getOrCreateConversationService(entry_id)

        //Create the message in journal_ai_messages
        const userMessage = await createMessageService("user", content, conversation.id)

        //get existing conversation messages
        const history = await getMessageHistoryService(conversation.id)
        const latestEntry = await getLatestEntrySnapshotService(conversation.id);


        //Prepare AI context
        let messagesForAI = [
            { role: "system", content: SYSTEM_PROMPT },
            latestEntry && {
                role: "user",
                content: `Journal entry:\n${latestEntry.entry_body}`,
            },
            ...history.map(m => ({
                role: m.role,
                content: m.content,
            })),
        ].filter(Boolean);

        console.log("creating response from AI")
        const aiResponse = await openai.responses.create({
            model: "gpt-5-mini",
            input: messagesForAI as any
        });
        console.log("AI response created", aiResponse)

        const aiMessage = await createMessageService('assistant', aiResponse.output_text, conversation.id)

        res.status(200).json(aiMessage)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat failed" });
    }
}


//getMessages
export const getMessages = async (req: Request, res: Response) => {
    const { user_id, entry_id } = req.params;

    try {
        const conversation = await getOrCreateConversationService(entry_id)

        let messages = await getMessageHistoryService(conversation.id)

        res.status(200).json({
            conversationId: conversation.id,
            messages,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load conversation" });
    }

}

export const submitEntry = async (req: Request, res: Response) => {
    const { userId, entry_id } = req.params;
    const { entryBody } = req.body;

    try {
      const conversation = await getOrCreateConversationService(entry_id);

      // Snapshot the entry
      await createEntrySnapshotService(
        conversation.id,
        entry_id,
        entryBody
      );

      const history = await getMessageHistoryService(conversation.id);

      const messagesForAI = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Journal entry:\n${entryBody}` },
        ...history.map(m => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const aiResponse = await openai.responses.create({
        model: "gpt-5-mini",
        input: messagesForAI as any,
      });

      const aiMessage = await createMessageService(
        "assistant",
        aiResponse.output_text,
        conversation.id
      );

      res.json(aiMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit entry" });
    }
  }
