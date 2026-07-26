import { defineTool } from "@earendil-works/pi-coding-agent";
import { Type, StringEnum } from "@earendil-works/pi-ai";

// ============================================================
// 1. 参数 Schema 定义（完全匹配 API 规范）
// ============================================================
const searchSchema = Type.Object({
  // ----- 必填 -----
  Query: Type.String({
    description:
      "User search query, 1~100 characters (longer will be truncated). " +
      "Be specific and descriptive. Use a concise phrase. " +
      'Example: "Weather in Shenzhen today" instead of "check weather".',
  }),

  // ----- 可选（有默认值） -----
  SearchType: Type.Optional(
    StringEnum(["web"] as const, {
      description: "Search type. Currently only 'web' is supported.",
    })
  ),

  Count: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 50,
      default: 10,
      description: "Number of results to return (max 50, default 10).",
    })
  ),

  // ----- Filter（嵌套对象） -----
  Filter: Type.Optional(
    Type.Object({
      NeedContent: Type.Optional(
        Type.Boolean({
          default: false,
          description: "If true, only return results with body content.",
        })
      ),
      NeedUrl: Type.Optional(
        Type.Boolean({
          default: false,
          description:
            "If true, only return results that have a valid URL link. " +
            "Setting to true may filter out some results.",
        })
      ),
      Sites: Type.Optional(
        Type.String({
          description:
            "Restrict search to specific sites, separate multiple domains with '|', max 20. " +
            "Example: 'aliyun.com|mp.qq.com'",
        })
      ),
      BlockHosts: Type.Optional(
        Type.String({
          description:
            "Block specific sites from search results, separate with '|', max 5. " +
            "Example: 'aliyun.com|mp.qq.com'",
        })
      ),
      AuthInfoLevel: Type.Optional(
        Type.Integer({
          minimum: 0,
          maximum: 1,
          default: 0,
          description:
            "0: no restriction on authority level; 1: restrict to 'very authoritative' sources only.",
        })
      ),
    })
  ),

  // ----- 顶层 TimeRange（官方请求示例中 TimeRange 是顶层字段，不在 Filter 内） -----
  TimeRange: Type.Optional(
    Type.String({
      description:
        "Restrict publication time. Possible values: 'OneDay', 'OneWeek', 'OneMonth', 'OneYear', " +
        "or a date range like '2024-12-30..2025-12-30'. Leave empty for no restriction.",
    })
  ),

  // ----- QueryControl（嵌套对象） -----
  QueryControl: Type.Optional(
    Type.Object({
      QueryRewrite: Type.Optional(
        Type.Boolean({
          default: false,
          description:
            "Enable query rewriting (may increase search latency). Default false.",
        })
      ),
    })
  ),

  // ----- 其他顶层字段 -----
  ContentFormats: Type.Optional(
    StringEnum(["text", "markdown"] as const, {
      description:
        "Format of returned content. 'text' or 'markdown'. Default 'text'.",
    })
  ),

  Industry: Type.Optional(
    StringEnum(["finance", "game", "gov"] as const, {
      description:
        "Restrict search to specific industry: finance (financial), game (video games), " +
        "gov (government/official sources). May reduce results.",
    })
  ),
});

// ============================================================
// 2. 工具定义（核心）
// ============================================================
const webSearchTool = defineTool({
  name: "web_search",
  label: "Web Search",
  description:
    "Search the web for current, real-time information (news, prices, docs, latest releases, etc.) beyond your training data.",
  promptSnippet:
    "Use web_search for real-time or recent facts beyond your knowledge; query a concise phrase.",
  promptGuidelines: [
    "Query must be a single concise phrase (1~100 chars), e.g. \"STM32 newest models 2025\" — not multiple unrelated keywords.",
    "If the user names a site (e.g. 'on Wikipedia'), set Filter.Sites to that domain.",
    "For very recent news, set top-level TimeRange to 'OneDay' or 'OneWeek'; for authoritative data, set Filter.AuthInfoLevel=1 or Industry='gov'.",
    "Search snippets may be outdated or inaccurate; cross-check important claims across multiple results.",
    "Cite sources in your answer using the result index and/or URL.",
  ],
  parameters: searchSchema,

  // ----- 2.2 核心执行逻辑 -----
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    // ===================== 2.2.1 读取 API Key =====================
    const API_KEY =
      process.env.SEARCH_API_KEY || process.env.VOLCENGINE_API_KEY;
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Search service unavailable: Missing API Key. Please set SEARCH_API_KEY in environment.",
          },
        ],
        details: { error: "Missing API Key" },
        terminate: false,
      };
    }

    // ===================== 2.2.2 构造请求体（严格遵循 API 规范） =====================
    // 官方文档：Query / SearchType / Count 为必填或顶层字段；
    //           TimeRange 是【顶层字段】（不在 Filter 内，见官方请求示例）。
    const requestBody: any = {
      Query: params.Query,
      SearchType: params.SearchType ?? "web",
      Count: params.Count ?? 10,
    };

    // 处理 Filter（只有显式传入才添加，避免发送空对象）
    if (params.Filter) {
      const filter: any = {};
      if (params.Filter.NeedContent !== undefined)
        filter.NeedContent = params.Filter.NeedContent;
      if (params.Filter.NeedUrl !== undefined)
        filter.NeedUrl = params.Filter.NeedUrl;
      if (params.Filter.Sites) filter.Sites = params.Filter.Sites;
      if (params.Filter.BlockHosts) filter.BlockHosts = params.Filter.BlockHosts;
      if (params.Filter.AuthInfoLevel !== undefined)
        filter.AuthInfoLevel = params.Filter.AuthInfoLevel;
      if (Object.keys(filter).length > 0) {
        requestBody.Filter = filter;
      }
    }

    // 顶层 TimeRange
    if (params.TimeRange) requestBody.TimeRange = params.TimeRange;

    // 处理 QueryControl
    if (params.QueryControl) {
      const qc: any = {};
      if (params.QueryControl.QueryRewrite !== undefined) {
        qc.QueryRewrite = params.QueryControl.QueryRewrite;
      }
      if (Object.keys(qc).length > 0) {
        requestBody.QueryControl = qc;
      }
    }

    // 处理其他顶层字段
    if (params.ContentFormats) requestBody.ContentFormats = params.ContentFormats;
    if (params.Industry) requestBody.Industry = params.Industry;

    // 清理 undefined / 空对象（防止 API 报错）
    Object.keys(requestBody).forEach((key) => {
      const val = requestBody[key];
      if (val === undefined || val === null) delete requestBody[key];
      else if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) {
        delete requestBody[key];
      }
    });

    // ===================== 2.2.3 发送 HTTP 请求（带取消信号） =====================
    const url = "https://open.feedcoopapi.com/search_api/web_search";

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal, // 支持外部取消
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return {
          content: [{ type: "text", text: "⏹️ Search cancelled by user." }],
          details: { cancelled: true },
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `❌ Network error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        details: { error: err instanceof Error ? err.message : String(err) },
      };
    }

    // ===================== 2.2.4 处理 HTTP 错误 =====================
    if (!response.ok) {
      const errorText = await response.text();
      return {
        content: [
          {
            type: "text",
            text: `❌ API error (${response.status}): ${errorText}`,
          },
        ],
        details: { status: response.status, error: errorText },
      };
    }

    // ===================== 2.2.5 解析响应 =====================
    // 官方响应结构（APIKey 接入）：
    //   { ResponseMetadata: { RequestId, Error?: {Code, CodeN, Message} },
    //     Result: { ResultCount, WebResults: [{Title, Url, Summary, Content, ...}], ... } }
    // 失败时 Result 为 null，错误信息在 ResponseMetadata.Error。
    const rawText = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to parse API response (not valid JSON).`,
          },
        ],
        details: { error: "Invalid JSON", raw: rawText },
      };
    }

    // ----- 错误判断：只看 ResponseMetadata.Error（官方规范） -----
    // 注意：不能用字符串包含 "error" 判断，否则正常响应里的字段名会误触发。
    const apiError = parsed?.ResponseMetadata?.Error;
    if (apiError && (apiError.Message || apiError.Code)) {
      const msg =
        apiError.Message ||
        apiError.Code ||
        `API error ${apiError.CodeN ?? ""}`.trim();
      return {
        content: [{ type: "text", text: `❌ Search error: ${msg}` }],
        details: {
          error: msg,
          code: apiError.Code ?? apiError.CodeN,
          raw: rawText,
        },
      };
    }

    // ----- 提取结果列表：Result.WebResults（官方字段名，首字母大写） -----
    const resultObj = parsed?.Result;
    const resultCount: number = resultObj?.ResultCount ?? 0;
    const searchResults: any[] = Array.isArray(resultObj?.WebResults)
      ? resultObj.WebResults
      : [];
    const logId: string | undefined = resultObj?.LogId;

    // ===================== 2.2.6 发送完成进度更新 =====================
    onUpdate?.({
      content: [
        {
          type: "text",
          text: `✅ Found ${searchResults.length} results for "${params.Query}"`,
        },
      ],
      details: { progress: 100 },
    });

    // ===================== 2.2.7 返回最终结果给 LLM 和 UI =====================
    // 给 LLM 的文本：把每条结果的标题/链接/摘要（官方推荐 Summary 用于大模型）拼出来，
    // 让模型能直接据此回答用户，而不是只看到一句 "Top result: N/A"。
    let llmText: string;
    if (searchResults.length === 0) {
      llmText =
        `No results found for "${params.Query}". ` +
        `Consider rephrasing the query, broadening it, or relaxing filters (Sites/TimeRange/AuthInfoLevel).`;
    } else {
      const blocks = searchResults.map((r, i) => {
        const title = r.Title ?? "";
        const link = r.Url ?? "";
        const site = r.SiteName ?? "";
        const time = r.PublishTime ?? "";
        const auth = r.AuthInfoDes ?? "";
        // Summary 是官方推荐用于大模型的相关摘要（500~1000 字）
        const summary = r.Summary ?? r.Snippet ?? "";
        const head =
          `### [${i + 1}] ${title}${link ? `\nURL: ${link}` : ""}` +
          `${site ? `\n来源: ${site}` : ""}` +
          `${time ? ` | 时间: ${time}` : ""}` +
          `${auth ? ` | 权威度: ${auth}` : ""}`;
        return summary ? `${head}\n${summary}` : head;
      });
      llmText =
        `Search completed. Found ${searchResults.length} results for "${params.Query}".` +
        ` Below are the results. Use them to answer; cite each source by its index [n] and/or URL.` +
        `\n\n${blocks.join("\n\n---\n\n")}`;
    }

    return {
      content: [{ type: "text", text: llmText }],
      details: {
        query: params.Query,
        count: searchResults.length,
        resultCount,
        logId,
        results: searchResults, // 供 renderResult 使用
      },
      terminate: false,
    };
  },

  // ----- 2.3 自定义渲染（可选，这里留空供你按需扩展） -----
  // renderCall(args, theme, context) { ... },
  // renderResult(result, options, theme, context) { ... },
});

// ============================================================
// 3. 导出工具
// ============================================================
export default webSearchTool;
