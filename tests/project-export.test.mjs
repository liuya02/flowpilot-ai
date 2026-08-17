import assert from "node:assert/strict";
import test from "node:test";
import { projectToMarkdown } from "../src/markdown.js";

const result = (summary, title) => ({
  summary,
  deliverable: {
    title,
    columns: ["交付项", "当前结论", "验证或行动"],
    rows: [["第一项", "已形成结论", "由负责人确认"]],
  },
  facts: ["事实一"],
  analysis: ["分析一"],
  assumptions: ["假设一"],
  risks: ["风险一"],
  nextSteps: ["下一步一"],
});

test("exports every generated project stage in chronological order", () => {
  const markdown = projectToMarkdown({
    name: "自动周报功能",
    workspaceName: "产品与项目管理",
    generatedStageCount: 2,
    versionCount: 4,
    projectMeta: {
      owner: "产品负责人",
      dueDate: "2026-09-01",
      milestones: [
        { title: "完成需求评审", dueDate: "2026-08-20", done: true },
        { title: "完成 MVP 上线", dueDate: "2026-09-01", done: false },
      ],
      blockers: [
        { text: "权限范围待确认", owner: "项目负责人", resolved: false },
      ],
      risks: [
        { text: "交付周期较紧", level: "高", resolved: false },
      ],
    },
    latest: {
      toolTitle: "PRD 生成器",
      form: { goal: "完成 MVP 方案评审" },
      result: result("PRD 摘要", "产品需求文档（PRD）"),
    },
    drafts: [
      {
        toolTitle: "PRD 生成器",
        updatedAt: "2026-08-17T02:00:00.000Z",
        result: result("PRD 摘要", "产品需求文档（PRD）"),
      },
      {
        toolTitle: "需求分析",
        updatedAt: "2026-08-17T01:00:00.000Z",
        result: result("需求摘要", "需求优先级清单"),
      },
      {
        toolTitle: "任务拆解",
        updatedAt: "2026-08-17T03:00:00.000Z",
        result: null,
      },
    ],
  });

  assert.match(markdown, /^# 自动周报功能/);
  assert.match(markdown, /当前阶段：PRD 生成器/);
  assert.match(markdown, /已生成阶段：2/);
  assert.match(markdown, /## 项目管理信息/);
  assert.match(markdown, /负责人：产品负责人/);
  assert.match(markdown, /- \[x\] 完成需求评审（2026-08-20）/);
  assert.match(markdown, /待解决：权限范围待确认（跟进人：项目负责人）/);
  assert.match(markdown, /待处理 · 高风险：交付周期较紧/);
  assert.ok(markdown.indexOf("## 1. 需求分析") < markdown.indexOf("## 2. PRD 生成器"));
  assert.match(markdown, /### 需求优先级清单/);
  assert.match(markdown, /### 产品需求文档（PRD）/);
  assert.match(markdown, /\| 交付项 \| 当前结论 \| 验证或行动 \|/);
  assert.match(markdown, /### 风险与提醒\n- 风险一/);
  assert.doesNotMatch(markdown, /## 3\. 任务拆解/);
});
