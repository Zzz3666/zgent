# zgent

一个 [Pi](https://github.com/earendil-works/pi-coding-agent) 扩展，用于注册 **火山引擎 Agent Plan** 提供商，暴露一系列托管在火山引擎上的推理和聊天模型。

## 要求

- Pi Coding Agent（`@earendil-works/pi-coding-agent`）
- Node.js >= 20
- 一个具有 Agent Plan 端点访问权限的火山引擎 Ark API 密钥

## 安装

1. 将此仓库克隆或复制到你的 Pi 扩展目录中（或通过 `package.json` 中的 `pi.extensions` 加载）。
2. 安装依赖：

   ```bash
   npm install
   ```

3. 将你的 API 密钥设置为环境变量：

   ```bash
   export VOLCENGINE_API_KEY="your-api-key"
   ```

4. 构建扩展：

   ```bash
   npm run build
   ```

## 使用方式

Pi 加载该扩展后，以下模型将在 `volcengine-agent-plan` 提供商下可用：

| 模型 ID | API | 上下文窗口 | 最大 Token | 输入 |
| --- | --- | --- | --- | --- |
| `doubao-seed-2.0-mini` | `openai-responses` | 256K | 128K | 文本、图片 |
| `doubao-seed-2.0-lite` | `openai-responses` | 256K | 128K | 文本、图片 |
| `deepseek-v4-flash` | `openai-responses` | 1M | 384K | 文本 |
| `doubao-seed-evolving` | `openai-responses` | 1M | 256K | 文本、图片 |
| `doubao-seed-2.0-code` | `openai-responses` | 256K | 128K | 文本、图片 |
| `doubao-seed-2.0-pro` | `openai-responses` | 256K | 128K | 文本、图片 |
| `minimax-m2.7` | `openai-responses` | 200K | 128K | 文本 |
| `minimax-m3` | `openai-responses` | 512K | 128K | 文本、图片 |
| `glm-5.2` | `openai-responses` | 1M | 128K | 文本 |
| `kimi-k2.6` | `openai-responses` | 256K | 32K | 文本、图片 |
| `kimi-k2.7-code` | `openai-completions` | 256K | 32K | 文本、图片 |
| `deepseek-v4-pro` | `openai-responses` | 1M | 384K | 文本 |
| `kimi-k3` | `openai-responses` | 1M | 128K | 文本、图片 |

> **注意：** `kimi-k2.7-code` 使用 `openai-completions` API 而不是 `openai-responses`。

## 开发

```bash
# 仅类型检查
npm run check

# 构建一次
npm run build

# 监视模式
npm run dev
```

## 配置

提供商配置在 `provider/volcengine_agent_plan.ts` 中。如果火山引擎更改了其目录，请在此处更新模型列表、定价或 API 端点。

## TODO

- [ ] 搜索功能：支持按模型 ID、名称、API 类型、上下文窗口大小、输入类型等条件搜索/过滤模型列表

## 许可证

[MIT](LICENSE)
