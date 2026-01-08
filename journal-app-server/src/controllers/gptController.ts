import { Request, Response } from "express";
import { openai, SYSTEM_PROMPT } from "../lib/openai"
import { createMessageService, getMessageHistoryService, getOrCreateConversationService } from "../services/conversationServices";
import { getEntryById } from "../services/journalServices";

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
    const { user_id, entry_id } = req.params;
    const { role, content } = req.body;
    
    //call our service that will either create a conversation or return the existing one depending on if it was created or not
    const conversation = await getOrCreateConversationService(entry_id)
    
    //get existing conversation messages
    const history = await getMessageHistoryService(conversation.id)

    //if there are no messages yet, flag that this is the first message
    let isFirstMessage = history.length === 0;

    //Create the message in journal_ai_messages
    const userMessage = await createMessageService(role, content, conversation.id)

    //Prepare AI context
    let messagesForAI = [
        { role: "system", content: SYSTEM_PROMPT }
    ];

    if (isFirstMessage) {
        const journalEntry = await getEntryById(user_id, entry_id)
        messagesForAI.push({
            role: "user",
            content: `Here is my journal entry: "${journalEntry.body}"`
        });
    } else {
        // Standard flow: add history + new message
        const formattedHistory = history.map(m => ({ role: m.role, content: m.content }));
        messagesForAI = [...messagesForAI, ...formattedHistory, { role, content }];
    }


    const aiResponse = await openai.responses.create({
        model: "gpt-5-mini",
        input: messagesForAI as any
    });
    
    // aiResponse.output_text <-- create a message in DB for this
    const aiMessage = await createMessageService('system', aiResponse.output_text, conversation.id)

    res.status(200).json({
        userMessage,
        aiResponse
    })
}

//getMessages
export const getMessages = async (req: Request, res: Response) => {
    const { entry_id } = req.params;
    //parameters: entryId
    const conversation = await getOrCreateConversationService(entry_id)

    //parameters: conversationId
    //get all messages with that conversation id
    //get existing conversation messages
    const history = await getMessageHistoryService(conversation.id)

    res.status(200).json(history)
}

//deleteConversation <-- if they delete the entry or just delete the conversation all together and want to start over



//deleteMessages <-- Will this ever happen?

//updateMessage <-- do I want to support this?

//updateConversation <-- don't think we need to do this