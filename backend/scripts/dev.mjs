import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(scriptDir, "..");
const runMode = process.argv[2];

const PORT = process.env.PORT || 5000;
if (process.platform === "win32") {
  try {
    const output = execSync(`netstat -ano | findstr :${PORT} | findstr LISTENING`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const lines = output.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== "0" && Number(pid) !== process.pid) {
        console.log(`[dev] Freeing port ${PORT} (killing old PID ${pid})...`);
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        } catch {}
      }
    }
  } catch {}
}

const command = runMode === "restart"
  ? {
      bin: "powershell",
      args: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "./scripts/restart-dev.ps1"],
    }
  : {
      bin: process.execPath,
      args: ["--watch", "server.js"],
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
