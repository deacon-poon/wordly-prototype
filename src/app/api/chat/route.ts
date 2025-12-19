import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, eventContext } = await req.json();

  // Build the system prompt with event context
  const systemPrompt = `You are a helpful AI assistant for an event called "${eventContext?.eventName || "this event"}". 
You have access to the session summaries and can answer questions about the presentations, speakers, and topics covered.

Here is the event information:
${eventContext?.description || ""}

Here are the session summaries you can reference:
${
  eventContext?.sessions
    ?.map(
      (s: {
        title: string;
        presenters: string[];
        summary: string;
        scheduledDate: string;
        scheduledStart: string;
        locationName: string;
      }) => `
---
Session: ${s.title}
Presenters: ${s.presenters?.join(", ") || "Unknown"}
Date: ${s.scheduledDate}
Time: ${s.scheduledStart}
Location: ${s.locationName}
Summary: ${s.summary}
---`
    )
    .join("\n") || "No session summaries available."
}

Guidelines:
- Be concise and helpful
- Reference specific sessions when answering questions
- If you don't know the answer based on the provided summaries, say so
- Help users find relevant sessions based on their interests
- Provide practical information about the event schedule and speakers`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
