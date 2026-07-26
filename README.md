# zgent

一个 [Pi](https://github.com/earendil-works/pi-coding-agent) 扩展，为 Pi 注册 **火山引擎 Agent Plan** 模型提供商与 **联网搜索** 工具，让 Pi 会话具备实时信息检索能力。

## 功能

- **模型提供商**：注册 `volcengine-agent-plan` 提供商，暴露火山引擎 Agent Plan 端点下的 13 个推理 / 聊天 / 代码模型。
- **联网搜索工具**：注册 `web_search` 工具，调用火山引擎 / Feedcoop 豆包搜索 API，为模型提供训练数据之外的实时信息（新闻、价格、文档、最新发布等）。

## 要求

- Pi Coding Agent（`@earendil-works/pi-coding-agent` >= 0.80.10）
- Node.js >= 20
- 火山引擎 Ark API 密钥（具备 Agent Plan 端点访问权限）
- 火山引擎 / Feedcoop 搜索 API 密钥（用于联网搜索工具，可选；不设置则搜索工具不可用）

## 安装

1. 将此仓库克隆或复制到你的 Pi 扩展目录中（或通过 `package.json` 中的 `pi.extensions` 加载）。
2. 安装依赖：

   ```bash
   npm install
   ```

3. 设置环境变量：

   ```bash
   # 模型提供商必需
   export VOLCENGINE_API_KEY="your-ark-api-key"

   # 联网搜索工具必需（不设置时 web_search 会返回缺失密钥错误）
   export SEARCH_API_KEY="your-search-api-key"
   # 或复用同一个密钥（搜索工具会回退读取 VOLCENGINE_API_KEY）
   ```

4. 构建扩展：

   ```bash
   npm run build
   ```

## 环境变量

| 变量 | 用途 | 必需 | 默认回退 |
| --- | --- | --- | --- |
| `VOLCENGINE_API_KEY` | 火山引擎 Ark 模型 API 鉴权 | 是 | — |
| `SEARCH_API_KEY` | 联网搜索 API 鉴权 | 否（搜索工具需要） | 回退读取 `VOLCENGINE_API_KEY` |

## 模型列表

Pi 加载该扩展后，以下模型将在 `volcengine-agent-plan` 提供商下可用：

| 模型 ID | API | 上下文窗口 | 最大输出 | 输入 | 推理 | 输入价 | 输出价 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `doubao-seed-2.0-mini` | `openai-responses` | 256K | 128K | 文本、图片 | ✓ | 0.25 | 0.25 |
| `doubao-seed-2.0-lite` | `openai-responses` | 256K | 128K | 文本、图片 | ✓ | 0.5 | 0.5 |
| `deepseek-v4-flash` | `openai-responses` | 1M | 384K | 文本 | ✓ | 0.5 | 0.5 |
| `doubao-seed-evolving` | `openai-responses` | 1M | 256K | 文本、图片 | ✓ | 2.5 | 2.5 |
| `doubao-seed-2.0-code` | `openai-responses` | 256K | 128K | 文本、图片 | ✓ | 2.5 | 2.5 |
| `doubao-seed-2.0-pro` | `openai-responses` | 256K | 128K | 文本、图片 | ✓ | 2.5 | 2.5 |
| `minimax-m2.7` | `openai-responses` | 200K | 128K | 文本 | ✓ | 2.5 | 2.5 |
| `minimax-m3` | `openai-responses` | 512K | 128K | 文本、图片 | ✓ | 2.5 | 2.5 |
| `glm-5.2` | `openai-responses` | 1M | 128K | 文本 | ✓ | 4.5 | 4.5 |
| `kimi-k2.6` | `openai-responses` | 256K | 32K | 文本、图片 | ✓ | 4.5 | 4.5 |
| `kimi-k2.7-code` | `openai-completions` | 256K | 32K | 文本、图片 | ✗ | 4.5 | 4.5 |
| `deepseek-v4-pro` | `openai-responses` | 1M | 384K | 文本 | ✓ | 5.5 | 5.5 |
| `kimi-k3` | `openai-responses` | 1M | 128K | 文本、图片 | ✓ | 6.7 | 6.7 |

> 价格单位为「元 / 百万 token」，数据来自火山引擎 Agent Plan 官方目录，可能随官方调整而变化。
> **注意：** `kimi-k2.7-code` 使用 `openai-completions` API 而非 `openai-responses`，且不支持推理模式。

## 联网搜索工具

工具名：`web_search`

调用火山引擎 / Feedcoop 豆包搜索 API（`https://open.feedcoopapi.com/search_api/web_search`），返回网页搜索结果（标题、URL、来源、时间、权威度、摘要）给模型，并要求模型在回答时引用来源序号。

### 主要参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `Query` | string（必填） | 搜索词，1~100 字符，建议用简洁短语 |
| `Count` | integer | 返回结果数，1~50，默认 10 |
| `TimeRange` | string | 时间范围：`OneDay` / `OneWeek` / `OneMonth` / `OneYear`，或日期区间 `2024-12-30..2025-12-30`（顶层字段） |
| `Filter.Sites` | string | 限定站点，多域名用 `\|` 分隔，如 `aliyun.com\|mp.qq.com` |
| `Filter.BlockHosts` | string | 屏蔽站点，多域名用 `\|` 分隔 |
| `Filter.AuthInfoLevel` | integer | 0：不限权威度；1：仅返回高权威来源 |
| `Filter.NeedContent` | boolean | 仅返回含正文的来源 |
| `Filter.NeedUrl` | boolean | 仅返回含有效 URL 的来源 |
| `QueryControl.QueryRewrite` | boolean | 启用查询改写（可能增加延迟），默认 false |
| `ContentFormats` | enum | 返回内容格式：`text` / `markdown` |
| `Industry` | enum | 行业限定：`finance` / `game` / `gov` |

> 工具内部会自动清理空对象与 undefined 字段，无需调用方处理。

### 错误码参考

| Code | 含义 | 处理建议 |
| --- | --- | --- |
| 10400 | 参数错误 | 检查 `Query` / `Filter` 等字段格式 |
| 10401 | Token 无效 | 检查 `SEARCH_API_KEY` |
| 10403 | 无访问权限 | 在控制台开通搜索服务 |
| 10406 | 免费额度用尽 | 升级套餐或更换密钥 |
| 700429 | QPS 超限 | 降低调用频率 |

## 项目结构

```
zgent/
├── zgent/
│   └── index.ts                  # 扩展入口：注册 provider 与 tool
├── provider/
│   └── volcengine-agent-plan.ts  # 火山引擎 Agent Plan 模型配置
├── tool/
│   └── web_search.ts             # 联网搜索工具
├── package.json                  # pi.extensions 指向入口
├── tsconfig.json
└── .gitattributes                # 统一仓库行尾为 LF
```

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

- **模型**：提供商配置在 `provider/volcengine-agent-plan.ts`。若火山引擎更新目录、定价或端点，在此文件修改。
- **搜索工具**：实现在 `tool/web_search.ts`，参数 Schema 与请求体构造严格对齐 Feedcoop 官方文档；若官方调整字段，在此文件修改。

## 下一阶段实现

### 模型提供商增强
- [ ] **多提供商支持**：抽象出统一注册层，按需接入阿里百炼、智谱开放平台、Moonshot 等其他国内模型 API，避免每加一家就改入口。
- [ ] **定价自动同步**：从官方目录页或 API 拉取最新定价，减少手工维护 `cost` 字段的成本与滞后。
- [ ] **模型元信息补全**：补充厂商、发布日期、是否支持函数调用 / JSON 模式 / 流式等字段，便于模型选择提示词更精准。

### 联网搜索工具增强
- [ ] **结果缓存**：对相同 `Query` + 过滤条件的请求做短期缓存（如 5 分钟），避免重复消耗 API 额度。
- [ ] **结果去重与聚类**：跨多次调用或同次结果内按 URL 规范化去重，对同源不同站点的转载聚类。
- [ ] **自定义渲染**：实现 `renderCall` / `renderResult`，在 TUI 中以更紧凑的卡片形式展示搜索结果（标题 + 域名 + 时间），而非纯文本堆叠。
- [ ] **多轮搜索**：支持基于上一轮结果进行追问式二次检索（参考 Perplexity 的 follow-up 模式）。
- [ ] **配额监控**：解析响应中的额度字段（若官方提供），在接近上限时给出提示。

### 工程化
- [ ] **单元测试**：为 `web_search.ts` 的响应解析、错误判断、请求体构造补充自动化测试，减少回归风险。
- [ ] **CI 流水线**：接入 GitHub Actions 跑 `npm run check`，保证 PR 类型检查通过。
- [ ] **版本与变更日志**：引入语义化版本与 `CHANGELOG.md`，跟踪 provider/tool 的破坏性变更。

## 许可证

[MIT](LICENSE)
