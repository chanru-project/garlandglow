import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDir, "..");
const runMode = process.argv[2];

const command = runMode === "restart"
  ? {
      bin: "powershell",
      args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "./scripts/restart-dev.ps1"],
    }
  : {
      bin: process.execPath,
      args: ["server.js"],
    };

const child = spawn(command.bin, command.args, {
  cwd: backendRoot,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start backend dev command:", error.message);
  process.exit(1);
});
