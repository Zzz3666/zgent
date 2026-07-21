import type { ProviderConfig } from "@earendil-works/pi-coding-agent";

const volcengineAgentPlanProvider: ProviderConfig = {
  name: "Volcengine Agent Plan",
  baseUrl: "https://ark.cn-beijing.volces.com/api/plan/v3",
  apiKey: "$VOLCENGINE_API_KEY",
  api: "openai-responses",
  models: [
    {
      id: "doubao-seed-2.0-mini",
      name: "doubao-seed-2.0-mini",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 0.25, output: 0.25, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "doubao-seed-2.0-lite",
      name: "doubao-seed-2.0-lite",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 0.5, output: 0.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "deepseek-v4-flash",
      name: "deepseek-v4-flash",
      reasoning: true,
      input: ["text"],
      cost: { input: 0.5, output: 0.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 1024000,
      maxTokens: 384000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "doubao-seed-evolving",
      name: "doubao-seed-evolving",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 2.5, output: 2.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 1024000,
      maxTokens: 256000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "doubao-seed-2.0-code",
      name: "doubao-seed-2.0-code",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 2.5, output: 2.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "doubao-seed-2.0-pro",
      name: "doubao-seed-2.0-pro",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 2.5, output: 2.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "minimax-m2.7",
      name: "minimax-m2.7",
      reasoning: true,
      input: ["text"],
      cost: { input: 2.5, output: 2.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 200000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "minimax-m3",
      name: "minimax-m3",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 2.5, output: 2.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 512000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "glm-5.2",
      name: "glm-5.2",
      reasoning: true,
      input: ["text"],
      cost: { input: 4.5, output: 4.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 1024000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "kimi-k2.6",
      name: "kimi-k2.6",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 4.5, output: 4.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 32000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "kimi-k2.7-code",
      name: "kimi-k2.7-code",
      input: ["text", "image"],
      api: "openai-completions",
      reasoning: false,
      cost: { input: 4.5, output: 4.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 256000,
      maxTokens: 32000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "deepseek-v4-pro",
      name: "deepseek-v4-pro",
      reasoning: true,
      input: ["text"],
      cost: { input: 5.5, output: 5.5, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 1024000,
      maxTokens: 384000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
    {
      id: "kimi-k3",
      name: "kimi-k3",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 6.7, output: 6.7, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 1024000,
      maxTokens: 128000,
      compat: {
        supportsDeveloperRole: true,
      },
    },
  ],
};

export default volcengineAgentPlanProvider;
