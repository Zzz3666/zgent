import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import volcengineAgentPlanProvider from "../provider/volcengine-agent-plan";
import webSearchTool from "../tool/web_search";

export default function (pi: ExtensionAPI) {
  try {
  // Enable LLM Provider
    pi.registerProvider("volcengine-agent-plan", volcengineAgentPlanProvider);
  } catch (error) {
    console.error("[zgent] Failed to register volcengine-agent-plan provider:", error);
    throw error;
  }
/*
  try {
  // Enable Web Search
    pi.registerTool(webSearchTool);
  } catch (error) {
    console.error("[zgent] Failed to register tool:", error);
    throw error;
  }
*/
}
