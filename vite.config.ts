import vinext from "vinext";
import { defineConfig, loadEnv } from "vite";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const useRemoteAiBinding = process.env.CLOUDFLARE_REMOTE_AI === "true";

export default defineConfig(async ({ command, mode }) => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";
  if (useRemoteAiBinding) {
    const localEnv = loadEnv(mode, process.cwd(), "");
    process.env.CLOUDFLARE_API_TOKEN ??=
      localEnv.CLOUDFLARE_API_TOKEN || localEnv.CLOUDFLARE_AUTH_TOKEN;
    process.env.CLOUDFLARE_ACCOUNT_ID ??= localEnv.CLOUDFLARE_ACCOUNT_ID;
  }

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  const enableAiBinding = command === "build" || useRemoteAiBinding;

  return {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        configPath: "./wrangler.jsonc",
        config: workerConfig => {
          // AI is deployed from the committed Wrangler config, but local dev
          // stays offline unless the developer explicitly opts into a remote
          // binding. Mutating the resolved config avoids a second source of
          // truth for production bindings and rate limits.
          workerConfig.ai = enableAiBinding
            ? {
                binding: "AI",
                ...(useRemoteAiBinding ? { remote: true } : {}),
              }
            : undefined;
        },
      }),
    ],
  };
});
