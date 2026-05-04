/**
 * Anthropic integration — Claude API for the Sandbox AI Assistant.
 *
 * STATUS: Stub. Mock mode streams a friendly canned response.
 *
 * To go live: `npm install @anthropic-ai/sdk`, set ANTHROPIC_API_KEY, and
 * replace `stream` with a real client.messages.stream() call.
 */

const MOCK = !process.env.ANTHROPIC_API_KEY;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type StreamInput = {
  systemPrompt?: string;
  messages: ChatMessage[];
  /** Snippet of the student's current code to include as context. */
  studentCode?: string;
  model?: string;
  maxTokens?: number;
};

export const anthropic = {
  isMock: MOCK,
  defaultModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",

  /** Returns an async iterable of text chunks. */
  async *stream(input: StreamInput): AsyncIterable<string> {
    if (MOCK) {
      const chunks = [
        "I can help you with that. ",
        "Looking at your code, I notice ",
        "you might want to think about ",
        "how the agent's tool definitions ",
        "are structured. ",
        "Let me know if you'd like a worked example.",
      ];
      for (const c of chunks) {
        await new Promise((r) => setTimeout(r, 80));
        yield c;
      }
      return;
    }

    // TODO: Real Anthropic implementation
    // const stream = client.messages.stream({...});
    // for await (const event of stream) yield event.delta.text;
    throw new Error("Anthropic SDK not implemented yet.");
  },
};
