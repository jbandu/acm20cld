/**
 * Ollama Integration
 *
 * Integrates with local Ollama server for running open-source LLMs
 * Supports models like Llama 2, Mistral, Mixtral, Code Llama, etc.
 *
 * Setup: Install Ollama and run `ollama run llama2` or your preferred model
 * Docs: https://ollama.ai
 */

export interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

const DEFAULT_MODEL = "llama2";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

/**
 * Check if Ollama is available
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return response.ok;
  } catch (error) {
    console.warn("Ollama not available:", error);
    return false;
  }
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(): Promise<OllamaModelInfo[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Error listing Ollama models:", error);
    return [];
  }
}

/**
 * Query Ollama with a prompt
 */
export async function queryOllama(
  request: OllamaRequest
): Promise<OllamaResponse> {
  const model = request.model || process.env.OLLAMA_MODEL || DEFAULT_MODEL;

  // Check if Ollama is available
  if (!(await isOllamaAvailable())) {
    throw new Error(
      "Ollama is not available. Please ensure Ollama is running at " +
        OLLAMA_BASE_URL
    );
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: request.prompt,
        system: request.system,
        stream: false, // We don't support streaming for now
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.max_tokens || 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ollama API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    return {
      model: data.model,
      created_at: data.created_at,
      response: data.response,
      done: data.done,
      context: data.context,
      total_duration: data.total_duration,
      load_duration: data.load_duration,
      prompt_eval_count: data.prompt_eval_count,
      eval_count: data.eval_count,
      eval_duration: data.eval_duration,
    };
  } catch (error: any) {
    console.error("Ollama query error:", error);
    throw new Error(`Failed to query Ollama: ${error.message}`);
  }
}

/**
 * Analyze research with Ollama
 */
export async function analyzeWithOllama(
  query: string,
  context: string[],
  model?: string
): Promise<string> {
  const systemPrompt = `You are an AI research assistant analyzing academic research data.
Provide comprehensive, accurate analysis with citations and insights.`;

  const prompt = `Research Query: ${query}

Context from multiple sources:
${context.map((c, i) => `[Source ${i + 1}]: ${c}`).join("\n\n")}

Please provide:
1. A comprehensive summary of the findings
2. Key insights and patterns across sources
3. Potential research directions
4. Notable contradictions or gaps in the data`;

  const response = await queryOllama({
    model: model || DEFAULT_MODEL,
    prompt,
    system: systemPrompt,
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.response;
}

/**
 * Pull/download a model from Ollama library
 */
export async function pullOllamaModel(modelName: string): Promise<void> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: modelName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model: ${response.statusText}`);
    }

    console.log(`Ollama model ${modelName} pulled successfully`);
  } catch (error) {
    console.error("Error pulling Ollama model:", error);
    throw error;
  }
}

/**
 * Get information about a specific model
 */
export async function getOllamaModelInfo(
  modelName: string
): Promise<any> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/show`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: modelName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Model not found: ${modelName}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Ollama model info:", error);
    throw error;
  }
}
