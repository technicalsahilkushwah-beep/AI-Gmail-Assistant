
import { generateText, Output, tool } from "ai";
import { ollama } from "ollama-ai-provider-v2"
import { z } from "zod";

const emailDraftSchema = z.object({
  to: z.string().describe(
    "Recipient email address, or empty if unknown.",
  ),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const generateEmailDraft = tool({
  description:
    "Generate a structured email draft when the user asks to write, compose, or rewrite an email.",

  inputSchema: z.object({
    instruction: z.string().min(1).max(5000),
    recipientEmail: z.string().email().optional(),
  }),

  execute: async ({ instruction, recipientEmail }) => {
    const result = await generateText({
      model: ollama("lukaspetrik/gemma3-tools:4b"),
      output: Output.object({
        schema: emailDraftSchema,
      }),
      system: `
        You are a professional email writing assistant.
        Generate a suitable subject and complete email body.
        Never invent an email address.
        Use the supplied recipient address if provided.
        Do not send emails.
      `,
      prompt: `
        User instruction: ${instruction}
        Recipient email: ${recipientEmail ?? "Not provided"}
      `,
    });

    return {
      type: "email_draft" as const,
      ...result.output,
      to: recipientEmail ?? result.output.to,
      status: "draft" as const,
    };
  },
});
