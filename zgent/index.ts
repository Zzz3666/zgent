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

  try {
  // Enable Web Search
    pi.registerTool(webSearchTool);
  } catch (error) {
    console.error("[zgent] Failed to register tool:", error);
    throw error;
  }

  // Inject the real current date into the system prompt so the model does not
  // anchor "latest" results to a stale/hardcoded year (e.g. 2025).
  // Use UTC to be timezone-stable; include weekday for clarity.
  pi.on("before_agent_start", async (event, _ctx) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr =
      `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}` +
      ` ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} UTC` +
      ` (${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getUTCDay()]})`;
    const dateBlock =
      `\n\n## Current Date\n` +
      `The current real date and time is ${dateStr}. ` +
      `Always use this date (not any year mentioned elsewhere or in training data) ` +
      `as "today" when constructing time-sensitive queries ` +
      `(e.g. web_search TimeRange date ranges, "latest", "this year", "recent").`;
    return {
      systemPrompt: event.systemPrompt + dateBlock,
    };
  });

}
