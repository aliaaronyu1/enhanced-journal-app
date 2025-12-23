import { Request, Response } from "express";
import { openai, SYSTEM_PROMPT } from "../lib/openai"
import { createMessageService, getOrCreateConversationService } from "../services/conversationServices";

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
    const { role, content } = req.body;
    
    //call our service that will either create a conversation or return the existing one depending on if it was created or not
    const conversation = await getOrCreateConversationService(entry_id)

    //Create the message in journal_ai_messages
    const createdMessage = await createMessageService(role, content, conversation.id)

    //AI needs to respond to the message
    // const response = await openai.responses.create({
    //     model: "gpt-5-mini",
    //     input: [
    //         {
    //             role: "system",
    //             content: SYSTEM_PROMPT
    //         },
    //         {
    //             role: "user",
    //             content: `
    //             Journal entry:
    //             ${entry}
    //             `
    //         }
    //     ]
    // });

    res.status(200).json(createdMessage)
}

//getMessages
// export const getMessages = async (req: Request, res: Response) => {
    //parameters: entryId
    //check if conversation exists, if not return
    //if so, retrieve the conversation id

    //parameters: conversationId
    //get all messages with that conversation id

// }

//deleteConversation <-- if they delete the entry or just delete the conversation all together and want to start over



//deleteMessages <-- Will this ever happen?

//updateMessage <-- do I want to support this?

//updateConversation <-- don't think we need to do this