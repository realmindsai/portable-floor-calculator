import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("serves the built calculator and its styles over HTTP", async (context) => {
  const port = 43817;
  const server = spawn(process.execPath, ["tests/static-server.mjs", "out"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  context.after(() => server.kill("SIGTERM"));

  let stderr = "";
  server.stderr.setEncoding("utf8");
  server.stderr.on("data", (chunk) => { stderr += chunk; });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Static server did not start")), 5000);
    server.stdout.setEncoding("utf8");
    server.stdout.on("data", (chunk) => {
      if (chunk.includes("ready")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.once("exit", (code) => reject(new Error(`Static server exited with ${code}: ${stderr}`)));
  });

  const page = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type") ?? "", /^text\/html/);
  const html = await page.text();
  assert.match(html, /15(?:<!-- -->)? total panels/);

  const stylesheetPath = html.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];
  assert.ok(stylesheetPath, "The page links its production stylesheet");
  const stylesheet = await fetch(`http://127.0.0.1:${port}${stylesheetPath}`);
  assert.equal(stylesheet.status, 200);
  assert.match(stylesheet.headers.get("content-type") ?? "", /^text\/css/);

  assert.equal(stderr, "");
});
