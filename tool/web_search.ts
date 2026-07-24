import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
const webSearchTool: ToolDefinition = {
  name: "",
  label: "",
  description: "",
  promptSnippet: "",
  parameters: {

  },
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    return {
      content: [],
      details: {}
    };
  }

}
export default webSearchTool;
