# zgent

A [Pi](https://github.com/earendil-works/pi-coding-agent) extension that registers the **Volcengine Ark Agent Plan** provider, exposing a collection of reasoning and chat models hosted on 火山引擎 (Volcengine).

## Requirements

- Pi Coding Agent (`@earendil-works/pi-coding-agent`)
- Node.js >= 20
- A Volcengine Ark API key with access to the Agent Plan endpoint

## Installation

1. Clone or copy this repository into your Pi extensions directory (or load it via `pi.extensions` in `package.json`).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your API key as an environment variable:

   ```bash
   export VOLCENGINE_API_KEY="your-api-key"
   ```

4. Build the extension:

   ```bash
   npm run build
   ```

## Usage

After Pi loads the extension, the following models become available under the `volcengine-agent` provider:

| Model ID | API | Context Window | Max Tokens | Input |
| --- | --- | --- | --- | --- |
| `doubao-seed-2.0-mini` | `openai-responses` | 256K | 128K | text, image |
| `doubao-seed-2.0-lite` | `openai-responses` | 256K | 128K | text, image |
| `deepseek-v4-flash` | `openai-responses` | 1M | 384K | text |
| `doubao-seed-evolving` | `openai-responses` | 1M | 256K | text, image |
| `doubao-seed-2.0-code` | `openai-responses` | 256K | 128K | text, image |
| `doubao-seed-2.0-pro` | `openai-responses` | 256K | 128K | text, image |
| `minimax-m2.7` | `openai-responses` | 200K | 128K | text |
| `minimax-m3` | `openai-responses` | 512K | 128K | text, image |
| `glm-5.2` | `openai-responses` | 1M | 128K | text |
| `kimi-k2.6` | `openai-responses` | 256K | 32K | text, image |
| `kimi-k2.7-code` | `openai-completions` | 256K | 32K | text, image |
| `deepseek-v4-pro` | `openai-responses` | 1M | 384K | text |
| `kimi-k3` | `openai-responses` | 1M | 128K | text, image |

> **Note:** `kimi-k2.7-code` uses the `openai-completions` API instead of `openai-responses`.

## Development

```bash
# Type-check only
npm run check

# Build once
npm run build

# Watch mode
npm run dev
```

## Configuration

The provider is configured in `provider/volcengine_agent_plan.ts`. Update the model list, pricing, or API endpoint there if Volcengine changes its catalog.

## License

[MIT](LICENSE)
