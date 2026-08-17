import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  ClipboardText,
  Copy,
  DownloadSimple,
  FloppyDisk,
  Info,
  ListChecks,
  PencilSimple,
  Plus,
  ShieldCheck,
  Sparkle,
  Trash,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { projectToMarkdown, resultToMarkdown } from "./markdown.js";

const GITHUB_URL = "https://github.com/liuya02/flowpilot-ai";

const workspaces = {
  product: {
    id: "product",
    eyebrow: "工作台 A",
    name: "产品与项目管理",
    short: "从需求发现、PRD、任务拆解到上线复盘",
    intro:
      "围绕产品交付闭环，把零散材料逐步整理成需求、方案、执行计划和复盘结论。",
    Icon: ClipboardText,
    accent: "green",
    privacy:
      "输入内容会发送给 DeepSeek 生成结果；本机草稿不会上传到项目服务器。事实、负责人和日期仍需要由你确认。",
    stages: [
      {
        id: "discover",
        label: "发现与定义",
        description: "先理解问题，再决定做什么。",
        tools: [
          {
            id: "requirement-analysis",
            title: "需求分析",
            description: "把访谈、反馈和想法整理为问题陈述、证据、假设与需求池。",
            output: "问题陈述 · 需求池 · 待验证假设",
            sample: {
              context: "一款面向小型项目团队的协作工具，最近收到大量关于周报耗时的反馈。",
              material:
                "用户 A：每周要花一个小时从群聊里找进度。\n用户 B：不知道哪些任务已经延期。\n项目负责人：周报格式不统一，风险经常到最后才暴露。",
              goal: "判断是否值得优先开发自动周报功能，并明确第一版范围。",
              constraints: "两周内完成 MVP；暂不接入企业内部通讯录。",
            },
          },
          {
            id: "competitor-review",
            title: "竞品分析",
            description: "按目标用户、关键流程和差异点整理竞品资料，形成机会判断。",
            output: "竞品矩阵 · 机会点 · 验证建议",
          },
        ],
      },
      {
        id: "plan",
        label: "规划与设计",
        description: "把选定需求变成清晰、可评审的产品方案。",
        tools: [
          {
            id: "prd-builder",
            title: "PRD 生成器",
            description: "根据背景、用户问题和范围生成 PRD 骨架、业务规则与验收标准。",
            output: "PRD 结构 · 用户故事 · 验收标准",
          },
          {
            id: "flow-designer",
            title: "业务流程梳理",
            description: "识别角色、前置条件、主流程和异常场景，形成页面流程说明。",
            output: "角色清单 · 主流程 · 异常场景",
          },
        ],
      },
      {
        id: "delivery",
        label: "开发与测试",
        description: "让团队对任务、责任、依赖和质量标准达成一致。",
        tools: [
          {
            id: "task-breakdown",
            title: "任务拆解",
            description: "把目标拆成里程碑、执行任务、依赖关系和风险清单。",
            output: "WBS · 里程碑 · 风险与依赖",
          },
          {
            id: "meeting-actions",
            title: "会议行动项",
            description: "从会议记录中提取决策、待办、负责人建议和截止时间。",
            output: "会议结论 · 行动项 · 待确认事项",
          },
        ],
      },
      {
        id: "launch",
        label: "上线与迭代",
        description: "检查上线条件，观察结果，并形成下一轮改进。",
        tools: [
          {
            id: "launch-review",
            title: "上线检查与复盘",
            description: "整理上线清单、指标、反馈分类、问题归因和后续优化。",
            output: "上线清单 · 指标定义 · 复盘框架",
          },
        ],
      },
      {
        id: "customer",
        label: "客户成功",
        description: "持续记录客户问题，让售后反馈回到产品改进。",
        tools: [
          {
            id: "customer-followup",
            title: "客户问题跟进",
            description: "梳理客户问题、影响范围、处理状态和可沉淀的产品建议。",
            output: "问题单 · 回访计划 · 产品建议",
          },
        ],
      },
    ],
  },
  hr: {
    id: "hr",
    eyebrow: "工作台 B",
    name: "人力资源与组织管理",
    short: "从业务洞察、人力规划到人才与组织优化",
    intro:
      "从理解业务开始，把人才与组织问题转化为可组合、可跟踪的人力资源解决方案。",
    Icon: UsersThree,
    accent: "gold",
    privacy:
      "输入内容会发送给 DeepSeek。请只使用虚构或彻底匿名的数据；人才、劳动关系和薪酬结论必须由授权人员复核。",
    stages: [
      {
        id: "business",
        label: "业务洞察",
        description: "主动理解业务目标、模式、痛点与团队风险。",
        tools: [
          {
            id: "business-card",
            title: "业务理解卡",
            description: "从会议、复盘和业务材料中提炼目标、差距、关键问题和调研清单。",
            output: "业务理解卡 · 关键问题 · 调研清单",
            sample: {
              context: "一家快速扩张的区域零售团队，新开 12 家门店后连续两个季度未达成销售目标。",
              material:
                "区域负责人：新店店长成熟度差异很大。\n业务复盘：排班不稳定，老员工频繁支援新店。\n员工访谈：晋升标准不清晰，骨干开始观望外部机会。",
              goal: "识别当前最需要优先处理的人才与组织问题，并提出验证计划。",
              constraints: "不使用真实姓名和个人绩效；一个月内完成首轮改善。",
            },
          },
        ],
      },
      {
        id: "diagnose",
        label: "诊断与规划",
        description: "区分资源、能力、激励、管理和协作问题。",
        tools: [
          {
            id: "workforce-plan",
            title: "人力规划",
            description: "结合业务预测、岗位和能力现状，形成匿名化人力缺口与成本假设。",
            output: "人力缺口 · 能力差距 · 成本假设",
          },
          {
            id: "problem-diagnosis",
            title: "业务问题诊断",
            description: "把业务结果拆成多维原因假设，避免直接归因于人员。",
            output: "原因假设 · 证据缺口 · 验证计划",
          },
        ],
      },
      {
        id: "solution",
        label: "方案设计",
        description: "组合招聘、绩效、激励、培训和管理改进工具。",
        tools: [
          {
            id: "solution-portfolio",
            title: "人力解决方案",
            description: "把诊断结果转成分优先级的组合方案、负责人、节奏和指标。",
            output: "方案组合 · 执行节奏 · 跟踪指标",
          },
        ],
      },
      {
        id: "operations",
        label: "人事运营",
        description: "规范日常人事信息，同时保护员工隐私。",
        tools: [
          {
            id: "relations-timeline",
            title: "员工关系时间线",
            description: "基于匿名事实整理事件、证据缺口、沟通记录和待办节点。",
            output: "事实时间线 · 证据缺口 · 跟进清单",
          },
        ],
      },
      {
        id: "talent",
        label: "人才与保留",
        description: "识别关键岗位、发展需求和风险信号。",
        tools: [
          {
            id: "talent-review",
            title: "人才盘点与保留",
            description: "只基于工作证据梳理关键岗位、能力差距、发展与保留行动。",
            output: "人才盘点 · 继任建议 · 发展行动",
          },
        ],
      },
      {
        id: "organization",
        label: "组织优化",
        description: "关注组织健康、协作和管理问题，并推动改善。",
        tools: [
          {
            id: "org-diagnosis",
            title: "组织诊断",
            description: "归纳组织健康信号、原因假设、验证方式和改进跟踪指标。",
            output: "组织诊断 · 改进措施 · 跟踪指标",
          },
        ],
      },
    ],
  },
};

const blankForm = {
  context: "",
  material: "",
  goal: "",
  constraints: "",
};

const blankProjectMeta = {
  owner: "",
  dueDate: "",
  milestones: [],
  blockers: [],
  risks: [],
};

const tutorialCases = [
  {
    id: "product-tutorial",
    workspaceId: "product",
    toolId: "requirement-analysis",
    projectName: "自动周报功能",
    title: "自动周报功能",
    description: "从零散用户反馈开始，一步步完成需求、方案、执行计划和上线复盘。",
    route: ["需求分析", "PRD", "任务拆解", "上线复盘"],
    routeIds: ["requirement-analysis", "prd-builder", "task-breakdown", "launch-review"],
    projectMeta: {
      owner: "产品负责人（待确认）",
      dueOffsetDays: 14,
      milestones: [
        { id: "product-m1", title: "完成需求与范围确认", dueOffsetDays: 3, done: true },
        { id: "product-m2", title: "完成 PRD 与方案评审", dueOffsetDays: 7, done: false },
        { id: "product-m3", title: "完成 MVP 开发与上线检查", dueOffsetDays: 14, done: false },
      ],
      blockers: [
        { id: "product-b1", text: "周报数据来源与权限范围还需确认", owner: "项目负责人", resolved: false },
      ],
      risks: [
        { id: "product-r1", text: "两周交付周期较紧，需优先锁定 MVP 范围", level: "中", resolved: false },
      ],
    },
    form: workspaces.product.stages[0].tools[0].sample,
  },
  {
    id: "hr-tutorial",
    workspaceId: "hr",
    toolId: "business-card",
    projectName: "区域门店组织改善",
    title: "区域门店组织改善",
    description: "从业务目标和团队信号开始，逐步完成问题诊断、人力方案和组织改善。",
    route: ["业务理解", "问题诊断", "人力解决方案", "组织诊断"],
    routeIds: ["business-card", "problem-diagnosis", "solution-portfolio", "org-diagnosis"],
    projectMeta: {
      owner: "HR 项目负责人（待确认）",
      dueOffsetDays: 21,
      milestones: [
        { id: "hr-m1", title: "完成业务访谈与信号收集", dueOffsetDays: 5, done: true },
        { id: "hr-m2", title: "完成问题诊断与方案共识", dueOffsetDays: 12, done: false },
        { id: "hr-m3", title: "启动组织改善试点", dueOffsetDays: 21, done: false },
      ],
      blockers: [
        { id: "hr-b1", text: "关键岗位数据口径尚未统一", owner: "HRBP", resolved: false },
      ],
      risks: [
        { id: "hr-r1", text: "只看人员现象可能掩盖激励与管理机制问题", level: "高", resolved: false },
      ],
    },
    form: workspaces.hr.stages[0].tools[0].sample,
  },
];

const professionalDeliverableDefinitions = {
  "requirement-analysis": {
    title: "需求优先级清单",
    columns: ["问题或需求", "用户证据", "优先级与验证"],
  },
  "prd-builder": {
    title: "产品需求文档（PRD）",
    columns: ["PRD 模块", "方案内容", "验收方式"],
  },
  "task-breakdown": {
    title: "项目执行计划",
    columns: ["里程碑或任务", "负责人建议", "依赖与完成标准"],
  },
  "launch-review": {
    title: "上线检查与复盘表",
    columns: ["检查项或指标", "当前判断", "后续动作"],
  },
  "business-card": {
    title: "业务理解卡",
    columns: ["业务维度", "当前信息", "证据缺口与调研"],
  },
  "problem-diagnosis": {
    title: "业务问题五维诊断",
    columns: ["诊断维度", "原因假设", "证据与验证方式"],
  },
  "solution-portfolio": {
    title: "人力解决方案组合",
    columns: ["解决措施", "对应业务问题", "节奏、负责人和指标"],
  },
  "talent-review": {
    title: "人才盘点与保留行动",
    columns: ["关键岗位或匿名对象", "工作证据与能力差距", "发展或保留行动"],
  },
  "org-diagnosis": {
    title: "组织诊断与优化计划",
    columns: ["组织维度", "健康信号与原因", "改进动作与跟踪指标"],
  },
};

function getDeliverableDefinition(tool) {
  return professionalDeliverableDefinitions[tool.id] || {
    title: `${tool.title}工作表`,
    columns: ["交付项", "当前结论", "验证或行动"],
  };
}

const DRAFTS_STORAGE_KEY = "flowpilot-ai:drafts:v1";

function normalizeProjectMeta(meta = blankProjectMeta) {
  const normalizeItems = (items, prefix, mapItem) =>
    (Array.isArray(items) ? items : []).slice(0, 12).map((item, index) => {
      const source = typeof item === "string"
        ? { text: item, title: item }
        : item && typeof item === "object" ? item : {};
      return mapItem(source, source.id || `${prefix}-${index}`);
    });

  return {
    owner: typeof meta.owner === "string" ? meta.owner : "",
    dueDate: typeof meta.dueDate === "string" ? meta.dueDate : "",
    milestones: normalizeItems(meta.milestones, "milestone", (item, id) => ({
      id,
      title: item.title || "",
      dueDate: item.dueDate || "",
      done: Boolean(item.done),
    })),
    blockers: normalizeItems(meta.blockers, "blocker", (item, id) => ({
      id,
      text: item.text || "",
      owner: item.owner || "",
      resolved: Boolean(item.resolved),
    })),
    risks: normalizeItems(meta.risks, "risk", (item, id) => ({
      id,
      text: item.text || "",
      level: ["低", "中", "高"].includes(item.level) ? item.level : "中",
      resolved: Boolean(item.resolved),
    })),
  };
}

function dateAfterDays(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function materializeTutorialProjectMeta(meta = {}) {
  return normalizeProjectMeta({
    ...meta,
    dueDate: dateAfterDays(meta.dueOffsetDays || 14),
    milestones: (meta.milestones || []).map((item) => ({
      ...item,
      dueDate: dateAfterDays(item.dueOffsetDays || 0),
    })),
  });
}

function readDrafts() {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(DRAFTS_STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.map((draft) => ({
          ...draft,
          id: draft.id || draft.key || createLocalId("draft"),
          projectId: draft.projectId || draft.id || draft.key || createLocalId("project"),
          projectName: draft.projectName || `${draft.toolTitle || "未命名"}项目`,
          projectMeta: normalizeProjectMeta(draft.projectMeta),
          versions: Array.isArray(draft.versions) ? draft.versions : [],
        }))
      : [];
  } catch {
    return [];
  }
}

function writeDrafts(drafts) {
  try {
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // 浏览器禁用本地存储时，应用仍可继续使用当前会话。
  }
}

function createLocalId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `${prefix}-${random}`;
}

function cloneLocalData(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function formatDraftTime(value) {
  if (!value) return "刚刚保存";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function draftPreview(draft) {
  const text = draft.result?.summary || draft.form?.goal || draft.form?.context || "尚未填写摘要";
  return text.length > 72 ? `${text.slice(0, 72)}…` : text;
}

function defaultProjectName(toolTitle) {
  return `${toolTitle || "未命名"}项目`;
}

const workflowTransitions = {
  "requirement-analysis": {
    nextToolId: "prd-builder",
    label: "继续生成 PRD",
    description: "把已经确认的问题、证据和范围直接带入产品方案。",
  },
  "prd-builder": {
    nextToolId: "task-breakdown",
    label: "继续拆解任务",
    description: "把已经确认的产品方案转成里程碑、任务、依赖和风险。",
  },
  "task-breakdown": {
    nextToolId: "launch-review",
    label: "继续上线检查与复盘",
    description: "把执行计划带入上线准备、指标观察和复盘改进。",
  },
  "business-card": {
    nextToolId: "problem-diagnosis",
    label: "继续诊断业务问题",
    description: "把业务目标、差距和风险信号转成多维原因假设。",
  },
  "problem-diagnosis": {
    nextToolId: "solution-portfolio",
    label: "继续设计人力解决方案",
    description: "把已确认的原因组合成招聘、绩效、激励、培训和管理方案。",
  },
  "solution-portfolio": {
    label: "选择改善方向",
    description: "根据问题性质，继续进入人才保留或组织效能改善。",
    options: [
      {
        nextToolId: "talent-review",
        label: "继续人才盘点与保留",
        description: "识别关键岗位、核心骨干、能力差距和保留行动。",
      },
      {
        nextToolId: "org-diagnosis",
        label: "继续组织诊断",
        description: "检查协作、管理和组织健康问题，并设计改进指标。",
      },
    ],
  },
};

function findTool(workspace, toolId) {
  for (let stageIndex = 0; stageIndex < workspace.stages.length; stageIndex += 1) {
    const selectedTool = workspace.stages[stageIndex].tools.find((item) => item.id === toolId);
    if (selectedTool) return { tool: selectedTool, stageIndex };
  }
  return null;
}

function buildContinuationForm(currentTool, nextTool, result, currentForm) {
  const cleanContext = currentForm.context
    .split("\n")
    .filter((line) => !line.trim().startsWith("本任务承接“"))
    .join("\n")
    .trim();

  return {
    context: [
      `本任务承接“${currentTool.title}”的已核验结果。`,
      cleanContext,
    ]
      .filter(Boolean)
      .join("\n"),
    material: [
      "【已核验事实】",
      ...result.facts.map((item) => `- ${item}`),
      "",
      "【上一步分析】",
      ...result.analysis.map((item) => `- ${item}`),
      ...(result.deliverable
        ? [
            "",
            `【已确认交付物：${result.deliverable.title}】`,
            result.deliverable.columns.join(" | "),
            ...result.deliverable.rows.map((row) => row.join(" | ")),
          ]
        : []),
      "",
      "【仍需确认】",
      ...result.assumptions.map((item) => `- ${item}`),
    ].join("\n"),
    goal: `基于已核验的“${currentTool.title}”结果，完成“${nextTool.title}”，并形成可评审、可继续执行的交付物。`,
    constraints:
      currentForm.constraints ||
      "沿用上一步已确认的期限、人员、技术和隐私边界；仍需在本阶段补充新增约束。",
  };
}

function textToItems(text, fallback) {
  const factSource = text.includes("【已核验事实】")
    ? text.split("【已核验事实】")[1].split("【上一步分析】")[0]
    : text;
  const items = factSource
    .split(/\n|。/)
    .map((item) => item.trim().replace(/^[-•]\s*/, ""))
    .filter((item) => item && !/^【.+】$/.test(item))
    .slice(0, 4);
  return items.length ? items : fallback;
}

function buildProfessionalDeliverable(tool, form, facts) {
  const definition = getDeliverableDefinition(tool);
  const fact = (index, fallback) => facts[index] || fallback;
  const rowsByTool = {
    "requirement-analysis": [
      [fact(0, "核心问题仍需补充用户证据"), "来自当前输入材料，需确认代表性", "P0 · 访谈或数据验证"],
      [fact(1, "目标用户和使用场景尚未明确"), "当前只有背景描述", "P1 · 补充典型场景"],
      [form.goal || "本次目标尚未补充", "由项目目标提出", "确认成功指标后再排期"],
    ],
    "prd-builder": [
      ["产品目标", form.goal || "明确核心用户问题并完成首版验证", "目标和量化指标由负责人确认"],
      ["用户故事", "作为目标用户，我希望更高效地完成当前任务，以减少重复工作和信息遗漏。", "使用典型场景完成端到端验收"],
      ["MVP 范围", fact(0, "只覆盖最核心的输入、处理和输出流程"), "首版不包含项单独记录并冻结范围"],
      ["业务规则", form.constraints || "权限、状态和异常处理规则仍需补充", "逐条形成可测试的规则用例"],
      ["验收标准", "核心流程可完成，关键结果可编辑、核验和导出。", "按主流程、异常流程和数据准确性验收"],
    ],
    "task-breakdown": [
      ["范围与方案确认", "产品经理 / 项目负责人", "PRD 和验收标准通过评审"],
      ["开发与联调", "开发负责人", "依赖数据与接口可用，核心流程联调完成"],
      ["测试与上线准备", "测试 / 项目负责人", "阻塞缺陷关闭，上线清单全部确认"],
      ["上线观察与复盘", "产品经理 / 业务负责人", "指标可追踪，并形成下一轮决策"],
    ],
    "launch-review": [
      ["上线条件", "核心流程、负责人和回滚方案需要逐项确认", "未确认项关闭后再发布"],
      ["效果指标", form.goal || "业务目标和用户行为指标仍需补充", "上线前确定基线、目标值和观察周期"],
      ["问题与反馈", "按功能、数据、流程和体验分类记录", "明确负责人、优先级和修复期限"],
      ["复盘结论", "根据数据决定继续、调整或停止", "记录证据、决策和下一版本范围"],
    ],
    "business-card": [
      ["业务目标", form.goal || "业务目标和成功标准仍需业务负责人确认", "参加业务会议并核对目标口径"],
      ["现状差距", fact(0, "现状与目标之间的差距尚未量化"), "补充业务数据和项目复盘证据"],
      ["团队信号", fact(1, "团队风险信号需要多方交叉验证"), "开展匿名访谈并观察协作过程"],
      ["关键约束", form.constraints || "时间、制度、预算和隐私边界待补充", "由业务和授权 HR 共同确认"],
    ],
    "problem-diagnosis": [
      ["资源", "人员配置、排班或工具支持可能不足", "核对工作量、编制和资源使用数据"],
      ["能力", "关键岗位能力与业务要求可能不匹配", "基于工作证据进行能力差距分析"],
      ["激励", "目标、回报或晋升机制可能未形成有效牵引", "核对绩效规则并开展匿名访谈"],
      ["管理", "目标传递、反馈和管理动作可能不稳定", "观察管理节奏并复盘关键决策"],
      ["协作", "角色边界和跨团队协作机制可能不清晰", "梳理流程、接口人和冲突节点"],
    ],
    "solution-portfolio": [
      ["管理机制改善", "解决目标传递和执行节奏问题", "业务负责人 · 先试点 · 跟踪目标达成率"],
      ["能力发展", "解决关键岗位能力差距", "HR 与业务主管 · 分阶段培养 · 跟踪胜任度"],
      ["绩效与激励优化", "解决行为牵引和反馈不足", "授权 HR · 评估后实施 · 跟踪关键行为"],
      ["招聘或内部补位", "解决经过验证的人才缺口", "招聘负责人 · 按优先级推进 · 跟踪到岗与适配"],
    ],
    "talent-review": [
      ["关键岗位 A", "基于项目结果和关键行为补充能力证据", "制定发展任务、继任安排和定期回顾"],
      ["核心骨干 B（匿名）", "核对贡献、能力差距和风险信号", "由授权人员制定保留与发展计划"],
      ["高风险岗位 C", "确认岗位依赖度和替代难度", "准备知识交接、内部培养或招聘预案"],
    ],
    "org-diagnosis": [
      ["协作机制", "跨角色信息传递和协同节奏可能不稳定", "明确接口人和例会机制，跟踪阻塞时长"],
      ["决策效率", "决策边界或升级路径可能不清晰", "明确决策权责，跟踪决策周期"],
      ["管理行为", "目标、反馈和复盘动作可能不一致", "建立管理动作清单，跟踪执行率"],
      ["团队健康", "压力、信任和人员风险信号需要持续观察", "匿名脉搏调查并由授权人员复核"],
    ],
  };

  return {
    title: definition.title,
    columns: definition.columns,
    rows: rowsByTool[tool.id] || [
      [tool.output || tool.title, form.goal || "当前结论待补充", "补充负责人、期限和验证标准"],
      ["已知信息", fact(0, "缺少可核验材料"), "确认事实来源和适用范围"],
      ["下一步", "先补齐关键证据，再形成正式结论", "安排负责人并设置回看时间"],
    ],
  };
}

function buildResult(workspace, tool, form) {
  const facts = textToItems(form.material, [
    "尚未提供可直接核验的原始材料。",
    "本次结果主要依据任务背景和目标生成。",
  ]);

  const productToolAnalysis = {
    "prd-builder": [
      "产品目标：减少人工汇总时间，让项目状态、延期与风险可以被快速识别。",
      "MVP 范围：统一输入格式、自动归纳进度、风险提示和 Markdown 导出；暂不覆盖通讯录与复杂权限。",
      "核心用户故事：作为项目负责人，我希望从零散进度中快速生成结构化周报，以便及时协调阻塞项。",
      "验收标准：用户能够载入材料、生成结果、修改关键事实，并在人工核验后导出可用文档。",
    ],
    "task-breakdown": [
      "里程碑 1：确认范围与验收标准，完成页面流程和数据字段评审。",
      "里程碑 2：完成输入、生成、核验和导出四个核心环节的前端实现。",
      "里程碑 3：使用两套虚构案例测试，修复阻塞问题并发布演示版本。",
      "关键依赖：示例数据、输出模板、隐私规则和负责人的可用时间。",
    ],
    "launch-review": [
      "上线条件：核心流程、异常场景、验收标准和负责人均已确认。",
      "观察指标：生成完成率、人工修改率、核验完成率和任务流转成功率。",
      "反馈分类：区分信息不足、结果不准确、流程阻塞和体验问题。",
      "复盘节奏：上线后一周检查首轮数据，形成继续、调整或停止的明确结论。",
    ],
  };
  const productAnalysis = productToolAnalysis[tool.id] || [
    `建议先围绕“${tool.title}”建立统一输入和输出口径。`,
    "当前目标可拆成：明确问题、确认范围、安排执行、验证结果。",
    `首轮交付物应聚焦 ${tool.output.replaceAll(" · ", "、")}，避免一次覆盖过多场景。`,
  ];
  const hrToolAnalysis = {
    "business-card": [
      "先确认业务目标、当前差距和关键约束，再判断人才与组织问题。",
      "从业务会议、项目复盘和一线访谈中交叉验证风险信号。",
      "将仍缺少的数据、角色观点和验证动作列入调研清单。",
    ],
    "problem-diagnosis": [
      "从资源、能力、激励、管理和协作五个维度建立原因假设。",
      "区分业务结果、组织条件与个人表现，不把业绩问题直接等同于人员问题。",
      "为每项原因假设补充支持证据、反证和验证负责人。",
    ],
    "solution-portfolio": [
      "把招聘、绩效、激励、培训和管理改进组合成分阶段方案。",
      "每项方案需要对应业务问题、负责人、时间节奏和结果指标。",
      "优先处理高影响且证据充分的问题，保留小范围试点和退出条件。",
    ],
    "talent-review": [
      "只依据工作证据识别关键岗位、能力差距、发展需要与离职风险信号。",
      "分别制定保留、发展、继任和招聘补位行动，避免单一标签判断。",
      "高影响人才结论必须由授权人员复核并记录证据来源。",
    ],
    "org-diagnosis": [
      "从协作机制、决策效率、管理行为和团队健康度识别组织问题。",
      "将改善措施落实到会议机制、角色边界、管理动作和可观察指标。",
      "设定复盘周期，区分短期症状改善与长期组织能力建设。",
    ],
  };
  const hrAnalysis = hrToolAnalysis[tool.id] || [
    "先区分业务结果、组织条件与个人表现，不直接把业务问题等同于人员问题。",
    `本次应形成 ${tool.output.replaceAll(" · ", "、")}，并为每项结论保留证据来源。`,
    "建议从资源、能力、激励、管理和协作五个维度验证原因假设。",
  ];

  const deliverable = buildProfessionalDeliverable(tool, form, facts);

  return {
    summary: form.goal || `完成一次${tool.title}，形成可执行、可核验的工作成果。`,
    deliverable,
    facts,
    analysis: workspace.id === "product" ? productAnalysis : hrAnalysis,
    assumptions: [
      form.context
        ? "已将背景描述视为当前有效信息，仍需由业务负责人确认。"
        : "缺少完整背景，当前建议基于通用场景。",
      form.constraints
        ? `已知约束：${form.constraints}`
        : "尚未提供时间、资源、制度或技术约束。",
      "尚未获得量化数据，优先级与影响判断仍需验证。",
    ],
    risks:
      workspace.id === "product"
        ? [
            "需求边界不清可能导致范围持续扩大。",
            "负责人、期限和依赖关系仍需团队共同确认。",
            "上线或交付前必须补充可测试的验收标准。",
          ]
        : [
            "不得依据受保护或敏感属性作出人才判断。",
            "当前材料可能只代表部分角色观点，需要补充多方证据。",
            "高影响人事结论必须由授权人员复核，不可自动执行。",
          ],
    nextSteps: [
      "邀请最接近问题的一线角色确认事实与关键缺口。",
      "为每项行动补充负责人、完成时间和可验证指标。",
      "一周后回看新增证据，决定继续、调整或停止。",
    ],
  };
}

function AppHeader({ onHome, workspace, onHelp, onDrafts, onCockpit, draftCount }) {
  return (
    <header className="app-header">
      <button className="brand-button" type="button" onClick={onHome}>
        FlowPilot AI
      </button>
      {workspace && (
        <div className="header-context">
          <span className="header-divider" />
          <span>{workspace.name}</span>
        </div>
      )}
      <nav className="header-nav" aria-label="主导航">
        <button className="cockpit-nav-button" type="button" onClick={onCockpit}>
          驾驶舱
        </button>
        <button className="draft-nav-button" type="button" onClick={onDrafts}>
          草稿
          {draftCount > 0 && <span className="draft-count">{draftCount}</span>}
        </button>
        <button className="help-nav-button" type="button" onClick={onHelp}>
          教程
        </button>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}

function Home({ onChoose, onHelp, onDrafts, onCockpit, draftCount, latestDraft, onResumeDraft, onDeleteDraft }) {
  return (
    <div className="home-screen">
      <div className="page-shell home-shell">
        <AppHeader onHome={() => {}} onHelp={onHelp} onDrafts={onDrafts} onCockpit={onCockpit} draftCount={draftCount} />
        <main className="home-main">
          <section className="hero-block">
            <h1>
              把复杂工作，
              <br />
              变成<span>清晰的下一步</span>
            </h1>
            <p>
              FlowPilot AI 是你的双工作台 AI 助理，覆盖产品与项目管理，
              <br className="desktop-only" />
              以及人力资源与组织管理两大场景，帮你理清思路，推动落地。
            </p>
          </section>

          <section className="workspace-chooser" aria-labelledby="workspace-title">
            <h2 id="workspace-title">选择一个工作台开始</h2>
            <div className="workspace-grid">
              {Object.values(workspaces).map((workspace, index) => {
                const Icon = workspace.Icon;
                return (
                  <article
                    className={`workspace-entry ${index === 1 ? "workspace-entry-second" : ""}`}
                    key={workspace.id}
                  >
                    <div className="workspace-icon" aria-hidden="true">
                      <Icon size={58} weight="regular" />
                    </div>
                    <div className="workspace-copy">
                      <h3>{workspace.name}</h3>
                      <p>{workspace.short}</p>
                      <button type="button" onClick={() => onChoose(workspace.id)}>
                        <span>进入工作台</span>
                        <ArrowRight size={23} weight="regular" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {latestDraft && (
            <section className="resume-draft" aria-label="最近的本机草稿">
              <div className="resume-draft-icon">
                <BookOpenText size={28} weight="regular" />
              </div>
              <div className="resume-draft-copy">
                <span>本机草稿 · {formatDraftTime(latestDraft.updatedAt)}</span>
                <strong>{latestDraft.projectName}</strong>
                <p>{latestDraft.workspaceName} · {latestDraft.toolTitle} · {latestDraft.result ? "结果待继续编辑或核验" : "输入内容待继续完成"}</p>
              </div>
              <div className="resume-draft-actions">
                <button className="resume-primary" type="button" onClick={() => onResumeDraft(latestDraft)}>
                  继续草稿
                  <ArrowRight size={18} />
                </button>
                <button className="resume-delete" type="button" onClick={onDrafts}>
                  <ClockCounterClockwise size={17} />
                  全部草稿
                </button>
                <button className="resume-delete" type="button" onClick={() => onDeleteDraft(latestDraft.id)}>
                  <Trash size={17} />
                  清除
                </button>
              </div>
            </section>
          )}

          <div className="trust-note">
            <ShieldCheck size={27} weight="regular" />
            <span>AI 辅助生成</span>
            <i>·</i>
            <span>人工核验</span>
            <i>·</i>
            <span>草稿仅保存在本机浏览器</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function StageNavigation({ stages, activeIndex, onChange }) {
  return (
    <div className="stage-navigation" aria-label="工作阶段">
      {stages.map((stage, index) => (
        <button
          className={index === activeIndex ? "active" : ""}
          type="button"
          key={stage.id}
          onClick={() => onChange(index)}
          aria-current={index === activeIndex ? "step" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {stage.label}
        </button>
      ))}
    </div>
  );
}

function WorkspaceOverview({ workspace, stageIndex, onStageChange, onTask, onHome, onHelp, onDrafts, onCockpit, draftCount }) {
  const stage = workspace.stages[stageIndex];
  return (
    <div className={`product-screen accent-${workspace.accent}`}>
      <div className="page-shell app-shell">
        <AppHeader onHome={onHome} workspace={workspace} onHelp={onHelp} onDrafts={onDrafts} onCockpit={onCockpit} draftCount={draftCount} />
        <main className="workspace-main">
          <button className="text-back" type="button" onClick={onHome}>
            <ArrowLeft size={18} />
            更换工作台
          </button>
          <section className="workspace-intro">
            <div>
              <p className="eyebrow">{workspace.eyebrow}</p>
              <h1>{workspace.name}</h1>
            </div>
            <p>{workspace.intro}</p>
          </section>

          <StageNavigation
            stages={workspace.stages}
            activeIndex={stageIndex}
            onChange={onStageChange}
          />

          <section className="tool-section">
            <div className="tool-heading">
              <div>
                <span>当前阶段</span>
                <h2>{stage.label}</h2>
              </div>
              <p>{stage.description}</p>
            </div>

            <div className="tool-layout">
              <div className="tool-list">
                {stage.tools.map((tool, index) => (
                  <button
                    className="tool-row"
                    type="button"
                    key={tool.id}
                    onClick={() => onTask(tool)}
                  >
                    <span className="tool-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="tool-row-copy">
                      <strong>{tool.title}</strong>
                      <small>{tool.description}</small>
                      <em>{tool.output}</em>
                    </span>
                    <span className="tool-action">
                      开始
                      <ArrowRight size={20} />
                    </span>
                  </button>
                ))}
              </div>

              <aside className="method-note">
                <BookOpenText size={29} weight="regular" />
                <h3>先结构化，再生成</h3>
                <p>
                  工具会引导你补齐背景、材料、目标和约束，再生成可核验的工作成果。
                </p>
                <div>
                  <span>01 填写</span>
                  <span>02 生成</span>
                  <span>03 核验</span>
                </div>
              </aside>
            </div>
          </section>

          <div className="privacy-strip">
            <ShieldCheck size={24} weight="regular" />
            <p>{workspace.privacy}</p>
          </div>
        </main>
      </div>
    </div>
  );
}

function TutorialProgress({ tutorial, tool, completedToolIds = [] }) {
  if (!tutorial) return null;
  const currentIndex = Math.max(0, tutorial.routeIds.indexOf(tool.id));
  const completed = new Set(completedToolIds);
  const completeCount = tutorial.routeIds.filter((toolId) => completed.has(toolId)).length;

  return (
    <section className="active-tutorial-progress" aria-label={`${tutorial.title}教程进度`}>
      <div className="active-tutorial-heading">
        <div>
          <span>正在学习</span>
          <strong>{tutorial.title}</strong>
        </div>
        <em>第 {currentIndex + 1} / {tutorial.route.length} 阶段 · 已完成 {completeCount}</em>
      </div>
      <div className="active-tutorial-route">
        {tutorial.route.map((label, index) => {
          const isCompleted = completed.has(tutorial.routeIds[index]);
          const isCurrent = index === currentIndex;
          return (
            <div className={`${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`} key={tutorial.routeIds[index]}>
              <span>{isCompleted ? <Check size={13} weight="bold" /> : index + 1}</span>
              <strong>{label}</strong>
            </div>
          );
        })}
      </div>
      <i><b style={{ width: `${(completeCount / tutorial.route.length) * 100}%` }} /></i>
    </section>
  );
}

function TaskEditor({ workspace, tool, form, setForm, projectName, onProjectNameChange, tutorial, tutorialCompletedToolIds, flowSource, draftSavedAt, isGenerating, onSaveVersion, onClear, onGenerate, onBack, onHome, onHelp, onDrafts, onCockpit, draftCount }) {
  const [showInformationWarning, setShowInformationWarning] = useState(false);
  const update = (field) => (event) => {
    setShowInformationWarning(false);
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };
  const canGenerate = form.context.trim() || form.material.trim() || form.goal.trim();
  const sourceLength = `${form.context}\n${form.material}`.replace(/\s/g, "").length;
  const informationGaps = [
    sourceLength < 30 && "再补一段背景或原始材料，说明发生了什么。",
    !form.goal.trim() && "写清楚这次希望做出的判断或行动。",
  ].filter(Boolean);

  const submitGeneration = () => {
    if (informationGaps.length > 0 && !showInformationWarning) {
      setShowInformationWarning(true);
      return;
    }
    setShowInformationWarning(false);
    onGenerate();
  };

  return (
    <div className={`product-screen accent-${workspace.accent}`}>
      <div className="page-shell app-shell">
        <AppHeader onHome={onHome} workspace={workspace} onHelp={onHelp} onDrafts={onDrafts} onCockpit={onCockpit} draftCount={draftCount} />
        <main className="task-main">
          <div className="task-topline">
            <button className="text-back" type="button" onClick={onBack}>
              <ArrowLeft size={18} />
              返回任务列表
            </button>
            <div className="step-status" aria-label="任务进度">
              <span className="active">01 输入</span>
              <i />
              <span>02 生成</span>
              <i />
              <span>03 核验</span>
            </div>
          </div>

          <section className="task-title">
            <p className="eyebrow">{workspace.name}</p>
            <label className="project-name-field">
              <span>项目名称</span>
              <input
                aria-label="项目名称"
                value={projectName}
                maxLength={48}
                onChange={(event) => onProjectNameChange(event.target.value)}
                placeholder="例如：自动周报功能"
              />
              <small>名称会贯穿后续阶段，并显示在项目驾驶舱。</small>
            </label>
            <h1>{tool.title}</h1>
            <p>{tool.description}</p>
          </section>

          <TutorialProgress tutorial={tutorial} tool={tool} completedToolIds={tutorialCompletedToolIds} />

          {flowSource && (
            <div className="flow-source-banner">
              <div className="flow-source-icon">
                <CheckCircle size={24} weight="regular" />
              </div>
              <div>
                <span>已从上一步自动带入</span>
                <strong>{flowSource.fromTitle}</strong>
                <p>事实、分析、待确认项和约束已经预填，你可以继续修改后再生成。</p>
              </div>
              <div className="flow-source-path" aria-label="工作流位置">
                <em>{flowSource.fromTitle}</em>
                <ArrowRight size={16} />
                <em>{tool.title}</em>
              </div>
            </div>
          )}

          <form
            className="task-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (canGenerate && !isGenerating) submitGeneration();
            }}
          >
            <div className="form-toolbar">
              <div>
                <span>任务输入</span>
                <small>不必写得正式，先把已知信息放进来。</small>
              </div>
              <div>
                {draftSavedAt && (
                  <span className="draft-save-status">
                    <CheckCircle size={17} weight="fill" />
                    已自动保存到本机
                  </span>
                )}
                {tool.sample && (
                  <button
                    className="quiet-button"
                    type="button"
                    onClick={() => {
                      setShowInformationWarning(false);
                      setForm(tool.sample);
                    }}
                  >
                    <Sparkle size={18} />
                    使用示例
                  </button>
                )}
                <button className="quiet-button" type="button" disabled={!canGenerate} onClick={onSaveVersion}>
                  <FloppyDisk size={18} />
                  保存版本
                </button>
                <button
                  className="quiet-button"
                  type="button"
                  onClick={onClear}
                >
                  <Trash size={18} />
                  清空
                </button>
              </div>
            </div>

            <div className="form-grid">
              <label className="field-block">
                <span>
                  背景 <b>必填其一</b>
                </span>
                <small>说明业务、产品、团队或事件的基本情况。</small>
                <textarea
                  value={form.context}
                  onChange={update("context")}
                  placeholder="例如：我们正在为小型项目团队优化周报流程……"
                />
              </label>

              <label className="field-block field-large">
                <span>
                  原始材料 <b>必填其一</b>
                </span>
                <small>粘贴访谈、会议、反馈或已匿名的数据，每条信息可以换行。</small>
                <textarea
                  value={form.material}
                  onChange={update("material")}
                  placeholder="把零散记录直接粘贴在这里……"
                />
              </label>

              <label className="field-block">
                <span>本次目标</span>
                <small>你希望这份结果帮助你做出什么判断或行动？</small>
                <textarea
                  value={form.goal}
                  onChange={update("goal")}
                  placeholder="例如：明确第一版范围并形成评审材料……"
                />
              </label>

              <label className="field-block field-large">
                <span>约束与边界</span>
                <small>补充期限、人员、预算、政策、技术或隐私限制。</small>
                <textarea
                  value={form.constraints}
                  onChange={update("constraints")}
                  placeholder="例如：两周完成，只使用匿名材料……"
                />
              </label>
            </div>

            {workspace.id === "hr" && (
              <div className="safety-notice">
                <ShieldCheck size={23} />
                <p>
                  请删除姓名、联系方式、身份证明、真实薪酬和其他可识别员工的信息。
                </p>
              </div>
            )}

            {showInformationWarning && (
              <div className="information-warning" role="status">
                <div>
                  <Info size={22} />
                  <div>
                    <strong>当前信息比较少，生成结果可能会偏泛</strong>
                    <ul>
                      {informationGaps.map((gap) => <li key={gap}>{gap}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="information-warning-actions">
                  <button type="button" onClick={() => setShowInformationWarning(false)}>继续补充</button>
                  <button type="button" onClick={() => {
                    setShowInformationWarning(false);
                    onGenerate();
                  }}>仍用现有信息生成</button>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="generation-state-card" role="status">
                <Sparkle className="generating-icon" size={21} weight="fill" />
                <div>
                  <strong>DeepSeek 正在整理材料</strong>
                  <span>页面会保留当前输入，生成完成后自动进入核验。</span>
                </div>
              </div>
            )}

            <div className="form-actions">
              <p>
                <Info size={18} />
                生成内容会明确区分事实、假设、风险和待确认项。
              </p>
              <button className="primary-button" type="submit" disabled={!canGenerate || isGenerating}>
                {isGenerating ? "DeepSeek 生成中…" : "使用 DeepSeek 生成"}
                <Sparkle className={isGenerating ? "generating-icon" : ""} size={20} />
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function ProfessionalDeliverable({ deliverable, editable, onUpdate }) {
  const updateCell = (rowIndex, cellIndex, value) => {
    const rows = deliverable.rows.map((row, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? row.map((cell, currentCellIndex) => currentCellIndex === cellIndex ? value : cell)
        : row,
    );
    onUpdate({ ...deliverable, rows });
  };

  const addRow = () => {
    onUpdate({
      ...deliverable,
      rows: [...deliverable.rows, deliverable.columns.map(() => "补充内容……")],
    });
  };

  const removeRow = (rowIndex) => {
    onUpdate({
      ...deliverable,
      rows: deliverable.rows.filter((_, currentRowIndex) => currentRowIndex !== rowIndex),
    });
  };

  return (
    <section className={`professional-deliverable ${editable ? "is-editing" : ""}`}>
      <div className="professional-deliverable-heading">
        <div>
          <span>专业交付物</span>
          <h2>{deliverable.title}</h2>
        </div>
        {editable && (
          <button type="button" onClick={addRow}>
            <Plus size={15} />
            添加一行
          </button>
        )}
      </div>
      <div className="professional-table-wrap">
        <table>
          <thead>
            <tr>
              {deliverable.columns.map((column) => <th key={column}>{column}</th>)}
              {editable && <th aria-label="行操作" />}
            </tr>
          </thead>
          <tbody>
            {deliverable.rows.map((row, rowIndex) => (
              <tr key={`deliverable-row-${rowIndex}`}>
                {deliverable.columns.map((column, cellIndex) => (
                  <td key={`${column}-${cellIndex}`}>
                    {editable ? (
                      <textarea
                        aria-label={`${column}，第 ${rowIndex + 1} 行`}
                        value={row[cellIndex] || ""}
                        onChange={(event) => updateCell(rowIndex, cellIndex, event.target.value)}
                      />
                    ) : (
                      row[cellIndex]
                    )}
                  </td>
                ))}
                {editable && (
                  <td>
                    <button
                      className="remove-deliverable-row"
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      aria-label={`删除第 ${rowIndex + 1} 行`}
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ResultList({ title, items, tone, Icon = CheckCircle, editable, onUpdate, onAdd, onRemove }) {
  return (
    <section className={`result-section ${tone ? `tone-${tone}` : ""} ${editable ? "is-editing" : ""}`}>
      <div className="result-section-heading">
        <h2>{title}</h2>
        {editable && (
          <button type="button" onClick={onAdd}>
            <Plus size={15} />
            添加一项
          </button>
        )}
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            <Icon size={19} weight="regular" />
            {editable ? (
              <>
                <textarea
                  aria-label={`${title}第 ${index + 1} 项`}
                  value={item}
                  rows={2}
                  onChange={(event) => onUpdate(index, event.target.value)}
                />
                <button
                  className="remove-result-item"
                  type="button"
                  aria-label={`删除${title}第 ${index + 1} 项`}
                  onClick={() => onRemove(index)}
                >
                  <Trash size={16} />
                </button>
              </>
            ) : (
              <span>{item}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResultView({ workspace, tool, result, resultMeta, projectName, tutorial, tutorialCompletedToolIds, transition, draftSavedAt, isGenerating, onRetry, onResultChange, onSaveVersion, onContinue, onBack, onRestart, onHome, onHelp, onDrafts, onCockpit, draftCount, notify }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const [verified, setVerified] = useState(false);
  const [editing, setEditing] = useState(false);
  const markdown = useMemo(
    () => resultToMarkdown(workspace, tool, result),
    [workspace, tool, result],
  );

  const copyResult = async () => {
    await navigator.clipboard.writeText(markdown);
    notify("结果已复制");
  };

  const downloadResult = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `FlowPilot-${tool.id}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Markdown 已下载");
  };

  const commitResult = (nextResult) => {
    onResultChange(nextResult);
    setChecks([false, false, false, false]);
    setVerified(false);
  };

  const updateSection = (section, index, value) => {
    const nextItems = result[section].map((item, itemIndex) =>
      itemIndex === index ? value : item,
    );
    commitResult({ ...result, [section]: nextItems });
  };

  const addSectionItem = (section) => {
    commitResult({ ...result, [section]: [...result[section], "补充一条内容……"] });
  };

  const removeSectionItem = (section, index) => {
    commitResult({
      ...result,
      [section]: result[section].filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const verification = [
    "已知事实与原始材料一致，没有补写不存在的信息。",
    "假设、数据缺口和不确定结论已经明确标记。",
    "负责人、日期、指标和行动范围已经补充或确认。",
    workspace.id === "hr"
      ? "已删除敏感个人信息，并由授权人员复核高影响结论。"
      : "验收标准、风险和依赖已经由相关团队确认。",
  ];
  const transitionChoices = transition?.options || (transition ? [transition] : []);
  const tutorialCurrentIndex = tutorial?.routeIds.indexOf(tool.id) ?? -1;
  const tutorialNextToolId = tutorialCurrentIndex >= 0
    ? tutorial.routeIds[tutorialCurrentIndex + 1]
    : null;

  return (
    <div className={`product-screen accent-${workspace.accent}`}>
      <div className="page-shell app-shell">
        <AppHeader onHome={onHome} workspace={workspace} onHelp={onHelp} onDrafts={onDrafts} onCockpit={onCockpit} draftCount={draftCount} />
        <main className="result-main">
          <div className="result-toolbar">
            <div className="result-toolbar-meta">
              <button className="text-back" type="button" onClick={onBack}>
                <ArrowLeft size={18} />
                修改输入
              </button>
              {draftSavedAt && (
                <span className="draft-save-status">
                  <CheckCircle size={17} weight="fill" />
                  已自动保存到本机
                </span>
              )}
            </div>
            <div>
              <button className="quiet-button" type="button" onClick={onSaveVersion}>
                <FloppyDisk size={18} />
                保存版本
              </button>
              <button
                className={`quiet-button ${editing ? "active" : ""}`}
                type="button"
                onClick={() => setEditing((current) => !current)}
              >
                {editing ? <Check size={18} /> : <PencilSimple size={18} />}
                {editing ? "完成编辑" : "编辑结果"}
              </button>
              <button className="quiet-button" type="button" onClick={copyResult}>
                <Copy size={18} />
                复制结果
              </button>
              <button className="quiet-button" type="button" onClick={downloadResult}>
                <DownloadSimple size={18} />
                下载 Markdown
              </button>
            </div>
          </div>

          <section className="result-hero">
            <div className="result-mark">
              <ListChecks size={34} weight="regular" />
            </div>
            <div>
              <span className="result-project-name">{projectName}</span>
              <p className="eyebrow">{resultMeta?.source === "deepseek" ? "DeepSeek 生成" : "本地模板"} · {editing ? "正在编辑" : "等待人工核验"}</p>
              <h1>{tool.title}</h1>
              {editing ? (
                <textarea
                  className="result-summary-editor"
                  aria-label="任务摘要"
                  value={result.summary}
                  rows={3}
                  onChange={(event) => commitResult({ ...result, summary: event.target.value })}
                />
              ) : (
                <p className="result-summary">{result.summary}</p>
              )}
              <div className={`ai-source-note ${resultMeta?.source === "deepseek" ? "is-live" : ""}`}>
                <Sparkle size={16} weight="fill" />
                <span>
                  {resultMeta?.source === "deepseek"
                    ? `由 ${resultMeta.model || "DeepSeek"} 实时生成`
                    : "实时生成失败，已保留本地模板结果"}
                </span>
                {resultMeta?.source !== "deepseek" && (
                  <button type="button" disabled={isGenerating} onClick={onRetry}>
                    {isGenerating ? "正在重试…" : "重新尝试 DeepSeek"}
                  </button>
                )}
              </div>
            </div>
          </section>

          <TutorialProgress tutorial={tutorial} tool={tool} completedToolIds={tutorialCompletedToolIds} />

          <div className="result-layout">
            <div className="result-document">
              {result.deliverable && (
                <ProfessionalDeliverable
                  deliverable={result.deliverable}
                  editable={editing}
                  onUpdate={(deliverable) => commitResult({ ...result, deliverable })}
                />
              )}
              <ResultList title="已知事实" items={result.facts} Icon={CheckCircle} editable={editing} onUpdate={(index, value) => updateSection("facts", index, value)} onAdd={() => addSectionItem("facts")} onRemove={(index) => removeSectionItem("facts", index)} />
              <ResultList title="分析结果" items={result.analysis} Icon={Sparkle} editable={editing} onUpdate={(index, value) => updateSection("analysis", index, value)} onAdd={() => addSectionItem("analysis")} onRemove={(index) => removeSectionItem("analysis", index)} />
              <ResultList
                title="假设与缺失"
                items={result.assumptions}
                tone="caution"
                Icon={Info}
                editable={editing}
                onUpdate={(index, value) => updateSection("assumptions", index, value)}
                onAdd={() => addSectionItem("assumptions")}
                onRemove={(index) => removeSectionItem("assumptions", index)}
              />
              <ResultList
                title="风险与提醒"
                items={result.risks}
                tone="risk"
                Icon={ShieldCheck}
                editable={editing}
                onUpdate={(index, value) => updateSection("risks", index, value)}
                onAdd={() => addSectionItem("risks")}
                onRemove={(index) => removeSectionItem("risks", index)}
              />
              <ResultList title="下一步" items={result.nextSteps} Icon={ArrowRight} editable={editing} onUpdate={(index, value) => updateSection("nextSteps", index, value)} onAdd={() => addSectionItem("nextSteps")} onRemove={(index) => removeSectionItem("nextSteps", index)} />
            </div>

            <aside className="verification-panel">
              <span>人工核验清单</span>
              <h2>确认后再使用</h2>
              <p>AI 只负责整理和辅助分析，最终判断仍由你负责。</p>
              <div className="check-list">
                {verification.map((item, index) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={checks[index]}
                      onChange={() =>
                        setChecks((current) => {
                          setVerified(false);
                          return current.map((value, itemIndex) =>
                            itemIndex === index ? !value : value,
                          );
                        })
                      }
                    />
                    <span className="custom-check">
                      <Check size={14} weight="bold" />
                    </span>
                    <em>{item}</em>
                  </label>
                ))}
              </div>
              <div className="verification-progress">
                <span>{checks.filter(Boolean).length} / {checks.length} 已确认</span>
                <i>
                  <b style={{ width: `${(checks.filter(Boolean).length / checks.length) * 100}%` }} />
                </i>
              </div>
              <button
                className="primary-button full-button"
                type="button"
                disabled={!checks.every(Boolean)}
                onClick={() => {
                  setVerified(true);
                  notify("核验完成，可以安全使用这份结果");
                }}
              >
                {verified ? "核验已完成" : "完成核验"}
                <CheckCircle size={20} />
              </button>
              {transitionChoices.length > 0 && (
                <div className={`flow-continuation ${verified ? "ready" : ""}`}>
                  <span>下一阶段</span>
                  <strong>{transition.label}</strong>
                  <p>{transition.description}</p>
                  <div className="flow-continuation-actions">
                    {transitionChoices.map((choice) => (
                      <button
                        className={choice.nextToolId === tutorialNextToolId ? "tutorial-recommended" : ""}
                        type="button"
                        key={choice.nextToolId}
                        disabled={!verified}
                        onClick={() => onContinue(choice)}
                      >
                        <span>
                          <b>{choice.label}</b>
                          {choice.nextToolId === tutorialNextToolId ? (
                            <small>教程下一步 · {choice.description}</small>
                          ) : transition.options && <small>{choice.description}</small>}
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button className="secondary-text-button" type="button" onClick={onRestart}>
                开始新的任务
              </button>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function getTutorialProgress(drafts, tutorial) {
  const matching = drafts.filter((draft) => draft.tutorialId === tutorial.id);
  if (!matching.length) return null;
  const projects = new Map();
  matching.forEach((draft) => {
    const projectId = draft.projectId || draft.id;
    projects.set(projectId, [...(projects.get(projectId) || []), draft]);
  });
  const projectDrafts = [...projects.values()]
    .map((items) => [...items].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
    .sort((a, b) => new Date(b[0].updatedAt) - new Date(a[0].updatedAt))[0];
  const completedToolIds = tutorial.routeIds.filter((toolId) =>
    projectDrafts.some((draft) => draft.toolId === toolId && draft.result),
  );
  const latest = projectDrafts[0];
  const currentStep = Math.max(1, tutorial.routeIds.indexOf(latest.toolId) + 1);
  return {
    latest,
    completedToolIds,
    completedCount: completedToolIds.length,
    currentStep,
    isComplete: completedToolIds.length === tutorial.routeIds.length,
  };
}

function HelpPanel({ drafts, onClose, onStartTutorial, onResumeTutorial }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="help-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="关闭">
          <X size={22} />
        </button>
        <p className="eyebrow">FlowPilot 教程</p>
        <h2 id="help-title">选择一条路线，边做边学</h2>
        <p className="tutorial-intro">案例材料已经填好。载入后按“生成、核验、继续”走完每个阶段。</p>
        <ol className="tutorial-steps">
          <li>
            <span>01</span>
            <div>
              <strong>载入案例</strong>
              <p>选择下面任意一条路线。</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>生成并核验</strong>
              <p>查看输入，再生成结构化结果。</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>继续下一阶段</strong>
              <p>确认内容后沿工作链向下推进。</p>
            </div>
          </li>
        </ol>
        <div className="tutorial-cases">
          {tutorialCases.map((tutorial) => {
            const TutorialIcon = workspaces[tutorial.workspaceId].Icon;
            const progress = getTutorialProgress(drafts, tutorial);
            return (
              <article className={`tutorial-case tutorial-${tutorial.workspaceId} ${progress ? "has-progress" : ""}`} key={tutorial.id}>
                <div className="tutorial-case-heading">
                  <span className="tutorial-case-icon">
                    <TutorialIcon size={24} weight="regular" />
                  </span>
                  <span>{workspaces[tutorial.workspaceId].name}</span>
                </div>
                <h3>{tutorial.title}</h3>
                <p>{tutorial.description}</p>
                <div className="tutorial-route" aria-label={`${tutorial.title}教程路线`}>
                  {tutorial.route.map((step, index) => (
                    <span
                      className={`${progress?.completedToolIds.includes(tutorial.routeIds[index]) ? "completed" : ""} ${progress?.latest.toolId === tutorial.routeIds[index] ? "current" : ""}`}
                      key={step}
                    >
                      {step}
                      {index < tutorial.route.length - 1 && <ArrowRight size={13} />}
                    </span>
                  ))}
                </div>
                {progress && (
                  <div className="tutorial-case-progress">
                    <span>{progress.isComplete ? "教程已完成" : `已完成 ${progress.completedCount} / ${tutorial.route.length}`}</span>
                    <i><b style={{ width: `${(progress.completedCount / tutorial.route.length) * 100}%` }} /></i>
                  </div>
                )}
                <div className="tutorial-case-actions">
                  <button type="button" onClick={() => progress ? onResumeTutorial(progress.latest) : onStartTutorial(tutorial)}>
                    {progress
                      ? progress.isComplete
                        ? "查看完成结果"
                        : `继续教程 · 第 ${progress.currentStep}/${tutorial.route.length} 阶段`
                      : "一键载入教程"}
                    <ArrowRight size={18} />
                  </button>
                  {progress && (
                    <button className="tutorial-restart-button" type="button" onClick={() => onStartTutorial(tutorial)}>
                      重新开始
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="help-note">
          <ShieldCheck size={24} />
          <p>教程会新建独立项目，不会覆盖已有草稿。生成内容仍需逐项核验。</p>
        </div>
      </section>
    </div>
  );
}

function DraftCenter({ drafts, onClose, onResume, onDelete, onNewDraft, onRestoreVersion, onDeleteVersion }) {
  const sortedDrafts = [...drafts].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="draft-center-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-center-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="关闭草稿中心">
          <X size={22} />
        </button>
        <div className="draft-center-heading">
          <p className="eyebrow">本机工作记录</p>
          <h2 id="draft-center-title">草稿与版本</h2>
          <p>每个任务可以保留多份独立草稿；版本快照用于回看和恢复关键节点。</p>
        </div>

        {sortedDrafts.length ? (
          <div className="draft-center-list">
            {sortedDrafts.map((draft) => (
              <article className="draft-card" key={draft.id}>
                <div className="draft-card-main">
                  <div className="draft-card-meta">
                    <span>{draft.workspaceName}</span>
                    <i>{formatDraftTime(draft.updatedAt)}</i>
                  </div>
                  <h3>{draft.projectName}</h3>
                  <p className="draft-card-stage">当前阶段 · {draft.toolTitle}</p>
                  <p>{draftPreview(draft)}</p>
                  <div className="draft-card-tags">
                    <span>{draft.result ? "已有生成结果" : "输入草稿"}</span>
                    <span>{draft.versions?.length || 0} 个版本</span>
                  </div>
                </div>
                <div className="draft-card-actions">
                  <button type="button" onClick={() => onResume(draft)}>
                    继续
                    <ArrowRight size={16} />
                  </button>
                  <button type="button" onClick={() => onNewDraft(draft.workspaceId, draft.toolId)}>
                    <Plus size={16} />
                    新建同类草稿
                  </button>
                  <button className="danger" type="button" onClick={() => onDelete(draft.id)}>
                    <Trash size={16} />
                    删除
                  </button>
                </div>

                <details className="version-history">
                  <summary>
                    <ClockCounterClockwise size={17} />
                    版本记录
                    <span>{draft.versions?.length || 0}</span>
                  </summary>
                  {draft.versions?.length ? (
                    <div className="version-list">
                      {draft.versions.map((version, index) => (
                        <div className="version-row" key={version.id}>
                          <div>
                            <strong>{version.label || `版本 ${draft.versions.length - index}`}</strong>
                            <span>{formatDraftTime(version.createdAt)}</span>
                          </div>
                          <p>{draftPreview(version)}</p>
                          <div>
                            <button type="button" onClick={() => onRestoreVersion(draft, version)}>
                              恢复此版本
                            </button>
                            <button type="button" onClick={() => onDeleteVersion(draft.id, version.id)}>
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-versions">还没有版本。可在输入页或结果页点击“保存版本”。</p>
                  )}
                </details>
              </article>
            ))}
          </div>
        ) : (
          <div className="draft-center-empty">
            <BookOpenText size={36} weight="regular" />
            <h3>还没有本机草稿</h3>
            <p>进入任意工作任务并开始填写，内容就会自动保存到这里。</p>
          </div>
        )}
      </section>
    </div>
  );
}

function buildProjectSummaries(drafts) {
  const groups = new Map();
  drafts.forEach((draft) => {
    const projectId = draft.projectId || draft.id;
    const current = groups.get(projectId) || [];
    current.push(draft);
    groups.set(projectId, current);
  });

  return [...groups.entries()]
    .map(([id, projectDrafts]) => {
      const ordered = [...projectDrafts].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
      const latest = ordered[0];
      const generatedStages = new Set(
        ordered.filter((draft) => draft.result).map((draft) => draft.toolId),
      );
      return {
        id,
        name: latest.projectName,
        workspaceId: latest.workspaceId,
        workspaceName: latest.workspaceName,
        projectMeta: normalizeProjectMeta(
          ordered.find((draft) => draft.projectMeta)?.projectMeta,
        ),
        latest,
        drafts: ordered,
        generatedStageCount: generatedStages.size,
        versionCount: ordered.reduce(
          (total, draft) => total + (draft.versions?.length || 0),
          0,
        ),
      };
    })
    .sort((a, b) => new Date(b.latest.updatedAt) - new Date(a.latest.updatedAt));
}

function getProjectHealth(meta, progress) {
  if (progress === 100) return { label: "工作链已完成", tone: "complete" };
  if (meta.blockers.some((item) => !item.resolved)) return { label: "存在阻塞", tone: "blocked" };
  if (meta.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${meta.dueDate}T00:00:00`);
    if (due < today) return { label: "已超过截止日", tone: "overdue" };
    if ((due - today) / 86400000 <= 7) return { label: "临近截止", tone: "warning" };
  }
  if (meta.risks.some((item) => !item.resolved && item.level === "高")) {
    return { label: "高风险待处理", tone: "warning" };
  }
  return { label: "正常推进", tone: "active" };
}

function ProjectManagementPanel({ meta, progress, onChange }) {
  const health = getProjectHealth(meta, progress);
  const completedMilestones = meta.milestones.filter((item) => item.done).length;
  const updateField = (field, value) => onChange({ ...meta, [field]: value });
  const updateItem = (collection, id, changes) => {
    onChange({
      ...meta,
      [collection]: meta[collection].map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      ),
    });
  };
  const removeItem = (collection, id) => {
    onChange({
      ...meta,
      [collection]: meta[collection].filter((item) => item.id !== id),
    });
  };
  const addItem = (collection, item) => {
    if (meta[collection].length >= 12) return;
    onChange({ ...meta, [collection]: [...meta[collection], item] });
  };

  return (
    <section className="project-management" aria-labelledby="project-management-title">
      <header className="project-management-heading">
        <div>
          <span>项目管理信息</span>
          <h3 id="project-management-title">把计划落到人、时间和问题上</h3>
        </div>
        <div className={`project-health tone-${health.tone}`}>
          <i />
          {health.label}
        </div>
      </header>

      <div className="project-management-basics">
        <label>
          <span><UsersThree size={17} />负责人</span>
          <input
            aria-label="项目负责人"
            value={meta.owner}
            maxLength={32}
            placeholder="填写负责人或角色"
            onChange={(event) => updateField("owner", event.target.value)}
          />
        </label>
        <label>
          <span><ClockCounterClockwise size={17} />截止时间</span>
          <input
            aria-label="项目截止时间"
            type="date"
            value={meta.dueDate}
            onChange={(event) => updateField("dueDate", event.target.value)}
          />
        </label>
        <div className="project-management-summary">
          <span>里程碑进度</span>
          <strong>{completedMilestones} / {meta.milestones.length}</strong>
          <i><b style={{ width: `${meta.milestones.length ? (completedMilestones / meta.milestones.length) * 100 : 0}%` }} /></i>
        </div>
      </div>

      <div className="project-management-grid">
        <section className="project-management-section milestone-section">
          <header>
            <div><span>01</span><h4>里程碑</h4></div>
            <button
              type="button"
              disabled={meta.milestones.length >= 12}
              onClick={() => addItem("milestones", {
                id: createLocalId("milestone"),
                title: "",
                dueDate: "",
                done: false,
              })}
            >
              <Plus size={15} />添加
            </button>
          </header>
          <div className="managed-item-list">
            {meta.milestones.length ? meta.milestones.map((item, index) => (
              <div className={`managed-item milestone-item ${item.done ? "is-done" : ""}`} key={item.id}>
                <input
                  className="managed-checkbox"
                  type="checkbox"
                  aria-label={`完成里程碑 ${index + 1}`}
                  checked={item.done}
                  onChange={(event) => updateItem("milestones", item.id, { done: event.target.checked })}
                />
                <input
                  aria-label={`里程碑 ${index + 1}`}
                  value={item.title}
                  maxLength={80}
                  placeholder="例如：完成方案评审"
                  onChange={(event) => updateItem("milestones", item.id, { title: event.target.value })}
                />
                <input
                  className="managed-date"
                  aria-label={`里程碑 ${index + 1} 日期`}
                  type="date"
                  value={item.dueDate}
                  onChange={(event) => updateItem("milestones", item.id, { dueDate: event.target.value })}
                />
                <button className="managed-delete" type="button" aria-label={`删除里程碑 ${index + 1}`} onClick={() => removeItem("milestones", item.id)}>
                  <Trash size={15} />
                </button>
              </div>
            )) : <p className="managed-empty">先添加关键节点，项目进度会更清楚。</p>}
          </div>
        </section>

        <section className="project-management-section blocker-section">
          <header>
            <div><span>02</span><h4>阻塞事项</h4></div>
            <button
              type="button"
              disabled={meta.blockers.length >= 12}
              onClick={() => addItem("blockers", {
                id: createLocalId("blocker"),
                text: "",
                owner: "",
                resolved: false,
              })}
            >
              <Plus size={15} />添加
            </button>
          </header>
          <div className="managed-item-list">
            {meta.blockers.length ? meta.blockers.map((item, index) => (
              <div className={`managed-item blocker-item ${item.resolved ? "is-done" : ""}`} key={item.id}>
                <input
                  className="managed-checkbox"
                  type="checkbox"
                  aria-label={`解决阻塞事项 ${index + 1}`}
                  checked={item.resolved}
                  onChange={(event) => updateItem("blockers", item.id, { resolved: event.target.checked })}
                />
                <input
                  aria-label={`阻塞事项 ${index + 1}`}
                  value={item.text}
                  maxLength={100}
                  placeholder="记录影响推进的问题"
                  onChange={(event) => updateItem("blockers", item.id, { text: event.target.value })}
                />
                <input
                  className="managed-owner"
                  aria-label={`阻塞事项 ${index + 1} 跟进人`}
                  value={item.owner}
                  maxLength={24}
                  placeholder="跟进人"
                  onChange={(event) => updateItem("blockers", item.id, { owner: event.target.value })}
                />
                <button className="managed-delete" type="button" aria-label={`删除阻塞事项 ${index + 1}`} onClick={() => removeItem("blockers", item.id)}>
                  <Trash size={15} />
                </button>
              </div>
            )) : <p className="managed-empty">当前没有阻塞，出现问题时在这里登记。</p>}
          </div>
        </section>

        <section className="project-management-section risk-section">
          <header>
            <div><span>03</span><h4>项目风险</h4></div>
            <button
              type="button"
              disabled={meta.risks.length >= 12}
              onClick={() => addItem("risks", {
                id: createLocalId("risk"),
                text: "",
                level: "中",
                resolved: false,
              })}
            >
              <Plus size={15} />添加
            </button>
          </header>
          <div className="managed-item-list">
            {meta.risks.length ? meta.risks.map((item, index) => (
              <div className={`managed-item risk-item ${item.resolved ? "is-done" : ""}`} key={item.id}>
                <input
                  className="managed-checkbox"
                  type="checkbox"
                  aria-label={`关闭项目风险 ${index + 1}`}
                  checked={item.resolved}
                  onChange={(event) => updateItem("risks", item.id, { resolved: event.target.checked })}
                />
                <input
                  aria-label={`项目风险 ${index + 1}`}
                  value={item.text}
                  maxLength={100}
                  placeholder="记录风险及可能影响"
                  onChange={(event) => updateItem("risks", item.id, { text: event.target.value })}
                />
                <select
                  aria-label={`项目风险 ${index + 1} 等级`}
                  value={item.level}
                  onChange={(event) => updateItem("risks", item.id, { level: event.target.value })}
                >
                  <option value="低">低风险</option>
                  <option value="中">中风险</option>
                  <option value="高">高风险</option>
                </select>
                <button className="managed-delete" type="button" aria-label={`删除项目风险 ${index + 1}`} onClick={() => removeItem("risks", item.id)}>
                  <Trash size={15} />
                </button>
              </div>
            )) : <p className="managed-empty">当前没有主动登记的项目风险。</p>}
          </div>
        </section>
      </div>

      <p className="project-management-note"><CheckCircle size={15} weight="fill" />修改后自动保存到本机项目，不会发送给 AI。</p>
    </section>
  );
}

function Cockpit({ drafts, onHome, onHelp, onDrafts, draftCount, onResume, onUpdateProjectMeta, notify }) {
  const projects = useMemo(() => buildProjectSummaries(drafts), [drafts]);
  const [selectedId, setSelectedId] = useState(projects[0]?.id || null);
  const selected = projects.find((project) => project.id === selectedId) || projects[0];
  const latestResult = selected?.latest.result;
  const expectedStages = 4;
  const progress = selected
    ? Math.min(100, Math.round((selected.generatedStageCount / expectedStages) * 100))
    : 0;
  const unresolvedBlockers = selected?.projectMeta.blockers.filter((item) => !item.resolved).length || 0;
  const unresolvedRisks = selected?.projectMeta.risks.filter((item) => !item.resolved).length || 0;
  const completedMilestones = selected?.projectMeta.milestones.filter((item) => item.done).length || 0;

  const exportProject = () => {
    if (!selected || selected.generatedStageCount === 0) return;
    const markdown = projectToMarkdown(selected);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeName = selected.name.replace(/[\\/:*?"<>|]/g, "-").trim() || "FlowPilot-项目";
    anchor.href = url;
    anchor.download = `${safeName}-完整项目.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("完整项目已导出");
  };

  return (
    <div className="product-screen cockpit-screen">
      <div className="page-shell app-shell">
        <AppHeader
          onHome={onHome}
          onHelp={onHelp}
          onDrafts={onDrafts}
          onCockpit={() => {}}
          draftCount={draftCount}
        />
        <main className="cockpit-main">
          <section className="cockpit-title">
            <div>
              <p className="eyebrow">FlowPilot 项目视图</p>
              <h1>项目驾驶舱</h1>
            </div>
            <p>集中查看每个项目的目标、当前阶段、行动项、风险和待确认事项。</p>
          </section>

          {selected ? (
            <div className="cockpit-layout">
              <aside className="project-switcher" aria-label="项目列表">
                <span>我的项目 · {projects.length}</span>
                {projects.map((project) => (
                  <button
                    className={project.id === selected.id ? "active" : ""}
                    type="button"
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                  >
                    <strong>{project.name}</strong>
                    <small>{project.workspaceName}</small>
                    <em>{project.latest.toolTitle}</em>
                  </button>
                ))}
              </aside>

              <section className="cockpit-dashboard">
                <header className="cockpit-project-header">
                  <div>
                    <span>{selected.workspaceName}</span>
                    <h2>{selected.name}</h2>
                    <p>当前阶段 · {selected.latest.toolTitle} · {selected.versionCount} 个版本快照</p>
                  </div>
                  <div className="cockpit-header-actions">
                    <button
                      className="cockpit-export-button"
                      type="button"
                      disabled={selected.generatedStageCount === 0}
                      onClick={exportProject}
                    >
                      <DownloadSimple size={17} />
                      导出完整项目
                    </button>
                    <button className="cockpit-continue-button" type="button" onClick={() => onResume(selected.latest)}>
                      继续当前阶段
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </header>

                <div className="cockpit-progress">
                  <div>
                    <span>工作链进度</span>
                    <strong>{progress}%</strong>
                  </div>
                  <i><b style={{ width: `${progress}%` }} /></i>
                </div>

                <div className="cockpit-metrics">
                  <div><span>已生成阶段</span><strong>{selected.generatedStageCount}</strong></div>
                  <div><span>已完成里程碑</span><strong>{completedMilestones}/{selected.projectMeta.milestones.length}</strong></div>
                  <div><span>未解决阻塞</span><strong>{unresolvedBlockers}</strong></div>
                  <div><span>登记风险</span><strong>{unresolvedRisks}</strong></div>
                </div>

                <div className="cockpit-objective">
                  <span>当前目标</span>
                  <p>{selected.latest.form?.goal || latestResult?.summary || "尚未填写项目目标。"}</p>
                </div>

                <ProjectManagementPanel
                  meta={selected.projectMeta}
                  progress={progress}
                  onChange={(nextMeta) => onUpdateProjectMeta(selected.id, nextMeta)}
                />

                <div className="cockpit-content-grid">
                  <CockpitList title="下一步行动" items={latestResult?.nextSteps} tone="action" />
                  <CockpitList title="风险与提醒" items={latestResult?.risks} tone="risk" />
                  <CockpitList title="待确认事项" items={latestResult?.assumptions} tone="pending" />
                  <section className="cockpit-card stage-history">
                    <h3>阶段记录</h3>
                    <div>
                      {selected.drafts.map((draft) => (
                        <button type="button" key={draft.id} onClick={() => onResume(draft)}>
                          <span>{draft.result ? <CheckCircle size={16} weight="fill" /> : <ClockCounterClockwise size={16} />}</span>
                          <strong>{draft.toolTitle}</strong>
                          <small>{formatDraftTime(draft.updatedAt)}</small>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            </div>
          ) : (
            <div className="cockpit-empty">
              <ListChecks size={42} weight="regular" />
              <h2>还没有可以展示的项目</h2>
              <p>进入工作台新建任务并填写项目名称，驾驶舱会自动汇总进度。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CockpitList({ title, items = [], tone }) {
  return (
    <section className={`cockpit-card tone-${tone}`}>
      <h3>{title}</h3>
      {items?.length ? (
        <ul>
          {items.slice(0, 5).map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
        </ul>
      ) : (
        <p>当前阶段还没有相关记录。</p>
      )}
    </section>
  );
}

export function App() {
  const [screen, setScreen] = useState("home");
  const [workspaceId, setWorkspaceId] = useState(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [tool, setTool] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [result, setResult] = useState(null);
  const [resultMeta, setResultMeta] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flowSource, setFlowSource] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState("");
  const [drafts, setDrafts] = useState(readDrafts);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectMeta, setProjectMeta] = useState(() => normalizeProjectMeta());
  const [tutorialId, setTutorialId] = useState(null);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);

  const workspace = workspaceId ? workspaces[workspaceId] : null;
  const latestDraft = useMemo(
    () => [...drafts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null,
    [drafts],
  );
  const activeTutorial = useMemo(
    () => tutorialCases.find((tutorial) => tutorial.id === tutorialId) || null,
    [tutorialId],
  );
  const tutorialCompletedToolIds = useMemo(() => {
    if (!activeTutorial || !activeProjectId) return [];
    const completed = new Set(
      drafts
        .filter((draft) => draft.projectId === activeProjectId && draft.result)
        .map((draft) => draft.toolId),
    );
    if (result && tool) completed.add(tool.id);
    return activeTutorial.routeIds.filter((toolId) => completed.has(toolId));
  }, [activeTutorial, activeProjectId, drafts, result, tool]);

  useEffect(() => {
    if (!workspace || !tool || !activeDraftId || !["task", "result"].includes(screen)) return undefined;
    const hasInput = Object.values(form).some((value) => value.trim());
    if (!hasInput && !result) return undefined;

    const timeout = window.setTimeout(() => {
      const updatedAt = new Date().toISOString();
      setDrafts((current) => {
        const existing = current.find((item) => item.id === activeDraftId);
        const nextDraft = {
          ...existing,
          id: activeDraftId,
          projectId: activeProjectId,
          projectName,
          projectMeta,
          tutorialId,
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          stageIndex,
          toolId: tool.id,
          toolTitle: tool.title,
          form,
          result,
          resultMeta,
          flowSource,
          versions: existing?.versions || [],
          updatedAt,
        };
        const next = [nextDraft, ...current.filter((item) => item.id !== activeDraftId)];
        writeDrafts(next);
        return next;
      });
      setDraftSavedAt(updatedAt);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [screen, workspace, stageIndex, tool, form, result, resultMeta, flowSource, activeDraftId, activeProjectId, projectName, projectMeta, tutorialId]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const deleteDraft = (id) => {
    setDrafts((current) => {
      const next = current.filter((item) => item.id !== id);
      writeDrafts(next);
      return next;
    });
    if (activeDraftId === id) setActiveDraftId(null);
    setDraftSavedAt(null);
    notify("本机草稿已清除");
  };

  const restoreDraft = (draft) => {
    const selectedWorkspace = workspaces[draft.workspaceId];
    const selected = selectedWorkspace ? findTool(selectedWorkspace, draft.toolId) : null;
    if (!selected) return;
    setWorkspaceId(selectedWorkspace.id);
    setStageIndex(selected.stageIndex);
    setTool(selected.tool);
    setActiveDraftId(draft.id);
    setActiveProjectId(draft.projectId || draft.id);
    setProjectName(draft.projectName || defaultProjectName(draft.toolTitle));
    setProjectMeta(normalizeProjectMeta(draft.projectMeta));
    setTutorialId(draft.tutorialId || null);
    setForm({ ...blankForm, ...draft.form });
    setResult(draft.result || null);
    setResultMeta(draft.resultMeta || (draft.result ? { source: "template" } : null));
    setFlowSource(draft.flowSource || null);
    setDraftSavedAt(draft.updatedAt);
    setScreen(draft.result ? "result" : "task");
    setShowDrafts(false);
    setShowHelp(false);
    notify("已恢复本机草稿");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setScreen("home");
    setWorkspaceId(null);
    setStageIndex(0);
    setTool(null);
    setResult(null);
    setResultMeta(null);
    setFlowSource(null);
    setActiveDraftId(null);
    setActiveProjectId(null);
    setProjectName("");
    setProjectMeta(normalizeProjectMeta());
    setTutorialId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseWorkspace = (id) => {
    setWorkspaceId(id);
    setStageIndex(0);
    setScreen("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCockpit = () => {
    setShowDrafts(false);
    setScreen("cockpit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNewDraft = (selectedWorkspaceId, selectedToolId) => {
    const selectedWorkspace = workspaces[selectedWorkspaceId];
    const selected = selectedWorkspace ? findTool(selectedWorkspace, selectedToolId) : null;
    if (!selected) return;
    setWorkspaceId(selectedWorkspace.id);
    setStageIndex(selected.stageIndex);
    setTool(selected.tool);
    setActiveDraftId(createLocalId("draft"));
    setActiveProjectId(createLocalId("project"));
    setProjectName(defaultProjectName(selected.tool.title));
    setProjectMeta(normalizeProjectMeta());
    setTutorialId(null);
    setForm(blankForm);
    setResult(null);
    setResultMeta(null);
    setFlowSource(null);
    setDraftSavedAt(null);
    setScreen("task");
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startTutorial = (tutorial) => {
    const selectedWorkspace = workspaces[tutorial.workspaceId];
    const selected = selectedWorkspace ? findTool(selectedWorkspace, tutorial.toolId) : null;
    if (!selected) return;
    setWorkspaceId(selectedWorkspace.id);
    setStageIndex(selected.stageIndex);
    setTool(selected.tool);
    setActiveDraftId(createLocalId("draft"));
    setActiveProjectId(createLocalId("project"));
    setProjectName(tutorial.projectName);
    setProjectMeta(materializeTutorialProjectMeta(tutorial.projectMeta));
    setTutorialId(tutorial.id);
    setForm(cloneLocalData(tutorial.form));
    setResult(null);
    setResultMeta(null);
    setFlowSource(null);
    setDraftSavedAt(null);
    setScreen("task");
    setShowHelp(false);
    setShowDrafts(false);
    notify("教程已载入，从第一步开始");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renameProject = (name) => {
    setProjectName(name);
    if (!activeProjectId) return;
    setDrafts((current) => {
      const next = current.map((draft) =>
        draft.projectId === activeProjectId ? { ...draft, projectName: name } : draft,
      );
      writeDrafts(next);
      return next;
    });
  };

  const updateProjectMeta = (projectId, nextMeta) => {
    const normalized = normalizeProjectMeta(nextMeta);
    setDrafts((current) => {
      const next = current.map((draft) =>
        draft.projectId === projectId ? { ...draft, projectMeta: normalized } : draft,
      );
      writeDrafts(next);
      return next;
    });
    if (activeProjectId === projectId) setProjectMeta(normalized);
  };

  const chooseTask = (selectedTool) => {
    const savedDraft = drafts
      .filter(
        (item) => item.workspaceId === workspace.id && item.toolId === selectedTool.id,
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    if (savedDraft) {
      restoreDraft(savedDraft);
      return;
    }
    startNewDraft(workspace.id, selectedTool.id);
  };

  const saveVersionSnapshot = (
    label = result ? "手动保存 · 结果" : "手动保存 · 输入",
    snapshotResult = result,
    snapshotMeta = resultMeta,
  ) => {
    if (!workspace || !tool || !activeDraftId) return;
    const createdAt = new Date().toISOString();
    const version = {
      id: createLocalId("version"),
      label,
      createdAt,
      form: cloneLocalData(form),
      result: cloneLocalData(snapshotResult),
      resultMeta: cloneLocalData(snapshotMeta),
      flowSource: cloneLocalData(flowSource),
    };
    setDrafts((current) => {
      const existing = current.find((item) => item.id === activeDraftId);
      const nextDraft = {
        ...existing,
        id: activeDraftId,
        projectId: activeProjectId,
        projectName,
        projectMeta,
        tutorialId,
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        stageIndex,
        toolId: tool.id,
        toolTitle: tool.title,
        form: cloneLocalData(form),
        result: cloneLocalData(snapshotResult),
        resultMeta: cloneLocalData(snapshotMeta),
        flowSource: cloneLocalData(flowSource),
        versions: [version, ...(existing?.versions || [])].slice(0, 12),
        updatedAt: createdAt,
      };
      const next = [nextDraft, ...current.filter((item) => item.id !== activeDraftId)];
      writeDrafts(next);
      return next;
    });
    setDraftSavedAt(createdAt);
    notify(`${label}已保存`);
  };

  const restoreVersion = (draft, version) => {
    const restored = {
      ...draft,
      form: cloneLocalData(version.form),
      result: cloneLocalData(version.result),
      resultMeta: cloneLocalData(version.resultMeta),
      flowSource: cloneLocalData(version.flowSource),
      updatedAt: new Date().toISOString(),
    };
    setDrafts((current) => {
      const next = [restored, ...current.filter((item) => item.id !== draft.id)];
      writeDrafts(next);
      return next;
    });
    restoreDraft(restored);
    notify("已恢复所选版本");
  };

  const deleteVersion = (draftId, versionId) => {
    setDrafts((current) => {
      const next = current.map((draft) =>
        draft.id === draftId
          ? { ...draft, versions: draft.versions.filter((version) => version.id !== versionId) }
          : draft,
      );
      writeDrafts(next);
      return next;
    });
    notify("版本记录已删除");
  };

  const generate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspace: {
            id: workspace.id,
            name: workspace.name,
            intro: workspace.intro,
          },
          project: {
            id: activeProjectId,
            name: projectName,
          },
          tool: {
            id: tool.id,
            title: tool.title,
            description: tool.description,
            output: tool.output,
          },
          form,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.result) throw new Error(data.error || "DeepSeek 生成失败");
      const generatedMeta = { source: "deepseek", model: data.model };
      setResult(data.result);
      setResultMeta(generatedMeta);
      saveVersionSnapshot("DeepSeek 生成", data.result, generatedMeta);
      notify("DeepSeek 已完成生成");
    } catch (error) {
      const fallbackResult = buildResult(workspace, tool, form);
      const fallbackMeta = { source: "template", error: error.message };
      setResult(fallbackResult);
      setResultMeta(fallbackMeta);
      saveVersionSnapshot("本地模板生成", fallbackResult, fallbackMeta);
      notify("DeepSeek 暂不可用，已使用本地模板生成");
    } finally {
      setIsGenerating(false);
      setScreen("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const continueWorkflow = (transition) => {
    const next = findTool(workspace, transition.nextToolId);
    if (!next) return;
    setStageIndex(next.stageIndex);
    setForm(buildContinuationForm(tool, next.tool, result, form));
    setFlowSource({ fromId: tool.id, fromTitle: tool.title });
    setTool(next.tool);
    setActiveDraftId(createLocalId("draft"));
    setResult(null);
    setResultMeta(null);
    setScreen("task");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let content;
  if (screen === "home") {
    content = (
      <Home
        onChoose={chooseWorkspace}
        onHelp={() => setShowHelp(true)}
        onDrafts={() => setShowDrafts(true)}
        onCockpit={openCockpit}
        draftCount={drafts.length}
        latestDraft={latestDraft}
        onResumeDraft={restoreDraft}
        onDeleteDraft={deleteDraft}
      />
    );
  } else if (screen === "cockpit") {
    content = (
      <Cockpit
        drafts={drafts}
        onHome={goHome}
        onHelp={() => setShowHelp(true)}
        onDrafts={() => setShowDrafts(true)}
        draftCount={drafts.length}
        onResume={restoreDraft}
        onUpdateProjectMeta={updateProjectMeta}
        notify={notify}
      />
    );
  } else if (screen === "workspace") {
    content = (
      <WorkspaceOverview
        workspace={workspace}
        stageIndex={stageIndex}
        onStageChange={setStageIndex}
        onTask={chooseTask}
        onHome={goHome}
        onHelp={() => setShowHelp(true)}
        onDrafts={() => setShowDrafts(true)}
        onCockpit={openCockpit}
        draftCount={drafts.length}
      />
    );
  } else if (screen === "task") {
    content = (
      <TaskEditor
        workspace={workspace}
        tool={tool}
        form={form}
        setForm={setForm}
        projectName={projectName}
        onProjectNameChange={renameProject}
        tutorial={activeTutorial}
        tutorialCompletedToolIds={tutorialCompletedToolIds}
        flowSource={flowSource}
        draftSavedAt={draftSavedAt}
        isGenerating={isGenerating}
        onSaveVersion={() => saveVersionSnapshot()}
        onClear={() => {
          if (activeDraftId) deleteDraft(activeDraftId);
          setActiveDraftId(createLocalId("draft"));
          setForm(blankForm);
        }}
        onGenerate={generate}
        onBack={() => setScreen("workspace")}
        onHome={goHome}
        onHelp={() => setShowHelp(true)}
        onDrafts={() => setShowDrafts(true)}
        onCockpit={openCockpit}
        draftCount={drafts.length}
      />
    );
  } else {
    content = (
      <ResultView
        key={tool.id}
        workspace={workspace}
        tool={tool}
        result={result}
        resultMeta={resultMeta}
        projectName={projectName}
        tutorial={activeTutorial}
        tutorialCompletedToolIds={tutorialCompletedToolIds}
        transition={workflowTransitions[tool.id]}
        draftSavedAt={draftSavedAt}
        isGenerating={isGenerating}
        onRetry={generate}
        onResultChange={setResult}
        onSaveVersion={() => saveVersionSnapshot()}
        onContinue={continueWorkflow}
        onBack={() => setScreen("task")}
        onRestart={() => startNewDraft(workspace.id, tool.id)}
        onHome={goHome}
        onHelp={() => setShowHelp(true)}
        onDrafts={() => setShowDrafts(true)}
        onCockpit={openCockpit}
        draftCount={drafts.length}
        notify={notify}
      />
    );
  }

  return (
    <>
      {content}
      {showHelp && (
        <HelpPanel
          drafts={drafts}
          onClose={() => setShowHelp(false)}
          onStartTutorial={startTutorial}
          onResumeTutorial={restoreDraft}
        />
      )}
      {showDrafts && (
        <DraftCenter
          drafts={drafts}
          onClose={() => setShowDrafts(false)}
          onResume={restoreDraft}
          onDelete={deleteDraft}
          onNewDraft={startNewDraft}
          onRestoreVersion={restoreVersion}
          onDeleteVersion={deleteVersion}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle size={20} weight="fill" />
          {toast}
        </div>
      )}
    </>
  );
}
