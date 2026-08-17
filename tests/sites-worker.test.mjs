import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker, { handleDeepSeekRequest } from "../worker/index.js";

const samplePayload = {
  workspace: { id: "product", name: "产品与项目管理" },
  tool: { id: "requirement-analysis", title: "需求分析" },
  form: { context: "背景", material: "材料", goal: "目标", constraints: "约束" },
};

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  let calls = 0;
  const env = {
    ASSETS: {
      fetch: async () => {
        calls += 1;
        return new Response("missing", { status: 404 });
      },
    },
  };

  const apiResponse = await worker.fetch(
    new Request("https://example.test/api/missing", {
      headers: { accept: "application/json" },
    }),
    env,
  );
  assert.equal(apiResponse.status, 404);
  assert.equal(calls, 0);

  const writeResponse = await worker.fetch(
    new Request("https://example.test/flow", {
      method: "POST",
      headers: { accept: "text/html" },
    }),
    env,
  );
  assert.equal(writeResponse.status, 404);
  assert.equal(calls, 1);
});

test("requires a server-side DeepSeek key", async () => {
  const response = await handleDeepSeekRequest(
    new Request("https://example.test/api/deepseek", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(samplePayload),
    }),
    "",
  );

  assert.equal(response.status, 503);
});

test("normalizes a structured DeepSeek response", async () => {
  let upstreamRequest;
  const response = await handleDeepSeekRequest(
    new Request("https://example.test/api/deepseek", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(samplePayload),
    }),
    "test-key",
    async (url, options) => {
      upstreamRequest = {
        url,
        headers: new Headers(options.headers),
        body: options.body,
      };
      return Response.json({
        model: "deepseek-v4-flash",
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: "完成需求判断",
                deliverable: {
                  title: "需求优先级清单",
                  columns: ["问题或需求", "用户证据", "优先级与验证"],
                  rows: [
                    ["周报整理耗时", "用户反馈每周需要一小时", "P0，补充访谈"],
                    ["延期任务不透明", "用户无法及时发现延期", "P0，验证延期识别"],
                    ["格式不统一", "项目负责人反馈格式混乱", "P1，评审统一模板"],
                  ],
                },
                facts: ["事实一"],
                analysis: ["分析一"],
                assumptions: ["假设一"],
                risks: ["风险一"],
                nextSteps: ["下一步一"],
              }),
            },
          },
        ],
        usage: { total_tokens: 123 },
      });
    },
  );

  assert.equal(response.status, 200);
  assert.equal(upstreamRequest.headers.get("authorization"), "Bearer test-key");
  const upstreamBody = JSON.parse(upstreamRequest.body);
  assert.equal(upstreamBody.response_format.type, "json_object");
  const body = await response.json();
  assert.equal(body.result.summary, "完成需求判断");
  assert.equal(body.result.deliverable.title, "需求优先级清单");
  assert.deepEqual(body.result.deliverable.columns, ["问题或需求", "用户证据", "优先级与验证"]);
  assert.equal(body.result.deliverable.rows.length, 3);
  assert.deepEqual(body.result.nextSteps, ["下一步一"]);
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
