function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function formatExportTime(value) {
  if (!value) return "未记录";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function markdownListSection(title, items, heading = "##") {
  return `${heading} ${title}\n${items.map((item) => `- ${item}`).join("\n")}`;
}

export function deliverableToMarkdown(deliverable, heading = "##") {
  if (!deliverable) return "";
  return `${heading} ${deliverable.title}\n\n| ${deliverable.columns.map(escapeCell).join(" | ")} |\n| ${deliverable.columns.map(() => "---").join(" | ")} |\n${deliverable.rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`).join("\n")}`;
}

export function resultToMarkdown(workspace, tool, result) {
  const deliverable = deliverableToMarkdown(result.deliverable);
  return `# ${tool.title}\n\n> ${workspace.name} · FlowPilot AI\n\n## 任务摘要\n${result.summary}\n\n${deliverable}${deliverable ? "\n\n" : ""}${markdownListSection("已知事实", result.facts)}\n\n${markdownListSection("分析结果", result.analysis)}\n\n${markdownListSection("假设与缺失", result.assumptions)}\n\n${markdownListSection("风险与提醒", result.risks)}\n\n${markdownListSection("下一步", result.nextSteps)}\n\n---\nAI 辅助生成，请完成人工核验后使用。`;
}

function projectManagementToMarkdown(meta = {}) {
  const milestones = Array.isArray(meta.milestones) ? meta.milestones : [];
  const blockers = Array.isArray(meta.blockers) ? meta.blockers : [];
  const risks = Array.isArray(meta.risks) ? meta.risks : [];
  const milestoneLines = milestones.length
    ? milestones.map((item) => `- [${item.done ? "x" : " "}] ${item.title || "未命名里程碑"}${item.dueDate ? `（${item.dueDate}）` : ""}`)
    : ["- 暂无里程碑"];
  const blockerLines = blockers.length
    ? blockers.map((item) => `- ${item.resolved ? "已解决" : "待解决"}：${item.text || "未填写内容"}${item.owner ? `（跟进人：${item.owner}）` : ""}`)
    : ["- 暂无阻塞事项"];
  const riskLines = risks.length
    ? risks.map((item) => `- ${item.resolved ? "已关闭" : "待处理"} · ${item.level || "中"}风险：${item.text || "未填写内容"}`)
    : ["- 暂无主动登记风险"];

  return `## 项目管理信息\n\n- 负责人：${meta.owner || "待确认"}\n- 截止时间：${meta.dueDate || "待确认"}\n\n### 里程碑\n${milestoneLines.join("\n")}\n\n### 阻塞事项\n${blockerLines.join("\n")}\n\n### 项目风险\n${riskLines.join("\n")}`;
}

export function projectToMarkdown(project) {
  const stages = project.drafts
    .filter((draft) => draft.result)
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  const stageContent = stages.map((draft, index) => {
    const result = draft.result;
    const deliverable = deliverableToMarkdown(result.deliverable, "###");
    return `## ${index + 1}. ${draft.toolTitle}\n\n> 更新时间：${formatExportTime(draft.updatedAt)}\n\n### 阶段摘要\n${result.summary}\n\n${deliverable}${deliverable ? "\n\n" : ""}${markdownListSection("已知事实", result.facts, "###")}\n\n${markdownListSection("分析结果", result.analysis, "###")}\n\n${markdownListSection("假设与缺失", result.assumptions, "###")}\n\n${markdownListSection("风险与提醒", result.risks, "###")}\n\n${markdownListSection("下一步", result.nextSteps, "###")}`;
  });
  const currentGoal = project.latest.form?.goal || project.latest.result?.summary || "尚未填写项目目标。";

  return `# ${project.name}\n\n> ${project.workspaceName} · FlowPilot AI 完整项目记录\n\n## 项目概览\n\n- 当前阶段：${project.latest.toolTitle}\n- 已生成阶段：${project.generatedStageCount}\n- 版本快照：${project.versionCount}\n- 当前目标：${currentGoal}\n\n${projectManagementToMarkdown(project.projectMeta)}\n\n---\n\n${stageContent.join("\n\n---\n\n")}\n\n---\n本文件由 FlowPilot AI 汇总。AI 生成内容仅供辅助，事实、指标和高影响结论仍需人工核验。`;
}
