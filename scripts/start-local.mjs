// `npm run start-local[:fe|:fe-v2|:card]`: an example against abap2UI5 in
// Node, in one command - the backend of scripts/backend.mjs on port 3000,
// unless one answers there already (`npm run backend` in another terminal,
// or `npm run express` in an abap2UI5 checkout), then the example's own
// `npm run start-local` (ui5 serve with ui5-local.yaml).
import { spawn } from "node:child_process";
import { PORT, startBackend } from "./backend.mjs";

const workspace = process.argv[2] ?? "freestyle";

async function backendAnswers() {
  try {
    const res = await fetch(
      `http://localhost:${PORT}/sap/bc/z2ui5?z2ui5-bundle`,
    );
    return res.ok;
  } catch {
    return false;
  }
}

if (await backendAnswers()) {
  console.log(
    `abap2UI5 backend on http://localhost:${PORT} already running - using it`,
  );
} else {
  await startBackend();
  console.log(`abap2UI5 backend started on http://localhost:${PORT}`);
}

const ui5 = spawn("npm", ["run", "start-local", "--workspace", workspace], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
ui5.on("exit", (code) => process.exit(code ?? 0));
