import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import volcengineAgentPlanProvider from "../provider/volcengine-agent-plan";

export default function (pi: ExtensionAPI) {
  try {
    // Enable LLM Provider
    pi.registerProvider("volcengine-agent-plan", volcengineAgentPlanProvider);
  } catch (error) {
    console.error("[zgent] Failed to register volcengine-agent-plan provider:", error);
    throw error;
  }
}
