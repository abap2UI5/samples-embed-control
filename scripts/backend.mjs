// `npm run backend`: abap2UI5 on http://localhost:3000, transpiled to
// JavaScript and run in Node (@abap2ui5/node-runtime) - the backend
// ui5-local.yaml of every example proxies /sap/** to, and the one the e2e
// tests expect. `npm run start-local` starts it on its own.
//
// In a GitHub Codespace the port forwarding rewrites Origin and
// X-Forwarded-Host on the way in, and abap2UI5's CSRF check, which compares
// the two, rejects every roundtrip with a 403 ("cross-origin request
// rejected"). There - and only there - the headers that check reads are
// dropped before abap2UI5 sees them: the check allows a request with nothing
// to compare. A codespace's ports are private to its owner unless made
// public. Everywhere else the server is serve()'s: the host guard in front,
// Origin and X-Forwarded-Host as the proxy sends them.
import http from "node:http";
import { pathToFileURL } from "node:url";
import {
  createApp,
  hostGuard,
  initialize,
  serve,
} from "@abap2ui5/node-runtime";

export const PORT = 3000;

const CODESPACE_HEADERS = ["origin", "referer", "x-forwarded-host"];

export async function startBackend({ port = PORT } = {}) {
  if (process.env.CODESPACES !== "true") return serve({ port });
  const app = await createApp();
  await initialize();
  const guard = hostGuard();
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      for (const header of CODESPACE_HEADERS) delete req.headers[header];
      guard(req, res, () => app(req, res));
    });
    server.once("error", reject);
    server.listen(port, () => {
      server.off("error", reject);
      resolve(server);
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startBackend();
  const where =
    process.env.CODESPACES === "true"
      ? " (codespace: CSRF headers dropped)"
      : "";
  console.log(`abap2UI5 backend on http://localhost:${PORT}${where}`);
}
