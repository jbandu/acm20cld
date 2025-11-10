import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface OpenAIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface OpenAIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function queryOpenAI(
  request: OpenAIRequest
): Promise<OpenAIResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: request.model || "gpt-4-turbo-preview",
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a research assistant for cancer biology researchers. Provide accurate, well-researched information.",
        },
        {
          role: "user",
          content: request.context
            ? `Context: ${request.context}\n\nQuery: ${request.prompt}`
            : request.prompt,
        },
      ],
    });

    const message = completion.choices[0]?.message;

    return {
      content: message?.content || "",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error("OpenAI embedding error:", error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("OpenAI embeddings error:", error);
    throw error;
  }
}

export { openai };
