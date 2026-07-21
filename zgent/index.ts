import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import volcengineAgentPlanProvider from '../provider/volcengine_agent_plan';

export default function (pi: ExtensionAPI) {
  // Enable LLM Provider
  pi.registerProvider("volcengine-agent", volcengineAgentPlanProvider);
}
