import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function start() {
  const child = spawn(process.execPath, [join(rootDir, "server.js")], {
    stdio: "inherit",
    cwd: rootDir,
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.log(`[backend] server exited with code ${code}`);
    }
  });
}

start();
