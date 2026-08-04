import { MockAIProvider } from "@/lib/ai/mock-provider";
import { OpenAICompatibleProvider } from "@/lib/ai/openai-compatible-provider";
import type { AIProvider } from "@/lib/ai/types";

export function createAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";

  if (provider === "mock" || !apiKey || !model) {
    return new MockAIProvider();
  }

  if (provider === "openai" || provider === "openai_compatible") {
    return new OpenAICompatibleProvider({ apiKey, model, baseUrl });
  }

  // Unknown provider names fall back to mock so the app never crashes.
  return new MockAIProvider();
}

export function getActiveAIProviderName() {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (provider === "mock" || !apiKey || !model) {
    return "mock";
  }
  return provider;
}
