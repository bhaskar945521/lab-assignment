// Lab 08 - Integrated Lab Server (Local + Live)
// Department of Computer Science, Dev Sanskriti Vishwavidyalaya (DSVV)
// CS403NOD – Node.js | BCA VII Semester | Lab No.: 08
// Student: Bhaskar Mall | Scholar No: 23145005

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");
const slugify = require("slugify");

const labs = require("./labs");
const { logger, LOG_FILE } = require("./modules/logger");

const execFileAsync = promisify(execFile);

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const ENVIRONMENT = process.env.RENDER ? "live (Render)" : "local";
const STUDENT_NAME = process.env.STUDENT_NAME || "Bhaskar Mall";

// Helper: send JSON response
function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
}

// Helper: send HTML response
function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

// Helper: escape HTML entities
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getLab(id) {
  const normalizedId = String(id).padStart(2, "0");
  return labs.find((lab) => lab.id === id || lab.id === normalizedId);
}

function resolveLabFile(lab) {
  return path.resolve(ROOT, lab.file);
}

function htmlTemplate(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — DSVV Node.js Lab Server</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090e17;
      --card-bg: #0f172a;
      --card-border: #1e293b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent-cyan: #38bdf8;
      --accent-purple: #a855f7;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --code-bg: #030712;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      padding: 24px;
    }
    .wrapper {
      max-width: 1100px;
      margin: 0 auto;
    }
    header.header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 28px;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      height: 48px;
      max-width: 180px;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.25));
    }
    .brand-text h1 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.01em;
    }
    .brand-text p {
      font-size: 13px;
      color: var(--text-muted);
    }
    nav.nav-links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    nav.nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--card-border);
      transition: all 0.2s ease;
    }
    nav.nav-links a:hover {
      color: var(--accent-cyan);
      border-color: var(--accent-cyan);
      background: rgba(56, 189, 248, 0.08);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-live {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge-local {
      background: rgba(56, 189, 248, 0.15);
      color: #7dd3fc;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--text);
    }
    .labs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .lab-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.2s, transform 0.2s;
    }
    .lab-item:hover {
      border-color: var(--accent-cyan);
      transform: translateY(-2px);
    }
    .lab-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .lab-num {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--accent-cyan);
    }
    .lab-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #ffffff;
    }
    .lab-topic {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      padding: 7px 12px;
      border-radius: 7px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background: var(--accent-cyan);
      color: #041226;
    }
    .btn-outline {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    .btn-outline:hover {
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }
    pre {
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #e2e8f0;
      margin: 14px 0;
    }
    img.screenshot {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      margin: 12px 0 20px;
    }
    footer {
      text-align: center;
      padding: 30px 0;
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--card-border);
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <header class="header">
      <div class="brand-section">
        <img src="/dsvvlogo.png" alt="Dev Sanskriti Vishwavidyalaya Logo" class="brand-logo" onerror="this.style.display='none'">
        <div class="brand-text">
          <h1>CS403NOD – Lab 08: Integrated Lab Server</h1>
          <p>Dev Sanskriti Vishwavidyalaya · BCA VII Semester · ${escapeHtml(STUDENT_NAME)}</p>
        </div>
      </div>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/labs">JSON Registry (/labs)</a>
        <a href="/health">Health Check</a>
        <a href="/about">About</a>
        <a href="/api/dashboard">Dashboard API</a>
      </nav>
    </header>

    ${body}

    <footer>
      Department of Computer Science · Dev Sanskriti Vishwavidyalaya (DSVV) · Bhaskar Mall (23145005)
    </footer>
  </div>
</body>
</html>`;
}

// Handler for GET /labs/:id
async function handleLabPage(res, lab) {
  const filePath = resolveLabFile(lab);
  let source = "";

  try {
    source = await fs.promises.readFile(filePath, "utf8");
  } catch (err) {
    source = `// Error loading file: ${err.message}\n// Target path: ${lab.file}`;
  }

  let screenshots = [];
  try {
    const shotDir = path.join(ROOT, "public", "screenshots");
    const shotFiles = await fs.promises.readdir(shotDir);
    const prefix = `lab${lab.id}`;
    screenshots = shotFiles.filter(
      (name) => name.toLowerCase().startsWith(prefix.toLowerCase()) && /\.(png|jpg)$/i.test(name)
    );
  } catch (err) {
    screenshots = [];
  }

  let shotHtml = "";
  if (screenshots.length === 0) {
    shotHtml = '<p style="color:var(--text-muted); font-size:14px; margin-top:8px;">No screenshots found for this lab in public/screenshots/.</p>';
  } else {
    shotHtml = screenshots
      .map(
        (name) => `
        <div style="margin-top:14px;">
          <p style="font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">${escapeHtml(name)}</p>
          <img src="/screenshots/${encodeURIComponent(name)}" alt="${escapeHtml(name)}" class="screenshot">
        </div>`
      )
      .join("");
  }

  let runUrl = "";
  let runLabel = "";
  if (lab.type === "script") {
    runUrl = `/labs/${lab.id}/run`;
    runLabel = "Execute Script & View JSON Output";
  } else {
    runUrl = `/labs/${lab.id}/app${lab.try || "/"}`;
    runLabel = `Launch Server Route (${lab.try || "/"})`;
  }

  const body = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <span class="badge ${lab.type === "server" ? "badge-local" : "badge-live"}">
            ${lab.type.toUpperCase()} LAB
          </span>
          <h2 style="font-size:24px; margin:8px 0 4px;">Lab ${escapeHtml(lab.id)}: ${escapeHtml(lab.title)}</h2>
          <p style="color:var(--text-muted); font-size:14px;"><strong>Topic:</strong> ${escapeHtml(lab.topic)}</p>
        </div>
        <div>
          <a href="${runUrl}" target="_blank" class="btn btn-primary" style="font-size:13px; padding:10px 16px;">
            ${runLabel} &rarr;
          </a>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Source Code (${escapeHtml(path.basename(lab.file))})</h2>
      <pre><code>${escapeHtml(source)}</code></pre>
    </div>

    <div class="card">
      <h2>Output Screenshots</h2>
      ${shotHtml}
    </div>
  `;

  sendHtml(res, 200, htmlTemplate(`Lab ${lab.id} - ${lab.title}`, body));
}

// Handler for GET /labs/:id/run (Script labs)
async function handleRun(res, lab) {
  if (lab.type !== "script") {
    return send(res, 400, {
      error: "This is a server lab. Use /labs/:id/app/... instead.",
      labId: lab.id,
      tryUrl: `/labs/${lab.id}/app${lab.try || "/"}`
    });
  }

  const labFilePath = resolveLabFile(lab);

  try {
    const result = await execFileAsync(
      process.execPath,
      [labFilePath],
      { timeout: 5000, maxBuffer: 1024 * 1024 }
    );

    return send(res, 200, {
      ok: true,
      labId: lab.id,
      title: lab.title,
      file: lab.file,
      output: result.stdout,
      error: result.stderr || ""
    });
  } catch (error) {
    return send(res, 200, {
      ok: false,
      labId: lab.id,
      title: lab.title,
      file: lab.file,
      output: error.stdout || "",
      error: error.stderr || error.message
    });
  }
}

// Handler for GET /labs/:id/app/... (Server labs)
async function handleServerLab(req, res, lab, pathname) {
  if (lab.type !== "server") {
    return send(res, 400, {
      error: "This is a script lab. Use /labs/:id/run instead.",
      labId: lab.id,
      runUrl: `/labs/${lab.id}/run`
    });
  }

  const prefix = `/labs/${lab.id}/app`;
  const remainder = pathname.slice(prefix.length) || "/";
  const queryIndex = req.url.indexOf("?");
  const query = queryIndex >= 0 ? req.url.slice(queryIndex) : "";

  req.url = remainder + query;

  const labFilePath = resolveLabFile(lab);

  let handler;
  try {
    // Clear module cache to allow hot updates if modified
    delete require.cache[require.resolve(labFilePath)];
    handler = require(labFilePath);
  } catch (err) {
    return send(res, 500, {
      error: "Could not load lab handler",
      file: lab.file,
      message: err.message
    });
  }

  if (typeof handler !== "function") {
    return send(res, 500, {
      error: "Lab handler is not a function. In the old lab, export the handler function (module.exports = handler).",
      file: lab.file
    });
  }

  return handler(req, res);
}

// Main HTTP request handler
async function handler(req, res) {
  // Task 4 & 5: Emit 'request' event on logger for every request
  logger.emit("request", req.method, req.url);

  try {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // Direct logo route so template and visitors can load DSVV branding
    if (pathname === "/dsvvlogo.png" || pathname === "/dsvvlogo.ong") {
      const candidates = [
        path.join(ROOT, "public", "dsvvlogo.png"),
        path.join(ROOT, "..", "dsvvlogo.png"),
        path.join(ROOT, "..", "NodeJS-lab", "dsvvlogo.png")
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          res.writeHead(200, { "Content-Type": "image/png" });
          return fs.createReadStream(p).pipe(res);
        }
      }
    }

    if (req.method !== "GET") {
      return send(res, 405, { error: "Method not allowed. Only GET is supported." });
    }

    // GET / — Portal page (HTML)
    if (pathname === "/") {
      const isLive = Boolean(process.env.RENDER);
      const envBadge = isLive
        ? `<span class="badge badge-live">&#9679; live (Render)</span>`
        : `<span class="badge badge-local">&#9679; local</span>`;

      const labCards = labs
        .map((lab) => {
          const runUrl =
            lab.type === "script"
              ? `/labs/${lab.id}/run`
              : `/labs/${lab.id}/app${lab.try || "/"}`;
          const typeBadge =
            lab.type === "server"
              ? `<span class="badge badge-local">SERVER</span>`
              : `<span class="badge badge-live">SCRIPT</span>`;

          return `
          <div class="lab-item">
            <div>
              <div class="lab-item-header">
                <span class="lab-num">LAB ${escapeHtml(lab.id)}</span>
                ${typeBadge}
              </div>
              <h3 class="lab-title">${escapeHtml(lab.title)}</h3>
              <p class="lab-topic"><strong>Topic:</strong> ${escapeHtml(lab.topic)}</p>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <a href="/labs/${lab.id}" class="btn btn-outline" style="flex:1; text-align:center;">View Code &amp; Shots</a>
              <a href="${runUrl}" target="_blank" class="btn btn-primary" style="flex:1; text-align:center;">
                ${lab.type === "server" ? "Open Server &rarr;" : "Run Script &rarr;"}
              </a>
            </div>
          </div>`;
        })
        .join("");

      const body = `
        <div class="card" style="background:linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7)); border-color:rgba(56,189,248,0.2);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <div style="font-size:12px; color:var(--accent-cyan); font-weight:800; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">
                Node.js Lab Integration Portal
              </div>
              <h2 style="font-size:26px; margin:0 0 6px;">All Laboratory Practicals in ONE Server</h2>
              <p style="color:var(--text-muted); font-size:14px; max-width:650px;">
                Reusing existing lab assignments (Lab 01 to Lab 07) via <code>module.exports</code> and <code>child_process</code>.
                Fully compliant with Lab Assignment 08 specifications.
              </p>
            </div>
            <div style="text-align:right;">
              <div style="margin-bottom:6px;">${envBadge}</div>
              <div style="font-size:12px; color:var(--text-muted);">Uptime: <strong>${Math.floor(process.uptime())}s</strong></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h2>Integrated Practicals Registry (${labs.length} Labs)</h2>
            <a href="/labs" target="_blank" style="font-size:12px; color:var(--accent-cyan); text-decoration:none; font-weight:600;">View JSON Schema &rarr;</a>
          </div>
          <div class="labs-grid">
            ${labCards}
          </div>
        </div>

        <div class="card">
          <h2>Standard Evaluation Endpoints (Task 6 Verification)</h2>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:10px; margin-top:10px;">
            <a href="/health" target="_blank" class="btn btn-outline">GET /health</a>
            <a href="/about" target="_blank" class="btn btn-outline">GET /about</a>
            <a href="/labs" target="_blank" class="btn btn-outline">GET /labs</a>
            <a href="/api/dashboard" target="_blank" class="btn btn-outline">GET /api/dashboard</a>
            <a href="/labs/01/app/" target="_blank" class="btn btn-outline">GET /labs/01/app/</a>
            <a href="/labs/02/app/students?course=BCA" target="_blank" class="btn btn-outline">GET /labs/02/app/students?course=BCA</a>
            <a href="/labs/03/run" target="_blank" class="btn btn-outline">GET /labs/03/run</a>
            <a href="/labs/04/run" target="_blank" class="btn btn-outline">GET /labs/04/run</a>
            <a href="/labs/06/run" target="_blank" class="btn btn-outline">GET /labs/06/run</a>
            <a href="/labs/07/run" target="_blank" class="btn btn-outline">GET /labs/07/run</a>
            <a href="/labs/99" target="_blank" class="btn btn-outline" style="color:var(--accent-amber);">GET /labs/99 (404 Test)</a>
          </div>
        </div>
      `;

      return sendHtml(res, 200, htmlTemplate("Lab 08 - Integrated Lab Server", body));
    }

    // GET /about
    if (pathname === "/about") {
      return send(res, 200, {
        projectName: "Lab 08 - Integrated Lab Server",
        name: STUDENT_NAME,
        scholarNumber: "23145005",
        course: "BCA (VII Semester)",
        institution: "Dev Sanskriti Vishwavidyalaya (DSVV)",
        labs: labs.length
      });
    }

    // GET /health
    if (pathname === "/health") {
      return send(res, 200, {
        status: "ok",
        environment: ENVIRONMENT,
        uptimeSeconds: Math.floor(process.uptime())
      });
    }

    // GET /labs
    if (pathname === "/labs") {
      const labsWithSlug = labs.map((l) => ({
        ...l,
        slug: slugify(l.title, { lower: true, strict: true })
      }));
      return send(res, 200, labsWithSlug);
    }

    // Match /labs/:id or /labs/:id/run or /labs/:id/app/...
    const labMatch = pathname.match(/^\/labs\/([^/]+)(?:\/(.*))?$/);
    if (labMatch) {
      const id = labMatch[1];
      const tail = labMatch[2] || "";
      const lab = getLab(id);

      if (!lab) {
        return send(res, 404, {
          error: "Lab not found",
          id: id
        });
      }

      // GET /labs/:id
      if (!tail) {
        return handleLabPage(res, lab);
      }

      // GET /labs/:id/run
      if (tail === "run") {
        return handleRun(res, lab);
      }

      // GET /labs/:id/app/...
      if (tail === "app" || tail.startsWith("app/")) {
        return handleServerLab(req, res, lab, pathname);
      }
    }

    // GET /screenshots/<name>
    const shotMatch = pathname.match(/^\/screenshots\/(.+)$/);
    if (shotMatch) {
      const filename = path.basename(shotMatch[1]);

      if (!/\.(png|jpg|jpeg)$/i.test(filename)) {
        return send(res, 400, {
          error: "Only .png and .jpg files are allowed."
        });
      }

      const filePath = path.join(ROOT, "public", "screenshots", filename);

      try {
        await fs.promises.access(filePath);
      } catch (err) {
        return send(res, 404, {
          error: "Screenshot not found",
          name: filename
        });
      }

      res.statusCode = 200;
      res.setHeader(
        "Content-Type",
        filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg"
      );
      return fs.createReadStream(filePath).pipe(res);
    }

    // GET /api/dashboard
    if (pathname === "/api/dashboard") {
      const [logContent, shotFiles] = await Promise.all([
        fs.promises.readFile(LOG_FILE, "utf8").catch(() => ""),
        fs.promises.readdir(path.join(ROOT, "public", "screenshots")).catch(() => [])
      ]);

      const screenshots = shotFiles.filter((name) => /\.(png|jpg|jpeg)$/i.test(name));
      const requestsLogged = logContent.trim()
        ? logContent.trim().split("\n").length
        : 0;

      return send(res, 200, {
        labs: labs,
        screenshots: screenshots,
        requestsLogged: requestsLogged
      });
    }

    // 404 Route Not Found
    return send(res, 404, {
      error: "Route not found",
      path: pathname
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return send(res, 500, {
      error: "Internal Server Error",
      message: error.message
    });
  }
}

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Integrated Lab Server running on port ${PORT}`);
    console.log(`Environment: ${ENVIRONMENT}`);
  });
}

module.exports = {
  handler,
  server
};
