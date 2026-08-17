import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleDeepSeekRequest } from "./worker/index.js";

function deepSeekDevApi(apiKey, model) {
  return {
    name: "flowpilot-deepseek-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/deepseek", async (request, response) => {
        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const webRequest = new Request("http://localhost/api/deepseek", {
            method: request.method,
            headers: {
              "content-type": request.headers["content-type"] || "application/json",
            },
            body: ["GET", "HEAD"].includes(request.method)
              ? undefined
              : Buffer.concat(chunks),
          });
          const webResponse = await handleDeepSeekRequest(
            webRequest,
            apiKey,
            fetch,
            model,
          );
          response.statusCode = webResponse.status;
          webResponse.headers.forEach((value, key) => response.setHeader(key, value));
          response.end(Buffer.from(await webResponse.arrayBuffer()));
        } catch {
          response.statusCode = 500;
          response.setHeader("content-type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "本地代理处理请求失败。" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      outDir: "dist/client",
    },
    optimizeDeps: {
      include: ["react", "react-dom/client"],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      warmup: {
        clientFiles: ["./src/main.jsx"],
      },
    },
    plugins: [deepSeekDevApi(env.DEEPSEEK_API_KEY, env.DEEPSEEK_MODEL), react()],
  };
});
