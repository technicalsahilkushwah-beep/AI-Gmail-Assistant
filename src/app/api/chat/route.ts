import { generateEmailDraft } from "@/tools/Genrate.email";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ollama } from "ollama-ai-provider-v2";

import {
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { NextRequest } from "next/server";
import { saveChat } from "@/lib/chat";

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      id,
      apiKey,
    }: { messages: UIMessage[]; id: string; apiKey: string } = await req.json();

    const model = apiKey?.trim()
      ? createGoogleGenerativeAI({
          apiKey: apiKey.trim(),
        })("gemini-3.6-flash")
      : ollama("lukaspetrik/gemma3-tools:4b");

    const result = streamText({
      model,
      system: `
       You are an AI Gmail Assistant.

        For normal questions, respond conversationally.
        When the user asks to write or rewrite an email,
        use the generateEmailDraft tool.

        Never claim that an email has been sent.
        Email generation creates drafts only.
      `,
      messages: await convertToModelMessages(messages),

      tools: {
        generateEmailDraft,
      },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,

      generateMessageId: createIdGenerator({
        prefix: "ai",
        size: 16,
      }),

      onFinish: async ({ messages }) => {
        await saveChat(id, messages);
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Unable to process the chat request." },
      { status: 500 },
    );
  }
}
