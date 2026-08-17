const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-v4-flash";

const deliverableDefinitions = {
  "requirement-analysis": {
    title: "需求优先级清单",
    columns: ["问题或需求", "用户证据", "优先级与验证"],
    guidance: "用输入中的用户问题和证据形成需求条目，并给出优先级和具体验证动作。",
  },
  "prd-builder": {
    title: "产品需求文档（PRD）",
    columns: ["PRD 模块", "方案内容", "验收方式"],
    guidance: "至少覆盖产品目标、用户故事、MVP 范围、业务规则和验收标准。",
  },
  "task-breakdown": {
    title: "项目执行计划",
    columns: ["里程碑或任务", "负责人建议", "依赖与完成标准"],
    guidance: "按执行顺序拆解里程碑或任务，不得虚构具体人员姓名和日期。",
  },
  "launch-review": {
    title: "上线检查与复盘表",
    columns: ["检查项或指标", "当前判断", "后续动作"],
    guidance: "覆盖上线条件、效果指标、问题反馈和复盘决策。",
  },
  "business-card": {
    title: "业务理解卡",
    columns: ["业务维度", "当前信息", "证据缺口与调研"],
    guidance: "覆盖业务目标、现状差距、团队信号和关键约束。",
  },
  "problem-diagnosis": {
    title: "业务问题五维诊断",
    columns: ["诊断维度", "原因假设", "证据与验证方式"],
    guidance: "必须分别覆盖资源、能力、激励、管理和协作五个维度，不得直接归因于个人。",
  },
  "solution-portfolio": {
    title: "人力解决方案组合",
    columns: ["解决措施", "对应业务问题", "节奏、负责人和指标"],
    guidance: "组合管理、能力、绩效激励、招聘或内部补位等措施，每项都对应业务问题和指标。",
  },
  "talent-review": {
    title: "人才盘点与保留行动",
    columns: ["关键岗位或匿名对象", "工作证据与能力差距", "发展或保留行动"],
    guidance: "只使用匿名对象和工作证据，给出发展、保留、继任或补位行动。",
  },
  "org-diagnosis": {
    title: "组织诊断与优化计划",
    columns: ["组织维度", "健康信号与原因", "改进动作与跟踪指标"],
    guidance: "覆盖协作机制、决策效率、管理行为和团队健康等组织维度。",
  },
};

function getDeliverableDefinition(payload) {
  return deliverableDefinitions[payload.tool?.id] || {
    title: `${payload.tool?.title || "任务"}工作表`,
    columns: ["交付项", "当前结论", "验证或行动"],
    guidance: `围绕${payload.tool?.output || "任务目标"}形成可执行工作表。`,
  };
}

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const normalizeItems = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 8);

function normalizeDeliverable(value, definition) {
  const rawRows = Array.isArray(value?.rows) ? value.rows : [];
  const rows = rawRows
    .map((row) => {
      const cells = Array.isArray(row) ? row : row?.cells;
      if (!Array.isArray(cells)) return null;
      const normalized = definition.columns.map((_, index) => String(cells[index] || "").trim());
      return normalized.every(Boolean) ? normalized : null;
    })
    .filter(Boolean)
    .slice(0, 8);
  if (rows.length < 3) return null;
  return {
    title: definition.title,
    columns: definition.columns,
    rows,
  };
}

function normalizeResult(value, definition) {
  if (!value || typeof value !== "object") return null;
  const result = {
    summary: String(value.summary || "").trim(),
    deliverable: normalizeDeliverable(value.deliverable, definition),
    facts: normalizeItems(value.facts),
    analysis: normalizeItems(value.analysis),
    assumptions: normalizeItems(value.assumptions),
    risks: normalizeItems(value.risks),
    nextSteps: normalizeItems(value.nextSteps),
  };
  if (
    !result.summary ||
    !result.deliverable ||
    [result.facts, result.analysis, result.assumptions, result.risks, result.nextSteps].some(
      (items) => !items.length,
    )
  ) {
    return null;
  }
  return result;
}

function buildMessages(payload) {
  const isHr = payload.workspace?.id === "hr";
  const deliverable = getDeliverableDefinition(payload);
  const system = `你是 FlowPilot AI，一名严谨的中文工作管理助手。你的任务是把用户材料整理成可核验、可执行的工作成果。

必须遵守：
1. 只把输入中明确出现的信息写入 facts，不得虚构数字、人员、日期或结论。
2. 推断只能写入 analysis 或 assumptions，并明确不确定性。
3. nextSteps 必须具体、可执行，优先补充负责人、期限和验证指标。
4. ${isHr ? "这是人力资源场景，不得基于敏感属性作出判断，高影响结论必须提示授权人员复核。" : "这是产品与项目管理场景，需要关注范围、依赖、验收标准和交付风险。"}
5. 使用简洁自然的中文，不要写空话。
6. 只输出合法 JSON，不要输出 Markdown 或解释。
7. deliverable 是本任务最主要的专业交付物，必须严格使用指定标题和列，并生成 3 到 8 行具体内容。
8. deliverable 同样不得虚构输入中没有的数字、阈值、人员、日期或现状。需要量化但材料未提供时，必须写“待负责人确认”或给出验证方法，不得自行填写数值。

本任务专业交付物：
- 标题：${deliverable.title}
- 列：${deliverable.columns.join("、")}
- 要求：${deliverable.guidance}

JSON 必须严格采用以下结构：
{"summary":"一句任务摘要","deliverable":{"title":"${deliverable.title}","columns":${JSON.stringify(deliverable.columns)},"rows":[["第一列内容","第二列内容","第三列内容"]]},"facts":["事实"],"analysis":["分析"],"assumptions":["假设或缺失"],"risks":["风险"],"nextSteps":["下一步"]}`;

  const user = JSON.stringify({
    project: {
      name: payload.project?.name,
    },
    workspace: {
      name: payload.workspace?.name,
      description: payload.workspace?.intro,
    },
    task: {
      name: payload.tool?.title,
      description: payload.tool?.description,
      expectedOutput: payload.tool?.output,
    },
    input: payload.form,
  });

  return [
    { role: "system", content: system },
    { role: "user", content: `请根据以下 json 输入生成结果：\n${user}` },
  ];
}

export async function handleDeepSeekRequest(
  request,
  apiKey,
  fetchImpl = fetch,
  model = DEFAULT_MODEL,
) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "仅支持 POST 请求。" }, 405);
  }
  if (!apiKey) {
    return jsonResponse({ error: "服务端尚未配置 DeepSeek API Key。" }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "请求内容不是有效 JSON。" }, 400);
  }

  const serialized = JSON.stringify(payload);
  if (!payload?.workspace?.id || !payload?.tool?.id || !payload?.form || serialized.length > 40000) {
    return jsonResponse({ error: "任务信息不完整或输入内容过长。" }, 400);
  }

  let upstream;
  try {
    upstream = await fetchImpl(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(payload),
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        temperature: 0.35,
        max_tokens: 2600,
        stream: false,
      }),
    });
  } catch {
    return jsonResponse({ error: "暂时无法连接 DeepSeek，请稍后重试。" }, 502);
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    return jsonResponse(
      { error: data?.error?.message || `DeepSeek 请求失败（${upstream.status}）。` },
      upstream.status >= 400 && upstream.status < 500 ? 400 : 502,
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(data?.choices?.[0]?.message?.content || "");
  } catch {
    return jsonResponse({ error: "DeepSeek 返回的结构无法解析，请重新生成。" }, 502);
  }

  const result = normalizeResult(parsed, getDeliverableDefinition(payload));
  if (!result) {
    return jsonResponse({ error: "DeepSeek 返回内容缺少必要字段，请重新生成。" }, 502);
  }

  return jsonResponse({
    result,
    model: data.model || model,
    usage: data.usage || null,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/deepseek") {
      return handleDeepSeekRequest(
        request,
        env.DEEPSEEK_API_KEY,
        fetch,
        env.DEEPSEEK_MODEL || DEFAULT_MODEL,
      );
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "接口不存在。" }, 404);
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
